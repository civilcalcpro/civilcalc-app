import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  MessageSquareText,
  GraduationCap,
} from 'lucide-react'
import { interviewTopics } from './interviewData'

export const metadata = {
  title: 'Civil Engineering Interview Preparation | CivilCalc Pro Knowledge Hub',
  description:
    'Civil engineering interview preparation for freshers, site engineers, QA/QC engineers, estimation, BOQ, RCC, concrete technology and safety roles.',
}

export default function InterviewPreparationPage() {
  return (
    <main className="min-h-screen bg-[#020B2D] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#243250] bg-[#071432] p-6 sm:p-8">
          <Link
            href="/dashboard/knowledge-hub"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} />
            Back to Knowledge Hub
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                <Briefcase size={16} />
                Civil Engineering Career Guide
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Interview Preparation
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
                Prepare for civil engineering interviews with role-wise
                questions and practical answers. Covers fresher civil engineer,
                site engineer, QA/QC, estimation, BOQ, RCC structure, concrete
                technology and construction safety interviews.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-300">Interview Topics</p>
              <p className="mt-1 text-3xl font-bold text-orange-400">
                {interviewTopics.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <GraduationCap className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Fresher Friendly</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Basic civil questions with simple answers.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <ClipboardCheck className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Site Practical</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Site execution, quality and checklist questions.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <BookOpen className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">Technical Answers</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              RCC, concrete, estimation and BOQ concepts.
            </p>
          </div>

          <div className="rounded-2xl border border-[#243250] bg-[#071432] p-5">
            <MessageSquareText className="mb-3 text-orange-400" size={24} />
            <h2 className="font-bold text-white">HR Questions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Tell me about yourself, site pressure and teamwork.
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {interviewTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/dashboard/knowledge-hub/interview-preparation/${topic.slug}`}
              className="group rounded-3xl border border-[#243250] bg-[#071432] p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <Briefcase size={20} />
                </div>

                <div className="rounded-full border border-slate-600 bg-[#081126] px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {topic.level}
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                {topic.title}
              </h2>

              <p className="mt-3 min-h-[68px] text-sm leading-6 text-slate-400">
                {topic.shortDesc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {topic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-[#081126] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Includes
                </p>

                <ul className="space-y-2">
                  {topic.skills.slice(0, 4).map((skill) => (
                    <li key={skill} className="flex gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-orange-400" size={15} />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between text-sm font-semibold text-orange-400">
                  <span>Open Interview Guide</span>
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">
            Interview answer ka best format
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
            Interview me answer short, clear aur practical do. Pehle definition,
            phir site use, phir example. Agar answer nahi pata ho to guess
            karne ke bajay politely bolo ki you will verify from drawing,
            specification or senior engineer.
          </p>
        </section>
      </div>
    </main>
  )
}
