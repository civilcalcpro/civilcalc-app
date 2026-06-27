'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  FolderOpen,
  HardHat,
  IndianRupee,
  Plus,
  Save,
  Trash2,
  UserRound,
  UsersRound,
  XCircle,
} from 'lucide-react'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'

const LABOUR_PROFILE_KEY = 'civilcalc_site_diary_labour_profile_v2'
const ENGINEER_PROFILES_KEY = 'civilcalc_site_diary_engineer_profiles_v1'
const LABOUR_PROFILES_KEY = 'civilcalc_site_diary_labour_profiles_v1'
const MAX_PHOTO_SIZE = 2 * 1024 * 1024
const MAX_PHOTO_DIMENSION = 1800
const PHOTO_BUCKET = 'site-diary-photos'

const MATERIAL_DEFS = [
  { key: 'cementBags', name: 'Cement', hindi: 'सीमेंट', unit: 'bags', rateKey: 'cementRate', rateLabel: 'bag' },
  { key: 'sandCft', name: 'Sand', hindi: 'रेत', unit: 'cft', rateKey: 'sandRate', rateLabel: 'cft' },
  { key: 'aggregateCft', name: 'Aggregate', hindi: 'गिट्टी', unit: 'cft', rateKey: 'aggregateRate', rateLabel: 'cft' },
  { key: 'steelKg', name: 'Steel', hindi: 'स्टील', unit: 'kg', rateKey: 'steelRate', rateLabel: 'kg' },
  { key: 'bricksNos', name: 'Bricks', hindi: 'ईंट', unit: 'nos', rateKey: 'brickRate', rateLabel: 'piece' },
]

const WORK_CATEGORIES = [
  'Excavation',
  'PCC',
  'RCC',
  'Shuttering / Formwork',
  'Steel Binding',
  'Brickwork / Blockwork',
  'Plaster',
  'Flooring',
  'Waterproofing',
  'Painting',
  'Electrical',
  'Plumbing',
  'Doors & Windows',
  'Finishing',
  'Other',
]

const UNIT_OPTIONS = ['m³', 'm²', 'm', 'Nos', 'kg', 'cft', 'bags', 'pcs', 'hours', 'days']

const emptyOwnerForm = {
  siteName: '',
  projectType: 'Residential',
  siteLocation: '',
  ownerName: '',
  clientName: '',
  startDate: '',
  estimatedEndDate: '',
  budget: '',
  cementRate: '420',
  steelRate: '65',
  sandRate: '45',
  aggregateRate: '50',
  brickRate: '8',
  labourRate: '700',
  notes: '',
}

const emptyEngineerForm = {
  engineerName: '',
  mobile: '',
  engineerCode: '',
}

const emptyLabourForm = {
  labourCode: '',
  labourName: '',
  mobile: '',
  workType: 'Helper / Labour',
  workingUnder: '',
}

const emptyWorkItemForm = {
  category: 'RCC',
  workName: '',
  location: '',
  quantity: '',
  unit: 'Nos',
  remarks: '',
}

const emptyOtherMaterialForm = {
  name: '',
  quantity: '',
  unit: 'Nos',
  rate: '',
}

const emptyStockForm = {
  materialName: 'Cement',
  quantity: '',
  unit: 'bags',
  rate: '',
  supplier: '',
  purchaseDate: getToday(),
  billNo: '',
  notes: '',
}

const emptyReportForm = {
  date: getToday(),
  workDone: '',
  cementBags: '',
  sandCft: '',
  aggregateCft: '',
  steelKg: '',
  bricksNos: '',
  shutteringArea: '',
  shutteringUnit: 'm²',
  propsNos: '',
  scaffoldingUsed: 'No',
  shutteringCost: '',
  equipmentUsed: '',
  equipmentCost: '',
  otherCost: '',
  issues: '',
  tomorrowPlan: '',
  remarks: '',
}

