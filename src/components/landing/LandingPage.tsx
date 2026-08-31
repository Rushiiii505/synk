'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  FileText,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  ChevronRight,
  Star,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients & Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[1600px] right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            ⚡
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-mono">synk</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase">
            v2.4 Pro
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#fintech" className="hover:text-white transition-colors">
            FinTech Engine
          </a>
          <a href="#collaboration" className="hover:text-white transition-colors">
            Docs & Tasks
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors">
            Testimonials
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onEnterApp} className="text-xs">
            Sign In
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onEnterApp}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs shadow-lg shadow-indigo-600/30"
          >
            Launch Workspace
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6 lg:px-12 max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-indigo-400 text-xs font-semibold mb-6 shadow-md backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Operations Platform for Startups & Collectives</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Maximize Your Team&apos;s{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
            Financial & Operational
          </span>{' '}
          Potential.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The unified SaaS operating system combining <strong>Linear-speed agile sprints</strong>,{' '}
          <strong>Notion-style rich docs</strong>, and <strong>FinTech capital treasury</strong> into one seamless workspace.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onEnterApp}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-xl shadow-indigo-600/40 text-sm font-semibold px-6 py-3"
          >
            Get Started Free
          </Button>
          <Button
            variant="glass"
            size="lg"
            onClick={onEnterApp}
            leftIcon={<Play className="w-4 h-4 text-emerald-400" />}
            className="text-sm font-medium"
          >
            Interactive Demo
          </Button>
        </div>

        {/* Social Proof Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">4.9 ★</span>
            <span>Product Hunt</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-400 font-bold">4.8 ★</span>
            <span>Chrome Store</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">4.9 ★</span>
            <span>Trustpilot</span>
          </div>
        </div>

        {/* Interactive Dashboard Mockup Card */}
        <div className="mt-14 relative rounded-3xl p-2 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-transparent border border-white/10 shadow-2xl overflow-hidden group">
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-6 text-left space-y-6">
            {/* Mock Top bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-500 ml-2">synk.app/acme-collective</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 presence-pulse" />
                <span className="text-xs text-slate-400 font-medium">5 Members Live</span>
              </div>
            </div>

            {/* Mock Stats & Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Liquid Treasury</span>
                <div className="text-2xl font-bold text-white font-mono mt-1">$231,580</div>
                <div className="text-xs text-emerald-400 mt-1">13.8 mo runway left</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Monthly Burn</span>
                <div className="text-2xl font-bold text-white font-mono mt-1">$18,420</div>
                <div className="text-xs text-indigo-400 mt-1">52% budget utilization</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Roadmap Velocity</span>
                <div className="text-2xl font-bold text-white font-mono mt-1">18 Done</div>
                <div className="text-xs text-emerald-400 mt-1">4 Urgent in Review</div>
              </div>
            </div>

            {/* Launch App Prompt Overlay */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Live Workspace Ready</h4>
                  <p className="text-xs text-slate-400">Test the Kanban board, Markdown docs, and expense splits live.</p>
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={onEnterApp}>
                Enter App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Financial Hub */}
      <section id="fintech" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              FinTech Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Track All Expenses, Capital Injections & Team Cost Splits.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly monitor runway metrics, attach invoice receipts with OCR verification, and split costs among teammates with automatic reimbursement calculation.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Executive Metric Cards: Total Capital, Spend MTD, and Liquid Runway</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Interactive Recharts Donut & Bar Visualizations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>One-Click Team Cost Splitting & Settlement Tracking</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Expense Split Engine</span>
              <span className="text-xs font-mono text-indigo-400">AWS Cloud Tier ($1,420.50)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center font-bold">AR</div>
                  <span>Alex Rivera (Owner)</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold">$710.25 (Settled)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-[10px] flex items-center justify-center font-bold">SC</div>
                  <span>Sarah Chen (Admin)</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold">$710.25 (Settled)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Agile Tasks & Collaborative Docs */}
      <section id="collaboration" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-slate-300">Sprint Kanban Board</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">5 Columns</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/40">
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-semibold">Urgent</span>
                <h5 className="font-semibold text-slate-100 mt-1">Multi-Tenant Database Partitioning</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">3/3 Subtasks Completed • Due in 2d</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">High</span>
                <h5 className="font-semibold text-slate-100 mt-1">Linear-Inspired Drag Ghost Physics</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Assigned to Marcus Vance</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
              Agile Roadmap & Docs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Speed of Linear. Flexibility of Notion.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Organize tasks across interactive drag-and-drop Kanban columns or sortable tables. Write strategy specs with full Markdown formatting and real-time cursor presence.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={onEnterApp}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Explore Sprint Engine
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-800/80 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Ready to run your operations better with Synk?
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start collaborating in seconds with isolated multi-tenant workspaces and live presence.
        </p>
        <div>
          <Button
            variant="emerald"
            size="lg"
            onClick={onEnterApp}
            className="shadow-xl shadow-emerald-950/50"
          >
            Launch Free Workspace
          </Button>
        </div>
        <p className="text-[11px] text-slate-600 font-mono">
          © 2026 Synk Platform Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
