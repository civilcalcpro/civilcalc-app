'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc ,
  updateDoc
} from 'firebase/firestore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAuth } from '@/lib/auth-context'
export default function BOQGeneratorPage() {
    const { authFetch } = useAuth()
  const [projectSaved, setProjectSaved] = useState(false)
  const [showDrafts, setShowDrafts] = useState(true)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)

const [boqItems, setBoqItems] = useState([])
  const [savedDrafts, setSavedDrafts] = useState([])
  const [currentDraftId, setCurrentDraftId] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
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
  grade: '',
  unit: '',
  length: '',
  width: '',
  height: '',
  nos: '',
  quantity: 0 ,
  rate: '',
  amount: 0,
})
  const [gstPercent, setGstPercent] = useState(18)

const [contractorMarginPercent, setContractorMarginPercent] = useState(10)

const [wastagePercent, setWastagePercent] = useState(5)
 let calculatedQuantity = 0

const length = Number(itemData.length) || 0
const width = Number(itemData.width) || 0
const height = Number(itemData.height) || 0
const nos = Number(itemData.nos) || 0

switch (itemData.category) {

  case 'RCC':
  case 'PCC':
  case 'Brickwork':
    calculatedQuantity =
      length * width * height * nos
    break

  case 'Plaster':
  case 'Painting':
    calculatedQuantity =
      length * height * nos
    break

  case 'Flooring':
    calculatedQuantity =
      length * width * nos
    break

  default:
    calculatedQuantity =
      length * width * height * nos
}
  const requiresWidth =
  ['RCC', 'PCC', 'Brickwork', 'Flooring'].includes(itemData.category)

const requiresHeight =
  ['RCC', 'PCC', 'Brickwork', 'Plaster', 'Painting'].includes(itemData.category)
  const materialDatabase = {

  M10: {
    cement: 6.70,
    sand: 0.56,
    aggregate: 1.12,
  },

  M15: {
    cement: 8.00,
    sand: 0.53,
    aggregate: 1.06,
  },

  M20: {
    cement: 9.20,
    sand: 0.46,
    aggregate: 0.92,
  },

  M25: {
    cement: 11.10,
    sand: 0.39,
    aggregate: 0.77,
  },

  M30: {
    cement: 12.00,
    sand: 0.36,
    aggregate: 0.72,
  },

  M35: {
    cement: 12.80,
    sand: 0.34,
    aggregate: 0.68,
  },

  M40: {
    cement: 13.50,
    sand: 0.32,
    aggregate: 0.64,
  },

}
  const steelRatio = {
  'RCC Beam': 100,
  'RCC Column': 130,
  'RCC Slab': 80,
  'RCC Footing': 70,
  'RCC Staircase': 90,
}
  const selectedGrade =
  materialDatabase[itemData.grade]

const cementBags =
  selectedGrade
    ? calculatedQuantity * selectedGrade.cement
    : 0

const sandQty =
  selectedGrade
    ? calculatedQuantity * selectedGrade.sand
    : 0

const aggregateQty =
  selectedGrade
    ? calculatedQuantity * selectedGrade.aggregate
    : 0
 
const steelQty =
  calculatedQuantity *
  (steelRatio[itemData.item] || 0)
  const totalCement = boqItems.reduce(
  (sum, item) => sum + (item.cementBags || 0),
  0
)

const totalSand = boqItems.reduce(
  (sum, item) => sum + (item.sandQty || 0),
  0
)

const totalAggregate = boqItems.reduce(
  (sum, item) => sum + (item.aggregateQty || 0),
  0
)

