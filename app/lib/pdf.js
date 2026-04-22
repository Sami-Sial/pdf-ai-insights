'use client'

export async function extractPdfText(file, onProgress) {
  // Dynamically import pdfjs to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist')

  // Use the worker bundled with pdfjs-dist (works offline, no CDN needed)
  const workerUrl = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  const total = pdf.numPages
  const parts = []

  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((it) => ('str' in it ? it.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    parts.push(`\n\n[Page ${i}]\n${text}`)
    onProgress?.(i, total)
  }

  return parts.join('')
}