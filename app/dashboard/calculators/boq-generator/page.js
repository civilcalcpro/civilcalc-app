'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BOQGeneratorPage() {
  const [projectName, setProjectName] = useState('')

  const [items, setItems] = useState([
    {
      itemName: '',
      unit: 'm³',
      length: '',
      width: '',
      height: '',
      quantity: '',
      rate: '',
    },
  ])

  const calculateQuantity = (item) => {
    const length = Number(item.length) || 0
    const width = Number(item.width) || 0
    const height = Number(item.height) || 0
    const qty = Number(item.quantity) || 0

    return length * width * height * qty
  }

  const calculateAmount = (item) => {
    const rate = Number(item.rate) || 0
    return calculateQuantity(item) * rate
  }

  const subtotal = items.reduce(
    (sum, item) => sum + calculateAmount(item),
    0
  )
const [gstPercent, setGstPercent] = useState(18)
  const gstAmount = subtotal * (gstPercent / 100)
  const grandTotal = subtotal + gstAmount

  const addRow = () => {
    setItems([
      ...items,
      {
        itemName: '',
        unit: 'm³',
        length: '',
        width: '',
        height: '',
        quantity: '',
        rate: '',
      },
    ])
  }

  const deleteRow = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-white mb-6">
        BOQ Generator
      </h1>

      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <Input
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 mb-6"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
        />
<div className="grid grid-cols-2 gap-4 mb-6">
  <Input
    className="bg-slate-800 border-slate-700 text-white"
    type="number"
    value={gstPercent}
    onChange={(e) =>
      setGstPercent(Number(e.target.value))
    }
    placeholder="GST %"
  />
</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th>Item</th>
                <th>Unit</th>
                <th>Length</th>
                <th>Width</th>
                <th>Height</th>
                <th>Qty</th>
                <th>Rate</th>
               <th className="px-3">Quantity</th>
<th className="px-3">Amount</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={item.itemName}
                      onChange={(e) =>
                        updateItem(index, 'itemName', e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(index, 'unit', e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={item.length}
                      onChange={(e) =>
                        updateItem(index, 'length', e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={item.width}
                      onChange={(e) =>
                        updateItem(index, 'width', e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={item.height}
                      onChange={(e) =>
                        updateItem(index, 'height', e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, 'quantity', e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(index, 'rate', e.target.value)
                      }
                    />
                  </td>

                 <td className="text-white text-center px-3">
  {calculateQuantity(item).toFixed(2)}
</td>

<td className="text-green-400 text-center font-semibold px-3">
  ₹ {calculateAmount(item).toFixed(2)}
</td>

                  <td>
                    <Button
                      variant="destructive"
                      onClick={() => deleteRow(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={addRow} className="mt-6">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </Card>

      <Card className="mt-6 bg-slate-900/50 border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Cost Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-white">
              ₹ {subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">GST (18%)</span>
            <span className="text-white">
              ₹ {gstAmount.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-slate-700 pt-3 flex justify-between">
            <span className="text-lg font-bold text-white">
              Grand Total
            </span>

            <span className="text-2xl font-bold text-green-400">
              ₹ {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