const totalSteel = boqItems.reduce(
  (sum, item) => sum + (item.steelQty || 0),
  0
)
const saveDraft = async () => {
  console.log('SAVE DRAFT CLICKED')

  const draft = {
    project,
    boqItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const syncProjectToDashboard = async (firestoreDraftId) => {
    try {
      const subtotalValue = boqItems.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      )

      const gstAmountValue =
        subtotalValue * gstPercent / 100

      const contractorMarginAmountValue =
        subtotalValue * contractorMarginPercent / 100

      const wastageAmountValue =
        subtotalValue * wastagePercent / 100

      const grandTotalValue =
        subtotalValue +
        gstAmountValue +
        contractorMarginAmountValue +
        wastageAmountValue

      await authFetch('/api/projects/save', {
        method: 'POST',
        body: JSON.stringify({
          source: 'boq-generator',
          firestoreDraftId,
          project,
          boqItems,
          itemCount: boqItems.length,
          totals: {
            subtotal: subtotalValue,
            gstPercent,
            gstAmount: gstAmountValue,
            contractorMarginPercent,
            contractorMarginAmount: contractorMarginAmountValue,
            wastagePercent,
            wastageAmount: wastageAmountValue,
            grandTotal: grandTotalValue,
          },
        }),
      })
    } catch (error) {
      console.error('Dashboard project sync failed:', error)
    }
  }

  if (currentDraftId) {
    try {
      await updateDoc(
        doc(db, 'boqProjects', currentDraftId),
        draft
      )

      await syncProjectToDashboard(currentDraftId)

      alert('Draft Updated Successfully')

      return
    } catch (error) {
      console.error(error)
      alert('Error Updating Draft')
      return
    }
  }

  try {
    const docRef = await addDoc(
      collection(db, 'boqProjects'),
      draft
    )

    setCurrentDraftId(docRef.id)

    await syncProjectToDashboard(docRef.id)

    console.log('FIRESTORE SAVE SUCCESS')

    alert('Draft Saved Successfully')
  } catch (error) {
    console.error(error)
    alert('Error Saving Draft')
  }
}   const exportToCSV = () => {

  let csvContent = ''

  csvContent += `Project Name,${project.projectName}\n`
  csvContent += `Client Name,${project.clientName}\n`
  csvContent += `Project Location,${project.projectLocation}\n`
  csvContent += `Prepared By,${project.preparedBy}\n`
  csvContent += `Date,${project.date}\n\n`

  csvContent += 'Category,Item,Description,Unit,Quantity,Rate,Amount\n'

  boqItems.forEach((item) => {

    csvContent += `${item.category},${item.item},${item.description},${item.unit},${item.quantity},${item.rate},${item.amount}\n`

  })

  csvContent += '\n'

  csvContent += `Subtotal,${subtotal}\n`
  csvContent += `GST (${gstPercent}%),${gstAmount}\n`
  csvContent += `Wastage (${wastagePercent}%),${wastageAmount}\n`
  csvContent += `Contractor Margin (${contractorMarginPercent}%),${contractorMarginAmount}\n`
  csvContent += `Grand Total,${grandTotal}\n`

  const blob = new Blob(
    [csvContent],
    { type: 'text/csv;charset=utf-8;' }
  )

  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `${project.projectName || 'BOQ'}_Export.csv`
  )

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

}
  const exportBOQPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(18)

  doc.text(
    'BOQ REPORT',
    14,
    20
  )

  doc.setFontSize(11)

  doc.text(
    `Project Name: ${project.projectName}`,
    14,
    35
  )

  doc.text(
    `Client Name: ${project.clientName}`,
    14,
    43
  )

  doc.text(
    `Location: ${project.projectLocation}`,
    14,
    51
  )

  doc.text(
    `Prepared By: ${project.preparedBy}`,
    14,
    59
  )

  doc.text(
    `Date: ${project.date}`,
    14,
    67
  )

  doc.text(
    `Revision No: ${project.revisionNo}`,
    14,
    75
  )

  autoTable(doc, {

    startY: 90,

    head: [[
      'Category',
      'Item',
      'Description',
      'Unit',
      'Qty',
      'Rate',
      'Amount'
    ]],

  body: boqItems.map(item => [

  item.category,
  item.item,
  item.description,
  item.unit,
  Number(item.quantity).toFixed(2),
  `Rs. ${Number(item.rate).toFixed(2)}`,
  `Rs. ${Number(item.amount).toFixed(2)}`

])
  })

  const finalY =
    doc.lastAutoTable.finalY + 15

  doc.setFontSize(14)

  doc.text(
  `Grand Total: Rs. ${grandTotal.toFixed(2)}`,
  14,
  finalY
)

  doc.save(
    `${project.projectName || 'BOQ'}_Report.pdf`
  )

}
  const exportMaterialPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(18)

  doc.text(
    'MATERIAL BREAKDOWN REPORT',
    14,
    20
  )

  doc.setFontSize(11)

  doc.text(
    `Project Name: ${project.projectName}`,
    14,
    35
  )

  doc.text(
    `Client Name: ${project.clientName}`,
    14,
    43
  )

  let y = 60

  boqItems.forEach((item) => {

    doc.setFontSize(13)

    doc.text(
      `${item.item}`,
      14,
      y
    )

    y += 8

    doc.setFontSize(11)

    doc.text(
      `Cement: ${Number(item.cementBags || 0).toFixed(2)} Bags`,
      20,
      y
    )

    y += 8

    doc.text(
      `Sand: ${Number(item.sandQty || 0).toFixed(2)} m³`,
      20,
      y
    )

    y += 8

    doc.text(
      `Aggregate: ${Number(item.aggregateQty || 0).toFixed(2)} m³`,
      20,
      y
    )

    y += 8

    doc.text(
      `Steel: ${Number(item.steelQty || 0).toFixed(2)} Kg`,
      20,
      y
    )

    y += 12

    if (y > 250) {

      doc.addPage()

      y = 20

    }

  })

  y += 10

  doc.setFontSize(15)

  doc.text(
    'TOTAL MATERIAL SUMMARY',
    14,
    y
  )

  y += 12

  doc.setFontSize(11)

  doc.text(
    `Total Cement: ${totalCement.toFixed(2)} Bags`,
    20,
    y
  )

  y += 8

  doc.text(
    `Total Sand: ${totalSand.toFixed(2)} m³`,
    20,
    y
  )

  y += 8

  doc.text(
    `Total Aggregate: ${totalAggregate.toFixed(2)} m³`,
    20,
    y
  )

  y += 8

  doc.text(
    `Total Steel: ${totalSteel.toFixed(2)} Kg`,
    20,
    y
  )

  doc.save(
    `${project.projectName || 'BOQ'}_Material_Report.pdf`
  )

}
  const exportCostPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(18)

  doc.text(
    'COST SUMMARY REPORT',
    14,
    20
  )

  doc.setFontSize(11)

  doc.text(
    `Project Name: ${project.projectName}`,
    14,
    35
  )

  doc.text(
    `Client Name: ${project.clientName}`,
    14,
    43
  )

  doc.text(
    `Location: ${project.projectLocation}`,
    14,
    51
  )

  doc.text(
    `Prepared By: ${project.preparedBy}`,
    14,
    59
  )

  doc.text(
    `Date: ${project.date}`,
    14,
    67
  )

  autoTable(doc, {

    startY: 85,

    head: [['Cost Item', 'Amount']],

    body: [

      [
        'Subtotal',
        `Rs. ${subtotal.toFixed(2)}`
      ],

      [
        `Wastage (${wastagePercent}%)`,
        `Rs. ${wastageAmount.toFixed(2)}`
      ],

      [
        `GST (${gstPercent}%)`,
        `Rs. ${gstAmount.toFixed(2)}`
      ],

      [
        `Contractor Margin (${contractorMarginPercent}%)`,
        `Rs. ${contractorMarginAmount.toFixed(2)}`
      ]

    ]

  })

  const finalY =
    doc.lastAutoTable.finalY + 15

  doc.setFontSize(16)

  doc.text(
    `GRAND TOTAL : Rs. ${grandTotal.toFixed(2)}`,
    14,
    finalY
  )

  doc.save(
    `${project.projectName || 'BOQ'}_Cost_Report.pdf`
  )

}
useEffect(() => {

  const loadDrafts = async () => {

    const snapshot = await getDocs(
      collection(db, 'boqProjects')
    )

    const drafts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setSavedDrafts(drafts)

  }

  loadDrafts()

}, [])
const subtotal = boqItems.reduce(
  (sum, item) => sum + (item.amount || 0),
  0
)

