import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSimulation } from '@/lib/simulation/engine'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const { decision_id } = body

    if (!decision_id) {
      return NextResponse.json({ error: 'decision_id is required' }, { status: 400 })
    }

    // Fetch decision with options, variables, and scores
    const { data: decision } = await supabase
      .from('decisions')
      .select('*')
      .eq('id', decision_id)
      .eq('user_id', user.id)
      .single()

    if (!decision) {
      return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
    }

    const { data: options } = await supabase
      .from('decision_options')
      .select('*')
      .eq('decision_id', decision_id)
      .order('order_index')

    const { data: variables } = await supabase
      .from('variables')
      .select('*')
      .eq('decision_id', decision_id)
      .order('order_index')

    const { data: allScores } = await supabase
      .from('variable_scores')
      .select('*')
      .in('option_id', options?.map(o => o.id) || [])

    if (!options || options.length === 0) {
      return NextResponse.json({ error: 'No options found. Add at least one option before simulating.' }, { status: 400 })
    }

    if (!variables || variables.length === 0) {
      return NextResponse.json({ error: 'No variables found. Add at least one variable before simulating.' }, { status: 400 })
    }

    // Run simulation
    const simulationOutput = runSimulation(
      decision,
      options,
      variables,
      allScores || []
    )

    // Get current simulation version
    const { count } = await supabase
      .from('simulation_results')
      .select('*', { count: 'exact', head: true })
      .eq('decision_id', decision_id)

    // Save results
    const { data: savedResult, error: saveError } = await supabase
      .from('simulation_results')
      .insert({
        decision_id,
        user_id: user.id,
        simulation_version: (count || 0) + 1,
        results: simulationOutput,
      })
      .select()
      .single()

    if (saveError) throw saveError

    // Update decision status
    await supabase
      .from('decisions')
      .update({ status: 'simulated', updated_at: new Date().toISOString() })
      .eq('id', decision_id)

    return NextResponse.json({
      success: true,
      result_id: savedResult.id,
      confidence_score: simulationOutput.confidence_score,
      recommended_option_id: simulationOutput.recommended_option_id,
      executive_summary: simulationOutput.executive_summary,
    })
  } catch (error: unknown) {
    console.error('[Simulate API Error]', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
