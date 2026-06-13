'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
export default function BOQGeneratorPage() {
  const [projectName, setProjectName] = useState('')
const [clientName, setClientName] = useState('')
const [location, setLocation] = useState('')
const [boqDate, setBoqDate] = useState('')
const [revisionNo, setRevisionNo] = useState('')
  const [materialRate, setMaterialRate] = useState(0)
const [labourRate, setLabourRate] = useState(0)
const [equipmentRate, setEquipmentRate] = useState(0)
const [contractorMargin, setContractorMargin] = useState(10)
  const [items, setItems] = useState([
    {
  category: 'RCC',
  itemName: '',
 unit: 'm³',

  length: '',
  width: '',
  height: '',
  quantity: '',

  rate: '',

  materialRate: '',
  labourRate: '',
  equipmentRate: '',
}
  ])

  const calculateQuantity = (item) => {
  const length = Number(item.length) || 0
  const width = Number(item.width) || 0
  const height = Number(item.height) || 0
  const qty = Number(item.quantity) || 0

  switch (item.category) {
    case 'Earthwork':
      return length * width * height * qty

    case 'PCC':
      return length * width * height * qty

    case 'RCC':
      return length * width * height * qty

    case 'Brickwork':
      return length * width * height * qty

    case 'Plaster':
      return length * height * qty

    case 'Flooring':
      return length * width * qty

    case 'Painting':
      return length * height * qty

    case 'Steel':
      return qty

    default:
      return length * width * height * qty
  }
}

  const calculateAmount = (item) => {
    const rate = Number(item.rate) || 0
    return calculateQuantity(item) * rate
  }

  const subtotal = items.reduce(
    (sum, item) => sum + calculateAmount(item),
    0
  )
  const materialCost = items.reduce(
  (sum, item) =>
    sum +
    (calculateQuantity(item) *
      (Number(item.materialRate) || 0)),
  0
)

const labourCost = items.reduce(
  (sum, item) =>
    sum +
    (calculateQuantity(item) *
      (Number(item.labourRate) || 0)),
  0
)

const equipmentCost = items.reduce(
  (sum, item) =>
    sum +
    (calculateQuantity(item) *
      (Number(item.equipmentRate) || 0)),
  0
)
const [gstPercent, setGstPercent] = useState(18)
  const [wastagePercent, setWastagePercent] = useState(5)
  const gstAmount = subtotal * (gstPercent / 100)

const wastageAmount =
  subtotal * (wastagePercent / 100)

const grandTotal =
  subtotal + gstAmount + wastageAmount
  const marginAmount =
  (materialCost +
    labourCost +
    equipmentCost) *
  0.10

const finalGrandTotal =
  grandTotal + marginAmount
  const getFormula = (item) => {
  return `${item.length || 0} × ${
    item.width || 0
  } × ${item.height || 0} × ${
    item.quantity || 0
  }`
}
  const totalConcrete = items
  .filter(
    (item) =>
      item.category === 'RCC' ||
      item.category === 'PCC'
  )
  .reduce(
    (sum, item) =>
      sum + calculateQuantity(item),
    0
  )

const totalSteel = items
  .filter(
    (item) => item.category === 'Steel'
  )
  .reduce(
    (sum, item) =>
      sum + calculateQuantity(item),
    0
  )

const cementBags = totalConcrete * 8
const sandQty = totalConcrete * 0.44
const aggregateQty = totalConcrete * 0.88
  const addRow = () => {
    setItems([
      ...items,
      {
  category: 'RCC',
  itemName: '',
 unit: 'm³',

  length: '',
  width: '',
  height: '',
  quantity: '',

  rate: '',

  materialRate: '',
  labourRate: '',
  equipmentRate: '',
}
    ])
  }

const deleteRow = (index) => {
  setItems(items.filter((_, i) => i !== index))
}

const resetBOQ = () => {
  setProjectName('')
  setGstPercent(18)
  setWastagePercent(5)

  setItems([
    {
  category: 'RCC',
  itemName: '',
  unit: 'm³',

  length: '',
  width: '',
  height: '',
  quantity: '',

  rate: '',

  materialRate: '',
  labourRate: '',
  equipmentRate: '',
}
  ])
}

const duplicateRow = (index) => {
  const itemToCopy = { ...items[index] }

  const updated = [...items]
  updated.splice(index + 1, 0, itemToCopy)

  setItems(updated)
}
const getUnitByCategory = (category) => {
  switch (category) {
    case 'Earthwork':
    case 'PCC':
    case 'RCC':
    case 'Masonry':
      return 'm³'

    case 'Plaster':
    case 'Flooring':
    case 'Painting':
    case 'Waterproofing':
    case 'Formwork':
      return 'm²'

    case 'Steel':
    case 'Reinforcement':
      return 'kg'

    case 'RoadWork':
      return 'm'

    default:
      return 'Nos'
  }
}
const updateItem = (index, field, value) => {
  const updated = [...items]

  updated[index][field] = value

  if (field === 'category') {
    updated[index].unit =
      getUnitByCategory(value)
  }

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
       <div className="grid grid-cols-2 gap-4 mb-6">

  <Input
    className="bg-slate-800 border-slate-700 text-white"
    value={projectName}
    onChange={(e) => setProjectName(e.target.value)}
    placeholder="Project Name"
  />

  <Input
    className="bg-slate-800 border-slate-700 text-white"
    value={clientName}
    onChange={(e) => setClientName(e.target.value)}
    placeholder="Client Name"
  />

  <Input
    className="bg-slate-800 border-slate-700 text-white"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Project Location"
  />

  <Input
    className="bg-slate-800 border-slate-700 text-white"
    type="date"
    value={boqDate}
    onChange={(e) => setBoqDate(e.target.value)}
  />

  <Input
    className="bg-slate-800 border-slate-700 text-white"
    value={revisionNo}
    onChange={(e) => setRevisionNo(e.target.value)}
    placeholder="Revision No"
  />

</div>
<div className="grid grid-cols-2 gap-4 mb-6">

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      GST (%)
    </label>

    <Input
      className="bg-slate-800 border-slate-700 text-white"
      type="number"
      value={gstPercent}
      onChange={(e) =>
        setGstPercent(Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Wastage (%)
    </label>

    <Input
      className="bg-slate-800 border-slate-700 text-white"
      type="number"
      value={wastagePercent}
      onChange={(e) =>
        setWastagePercent(Number(e.target.value))
      }
    />
  </div>

</div>
        <div className="grid grid-cols-2 gap-4 mb-6">

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Material Rate (%)
    </label>

    <Input
      type="number"
      className="bg-slate-800 border-slate-700 text-white"
      value={materialRate}
      onChange={(e) =>
        setMaterialRate(Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Labour Rate (%)
    </label>

    <Input
      type="number"
      className="bg-slate-800 border-slate-700 text-white"
      value={labourRate}
      onChange={(e) =>
        setLabourRate(Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Equipment Rate (%)
    </label>

    <Input
      type="number"
      className="bg-slate-800 border-slate-700 text-white"
      value={equipmentRate}
      onChange={(e) =>
        setEquipmentRate(Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="block text-sm text-slate-400 mb-2">
      Contractor Margin (%)
    </label>

    <Input
      type="number"
      className="bg-slate-800 border-slate-700 text-white"
      value={contractorMargin}
      onChange={(e) =>
        setContractorMargin(Number(e.target.value))
      }
    />
  </div>

</div>
        <div className="overflow-x-auto pb-2">
          <table className="min-w-[1000px] text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
<th>Category</th>
<th>Item</th>
<th>Unit</th>
<th>Length</th>
<th>Width</th>
<th>Height</th>
<th>Qty</th>
<th>Rate</th>
<th>Material</th>
<th>Labour</th>
<th>Equipment</th>        
               <th className="px-3">Quantity</th>
<th className="px-3">Amount</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
  <td>
    <Select
      value={item.category}
      onValueChange={(value) =>
        updateItem(index, 'category', value)
      }
    >
      <SelectTrigger className="bg-slate-800 border-slate-700 text-white min-w-[140px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
  <SelectItem value="Earthwork">
    Earthwork
  </SelectItem>

  <SelectItem value="PCC">
    PCC
  </SelectItem>

  <SelectItem value="RCC">
    RCC
  </SelectItem>

  <SelectItem value="Reinforcement">
    Reinforcement
  </SelectItem>

  <SelectItem value="Formwork">
    Formwork/Shuttering
  </SelectItem>

  <SelectItem value="Masonry">
    Masonry
  </SelectItem>

  <SelectItem value="Plaster">
    Plaster
  </SelectItem>

  <SelectItem value="Flooring">
    Flooring
  </SelectItem>

  <SelectItem value="Painting">
    Painting
  </SelectItem>

  <SelectItem value="Waterproofing">
    Waterproofing
  </SelectItem>

  <SelectItem value="DoorsWindows">
    Doors & Windows
  </SelectItem>

  <SelectItem value="Plumbing">
    Plumbing
  </SelectItem>

  <SelectItem value="Electrical">
    Electrical
  </SelectItem>

  <SelectItem value="RoadWork">
    Road Work
  </SelectItem>

  <SelectItem value="Steel">
    Steel
  </SelectItem>
</SelectContent>
    </Select>
  </td>

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
<td>
  <Input
    className="bg-slate-800 border-slate-700 text-white"
    value={item.materialRate}
    onChange={(e) =>
      updateItem(index, 'materialRate', e.target.value)
    }
  />
</td>

<td>
  <Input
    className="bg-slate-800 border-slate-700 text-white"
    value={item.labourRate}
    onChange={(e) =>
      updateItem(index, 'labourRate', e.target.value)
    }
  />
</td>

<td>
  <Input
    className="bg-slate-800 border-slate-700 text-white"
    value={item.equipmentRate}
    onChange={(e) =>
      updateItem(index, 'equipmentRate', e.target.value)
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
  <div className="flex gap-2">
    <Button
      variant="outline"
      onClick={() => duplicateRow(index)}
    >
      Copy
    </Button>

    <Button
      variant="destructive"
      onClick={() => deleteRow(index)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      <div className="flex gap-3 mt-6">
  <Button onClick={addRow}>
    <Plus className="h-4 w-4 mr-2" />
    Add Item
  </Button>

  <Button
    variant="outline"
    onClick={resetBOQ}
  >
    Reset BOQ
  </Button>
</div>
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
  <span className="text-slate-400">
    GST ({gstPercent}%)
  </span>

  <span className="text-white">
    ₹ {gstAmount.toFixed(2)}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-slate-400">
    Wastage ({wastagePercent}%)
  </span>

  <span className="text-white">
    ₹ {wastageAmount.toFixed(2)}
  </span>
</div>

          <div className="flex justify-between">
  <span className="text-slate-400">
    Material Cost
  </span>

  <span className="text-white">
    ₹ {materialCost.toFixed(2)}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-slate-400">
    Labour Cost
  </span>

  <span className="text-white">
    ₹ {labourCost.toFixed(2)}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-slate-400">
    Equipment Cost
  </span>

  <span className="text-white">
    ₹ {equipmentCost.toFixed(2)}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-slate-400">
    Contractor Margin
  </span>

  <span className="text-white">
    ₹ {marginAmount.toFixed(2)}
  </span>
</div>
<div className="border-t border-slate-700 pt-3 flex justify-between">
  <span className="text-lg font-bold text-white">
    Grand Total
  </span>

  <span className="text-2xl font-bold text-green-400">
    ₹ {finalGrandTotal.toFixed(2)}
  </span>
</div>        </div>
      </Card>

<Card className="mt-6 bg-slate-900/50 border-slate-800 p-6">
  <h2 className="text-xl font-bold text-white mb-4">
    Detailed Quantity Sheet
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-700 text-slate-400">
          <th className="text-left py-2">
            Description
          </th>

          <th className="text-left py-2">
            Formula
          </th>

          <th className="text-right py-2">
            Result
          </th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, index) => (
          <tr
            key={index}
            className="border-b border-slate-800"
          >
            <td className="py-2 text-white">
              {item.itemName || item.category}
            </td>

            <td className="py-2 text-slate-300">
              {getFormula(item)}
            </td>

            <td className="py-2 text-right text-green-400">
              {calculateQuantity(item).toFixed(2)}{' '}
              {item.unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
          <Card className="mt-6 bg-slate-900/50 border-slate-800 p-6">
  <h2 className="text-xl font-bold text-white mb-4">
    Material Breakdown
  </h2>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span className="text-slate-400">
        Cement
      </span>

      <span className="text-white">
        {cementBags.toFixed(0)} Bags
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
        Sand
      </span>

      <span className="text-white">
        {sandQty.toFixed(2)} m³
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
        Aggregate
      </span>

      <span className="text-white">
        {aggregateQty.toFixed(2)} m³
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
        Steel
      </span>

      <span className="text-white">
        {totalSteel.toFixed(2)} kg
      </span>
    </div>

  </div>
</Card>
</Card>

    </div>
  )
}
