'use client'

import { useState } from 'react'
import { ChevronDown, Globe2, Ruler, Settings, ShieldCheck } from 'lucide-react'
import { useGlobalSettings } from './GlobalSettingsProvider'

export default function GlobalSettingsPanel() {
  const { settings, updateSettings } = useGlobalSettings()
  const [open, setOpen] = useState(false)

  const regionLabel =
    settings.region === 'india'
      ? 'India'
      : settings.region === 'usa'
        ? 'USA'
        : 'Global'

  const unitLabel =
    settings.unitSystem === 'si'
      ? 'SI Units'
      : 'Imperial Units'

  const standardLabel =
    settings.designStandard === 'is'
      ? 'IS Codes'
      : 'ACI / ASCE'

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition"
      >
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Settings className="h-5 w-5 text-orange-400" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              Global Settings
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {regionLabel} • {unitLabel} • {standardLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-orange-400 font-medium">
            {open ? 'Hide Settings' : 'Change Settings'}
          </span>

          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800 p-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-slate-400 mb-2 text-sm">
                <Globe2 className="h-4 w-4 text-orange-400" />
                Region
              </label>

              <select
                value={settings.region}
                onChange={(e) =>
                  updateSettings({
                    region: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-orange-500"
              >
                <option value="india">India</option>
                <option value="usa">USA</option>
                <option value="global">Global</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-400 mb-2 text-sm">
                <Ruler className="h-4 w-4 text-orange-400" />
                Unit System
              </label>

              <select
                value={settings.unitSystem}
                onChange={(e) =>
                  updateSettings({
                    unitSystem: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-orange-500"
              >
                <option value="si">SI Units</option>
                <option value="imperial">Imperial Units</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-400 mb-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-orange-400" />
                Design Standard
              </label>

              <select
                value={settings.designStandard}
                onChange={(e) =>
                  updateSettings({
                    designStandard: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-orange-500"
              >
                <option value="is">IS Codes</option>
                <option value="aci">ACI / ASCE</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
              <p className="text-xs text-slate-500 mb-1">
                Active Region
              </p>
              <p className="text-white font-semibold">
                {regionLabel}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
              <p className="text-xs text-slate-500 mb-1">
                Active Units
              </p>
              <p className="text-white font-semibold">
                {unitLabel}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
              <p className="text-xs text-slate-500 mb-1">
                Active Standard
              </p>
              <p className="text-white font-semibold">
                {standardLabel}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
