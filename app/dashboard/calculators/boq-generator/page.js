'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BOQGeneratorPage() {
  const [projectSaved, setProjectSaved] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)

const [boqItems, setBoqItems] = useState([])
const categoryItems = {
  RCC: [
    'RCC Beam',
    'RCC Column',
    'RCC Slab',
    'RCC Footing',
    'RCC Staircase',
  ],

  PCC: [
    'PCC Bed',
    'PCC Flooring',
  ],

  Brickwork: [
    'Brick Wall',
    'Half Brick Wall',
  ],

  Plaster: [
    'Internal Plaster',
    'External Plaster',
  ],

  Flooring: [
    'Vitrified Tiles',
    'Granite Flooring',
  ],

  Painting: [
    'Internal Painting',
    'External Painting',
  ],
}
const [itemData, setItemData] = useState({
  category: '',
  item: '',
  description: '',
  unit: '',
  length: '',
  width: '',
  height: '',
  nos: '',
  quantity: 0 ,
  rate: '',
  amount: 0,
})

  const [project, setProject] = useState({
    projectName: '',
    clientName: '',
    projectLocation: '',
    projectType: 'Residential',
    preparedBy: '',
    date: '',
    revisionNo: '',
  })

  if (!projectSaved) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          BOQ Generator
        </h1>

        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Step 1 - Project Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              placeholder="Project Name"
              value={project.projectName}
              onChange={(e) =>
                setProject({
                  ...project,
                  projectName: e.target.value,
                })
              }
            />

            <Input
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              placeholder="Client Name"
              value={project.clientName}
              onChange={(e) =>
                setProject({
                  ...project,
                  clientName: e.target.value,
                })
              }
            />

            <Input
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              placeholder="Project Location"
              value={project.projectLocation}
              onChange={(e) =>
                setProject({
                  ...project,
                  projectLocation: e.target.value,
                })
              }
            />

            <Input
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              placeholder="Prepared By"
              value={project.preparedBy}
              onChange={(e) =>
                setProject({
                  ...project,
                  preparedBy: e.target.value,
                })
              }
            />

            <Input
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              type="date"
              value={project.date}
              onChange={(e) =>
                setProject({
                  ...project,
                  date: e.target.value,
                })
              }
            />

            <Input
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              placeholder="Revision Number"
              value={project.revisionNo}
              onChange={(e) =>
                setProject({
                  ...project,
                  revisionNo: e.target.value,
                })
              }
            />
          </div>

          <Button
            className="mt-6"
            onClick={() => setProjectSaved(true)}
          >
            Save Project & Continue
          </Button>
        </Card>
      </div>
    )
  }

  return (
  <div className="p-6 lg:p-10">

    <h1 className="text-3xl font-bold text-white mb-2">
      BOQ Builder
    </h1>

    <p className="text-slate-400 mb-6">
      Project: {project.projectName}
    </p>

    <Card className="bg-slate-900/50 border-slate-800 p-6">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-xl font-bold text-white">
            BOQ Items
          </h2>
      
          <p className="text-slate-400">
            Add project items one by one
          </p>
        </div>

        <Button
        onClick={() => setShowItemForm(true)}
       >
         + Add BOQ Item
       </Button>

      </div>
          {showItemForm && (
  <div className="mt-6 border-t border-slate-700 pt-6">

    <h3 className="text-white font-bold mb-4">
      Add BOQ Item
    </h3>

  <select
  className="w-full h-10 rounded-md bg-slate-800 text-white border border-slate-700 mb-3 px-3"
  value={itemData.category}
  onChange={(e) =>
    setItemData({
      ...itemData,
      category: e.target.value,
      item: '',
      description: '',
    })
  }
>
  <option value="">Select Category</option>

  {Object.keys(categoryItems).map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>
  
    <select
  className="w-full h-10 rounded-md bg-slate-800 text-white border border-slate-700 mb-3 px-3"
  value={itemData.item}
  onChange={(e) =>
    setItemData({
      ...itemData,
      item: e.target.value,
      description: `${e.target.value} M25 Grade`,
      unit:
        itemData.category === 'RCC'
          ? 'm³'
          : itemData.category === 'Plaster'
          ? 'm²'
          : 'm³',
    })
  }
>
  <option value="">Select Item</option>

  {(categoryItems[itemData.category] || []).map(
    (item) => (
      <option key={item} value={item}>
        {item}
      </option>
    )
  )}
</select>

    <Input
      className="bg-slate-800 text-white mb-3"
      placeholder="Description"
      value={itemData.description}
      onChange={(e) =>
        setItemData({
          ...itemData,
          description: e.target.value,
        })
      }
    />
    <Input
  className="bg-slate-800 text-white mb-3"
  placeholder="Unit"
  value={itemData.unit}
  readOnly
/>

<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">

  <Input
    className="bg-slate-800 text-white"
    placeholder="Length"
    type="number"
    value={itemData.length}
    onChange={(e) =>
      setItemData({
        ...itemData,
        length: e.target.value,
      })
    }
  />

  <Input
    className="bg-slate-800 text-white"
    placeholder="Width"
    type="number"
    value={itemData.width}
    onChange={(e) =>
      setItemData({
        ...itemData,
        width: e.target.value,
      })
    }
  />

  <Input
    className="bg-slate-800 text-white"
    placeholder="Height"
    type="number"
    value={itemData.height}
    onChange={(e) =>
      setItemData({
        ...itemData,
        height: e.target.value,
      })
    }
  />

  <Input
    className="bg-slate-800 text-white"
    placeholder="Nos"
    type="number"
    value={itemData.nos}
    onChange={(e) =>
      setItemData({
        ...itemData,
        nos: e.target.value,
      })
    }
  />

</div>

<Input
  className="bg-slate-800 text-white mb-3"
  placeholder="Rate"
  type="number"
  value={itemData.rate}
  onChange={(e) =>
    setItemData({
      ...itemData,
      rate: e.target.value,
    })
  }
/>

    <Button
      onClick={() => {
        setBoqItems([
  ...boqItems,
  {
    ...itemData,

    quantity:
      (Number(itemData.length) || 0) *
      (Number(itemData.width) || 0) *
      (Number(itemData.height) || 0) *
      (Number(itemData.nos) || 0),

    amount:
      (
        (Number(itemData.length) || 0) *
        (Number(itemData.width) || 0) *
        (Number(itemData.height) || 0) *
        (Number(itemData.nos) || 0)
      ) *
      (Number(itemData.rate) || 0),
  },
])
        setItemData({
          category: '',
          item: '',
          description: '',
          unit: '',
          length: '',
          width: '',
          height: '',
          nos: '',
          rate: '',
        })

        setShowItemForm(false)
      }}
    >
  <Card className="bg-slate-800 border-slate-700 p-4 mb-6">

  <div className="grid grid-cols-2 gap-4">

    <div>
      <p className="text-slate-400 text-sm">
        Calculated Quantity
      </p>

      <p className="text-2xl font-bold text-white">
        {(
          (Number(itemData.length) || 0) *
          (Number(itemData.width) || 0) *
          (Number(itemData.height) || 0) *
          (Number(itemData.nos) || 0)
        ).toFixed(2)}
      </p>
    </div>

    <div>
      <p className="text-slate-400 text-sm">
        Calculated Amount
      </p>

      <p className="text-2xl font-bold text-green-400">
        ₹
        {(
          (
            (Number(itemData.length) || 0) *
            (Number(itemData.width) || 0) *
            (Number(itemData.height) || 0) *
            (Number(itemData.nos) || 0)
          ) *
          (Number(itemData.rate) || 0)
        ).toFixed(2)}
      </p>
    </div>

  </div>

</Card>
      Add To BOQ
    </Button>

  </div>
)}
{boqItems.length > 0 && (

<Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">

  <h2 className="text-xl font-bold text-white mb-4">
    BOQ Table
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full text-white">

      <thead>
        <tr className="border-b border-slate-700">

          <th className="text-left p-2">S.No</th>
          <th className="text-left p-2">Category</th>
          <th className="text-left p-2">Item</th>
          <th className="text-left p-2">Description</th>
          <th className="text-left p-2">Unit</th>
          <th className="text-left p-2">Qty</th>
          <th className="text-left p-2">Rate</th>
          <th className="text-left p-2">Amount</th>
          <th className="text-left p-2">Action</th>

        </tr>
      </thead>

      <tbody>

        {boqItems.map((row, index) => (

          <tr
            key={index}
            className="border-b border-slate-800"
          >

            <td className="p-2">{index + 1}</td>

            <td className="p-2">{row.category}</td>

            <td className="p-2">{row.item}</td>

            <td className="p-2">
              {row.description}
            </td>

            <td className="p-2">{row.unit}</td>

            <td className="p-2">
              {Number(row.quantity).toFixed(2)}
            </td>

            <td className="p-2">
              ₹{row.rate}
            </td>

            <td className="p-2 text-green-400">
              ₹{Number(row.amount).toFixed(2)}
            </td>

            <td className="p-2">

              <Button
                variant="destructive"
                size="sm"
                 onClick={() =>
                  setBoqItems(
                    boqItems.filter(
                      (_, i) => i !== index
                    )
                  )
                }
              >
                Delete
              </Button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</Card>

)}
    </Card>

  </div>
)
}
