import React from 'react'
import {
  TrendingUp,
  AlertOctagon,
  Bot,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  ArrowRight,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { Badge } from '../../../shared/ui/Badge'

interface SlideDeckProps {
  currentSlideIndex: number
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ currentSlideIndex }) => {
  return (
    <div className="w-full bg-slate-950/80 border border-cyber-border rounded-2xl p-6 sm:p-10 min-h-[560px] flex flex-col justify-between backdrop-blur-lg">
      {/* Slide 1: Executive Problem Statement & Macro Overview */}
      {currentSlideIndex === 0 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <Badge variant="cyber" className="text-xs">
              Executive Briefing • Slide 1
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight">
              Enterprise Logistics Margin Crisis: <span className="text-cyber-rose">$2.42M Value at Risk</span>
            </h1>
            <p className="text-base text-cyber-muted max-w-3xl">
              Logistics operating margin contracted by 4.2% in Q4 despite +14.8% top-line GMV expansion. Root cause investigation reveals severe carrier contract inflation and operational bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-cyber-card/80 border border-cyber-rose/40 space-y-2">
              <span className="text-xs font-semibold text-cyber-muted uppercase">Unrecovered Margin Leakage</span>
              <div className="text-3xl font-bold text-cyber-rose">$2,420,000</div>
              <p className="text-xs text-slate-400">Attributable to un-optimized carrier routing and surcharge pass-through failure.</p>
            </div>

            <div className="p-5 rounded-xl bg-cyber-card/80 border border-cyber-amber/40 space-y-2">
              <span className="text-xs font-semibold text-cyber-muted uppercase">SLA Breach Rate</span>
              <div className="text-3xl font-bold text-cyber-amber">7.8% (Peak 24.2%)</div>
              <p className="text-xs text-slate-400">Triggering $380k in customer penalty credits and retention attrition.</p>
            </div>

            <div className="p-5 rounded-xl bg-cyber-card/80 border border-cyber-cyan/40 space-y-2">
              <span className="text-xs font-semibold text-cyber-muted uppercase">Identified Recovery Upside</span>
              <div className="text-3xl font-bold text-cyber-emerald">+$1.84M Net</div>
              <p className="text-xs text-slate-400">Achievable within 60 days via multi-agent autonomous contract enforcement.</p>
            </div>
          </div>
        </div>
      )}

      {/* Slide 2: Root Cause Decomposition */}
      {currentSlideIndex === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <Badge variant="cyber" className="text-xs">
              Root Cause Analysis • Slide 2
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight">
              Carrier Performance Asymmetry & Bottleneck Attribution
            </h1>
            <p className="text-base text-cyber-muted max-w-3xl">
              Statistical decomposition and SHAP explainability isolate 78% of late shipments to two specific regional logistics partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl bg-cyber-card/80 border border-cyber-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-cyber-text flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyber-rose" />
                  Apex Freight Systems (Midwest Corridor)
                </h3>
                <Badge variant="destructive" className="text-xs">Critical Risk</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-cyber-muted">SLA Failure Rate:</span>
                  <span className="font-bold text-cyber-rose">24.2%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-cyber-muted">Rate Premium:</span>
                  <span className="font-bold text-cyber-rose">+$0.18 / km vs market</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-cyber-muted">Primary Failure Mode:</span>
                  <span className="font-bold text-slate-200">Hub transfer latency (Chicago DC)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-cyber-card/80 border border-cyber-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-cyber-text flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyber-emerald" />
                  SwiftLogistics & National Freight (Benchmark)
                </h3>
                <Badge variant="success" className="text-xs">Top Performer</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-cyber-muted">SLA Failure Rate:</span>
                  <span className="font-bold text-cyber-emerald">3.1%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-cyber-muted">Cost Efficiency:</span>
                  <span className="font-bold text-cyber-emerald">-$0.12 / km advantage</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-cyber-muted">Dynamic Capacity:</span>
                  <span className="font-bold text-slate-200">Capable of absorbing +40% volume</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide 3: Multi-Agent Autonomous Architecture */}
      {currentSlideIndex === 2 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <Badge variant="cyber" className="text-xs">
              System Architecture • Slide 3
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight">
              Datasphere Multi-Agent Orchestration & Governance
            </h1>
            <p className="text-base text-cyber-muted max-w-3xl">
              7 specialized LangGraph autonomous agents operate in consensus with cryptographic verification and human-in-the-loop governance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { role: 'Planner Agent', desc: 'Synthesizes intent & generates execution DAG' },
              { role: 'Data Engineer', desc: 'DuckDB vector SQL execution & dataset joins' },
              { role: 'Scientist Agent', desc: 'Hypothesis testing & XGBoost SHAP attribution' },
              { role: 'Economist Agent', desc: 'Monte Carlo elasticity & ROI simulation' },
            ].map((ag, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-cyber-cyan/30 space-y-1">
                <Bot className="w-5 h-5 text-cyber-cyan mb-2" />
                <h4 className="text-xs font-bold text-cyber-text">{ag.role}</h4>
                <p className="text-[11px] text-cyber-muted">{ag.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-cyber-emerald/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyber-emerald shrink-0" />
              <div>
                <span className="font-bold text-cyber-emerald block">Dual-Tier AST Guardrails Active</span>
                <span className="text-slate-300">Zero unapproved financial actions &gt; $50k without explicit human cryptographic signature.</span>
              </div>
            </div>
            <Badge variant="success" className="text-[10px]">SOC2 Type II Compliant</Badge>
          </div>
        </div>
      )}

      {/* Slide 4: 12-Month Predictive Scenario Modeling */}
      {currentSlideIndex === 3 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <Badge variant="cyber" className="text-xs">
              Predictive Outlook • Slide 4
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight">
              12-Month Monte Carlo Outlook & Fan Trajectory
            </h1>
            <p className="text-base text-cyber-muted max-w-3xl">
              Probabilistic modeling across 5,000 iterations demonstrates margin recovery trajectory from 34.8% baseline to 38.4% under optimized carrier routing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Scenario A: Status Quo</span>
              <div className="text-2xl font-bold text-slate-300">34.8% Margin</div>
              <p className="text-xs text-slate-500">Logistics inflation continues unabated; $2.42M cumulative loss.</p>
            </div>

            <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyber-cyan/40 space-y-2">
              <span className="text-xs font-semibold text-cyber-cyan uppercase">Scenario B: Dynamic Reroute</span>
              <div className="text-2xl font-bold text-cyber-cyan">36.2% Margin</div>
              <p className="text-xs text-slate-400">Shift 35% Midwest volume from Apex to SwiftLogistics.</p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-950/20 border border-cyber-emerald/40 space-y-2">
              <span className="text-xs font-semibold text-cyber-emerald uppercase">Scenario C: Full Optimization</span>
              <div className="text-2xl font-bold text-cyber-emerald">38.4% Margin</div>
              <p className="text-xs text-slate-400">Dynamic allocation + automated contract penalty clause enforcement.</p>
            </div>
          </div>
        </div>
      )}

      {/* Slide 5: Strategic Decision Matrix & Boardroom Recommendation Action Plan */}
      {currentSlideIndex === 4 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <Badge variant="cyber" className="text-xs">
              Action Plan • Slide 5
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight">
              Boardroom Decision Action Items & ROI Timeline
            </h1>
            <p className="text-base text-cyber-muted max-w-3xl">
              Recommended executive resolutions for immediate deployment across operations and procurement teams.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: 'Phase 1 (Day 1 - 14)',
                title: 'Trigger Automated Carrier Rate Renegotiation Clause',
                impact: '+$450k annualized savings',
              },
              {
                step: 'Phase 2 (Day 15 - 30)',
                title: 'Reroute 40% of Chicago Midwest Corridor to SwiftLogistics',
                impact: 'Reduces SLA breaches by 62%',
              },
              {
                step: 'Phase 3 (Day 31 - 60)',
                title: 'Deploy Real-Time Dynamic Capacity Auction Guardrail',
                impact: 'Captures full +$1.84M net EBITDA expansion',
              },
            ].map((act, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-cyber-card/90 border border-cyber-border flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan font-bold font-mono text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyber-muted">{act.step}</span>
                    <h4 className="text-sm font-bold text-cyber-text">{act.title}</h4>
                  </div>
                </div>
                <Badge variant="success" className="text-xs shrink-0">
                  {act.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer watermark */}
      <div className="pt-6 border-t border-cyber-border/40 flex items-center justify-between text-xs text-cyber-muted">
        <span>Datasphere Multi-Agent Decision Support Platform</span>
        <span>Generated for Board of Directors & Hackathon Jury Evaluation</span>
      </div>
    </div>
  )
}
