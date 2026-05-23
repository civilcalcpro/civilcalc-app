'use client'
import { useState } from 'react'
import { IndianRupee, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  CalcShell, NumField, RunButton, EmptyResult,
  ResultBlock, Row, DownloadPDFButton, ResultsMotion,
} from '@/components/calc-shell'

export default function RateAnalysisPage() {
  const { authFetch } = useAuth()
  const [items, setItems] = useState([
    { name: 'Cement', quantity: 10, unit: 'bags', rate: 400 },
    { name: 'Sand', quantity: 1.5, unit: 'm³', rate: 1800 },
    { name: 'Aggregate', quantity: 3, unit: 'm³', rate: 1500 },
    { name: 'Steel (TMT)', quantity: 250, unit: 'kg', rate: 70 },
  ])
  const [labourCost, setLabourCost] = useState(8000)
  const [transportCost, setTransportCost] = useState(2000)
  const [overheadPct, setOverheadPct] = useState(10)
  const [profitPct, setProfitPct] = useState(15)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [calculationId, setCalculationId] = useState(null)

  const updateItem = (i, k, v) => setItems((it) => it.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)))
  const addItem = () => setItems((it) => [...it, { name: '', quantity: 0, unit: 'nos', rate: 0 }])
  const removeItem = (i) => setItems((it) => it.filter((_, idx) => idx !== i))

  const calc = async () => {
    setLoading(true)
    try {
      const r = await authFetch('/api/calculate/rate-analysis', { method: 'POST', body: JSON.stringify({
        items, labourCost, transportCost, overheadPct, profitPct,
      })})
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setResult(d.result); setCalculationId(d.calculationId)
      toast.success('Estimated')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  return (
    <CalcShell icon={IndianRupee} title="Rate Analysis" subtitle="Project cost estimation with materials, labour, overhead & profit" code="CPWD DSR style">
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-3">Materials</h2>
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <Label className="text-[10px] text-slate-500">Item</Label>
                  <Input value={it.name} onChange={(e) => updateItem(i, 'name', e.target.value)} className="bg-slate-800/60 border-slate-700 text-white h-9 text-sm" />
                </div>
                <div className="col-span-3">
                  <Label className="text-[10px] text-slate-500">Qty</Label>
                  <Input type="number" step="0.1" value={it.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} className="bg-slate-800/60 border-slate-700 text-white h-9 text-sm" />
                </div>
                <div className="col-span-4">
                  <Label className="text-[10px] text-slate-500">Rate (₹)</Label>
                  <Input type="number" value={it.rate} onChange={(e) => updateItem(i, 'rate', e.target.value)} className="bg-slate-800/60 border-slate-700 text-white h-9 text-sm" />
                </div>
                <div className="col-span-1">
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-red-400 hover:bg-red-500/10" onClick={() => removeItem(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addItem} className="w-full border-dashed border-slate-700 hover:bg-slate-800 text-slate-300">
              <Plus className="h-3.5 w-3.5 mr-2" /> Add item
            </Button>
          </div>
          <div className="mt-5 pt-5 border-t border-slate-800 space-y-3">
            <NumField label="Labour cost" id="labour" value={labourCost} onChange={(v) => setLabourCost(parseFloat(v) || 0)} unit="₹" />
            <NumField label="Transport cost" id="transport" value={transportCost} onChange={(v) => setTransportCost(parseFloat(v) || 0)} unit="₹" />
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Overhead %" id="oh" value={overheadPct} onChange={(v) => setOverheadPct(parseFloat(v) || 0)} step="0.5" />
              <NumField label="Profit %" id="pr" value={profitPct} onChange={(v) => setProfitPct(parseFloat(v) || 0)} step="0.5" />
            </div>
            <RunButton loading={loading} onClick={calc} label="Estimate" />
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!result && <EmptyResult icon={IndianRupee} hint="Add items, set labour/overhead/profit and run the estimate." />}
          {result && (
            <ResultsMotion initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex justify-end"><DownloadPDFButton type="rate-analysis" inputs={{items, labourCost, transportCost, overheadPct, profitPct}} result={result} calculationId={calculationId} /></div>

              <Card className="bg-gradient-to-br from-orange-500/10 to-slate-900 border-orange-500/40 p-6">
                <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-1">Final Estimate</div>
                <div className="text-4xl font-bold text-white">₹{Number(result.summary.totalCost).toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-400 mt-1">Direct: ₹{Number(result.summary.directCost).toLocaleString('en-IN')} · Indirect: ₹{Number(result.summary.indirectCost).toLocaleString('en-IN')}</div>
              </Card>

              <ResultBlock title="Material Breakdown">
                <table className="w-full text-sm">
                  <thead className="text-[10px] uppercase text-slate-500">
                    <tr><th className="text-left py-1">Item</th><th className="text-right">Qty</th><th className="text-right">Rate</th><th className="text-right">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {result.breakdown.items.map((it, i) => (
                      <tr key={i}><td className="py-1.5 text-slate-300">{it.name}</td><td className="text-right text-slate-400">{it.quantity} {it.unit}</td><td className="text-right text-slate-400">₹{it.rate}</td><td className="text-right font-medium text-white">₹{Number(it.amount).toLocaleString('en-IN')}</td></tr>
                    ))}
                  </tbody>
                </table>
              </ResultBlock>

              <ResultBlock title="Cost Build-up">
                <Row k="Material total" v={`₹${Number(result.breakdown.materialTotal).toLocaleString('en-IN')}`} />
                <Row k="Labour" v={`₹${Number(result.breakdown.labourCost).toLocaleString('en-IN')}`} />
                <Row k="Transport" v={`₹${Number(result.breakdown.transportCost).toLocaleString('en-IN')}`} />
                <Row k="Direct cost" v={`₹${Number(result.breakdown.directCost).toLocaleString('en-IN')}`} highlight />
                <Row k={`Overhead (${result.breakdown.overheadPct}%)`} v={`₹${Number(result.breakdown.overhead).toLocaleString('en-IN')}`} />
                <Row k={`Profit (${result.breakdown.profitPct}%)`} v={`₹${Number(result.breakdown.profit).toLocaleString('en-IN')}`} />
              </ResultBlock>
            </ResultsMotion>
          )}
        </div>
      </div>
    </CalcShell>
  )
}
