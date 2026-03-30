// lib/simulation/engine.ts
// ============================================================
// STRATIQ – Scenario Simulation Engine
// Structured weighted scoring + risk analysis
// ============================================================

import {
  Decision,
  DecisionOption,
  Variable,
  VariableScore,
  SimulationOutput,
  OptionScore,
  RiskSummary,
  RiskLevel,
  RiskFactor,
  RiskMatrixCell,
  VariableBreakdown,
} from '@/types'

// ── Risk Level Classification ─────────────────────────────
function classifyRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'low'
  if (score < 50) return 'medium'
  if (score < 75) return 'high'
  return 'critical'
}

// ── Normalise Weights ─────────────────────────────────────
function normaliseWeights(variables: Variable[]): Map<string, number> {
  const totalWeight = variables.reduce((sum, v) => sum + v.weight, 0)
  const normalised = new Map<string, number>()

  variables.forEach(v => {
    normalised.set(v.id, totalWeight > 0 ? v.weight / totalWeight : 1 / variables.length)
  })

  return normalised
}

// ── Calculate Weighted Score for Option ───────────────────
function calculateOptionScore(
  option: DecisionOption,
  variables: Variable[],
  variableScores: VariableScore[],
  normalisedWeights: Map<string, number>
): { weightedScore: number; breakdown: VariableBreakdown[] } {
  const breakdown: VariableBreakdown[] = []
  let totalWeightedScore = 0

  variables.forEach(variable => {
    const score = variableScores.find(
      vs => vs.option_id === option.id && vs.variable_id === variable.id
    )
    const rawScore = score ? Math.max(0, Math.min(10, score.score)) : 5 // Default midpoint
    const weight = normalisedWeights.get(variable.id) || 0
    const weightedContribution = rawScore * weight * 10 // Scale to 0-100

    breakdown.push({
      variable_id: variable.id,
      variable_name: variable.name,
      weight: variable.weight,
      raw_score: rawScore,
      weighted_contribution: Math.round(weightedContribution * 100) / 100,
    })

    totalWeightedScore += weightedContribution
  })

  return {
    weightedScore: Math.round(totalWeightedScore * 10) / 10,
    breakdown,
  }
}

// ── Calculate Risk Score ──────────────────────────────────
function calculateRiskScore(
  option: DecisionOption,
  variables: Variable[],
  variableScores: VariableScore[]
): number {
  const riskVariables = variables.filter(v => v.variable_type === 'risk')

  if (riskVariables.length === 0) {
    // Infer risk from inverse of scores on all variables
    const allScores = variableScores.filter(vs => vs.option_id === option.id)
    if (allScores.length === 0) return 50
    const avgScore = allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length
    return Math.round((10 - avgScore) * 10) // Invert: lower scores = higher risk
  }

  const riskScores = riskVariables.map(v => {
    const score = variableScores.find(vs => vs.option_id === option.id && vs.variable_id === v.id)
    return score ? score.score : 5
  })

  const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length
  return Math.round(avgRisk * 10)
}

// ── Calculate Expected Value ──────────────────────────────
function calculateExpectedValue(
  weightedScore: number,
  riskScore: number
): number {
  // EV = Weighted Score * (1 - Risk Discount)
  const riskDiscount = riskScore / 200 // Max 50% discount at max risk
  return Math.round(weightedScore * (1 - riskDiscount) * 10) / 10
}

// ── Calculate Confidence Band ─────────────────────────────
function calculateConfidenceBand(
  weightedScore: number,
  riskScore: number,
  numVariables: number
): { low: number; high: number } {
  // More variables = tighter confidence band (more data)
  const uncertainty = (riskScore / 100) * (30 / Math.max(numVariables, 3))

  return {
    low: Math.max(0, Math.round((weightedScore - uncertainty * weightedScore) * 10) / 10),
    high: Math.min(100, Math.round((weightedScore + uncertainty * weightedScore) * 10) / 10),
  }
}

// ── Generate Risk Factors ─────────────────────────────────
function generateRiskFactors(
  option: DecisionOption,
  variables: Variable[],
  variableScores: VariableScore[]
): RiskFactor[] {
  const factors: RiskFactor[] = []

  variables.forEach(variable => {
    const score = variableScores.find(
      vs => vs.option_id === option.id && vs.variable_id === variable.id
    )
    const rawScore = score?.score ?? 5

    if (rawScore <= 3) {
      const probability = (4 - rawScore) / 4
      factors.push({
        factor: `Low ${variable.name} performance`,
        severity: rawScore <= 1 ? 'critical' : rawScore <= 2 ? 'high' : 'medium',
        probability,
        impact_description: `${variable.name} scored ${rawScore}/10, indicating ${rawScore <= 2 ? 'significant' : 'moderate'} downside exposure.`,
      })
    }
  })

  return factors.sort((a, b) => b.probability - a.probability).slice(0, 5)
}

// ── Build Risk Matrix ─────────────────────────────────────
function buildRiskMatrix(
  options: DecisionOption[],
  optionRiskScores: Map<string, number>
): RiskMatrixCell[] {
  return options.map(option => {
    const riskScore = optionRiskScores.get(option.id) || 50
    return {
      option_id: option.id,
      option_label: option.label,
      probability: Math.round((riskScore / 100) * 100) / 100,
      impact: Math.round((1 - riskScore / 100) * 100) / 100, // Higher risk = lower expected impact
    }
  })
}

