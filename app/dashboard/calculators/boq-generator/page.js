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
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          className="mb-6"
        />

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
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Input
                      value={item.itemName}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'itemName',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <Input
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'unit',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <Input
                      value={item.length}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'length',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <Input
                      value={item.width}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'width',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <Input
                      value={item.height}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'height',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <Input
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'quantity',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <Input
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'rate',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        deleteRow(index)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          onClick={addRow}
          className="mt-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </Card>
    </div>
  )
}
