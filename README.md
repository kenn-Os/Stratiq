STRATIQ
Decision Intelligence Platform

Decide with precision.

STRATIQ is a decision intelligence platform designed to help individuals, professionals, and organisations approach complex decisions with structure and clarity. It provides tools for modelling choices, simulating scenarios, and analysing risk, turning uncertainty into actionable insight.

Overview

High-stakes decisions are often made with incomplete information and subjective judgement. STRATIQ introduces a structured, data-driven approach that allows users to:

Break down decisions into measurable components
Evaluate options using weighted scoring models
Simulate multiple scenarios before committing
Generate clear, executive-ready reports

STRATIQ does not remove risk. It helps you understand and navigate it.

Tech Stack
Layer Technology
Framework Next.js 14 (App Router)
Language TypeScript
Styling Tailwind CSS with a custom design system
Animation Framer Motion
Backend Supabase with PostgreSQL, Auth, and RLS
Payments Stripe for subscriptions
Data Visuals Recharts
Getting Started
npm install
cp .env.example .env.local

# Add required environment variables

npm run dev

For full setup instructions, see SETUP.md.

Application Structure
Public Pages
/ Landing page
/product Product overview
/how-it-works Platform walkthrough
/pricing Subscription plans
/security Security and compliance
/about, /contact Company information
Authenticated Application
/dashboard Overview and recent activity
/decisions Decision management
/decisions/new Decision builder
/decisions/[id] Scoring matrix and results
/simulate Scenario simulation engine
/reports Exportable reports
/account Profile and billing
Core Architecture
lib/
├── supabase/ Authentication, database, middleware
└── simulation/ Decision modelling and scoring engine
Pricing
Feature Starter Professional Enterprise
Decisions 5 50 Unlimited
Simulations 20 per month 200 per month Unlimited
Reports No Yes Yes
Team Members 1 5 Unlimited
Price Free £49 per month Custom
Philosophy

STRATIQ is built on a simple principle. Better decisions come from better structure.

Rather than relying on instinct alone, the platform encourages a disciplined approach to thinking by combining logic, data, and scenario analysis to support more confident outcomes.
