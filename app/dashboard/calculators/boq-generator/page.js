'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAuth } from '@/lib/auth-context'

const INITIAL_PROJECT = {
  projectName: '',
  clientName: '',
  projectLocation: '',
  projectType: 'Residential',
  preparedBy: '',
  date: '',
  revisionNo: '',
}

const INITIAL_ITEM = {
  category: '',
  item: '',
  description: '',
  grade: '',
  unit: '',
  length: '',
  width: '',
  height: '',
  nos: '1',
  rate: '',
}

const CATEGORY_LIBRARY = {
  Excavation: [
    {
      name: 'Foundation Excavation',
      description:
        'Excavation in foundation trenches including dressing, leveling and disposal of excavated soil as per site requirement.',
      unit: 'm³',
      rate: 250,
    },
    {
      name: 'Earthwork Excavation',
      description:
        'Earthwork excavation for building foundation, footing and service trenches including site leveling.',
      unit: 'm³',
      rate: 220,
    },
    {
      name: 'Basement Excavation',
      description:
        'Bulk excavation for basement including trimming of sides, dressing of bed and disposal of surplus soil.',
      unit: 'm³',
      rate: 300,
    },
  ],

  PCC: [
    {
      name: 'PCC Bed',
      description:
        'Plain cement concrete bed below footing/foundation with proper leveling and compaction.',
      unit: 'm³',
      rate: 5200,
      defaultGrade: 'M10',
    },
    {
      name: 'PCC Flooring',
      description:
        'Plain cement concrete flooring layer with proper compaction, finishing and curing.',
      unit: 'm³',
      rate: 5400,
      defaultGrade: 'M15',
    },
  ],

  RCC: [
    {
      name: 'RCC Beam',
      description:
        'Reinforced cement concrete beam including concrete and steel reinforcement estimate.',
      unit: 'm³',
      rate: 8200,
      defaultGrade: 'M25',
    },
    {
      name: 'RCC Column',
      description:
        'Reinforced cement concrete column including concrete and steel reinforcement estimate.',
      unit: 'm³',
      rate: 8500,
      defaultGrade: 'M25',
    },
    {
      name: 'RCC Slab',
      description:
        'Reinforced cement concrete slab including concrete and steel reinforcement estimate.',
      unit: 'm³',
      rate: 8000,
      defaultGrade: 'M20',
    },
    {
      name: 'RCC Footing',
      description:
        'Reinforced cement concrete footing including concrete and steel reinforcement estimate.',
      unit: 'm³',
      rate: 7800,
      defaultGrade: 'M20',
    },
    {
      name: 'RCC Staircase',
      description:
        'Reinforced cement concrete staircase including waist slab and steps reference quantity.',
      unit: 'm³',
      rate: 8500,
      defaultGrade: 'M25',
    },
        {
      name: 'RCC Lintel',
      description:
        'Reinforced cement concrete lintel over door and window openings including concrete and steel reinforcement estimate.',
      unit: 'm³',
      rate: 8200,
      defaultGrade: 'M20',
    },
    {
      name: 'RCC Chajja',
      description:
        'Reinforced cement concrete chajja projection above door/window for weather protection including concrete and reinforcement estimate.',
      unit: 'm³',
      rate: 8500,
      defaultGrade: 'M20',
    },
    {
      name: 'RCC Sill Band',
      description:
        'Reinforced cement concrete sill band at window sill level including concrete and reinforcement estimate.',
      unit: 'm³',
      rate: 8000,
      defaultGrade: 'M20',
    },
    {
      name: 'RCC Plinth Beam',
      description:
        'Reinforced cement concrete plinth beam at plinth level including concrete and steel reinforcement estimate.',
      unit: 'm³',
      rate: 8500,
      defaultGrade: 'M25',
    },
    {
      name: 'RCC Tie Beam',
      description:
        'Reinforced cement concrete tie beam connecting structural members including concrete and reinforcement estimate.',
      unit: 'm³',
      rate: 8500,
      defaultGrade: 'M25',
    },
    {
      name: 'RCC Roof Beam',
      description:
        'Reinforced cement concrete roof beam including concrete and steel reinforcement estimate.',
      unit: 'm³',
      rate: 8600,
      defaultGrade: 'M25',
    },
    
  ],

  Brickwork: [
    {
      name: 'Brickwork 230mm Wall',
      description:
        'Brick masonry work in cement mortar for 230mm thick wall including scaffolding and curing.',
      unit: 'm³',
      rate: 6500,
    },
     {
      name: 'Half Brick Wall 115mm',
      description:
        'Half brick masonry work in cement mortar for 115mm thick partition wall including curing.',
      unit: 'm²',
      rate: 950,
    },
    {
      name: 'Brickwork Foundation',
      description:
        'Brick masonry work in foundation and plinth using first class bricks in cement mortar.',
      unit: 'm³',
      rate: 7000,
    },
  ],

  Plaster: [
    {
      name: 'Internal Plaster 12mm',
      description:
        'Internal cement plaster 12mm thick in cement mortar including surface preparation and curing.',
      unit: 'm²',
      rate: 180,
    },
    {
      name: 'External Plaster 15mm',
      description:
        'External cement plaster 15mm thick in cement mortar including scaffolding and curing.',
      unit: 'm²',
      rate: 240,
    },
  ],

  Flooring: [
    {
      name: 'Vitrified Tiles Flooring',
      description:
        'Vitrified tile flooring including laying, joint filling and finishing complete.',
      unit: 'm²',
      rate: 950,
    },
    {
      name: 'Granite Flooring',
      description:
        'Granite stone flooring including laying, polishing and finishing complete.',
      unit: 'm²',
      rate: 1800,
    },
  ],

  Painting: [
    {
      name: 'Internal Painting',
      description:
        'Internal wall painting with primer and two coats of paint over prepared surface.',
      unit: 'm²',
      rate: 120,
    },
    {
      name: 'External Painting',
      description:
        'External wall painting with weatherproof paint over prepared surface.',
      unit: 'm²',
      rate: 150,
    },
  ],

  'Steel Work': [
    {
      name: 'Structural Steel Work',
      description:
        'Structural steel work including cutting, welding, fixing and fabrication reference quantity.',
      unit: 'kg',
      rate: 95,
    },
    {
      name: 'MS Railing Work',
      description:
        'Mild steel railing work including fabrication, fixing and basic finishing reference quantity.',
      unit: 'kg',
      rate: 120,
    },
  ],

  Waterproofing: [
    {
      name: 'Terrace Waterproofing',
      description:
        'Terrace waterproofing treatment including surface preparation and protective coat.',
      unit: 'm²',
      rate: 350,
    },
    {
      name: 'Bathroom Waterproofing',
      description:
        'Bathroom waterproofing treatment including floor and wall dado area reference quantity.',
      unit: 'm²',
      rate: 300,
    },
  ],

  'Finishing Work': [
    {
      name: 'Door Installation',
      description:
        'Door frame and shutter installation including basic fixing and finishing reference item.',
      unit: 'Nos',
      rate: 4500,
    },
    {
      name: 'Window Installation',
      description:
        'Window frame and shutter installation including basic fixing and finishing reference item.',
      unit: 'Nos',
      rate: 3500,
    },
  ],
}

