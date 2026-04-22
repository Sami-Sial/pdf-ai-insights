import './globals.css'

export const metadata = {
  title: 'Doc Whisperer — Chat with any PDF',
  description: 'Upload a PDF and ask anything. AI-powered answers grounded in your document.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
