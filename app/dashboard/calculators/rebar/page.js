'use client'

import { useMemo, useState } from 'react'
import { Calculator, Download } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const barData = {
  '8mm': { dia: 8, weight: 0.395 },
  '10mm': { dia: 10, weight: 0.617 },
  '12mm': { dia: 12, weight: 0.888 },
  '16mm': { dia: 16, weight: 1.58 },
  '20mm': { dia: 20, weight: 2.47 },
  '25mm': { dia: 25, weight: 3.85 },
  '32mm': { dia: 32, weight: 6.31 },

  '#3': { dia: 9.5, weight: 0.56 },
  '#4': { dia: 12.7, weight: 0.994 },
  '#5': { dia: 15.9, weight: 1.552 },
  '#6': { dia: 19.1, weight: 2.235 },
  '#7': { dia: 22.2, weight: 3.042 },
  '#8': { dia: 25.4, weight: 3.973 },
}

export default function RebarCalculatorPage() {
  const [barSize, setBarSize] = useState('12mm')
  const [length, setLength] = useState(12)
  const [quantity, setQuantity] = useState(10)
  const [wastage, setWastage] = useState(5)
  const [rate, setRate] = useState(65)

  const result = useMemo(() => {
    const bar = barData[barSize]
    const L = Number(length) || 0
    const Q = Number(quantity) || 0
    const W = Number(wastage) || 0
    const R = Number(rate) || 0

    const totalLength = L * Q
    const totalLengthWithWastage = totalLength * (1 + W / 100)
    const totalWeight = totalLengthWithWastage * bar.weight
    const cost = totalWeight * R

    return {
      dia: bar.dia,
      unitWeight: bar.weight,
      totalLength,
      totalLengthWithWastage,
      totalWeight,
      cost,
    }
  }, [barSize, length, quantity, wastage, rate])

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
          <Calculator className="h-3 w-3 mr-1.5" />
          Quantity Estimation
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          Rebar Calculator
        </h1>

        <p className="text-slate-400 mt-2">
          Calculate rebar length, steel weight, wastage and cost for Indian and US bar sizes.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-5">
            Inputs
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-400">Bar Size</Label>
              <Select value={barSize} onValueChange={setBarSize}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="8mm">8 mm</SelectItem>
                  <SelectItem value="10mm">10 mm</SelectItem>
                  <SelectItem value="12mm">12 mm</SelectItem>
                  <SelectItem value="16mm">16 mm</SelectItem>
                  <SelectItem value="20mm">20 mm</SelectItem>
                  <SelectItem value="25mm">25 mm</SelectItem>
                  <SelectItem value="32mm">32 mm</SelectItem>
                  <SelectItem value="#3">US #3</SelectItem>
                  <SelectItem value="#4">US #4</SelectItem>
                  <SelectItem value="#5">US #5</SelectItem>
                  <SelectItem value="#6">US #6</SelectItem>
                  <SelectItem value="#7">US #7</SelectItem>
                  <SelectItem value="#8">US #8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <InputBox label="Length of One Bar (m)" value={length} setValue={setLength} />
            <InputBox label="Quantity of Bars" value={quantity} setValue={setQuantity} />
            <InputBox label="Wastage (%)" value={wastage} setValue={setWastage} />
            <InputBox label="Steel Rate / kg" value={rate} setValue={setRate} />

            <Button
              onClick={() => window.print()}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export / Print PDF
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <SummaryCard label="Diameter" value={`${result.dia} mm`} />
            <SummaryCard label="Unit Weight" value={`${result.unitWeight} kg/m`} />
            <SummaryCard label="Total Weight" value={`${result.totalWeight.toFixed(2)} kg`} />
            <SummaryCard label="Cost" value={result.cost.toFixed(2)} />
          </div>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Calculation Summary
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <ResultRow label="Total Length" value={`${result.totalLength.toFixed(2)} m`} />
              <ResultRow label="Length with Wastage" value={`${result.totalLengthWithWastage.toFixed(2)} m`} />
              <ResultRow label="Total Steel Weight" value={`${result.totalWeight.toFixed(2)} kg`} />
              <ResultRow label="Estimated Cost" value={result.cost.toFixed(2)} />
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Formula Used
            </h2>

            <div className="space-y-3 text-slate-300">
              <p>
                Total Length = Length of One Bar × Quantity
              </p>
              <p>
                Length with Wastage = Total Length × (1 + Wastage / 100)
              </p>
              <p>
                Steel Weight = Length with Wastage × Unit Weight
              </p>
              <p>
                Cost = Total Weight × Rate per kg
              </p>
              <p className="text-orange-400">
                For metric bars, unit weight is based on d² / 162 kg/m.
              </p>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Step-by-Step Solution
            </h2>

            <div className="space-y-3 text-slate-300 leading-7">
              <p>
                Step 1: Selected bar size = <b className="text-orange-400">{barSize}</b>
              </p>
              <p>
                Step 2: Unit weight = <b className="text-orange-400">{result.unitWeight} kg/m</b>
              </p>
              <p>
                Step 3: Total length = {length} × {quantity} ={' '}
                <b className="text-orange-400">{result.totalLength.toFixed(2)} m</b>
              </p>
              <p>
                Step 4: Length after wastage ={' '}
                <b className="text-orange-400">{result.totalLengthWithWastage.toFixed(2)} m</b>
              </p>
              <p>
                Step 5: Total steel weight ={' '}
                <b className="text-orange-400">{result.totalWeight.toFixed(2)} kg</b>
              </p>
              <p>
                Step 6: Estimated cost ={' '}
                <b className="text-orange-400">{result.cost.toFixed(2)}</b>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InputBox({ label, value, setValue }) {
  return (
    <div>
      <Label className="text-slate-400">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="bg-slate-800 border-slate-700 text-white mt-2"
      />
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-5">
      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </div>
      <div className="text-xl font-bold text-white">
        {value}
      </div>
    </Card>
  )
}

function ResultRow({ label, value }) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-4">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-white">
        {value}
      </div>
    </div>
  )
}