const CONCRETE_MATERIAL_DATABASE = {
  M10: { cement: 6.7, sand: 0.56, aggregate: 1.12 },
  M15: { cement: 8.0, sand: 0.53, aggregate: 1.06 },
  M20: { cement: 9.2, sand: 0.46, aggregate: 0.92 },
  M25: { cement: 11.1, sand: 0.39, aggregate: 0.77 },
  M30: { cement: 12.0, sand: 0.36, aggregate: 0.72 },
  M35: { cement: 12.8, sand: 0.34, aggregate: 0.68 },
  M40: { cement: 13.5, sand: 0.32, aggregate: 0.64 },
}

// Steel is calculated ONLY for RCC items by kg/m³ ratio.
// Brickwork, plaster, flooring, painting, excavation and waterproofing do NOT add steel automatically.
// For lintel/chajja/RCC band use RCC item. For railing/fabrication use Steel Work item.
const RCC_STEEL_RATIO = {
  'RCC Beam': 100,
  'RCC Column': 130,
  'RCC Slab': 80,
  'RCC Footing': 70,
  'RCC Staircase': 90,
  'RCC Lintel': 90,
  'RCC Chajja': 80,
  'RCC Sill Band': 70,
  'RCC Plinth Beam': 110,
  'RCC Tie Beam': 100,
  'RCC Roof Beam': 110,
}

const numberValue = (value) => Number(value) || 0

const cleanText = (value) =>
  String(value ?? '')
    .replace(/₹/g, 'Rs.')
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E]/g, '')

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`

const formatPdfMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`

const formatQty = (value, digits = 2) => Number(value || 0).toFixed(digits)

const fileSafeName = (name) =>
  cleanText(name || 'BOQ')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '-') || 'BOQ'