// ── Generate Executive Summary ────────────────────────────
function generateExecutiveSummary(
  optionScores: OptionScore[],
  decision: Decision
): string {
  const top = optionScores[0]
  const second = optionScores[1]

  const scoreDiff = second ? Math.round(top.weighted_score - second.weighted_score) : null

  let summary = `Analysis of ${optionScores.length} options across ${decision.variables?.length || 0} weighted variables for "${decision.title}" has been completed. `

  summary += `Option "${top.option_label}" achieves the highest weighted score of ${top.weighted_score.toFixed(1)}/100`

  if (scoreDiff !== null && scoreDiff > 0) {
    summary += `, outperforming the next alternative by ${scoreDiff} points`
  }

  summary += `. `

  summary += `Risk classification: ${top.risk_level.toUpperCase()}. `
  summary += `Confidence score: ${top.weighted_score.toFixed(0)}% with an expected value of ${top.expected_value.toFixed(1)}.`

  if (top.risk_level === 'high' || top.risk_level === 'critical') {
    summary += ` Note: Elevated risk indicators suggest thorough due diligence is warranted before proceeding.`
  }

  return summary
}

// ── Calculate Overall Confidence ─────────────────────────
function calculateOverallConfidence(
  optionScores: OptionScore[],
  numVariables: number
): number {
  if (optionScores.length < 2) return 70

  const topScore = optionScores[0].weighted_score
  const secondScore = optionScores[1].weighted_score
  const separation = topScore - secondScore

  // More separation = more confidence
  const separationFactor = Math.min(separation / topScore, 0.5) * 100
  // More variables = more confidence
  const variableFactor = Math.min(numVariables / 10, 1) * 20
  // Base confidence
  const base = 50

  return Math.min(98, Math.round(base + separationFactor + variableFactor))
}

// ── Main Simulation Function ──────────────────────────────
export function runSimulation(
  decision: Decision,
  options: DecisionOption[],
  variables: Variable[],
  allVariableScores: VariableScore[]
): SimulationOutput {
  const startTime = Date.now()

  if (options.length === 0) {
    throw new Error('At least one option is required to run a simulation.')
  }

  if (variables.length === 0) {
    throw new Error('At least one variable is required to run a simulation.')
  }

  const normalisedWeights = normaliseWeights(variables)
  const optionRiskScores = new Map<string, number>()
  const optionScoresList: OptionScore[] = []

  // Calculate scores for each option
  options.forEach(option => {
    const optionScores = allVariableScores.filter(vs => vs.option_id === option.id)
    const { weightedScore, breakdown } = calculateOptionScore(option, variables, optionScores, normalisedWeights)
    const riskScore = calculateRiskScore(option, variables, optionScores)
    const expectedValue = calculateExpectedValue(weightedScore, riskScore)
    const confidenceBand = calculateConfidenceBand(weightedScore, riskScore, variables.length)
    const riskLevel = classifyRiskLevel(riskScore)

    optionRiskScores.set(option.id, riskScore)

    optionScoresList.push({
      option_id: option.id,
      option_label: option.label,
      weighted_score: weightedScore,
      expected_value: expectedValue,
      risk_score: riskScore,
      risk_level: riskLevel,
      confidence_band: confidenceBand,
      variable_breakdown: breakdown,
    })
  })

  // Sort by weighted score descending
  optionScoresList.sort((a, b) => b.weighted_score - a.weighted_score)
  const recommendedOption = optionScoresList[0]

  // Risk analysis
  const riskFactors = generateRiskFactors(
    options.find(o => o.id === recommendedOption.option_id)!,
    variables,
    allVariableScores
  )

  const overallRiskLevel = classifyRiskLevel(recommendedOption.risk_score)

  const riskSummary: RiskSummary = {
    overall_risk_level: overallRiskLevel,
    risk_factors: riskFactors,
    risk_matrix: buildRiskMatrix(options, optionRiskScores),
  }

  const executiveSummary = generateExecutiveSummary(optionScoresList, decision)
  const confidenceScore = calculateOverallConfidence(optionScoresList, variables.length)

  const totalWeight = variables.reduce((sum, v) => sum + v.weight, 0)

  return {
    option_scores: optionScoresList,
    recommended_option_id: recommendedOption.option_id,
    confidence_score: confidenceScore,
    risk_summary: riskSummary,
    executive_summary: executiveSummary,
    methodology_notes: `Simulation used weighted scoring across ${variables.length} variable${variables.length !== 1 ? 's' : ''} with ${totalWeight > 0 ? 'normalised relative weights' : 'equal weighting'}. Risk scores derived from ${variables.filter(v => v.variable_type === 'risk').length > 0 ? 'dedicated risk variables' : 'inverse performance scoring'}. Expected values incorporate a risk discount factor.`,
    simulation_metadata: {
      variables_used: variables.length,
      options_compared: options.length,
      total_weight: totalWeight,
      weight_normalised: totalWeight !== 100,
      simulation_duration_ms: Date.now() - startTime,
    },
  }
}
