const KEY = 'doc-whisperer:conversations:v1'
const ACTIVE_KEY = 'doc-whisperer:active:v1'
const MAX_PDF_CHARS = 200_000

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function loadConversations() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveConversations(list) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('Failed to persist conversations', e)
  }
}

export function getActiveId() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACTIVE_KEY)
}

export function setActiveId(id) {
  if (typeof window === 'undefined') return
  if (id) localStorage.setItem(ACTIVE_KEY, id)
  else localStorage.removeItem(ACTIVE_KEY)
}

export function createConversation({ pdfName, pdfText, pageCount }) {
  const now = Date.now()
  return {
    id: uid(),
    title: pdfName.replace(/\.pdf$/i, ''),
    pdfName,
    pdfText: pdfText.slice(0, MAX_PDF_CHARS),
    pageCount,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}
