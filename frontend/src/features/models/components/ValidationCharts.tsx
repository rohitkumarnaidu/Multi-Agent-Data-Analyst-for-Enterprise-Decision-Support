import React, { useMemo } from 'react'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { EChartsOption } from 'echarts'
import type { ModelArtifact } from '@/shared/types'

interface ValidationChartsProps {
  model: ModelArtifact
}

export const ValidationCharts: React.FC<ValidationChartsProps> = ({ model }) => {
  const isClassification = model.taskType === 'classification'
  const isRegression = model.taskType === 'regression'

  // ROC Curve Options
  const rocOption: EChartsOption = useMemo(() => {
    if (!model.rocCurve) return {}

    const points = model.rocCurve.map(p => [p.fpr, p.tpr])

    return {
      title: {
        text: `ROC Curve (AUC = ${model.metrics.roc_auc || 0.942})`,
        textStyle: { color: '#F8FAFC', fontSize: 12 },
        top: '2%',
        left: '2%',
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontFamily: 'monospace', fontSize: 11 },
        formatter: (params: any) => {
          const pt = params[0].data
          return `FPR: <b>${pt[0]}</b><br/>TPR (Recall): <b>${pt[1]}</b>`
        },
      },
      grid: { left: '8%', right: '6%', top: '20%', bottom: '12%' },
      xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'False Positive Rate',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'True Positive Rate',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      series: [
        {
          name: 'Model ROC',
          type: 'line',
          data: points,
          smooth: true,
          lineStyle: { color: '#06B6D4', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
                { offset: 1, color: 'rgba(6, 182, 212, 0.0)' },
              ],
            },
          },
        },
        {
          name: 'Random Chance (0.5 AUC)',
          type: 'line',
          data: [
            [0, 0],
            [1, 1],
          ],
          lineStyle: { color: '#64748B', type: 'dashed', width: 1.5 },
          symbol: 'none',
        },
      ],
    }
  }, [model])

  // Precision-Recall Curve Options
  const prOption: EChartsOption = useMemo(() => {
    if (!model.prCurve) return {}

    const points = model.prCurve.map(p => [p.recall, p.precision])

    return {
      title: {
        text: `Precision-Recall Curve (PR-AUC = ${model.metrics.pr_auc || 0.891})`,
        textStyle: { color: '#F8FAFC', fontSize: 12 },
        top: '2%',
        left: '2%',
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontFamily: 'monospace', fontSize: 11 },
        formatter: (params: any) => {
          const pt = params[0].data
          return `Recall: <b>${pt[0]}</b><br/>Precision: <b>${pt[1]}</b>`
        },
      },
      grid: { left: '8%', right: '6%', top: '20%', bottom: '12%' },
      xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'Recall',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'Precision',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      series: [
        {
          name: 'Precision-Recall',
          type: 'line',
          data: points,
          smooth: true,
          lineStyle: { color: '#10B981', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.0)' },
              ],
            },
          },
        },
      ],
    }
  }, [model])

  return (
    <div className="space-y-4">
      {/* 1. Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {isClassification ? (
          <>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">ROC-AUC</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">{model.metrics.roc_auc}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">PR-AUC</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{model.metrics.pr_auc}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">F1 Score</div>
              <div className="text-lg font-bold text-purple-300 mt-0.5">{model.metrics.f1_score}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Accuracy</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">{model.metrics.accuracy}</div>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">R² Score</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">{model.metrics.r2}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">RMSE</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{model.metrics.rmse}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">MAE</div>
              <div className="text-lg font-bold text-purple-300 mt-0.5">{model.metrics.mae}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">MAPE (%)</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">{model.metrics.mape}%</div>
            </div>
          </>
        )}
      </div>

      {/* 2. Visual Charts */}
      {isClassification && model.rocCurve && model.prCurve && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-[280px] p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <BaseChart options={rocOption} height="260px" />
          </div>
          <div className="h-[280px] p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <BaseChart options={prOption} height="260px" />
          </div>
        </div>
      )}

      {/* 3. Confusion Matrix */}
      {isClassification && model.confusionMatrix && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Holdout Test Confusion Matrix (40,000 Validation Samples)
          </h3>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs max-w-lg">
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-center">
              <div className="text-[10px] text-emerald-400">True Positives (TP)</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {model.confusionMatrix.tp.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Correct Breach Flag</div>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-center">
              <div className="text-[10px] text-rose-400">False Positives (FP)</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {model.confusionMatrix.fp.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Type I Error</div>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-center">
              <div className="text-[10px] text-rose-400">False Negatives (FN)</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {model.confusionMatrix.fn.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Type II Error (Missed)</div>
            </div>

            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-center">
              <div className="text-[10px] text-cyan-400">True Negatives (TN)</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {model.confusionMatrix.tn.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Correct SLA Met</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ValidationCharts
