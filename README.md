# 🚀 Doc Whisperer – AI PDF Insights App

A modern **Next.js App Router** application that lets you upload PDFs and chat with them using AI — with **real-time streaming responses** for a fast, ChatGPT-like experience.

---

## ✨ Features

- 📄 Upload any PDF (up to 20MB)
- 🤖 Ask questions about your document
- ⚡ Real-time streaming responses (SSE)
- 🧠 Powered by AI (Claude / Groq-ready architecture)
- 💬 Chat-like interface (smooth UX)
- 📚 Multiple documents support (sidebar navigation)
- 💾 Conversation history stored in browser (localStorage)
- 📱 Fully responsive (mobile + desktop)
- 🎨 Beautiful dark UI with animated gradient

---

## 🧠 How It Works

1. Upload a PDF
2. Text is extracted on the client
3. Ask a question
4. Request is sent to AI API
5. Response is streamed back in real-time (SSE)
6. UI updates instantly as tokens arrive

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Backend:** Edge API Routes
- **AI:** Anthropic Claude (`claude-3-5-haiku`)
- **Streaming:** Server-Sent Events (SSE)
- **PDF Parsing:** pdfjs-dist
- **UI:** Tailwind CSS v4 + custom design system
- **Markdown Rendering:** react-markdown
- **Icons:** lucide-react

---

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

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key**
   ```bash
   create .env.local
   # Edit .env.local and add your Groq API key GROQ_API_KEY=key_here
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

## 📱 Mobile App Builds (Capacitor)

This project uses [Capacitor](https://capacitorjs.com/) to build native iOS and Android apps from the Next.js web application.

### Prerequisites
- **iOS**: Xcode installed (macOS only)
- **Android**: Android Studio installed

### Building for Mobile

1. **Export the Next.js app**
   Build the static files for the web application:
   ```bash
   npm run build
   ```
   This generates the static files in the `out` directory (ensure `output: 'export'` is set in `next.config.mjs`).

2. **Sync with Capacitor**
   Sync the built web assets to the native mobile projects:
   ```bash
   npx cap sync
   ```

3. **Open native IDEs**
   Open the respective native IDE to run or deploy the app:
   - **Android:** 
     ```bash
     npx cap open android
     ```
   - **iOS:**
     ```bash
     npx cap open ios
     ```

From Xcode or Android Studio, you can build, test on emulators, and deploy the application to physical devices.

