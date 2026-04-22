export async function streamChat({ messages, pdfText, pdfName, onDelta, onDone, signal }) {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, pdfText, pdfName }),
    signal,
  })

  if (!resp.ok) {
    let msg = `Request failed (${resp.status})`
    try {
      const j = await resp.json()
      if (j?.error) msg = j.error
    } catch {}
    throw new Error(msg)
  }

  if (!resp.body) throw new Error('No response stream')

  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let done = false

  while (!done) {
    const { done: rdone, value } = await reader.read()
    if (rdone) break
    buffer += decoder.decode(value, { stream: true })

    let idx
    while ((idx = buffer.indexOf('\n')) !== -1) {
      let line = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 1)
      if (line.endsWith('\r')) line = line.slice(0, -1)
      if (!line || line.startsWith(':')) continue
      if (!line.startsWith('data: ')) continue
      const json = line.slice(6).trim()
      if (json === '[DONE]') { done = true; break }
      try {
        const parsed = JSON.parse(json)
        const c = parsed.choices?.[0]?.delta?.content
        if (c) onDelta(c)
      } catch {}
    }
  }

  onDone?.()
}
