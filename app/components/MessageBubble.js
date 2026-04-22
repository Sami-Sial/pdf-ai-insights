'use client'

import ReactMarkdown from 'react-markdown'
import { Sparkles, User } from 'lucide-react'

export default function MessageBubble({ message, streaming }) {
  const isUser = message.role === 'user'

  return (
    <div
      className="animate-fade-up"
      style={{
        display: 'flex',
        gap: 8,
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        // full width — no maxWidth constraint here, parent controls padding
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 2,
        display: 'grid', placeItems: 'center',
        background: isUser
          ? 'rgba(255,255,255,0.07)'
          : 'linear-gradient(135deg,#708cff,#a78bfa)',
        boxShadow: isUser ? 'none' : '0 2px 10px rgba(112,140,255,0.25)',
      }}>
        {isUser
          ? <User size={12} color="var(--text-2)" />
          : <Sparkles size={12} color="#fff" strokeWidth={2.4} />
        }
      </div>

      {/* Bubble — grows to fill available space for assistant, auto for user */}
      <div style={{
        flex: isUser ? '0 1 auto' : '1',
        maxWidth: isUser ? '80%' : '100%',
        textAlign: isUser ? 'right' : 'left',
        minWidth: 0,
      }}>
        <div style={{
          display: isUser ? 'inline-block' : 'block',
          textAlign: 'left',
          borderRadius: isUser ? '14px 3px 14px 14px' : '3px 14px 14px 14px',
          padding: '9px 13px',
          background: isUser
            ? 'linear-gradient(135deg,#708cff,#a78bfa)'
            : 'rgba(255,255,255,0.05)',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isUser
            ? '0 3px 12px rgba(112,140,255,0.22)'
            : 'none',
        }}>
          {isUser ? (
            <p style={{ color: '#fff', lineHeight: 1.4, fontSize: 12, whiteSpace: 'pre-wrap', margin: 0 }}>
              {message.content}
            </p>
          ) : message.content ? (
            <div className="prose-chat" style={{ fontSize: 12, lineHeight: 1.4 }}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {streaming && <span className="cursor" />}
            </div>
          ) : (
            <div className="dot-pulse">
              <span /><span /><span />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}