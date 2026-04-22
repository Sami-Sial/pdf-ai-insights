'use client'

import { useCallback, useRef, useState } from 'react'
import { FileUp, Loader2, Sparkles, Upload, FileText, Zap, Lock, Menu } from 'lucide-react'
import { extractPdfText } from '../lib/pdf'

export default function UploadZone({ onReady, onMenuOpen }) {
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError(null)
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('PDF too large — max 20 MB.')
      return
    }
    setBusy(true)
    setProgress({ p: 0, t: 1 })
    try {
      const text = await extractPdfText(file, (p, t) => setProgress({ p, t }))
      if (text.trim().length < 20) {
        setError("Couldn't extract text. Is this a scanned PDF?")
        return
      }
      const pageCount = progress?.t ?? 1
      onReady({ pdfName: file.name, pdfText: text, pageCount })
    } catch (e) {
      console.error(e)
      setError('Failed to read PDF. Please try another file.')
    } finally {
      setBusy(false)
      setProgress(null)
    }
  }, [onReady, progress?.t])

  const features = [
    { icon: FileText, title: 'Any PDF', desc: 'Reports, papers, contracts' },
    { icon: Zap, title: 'Instant', desc: 'Streaming AI responses' },
    { icon: Lock, title: 'Private', desc: 'Stays on your device' },
  ]

  return (
    <div style={{
      flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px 16px', position: 'relative', minHeight: 0,
    }}>

      {/* Mobile top bar */}
      <div className="uz-topbar" style={{
        display: 'none', position: 'absolute', top: 0, left: 0, right: 0,
        height: 52, alignItems: 'center', padding: '0 12px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(8,11,20,0.8)', backdropFilter: 'blur(12px)',
      }}>
        <button onClick={onMenuOpen} style={{
          width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
        }} aria-label="Menu">
          <Menu size={15} />
        </button>
        <div style={{
          marginLeft: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: 13, letterSpacing: '-0.01em',
        }}>
          Doc Whisperer
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 480 }} className="animate-fade-up uz-content">

        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(112,140,255,0.1)', border: '1px solid rgba(112,140,255,0.18)',
            borderRadius: 99, padding: '4px 12px', fontSize: 11, color: 'var(--accent)',
            marginBottom: 14, fontWeight: 500,
          }}>
            <Sparkles size={11} />
            AI-powered document chat
          </div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 'clamp(26px,5vw,40px)',
            fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10,
          }}>
            Chat with any <span className="grad-text">PDF</span>
          </h1>

          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, maxWidth: 340, margin: '0 auto' }}>
            Upload a document and ask anything. Get instant answers grounded in your file.
          </p>
        </div>

        {/* Drop zone */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false)
            const f = e.dataTransfer.files?.[0]
            if (f) handleFile(f)
          }}
          style={{
            display: 'block', cursor: busy ? 'default' : 'pointer',
            borderRadius: 16, padding: '28px 20px', textAlign: 'center',
            background: dragOver ? 'rgba(112,140,255,0.07)' : 'rgba(255,255,255,0.03)',
            border: dragOver ? '1.5px dashed rgba(112,140,255,0.55)' : '1.5px dashed rgba(255,255,255,0.11)',
            transition: 'all 0.2s ease',
            transform: dragOver ? 'scale(1.01)' : 'scale(1)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {/* Icon */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -5,
                background: 'linear-gradient(135deg,rgba(112,140,255,0.35),rgba(167,139,250,0.25))',
                borderRadius: 16, filter: 'blur(12px)', opacity: busy ? 0.25 : 0.5,
              }} />
              <div className="grad-bg" style={{
                position: 'relative', width: 52, height: 52, borderRadius: 15,
                display: 'grid', placeItems: 'center',
                boxShadow: '0 6px 22px rgba(112,140,255,0.3)',
              }}>
                {busy
                  ? <Loader2 size={22} color="#fff" style={{ animation: 'spin 0.8s linear infinite' }} />
                  : <Upload size={22} color="#fff" strokeWidth={2} />
                }
              </div>
            </div>

            {busy ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>
                  Reading… page {progress?.p ?? 0} / {progress?.t ?? '?'}
                </div>
                <div style={{
                  width: 180, height: 4, background: 'rgba(255,255,255,0.08)',
                  borderRadius: 99, overflow: 'hidden',
                }}>
                  <div className="grad-bg" style={{
                    height: '100%', borderRadius: 99, transition: 'width 0.3s ease',
                    width: `${progress ? (progress.p / Math.max(1, progress.t)) * 100 : 0}%`,
                  }} />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Drop your PDF here</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>or click to browse · up to 20 MB</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); inputRef.current?.click() }}
                  className="grad-bg"
                  style={{
                    border: 'none', borderRadius: 10, padding: '9px 20px',
                    display: 'flex', alignItems: 'center', gap: 7,
                    color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: '0 3px 14px rgba(112,140,255,0.28)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
                >
                  <FileUp size={14} />
                  Choose PDF
                </button>
              </>
            )}
          </div>
        </label>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 10, padding: '8px 14px', borderRadius: 10,
            background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.22)',
            fontSize: 12, color: '#f87171', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 14 }}>
          {features.map((f) => (
            <div key={f.title} className="glass" style={{
              borderRadius: 12, padding: '11px 12px',
              display: 'flex', flexDirection: 'column', gap: 7,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(112,140,255,0.12)', display: 'grid', placeItems: 'center',
              }}>
                <f.icon size={13} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.35 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 767px) {
          .uz-topbar { display: flex !important; }
          .uz-content { padding-top: 64px; }
        }
      `}</style>
    </div>
  )
}