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

const STORAGE_KEY = 'civilcalc_site_diary_v1'
const LABOUR_PROFILE_KEY = 'civilcalc_site_diary_labour_profile_v1'

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
  equipmentRate: '2500',
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

const emptyReportForm = {
  date: getToday(),
  workCategory: 'RCC',
  workLocation: '',
  workDone: '',
  quantity: '',
  unit: 'm³',
  cementBags: '',
  sandCft: '',
  aggregateCft: '',
  steelKg: '',
  bricksNos: '',
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

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function generateCode(prefix) {
  const part = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `${prefix}-${part}`
}

function money(value) {
  const num = Number(value || 0)
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function num(value) {
  return Number(value || 0)
}

function readStorage() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveStorage(sites) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites))
}

function calculateMaterialCost(report, site) {
  return (
    num(report.cementBags) * num(site.cementRate) +
    num(report.steelKg) * num(site.steelRate) +
    num(report.sandCft) * num(site.sandRate) +
    num(report.aggregateCft) * num(site.aggregateRate) +
    num(report.bricksNos) * num(site.brickRate)
  )
}

function calculateAttendanceCost(attendance, site) {
  if (attendance.status !== 'Present') return 0
  const multiplier = attendance.dayType === 'Half Day' ? 0.5 : 1
  return num(site.labourRate) * multiplier
}