function getToday() {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

function dateInRange(date, start, end) {
  if (!date) return false
  const value = new Date(date).getTime()
  const startValue = new Date(start || date).getTime()
  const endValue = new Date(end || date).getTime()
  return value >= startValue && value <= endValue
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function generateCode(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

function num(value) {
  return Number(value || 0)
}

function qty(value) {
  const n = num(value)
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

function money(value) {
  return `₹${num(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function toMillis(value) {
  if (!value) return 0
  if (typeof value === 'string') return new Date(value).getTime() || 0
  if (typeof value.toMillis === 'function') return value.toMillis()
  if (value.seconds) return value.seconds * 1000
  return 0
}

function sortNewest(items) {
  return [...items].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
}

function normalizeMaterialName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function materialKey(name, unit) {
  return `${normalizeMaterialName(name)}__${String(unit || '').trim().toLowerCase()}`
}

function readLocalProfiles(key) {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalProfiles(key, profiles) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(profiles))
}

function upsertLocalProfile(key, profile) {
  const oldProfiles = readLocalProfiles(key)
  const nextProfiles = [profile, ...oldProfiles.filter((item) => item.id !== profile.id)]
  saveLocalProfiles(key, nextProfiles)
  return nextProfiles
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Unable to read image file. Please use JPG, PNG or WEBP.'))
      image.src = reader.result
    }

    reader.onerror = () => reject(new Error('Unable to read image file.'))
    reader.readAsDataURL(file)
  })
}

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Image compression failed.'))
      },
      'image/jpeg',
      quality
    )
  })
}

async function compressImageToUnder2MB(file) {
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.')
  if (file.size <= MAX_PHOTO_SIZE) return file

  const image = await loadImageFromFile(file)
  let quality = 0.82
  let maxDimension = MAX_PHOTO_DIMENSION
  let finalBlob = null

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, width, height)

    const blob = await canvasToJpegBlob(canvas, quality)
    finalBlob = blob

    if (blob.size <= MAX_PHOTO_SIZE) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '')
      return new File([blob], `${cleanName}-compressed.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      })
    }

    if (quality > 0.45) quality -= 0.12
    else {
      maxDimension = Math.floor(maxDimension * 0.75)
      quality = 0.78
    }
  }

  if (finalBlob && finalBlob.size <= MAX_PHOTO_SIZE) {
    const cleanName = file.name.replace(/\.[^/.]+$/, '')
    return new File([finalBlob], `${cleanName}-compressed.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  }

  throw new Error('Photo is too large to compress. Please try another image.')
}

function getDefaultMaterialLines(report, site) {
  return MATERIAL_DEFS
    .map((item) => {
      const quantity = num(report?.[item.key])
      const rate = num(site?.[item.rateKey])
      return {
        name: item.name,
        hindi: item.hindi,
        quantity,
        unit: item.unit,
        rate,
        value: quantity * rate,
      }
    })
    .filter((item) => item.quantity > 0)
}

function getOtherMaterialLines(report) {
  return (report?.otherMaterials || [])
    .map((item) => ({
      name: item.name || 'Other Material',
      quantity: num(item.quantity),
      unit: item.unit || 'Nos',
      rate: num(item.rate),
      value: num(item.quantity) * num(item.rate),
    }))
    .filter((item) => item.quantity > 0)
}

function getMaterialLines(report, site) {
  return [...getDefaultMaterialLines(report, site), ...getOtherMaterialLines(report)]
}

function calculateMaterialCost(report, site) {
  return getMaterialLines(report, site).reduce((sum, item) => sum + num(item.value), 0)
}

function calculateAttendanceCost(attendance, site) {
  if (attendance.status !== 'Present') return 0
  const multiplier = attendance.dayType === 'Half Day' ? 0.5 : 1
  return num(site?.labourRate) * multiplier
}

function aggregateMaterialUsage(reports, site) {
  const map = {}

  reports.forEach((report) => {
    getMaterialLines(report, site).forEach((item) => {
      const key = materialKey(item.name, item.unit)
      if (!map[key]) {
        map[key] = {
          key,
          name: item.name,
          unit: item.unit,
          quantity: 0,
          value: 0,
        }
      }

      map[key].quantity += num(item.quantity)
      map[key].value += num(item.value)
    })
  })

  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name))
}

function buildStockSummary(stockItems, reports, site) {
  const stockMap = {}

  ;(stockItems || []).forEach((item) => {
    const key = materialKey(item.materialName, item.unit)
    if (!stockMap[key]) {
      stockMap[key] = {
        key,
        name: item.materialName || 'Material',
        unit: item.unit || 'Nos',
        purchasedQty: 0,
        purchasedValue: 0,
        usedQty: 0,
        usedValue: 0,
      }
    }

    stockMap[key].purchasedQty += num(item.quantity)
    stockMap[key].purchasedValue += num(item.quantity) * num(item.rate)
  })

  aggregateMaterialUsage(reports || [], site).forEach((item) => {
    const key = materialKey(item.name, item.unit)
    if (!stockMap[key]) {
      stockMap[key] = {
        key,
        name: item.name,
        unit: item.unit,
        purchasedQty: 0,
        purchasedValue: 0,
        usedQty: 0,
        usedValue: 0,
      }
    }

    stockMap[key].usedQty += num(item.quantity)
    stockMap[key].usedValue += num(item.value)
  })

  return Object.values(stockMap)
    .map((item) => {
      const avgRate = item.purchasedQty ? item.purchasedValue / item.purchasedQty : 0
      const remainingQty = item.purchasedQty - item.usedQty
      return {
        ...item,
        avgRate,
        remainingQty,
        remainingValue: remainingQty * avgRate,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function Field({ label, value, onChange, placeholder, type = 'text', as = 'input' }) {
  const cls =
    'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-slate-500'

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      {as === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cls}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function PrimaryButton({ children, onClick, icon: Icon, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 md:w-auto ${className}`}
    >
      {Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick, icon: Icon, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-800 md:w-auto ${className}`}
    >
      {Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  )
}

function StatCard({ title, value, sub, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
          {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
            <Icon size={20} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function MaterialMiniCard({ title, value, unit, rate, cost }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-black text-white">
        {value} <span className="text-sm font-semibold text-slate-400">{unit}</span>
      </p>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>Rate: {rate}</span>
        <span className="font-bold text-cyan-300">{cost}</span>
      </div>
    </div>
  )
}

export default function SiteDiaryPage() {
  const [screen, setScreen] = useState('home')
  const [selectedSite, setSelectedSite] = useState(null)
  const [ownerForm, setOwnerForm] = useState(emptyOwnerForm)
  const [ownerCodeInput, setOwnerCodeInput] = useState('')
  const [engineerForm, setEngineerForm] = useState(emptyEngineerForm)
  const [labourForm, setLabourForm] = useState(emptyLabourForm)
  const [currentEngineer, setCurrentEngineer] = useState(null)
  const [currentLabour, setCurrentLabour] = useState(null)
  const [reportForm, setReportForm] = useState(emptyReportForm)
  const [workItems, setWorkItems] = useState([])
  const [workItemForm, setWorkItemForm] = useState(emptyWorkItemForm)
  const [otherMaterials, setOtherMaterials] = useState([])
  const [otherMaterialForm, setOtherMaterialForm] = useState(emptyOtherMaterialForm)
  const [stockForm, setStockForm] = useState(emptyStockForm)
  const [showStockForm, setShowStockForm] = useState(false)
  const [attendanceForm, setAttendanceForm] = useState({
    status: 'Present',
    dayType: 'Full Day',
    remarks: '',
  })
  const [photoFiles, setPhotoFiles] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [selectedReportDate, setSelectedReportDate] = useState(getToday())
  const [rangeStart, setRangeStart] = useState(getToday())
  const [rangeEnd, setRangeEnd] = useState(getToday())
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedEngineers, setSavedEngineers] = useState([])
  const [savedLabours, setSavedLabours] = useState([])

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3500)
  }

  const updateOwner = (key, value) => setOwnerForm((prev) => ({ ...prev, [key]: value }))
  const updateEngineer = (key, value) => setEngineerForm((prev) => ({ ...prev, [key]: value }))
  const updateLabour = (key, value) => setLabourForm((prev) => ({ ...prev, [key]: value }))
  const updateReport = (key, value) => setReportForm((prev) => ({ ...prev, [key]: value }))
  const updateWorkItem = (key, value) => setWorkItemForm((prev) => ({ ...prev, [key]: value }))
  const updateOtherMaterial = (key, value) => setOtherMaterialForm((prev) => ({ ...prev, [key]: value }))
  const updateStock = (key, value) => setStockForm((prev) => ({ ...prev, [key]: value }))

  async function loadSiteBundle(site) {
    if (!site?.id) return

    const reportsSnap = await getDocs(
      query(collection(db, 'dailyReports'), where('siteId', '==', site.id))
    )

    const attendanceSnap = await getDocs(
      query(collection(db, 'attendanceReports'), where('siteId', '==', site.id))
    )

    const labourSnap = await getDocs(
      query(collection(db, 'labourMembers'), where('siteId', '==', site.id))
    )

    const stockSnap = await getDocs(
      query(collection(db, 'siteMaterials'), where('siteId', '==', site.id))
    )

    const dailyReports = reportsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    const attendanceReports = attendanceSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    const labourMembers = labourSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    const materialStocks = stockSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

    setSelectedSite({
      ...site,
      dailyReports: sortNewest(dailyReports),
      attendanceReports: sortNewest(attendanceReports),
      labourMembers: sortNewest(labourMembers),
      materialStocks: sortNewest(materialStocks),
    })
  }

  async function findSiteByCode(field, code) {
    const q = query(collection(db, 'siteDiaries'), where(field, '==', code.trim().toUpperCase()))
    const snap = await getDocs(q)

    if (snap.empty) return null

    const docItem = snap.docs[0]
    return { id: docItem.id, ...docItem.data() }
  }

  useEffect(() => {
    setSavedEngineers(readLocalProfiles(ENGINEER_PROFILES_KEY))
    setSavedLabours(readLocalProfiles(LABOUR_PROFILES_KEY))

    async function restoreLabour() {
      try {
        const raw = localStorage.getItem(LABOUR_PROFILE_KEY)
        if (!raw) return

        const labour = JSON.parse(raw)
        setCurrentLabour(labour)

        if (labour.siteId) {
          const siteRef = doc(db, 'siteDiaries', labour.siteId)
          const siteSnap = await getDoc(siteRef)

          if (siteSnap.exists()) {
            await loadSiteBundle({ id: siteSnap.id, ...siteSnap.data() })
          }
        }
      } catch {
        setCurrentLabour(null)
      }
    }

    restoreLabour()
  }, [])

  const todaySummary = useMemo(() => {
    if (!selectedSite) return null

    const reportDate = selectedReportDate || getToday()

    const reports = (selectedSite.dailyReports || []).filter((report) => report.date === reportDate)
    const attendance = (selectedSite.attendanceReports || []).filter((item) => item.date === reportDate)
    const present = attendance.filter((item) => item.status === 'Present')
    const absent = attendance.filter((item) => item.status === 'Absent')
    const materialUsage = aggregateMaterialUsage(reports, selectedSite)
    const materialCost = materialUsage.reduce((sum, item) => sum + num(item.value), 0)
    const shutteringCost = reports.reduce((sum, report) => sum + num(report.shutteringCost), 0)
    const equipmentCost = reports.reduce((sum, report) => sum + num(report.equipmentCost), 0)
    const otherCost = reports.reduce((sum, report) => sum + num(report.otherCost), 0)
    const labourCost = attendance.reduce((sum, item) => sum + calculateAttendanceCost(item, selectedSite), 0)

    return {
      reports,
      attendance,
      present,
      absent,
      materialUsage,
      materialCost,
      shutteringCost,
      equipmentCost,
      otherCost,
      labourCost,
      totalCost: materialCost + shutteringCost + equipmentCost + otherCost + labourCost,
    }
  }, [selectedSite, selectedReportDate])

  const totalProjectCost = useMemo(() => {
    if (!selectedSite) return 0

    const reportCost = (selectedSite.dailyReports || []).reduce(
      (sum, report) =>
        sum +
        calculateMaterialCost(report, selectedSite) +
        num(report.shutteringCost) +
        num(report.equipmentCost) +
        num(report.otherCost),
      0
    )

    const labourCost = (selectedSite.attendanceReports || []).reduce(
      (sum, item) => sum + calculateAttendanceCost(item, selectedSite),
      0
    )

    return reportCost + labourCost
  }, [selectedSite])

  const stockSummary = useMemo(() => {
    if (!selectedSite) return []
    return buildStockSummary(
      selectedSite.materialStocks || [],
      selectedSite.dailyReports || [],
      selectedSite
    )
  }, [selectedSite])

  const budgetUsedPercent = useMemo(() => {
    const budget = num(selectedSite?.budget)
    if (!budget) return 0
    return Math.min(100, Math.round((totalProjectCost / budget) * 100))
  }, [selectedSite, totalProjectCost])

  const goHome = () => {
    setScreen('home')
    setCurrentEngineer(null)
    setPhotoFiles([])
    setPhotoPreviews([])
  }

  const createSite = async () => {
    if (!ownerForm.siteName.trim() || !ownerForm.ownerName.trim()) {
      showMessage('Site name and owner/contractor name are required.')
      return
    }

    setLoading(true)

    try {
      const siteId = generateId()
      const site = {
        id: siteId,
        ...ownerForm,
        startDate: ownerForm.startDate || getToday(),
        ownerCode: generateCode('OWN'),
        engineerCode: generateCode('ENG'),
        labourCode: generateCode('LAB'),
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'siteDiaries', siteId), site)
      setOwnerForm(emptyOwnerForm)
      setSelectedReportDate(getToday())
      setRangeStart(site.startDate || getToday())
      setRangeEnd(getToday())
      await loadSiteBundle(site)
      setScreen('ownerDashboard')
      showMessage('New Site Diary created successfully.')
    } catch (error) {
      showMessage(error?.message || 'Failed to create site diary.')
    } finally {
      setLoading(false)
    }
  }

  const openOwnerSite = async () => {
    if (!ownerCodeInput.trim()) {
      showMessage('Owner code is required.')
      return
    }

    setLoading(true)

    try {
      const site = await findSiteByCode('ownerCode', ownerCodeInput)

      if (!site) {
        showMessage('Owner code not found.')
        return
      }

      setSelectedReportDate(getToday())
      setRangeStart(site.startDate || getToday())
      setRangeEnd(getToday())
      await loadSiteBundle(site)
      setScreen('ownerDashboard')
    } catch (error) {
      showMessage(error?.message || 'Failed to open diary.')
    } finally {
      setLoading(false)
    }
  }

  const openExistingEngineerWork = async (profile) => {
    setLoading(true)

    try {
      const siteRef = doc(db, 'siteDiaries', profile.siteId)
      const siteSnap = await getDoc(siteRef)

      if (!siteSnap.exists()) {
        showMessage('Saved site not found. Please join again using New Work.')
        return
      }

      const site = { id: siteSnap.id, ...siteSnap.data() }
      setCurrentEngineer(profile)
      setReportForm({ ...emptyReportForm, date: getToday() })
      setWorkItems([])
      setOtherMaterials([])
      await loadSiteBundle(site)
      setScreen('engineerEntry')
    } catch (error) {
      showMessage(error?.message || 'Failed to open existing engineer work.')
    } finally {
      setLoading(false)
    }
  }

  const joinAsEngineer = async () => {
    if (!engineerForm.engineerName.trim() || !engineerForm.engineerCode.trim()) {
      showMessage('Engineer name and code are required.')
      return
    }

    setLoading(true)

    try {
      const site = await findSiteByCode('engineerCode', engineerForm.engineerCode)

      if (!site) {
        showMessage('Engineer code not found.')
        return
      }

      const engineerProfile = {
        id: `${site.id}_${engineerForm.mobile || engineerForm.engineerName}`,
        siteId: site.id,
        siteName: site.siteName,
        name: engineerForm.engineerName,
        mobile: engineerForm.mobile,
        engineerCode: engineerForm.engineerCode.trim().toUpperCase(),
        role: 'Site Engineer',
        createdAt: new Date().toISOString(),
      }

      const nextProfiles = upsertLocalProfile(ENGINEER_PROFILES_KEY, engineerProfile)
      setSavedEngineers(nextProfiles)
      setCurrentEngineer(engineerProfile)
      setReportForm({ ...emptyReportForm, date: getToday() })
      setWorkItems([])
      setOtherMaterials([])
      await loadSiteBundle(site)
      setScreen('engineerEntry')
      showMessage(`Engineer connected with ${site.siteName}.`)
    } catch (error) {
      showMessage(error?.message || 'Engineer login failed.')
    } finally {
      setLoading(false)
    }
  }

  const openExistingLabourWork = async (profile) => {
    setLoading(true)

    try {
      const siteRef = doc(db, 'siteDiaries', profile.siteId)
      const siteSnap = await getDoc(siteRef)

      if (!siteSnap.exists()) {
        showMessage('Saved site not found. Please join again using New Work.')
        return
      }

      const site = { id: siteSnap.id, ...siteSnap.data() }
      setCurrentLabour(profile)
      localStorage.setItem(LABOUR_PROFILE_KEY, JSON.stringify(profile))
      await loadSiteBundle(site)
      setScreen('labourAttendance')
    } catch (error) {
      showMessage(error?.message || 'Failed to open existing labour work.')
    } finally {
      setLoading(false)
    }
  }

  const joinAsLabour = async () => {
    if (!labourForm.labourName.trim() || !labourForm.labourCode.trim()) {
      showMessage('Labour name and code are required.')
      return
    }

    setLoading(true)

    try {
      const site = await findSiteByCode('labourCode', labourForm.labourCode)

      if (!site) {
        showMessage('Labour code not found.')
        return
      }

      const labourId = generateId()
      const labour = {
        id: labourId,
        siteId: site.id,
        name: labourForm.labourName,
        mobile: labourForm.mobile,
        workType: labourForm.workType,
        workingUnder: labourForm.workingUnder,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'labourMembers', labourId), labour)

      const labourProfile = {
        ...labour,
        siteName: site.siteName,
        labourCode: labourForm.labourCode.trim().toUpperCase(),
        role: 'Labour',
      }

      const nextProfiles = upsertLocalProfile(LABOUR_PROFILES_KEY, labourProfile)
      setSavedLabours(nextProfiles)
      localStorage.setItem(LABOUR_PROFILE_KEY, JSON.stringify(labourProfile))
      setCurrentLabour(labourProfile)
      await loadSiteBundle(site)
      setScreen('labourAttendance')
      showMessage('Labour setup saved. Now daily attendance can be marked.')
    } catch (error) {
      showMessage(error?.message || 'Failed to save labour setup.')
    } finally {
      setLoading(false)
    }
  }

  const addWorkItem = () => {
    if (!workItemForm.workName.trim()) {
      showMessage('Work name is required.')
      return
    }

    setWorkItems((prev) => [...prev, { id: generateId(), ...workItemForm }])
    setWorkItemForm(emptyWorkItemForm)
  }

  const removeWorkItem = (id) => {
    setWorkItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addOtherMaterial = () => {
    if (!otherMaterialForm.name.trim() || !otherMaterialForm.quantity) {
      showMessage('Material name and quantity are required.')
      return
    }

    setOtherMaterials((prev) => [...prev, { id: generateId(), ...otherMaterialForm }])
    setOtherMaterialForm(emptyOtherMaterialForm)
  }

  const removeOtherMaterial = (id) => {
    setOtherMaterials((prev) => prev.filter((item) => item.id !== id))
  }

  const saveStockItem = async () => {
    if (!selectedSite) return

    if (!stockForm.materialName.trim() || !stockForm.quantity || !stockForm.unit) {
      showMessage('Material name, quantity and unit are required.')
      return
    }

    setLoading(true)

    try {
      const materialId = generateId()
      const stockItem = {
        id: materialId,
        siteId: selectedSite.id,
        materialName: stockForm.materialName.trim(),
        quantity: num(stockForm.quantity),
        unit: stockForm.unit,
        rate: num(stockForm.rate),
        supplier: stockForm.supplier,
        purchaseDate: stockForm.purchaseDate || getToday(),
        billNo: stockForm.billNo,
        notes: stockForm.notes,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'siteMaterials', materialId), stockItem)
      setStockForm(emptyStockForm)
      setShowStockForm(false)
      await loadSiteBundle(selectedSite)
      showMessage('Material stock added successfully.')
    } catch (error) {
      showMessage(error?.message || 'Failed to add material stock.')
    } finally {
      setLoading(false)
    }
  }

  const deleteStockItem = async (materialId) => {
    if (!selectedSite) return

    setLoading(true)

    try {
      await deleteDoc(doc(db, 'siteMaterials', materialId))
      await loadSiteBundle(selectedSite)
      showMessage('Material stock entry deleted.')
    } catch (error) {
      showMessage(error?.message || 'Failed to delete material stock.')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (files) => {
    const selected = Array.from(files || []).slice(0, 3)

    if (!selected.length) {
      setPhotoFiles([])
      setPhotoPreviews([])
      return
    }

    setLoading(true)

    try {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url))
      const compressedFiles = []

      for (const file of selected) {
        const compressedFile = await compressImageToUnder2MB(file)
        compressedFiles.push(compressedFile)
      }

      setPhotoFiles(compressedFiles)
      setPhotoPreviews(compressedFiles.map((file) => URL.createObjectURL(file)))
      showMessage('Photos compressed successfully and ready to upload.')
    } catch (error) {
      setPhotoFiles([])
      setPhotoPreviews([])
      showMessage(error?.message || 'Photo compression failed.')
    } finally {
      setLoading(false)
    }
  }

  const makeSafeStorageName = (name) => {
    const extension = name.includes('.') ? name.split('.').pop().toLowerCase() : 'jpg'
    const cleanBase = name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40)

    return `${cleanBase || 'site-photo'}.${extension || 'jpg'}`
  }

  const uploadPhotos = async (reportId) => {
    const uploaded = []

    if (!selectedSite?.id) {
      throw new Error('Site is not selected. Please reopen the site diary.')
    }

    for (const file of photoFiles) {
      const safeFileName = makeSafeStorageName(file.name)
      const path = [
        String(selectedSite.id).replace(/[^a-zA-Z0-9-]/g, ''),
        String(reportId).replace(/[^a-zA-Z0-9-]/g, ''),
        `${Date.now()}-${safeFileName}`,
      ].join('/')

      const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg',
      })

      if (error) throw new Error(error.message || 'Photo upload failed.')

      const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
      uploaded.push({ name: file.name, url: data.publicUrl, path })
    }

    return uploaded
  }

  const submitEngineerReport = async () => {
    if (!selectedSite || !currentEngineer) return

    if (!reportForm.workDone.trim() && !workItems.length) {
      showMessage('Add at least one work item or work summary.')
      return
    }

    setLoading(true)

    try {
      const reportId = generateId()
      const photos = photoFiles.length ? await uploadPhotos(reportId) : []
      const reportDraft = {
        ...reportForm,
        workItems,
        otherMaterials,
      }
      const materialCost = calculateMaterialCost(reportDraft, selectedSite)

      const report = {
        id: reportId,
        siteId: selectedSite.id,
        ...reportDraft,
        materialCost,
        shutteringCost: num(reportForm.shutteringCost),
        equipmentCost: num(reportForm.equipmentCost),
        otherCost: num(reportForm.otherCost),
        submittedBy: currentEngineer.name,
        submittedByMobile: currentEngineer.mobile,
        photos,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'dailyReports', reportId), report)

      setReportForm({ ...emptyReportForm, date: getToday() })
      setWorkItems([])
      setOtherMaterials([])
      setPhotoFiles([])
      setPhotoPreviews([])
      await loadSiteBundle(selectedSite)
      showMessage('Daily site report submitted successfully.')
    } catch (error) {
      showMessage(error?.message || 'Failed to submit daily report.')
    } finally {
      setLoading(false)
    }
  }

  const submitAttendance = async () => {
    if (!selectedSite || !currentLabour) return

    setLoading(true)

    try {
      const today = getToday()
      const attendanceId = `${selectedSite.id}_${currentLabour.id}_${today}`
      const attendance = {
        id: attendanceId,
        siteId: selectedSite.id,
        labourId: currentLabour.id,
        labourName: currentLabour.name,
        mobile: currentLabour.mobile,
        workType: currentLabour.workType,
        workingUnder: currentLabour.workingUnder,
        date: today,
        status: attendanceForm.status,
        dayType: attendanceForm.dayType,
        remarks: attendanceForm.remarks,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'attendanceReports', attendanceId), attendance)
      setAttendanceForm({ status: 'Present', dayType: 'Full Day', remarks: '' })
      await loadSiteBundle(selectedSite)
      showMessage('Attendance saved successfully.')
    } catch (error) {
      showMessage(error?.message || 'Failed to save attendance.')
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId) => {
    if (!selectedSite) return

    setLoading(true)

    try {
      await deleteDoc(doc(db, 'dailyReports', reportId))
      await loadSiteBundle(selectedSite)
      showMessage('Report deleted.')
    } catch (error) {
      showMessage(error?.message || 'Failed to delete report.')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      showMessage(`${code} copied.`)
    } catch {
      showMessage(code)
    }
  }

  const getSummaryForDates = (start, end) => {
    const reports = (selectedSite?.dailyReports || []).filter((report) => dateInRange(report.date, start, end))
    const attendance = (selectedSite?.attendanceReports || []).filter((item) => dateInRange(item.date, start, end))
    const present = attendance.filter((item) => item.status === 'Present')
    const absent = attendance.filter((item) => item.status === 'Absent')
    const materialUsage = aggregateMaterialUsage(reports, selectedSite)
    const materialCost = materialUsage.reduce((sum, item) => sum + num(item.value), 0)
    const shutteringCost = reports.reduce((sum, report) => sum + num(report.shutteringCost), 0)
    const equipmentCost = reports.reduce((sum, report) => sum + num(report.equipmentCost), 0)
    const otherCost = reports.reduce((sum, report) => sum + num(report.otherCost), 0)
    const labourCost = attendance.reduce((sum, item) => sum + calculateAttendanceCost(item, selectedSite), 0)

    return {
      reports,
      attendance,
      present,
      absent,
      materialUsage,
      materialCost,
      shutteringCost,
      equipmentCost,
      otherCost,
      labourCost,
      totalCost: materialCost + shutteringCost + equipmentCost + otherCost + labourCost,
    }
  }

  const generatePDF = async (mode = 'daily') => {
    if (!selectedSite) return

    try {
      const { default: jsPDF } = await import('jspdf')
      await import('jspdf-autotable')

      const isRange = mode === 'range'
      const start = isRange ? rangeStart : selectedReportDate
      const end = isRange ? rangeEnd : selectedReportDate
      const summary = isRange ? getSummaryForDates(start, end) : todaySummary
      const docPdf = new jsPDF()
      const reportTitle = isRange ? 'Site Summary Report' : 'Daily Site Report'

      docPdf.setFontSize(18)
      docPdf.text(reportTitle, 14, 18)
      docPdf.setFontSize(10)
      docPdf.text(`Site: ${selectedSite.siteName}`, 14, 28)
      docPdf.text(`Location: ${selectedSite.siteLocation || '-'}`, 14, 34)
      docPdf.text(`Period: ${isRange ? `${start} to ${end}` : selectedReportDate}`, 14, 40)
      docPdf.text(`Owner/Contractor: ${selectedSite.ownerName}`, 14, 46)

      docPdf.autoTable({
        startY: 56,
        head: [['Summary', 'Value']],
        body: [
          ['Reports Submitted', String(summary?.reports.length || 0)],
          ['Labour Present Entries', String(summary?.present.length || 0)],
          ['Labour Absent Entries', String(summary?.absent.length || 0)],
          ['Material Cost', money(summary?.materialCost || 0)],
          ['Shuttering Cost', money(summary?.shutteringCost || 0)],
          ['Labour Cost', money(summary?.labourCost || 0)],
          ['Equipment Cost', money(summary?.equipmentCost || 0)],
          ['Other Cost', money(summary?.otherCost || 0)],
          ['Total Cost', money(summary?.totalCost || 0)],
          ['Project Total Till Date', money(totalProjectCost)],
        ],
      })

      docPdf.autoTable({
        startY: docPdf.lastAutoTable.finalY + 10,
        head: [['Material', 'Qty', 'Unit', 'Cost']],
        body: summary?.materialUsage?.length
          ? summary.materialUsage.map((item) => [item.name, qty(item.quantity), item.unit, money(item.value)])
          : [['-', '-', '-', 'No material used']],
      })

      const workRows = []
      ;(summary?.reports || []).forEach((report) => {
        if (report.workItems?.length) {
          report.workItems.forEach((item, index) => {
            workRows.push([
              report.date,
              item.category,
              item.workName,
              item.location || '-',
              `${item.quantity || '-'} ${item.unit || ''}`,
              index === 0 ? report.submittedBy : '',
            ])
          })
        } else {
          workRows.push([
            report.date,
            '-',
            report.workDone || 'Work report',
            '-',
            '-',
            report.submittedBy,
          ])
        }
      })

      docPdf.autoTable({
        startY: docPdf.lastAutoTable.finalY + 10,
        head: [['Date', 'Category', 'Work', 'Location', 'Qty', 'Engineer']],
        body: workRows.length ? workRows : [['-', '-', 'No work report', '-', '-', '-']],
      })

      docPdf.autoTable({
        startY: docPdf.lastAutoTable.finalY + 10,
        head: [['Date', 'Name', 'Work Type', 'Status', 'Day Type']],
        body: summary?.attendance?.length
          ? summary.attendance.map((item) => [item.date, item.labourName, item.workType, item.status, item.dayType])
          : [['-', '-', '-', 'No attendance', '-']],
      })

      docPdf.save(
        `${selectedSite.siteName || 'site'}-${isRange ? 'summary' : 'daily-report'}-${start}-${end}.pdf`
      )
    } catch {
      showMessage('PDF package missing. Install jspdf and jspdf-autotable.')
    }
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <ClipboardList size={14} /> CivilCalc Pro Site Management
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Site Diary</h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400 md:text-base">
              Daily Site Report, Material Stock, Labour Attendance, Photos and Expense Tracking.
            </p>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              दैनिक साइट रिपोर्ट, सामग्री स्टॉक, मजदूर उपस्थिति, फोटो और खर्च ट्रैकिंग।
            </p>
          </div>

          {screen !== 'home' ? (
            <SecondaryButton onClick={goHome} icon={ArrowLeft}>
              Back to Roles
            </SecondaryButton>
          ) : null}
        </div>

        {message ? (
          <div className="mb-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200">
            {message}
          </div>
        ) : null}

        {loading ? (
          <div className="mb-5 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
            Processing...
          </div>
        ) : null}

        {screen === 'home' ? (
          <section className="grid gap-5 md:grid-cols-3">
            <button
              onClick={() => setScreen('owner')}
              className="min-h-[260px] rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400 hover:bg-slate-900"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
                <UserRound size={32} />
              </div>
              <h2 className="text-2xl font-black">Owner / Contractor</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">मालिक / ठेकेदार</p>
              <p className="mt-3 text-sm text-slate-400">
                Create site diary, add material stock, monitor progress, cost and reports.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                साइट डायरी बनाएं, सामग्री स्टॉक जोड़ें और दैनिक प्रगति व खर्च देखें।
              </p>
            </button>

            <button
              onClick={() => setScreen('engineerStart')}
              className="min-h-[260px] rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400 hover:bg-slate-900"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
                <HardHat size={32} />
              </div>
              <h2 className="text-2xl font-black">Site Engineer</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">साइट इंजीनियर</p>
              <p className="mt-3 text-sm text-slate-400">
                Add multiple work items, material used, shuttering, issues, plan and photos.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                कई काम, सामग्री उपयोग, शटरिंग, समस्या, योजना और फोटो जमा करें।
              </p>
            </button>

            <button
              onClick={() => setScreen('labourStart')}
              className="min-h-[260px] rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400 hover:bg-slate-900"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
                <UsersRound size={32} />
              </div>
              <h2 className="text-2xl font-black">Labour</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">मजदूर</p>
              <p className="mt-3 text-sm text-slate-400">
                Save details once, then mark daily Present / Absent.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                एक बार जानकारी सेव करें, फिर रोज उपस्थित या अनुपस्थित मार्क करें।
              </p>
            </button>
          </section>
        ) : null}

        {screen === 'owner' ? (
          <section className="grid gap-5 md:grid-cols-2">
            <button
              onClick={() => setScreen('ownerCreate')}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400"
            >
              <Plus className="mb-4 text-cyan-300" size={34} />
              <h2 className="text-2xl font-black">Create New Site Diary</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">नई साइट डायरी बनाएं</p>
              <p className="mt-3 text-sm text-slate-400">Create a fresh diary for a new project site.</p>
            </button>

            <button
              onClick={() => setScreen('ownerOpen')}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400"
            >
              <FolderOpen className="mb-4 text-cyan-300" size={34} />
              <h2 className="text-2xl font-black">Open Existing Site Diary</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">पुरानी साइट डायरी खोलें</p>
              <p className="mt-3 text-sm text-slate-400">Open diary using Owner Code.</p>
            </button>
          </section>
        ) : null}

        {screen === 'ownerCreate' ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <h2 className="mb-5 text-2xl font-black">Create New Site Diary</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Site Name" value={ownerForm.siteName} onChange={(v) => updateOwner('siteName', v)} placeholder="Sharma House Project" />
              <SelectField label="Project Type" value={ownerForm.projectType} onChange={(v) => updateOwner('projectType', v)} options={['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation']} />
              <Field label="Site Location" value={ownerForm.siteLocation} onChange={(v) => updateOwner('siteLocation', v)} placeholder="Ahmedabad, Gujarat" />
              <Field label="Owner / Contractor Name" value={ownerForm.ownerName} onChange={(v) => updateOwner('ownerName', v)} placeholder="Owner name" />
              <Field label="Client Name" value={ownerForm.clientName} onChange={(v) => updateOwner('clientName', v)} placeholder="Client name" />
              <Field label="Start Date" type="date" value={ownerForm.startDate} onChange={(v) => updateOwner('startDate', v)} />
              <Field label="Estimated End Date" type="date" value={ownerForm.estimatedEndDate} onChange={(v) => updateOwner('estimatedEndDate', v)} />
              <Field label="Estimated Budget" type="number" value={ownerForm.budget} onChange={(v) => updateOwner('budget', v)} placeholder="5000000" />
            </div>

            <h3 className="mt-8 mb-4 text-xl font-black">Default Rates</h3>

            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Cement ₹/bag" type="number" value={ownerForm.cementRate} onChange={(v) => updateOwner('cementRate', v)} />
              <Field label="Steel ₹/kg" type="number" value={ownerForm.steelRate} onChange={(v) => updateOwner('steelRate', v)} />
              <Field label="Sand ₹/cft" type="number" value={ownerForm.sandRate} onChange={(v) => updateOwner('sandRate', v)} />
              <Field label="Aggregate ₹/cft" type="number" value={ownerForm.aggregateRate} onChange={(v) => updateOwner('aggregateRate', v)} />
              <Field label="Brick ₹/piece" type="number" value={ownerForm.brickRate} onChange={(v) => updateOwner('brickRate', v)} />
              <Field label="Labour ₹/day" type="number" value={ownerForm.labourRate} onChange={(v) => updateOwner('labourRate', v)} />
            </div>

            <div className="mt-4">
              <Field label="Notes" as="textarea" value={ownerForm.notes} onChange={(v) => updateOwner('notes', v)} placeholder="Special instruction, contract note, etc." />
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={createSite} icon={Save}>
                Create Site Diary
              </PrimaryButton>
            </div>
          </section>
        ) : null}

        {screen === 'ownerOpen' ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <h2 className="mb-5 text-2xl font-black">Open Existing Site Diary</h2>

            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Field
                label="Owner Code"
                value={ownerCodeInput}
                onChange={(v) => setOwnerCodeInput(v.toUpperCase())}
                placeholder="OWN-ABCDE"
              />

              <PrimaryButton onClick={openOwnerSite} icon={FolderOpen}>
                Open Diary
              </PrimaryButton>
            </div>
          </section>
        ) : null}

        {screen === 'ownerDashboard' && selectedSite ? (
          <section className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-semibold text-cyan-300">Owner Dashboard</p>
                  <h2 className="mt-1 text-3xl font-black">{selectedSite.siteName}</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {selectedSite.siteLocation || 'No location added'} • {selectedSite.projectType}
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <PrimaryButton onClick={() => generatePDF('daily')} icon={Download}>
                    Daily PDF
                  </PrimaryButton>
                  <SecondaryButton onClick={() => generatePDF('range')} icon={Download}>
                    Range PDF
                  </SecondaryButton>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ['Owner Code', selectedSite.ownerCode],
                  ['Engineer Code', selectedSite.engineerCode],
                  ['Labour Code', selectedSite.labourCode],
                ].map(([label, code]) => (
                  <div key={code} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-xs text-slate-400">{label}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-xl font-black text-cyan-300">{code}</p>
                      <button
                        type="button"
                        onClick={() => copyCode(code)}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm font-bold text-white">Select Report Date</p>
                  <p className="mt-1 text-sm text-slate-400">View daily work, attendance and expense.</p>
                  <p className="mt-1 text-sm text-slate-500">दैनिक रिपोर्ट देखने के लिए तारीख चुनें।</p>
                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                      type="date"
                      value={selectedReportDate}
                      onChange={(e) => setSelectedReportDate(e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                    <SecondaryButton onClick={() => setSelectedReportDate(getToday())}>Today</SecondaryButton>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm font-bold text-white">Summary PDF Range</p>
                  <p className="mt-1 text-sm text-slate-400">Download full summary from start date to selected end date.</p>
                  <p className="mt-1 text-sm text-slate-500">तारीख रेंज की पूरी रिपोर्ट डाउनलोड करें।</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input
                      type="date"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                    <input
                      type="date"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <StatCard title="Reports" value={todaySummary?.reports.length || 0} sub="Engineer submissions" icon={ClipboardList} />
              <StatCard title="Present Labour" value={todaySummary?.present.length || 0} sub={`Absent: ${todaySummary?.absent.length || 0}`} icon={CheckCircle2} />
              <StatCard title="Selected Date Expense" value={money(todaySummary?.totalCost || 0)} sub="Material + labour + shuttering" icon={IndianRupee} />
              <StatCard title="Project Total" value={money(totalProjectCost)} sub="Till date" icon={CalendarDays} />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                <div>
                  <h3 className="text-xl font-black">Budget vs Actual</h3>
                  <p className="mt-1 text-sm text-slate-400">Estimated budget compared with project spending.</p>
                  <p className="mt-1 text-sm text-slate-500">अनुमानित बजट और अभी तक का खर्च।</p>
                </div>
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-200">
                  Used: {budgetUsedPercent}%
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Estimated Budget" value={money(selectedSite.budget || 0)} sub="Owner entered budget" icon={IndianRupee} />
                <StatCard title="Spent Till Date" value={money(totalProjectCost)} sub="All reports + labour" icon={IndianRupee} />
                <StatCard title="Remaining" value={money(num(selectedSite.budget) - totalProjectCost)} sub="Budget balance" icon={IndianRupee} />
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-cyan-400" style={{ width: `${budgetUsedPercent}%` }} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <h3 className="text-xl font-black">Site Material Stock</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Purchased material, used material and current available stock.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    खरीदा गया सामान, इस्तेमाल हुआ सामान और साइट पर बचा हुआ स्टॉक।
                  </p>
                </div>
                <PrimaryButton onClick={() => setShowStockForm((prev) => !prev)} icon={Plus}>
                  Add Material Stock
                </PrimaryButton>
              </div>

              {showStockForm ? (
                <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Field label="Material Name" value={stockForm.materialName} onChange={(v) => updateStock('materialName', v)} placeholder="Cement / Steel / Tiles" />
                    <Field label="Quantity" type="number" value={stockForm.quantity} onChange={(v) => updateStock('quantity', v)} placeholder="100" />
                    <SelectField label="Unit" value={stockForm.unit} onChange={(v) => updateStock('unit', v)} options={UNIT_OPTIONS} />
                    <Field label="Rate" type="number" value={stockForm.rate} onChange={(v) => updateStock('rate', v)} placeholder="420" />
                    <Field label="Supplier Optional" value={stockForm.supplier} onChange={(v) => updateStock('supplier', v)} placeholder="Supplier name" />
                    <Field label="Purchase Date" type="date" value={stockForm.purchaseDate} onChange={(v) => updateStock('purchaseDate', v)} />
                    <Field label="Bill No Optional" value={stockForm.billNo} onChange={(v) => updateStock('billNo', v)} placeholder="Bill no" />
                    <Field label="Notes Optional" value={stockForm.notes} onChange={(v) => updateStock('notes', v)} placeholder="Truck no, payment note" />
                  </div>
                  <div className="mt-4">
                    <PrimaryButton onClick={saveStockItem} icon={Save}>
                      Save Material Stock
                    </PrimaryButton>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <h4 className="mb-3 font-black text-white">Purchase Entries / खरीदा गया सामान</h4>
                  <div className="space-y-3">
                    {(selectedSite.materialStocks || []).length ? (
                      selectedSite.materialStocks.map((item) => (
                        <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                          <div>
                            <p className="font-bold text-white">{item.materialName}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {qty(item.quantity)} {item.unit} @ {money(item.rate)} = {money(num(item.quantity) * num(item.rate))}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.purchaseDate || '-'} {item.supplier ? `• ${item.supplier}` : ''}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteStockItem(item.id)}
                            className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No material stock added yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <h4 className="mb-3 font-black text-white">Current Stock / मौजूदा स्टॉक</h4>
                  <div className="space-y-3">
                    {stockSummary.length ? (
                      stockSummary.map((item) => (
                        <div key={item.key} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="mt-1 text-xs text-slate-400">Average Rate: {money(item.avgRate)}/{item.unit}</p>
                            </div>
                            <p className={`rounded-full px-3 py-1 text-xs font-bold ${item.remainingQty < 0 ? 'bg-red-400/10 text-red-300' : 'bg-cyan-400/10 text-cyan-300'}`}>
                              Current: {qty(item.remainingQty)} {item.unit}
                            </p>
                          </div>
                          <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-3">
                            <span>Purchased: {qty(item.purchasedQty)} {item.unit}</span>
                            <span>Used: {qty(item.usedQty)} {item.unit}</span>
                            <span>Value: {money(item.remainingValue)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No stock summary available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                <div>
                  <h3 className="text-xl font-black">Material Breakdown - {selectedReportDate}</h3>
                  <p className="mt-1 text-sm text-slate-400">Material used on selected date with estimated cost.</p>
                  <p className="mt-1 text-sm text-slate-500">चुनी गई तारीख पर उपयोग की गई सामग्री और अनुमानित लागत।</p>
                </div>
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-200">
                  Total Material Cost: {money(todaySummary?.materialCost || 0)}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                {(todaySummary?.materialUsage || []).length ? (
                  todaySummary.materialUsage.map((item) => (
                    <MaterialMiniCard
                      key={item.key}
                      title={item.name}
                      value={qty(item.quantity)}
                      unit={item.unit}
                      rate="Auto"
                      cost={money(item.value)}
                    />
                  ))
                ) : (
                  <p className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400 md:col-span-5">
                    No material used for this date.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="mb-4 text-xl font-black">Work Reports - {selectedReportDate}</h3>
                <div className="space-y-4">
                  {todaySummary?.reports.length ? (
                    todaySummary.reports.map((report) => (
                      <div key={report.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-cyan-300">{report.date} • By {report.submittedBy}</p>
                            {report.workDone ? <p className="mt-2 text-sm text-white">{report.workDone}</p> : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteReport(report.id)}
                            className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {report.workItems?.length ? (
                          <div className="mt-3 space-y-2">
                            {report.workItems.map((item) => (
                              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm">
                                <p className="font-bold text-white">{item.workName}</p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {item.category} • {item.location || 'Site'} • Qty: {item.quantity || '-'} {item.unit}
                                </p>
                                {item.remarks ? <p className="mt-1 text-xs text-slate-500">{item.remarks}</p> : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-3 grid gap-2 text-xs text-slate-300 md:grid-cols-4">
                          <span>Material: {money(report.materialCost)}</span>
                          <span>Shuttering: {money(report.shutteringCost)}</span>
                          <span>Equipment: {money(report.equipmentCost)}</span>
                          <span>Other: {money(report.otherCost)}</span>
                        </div>

                        {report.shutteringArea || report.propsNos || report.scaffoldingUsed === 'Yes' ? (
                          <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-100">
                            Shuttering: {report.shutteringArea || 0} {report.shutteringUnit || 'm²'} • Props: {report.propsNos || 0} • Scaffolding: {report.scaffoldingUsed || 'No'}
                          </p>
                        ) : null}

                        {report.issues ? (
                          <p className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-100">
                            Issue: {report.issues}
                          </p>
                        ) : null}

                        {report.tomorrowPlan ? (
                          <p className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-xs text-cyan-100">
                            Tomorrow Plan: {report.tomorrowPlan}
                          </p>
                        ) : null}

                        {report.photos?.length ? (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {report.photos.map((photo, index) => (
                              <img key={`${photo.url}-${index}`} src={photo.url} alt={photo.name || 'Site photo'} className="h-24 w-full rounded-xl object-cover" />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
                      No engineer report submitted for this date.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="mb-4 text-xl font-black">Labour Attendance - {selectedReportDate}</h3>
                <div className="space-y-3">
                  {todaySummary?.attendance.length ? (
                    todaySummary.attendance.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div>
                          <p className="font-bold text-white">{item.labourName}</p>
                          <p className="text-xs text-slate-400">{item.workType} • {item.dayType}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === 'Present' ? 'bg-green-400/10 text-green-300' : 'bg-red-400/10 text-red-300'}`}>
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
                      No labour attendance marked for this date.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="mb-4 text-xl font-black">All Reports History</h3>
              <div className="space-y-3">
                {(selectedSite.dailyReports || []).length ? (
                  selectedSite.dailyReports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReportDate(report.date)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left transition hover:border-cyan-400"
                    >
                      <p className="text-sm font-bold text-cyan-300">{report.date} • {report.submittedBy}</p>
                      <p className="mt-1 text-sm text-white">
                        {report.workItems?.length ? `${report.workItems.length} work item(s)` : report.workDone || 'Work report'}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">Material Cost: {money(report.materialCost)}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No history yet.</p>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {screen === 'engineerStart' ? (
          <section className="grid gap-5 md:grid-cols-2">
            <button
              onClick={() => setScreen('engineerJoin')}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400"
            >
              <Plus className="mb-4 text-cyan-300" size={34} />
              <h2 className="text-2xl font-black">New Work</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">नया काम</p>
              <p className="mt-3 text-sm text-slate-400">Join a new site using Engineer Code.</p>
              <p className="mt-2 text-sm text-slate-500">इंजीनियर कोड डालकर नई साइट से जुड़ें।</p>
            </button>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <FolderOpen className="mb-4 text-cyan-300" size={34} />
              <h2 className="text-2xl font-black">Existing Work</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">पहले से जुड़ी साइट</p>
              <p className="mt-3 text-sm text-slate-400">Open saved engineer work without entering code again.</p>

              <div className="mt-5 space-y-3">
                {savedEngineers.length ? (
                  savedEngineers.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => openExistingEngineerWork(profile)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left transition hover:border-cyan-400"
                    >
                      <p className="font-bold text-white">{profile.siteName}</p>
                      <p className="mt-1 text-xs text-slate-400">{profile.name} • {profile.mobile || 'No mobile'}</p>
                    </button>
                  ))
                ) : (
                  <p className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
                    No saved engineer work found. Use New Work first.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {screen === 'engineerJoin' ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <h2 className="mb-5 text-2xl font-black">Site Engineer Login</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Engineer Name" value={engineerForm.engineerName} onChange={(v) => updateEngineer('engineerName', v)} placeholder="Rahul Patel" />
              <Field label="Mobile Number" value={engineerForm.mobile} onChange={(v) => updateEngineer('mobile', v)} placeholder="98765xxxxx" />
              <Field label="Engineer Code" value={engineerForm.engineerCode} onChange={(v) => updateEngineer('engineerCode', v.toUpperCase())} placeholder="ENG-ABCDE" />
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={joinAsEngineer} icon={HardHat}>Continue</PrimaryButton>
            </div>
          </section>
        ) : null}

        {screen === 'engineerEntry' && selectedSite && currentEngineer ? (
          <section className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
              <div className="mb-6">
                <p className="text-sm text-cyan-300">{selectedSite.siteName}</p>
                <h2 className="text-2xl font-black">Daily Work Progress</h2>
                <p className="mt-1 text-sm text-slate-400">Submitting as {currentEngineer.name}</p>
              </div>

              <Field label="Report Date" type="date" value={reportForm.date} onChange={(v) => updateReport('date', v)} />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
              <div className="mb-5">
                <h3 className="text-xl font-black">Work Items / आज के काम</h3>
                <p className="mt-1 text-sm text-slate-400">Add Column, Beam, Slab, Shuttering, Brickwork or any other work separately.</p>
                <p className="mt-1 text-sm text-slate-500">कॉलम, बीम, स्लैब, शटरिंग या अन्य काम अलग-अलग जोड़ें।</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label="Work Category" value={workItemForm.category} onChange={(v) => updateWorkItem('category', v)} options={WORK_CATEGORIES} />
                <Field label="Work Name" value={workItemForm.workName} onChange={(v) => updateWorkItem('workName', v)} placeholder="Column Casting / Beam Shuttering" />
                <Field label="Location" value={workItemForm.location} onChange={(v) => updateWorkItem('location', v)} placeholder="Ground Floor / Terrace" />
                <Field label="Quantity" type="number" value={workItemForm.quantity} onChange={(v) => updateWorkItem('quantity', v)} placeholder="12" />
                <SelectField label="Unit" value={workItemForm.unit} onChange={(v) => updateWorkItem('unit', v)} options={UNIT_OPTIONS} />
                <Field label="Remarks" value={workItemForm.remarks} onChange={(v) => updateWorkItem('remarks', v)} placeholder="Optional note" />
              </div>

              <div className="mt-4">
                <SecondaryButton onClick={addWorkItem} icon={Plus}>Add Work Item</SecondaryButton>
              </div>

              {workItems.length ? (
                <div className="mt-5 space-y-3">
                  {workItems.map((item, index) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                      <div>
                        <p className="font-bold text-white">{index + 1}. {item.workName}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.category} • {item.location || 'Site'} • Qty: {item.quantity || '-'} {item.unit}
                        </p>
                        {item.remarks ? <p className="mt-1 text-xs text-slate-500">{item.remarks}</p> : null}
                      </div>
                      <button type="button" onClick={() => removeWorkItem(item.id)} className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-400/10">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-5">
                <Field label="Overall Work Summary Optional" as="textarea" value={reportForm.workDone} onChange={(v) => updateReport('workDone', v)} placeholder="Write short summary if needed" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
              <h3 className="mb-4 text-xl font-black">Material Used / सामग्री उपयोग</h3>

              <div className="grid gap-4 md:grid-cols-5">
                <Field label="Cement Bags" type="number" value={reportForm.cementBags} onChange={(v) => updateReport('cementBags', v)} />
                <Field label="Sand cft" type="number" value={reportForm.sandCft} onChange={(v) => updateReport('sandCft', v)} />
                <Field label="Aggregate cft" type="number" value={reportForm.aggregateCft} onChange={(v) => updateReport('aggregateCft', v)} />
                <Field label="Steel kg" type="number" value={reportForm.steelKg} onChange={(v) => updateReport('steelKg', v)} />
                <Field label="Bricks Nos" type="number" value={reportForm.bricksNos} onChange={(v) => updateReport('bricksNos', v)} />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <h4 className="mb-3 font-black text-white">Add Other Material / अन्य सामग्री जोड़ें</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <Field label="Material Name" value={otherMaterialForm.name} onChange={(v) => updateOtherMaterial('name', v)} placeholder="Tiles / Paint / Pipes" />
                  <Field label="Quantity" type="number" value={otherMaterialForm.quantity} onChange={(v) => updateOtherMaterial('quantity', v)} />
                  <SelectField label="Unit" value={otherMaterialForm.unit} onChange={(v) => updateOtherMaterial('unit', v)} options={UNIT_OPTIONS} />
                  <Field label="Rate" type="number" value={otherMaterialForm.rate} onChange={(v) => updateOtherMaterial('rate', v)} />
                </div>
                <div className="mt-4">
                  <SecondaryButton onClick={addOtherMaterial} icon={Plus}>Add Material</SecondaryButton>
                </div>

                {otherMaterials.length ? (
                  <div className="mt-4 space-y-2">
                    {otherMaterials.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                        <p className="text-sm text-white">
                          {item.name}: {item.quantity} {item.unit} @ {money(item.rate)} = {money(num(item.quantity) * num(item.rate))}
                        </p>
                        <button type="button" onClick={() => removeOtherMaterial(item.id)} className="text-red-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                Auto Material Cost: <b>{money(calculateMaterialCost({ ...reportForm, otherMaterials }, selectedSite))}</b>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
              <h3 className="mb-4 text-xl font-black">Shuttering, Equipment, Issues & Photos</h3>

              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Shuttering Area" type="number" value={reportForm.shutteringArea} onChange={(v) => updateReport('shutteringArea', v)} placeholder="85" />
                <SelectField label="Shuttering Unit" value={reportForm.shutteringUnit} onChange={(v) => updateReport('shutteringUnit', v)} options={['m²', 'sq ft', 'Nos']} />
                <Field label="Props Used Nos" type="number" value={reportForm.propsNos} onChange={(v) => updateReport('propsNos', v)} placeholder="40" />
                <SelectField label="Scaffolding Used" value={reportForm.scaffoldingUsed} onChange={(v) => updateReport('scaffoldingUsed', v)} options={['No', 'Yes']} />
                <Field label="Shuttering Cost" type="number" value={reportForm.shutteringCost} onChange={(v) => updateReport('shutteringCost', v)} placeholder="8000" />
                <Field label="Equipment Used" value={reportForm.equipmentUsed} onChange={(v) => updateReport('equipmentUsed', v)} placeholder="Mixer, Vibrator, JCB" />
                <Field label="Equipment Cost" type="number" value={reportForm.equipmentCost} onChange={(v) => updateReport('equipmentCost', v)} placeholder="2500" />
                <Field label="Other Cost" type="number" value={reportForm.otherCost} onChange={(v) => updateReport('otherCost', v)} placeholder="500" />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Site Issues / Delay Reason" as="textarea" value={reportForm.issues} onChange={(v) => updateReport('issues', v)} placeholder="Material shortage, weather issue, drawing issue etc." />
                <Field label="Tomorrow Plan" as="textarea" value={reportForm.tomorrowPlan} onChange={(v) => updateReport('tomorrowPlan', v)} placeholder="Tomorrow work plan" />
              </div>

              <div className="mt-4">
                <Field label="Engineer Remarks" as="textarea" value={reportForm.remarks} onChange={(v) => updateReport('remarks', v)} placeholder="Any additional notes" />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <label className="block text-sm font-medium text-slate-300">
                  Upload Site Photos - max 3. Large photos will be compressed automatically under 2 MB.
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"
                />

                {photoPreviews.length ? (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {photoPreviews.map((url, index) => (
                      <img key={url} src={url} alt={`Preview ${index + 1}`} className="h-28 w-full rounded-xl object-cover" />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-6">
                <PrimaryButton onClick={submitEngineerReport} icon={Save}>
                  Submit Daily Report
                </PrimaryButton>
              </div>
            </div>
          </section>
        ) : null}

        {screen === 'labourStart' ? (
          <section className="grid gap-5 md:grid-cols-2">
            <button
              onClick={() => setScreen('labourJoin')}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400"
            >
              <Plus className="mb-4 text-cyan-300" size={34} />
              <h2 className="text-2xl font-black">New Work</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">नया काम</p>
              <p className="mt-3 text-sm text-slate-400">Join a new site using Labour Code.</p>
              <p className="mt-2 text-sm text-slate-500">लेबर कोड डालकर नई साइट से जुड़ें।</p>
            </button>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <FolderOpen className="mb-4 text-cyan-300" size={34} />
              <h2 className="text-2xl font-black">Existing Work</h2>
              <p className="mt-1 text-sm font-semibold text-cyan-300">पहले से जुड़ी साइट</p>
              <p className="mt-3 text-sm text-slate-400">Open saved labour attendance without entering code again.</p>

              <div className="mt-5 space-y-3">
                {savedLabours.length ? (
                  savedLabours.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => openExistingLabourWork(profile)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left transition hover:border-cyan-400"
                    >
                      <p className="font-bold text-white">{profile.siteName}</p>
                      <p className="mt-1 text-xs text-slate-400">{profile.name} • {profile.workType}</p>
                    </button>
                  ))
                ) : (
                  <p className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
                    No saved labour work found. Use New Work first.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {screen === 'labourJoin' ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <h2 className="mb-2 text-2xl font-black">Labour First Time Setup</h2>
            <p className="mb-5 text-sm text-slate-400">Save details once, then mark Present / Absent daily.</p>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Labour Code" value={labourForm.labourCode} onChange={(v) => updateLabour('labourCode', v.toUpperCase())} placeholder="LAB-ABCDE" />
              <Field label="Name" value={labourForm.labourName} onChange={(v) => updateLabour('labourName', v)} placeholder="Ramesh" />
              <Field label="Mobile Number" value={labourForm.mobile} onChange={(v) => updateLabour('mobile', v)} placeholder="98765xxxxx" />
              <SelectField label="Work Type" value={labourForm.workType} onChange={(v) => updateLabour('workType', v)} options={['Mason / Mistri', 'Helper / Labour', 'Carpenter', 'Bar Bender', 'Electrician', 'Plumber', 'Painter', 'Tile Fitter', 'Machine Operator', 'Other']} />
              <Field label="Working Under" value={labourForm.workingUnder} onChange={(v) => updateLabour('workingUnder', v)} placeholder="Contractor / Engineer name" />
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={joinAsLabour} icon={Save}>Save Labour Details</PrimaryButton>
            </div>
          </section>
        ) : null}

        {screen === 'labourAttendance' && selectedSite && currentLabour ? (
          <section className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <div className="text-center">
              <p className="text-sm font-semibold text-cyan-300">{selectedSite.siteName}</p>
              <h2 className="mt-1 text-3xl font-black">Aaj aaye ho?</h2>
              <p className="mt-2 text-sm text-slate-400">Date: {getToday()} • {currentLabour.name} • {currentLabour.workType}</p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <button
                onClick={() => setAttendanceForm((prev) => ({ ...prev, status: 'Present' }))}
                className={`rounded-3xl border p-8 text-center transition ${attendanceForm.status === 'Present' ? 'border-green-400 bg-green-400/15 text-green-200' : 'border-slate-700 bg-slate-950/60 text-slate-300'}`}
              >
                <CheckCircle2 className="mx-auto mb-3" size={44} />
                <span className="text-2xl font-black">PRESENT</span>
              </button>

              <button
                onClick={() => setAttendanceForm((prev) => ({ ...prev, status: 'Absent' }))}
                className={`rounded-3xl border p-8 text-center transition ${attendanceForm.status === 'Absent' ? 'border-red-400 bg-red-400/15 text-red-200' : 'border-slate-700 bg-slate-950/60 text-slate-300'}`}
              >
                <XCircle className="mx-auto mb-3" size={44} />
                <span className="text-2xl font-black">ABSENT</span>
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SelectField label="Day Type" value={attendanceForm.dayType} onChange={(v) => setAttendanceForm((prev) => ({ ...prev, dayType: v }))} options={['Full Day', 'Half Day']} />
              <Field label="Remarks Optional" value={attendanceForm.remarks} onChange={(v) => setAttendanceForm((prev) => ({ ...prev, remarks: v }))} placeholder="Today work remarks" />
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={submitAttendance} icon={Save} className="md:w-full">Submit Attendance</PrimaryButton>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
