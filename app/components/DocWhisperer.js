'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Sidebar from './Sidebar'
import UploadZone from './UploadZone'
import ChatView from './ChatView'
import {
  loadConversations,
  saveConversations,
  getActiveId,
  setActiveId as persistActiveId,
  createConversation,
} from '../lib/storage'

export default function DocWhisperer() {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const list = loadConversations()
    setConversations(list)
    const stored = getActiveId()
    if (stored && list.some((c) => c.id === stored)) {
      setActiveId(stored)
    } else if (list.length > 0) {
      setActiveId(list[0].id)
    } else {
      setShowUpload(true)
    }
  }, [])

  // Persist
  useEffect(() => { saveConversations(conversations) }, [conversations])
  useEffect(() => { persistActiveId(activeId) }, [activeId])

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations],
  )

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  )

  const handleReady = useCallback((data) => {
    const conv = createConversation(data)
    setConversations((prev) => [conv, ...prev])
    setActiveId(conv.id)
    setShowUpload(false)
  }, [])

  const handleUpdate = useCallback((updated) => {
    setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }, [])

  const handleDelete = useCallback((id) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (id === activeId) {
        const fallback = next[0]?.id ?? null
        setActiveId(fallback)
        if (!fallback) setShowUpload(true)
      }
      return next
    })
  }, [activeId])

  const handleNew = useCallback(() => {
    setShowUpload(true)
    setActiveId(null)
    setSidebarOpen(false)
  }, [])

  const handleSelect = useCallback((id) => {
    setShowUpload(false)
    setActiveId(id)
    setSidebarOpen(false)
  }, [])

  return (
    <>
      <div className="mesh-bg" />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100dvh', overflow: 'hidden', }}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 40, backdropFilter: 'blur(4px)',
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          conversations={sortedConversations}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
          onDelete={handleDelete}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {showUpload || !active ? (
            <UploadZone onReady={handleReady} onMenuOpen={() => setSidebarOpen(true)} />
          ) : (
            <ChatView
              key={active.id}
              conversation={active}
              onUpdate={handleUpdate}
              onNew={handleNew}
              onMenuOpen={() => setSidebarOpen(true)}
            />
          )}
        </main>
      </div>
    </>
  )
}
