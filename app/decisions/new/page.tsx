'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, AlertCircle, ChevronDown, ChevronUp, Save, ArrowRight } from 'lucide-react'
import TopBar from '@/components/dashboard/TopBar'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils'
import type { VariableType } from '@/types'

interface OptionForm {
  id: string
  label: string
  description: string
}

interface VariableForm {
  id: string
  name: string
  description: string
  weight: number
  variable_type: VariableType
  unit: string
}

const VARIABLE_TYPES: { value: VariableType; label: string }[] = [
  { value: 'financial', label: 'Financial' },
  { value: 'risk', label: 'Risk' },
  { value: 'time', label: 'Time' },
  { value: 'strategic', label: 'Strategic' },
  { value: 'operational', label: 'Operational' },
  { value: 'custom', label: 'Custom' },
]

const genId = () => Math.random().toString(36).slice(2, 9)

export default function NewDecisionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [context, setContext] = useState('')
  const [options, setOptions] = useState<OptionForm[]>([
    { id: genId(), label: 'Option A', description: '' },
    { id: genId(), label: 'Option B', description: '' },
  ])
  const [variables, setVariables] = useState<VariableForm[]>([
    { id: genId(), name: 'Financial Impact', description: '', weight: 30, variable_type: 'financial', unit: '' },
    { id: genId(), name: 'Risk Level', description: '', weight: 25, variable_type: 'risk', unit: '' },
    { id: genId(), name: 'Strategic Fit', description: '', weight: 25, variable_type: 'strategic', unit: '' },
    { id: genId(), name: 'Time to Implement', description: '', weight: 20, variable_type: 'time', unit: '' },
  ])

  const [expandedSection, setExpandedSection] = useState<string>('details')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalWeight = variables.reduce((sum, v) => sum + v.weight, 0)

  const addOption = () => {
    const label = `Option ${String.fromCharCode(65 + options.length)}`
    setOptions([...options, { id: genId(), label, description: '' }])
  }

  const removeOption = (id: string) => {
    if (options.length > 1) setOptions(options.filter(o => o.id !== id))
  }

  const addVariable = () => {
    setVariables([...variables, {
      id: genId(), name: '', description: '', weight: 10, variable_type: 'custom', unit: '',
    }])
  }

  const removeVariable = (id: string) => {
    if (variables.length > 1) setVariables(variables.filter(v => v.id !== id))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Ensure user profile exists in public.users
      const { error: userError } = await supabase
        .from('users')
        .upsert({ 
          id: user.id, 
          email: user.email, 
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        })
      
      if (userError) {
        console.error('[User Upsert Error]', userError)
        throw new Error(`Failed to initialize user profile: ${userError.message}`)
      }

      // 2. Create decision
      const { data: decision, error: decisionError } = await supabase
        .from('decisions')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          context: context.trim() || null,
          status: 'draft',
          tags: [],
        })
        .select()
        .single()

      if (decisionError) {
        console.error('[Decision Insert Error]', decisionError)
        throw new Error(`Failed to create decision: [${decisionError.code}] ${decisionError.message}`)
      }

      // 3. Create options
      const { data: createdOptions, error: optError } = await supabase
        .from('decision_options')
        .insert(options.map((o, i) => ({
          decision_id: decision.id,
          label: o.label.trim(),
          description: o.description.trim() || null,
          order_index: i,
        })))
        .select()

      if (optError) {
        console.error('[Options Insert Error]', optError)
        throw new Error(`Failed to create options: ${optError.message}`)
      }

      // 4. Create variables
      const { data: createdVars, error: varError } = await supabase
        .from('variables')
        .insert(variables.map((v, i) => ({
          decision_id: decision.id,
          name: v.name.trim(),
          description: v.description.trim() || null,
          weight: v.weight,
          unit: v.unit.trim() || null,
          variable_type: v.variable_type,
          order_index: i,
        })))
        .select()

      if (varError) {
        console.error('[Variables Insert Error]', varError)
        throw new Error(`Failed to create variables: ${varError.message}`)
      }

      // 5. Create empty variable scores for each option × variable
      const scoresToInsert = []
      for (const opt of createdOptions || []) {
        for (const variable of createdVars || []) {
          scoresToInsert.push({
            option_id: opt.id,
            variable_id: variable.id,
            score: 5, // Default midpoint
            raw_value: null,
            notes: null,
          })
        }
      }

      const { error: scoresError } = await supabase.from('variable_scores').insert(scoresToInsert)
      if (scoresError) {
        console.error('[Scores Insert Error]', scoresError)
        throw new Error(`Failed to initialize scores: ${scoresError.message}`)
      }

      // 6. Update status
      const { error: statusError } = await supabase
        .from('decisions')
        .update({ status: 'in_progress' })
        .eq('id', decision.id)

      if (statusError) {
        console.error('[Status Update Error]', statusError)
        // Not fatal, but worth logging
      }

      router.push(`/decisions/${decision.id}`)
    } catch (err: unknown) {
      console.error('[handleSave Full Error]', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create decision'
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-enter">
      <TopBar title="New Decision" subtitle="Build your structured decision framework" />

      <div className="p-6 max-w-3xl">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg bg-risk-high/10 border border-risk-high/20 mb-6"
          >
            <AlertCircle size={16} className="text-risk-high flex-shrink-0" />
            <p className="text-[13px] text-risk-high">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Decision Details */}
          <Section 
            id="details" 
            label="1 — Decision Details" 
            expandedSection={expandedSection} 
            setExpandedSection={setExpandedSection}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-ink-muted tracking-wider uppercase mb-1.5">
                  Decision Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Office Expansion – London vs Manchester"
                  className="input-dark w-full text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink-muted tracking-wider uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of the decision at hand…"
                  rows={3}
                  className="input-dark w-full text-[14px] resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink-muted tracking-wider uppercase mb-1.5">
                  Context & Constraints
                </label>
                <textarea
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="Background, constraints, stakeholder considerations, timeline…"
                  rows={4}
                  className="input-dark w-full text-[14px] resize-none"
                />
              </div>
            </div>
          </Section>

          {/* Options */}
          <Section 
            id="options" 
            label={`2 — Options  (${options.length})`}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <div className="space-y-3">
              {options.map((option, i) => (
                <motion.div
                  key={option.id}
                  layout
                  className="flex gap-3 items-start p-4 bg-white/3 rounded-lg border border-white/5"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      required
                      value={option.label}
                      onChange={e => setOptions(opts => opts.map(o => o.id === option.id ? { ...o, label: e.target.value } : o))}
                      placeholder={`Option ${String.fromCharCode(65 + i)} label`}
                      className="input-dark w-full text-[14px]"
                    />
                    <input
                      type="text"
                      value={option.description}
                      onChange={e => setOptions(opts => opts.map(o => o.id === option.id ? { ...o, description: e.target.value } : o))}
                      placeholder="Brief description (optional)"
                      className="input-dark w-full text-[13px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    disabled={options.length <= 1}
                    className="p-2 text-ink-faint hover:text-risk-high transition-colors mt-1 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 text-[13px] text-stratiq-blue hover:text-stratiq-blue-light transition-colors"
              >
                <Plus size={14} /> Add Option
              </button>
            </div>
          </Section>

          {/* Variables */}
          <Section 
            id="variables" 
            label={`3 — Variables & Weights  (Total: ${totalWeight}%)`}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <div className="space-y-3">
              {/* Weight warning */}
              {totalWeight !== 100 && (
                <div className={cn(
                  'text-[12px] px-3 py-2 rounded-lg border',
                  totalWeight > 100
                    ? 'bg-risk-high/10 border-risk-high/20 text-risk-high'
                    : 'bg-risk-medium/10 border-risk-medium/20 text-risk-medium'
                )}>
                  Weights total {totalWeight}% — weights will be normalised automatically during simulation.
                </div>
              )}

              {variables.map(variable => (
                <motion.div
                  key={variable.id}
                  layout
                  className="p-4 bg-white/3 rounded-lg border border-white/5 space-y-3"
                >
                  <div className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-5">
                      <label className="block text-[10px] text-ink-faint mb-1">Variable Name</label>
                      <input
                        type="text"
                        required
                        value={variable.name}
                        onChange={e => setVariables(vars => vars.map(v => v.id === variable.id ? { ...v, name: e.target.value } : v))}
                        placeholder="Variable name"
                        className="input-dark w-full text-[13px]"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] text-ink-faint mb-1">Type</label>
                      <select
                        value={variable.variable_type}
                        onChange={e => setVariables(vars => vars.map(v => v.id === variable.id ? { ...v, variable_type: e.target.value as VariableType } : v))}
                        className="input-dark w-full text-[13px]"
                      >
                        {VARIABLE_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] text-ink-faint mb-1">Weight (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={variable.weight}
                        onChange={e => setVariables(vars => vars.map(v => v.id === variable.id ? { ...v, weight: Number(e.target.value) } : v))}
                        className="input-dark w-full text-[13px]"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => removeVariable(variable.id)}
                        disabled={variables.length <= 1}
                        className="p-1.5 text-ink-faint hover:text-risk-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={variable.description}
                    onChange={e => setVariables(vars => vars.map(v => v.id === variable.id ? { ...v, description: e.target.value } : v))}
                    placeholder="What does this variable measure? (optional)"
                    className="input-dark w-full text-[12px]"
                  />
                </motion.div>
              ))}

              <button
                type="button"
                onClick={addVariable}
                className="flex items-center gap-2 text-[13px] text-stratiq-blue hover:text-stratiq-blue-light transition-colors"
              >
                <Plus size={14} /> Add Variable
              </button>
            </div>
          </Section>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary text-[14px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="btn-primary text-[14px] group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={15} />
                  Save & Score Options
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface SectionProps {
  id: string
  label: string
  expandedSection: string
  setExpandedSection: (id: string) => void
  children: React.ReactNode
}

const Section = ({ id, label, expandedSection, setExpandedSection, children }: SectionProps) => (
  <div className="card-surface overflow-hidden">
    <button
      type="button"
      onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
      className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors"
    >
      <span className="text-[14px] font-semibold text-ink-DEFAULT">{label}</span>
      {expandedSection === id ? (
        <ChevronUp size={16} className="text-ink-faint" />
      ) : (
        <ChevronDown size={16} className="text-ink-faint" />
      )}
    </button>
    <AnimatePresence>
      {expandedSection === id && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="border-t border-white/5 p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)
