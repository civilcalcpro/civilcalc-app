import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  MessageSquareText,
  BookOpen,
  Lightbulb,
  ClipboardCheck,
} from 'lucide-react'
import { interviewTopics } from '../interviewData'

export async function generateStaticParams() {
  return interviewTopics.map((topic) => ({
    slug: topic.slug,
  }))
}

export async function generateMetadata({ params }) {
  const topic = interviewTopics.find((item) => item.slug === params.slug)

  if (!topic) {
    return {
      title: 'Civil Engineering Interview Preparation | CivilCalc Pro',
    }
  }

  return {
    title: `${topic.title} | CivilCalc Pro Knowledge Hub`,
    description: topic.shortDesc,
  }
}

export default function InterviewTopicDetailPage({ params }) {
  const topic = interviewTopics.find((item) => item.slug === params.slug)

  if (!topic) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub/interview-preparation"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Interview Preparation
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <Briefcase size={16} />
                Interview Topic
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {topic.title}
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                {topic.purpose}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm text-slate-300">Level</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                {topic.level}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6">
          <div className="mb-5 flex items-center gap-3">
            <ClipboardCheck className="text-orange-400" size={24} />
            <h2 className="text-2xl font-bold">Skills to Prepare</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topic.skills.map((skill) => (
              <div
                key={skill}
                className="rounded-xl border border-slate-800 bg-[#081126] p-4 text-slate-200"
              >
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-orange-400" size={18} />
                  <span>{skill}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          {topic.questions.map((item, index) => (
            <article
              key={item.q}
              className="rounded-3xl border border-[#243250] bg-[#071432] p-6"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-sm font-bold text-orange-300">
                  {index + 1}
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-300">
                    Interview Question
                  </p>
                  <h2 className="text-xl font-bold leading-8 text-white">
                    {item.q}
                  </h2>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-[#081126] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="text-orange-400" size={18} />
                  <h3 className="font-semibold text-white">Best Answer</h3>
                </div>

                <p className="text-sm leading-7 text-slate-300 sm:text-base">
                  {item.a}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.keyPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="mb-5 flex items-center gap-3">
            <MessageSquareText className="text-yellow-300" size={24} />
            <h2 className="text-2xl font-bold">HR Questions to Prepare</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {topic.hrQuestions.map((question) => (
              <div
                key={question}
                className="rounded-xl border border-yellow-500/20 bg-[#081126] p-4 text-yellow-100"
              >
                {question}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <div className="flex gap-3">
            <Lightbulb className="mt-1 shrink-0 text-orange-300" size={22} />
            <div>
              <h2 className="text-xl font-bold text-white">
                Interview Tip
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Answer ko practical banao. Example: sirf definition mat bolo,
                site par wo concept kaha use hota hai wo bhi batao. Isse
                interviewer ko lagega ki tumhe field understanding hai.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