const gstAmount =
  subtotal * gstPercent / 100

const contractorMarginAmount =
  subtotal * contractorMarginPercent / 100

const wastageAmount =
  subtotal * wastagePercent / 100

const grandTotal =
  subtotal +
  gstAmount +
  contractorMarginAmount +
  wastageAmount
  const [project, setProject] = useState({
    projectName: '',
    clientName: '',
    projectLocation: '',
    projectType: 'Residential',
    preparedBy: '',
    date: '',
    revisionNo: '',
  })
if (!projectSaved && !showProjectForm) {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold text-white mb-6">
        BOQ Generator
      </h1>

      <Button
        className="mb-6"
        onClick={() => {
          setShowDrafts(false)
          setShowProjectForm(true)
        }}
      >
        + New Project
      </Button>

      {showDrafts && savedDrafts.length > 0 && (

        <Card className="bg-slate-900/50 border-slate-800 p-6">

          <h2 className="text-xl font-bold text-white">
            Saved Drafts
          </h2>
<div className="space-y-3 mt-4">

  {savedDrafts.map((draft) => (

    <div
      key={draft.id}
      className="bg-slate-800 p-4 rounded-lg flex justify-between items-center"
    >

      <div>

        <p className="text-white font-semibold">
          {draft.project?.projectName}
        </p>

        <p className="text-slate-400 text-sm">
          {draft.createdAt}
        </p>

      </div>

      <div className="flex gap-2">

      <Button
  size="sm"
  onClick={() => {
    setProject(draft.project)
    setBoqItems(draft.boqItems || [])
    setProjectSaved(true)
    setShowProjectForm(false)
    setShowDrafts(false)
    setCurrentDraftId(draft.id)
  }}
>
  Continue
</Button>
       <Button
  variant="destructive"
  size="sm"
  onClick={async () => {
    await deleteDoc(
      doc(db, 'boqProjects', draft.id)
    )

    try {
      await authFetch(`/api/projects/${draft.id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Dashboard project delete sync failed:', error)
    }

    setSavedDrafts(
      savedDrafts.filter(
        (item) => item.id !== draft.id
      )
    )
  }}
>
  Delete
</Button>

      </div>

    </div>

  ))}

</div>
        </Card>

      )}

    </div>
  )
}
if (!projectSaved && showProjectForm) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          BOQ Generator
      
        </h1>
      <Button
  className="mb-6"
 onClick={() => {
  setShowDrafts(false)
  setShowProjectForm(true)
}}
>
  + New Project
</Button>
    {showDrafts && savedDrafts.length > 0 && (

<Card className="bg-slate-900/50 border-slate-800 p-6 mb-6">

  <h2 className="text-xl font-bold text-white mb-4">
    Saved Drafts
  </h2>

</Card>

)}

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
<Button
  variant="outline"
  className="mb-4"
  onClick={() => {
    setProjectSaved(false)
    setShowProjectForm(true)
  }}
>
  ← Edit Project Details
</Button>
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
    <select
  className="w-full h-10 rounded-md bg-slate-800 text-white border border-slate-700 mb-3 px-3"
  value={itemData.grade}
  onChange={(e) =>
    setItemData({
      ...itemData,
      grade: e.target.value,
    })
  }
>
  <option value="">Select Concrete Grade</option>

  <option value="M10">M10</option>
  <option value="M15">M15</option>
  <option value="M20">M20</option>
  <option value="M25">M25</option>
  <option value="M30">M30</option>
  <option value="M35">M35</option>
  <option value="M40">M40</option>

</select>
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

 {requiresWidth && (
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
)}

 {requiresHeight && (
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
)}
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
   <Card className="bg-slate-800 border-slate-700 p-4 mb-6">

  <h3 className="text-white font-bold mb-4">
    Material Breakdown
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <div>
      <p className="text-slate-400 text-sm">
        Cement
      </p>

      <p className="text-xl font-bold text-white">
        {cementBags.toFixed(2)} Bags
      </p>
    </div>

    <div>
      <p className="text-slate-400 text-sm">
        Sand
      </p>

      <p className="text-xl font-bold text-white">
        {sandQty.toFixed(2)} m³
      </p>
    </div>

    <div>
      <p className="text-slate-400 text-sm">
        Aggregate
      </p>

      <p className="text-xl font-bold text-white">
        {aggregateQty.toFixed(2)} m³
      </p>
    </div>

    <div>
      <p className="text-slate-400 text-sm">
        Steel
      </p>

      <p className="text-xl font-bold text-green-400">
        {steelQty.toFixed(2)} Kg
      </p>
    </div>

  </div>

</Card>
   <Button
  onClick={() => {

    if (
      !itemData.category ||
      !itemData.item ||
      !itemData.description
    ) {
      alert('Please fill all required fields')
      return
    }

   const newItem = {
  ...itemData,

  quantity:
    calculatedQuantity,

  amount:
    calculatedQuantity *
    (Number(itemData.rate) || 0),

  cementBags,
  sandQty,
  aggregateQty,
  steelQty,
}

    if (editingIndex !== null) {

      const updatedItems = [...boqItems]

      updatedItems[editingIndex] = newItem

      setBoqItems(updatedItems)

      setEditingIndex(null)

    } else {

      setBoqItems([
        ...boqItems,
        newItem,
      ])

    }

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
  {editingIndex !== null
    ? 'Update Item'
    : 'Add To BOQ'}
</Button>

  </div>
)}
{boqItems.length > 0 && (
  <>

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
    size="sm"
    className="mr-2"
    onClick={() => {
      setItemData(row)
      setEditingIndex(index)
      setShowItemForm(true)
    }}
  >
    Edit
  </Button>

  <Button
    size="sm"
    className="mr-2"
    onClick={() => {
      const duplicatedItem = {
        ...row
      }

      setBoqItems([
        ...boqItems,
        duplicatedItem
      ])
    }}
  >
    Duplicate
  </Button>

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
<Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">

  <h2 className="text-xl font-bold text-white mb-4">
    Material Summary
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <div>
      <p className="text-slate-400">Total Cement</p>
      <p className="text-2xl font-bold text-white">
        {totalCement.toFixed(2)} Bags
      </p>
    </div>

    <div>
      <p className="text-slate-400">Total Sand</p>
      <p className="text-2xl font-bold text-white">
        {totalSand.toFixed(2)} m³
      </p>
    </div>

    <div>
      <p className="text-slate-400">Total Aggregate</p>
      <p className="text-2xl font-bold text-white">
        {totalAggregate.toFixed(2)} m³
      </p>
    </div>

    <div>
      <p className="text-slate-400">Total Steel</p>
      <p className="text-2xl font-bold text-green-400">
        {totalSteel.toFixed(2)} Kg
      </p>
    </div>

  </div>

</Card>
          <Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">

  <h2 className="text-xl font-bold text-white mb-4">
    Cost Summary
  </h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div>
    <label className="text-slate-400 text-sm block mb-2">
      GST Percentage (%)
    </label>

    <Input
      className="bg-slate-800 text-white"
      type="number"
      value={gstPercent}
      onChange={(e) =>
        setGstPercent(Number(e.target.value))
      }
    />
  </div>

  <div>
    <label className="text-slate-400 text-sm block mb-2">
      Contractor Margin (%)
    </label>

    <Input
      className="bg-slate-800 text-white"
      type="number"
      value={contractorMarginPercent}
      onChange={(e) =>
        setContractorMarginPercent(
          Number(e.target.value)
        )
      }
    />
  </div>

  <div>
    <label className="text-slate-400 text-sm block mb-2">
      Wastage Percentage (%)
    </label>

    <Input
      className="bg-slate-800 text-white"
      type="number"
      value={wastagePercent}
      onChange={(e) =>
        setWastagePercent(
          Number(e.target.value)
        )
      }
    />
  </div>

</div>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span className="text-slate-400">
        Subtotal
      </span>

      <span className="text-white">
        ₹{subtotal.toFixed(2)}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
       Wastage ({wastagePercent}%)
      </span>

      <span className="text-white">
        ₹{wastageAmount.toFixed(2)}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
       GST ({gstPercent}%)
      </span>

      <span className="text-white">
        ₹{gstAmount.toFixed(2)}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
       Contractor Margin ({contractorMarginPercent}%)
      </span>

      <span className="text-white">
        ₹{contractorMarginAmount.toFixed(2)}
      </span>
    </div>

    <hr className="border-slate-700" />

    <div className="flex justify-between">

      <span className="text-2xl font-bold text-white">
        Grand Total
      </span>

      <span className="text-3xl font-bold text-green-400">
        ₹{grandTotal.toFixed(2)}
      </span>

    </div>

  </div>
<div className="mt-6 flex gap-3 flex-wrap">

  <Button
    onClick={saveDraft}
  >
    Save Draft
  </Button>

  <Button
    onClick={exportToCSV}
  >
    Export CSV
  </Button>

  <Button
    onClick={exportBOQPDF}
  >
    BOQ PDF
  </Button>
  <Button
  onClick={exportMaterialPDF}
>
  Material PDF
</Button>
  <Button
  onClick={exportCostPDF}
>
  Cost PDF
</Button>

</div>
</Card>

  </>
)}

</Card>

</div>
)
}
