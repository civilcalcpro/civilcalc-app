'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BOQGeneratorPage() {
  const [projectSaved, setProjectSaved] = useState(false)

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

        <Button>
          + Add BOQ Item
        </Button>

      </div>

    </Card>

  </div>
)
