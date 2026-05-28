'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  User as UserIcon,
  Wand2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const SUGGESTED_PROMPTS = [
  {
    icon: '🏗️',
    text: 'Explain IS 456 clause 26.5.1 for minimum tension steel in beams.',
  },
  {
    icon: '📐',
    text: 'How do I size an RCC column for a 5-storey building?',
  },
  {
    icon: '🧱',
    text: 'Estimate concrete and steel for 200 sqm slab.',
  },
  {
    icon: '🔍',
    text: 'Why do cracks appear in concrete slabs?',
  },
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState('')

  const scrollRef = useRef(null)

  const typeOut = (full) => {
    return new Promise((resolve) => {
      let i = 0

      setTyping('')

      const step = () => {
        i = Math.min(
          full.length,
          i + Math.max(2, Math.floor(full.length / 80))
        )

        setTyping(full.slice(0, i))

        if (i < full.length) {
          setTimeout(step, 15)
        } else {
          resolve()
        }
      }

      step()
    })
  }

  const send = async (override) => {
    const text = (override ?? input).trim()

    if (!text || sending) return

    setInput('')
    setSending(true)

    const userMsg = {
      role: 'user',
      content: text,
    }

    setMessages((m) => [...m, userMsg])

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          prompt: text,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'AI failed')
      }

      await typeOut(data.reply)

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.reply,
        },
      ])

      setTyping('')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center mr-3">
          <Bot className="h-5 w-5 text-white" />
        </div>

        <div>
          <div className="text-lg font-semibold">
            AI Engineering Assistant
          </div>

          <div className="text-xs text-slate-500">
            Gemini Powered Civil Engineering AI
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
      >
        {messages.length === 0 && !typing && (
          <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center text-center py-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-4"
            >
              <Wand2 className="h-7 w-7 text-orange-400" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">
              Ask Civil Engineering Questions
            </h2>

            <p className="text-sm text-slate-400 mb-8">
              RCC Design • IS Codes • Estimation • Structural Analysis
            </p>

            <div className="grid sm:grid-cols-2 gap-3 w-full">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => send(p.text)}
                  className="text-left p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition"
                >
                  <div className="text-lg mb-1">
                    {p.icon}
                  </div>

                  <div className="text-sm text-slate-300">
                    {p.text}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <Bubble key={idx} m={m} />
            ))}
          </AnimatePresence>

          {typing && (
            <Bubble
              m={{
                role: 'assistant',
                content: typing,
              }}
              live
            />
          )}

          {sending && !typing && (
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center mr-3">
                <Bot className="h-4 w-4 text-white" />
              </div>

              <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800">
                <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-slate-900 border border-slate-800">
            <Textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey
                ) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Ask about RCC design, IS codes, estimation..."
              rows={2}
              className="bg-transparent border-0 resize-none focus-visible:ring-0 text-white pr-14"
            />

            <Button
              onClick={() => send()}
              disabled={sending || !input.trim()}
              size="icon"
              className="absolute right-2 bottom-2 h-9 w-9 bg-gradient-to-br from-orange-500 to-orange-600"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="text-[10px] text-slate-600 text-center mt-2 flex items-center justify-center">
            <Sparkles className="h-3 w-3 mr-1 text-orange-500/70" />
            Verify engineering calculations before execution.
          </div>
        </div>
      </div>
    </div>
  )
}

function Bubble({ m, live }) {
  const isUser = m.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start ${
        isUser ? 'justify-end' : ''
      }`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center mr-3">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
            : 'bg-slate-900 border border-slate-800 text-slate-200'
        }`}
      >
        {m.content}

        {live && (
          <span className="inline-block w-1.5 h-4 bg-orange-400 ml-0.5 animate-pulse align-middle" />
        )}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center ml-3">
          <UserIcon className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  )
}