function Field({ label, value, onChange, placeholder, type = 'text', as = 'input' }) {
  const common =
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
          className={common}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={common}
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

export default function SiteDiaryPage() {
  const [sites, setSites] = useState([])
  const [screen, setScreen] = useState('home')
  const [selectedSiteId, setSelectedSiteId] = useState('')
  const [ownerForm, setOwnerForm] = useState(emptyOwnerForm)
  const [ownerCodeInput, setOwnerCodeInput] = useState('')
  const [engineerForm, setEngineerForm] = useState(emptyEngineerForm)
  const [labourForm, setLabourForm] = useState(emptyLabourForm)
  const [currentEngineer, setCurrentEngineer] = useState(null)
  const [currentLabour, setCurrentLabour] = useState(null)
  const [reportForm, setReportForm] = useState(emptyReportForm)
  const [attendanceForm, setAttendanceForm] = useState({
    status: 'Present',
    dayType: 'Full Day',
    remarks: '',
  })
  const [photos, setPhotos] = useState([])
  const [message, setMessage] = useState('')
  const [selectedReportDate, setSelectedReportDate] = useState(getToday())

  useEffect(() => {
    setSites(readStorage())

    try {
      const labourProfile = localStorage.getItem(LABOUR_PROFILE_KEY)
      if (labourProfile) setCurrentLabour(JSON.parse(labourProfile))
    } catch {
      setCurrentLabour(null)
    }
  }, [])

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) || null,
    [sites, selectedSiteId]
  )

  const updateSites = (nextSites) => {
    setSites(nextSites)
    saveStorage(nextSites)
  }

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3500)
  }

  const updateOwner = (key, value) => setOwnerForm((prev) => ({ ...prev, [key]: value }))
  const updateEngineer = (key, value) => setEngineerForm((prev) => ({ ...prev, [key]: value }))
  const updateLabour = (key, value) => setLabourForm((prev) => ({ ...prev, [key]: value }))
  const updateReport = (key, value) => setReportForm((prev) => ({ ...prev, [key]: value }))

  const goHome = () => {
    setScreen('home')
    setSelectedSiteId('')
    setCurrentEngineer(null)
    setPhotos([])
  }

  const createSite = () => {
    if (!ownerForm.siteName.trim() || !ownerForm.ownerName.trim()) {
      showMessage('Site name and Owner / Contractor name are required.')
      return
    }

    const site = {
      id: generateId(),
      ...ownerForm,
      startDate: ownerForm.startDate || getToday(),
      ownerCode: generateCode('OWN'),
      engineerCode: generateCode('ENG'),
      labourCode: generateCode('LAB'),
      status: 'Active',
      createdAt: new Date().toISOString(),
      dailyReports: [],
      labourMembers: [],
      attendanceReports: [],
    }

    const nextSites = [site, ...sites]
    updateSites(nextSites)
    setSelectedSiteId(site.id)
    setSelectedReportDate(getToday())
    setOwnerForm(emptyOwnerForm)
    setScreen('ownerDashboard')
    showMessage('New Site Diary created successfully.')
  }

  const openOwnerSite = () => {
    const code = ownerCodeInput.trim().toUpperCase()
    const site = sites.find((item) => item.ownerCode === code)

    if (!site) {
      showMessage('Owner code not found. Create or open a saved site diary first.')
      return
    }

    setSelectedSiteId(site.id)
    setSelectedReportDate(getToday())
    setScreen('ownerDashboard')
  }

  const joinAsEngineer = () => {
    const code = engineerForm.engineerCode.trim().toUpperCase()
    const site = sites.find((item) => item.engineerCode === code)

    if (!site) {
      showMessage('Engineer code is invalid or the site diary is not available in this browser.')
      return
    }

    if (!engineerForm.engineerName.trim()) {
      showMessage('Engineer name required hai.')
      return
    }

    setSelectedSiteId(site.id)
    setCurrentEngineer({
      name: engineerForm.engineerName,
      mobile: engineerForm.mobile,
    })
    setReportForm({ ...emptyReportForm, date: getToday() })
    setScreen('engineerEntry')
    showMessage(`Engineer connected with ${site.siteName}.`)
  }

  const joinAsLabour = () => {
    const code = labourForm.labourCode.trim().toUpperCase()
    const site = sites.find((item) => item.labourCode === code)

    if (!site) {
      showMessage('Labour code is invalid or the site diary is not available in this browser.')
      return
    }

    if (!labourForm.labourName.trim()) {
      showMessage('Labour name required hai.')
      return
    }

    const labour = {
      id: generateId(),
      siteId: site.id,
      name: labourForm.labourName,
      mobile: labourForm.mobile,
      workType: labourForm.workType,
      workingUnder: labourForm.workingUnder,
      createdAt: new Date().toISOString(),
    }

    const nextSites = sites.map((item) => {
      if (item.id !== site.id) return item

      const alreadyExists = item.labourMembers?.some(
        (member) => member.mobile && member.mobile === labour.mobile
      )

      return {
        ...item,
        labourMembers: alreadyExists
          ? item.labourMembers
          : [...(item.labourMembers || []), labour],
      }
    })

    updateSites(nextSites)
    setSelectedSiteId(site.id)
    setCurrentLabour(labour)
    localStorage.setItem(LABOUR_PROFILE_KEY, JSON.stringify(labour))
    setScreen('labourAttendance')
    showMessage('Labour setup saved. Daily attendance can now be marked.')
  }

  const handlePhotoUpload = async (files) => {
    const selected = Array.from(files || []).slice(0, 3)
    const validFiles = selected.filter((file) => file.size <= 1200000)

    if (validFiles.length !== selected.length) {
      showMessage('Keep each photo under 1.2 MB. Large photos were skipped.')
    }

    const readers = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () =>
            resolve({
              id: generateId(),
              name: file.name,
              url: reader.result,
            })
          reader.readAsDataURL(file)
        })
    )

    const result = await Promise.all(readers)
    setPhotos(result)
  }

  const submitEngineerReport = () => {
    if (!selectedSite || !currentEngineer) return

    if (!reportForm.workDone.trim()) {
      showMessage('Today work done required hai.')
      return
    }

    const materialCost = calculateMaterialCost(reportForm, selectedSite)

    const report = {
      id: generateId(),
      ...reportForm,
      materialCost,
      submittedBy: currentEngineer.name,
      submittedByMobile: currentEngineer.mobile,
      photos,
      createdAt: new Date().toISOString(),
    }

    const nextSites = sites.map((site) =>
      site.id === selectedSite.id
        ? {
            ...site,
            dailyReports: [report, ...(site.dailyReports || [])],
          }
        : site
    )

    updateSites(nextSites)
    setReportForm({ ...emptyReportForm, date: getToday() })
    setPhotos([])
    showMessage('Daily site report saved to Owner Dashboard.')
  }

  const submitAttendance = () => {
    if (!selectedSite || !currentLabour) return

    const today = getToday()

    const attendance = {
      id: generateId(),
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
    }

    const nextSites = sites.map((site) => {
      if (site.id !== selectedSite.id) return site

      const oldReports = site.attendanceReports || []
      const withoutToday = oldReports.filter(
        (item) => !(item.date === today && item.labourId === currentLabour.id)
      )

      return {
        ...site,
        attendanceReports: [attendance, ...withoutToday],
      }
    })

    updateSites(nextSites)
    setAttendanceForm({
      status: 'Present',
      dayType: 'Full Day',
      remarks: '',
    })
    showMessage('Attendance saved successfully.')
  }

  const deleteReport = (reportId) => {
    if (!selectedSite) return

    const nextSites = sites.map((site) =>
      site.id === selectedSite.id
        ? {
            ...site,
            dailyReports: (site.dailyReports || []).filter(
              (report) => report.id !== reportId
            ),
          }
        : site
    )

    updateSites(nextSites)
    showMessage('Report deleted.')
  }

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      showMessage(`${code} copied.`)
    } catch {
      showMessage(code)
    }
  }

  const todaySummary = useMemo(() => {
  if (!selectedSite) return null

  const reportDate = selectedReportDate || getToday()

  const reports = (selectedSite.dailyReports || []).filter(
    (report) => report.date === reportDate
  )

  const attendance = (selectedSite.attendanceReports || []).filter(
    (item) => item.date === reportDate
  )

    const present = attendance.filter((item) => item.status === 'Present')
    const absent = attendance.filter((item) => item.status === 'Absent')

    const materialCost = reports.reduce(
      (sum, report) => sum + num(report.materialCost),
      0
    )

    const equipmentCost = reports.reduce(
      (sum, report) => sum + num(report.equipmentCost),
      0
    )

    const otherCost = reports.reduce(
      (sum, report) => sum + num(report.otherCost),
      0
    )

    const labourCost = attendance.reduce(
      (sum, item) => sum + calculateAttendanceCost(item, selectedSite),
      0
    )

    return {
      reports,
      attendance,
      present,
      absent,
      materialCost,
      equipmentCost,
      otherCost,
      labourCost,
      totalCost: materialCost + equipmentCost + otherCost + labourCost,
    }
  }, [selectedSite, selectedReportDate])

  const totalProjectCost = useMemo(() => {
    if (!selectedSite) return 0

    const reportCost = (selectedSite.dailyReports || []).reduce(
      (sum, report) =>
        sum + num(report.materialCost) + num(report.equipmentCost) + num(report.otherCost),
      0
    )

    const labourCost = (selectedSite.attendanceReports || []).reduce(
      (sum, item) => sum + calculateAttendanceCost(item, selectedSite),
      0
    )

    return reportCost + labourCost
  }, [selectedSite, selectedReportDate])

  const generatePDF = async () => {
    if (!selectedSite || !todaySummary) return

    try {
      const { default: jsPDF } = await import('jspdf')
      await import('jspdf-autotable')

      const doc = new jsPDF()

      doc.setFontSize(18)
      doc.text('Daily Site Report', 14, 18)

      doc.setFontSize(10)
      doc.text(`Site: ${selectedSite.siteName}`, 14, 28)
      doc.text(`Location: ${selectedSite.siteLocation || '-'}`, 14, 34)
      doc.text(`Date: ${selectedReportDate || getToday()}`, 14, 40)
      doc.text(`Owner/Contractor: ${selectedSite.ownerName}`, 14, 46)

      doc.autoTable({
        startY: 56,
        head: [['Summary', 'Value']],
        body: [
          ['Reports Submitted', String(todaySummary.reports.length)],
          ['Labour Present', String(todaySummary.present.length)],
          ['Labour Absent', String(todaySummary.absent.length)],
          ['Material Cost', money(todaySummary.materialCost)],
          ['Labour Cost', money(todaySummary.labourCost)],
          ['Equipment Cost', money(todaySummary.equipmentCost)],
          ['Other Cost', money(todaySummary.otherCost)],
          ['Today Total Cost', money(todaySummary.totalCost)],
          ['Project Total Till Date', money(totalProjectCost)],
        ],
      })

      const workRows = todaySummary.reports.map((report, index) => [
        index + 1,
        report.workCategory,
        report.workLocation || '-',
        report.workDone,
        `${report.quantity || '-'} ${report.unit || ''}`,
        report.submittedBy,
      ])

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['#', 'Category', 'Location', 'Work Done', 'Qty', 'Engineer']],
        body: workRows.length
          ? workRows
          : [['-', '-', '-', 'No work report today', '-', '-']],
      })

      const attendanceRows = todaySummary.attendance.map((item, index) => [
        index + 1,
        item.labourName,
        item.workType,
        item.status,
        item.dayType,
      ])

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['#', 'Name', 'Work Type', 'Status', 'Day Type']],
        body: attendanceRows.length
          ? attendanceRows
          : [['-', '-', '-', 'No attendance today', '-']],
      })

     doc.save(
  `${selectedSite.siteName || 'site'}-daily-report-${selectedReportDate || getToday()}.pdf`
)
    } catch {
      showMessage('PDF package is missing. Browser print opened instead.')
      window.print()
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

<h1 className="text-3xl font-black tracking-tight md:text-4xl">
  Site Diary
</h1>

<p className="mt-2 max-w-2xl text-sm text-slate-400 md:text-base">
  Daily Site Report, Labour Attendance, Material Usage, Photos and Expense Tracking.
</p>

<p className="mt-1 max-w-2xl text-sm text-slate-500">
  दैनिक साइट रिपोर्ट, मजदूर उपस्थिति, सामग्री उपयोग, फोटो और खर्च ट्रैकिंग।
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
<p className="mt-1 text-sm font-semibold text-cyan-300">
  मालिक / ठेकेदार
</p>
<p className="mt-3 text-sm text-slate-400">
  Create a new site diary, share access codes, and monitor daily progress,
  attendance and expenses.
</p>
<p className="mt-2 text-sm text-slate-500">
  नई साइट डायरी बनाएं, एक्सेस कोड शेयर करें और दैनिक प्रगति, उपस्थिति और खर्च देखें।
</p>
            </button>

            <button
              onClick={() => setScreen('engineerJoin')}
              className="min-h-[260px] rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400 hover:bg-slate-900"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
                <HardHat size={32} />
              </div>
              <h2 className="text-2xl font-black">Site Engineer</h2>
<p className="mt-1 text-sm font-semibold text-cyan-300">
  साइट इंजीनियर
</p>
<p className="mt-3 text-sm text-slate-400">
  Submit daily work progress, material usage, machinery details, site issues
  and tomorrow’s work plan.
</p>
<p className="mt-2 text-sm text-slate-500">
  दैनिक कार्य प्रगति, सामग्री उपयोग, मशीनरी, साइट समस्या और अगले दिन की योजना जमा करें।
</p>
            </button>

            <button
              onClick={() => {
                if (currentLabour?.siteId) {
                  setSelectedSiteId(currentLabour.siteId)
                  setScreen('labourAttendance')
                } else {
                  setScreen('labourJoin')
                }
              }}
              className="min-h-[260px] rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400 hover:bg-slate-900"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
                <UsersRound size={32} />
              </div>
            <h2 className="text-2xl font-black">Labour</h2>
<p className="mt-1 text-sm font-semibold text-cyan-300">
  मजदूर
</p>
<p className="mt-3 text-sm text-slate-400">
  Complete one-time setup and then mark daily attendance as Present or Absent.
</p>
<p className="mt-2 text-sm text-slate-500">
  एक बार जानकारी सेव करें, फिर रोज केवल उपस्थित या अनुपस्थित मार्क करें।
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
              <p className="mt-2 text-sm text-slate-400">
                Create a new diary for a new site.
              </p>
            </button>

            <button
              onClick={() => setScreen('ownerOpen')}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-cyan-400"
            >
              <FolderOpen className="mb-4 text-cyan-300" size={34} />
              <h2 className="text-2xl font-black">Open Existing Site Diary</h2>
              <p className="mt-2 text-sm text-slate-400">
                Open an existing diary using the Owner Code.
              </p>
            </button>
          </section>
        ) : null}

        {screen === 'ownerCreate' ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <h2 className="mb-5 text-2xl font-black">Create New Site Diary</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Site Name"
                value={ownerForm.siteName}
                onChange={(v) => updateOwner('siteName', v)}
                placeholder="Example: Sharma House Project"
              />

              <SelectField
                label="Project Type"
                value={ownerForm.projectType}
                onChange={(v) => updateOwner('projectType', v)}
                options={[
                  'Residential',
                  'Commercial',
                  'Industrial',
                  'Infrastructure',
                  'Renovation',
                ]}
              />

              <Field
                label="Site Location"
                value={ownerForm.siteLocation}
                onChange={(v) => updateOwner('siteLocation', v)}
                placeholder="Ahmedabad, Gujarat"
              />

              <Field
                label="Owner / Contractor Name"
                value={ownerForm.ownerName}
                onChange={(v) => updateOwner('ownerName', v)}
                placeholder="Owner name"
              />

              <Field
                label="Client Name"
                value={ownerForm.clientName}
                onChange={(v) => updateOwner('clientName', v)}
                placeholder="Client name"
              />

              <Field
                label="Start Date"
                type="date"
                value={ownerForm.startDate}
                onChange={(v) => updateOwner('startDate', v)}
              />

              <Field
                label="Estimated End Date"
                type="date"
                value={ownerForm.estimatedEndDate}
                onChange={(v) => updateOwner('estimatedEndDate', v)}
              />

              <Field
                label="Estimated Budget"
                type="number"
                value={ownerForm.budget}
                onChange={(v) => updateOwner('budget', v)}
                placeholder="5000000"
              />
            </div>

            <h3 className="mt-8 mb-4 text-xl font-black">Default Rates</h3>

            <div className="grid gap-4 md:grid-cols-4">
              <Field
                label="Cement ₹/bag"
                type="number"
                value={ownerForm.cementRate}
                onChange={(v) => updateOwner('cementRate', v)}
              />

              <Field
                label="Steel ₹/kg"
                type="number"
                value={ownerForm.steelRate}
                onChange={(v) => updateOwner('steelRate', v)}
              />

              <Field
                label="Sand ₹/cft"
                type="number"
                value={ownerForm.sandRate}
                onChange={(v) => updateOwner('sandRate', v)}
              />

              <Field
                label="Aggregate ₹/cft"
                type="number"
                value={ownerForm.aggregateRate}
                onChange={(v) => updateOwner('aggregateRate', v)}
              />

              <Field
                label="Brick ₹/piece"
                type="number"
                value={ownerForm.brickRate}
                onChange={(v) => updateOwner('brickRate', v)}
              />

              <Field
                label="Labour ₹/day"
                type="number"
                value={ownerForm.labourRate}
                onChange={(v) => updateOwner('labourRate', v)}
              />

              <Field
                label="Equipment ₹/day"
                type="number"
                value={ownerForm.equipmentRate}
                onChange={(v) => updateOwner('equipmentRate', v)}
              />
            </div>

            <div className="mt-4">
              <Field
                label="Notes"
                as="textarea"
                value={ownerForm.notes}
                onChange={(v) => updateOwner('notes', v)}
                placeholder="Special instruction, contract note, etc."
              />
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

                <PrimaryButton onClick={generatePDF} icon={Download}>
                  Download PDF
                </PrimaryButton>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ['Owner Code', selectedSite.ownerCode],
                  ['Engineer Code', selectedSite.engineerCode],
                  ['Labour Code', selectedSite.labourCode],
                ].map(([label, code]) => (
                  <div
                    key={code}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                  >
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

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Select Report Date</p>
                    <p className="mt-1 text-sm text-slate-400">
                      View work progress, labour attendance and expense summary by date.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      तारीख के अनुसार कार्य प्रगति, मजदूर उपस्थिति और खर्च देखें।
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                      type="date"
                      value={selectedReportDate}
                      onChange={(e) => setSelectedReportDate(e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />

                    <SecondaryButton onClick={() => setSelectedReportDate(getToday())}>
                      Today
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <StatCard
                title="Reports"
                value={todaySummary?.reports.length || 0}
                sub="Engineer submissions"
                icon={ClipboardList}
              />

              <StatCard
                title="Present Labour"
                value={todaySummary?.present.length || 0}
                sub={`Absent: ${todaySummary?.absent.length || 0}`}
                icon={CheckCircle2}
              />

              <StatCard
                title="Selected Date Expense"
                value={money(todaySummary?.totalCost || 0)}
                sub="Material + labour + equipment"
                icon={IndianRupee}
              />

              <StatCard
                title="Project Total"
                value={money(totalProjectCost)}
                sub="Till date"
                icon={CalendarDays}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <h3 className="mb-4 text-xl font-black">
                  Work Reports - {selectedReportDate}
                </h3>

                <div className="space-y-4">
                  {todaySummary?.reports.length ? (
                    todaySummary.reports.map((report) => (
                      <div
                        key={report.id}
                        className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-cyan-300">
                              {report.workCategory} • {report.workLocation || 'Site'}
                            </p>
                            <p className="mt-2 text-sm text-white">{report.workDone}</p>
                            <p className="mt-2 text-xs text-slate-400">
                              Qty: {report.quantity || '-'} {report.unit} • By {report.submittedBy}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteReport(report.id)}
                            className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs text-slate-300 md:grid-cols-3">
                          <span>Material: {money(report.materialCost)}</span>
                          <span>Equipment: {money(report.equipmentCost)}</span>
                          <span>Other: {money(report.otherCost)}</span>
                        </div>

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
                            {report.photos.map((photo) => (
                              <img
                                key={photo.id}
                                src={photo.url}
                                alt={photo.name}
                                className="h-24 w-full rounded-xl object-cover"
                              />
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
                <h3 className="mb-4 text-xl font-black">
                  Labour Attendance - {selectedReportDate}
                </h3>

                <div className="space-y-3">
                  {todaySummary?.attendance.length ? (
                    todaySummary.attendance.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                      >
                        <div>
                          <p className="font-bold text-white">{item.labourName}</p>
                          <p className="text-xs text-slate-400">
                            {item.workType} • {item.dayType}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === 'Present'
                              ? 'bg-green-400/10 text-green-300'
                              : 'bg-red-400/10 text-red-300'
                          }`}
                        >
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
                    <div
                      key={report.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <p className="text-sm font-bold text-cyan-300">
                        {report.date} • {report.workCategory}
                      </p>
                      <p className="mt-1 text-sm text-white">{report.workDone}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        Engineer: {report.submittedBy} • Material Cost: {money(report.materialCost)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No history yet.</p>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {screen === 'engineerJoin' ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <h2 className="mb-5 text-2xl font-black">Site Engineer Login</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Engineer Name"
                value={engineerForm.engineerName}
                onChange={(v) => updateEngineer('engineerName', v)}
                placeholder="Rahul Patel"
              />

              <Field
                label="Mobile Number"
                value={engineerForm.mobile}
                onChange={(v) => updateEngineer('mobile', v)}
                placeholder="98765xxxxx"
              />

              <Field
                label="Engineer Code"
                value={engineerForm.engineerCode}
                onChange={(v) => updateEngineer('engineerCode', v.toUpperCase())}
                placeholder="ENG-ABCDE"
              />
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={joinAsEngineer} icon={HardHat}>
                Continue
              </PrimaryButton>
            </div>
          </section>
        ) : null}

        {screen === 'engineerEntry' && selectedSite && currentEngineer ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <div className="mb-6">
              <p className="text-sm text-cyan-300">{selectedSite.siteName}</p>
              <h2 className="text-2xl font-black">Daily Work Progress</h2>
              <p className="mt-1 text-sm text-slate-400">
                Submitting as {currentEngineer.name}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Date"
                type="date"
                value={reportForm.date}
                onChange={(v) => updateReport('date', v)}
              />

              <SelectField
                label="Work Category"
                value={reportForm.workCategory}
                onChange={(v) => updateReport('workCategory', v)}
                options={[
                  'RCC',
                  'Brickwork',
                  'Plaster',
                  'Excavation',
                  'Flooring',
                  'Painting',
                  'Electrical',
                  'Plumbing',
                  'Waterproofing',
                  'Other',
                ]}
              />

              <Field
                label="Work Location"
                value={reportForm.workLocation}
                onChange={(v) => updateReport('workLocation', v)}
                placeholder="Ground floor / Slab / Column"
              />
            </div>

            <div className="mt-4">
              <Field
                label="Today Work Done"
                as="textarea"
                value={reportForm.workDone}
                onChange={(v) => updateReport('workDone', v)}
                placeholder="What work was completed on site today?"
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Field
                label="Quantity Done"
                type="number"
                value={reportForm.quantity}
                onChange={(v) => updateReport('quantity', v)}
                placeholder="25"
              />

              <SelectField
                label="Unit"
                value={reportForm.unit}
                onChange={(v) => updateReport('unit', v)}
                options={['m³', 'm²', 'm', 'Nos', 'kg', 'cft']}
              />
            </div>

            <h3 className="mt-8 mb-4 text-xl font-black">Material Used</h3>

            <div className="grid gap-4 md:grid-cols-5">
              <Field
                label="Cement Bags"
                type="number"
                value={reportForm.cementBags}
                onChange={(v) => updateReport('cementBags', v)}
              />

              <Field
                label="Sand cft"
                type="number"
                value={reportForm.sandCft}
                onChange={(v) => updateReport('sandCft', v)}
              />

              <Field
                label="Aggregate cft"
                type="number"
                value={reportForm.aggregateCft}
                onChange={(v) => updateReport('aggregateCft', v)}
              />

              <Field
                label="Steel kg"
                type="number"
                value={reportForm.steelKg}
                onChange={(v) => updateReport('steelKg', v)}
              />

              <Field
                label="Bricks Nos"
                type="number"
                value={reportForm.bricksNos}
                onChange={(v) => updateReport('bricksNos', v)}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              Auto Material Cost:{' '}
              <b>{money(calculateMaterialCost(reportForm, selectedSite))}</b>
            </div>

            <h3 className="mt-8 mb-4 text-xl font-black">Machinery, Issues & Photos</h3>

            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Equipment Used"
                value={reportForm.equipmentUsed}
                onChange={(v) => updateReport('equipmentUsed', v)}
                placeholder="Mixer, Vibrator, JCB"
              />

              <Field
                label="Equipment Cost"
                type="number"
                value={reportForm.equipmentCost}
                onChange={(v) => updateReport('equipmentCost', v)}
                placeholder="2500"
              />

              <Field
                label="Other Cost"
                type="number"
                value={reportForm.otherCost}
                onChange={(v) => updateReport('otherCost', v)}
                placeholder="500"
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Site Issues / Delay Reason"
                as="textarea"
                value={reportForm.issues}
                onChange={(v) => updateReport('issues', v)}
                placeholder="Material shortage, weather issue, drawing issue etc."
              />

              <Field
                label="Tomorrow Plan"
                as="textarea"
                value={reportForm.tomorrowPlan}
                onChange={(v) => updateReport('tomorrowPlan', v)}
                placeholder="What work is planned for tomorrow?"
              />
            </div>

            <div className="mt-4">
              <Field
                label="Engineer Remarks"
                as="textarea"
                value={reportForm.remarks}
                onChange={(v) => updateReport('remarks', v)}
                placeholder="Any additional notes"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <label className="block text-sm font-medium text-slate-300">
                Upload Site Photos - max 3, each under 1.2 MB
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"
              />

              {photos.length ? (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.name}
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={submitEngineerReport} icon={Save}>
                Submit Daily Report
              </PrimaryButton>
            </div>
          </section>
        ) : null}

        {screen === 'labourJoin' ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <h2 className="mb-2 text-2xl font-black">Labour First Time Setup</h2>

            <p className="mb-5 text-sm text-slate-400">
              Save details once, then mark only Present / Absent every day.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Labour Code"
                value={labourForm.labourCode}
                onChange={(v) => updateLabour('labourCode', v.toUpperCase())}
                placeholder="LAB-ABCDE"
              />

              <Field
                label="Name"
                value={labourForm.labourName}
                onChange={(v) => updateLabour('labourName', v)}
                placeholder="Ramesh"
              />

              <Field
                label="Mobile Number"
                value={labourForm.mobile}
                onChange={(v) => updateLabour('mobile', v)}
                placeholder="98765xxxxx"
              />

              <SelectField
                label="Work Type"
                value={labourForm.workType}
                onChange={(v) => updateLabour('workType', v)}
                options={[
                  'Mason / Mistri',
                  'Helper / Labour',
                  'Carpenter',
                  'Bar Bender',
                  'Electrician',
                  'Plumber',
                  'Painter',
                  'Tile Fitter',
                  'Machine Operator',
                  'Other',
                ]}
              />

              <Field
                label="Working Under"
                value={labourForm.workingUnder}
                onChange={(v) => updateLabour('workingUnder', v)}
                placeholder="Contractor / Engineer name"
              />
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={joinAsLabour} icon={Save}>
                Save Labour Details
              </PrimaryButton>
            </div>
          </section>
        ) : null}

        {screen === 'labourAttendance' && selectedSite && currentLabour ? (
          <section className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-7">
            <div className="text-center">
              <p className="text-sm font-semibold text-cyan-300">
                {selectedSite.siteName}
              </p>
              <h2 className="mt-1 text-3xl font-black">Daily Attendance</h2>
              <p className="mt-2 text-sm text-slate-400">
                Date: {getToday()} • {currentLabour.name} • {currentLabour.workType}
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <button
                onClick={() =>
                  setAttendanceForm((prev) => ({ ...prev, status: 'Present' }))
                }
                className={`rounded-3xl border p-8 text-center transition ${
                  attendanceForm.status === 'Present'
                    ? 'border-green-400 bg-green-400/15 text-green-200'
                    : 'border-slate-700 bg-slate-950/60 text-slate-300'
                }`}
              >
                <CheckCircle2 className="mx-auto mb-3" size={44} />
                <span className="text-2xl font-black">PRESENT</span>
              </button>

              <button
                onClick={() =>
                  setAttendanceForm((prev) => ({ ...prev, status: 'Absent' }))
                }
                className={`rounded-3xl border p-8 text-center transition ${
                  attendanceForm.status === 'Absent'
                    ? 'border-red-400 bg-red-400/15 text-red-200'
                    : 'border-slate-700 bg-slate-950/60 text-slate-300'
                }`}
              >
                <XCircle className="mx-auto mb-3" size={44} />
                <span className="text-2xl font-black">ABSENT</span>
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SelectField
                label="Day Type"
                value={attendanceForm.dayType}
                onChange={(v) =>
                  setAttendanceForm((prev) => ({ ...prev, dayType: v }))
                }
                options={['Full Day', 'Half Day']}
              />

              <Field
                label="Remarks Optional"
                value={attendanceForm.remarks}
                onChange={(v) =>
                  setAttendanceForm((prev) => ({ ...prev, remarks: v }))
                }
                placeholder="Example: Worked on plaster today"
              />
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={submitAttendance} icon={Save} className="md:w-full">
                Submit Attendance
              </PrimaryButton>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
