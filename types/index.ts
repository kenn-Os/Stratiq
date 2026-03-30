// ============================================================
// STRATIQ – Core TypeScript Types
// ============================================================

// ── User & Auth ──────────────────────────────────────────
export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type SubscriptionTier = 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
export type BillingInterval = 'monthly' | 'annual'

export interface Subscription {
  id: string
  user_id: string
  flw_subscription_id: string
  flw_customer_id: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  billing_interval: BillingInterval
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// ── Decisions ────────────────────────────────────────────
export type DecisionStatus = 'draft' | 'in_progress' | 'simulated' | 'decided' | 'archived'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Decision {
  id: string
  user_id: string
  title: string
  description: string | null
  context: string | null
  status: DecisionStatus
  deadline: string | null
  tags: string[]
  created_at: string
  updated_at: string
  // Joined
  options?: DecisionOption[]
  variables?: Variable[]
  simulation_results?: SimulationResult[]
}

export interface DecisionOption {
  id: string
  decision_id: string
  label: string
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
  // Joined
  variable_scores?: VariableScore[]
}

export interface Variable {
  id: string
  decision_id: string
  name: string
  description: string | null
  weight: number          // 0–100
  unit: string | null
  variable_type: VariableType
  order_index: number
  created_at: string
  updated_at: string
}

export type VariableType = 'financial' | 'risk' | 'time' | 'strategic' | 'operational' | 'custom'

export interface VariableScore {
  id: string
  option_id: string
  variable_id: string
  score: number           // 0–10 normalised score
  raw_value: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ── Simulation ───────────────────────────────────────────
export interface SimulationResult {
  id: string
  decision_id: string
  user_id: string
  simulation_version: number
  results: SimulationOutput
  created_at: string
}

export interface SimulationOutput {
  option_scores: OptionScore[]
  recommended_option_id: string
  confidence_score: number          // 0–100
  risk_summary: RiskSummary
  executive_summary: string
  methodology_notes: string
  simulation_metadata: SimulationMetadata
}

export interface OptionScore {
  option_id: string
  option_label: string
  weighted_score: number            // 0–100
  expected_value: number
  risk_score: number                // 0–100 (higher = more risky)
  risk_level: RiskLevel
  confidence_band: { low: number; high: number }
  variable_breakdown: VariableBreakdown[]
}

export interface VariableBreakdown {
  variable_id: string
  variable_name: string
  weight: number
  raw_score: number
  weighted_contribution: number
}

export interface RiskSummary {
  overall_risk_level: RiskLevel
  risk_factors: RiskFactor[]
  risk_matrix: RiskMatrixCell[]
}

export interface RiskFactor {
  factor: string
  severity: RiskLevel
  probability: number     // 0–1
  impact_description: string
}

export interface RiskMatrixCell {
  option_id: string
  option_label: string
  probability: number
  impact: number
}

export interface SimulationMetadata {
  variables_used: number
  options_compared: number
  total_weight: number
  weight_normalised: boolean
  simulation_duration_ms: number
}

// ── Reports ──────────────────────────────────────────────
export interface Report {
  id: string
  decision_id: string
  user_id: string
  simulation_result_id: string
  title: string
  storage_path: string | null
  generated_at: string
}

// ── Team ─────────────────────────────────────────────────
export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  email: string
  full_name: string | null
  role: TeamRole
  invited_at: string
  joined_at: string | null
  status: 'pending' | 'active' | 'removed'
}

// ── UI State ─────────────────────────────────────────────
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

// ── API Responses ────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface SimulationRequest {
  decision_id: string
}

export interface CheckoutSessionRequest {
  plan_id: string
  tier: SubscriptionTier
  billing_interval: BillingInterval
}
