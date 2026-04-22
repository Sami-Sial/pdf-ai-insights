'use client'

import { FileText, MessageSquare, Plus, Sparkles, Trash2, X } from 'lucide-react'

function timeAgo(t) {
  const diff = Date.now() - t
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, mobileOpen, onMobileClose }) {
  return (
    <>
      <style>{`
        .sidebar { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1); }
        .conv-btn:hover .delete-btn { opacity: 1 !important; }
        @media (max-width: 767px) {
          .sidebar {
            position: fixed !important;
            left: 0 !important; top: 0 !important;
            z-index: 50 !important;
            height: 100dvh !important;
          }
          .sidebar.closed { transform: translateX(-100%); }
          .mobile-close-btn { display: flex !important; }
        }
        @media (min-width: 768px) {
          .sidebar { transform: none !important; }
        }
      `}</style>

      <aside
        className={`sidebar${mobileOpen ? '' : ' closed'}`}
        style={{
          width: 268,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          padding: '16px 12px',
          gap: 8,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(8,11,20,0.92)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -3,
                background: 'linear-gradient(135deg,#708cff,#a78bfa)',
                borderRadius: 14, opacity: 0.4, filter: 'blur(8px)',
              }} />
              <div className="grad-bg" style={{
                position: 'relative', width: 36, height: 36, borderRadius: 11,
                display: 'grid', placeItems: 'center',
              }}>
                <Sparkles size={17} color="#fff" strokeWidth={2.4} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>
                Doc Whisperer
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>Chat with documents</div>
            </div>
          </div>

          <button
            onClick={onMobileClose}
            className="mobile-close-btn"
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 9, width: 32, height: 32, display: 'none',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* New button */}
        <button
          onClick={onNew}
          className="grad-bg"
          style={{
            border: 'none', borderRadius: 12, padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 4px 16px rgba(112,140,255,0.25)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Document
        </button>

        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '8px 6px 4px',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-3)',
        }}>
          <MessageSquare size={12} />
          Recent
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 2 }}>
          {conversations.length === 0 && (
            <div className="glass" style={{
              borderRadius: 12, padding: '20px 16px', textAlign: 'center',
              fontSize: 12, color: 'var(--text-3)', marginTop: 4,
            }}>
              Your documents will appear here
            </div>
          )}
          {conversations.map((c) => {
            const isActive = c.id === activeId
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="conv-btn"
                style={{
                  width: '100%', textAlign: 'left', borderRadius: 12, padding: '10px 12px',
                  background: isActive ? 'rgba(112,140,255,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(112,140,255,0.3)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 9, flexShrink: 0, marginTop: 1,
                  display: 'grid', placeItems: 'center',
                  background: isActive ? 'linear-gradient(135deg,#708cff,#a78bfa)' : 'rgba(255,255,255,0.06)',
                }}>
                  <FileText size={14} color={isActive ? '#fff' : 'var(--text-3)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500,
                    color: isActive ? 'var(--text)' : 'var(--text-2)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                    {c.messages.length} msg &middot; {timeAgo(c.updatedAt)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(c.id) }}
                  className="delete-btn"
                  style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.15s, color 0.15s', color: 'var(--text-3)',
                  }}
                  aria-label="Delete"
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)' }}
                >
                  <Trash2 size={13} />
                </button>
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: 10, color: 'var(--text-3)', padding: '4px 6px', lineHeight: 1.5 }}>
          History stored locally on this device.
        </div>
      </aside>
    </>
  )
}
