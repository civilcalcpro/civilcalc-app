'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  MessageSquare,
  User as UserIcon,
  Wand2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

const SUGGESTED_PROMPTS = [
  { icon: '🏗️', text: 'Explain IS 456 clause 26.5.1 for minimum tension steel in beams.' },
  { icon: '📐', text: 'How do I size an RCC column for a 5-storey building, 4x4m grid?' },
  { icon: '🧱', text: 'Estimate concrete and steel for a 200 sqm slab, 150mm thick.' },
  { icon: '🔍', text: 'What causes hairline cracks on a freshly cured slab and how do I fix them?' },
]

export default function AIAssistantPage() {
  const { authFetch } = useAuth()
  const [sessions, setSessions] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState('')
  const scrollRef = useRef(null)

  const fetchSessions = async () => {
    try {
      const res = await authFetch('/api/ai/sessions')
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
      }
    } catch (e) {}
  }

  useEffect(() => {
    fetchSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  const loadSession = async (id) => {
    try {
      const res = await authFetch(`/api/ai/sessions/${id}`)
      if (res.ok) {
        const data = await res.json()
        setActiveId(id)
        setMessages(data.session?.messages || [])
      }
    } catch (e) {}
  }

  const newChat = () => {
    setActiveId(null)
    setMessages([])
  }

  const deleteSession = async (id) => {
    try {
      const res = await authFetch(`/api/ai/sessions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSessions((s) => s.filter((x) => x.sessionId !== id))
        if (activeId === id) newChat()
      }
    } catch (e) {}
  }

  // Typewriter effect for assistant reply
  const typeOut = (full) => {
    return new Promise((resolve) => {
      let i = 0
      setTyping('')
      const step = () => {
        i = Math.min(full.length, i + Math.max(2, Math.floor(full.length / 80)))
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

    const userMsg = { role: 'user', content: text, createdAt: new Date().toISOString() }
    setMessages((m) => [...m, userMsg])

    try {
      const res = await authFetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ sessionId: activeId, message: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Chat failed')

      if (!activeId) {
        setActiveId(data.sessionId)
        fetchSessions()
      }
      // Type-out the reply
      await typeOut(data.reply)
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.reply, createdAt: new Date().toISOString(), source: data.source },
      ])
      setTyping('')
      // Refresh sessions list (for title updates)
      fetchSessions()
    } catch (e) {
      toast.error(e.message)
      setMessages((m) => m.slice(0, -1))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-0px)] lg:h-screen overflow-hidden">
      {/* Sessions sidebar (chat history) */}
      <aside className="hidden md:flex w-72 flex-shrink-0 flex-col bg-slate-950/60 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <Button onClick={newChat} variant="outline" className="w-full border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white">
            <Plus className="h-4 w-4 mr-2" /> New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.length === 0 && (
              <div className="text-xs text-slate-500 p-4 text-center">No conversations yet</div>
            )}
            {sessions.map((s) => (
              <button
                key={s.sessionId}
                onClick={() => loadSession(s.sessionId)}
                className={`group w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-start ${
                  activeId === s.sessionId
                    ? 'bg-orange-500/10 text-orange-200 border border-orange-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="flex-1 truncate">{s.title || 'New conversation'}</span>
                <Trash2
                  className="h-3.5 w-3.5 ml-2 mt-0.5 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(s.sessionId)
                  }}
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 backdrop-blur">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mr-3">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-base font-semibold text-white flex items-center">
                AI Engineering Assistant
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300">
                  CLAUDE
                </span>
              </div>
              <div className="text-xs text-slate-500">RCC · IS Codes · Estimation · Site Help</div>
            </div>
          </div>
          <Button onClick={newChat} size="sm" variant="ghost" className="text-slate-400 hover:text-white md:hidden">
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {messages.length === 0 && !typing && (
            <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center text-center py-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-4"
              >
                <Wand2 className="h-7 w-7 text-orange-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                How can I help with your project?
              </h2>
              <p className="text-sm text-slate-400 mb-8 max-w-md">
                Ask me about RCC design, IS codes, calculations, site troubleshooting, or quantity estimation.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => send(p.text)}
                    className="text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-orange-500/40 hover:bg-slate-900 transition group"
                  >
                    <div className="text-lg mb-1">{p.icon}</div>
                    <div className="text-sm text-slate-300 group-hover:text-white">{p.text}</div>
                  </motion.button>
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
            {typing && <Bubble m={{ role: 'assistant', content: typing }} live />}
            {sending && !typing && (
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center mr-3 flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="flex space-x-1.5">
                    <Dot delay={0} /> <Dot delay={0.15} /> <Dot delay={0.3} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-950/40 backdrop-blur">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 focus-within:border-orange-500/50 transition">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Ask about RCC design, IS codes, estimation… (Enter to send, Shift+Enter for newline)"
                rows={2}
                className="bg-transparent border-0 resize-none focus-visible:ring-0 text-white placeholder:text-slate-500 pr-14"
              />
              <Button
                onClick={() => send()}
                disabled={sending || !input.trim()}
                size="icon"
                className="absolute right-2 bottom-2 h-9 w-9 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-[10px] text-slate-600 text-center mt-2 flex items-center justify-center">
              <Sparkles className="h-3 w-3 mr-1 text-orange-500/70" />
              AI responses are guidance only. Always verify designs per IS codes and project conditions.
            </div>
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
      className={`flex items-start ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center mr-3 flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm'
            : 'bg-slate-900/70 border border-slate-800 text-slate-200 rounded-tl-sm'
        }`}
      >
        {m.content}
        {live && <span className="inline-block w-1.5 h-4 bg-orange-400 ml-0.5 animate-pulse align-middle" />}
        {!live && m.source === 'mock' && (
          <div className="text-[10px] text-yellow-400/70 mt-2 pt-2 border-t border-slate-700/50">
            Demo response — LLM gateway unreachable
          </div>
        )}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center ml-3 flex-shrink-0">
          <UserIcon className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  )
}

function Dot({ delay }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 0.8, delay }}
      className="h-2 w-2 rounded-full bg-orange-400"
    />
  )
}
