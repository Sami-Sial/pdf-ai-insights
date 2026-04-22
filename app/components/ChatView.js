'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, FileText, Plus, Sparkles, Menu, AlertCircle } from 'lucide-react'
import MessageBubble from './MessageBubble'
import { uid } from '../lib/storage'
import { streamChat } from '../lib/chatApi'

const SUGGESTIONS = [
  'Summarize in 5 bullet points',
  'What are the key takeaways?',
  'Explain the main concepts',
  'List action items',
]

export default function ChatView({ conversation, onUpdate, onNew, onMenuOpen }) {
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingId, setStreamingId] = useState(null)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [conversation.messages, streaming])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }, [input])

  const send = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || streaming) return
    setError(null)

    const userMsg = { id: uid(), role: 'user', content: trimmed, createdAt: Date.now() }
    const assistantId = uid()
    const assistantMsg = { id: assistantId, role: 'assistant', content: '', createdAt: Date.now() }

    let working = {
      ...conversation,
      messages: [...conversation.messages, userMsg, assistantMsg],
      updatedAt: Date.now(),
    }
    onUpdate(working)
    setInput('')
    setStreaming(true)
    setStreamingId(assistantId)

    let acc = ''
    try {
      await streamChat({
        messages: [...conversation.messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        pdfText: conversation.pdfText,
        pdfName: conversation.pdfName,
        onDelta: (chunk) => {
          acc += chunk
          working = {
            ...working,
            messages: working.messages.map((m) =>
              m.id === assistantId ? { ...m, content: acc } : m
            ),
            updatedAt: Date.now(),
          }
          onUpdate(working)
        },
        onDone: () => { },
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg)
      working = {
        ...working,
        messages: working.messages.map((m) =>
          m.id === assistantId ? { ...m, content: acc || `_Error: ${msg}_` } : m
        ),
      }
      onUpdate(working)
    } finally {
      setStreaming(false)
      setStreamingId(null)
    }
  }

  const empty = conversation.messages.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px', height: 52,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(16px)',
        flexShrink: 0, minWidth: 0,
      }}>
        {/* Mobile hamburger */}
        <button onClick={onMenuOpen} className="cv-menu-btn" aria-label="Menu" style={{
          width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', cursor: 'pointer', flexShrink: 0,
          display: 'none', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
        }}>
          <Menu size={15} />
        </button>

        {/* Icon */}
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg,#708cff,#a78bfa)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 2px 10px rgba(112,140,255,0.3)',
        }}>
          <FileText size={14} color="#fff" />
        </div>

        {/* Title — takes remaining space */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontFamily: 'Syne, sans-serif',
          }}>
            {conversation.title}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>
            {conversation.pageCount ? `${conversation.pageCount} pages` : conversation.pdfName}
          </div>
        </div>

        {/* New button — icon only on mobile */}
        <button onClick={onNew} className="cv-new-btn" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)',
          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          fontSize: 12, fontWeight: 500, flexShrink: 0, transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-2)' }}
        >
          <Plus size={13} />
          <span className="cv-new-label">New</span>
        </button>
      </header>

      {/* ── Messages ── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <div style={{ width: '100%', maxWidth: '100%', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {empty ? (
            <div className="animate-fade-up" style={{ textAlign: 'center', padding: '24px 8px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(112,140,255,0.1)', border: '1px solid rgba(112,140,255,0.2)',
                borderRadius: 99, padding: '4px 12px', fontSize: 11, color: 'var(--accent)',
                marginBottom: 14, fontWeight: 500,
              }}>
                <Sparkles size={11} />
                Ready to chat
              </div>

              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px,4vw,24px)',
                fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6,
              }}>
                Ask anything about{' '}
                <span className="grad-text">{conversation.title}</span>
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 18 }}>
                Try one of these to get started
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, maxWidth: 480, margin: '0 auto' }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="glass" style={{
                    borderRadius: 10, padding: '10px 12px', textAlign: 'left',
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(112,140,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(112,140,255,0.25)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = '' }}
                  >
                    <Sparkles size={11} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            conversation.messages.map((m) => (
              <MessageBubble key={m.id} message={m} streaming={streaming && m.id === streamingId} />
            ))
          )}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          margin: '0 12px 6px', padding: '8px 12px', borderRadius: 10,
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
          fontSize: 12, color: '#f87171', display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <AlertCircle size={13} />{error}
        </div>
      )}

      {/* ── Input ── */}
      <div style={{ padding: '6px 12px 12px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '8px 8px 8px 14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = 'rgba(112,140,255,0.4)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25), 0 0 0 3px rgba(112,140,255,0.07)'
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
            }}
            placeholder="Ask anything about this PDF…"
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              lineHeight: 1.5, resize: 'none', padding: '3px 0', maxHeight: 140, overflowY: 'auto',
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="grad-bg"
            style={{
              width: 32, height: 32, borderRadius: 9, border: 'none', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !streaming ? 'pointer' : 'not-allowed',
              opacity: input.trim() && !streaming ? 1 : 0.3,
              transition: 'all 0.15s', boxShadow: '0 2px 10px rgba(112,140,255,0.3)',
            }}
            aria-label="Send"
          >
            <ArrowUp size={15} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'center', marginTop: 5 }}>
          Shift+Enter for new line · Answers grounded in your PDF
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .cv-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}