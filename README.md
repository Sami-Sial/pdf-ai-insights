# Doc Whisperer

A beautiful Next.js App Router app that lets you chat with any PDF using Claude AI.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your Anthropic API key
   ```

3. **Run in development**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Features

- Upload any PDF (up to 20 MB)
- Chat with your document using Claude AI (streaming responses)
- Conversation history saved locally in browser
- Multiple documents supported via sidebar
- Fully responsive — works on mobile and desktop
- Beautiful dark UI with animated gradient background

## Stack

- **Next.js 16** (App Router, Edge Runtime API)
- **Anthropic Claude** (`claude-3-5-haiku`) for AI responses
- **pdfjs-dist** for client-side PDF text extraction
- **react-markdown** for rendering AI responses
- **lucide-react** for icons
- **Tailwind CSS v4** + custom CSS design system

## Project structure

```
app/
├── api/chat/route.js       # Streaming AI API route (Edge)
├── components/
│   ├── DocWhisperer.js     # Root client component
│   ├── Sidebar.js          # Conversation list
│   ├── UploadZone.js       # PDF upload UI
│   ├── ChatView.js         # Chat interface
│   └── MessageBubble.js    # Individual message
├── lib/
│   ├── storage.js          # localStorage helpers
│   ├── pdf.js              # PDF text extraction
│   └── chatApi.js          # Streaming fetch client
├── globals.css             # Design system
└── layout.js / page.js
```
