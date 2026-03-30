-- ============================================================
-- STRATIQ – Complete Database Schema
-- Migration: 001_initial_schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Custom Types ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE decision_status AS ENUM ('draft', 'in_progress', 'simulated', 'decided', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

DO $$ BEGIN
  CREATE TYPE billing_interval_type AS ENUM ('monthly', 'annual');
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

DO $$ BEGIN
  CREATE TYPE variable_type AS ENUM ('financial', 'risk', 'time', 'strategic', 'operational', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

DO $$ BEGIN
  CREATE TYPE team_role AS ENUM ('owner', 'admin', 'member', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

DO $$ BEGIN
  CREATE TYPE member_status AS ENUM ('pending', 'active', 'removed');
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Auto-create user on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Subscriptions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flw_subscription_id TEXT UNIQUE,
  flw_customer_id TEXT,
  tier subscription_tier NOT NULL DEFAULT 'starter',
  status subscription_status NOT NULL DEFAULT 'active',
  billing_interval billing_interval_type NOT NULL DEFAULT 'monthly',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_flw_sub_id ON subscriptions(flw_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_flw_customer_id ON subscriptions(flw_customer_id);

-- ── Decisions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  context TEXT,
  status decision_status NOT NULL DEFAULT 'draft',
  deadline TIMESTAMPTZ,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);
CREATE INDEX IF NOT EXISTS idx_decisions_updated_at ON decisions(updated_at DESC);

-- ── Decision Options ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS decision_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_options_decision_id ON decision_options(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_options_order ON decision_options(decision_id, order_index);

-- ── Variables ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS variables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  weight NUMERIC(5,2) NOT NULL DEFAULT 10 CHECK (weight >= 0 AND weight <= 100),
  unit TEXT,
  variable_type variable_type NOT NULL DEFAULT 'custom',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variables_decision_id ON variables(decision_id);

-- ── Variable Scores ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS variable_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_id UUID NOT NULL REFERENCES decision_options(id) ON DELETE CASCADE,
  variable_id UUID NOT NULL REFERENCES variables(id) ON DELETE CASCADE,
  score NUMERIC(4,2) NOT NULL DEFAULT 5 CHECK (score >= 0 AND score <= 10),
  raw_value TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(option_id, variable_id)
);

CREATE INDEX IF NOT EXISTS idx_variable_scores_option_id ON variable_scores(option_id);
CREATE INDEX IF NOT EXISTS idx_variable_scores_variable_id ON variable_scores(variable_id);

-- ── Simulation Results ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS simulation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  simulation_version INTEGER NOT NULL DEFAULT 1,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simulation_results_decision_id ON simulation_results(decision_id);
CREATE INDEX IF NOT EXISTS idx_simulation_results_user_id ON simulation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_results_created_at ON simulation_results(created_at DESC);

-- ── Reports ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  simulation_result_id UUID REFERENCES simulation_results(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  storage_path TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_decision_id ON reports(decision_id);

-- ── Teams ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role team_role NOT NULL DEFAULT 'member',
  status member_status NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  UNIQUE(team_id, email)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- ── Updated At Trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users', 'subscriptions', 'decisions', 'decision_options', 'variables', 'variable_scores', 'teams', 'team_members']
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END; $$;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE variable_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Users: can only access their own profile
CREATE POLICY "users_own_profile" ON users
  FOR ALL USING (auth.uid() = id);

-- Subscriptions: own only
CREATE POLICY "subscriptions_own" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Decisions: own only
CREATE POLICY "decisions_own" ON decisions
  FOR ALL USING (auth.uid() = user_id);

-- Decision Options: via decision ownership
CREATE POLICY "decision_options_via_decision" ON decision_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

-- Variables: via decision ownership
CREATE POLICY "variables_via_decision" ON variables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM decisions d
      WHERE d.id = decision_id AND d.user_id = auth.uid()
    )
  );

-- Variable Scores: via option → decision ownership
CREATE POLICY "variable_scores_via_option" ON variable_scores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM decision_options o
      JOIN decisions d ON d.id = o.decision_id
      WHERE o.id = option_id AND d.user_id = auth.uid()
    )
  );

-- Simulation Results: own only
CREATE POLICY "simulation_results_own" ON simulation_results
  FOR ALL USING (auth.uid() = user_id);

-- Reports: own only
CREATE POLICY "reports_own" ON reports
  FOR ALL USING (auth.uid() = user_id);

-- Teams: owner or member
CREATE POLICY "teams_access" ON teams
  FOR ALL USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = id AND tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "team_members_access" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = team_id AND (
        t.owner_id = auth.uid() OR
        (user_id = auth.uid() AND status = 'active')
      )
    )
  );

-- ============================================================
-- DEFAULT DATA
-- ============================================================

-- Create starter subscription on user creation
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'starter', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_created_subscription ON public.users;
CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_subscription();
