import Link from 'next/link'

export default function MaterialsPage() {
  return (
    <main className="min-h-screen bg-[#020B2D] p-10 text-white">
      <Link href="/dashboard/knowledge-hub" className="text-orange-400">
        ← Back to Knowledge Hub
      </Link>

      <h1 className="mt-8 text-4xl font-bold">
        Material Guide
      </h1>

      <p className="mt-4 text-slate-300">
        This page is working.
      </p>
    </main>
  )
}
