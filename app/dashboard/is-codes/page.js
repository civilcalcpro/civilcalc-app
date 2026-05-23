'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Tag, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IS_CODES, IS_FAMILIES } from '@/lib/is-codes-data'

export default function ISCodeLibraryPage() {
  const [query, setQuery] = useState('')
  const [family, setFamily] = useState('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return IS_CODES.filter((c) => {
      if (family !== 'All' && c.family !== family) return false
      if (!q) return true
      const hay = `${c.code} ${c.section} ${c.title} ${c.summary} ${c.tags.join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, family])

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
          <BookOpen className="h-3 w-3 mr-1.5" /> Reference Library
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white">IS Code Library</h1>
        <p className="text-slate-400 mt-1">Searchable summaries of IS 456, IS 875, IS 1893 & IS 13920 clauses.</p>
      </div>

      {/* Search + filters */}
      <Card className="bg-slate-900/50 border-slate-800 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clauses, topics or keywords (e.g., shear, M25, seismic zone)…"
              className="pl-10 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500 h-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {IS_FAMILIES.map((f) => (
              <Button
                key={f}
                size="sm"
                onClick={() => setFamily(f)}
                className={
                  family === f
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Showing <span className="text-white">{filtered.length}</span> of {IS_CODES.length} entries
        </div>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={`${c.code}-${c.section}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.3) }}
          >
            <Card className="bg-slate-900/50 border-slate-800 p-5 h-full hover:border-orange-500/40 transition">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400">{c.code}</div>
                  <div className="text-xs text-slate-500">{c.section}</div>
                </div>
                <Tag className="h-3.5 w-3.5 text-slate-600" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 leading-tight">{c.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{c.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    #{t}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-16 text-slate-500">
            No clauses match your search. Try a different keyword.
          </div>
        )}
      </div>

      <Card className="bg-slate-900/30 border-slate-800 p-5 mt-8 text-xs text-slate-500">
        <div className="flex items-start">
          <ExternalLink className="h-4 w-4 mr-2 mt-0.5 text-slate-600 flex-shrink-0" />
          <p>
            These short reference summaries are intended as a quick lookup for practising engineers. Always verify the
            full clause in the official IS publication (Bureau of Indian Standards) before applying it to design work.
          </p>
        </div>
      </Card>
    </div>
  )
}