const escapeCSV = (value) => {
  const text = String(value ?? '')
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const getSelectedMeta = (category, itemName) =>
  (CATEGORY_LIBRARY[category] || []).find((item) => item.name === itemName)

const needsGrade = (category) => category === 'RCC' || category === 'PCC'

const needsLength = (item) => item.category !== 'Finishing Work'

const needsWidth = (item) => {
  if (!item.category) return false
  if (item.category === 'Brickwork' && item.unit === 'm²') return false

  return [
    'Excavation',
    'RCC',
    'PCC',
    'Brickwork',
    'Flooring',
    'Waterproofing',
  ].includes(item.category)
}

const needsHeight = (item) => {
  if (!item.category) return false
  if (item.category === 'Brickwork' && item.unit === 'm²') return true

  return [
    'Excavation',
    'RCC',
    'PCC',
    'Brickwork',
    'Plaster',
    'Painting',
  ].includes(item.category)
}

const getLengthLabel = (item) => {
  if (item.category === 'Steel Work') return 'Quantity / Weight'
  return 'Length'
}

const getFormulaLabel = (item) => {
  if (!item.category) return 'Select category to see formula'
  if (item.category === 'Finishing Work') return 'Quantity = Nos'
  if (item.category === 'Steel Work') return 'Quantity = Entered kg × Nos'
  if (item.category === 'Brickwork' && item.unit === 'm²') {
    return 'Quantity = Length × Height × Nos'
  }
  if (['Plaster', 'Painting'].includes(item.category)) {
    return 'Quantity = Length × Height × Nos'
  }
  if (['Flooring', 'Waterproofing'].includes(item.category)) {
    return 'Quantity = Length × Width × Nos'
  }

  return 'Quantity = Length × Width × Height × Nos'
}

const calculateQuantity = (item) => {
  const length = numberValue(item.length)
  const width = numberValue(item.width)
  const height = numberValue(item.height)
  const nos = numberValue(item.nos)

  if (!item.category) return 0

  if (item.category === 'Finishing Work') {
    return nos
  }

  if (item.category === 'Steel Work') {
    return length * nos
  }

  if (item.category === 'Brickwork' && item.unit === 'm²') {
    return length * height * nos
  }

  if (['Plaster', 'Painting'].includes(item.category)) {
    return length * height * nos
  }

  if (['Flooring', 'Waterproofing'].includes(item.category)) {
    return length * width * nos
  }

  return length * width * height * nos
}

const calculateBrickNos = (item, quantity) => {
  if (item.category !== 'Brickwork') return 0

  const text = `${item.item || ''} ${item.description || ''}`.toLowerCase()

  // Thumb rules with 5% wastage:
  // 1 m³ brick masonry = approx 500 bricks.
  // 115mm half brick wall = approx 56 bricks/m².
  // 230mm wall by area = approx 112 bricks/m².
  if (item.unit === 'm³') return Math.ceil(quantity * 500 * 1.05)

  if (item.unit === 'm²') {
    if (text.includes('115') || text.includes('half')) {
      return Math.ceil(quantity * 56 * 1.05)
    }

    return Math.ceil(quantity * 112 * 1.05)
  }

  return 0
}

const calculateMaterials = (item, quantity) => {
  const materials = {
    cementBags: 0,
    sandQty: 0,
    aggregateQty: 0,
    steelQty: 0,
    brickNos: 0,
    excavationVolume: 0,
  }

  if (!item.category || !quantity) return materials

  if (item.category === 'Excavation') {
    materials.excavationVolume = quantity
    return materials
  }

  if (item.category === 'RCC' || item.category === 'PCC') {
    const selectedGrade = CONCRETE_MATERIAL_DATABASE[item.grade]

    if (selectedGrade) {
      materials.cementBags = quantity * selectedGrade.cement
      materials.sandQty = quantity * selectedGrade.sand
      materials.aggregateQty = quantity * selectedGrade.aggregate
    }

    if (item.category === 'RCC') {
      materials.steelQty = quantity * (RCC_STEEL_RATIO[item.item] || 0)
    }

    return materials
  }

  if (item.category === 'Brickwork') {
    const brickVolume = item.unit === 'm²' ? quantity * 0.115 : quantity

    materials.brickNos = calculateBrickNos(item, quantity)
    materials.cementBags = brickVolume * 1.26
    materials.sandQty = brickVolume * 0.3

    return materials
  }

  if (item.category === 'Plaster') {
    const plasterThickness = String(item.item || '').toLowerCase().includes('external')
      ? 0.015
      : 0.012

    const plasterVolume = quantity * plasterThickness

    materials.cementBags = plasterVolume * 8
    materials.sandQty = plasterVolume * 0.85

    return materials
  }

  if (item.category === 'Steel Work') {
    materials.steelQty = quantity
    return materials
  }

  return materials
}
const SMART_SUGGESTIONS = {
  Brickwork: [
    'RCC Lintel',
    'RCC Sill Band',
    'Internal Plaster 12mm',
    'External Plaster 15mm',
    'Internal Painting',
  ],

  'Brickwork 230mm Wall': [
    'RCC Lintel',
    'RCC Sill Band',
    'Internal Plaster 12mm',
    'External Plaster 15mm',
    'Internal Painting',
  ],

  'Half Brick Wall 115mm': [
    'RCC Lintel',
    'Internal Plaster 12mm',
    'Internal Painting',
  ],

  'RCC Slab': [
    'Terrace Waterproofing',
    'Internal Plaster 12mm',
    'External Painting',
  ],

  'RCC Footing': [
    'PCC Bed',
    'RCC Column',
    'RCC Plinth Beam',
  ],

  'RCC Column': [
    'RCC Beam',
    'RCC Slab',
    'Brickwork 230mm Wall',
  ],

  'RCC Beam': [
    'RCC Slab',
    'Brickwork 230mm Wall',
    'Internal Plaster 12mm',
  ],

  Flooring: [
    'Internal Painting',
    'Door Installation',
    'Window Installation',
  ],

  Plaster: [
    'Internal Painting',
    'External Painting',
  ],

  Painting: [
    'Door Installation',
    'Window Installation',
  ],
}
export default function BOQGeneratorPage() {
  const { authFetch } = useAuth()

  const [project, setProject] = useState(INITIAL_PROJECT)
  const [projectSaved, setProjectSaved] = useState(false)
  const [showDrafts, setShowDrafts] = useState(true)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [boqItems, setBoqItems] = useState([])
  const [savedDrafts, setSavedDrafts] = useState([])
  const [currentDraftId, setCurrentDraftId] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [itemData, setItemData] = useState(INITIAL_ITEM)
  const [gstPercent, setGstPercent] = useState(18)
  const [contractorMarginPercent, setContractorMarginPercent] = useState(10)
  const [wastagePercent, setWastagePercent] = useState(5)
  const [isSaving, setIsSaving] = useState(false)

  const selectedCategoryItems = CATEGORY_LIBRARY[itemData.category] || []

  const calculatedQuantity = useMemo(() => calculateQuantity(itemData), [itemData])

  const calculatedAmount = useMemo(
    () => calculatedQuantity * numberValue(itemData.rate),
    [calculatedQuantity, itemData.rate]
  )

  const previewMaterials = useMemo(
    () => calculateMaterials(itemData, calculatedQuantity),
    [itemData, calculatedQuantity]
  )
  const smartSuggestions = useMemo(() => {
    return (
      SMART_SUGGESTIONS[itemData.item] ||
      SMART_SUGGESTIONS[itemData.category] ||
      []
    )
  }, [itemData.item, itemData.category])
  const subtotal = useMemo(
    () => boqItems.reduce((sum, item) => sum + numberValue(item.amount), 0),
    [boqItems]
  )

  const gstAmount = subtotal * numberValue(gstPercent) / 100
  const contractorMarginAmount = subtotal * numberValue(contractorMarginPercent) / 100
  const wastageAmount = subtotal * numberValue(wastagePercent) / 100

  const grandTotal =
    subtotal +
    gstAmount +
    contractorMarginAmount +
    wastageAmount

  const materialSummary = useMemo(
    () =>
      boqItems.reduce(
        (summary, item) => {
          summary.cementBags += numberValue(item.cementBags)
          summary.sandQty += numberValue(item.sandQty)
          summary.aggregateQty += numberValue(item.aggregateQty)
          summary.steelQty += numberValue(item.steelQty)
          summary.brickNos += numberValue(item.brickNos)
          summary.excavationVolume += numberValue(item.excavationVolume)
          return summary
        },
        {
          cementBags: 0,
          sandQty: 0,
          aggregateQty: 0,
          steelQty: 0,
          brickNos: 0,
          excavationVolume: 0,
        }
      ),
    [boqItems]
  )
  const categoryCostSummary = useMemo(() => {
    const grouped = boqItems.reduce((summary, item) => {
      const category = item.category || 'Other'
      const amount = numberValue(item.amount)

      if (!summary[category]) {
        summary[category] = {
          category,
          amount: 0,
          itemCount: 0,
          percentage: 0,
        }
      }

      summary[category].amount += amount
      summary[category].itemCount += 1

      return summary
    }, {})

    return Object.values(grouped)
      .map((row) => ({
        ...row,
        percentage: subtotal > 0 ? (row.amount / subtotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [boqItems, subtotal])
  const totals = {
    subtotal,
    gstPercent,
    gstAmount,
    contractorMarginPercent,
    contractorMarginAmount,
    wastagePercent,
    wastageAmount,
    grandTotal,
  }

  const loadDrafts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'boqProjects'))

      const drafts = snapshot.docs.map((draftDoc) => ({
        id: draftDoc.id,
        ...draftDoc.data(),
      }))

      setSavedDrafts(
        drafts.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime()
        )
      )
    } catch (error) {
      console.error(error)
      alert('Error loading BOQ drafts')
    }
  }

  useEffect(() => {
    loadDrafts()
  }, [])

  const syncProjectToDashboard = async (firestoreDraftId) => {
    try {
      await authFetch('/api/projects/save', {
        method: 'POST',
        body: JSON.stringify({
          source: 'boq-generator',
          firestoreDraftId,
          project,
          boqItems,
          itemCount: boqItems.length,
          totals,
          materialSummary,
        }),
      })
    } catch (error) {
      console.error('Dashboard project sync failed:', error)
    }
  }

  const handleCategoryChange = (category) => {
    setItemData({
      ...INITIAL_ITEM,
      category,
      grade: category === 'RCC' ? 'M25' : category === 'PCC' ? 'M10' : '',
    })
  }

  const handleItemChange = (itemName) => {
    const selectedMeta = getSelectedMeta(itemData.category, itemName)

    setItemData({
      ...itemData,
      item: itemName,
      description: selectedMeta?.description || '',
      unit: selectedMeta?.unit || '',
      rate: selectedMeta?.rate ?? '',
      grade: selectedMeta?.defaultGrade || itemData.grade || '',
      length: '',
      width: '',
      height: '',
      nos: '1',
    })
  }

  const resetItemForm = () => {
    setItemData(INITIAL_ITEM)
    setEditingIndex(null)
    setShowItemForm(false)
  }

  const addOrUpdateItem = () => {
    if (!itemData.category || !itemData.item || !itemData.description || !itemData.unit) {
      alert('Please select category, item, description and unit')
      return
    }

    if (needsGrade(itemData.category) && !itemData.grade) {
      alert('Please select concrete grade')
      return
    }

    if (!calculatedQuantity || calculatedQuantity <= 0) {
      alert('Please enter valid dimensions / quantity')
      return
    }

    if (!numberValue(itemData.rate)) {
      alert('Please enter valid rate')
      return
    }

    const materials = calculateMaterials(itemData, calculatedQuantity)

    const newItem = {
      ...itemData,
      quantity: calculatedQuantity,
      amount: calculatedAmount,
      cementBags: materials.cementBags,
      sandQty: materials.sandQty,
      aggregateQty: materials.aggregateQty,
      steelQty: materials.steelQty,
      brickNos: materials.brickNos,
      excavationVolume: materials.excavationVolume,
    }

    if (editingIndex !== null) {
      const updatedItems = [...boqItems]
      updatedItems[editingIndex] = newItem
      setBoqItems(updatedItems)
    } else {
      setBoqItems([...boqItems, newItem])
    }

    resetItemForm()
  }

  const saveDraft = async () => {
    if (!project.projectName.trim()) {
      alert('Please enter project name before saving')
      return
    }

    setIsSaving(true)

    const now = new Date().toISOString()

    const draft = {
      project,
      boqItems,
      gstPercent,
      contractorMarginPercent,
      wastagePercent,
      totals,
      materialSummary,
      createdAt: currentDraftId
        ? savedDrafts.find((draftItem) => draftItem.id === currentDraftId)?.createdAt || now
        : now,
      updatedAt: now,
    }

    try {
      if (currentDraftId) {
        await updateDoc(doc(db, 'boqProjects', currentDraftId), draft)
        await syncProjectToDashboard(currentDraftId)
        alert('Draft updated successfully')
      } else {
        const docRef = await addDoc(collection(db, 'boqProjects'), draft)
        setCurrentDraftId(docRef.id)
        await syncProjectToDashboard(docRef.id)
        alert('Draft saved successfully')
      }

      await loadDrafts()
    } catch (error) {
      console.error(error)
      alert('Error saving draft')
    } finally {
      setIsSaving(false)
    }
  }

  const exportToCSV = () => {
    const rows = []

    rows.push(['Project Name', project.projectName])
    rows.push(['Client Name', project.clientName])
    rows.push(['Project Location', project.projectLocation])
    rows.push(['Project Type', project.projectType])
    rows.push(['Prepared By', project.preparedBy])
    rows.push(['Date', project.date])
    rows.push(['Revision No', project.revisionNo])
    rows.push([])

    rows.push([
      'S.No',
      'Category',
      'Item',
      'Description',
      'Grade',
      'Unit',
      'Quantity',
      'Rate',
      'Amount',
      'Cement Bags',
      'Sand m3',
      'Aggregate m3',
      'Steel Kg',
      'Bricks Nos',
      'Excavation m3',
    ])

    boqItems.forEach((item, index) => {
      rows.push([
        index + 1,
        item.category,
        item.item,
        item.description,
        item.grade,
        item.unit,
        formatQty(item.quantity),
        item.rate,
        formatQty(item.amount),
        formatQty(item.cementBags),
        formatQty(item.sandQty),
        formatQty(item.aggregateQty),
        formatQty(item.steelQty),
        Math.ceil(numberValue(item.brickNos)),
        formatQty(item.excavationVolume),
      ])
    })

    rows.push([])
    rows.push(['Subtotal', subtotal])
    rows.push([`Wastage (${wastagePercent}%)`, wastageAmount])
    rows.push([`GST (${gstPercent}%)`, gstAmount])
    rows.push([`Contractor Margin (${contractorMarginPercent}%)`, contractorMarginAmount])
    rows.push(['Grand Total', grandTotal])

    const csvContent = rows.map((row) => row.map(escapeCSV).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${fileSafeName(project.projectName)}_BOQ.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const addPdfHeader = (docPdf, title) => {
    const pageWidth = docPdf.internal.pageSize.getWidth()
    const primary = [5, 11, 31]
    const orange = [255, 122, 0]

    docPdf.setFillColor(...primary)
    docPdf.rect(0, 0, pageWidth, 28, 'F')

    docPdf.setTextColor(255, 255, 255)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(18)
    docPdf.text('CivilCalc Pro', 14, 11)

    docPdf.setFont('helvetica', 'normal')
    docPdf.setFontSize(9)
    docPdf.text(title, 14, 18)

    docPdf.setTextColor(...orange)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(9)
    docPdf.text('BOQ Generator', pageWidth - 14, 18, { align: 'right' })
  }

  const addPdfFooter = (docPdf) => {
    const pageWidth = docPdf.internal.pageSize.getWidth()
    const pageHeight = docPdf.internal.pageSize.getHeight()
    const totalPages = docPdf.internal.getNumberOfPages()

    for (let page = 1; page <= totalPages; page += 1) {
      docPdf.setPage(page)

      docPdf.setDrawColor(220, 220, 220)
      docPdf.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14)

      docPdf.setTextColor(71, 85, 105)
      docPdf.setFont('helvetica', 'normal')
      docPdf.setFontSize(8)
      docPdf.text('civilcalcpro.in', 14, pageHeight - 8)
      docPdf.text(`Page ${page} of ${totalPages}`, pageWidth - 14, pageHeight - 8, {
        align: 'right',
      })
    }
  }

  const addProjectDetailsTable = (docPdf, startY) => {
    autoTable(docPdf, {
      startY,
      theme: 'grid',
      head: [['Field', 'Details']],
      body: [
        ['Project Name', cleanText(project.projectName || 'N/A')],
        ['Client Name', cleanText(project.clientName || 'N/A')],
        ['Project Location', cleanText(project.projectLocation || 'N/A')],
        ['Project Type', cleanText(project.projectType || 'N/A')],
        ['Prepared By', cleanText(project.preparedBy || 'N/A')],
        ['Date', cleanText(project.date || new Date().toLocaleDateString('en-IN'))],
        ['Revision No.', cleanText(project.revisionNo || 'N/A')],
      ],
      headStyles: {
        fillColor: [5, 11, 31],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 45 },
        1: { cellWidth: 135 },
      },
    })
  }

  const exportBOQPDF = () => {
    if (!boqItems.length) {
      alert('Please add at least one BOQ item before exporting PDF')
      return
    }

    const docPdf = new jsPDF('p', 'mm', 'a4')

    addPdfHeader(docPdf, 'Professional Bill of Quantities Report')

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Project Details', 14, 38)

    addProjectDetailsTable(docPdf, 43)

    let nextY = docPdf.lastAutoTable.finalY + 10
        docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Category-wise Cost Summary', 14, nextY)

    autoTable(docPdf, {
      startY: nextY + 5,
      theme: 'grid',
      head: [['Category', 'Items', 'Amount', 'Share']],
      body: categoryCostSummary.map((row) => [
        cleanText(row.category),
        row.itemCount,
        formatPdfMoney(row.amount),
        `${row.percentage.toFixed(1)}%`,
      ]),
      headStyles: {
        fillColor: [5, 11, 31],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    })

    nextY = docPdf.lastAutoTable.finalY + 10

    if (nextY > 215) {
      docPdf.addPage()
      addPdfHeader(docPdf, 'Professional Bill of Quantities Report')
      nextY = 38
    }
    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('BOQ Item Statement', 14, nextY)

    autoTable(docPdf, {
      startY: nextY + 5,
      margin: { top: 36, left: 8, right: 8, bottom: 20 },
      theme: 'striped',
      head: [
        [
          'S.No',
          'Category',
          'Item',
          'Description',
          'Grade',
          'Unit',
          'Qty',
          'Rate',
          'Amount',
        ],
      ],
      body: boqItems.map((item, index) => [
        index + 1,
        cleanText(item.category),
        cleanText(item.item),
        cleanText(item.description),
        cleanText(item.grade || '-'),
        cleanText(item.unit),
        formatQty(item.quantity),
        formatPdfMoney(item.rate),
        formatPdfMoney(item.amount),
      ]),
      headStyles: {
        fillColor: [5, 11, 31],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      styles: {
        font: 'helvetica',
        fontSize: 7.5,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 21 },
        2: { cellWidth: 27 },
        3: { cellWidth: 50 },
        4: { cellWidth: 13 },
        5: { cellWidth: 12 },
        6: { cellWidth: 16, halign: 'right' },
        7: { cellWidth: 21, halign: 'right' },
        8: { cellWidth: 24, halign: 'right' },
      },
      didDrawPage: () => {
        addPdfHeader(docPdf, 'Professional Bill of Quantities Report')
      },
    })

    nextY = docPdf.lastAutoTable.finalY + 10

    if (nextY > 215) {
      docPdf.addPage()
      addPdfHeader(docPdf, 'Professional Bill of Quantities Report')
      nextY = 38
    }

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Cost Summary', 14, nextY)

    autoTable(docPdf, {
      startY: nextY + 5,
      theme: 'grid',
      head: [['Cost Item', 'Amount']],
      body: [
        ['Subtotal', formatPdfMoney(subtotal)],
        [`Wastage (${wastagePercent}%)`, formatPdfMoney(wastageAmount)],
        [`GST (${gstPercent}%)`, formatPdfMoney(gstAmount)],
        [
          `Contractor Margin (${contractorMarginPercent}%)`,
          formatPdfMoney(contractorMarginAmount),
        ],
        ['Grand Total', formatPdfMoney(grandTotal)],
      ],
      headStyles: {
        fillColor: [255, 122, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right', fontStyle: 'bold' },
      },
    })

    nextY = docPdf.lastAutoTable.finalY + 10

    if (nextY > 215) {
      docPdf.addPage()
      addPdfHeader(docPdf, 'Professional Bill of Quantities Report')
      nextY = 38
    }

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Material Summary', 14, nextY)

    autoTable(docPdf, {
      startY: nextY + 5,
      theme: 'grid',
      head: [['Material', 'Quantity']],
      body: [
        ['Cement', `${formatQty(materialSummary.cementBags)} Bags`],
        ['Sand', `${formatQty(materialSummary.sandQty)} m³`],
        ['Aggregate', `${formatQty(materialSummary.aggregateQty)} m³`],
        ['Steel', `${formatQty(materialSummary.steelQty)} Kg`],
        ['Bricks', `${Math.ceil(materialSummary.brickNos || 0)} Nos`],
        ['Excavation Volume', `${formatQty(materialSummary.excavationVolume)} m³`],
      ],
      headStyles: {
        fillColor: [5, 11, 31],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
      },
    })

    nextY = docPdf.lastAutoTable.finalY + 10

    if (nextY > 220) {
      docPdf.addPage()
      addPdfHeader(docPdf, 'Professional Bill of Quantities Report')
      nextY = 38
    }

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(12)
    docPdf.text('Calculation Notes', 14, nextY)

    docPdf.setFont('helvetica', 'normal')
    docPdf.setFontSize(8.5)
    docPdf.setTextColor(71, 85, 105)
    docPdf.text(
          [
        '1. All quantities are calculated in standard metric units commonly used in Indian BOQ practice.',
        '2. RCC steel is estimated only for RCC items using standard kg/m³ thumb ratios.',
        '3. Brickwork, plaster, flooring, painting, waterproofing and excavation do not include steel automatically.',
        '4. Brick quantity uses practical thumb rules with 5% wastage.',
        '5. Final BOQ values should be verified with approved drawings, specifications and site measurements.',
      ],
      14,
      nextY + 7
    )
        const signatureY = nextY + 48

    if (signatureY < 265) {
      docPdf.setDrawColor(120, 120, 120)

      docPdf.line(14, signatureY, 75, signatureY)
      docPdf.line(130, signatureY, 190, signatureY)

      docPdf.setTextColor(71, 85, 105)
      docPdf.setFont('helvetica', 'normal')
      docPdf.setFontSize(9)

      docPdf.text('Prepared By', 14, signatureY + 6)
      docPdf.text('Checked / Approved By', 130, signatureY + 6)
    }

    addPdfFooter(docPdf)

    docPdf.save(`${fileSafeName(project.projectName)}_Professional_BOQ_Report.pdf`)
  }

  const exportMaterialPDF = () => {
    if (!boqItems.length) {
      alert('Please add at least one BOQ item before exporting material PDF')
      return
    }

    const docPdf = new jsPDF('p', 'mm', 'a4')

    addPdfHeader(docPdf, 'Material Breakdown Report')

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Project Details', 14, 38)

    addProjectDetailsTable(docPdf, 43)

    let nextY = docPdf.lastAutoTable.finalY + 10

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Item-wise Material Breakdown', 14, nextY)

    autoTable(docPdf, {
      startY: nextY + 5,
      margin: { top: 36, bottom: 20 },
      theme: 'striped',
      head: [
        [
          'S.No',
          'Item',
          'Qty',
          'Cement',
          'Sand',
          'Aggregate',
          'Steel',
          'Bricks',
          'Excavation',
        ],
      ],
      body: boqItems.map((item, index) => [
        index + 1,
        cleanText(item.item),
        `${formatQty(item.quantity)} ${cleanText(item.unit)}`,
        `${formatQty(item.cementBags)} Bags`,
        `${formatQty(item.sandQty)} m³`,
        `${formatQty(item.aggregateQty)} m³`,
        `${formatQty(item.steelQty)} Kg`,
        `${Math.ceil(item.brickNos || 0)} Nos`,
        `${formatQty(item.excavationVolume)} m³`,
      ]),
      headStyles: {
        fillColor: [5, 11, 31],
        textColor: [255, 255, 255],
      },
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2,
      },
      didDrawPage: () => {
        addPdfHeader(docPdf, 'Material Breakdown Report')
      },
    })

    nextY = docPdf.lastAutoTable.finalY + 10

    if (nextY > 215) {
      docPdf.addPage()
      addPdfHeader(docPdf, 'Material Breakdown Report')
      nextY = 38
    }

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Total Material Summary', 14, nextY)

    autoTable(docPdf, {
      startY: nextY + 5,
      theme: 'grid',
      head: [['Material', 'Total Quantity']],
      body: [
        ['Cement', `${formatQty(materialSummary.cementBags)} Bags`],
        ['Sand', `${formatQty(materialSummary.sandQty)} m³`],
        ['Aggregate', `${formatQty(materialSummary.aggregateQty)} m³`],
        ['Steel', `${formatQty(materialSummary.steelQty)} Kg`],
        ['Bricks', `${Math.ceil(materialSummary.brickNos || 0)} Nos`],
        ['Excavation Volume', `${formatQty(materialSummary.excavationVolume)} m³`],
      ],
      headStyles: {
        fillColor: [255, 122, 0],
        textColor: [255, 255, 255],
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
      },
    })

    addPdfFooter(docPdf)

    docPdf.save(`${fileSafeName(project.projectName)}_Material_Report.pdf`)
  }

  const exportCostPDF = () => {
    if (!boqItems.length) {
      alert('Please add at least one BOQ item before exporting cost PDF')
      return
    }

    const docPdf = new jsPDF('p', 'mm', 'a4')

    addPdfHeader(docPdf, 'Cost Summary Report')

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Project Details', 14, 38)

    addProjectDetailsTable(docPdf, 43)

    let nextY = docPdf.lastAutoTable.finalY + 10

    docPdf.setTextColor(5, 11, 31)
    docPdf.setFont('helvetica', 'bold')
    docPdf.setFontSize(14)
    docPdf.text('Cost Summary', 14, nextY)

    autoTable(docPdf, {
      startY: nextY + 5,
      theme: 'grid',
      head: [['Cost Item', 'Amount']],
      body: [
        ['Subtotal', formatPdfMoney(subtotal)],
        [`Wastage (${wastagePercent}%)`, formatPdfMoney(wastageAmount)],
        [`GST (${gstPercent}%)`, formatPdfMoney(gstAmount)],
        [
          `Contractor Margin (${contractorMarginPercent}%)`,
          formatPdfMoney(contractorMarginAmount),
        ],
        ['Grand Total', formatPdfMoney(grandTotal)],
      ],
      headStyles: {
        fillColor: [5, 11, 31],
        textColor: [255, 255, 255],
      },
      styles: {
        font: 'helvetica',
        fontSize: 11,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right', fontStyle: 'bold' },
      },
    })

    addPdfFooter(docPdf)

    docPdf.save(`${fileSafeName(project.projectName)}_Cost_Report.pdf`)
  }

  const renderDimensionInputs = () => (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      {needsLength(itemData) && (
        <Input
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
          placeholder={getLengthLabel(itemData)}
          type="number"
          value={itemData.length}
          onChange={(e) =>
            setItemData({
              ...itemData,
              length: e.target.value,
            })
          }
        />
      )}

      {needsWidth(itemData) && (
        <Input
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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

      {needsHeight(itemData) && (
        <Input
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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
        className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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
  )

  if (!projectSaved && !showProjectForm) {
    return (
      <div className="min-h-screen bg-[#050B1F] p-6 text-white lg:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-3xl border border-orange-500/20 bg-slate-950/80 p-6 shadow-2xl shadow-orange-500/5 lg:p-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              CivilCalc Pro
            </p>

            <h1 className="text-3xl font-bold lg:text-5xl">
              Professional BOQ Generator
            </h1>

            <p className="mt-3 max-w-3xl text-slate-400">
              Create project-wise BOQ items, calculate quantities, estimate material breakdown and export a clean professional PDF report.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => {
                  setProject(INITIAL_PROJECT)
                  setBoqItems([])
                  setCurrentDraftId(null)
                  setShowDrafts(false)
                  setShowProjectForm(true)
                }}
              >
                + New Project
              </Button>

              <Button
                variant="outline"
                className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => setShowDrafts(!showDrafts)}
              >
                {showDrafts ? 'Hide Drafts' : 'Show Drafts'}
              </Button>
            </div>
          </div>

          {showDrafts && (
            <Card className="border-slate-800 bg-slate-950/70 p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white">Saved Drafts</h2>
                <p className="text-sm text-slate-400">
                  Continue your previous BOQ projects.
                </p>
              </div>

              {savedDrafts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                  <p className="text-slate-400">No saved BOQ drafts found.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {savedDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {draft.project?.projectName || 'Untitled BOQ'}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Client: {draft.project?.clientName || 'N/A'}
                          </p>

                          <p className="text-xs text-slate-500">
                            Updated: {draft.updatedAt || draft.createdAt || 'N/A'}
                          </p>
                        </div>

                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                          {draft.boqItems?.length || 0} items
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="bg-orange-500 text-white hover:bg-orange-600"
                          onClick={() => {
                            setProject(draft.project || INITIAL_PROJECT)
                            setBoqItems(draft.boqItems || [])
                            setGstPercent(draft.gstPercent ?? 18)
                            setContractorMarginPercent(draft.contractorMarginPercent ?? 10)
                            setWastagePercent(draft.wastagePercent ?? 5)
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
                            try {
                              await deleteDoc(doc(db, 'boqProjects', draft.id))

                              try {
                                await authFetch(`/api/projects/${draft.id}`, {
                                  method: 'DELETE',
                                })
                              } catch (error) {
                                console.error('Dashboard project delete sync failed:', error)
                              }

                              setSavedDrafts(
                                savedDrafts.filter((draftItem) => draftItem.id !== draft.id)
                              )
                            } catch (error) {
                              console.error(error)
                              alert('Error deleting draft')
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (!projectSaved && showProjectForm) {
    return (
      <div className="min-h-screen bg-[#050B1F] p-6 text-white lg:p-10">
        <div className="mx-auto max-w-5xl">
          <Button
            variant="outline"
            className="mb-6 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
            onClick={() => {
              setShowProjectForm(false)
              setShowDrafts(true)
            }}
          >
            ← Back
          </Button>

          <Card className="border-slate-800 bg-slate-950/70 p-6 shadow-xl lg:p-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Step 1
            </p>

            <h1 className="text-3xl font-bold text-white">
              Project Details
            </h1>

            <p className="mt-2 text-slate-400">
              Add basic project details. These details will appear in the PDF report.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                placeholder="Project Location"
                value={project.projectLocation}
                onChange={(e) =>
                  setProject({
                    ...project,
                    projectLocation: e.target.value,
                  })
                }
              />

              <select
                className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-white"
                value={project.projectType}
                onChange={(e) =>
                  setProject({
                    ...project,
                    projectType: e.target.value,
                  })
                }
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>

              <Input
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 md:col-span-2"
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
              className="mt-6 bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => {
                if (!project.projectName.trim()) {
                  alert('Please enter project name')
                  return
                }

                setProjectSaved(true)
                setShowProjectForm(false)
              }}
            >
              Save Project & Continue
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050B1F] p-4 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              CivilCalc Pro BOQ
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {project.projectName || 'BOQ Builder'}
            </h1>

            <p className="mt-1 text-slate-400">
              {project.clientName || 'Client not added'} • {project.projectLocation || 'Location not added'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => {
                setProjectSaved(false)
                setShowProjectForm(true)
              }}
            >
              Edit Project
            </Button>

            <Button
              className="bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => {
                setEditingIndex(null)
                setItemData(INITIAL_ITEM)
                setShowItemForm(true)
              }}
            >
              + Add BOQ Item
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {showItemForm && (
              <Card className="border-slate-800 bg-slate-950/80 p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingIndex !== null ? 'Edit BOQ Item' : 'Add BOQ Item'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {getFormulaLabel(itemData)}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={resetItemForm}
                  >
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <select
                    className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-white"
                    value={itemData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {Object.keys(CATEGORY_LIBRARY).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-white disabled:opacity-60"
                    value={itemData.item}
                    disabled={!itemData.category}
                    onChange={(e) => handleItemChange(e.target.value)}
                  >
                    <option value="">Select Item</option>
                    {selectedCategoryItems.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {needsGrade(itemData.category) && (
                    <select
                      className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-white"
                      value={itemData.grade}
                      onChange={(e) =>
                        setItemData({
                          ...itemData,
                          grade: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Concrete Grade</option>
                      {Object.keys(CONCRETE_MATERIAL_DATABASE).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  )}

                  <Input
                    className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                    placeholder="Unit"
                    value={itemData.unit}
                    readOnly
                  />

                  <Input
                    className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
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
                </div>

                <textarea
                  className="mt-3 min-h-[90px] w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder:text-slate-500"
                  placeholder="Description"
                  value={itemData.description}
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      description: e.target.value,
                    })
                  }
                />

                <div className="mt-3">{renderDimensionInputs()}</div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Card className="border-slate-700 bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Calculated Quantity</p>

                    <p className="mt-1 text-3xl font-bold text-white">
                      {formatQty(calculatedQuantity)} {itemData.unit}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {getFormulaLabel(itemData)}
                    </p>
                  </Card>

                  <Card className="border-orange-500/20 bg-orange-500/10 p-4">
                    <p className="text-sm text-orange-200">Calculated Amount</p>

                    <p className="mt-1 text-3xl font-bold text-orange-400">
                      {formatMoney(calculatedAmount)}
                    </p>
                  </Card>
                </div>

                <Card className="mt-4 border-slate-700 bg-slate-900 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-white">Material Preview</h3>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      Steel only in RCC/Steel Work
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                    <div>
                      <p className="text-xs text-slate-400">Cement</p>
                      <p className="font-bold text-white">
                        {formatQty(previewMaterials.cementBags)} Bags
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Sand</p>
                      <p className="font-bold text-white">
                        {formatQty(previewMaterials.sandQty)} m³
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Aggregate</p>
                      <p className="font-bold text-white">
                        {formatQty(previewMaterials.aggregateQty)} m³
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Steel</p>
                      <p className="font-bold text-green-400">
                        {formatQty(previewMaterials.steelQty)} Kg
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Bricks</p>
                      <p className="font-bold text-orange-400">
                        {Math.ceil(previewMaterials.brickNos || 0)} Nos
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Excavation</p>
                      <p className="font-bold text-blue-300">
                        {formatQty(previewMaterials.excavationVolume)} m³
                      </p>
                    </div>
                  </div>
                </Card>
                                    {smartSuggestions.length > 0 && (
                  <Card className="mt-4 border-orange-500/20 bg-orange-500/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">
                          Smart Suggestions
                        </h3>

                        <p className="mt-1 text-sm text-orange-100/80">
                          Is item ke saath ye BOQ items bhi commonly required hote hain.
                        </p>
                      </div>

                      <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                        Recommended
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {smartSuggestions.map((suggestion) => (
                        <span
                          key={suggestion}
                          className="rounded-full border border-orange-500/30 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-orange-200"
                        >
                          + {suggestion}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    className="bg-orange-500 text-white hover:bg-orange-600"
                    onClick={addOrUpdateItem}
                  >
                    {editingIndex !== null ? 'Update Item' : 'Add To BOQ'}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={resetItemForm}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            <Card className="border-slate-800 bg-slate-950/80 p-5">
              <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">BOQ Items</h2>
                  <p className="text-sm text-slate-400">
                    {boqItems.length} item added
                  </p>
                </div>

                <Button
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => {
                    setEditingIndex(null)
                    setItemData(INITIAL_ITEM)
                    setShowItemForm(true)
                  }}
                >
                  + Add Item
                </Button>
              </div>

              {boqItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                  <p className="font-semibold text-white">No BOQ item added yet</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Click Add Item to start creating your BOQ.
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full text-left text-sm text-white">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-300">
                          <th className="p-3">S.No</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Item</th>
                          <th className="p-3">Unit</th>
                          <th className="p-3 text-right">Qty</th>
                          <th className="p-3 text-right">Rate</th>
                          <th className="p-3 text-right">Amount</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {boqItems.map((row, index) => (
                          <tr key={`${row.item}-${index}`} className="border-b border-slate-800">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{row.category}</td>
                            <td className="p-3">
                              <p className="font-semibold">{row.item}</p>
                              <p className="line-clamp-1 text-xs text-slate-400">
                                {row.description}
                              </p>
                            </td>
                            <td className="p-3">{row.unit}</td>
                            <td className="p-3 text-right">{formatQty(row.quantity)}</td>
                            <td className="p-3 text-right">{formatMoney(row.rate)}</td>
                            <td className="p-3 text-right font-bold text-green-400">
                              {formatMoney(row.amount)}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  className="bg-slate-800 text-white hover:bg-slate-700"
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
                                  className="bg-slate-800 text-white hover:bg-slate-700"
                                  onClick={() => {
                                    setBoqItems([...boqItems, { ...row }])
                                  }}
                                >
                                  Duplicate
                                </Button>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    setBoqItems(boqItems.filter((_, i) => i !== index))
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-3 lg:hidden">
                    {boqItems.map((row, index) => (
                      <div
                        key={`${row.item}-mobile-${index}`}
                        className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-orange-300">
                              #{index + 1} • {row.category}
                            </p>
                            <h3 className="font-bold text-white">{row.item}</h3>
                            <p className="mt-1 text-xs text-slate-400">{row.description}</p>
                          </div>

                          <p className="font-bold text-green-400">
                            {formatMoney(row.amount)}
                          </p>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-slate-500">Qty</p>
                            <p className="text-white">
                              {formatQty(row.quantity)} {row.unit}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-500">Rate</p>
                            <p className="text-white">{formatMoney(row.rate)}</p>
                          </div>

                          <div>
                            <p className="text-slate-500">Bricks</p>
                            <p className="text-white">
                              {Math.ceil(row.brickNos || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            className="bg-slate-800 text-white"
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
                            className="bg-slate-800 text-white"
                            onClick={() => setBoqItems([...boqItems, { ...row }])}
                          >
                            Duplicate
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setBoqItems(boqItems.filter((_, i) => i !== index))
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-4 border-orange-500/20 bg-slate-950/90 p-5">
              <h2 className="text-xl font-bold text-white">Cost Summary</h2>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">
                    GST %
                  </label>
                  <Input
                    className="border-slate-700 bg-slate-800 text-white"
                    type="number"
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-400">
                    Contractor Margin %
                  </label>
                  <Input
                    className="border-slate-700 bg-slate-800 text-white"
                    type="number"
                    value={contractorMarginPercent}
                    onChange={(e) =>
                      setContractorMarginPercent(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-400">
                    Wastage %
                  </label>
                  <Input
                    className="border-slate-700 bg-slate-800 text-white"
                    type="number"
                    value={wastagePercent}
                    onChange={(e) => setWastagePercent(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">{formatMoney(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Wastage ({wastagePercent}%)
                  </span>
                  <span className="text-white">{formatMoney(wastageAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">GST ({gstPercent}%)</span>
                  <span className="text-white">{formatMoney(gstAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Contractor ({contractorMarginPercent}%)
                  </span>
                  <span className="text-white">
                    {formatMoney(contractorMarginAmount)}
                  </span>
                </div>

                <hr className="border-slate-800" />

                <div>
                  <p className="text-sm text-slate-400">Grand Total</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {formatMoney(grandTotal)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2">
                <Button
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={saveDraft}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>

                <Button
                  className="bg-slate-800 text-white hover:bg-slate-700"
                  onClick={exportBOQPDF}
                >
                  Professional BOQ PDF
                </Button>

                <Button
                  className="bg-slate-800 text-white hover:bg-slate-700"
                  onClick={exportMaterialPDF}
                >
                  Material PDF
                </Button>

                <Button
                  className="bg-slate-800 text-white hover:bg-slate-700"
                  onClick={exportCostPDF}
                >
                  Cost PDF
                </Button>

                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                  onClick={exportToCSV}
                >
                  Export CSV
                </Button>
              </div>
            </Card>
            <Card className="border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-xl font-bold text-white">
                Category-wise Cost
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Work category ke hisaab se total amount.
              </p>

              <div className="mt-4 space-y-3">
                {categoryCostSummary.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Add BOQ items to see category-wise cost.
                  </p>
                ) : (
                  categoryCostSummary.map((row) => (
                    <div
                      key={row.category}
                      className="rounded-2xl border border-slate-800 bg-slate-900 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {row.category}
                          </p>

                          <p className="text-xs text-slate-500">
                            {row.itemCount} item
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-orange-400">
                            {formatMoney(row.amount)}
                          </p>

                          <p className="text-xs text-slate-500">
                            {row.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{
                            width: `${Math.min(row.percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
            <Card className="border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-xl font-bold text-white">Material Summary</h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-400">Cement</p>
                  <p className="font-bold text-white">
                    {formatQty(materialSummary.cementBags)} Bags
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-400">Sand</p>
                  <p className="font-bold text-white">
                    {formatQty(materialSummary.sandQty)} m³
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-400">Aggregate</p>
                  <p className="font-bold text-white">
                    {formatQty(materialSummary.aggregateQty)} m³
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-400">Steel</p>
                  <p className="font-bold text-green-400">
                    {formatQty(materialSummary.steelQty)} Kg
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-400">Bricks</p>
                  <p className="font-bold text-orange-400">
                    {Math.ceil(materialSummary.brickNos || 0)} Nos
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-3">
                  <p className="text-xs text-slate-400">Excavation</p>
                  <p className="font-bold text-blue-300">
                    {formatQty(materialSummary.excavationVolume)} m³
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Steel is auto-estimated only for RCC items and direct Steel Work items. Brickwork, flooring, plaster, painting, waterproofing and excavation do not include steel automatically.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
