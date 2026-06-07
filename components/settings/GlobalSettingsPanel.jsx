'use client'

import { useGlobalSettings } from './GlobalSettingsProvider'

export default function GlobalSettingsPanel() {
  const { settings, updateSettings } = useGlobalSettings()

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Global Settings
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-slate-400 mb-2">
            Region
          </label>

          <select
            value={settings.region}
            onChange={(e) =>
              updateSettings({
                region: e.target.value,
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          >
            <option value="india">India</option>
            <option value="usa">USA</option>
            <option value="global">Global</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-2">
            Unit System
          </label>

          <select
            value={settings.unitSystem}
            onChange={(e) =>
              updateSettings({
                unitSystem: e.target.value,
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          >
            <option value="si">SI Units</option>
            <option value="imperial">Imperial Units</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-2">
            Design Standard
          </label>

          <select
            value={settings.designStandard}
            onChange={(e) =>
              updateSettings({
                designStandard: e.target.value,
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          >
            <option value="is">IS Codes</option>
            <option value="aci">ACI / ASCE</option>
          </select>
        </div>
      </div>
    </div>
  )
}
