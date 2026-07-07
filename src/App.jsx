import { useState } from 'react'
import { Routes, Route } from 'react-router-dom' 
import Navbar from './components/Navbar'
import Links from './components/Links' 
import './App.css'

function App() {
  const [targetUrl, setTargetUrl] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setShortUrl('')

    try {
      const response = await fetch('http://127.0.0.1:8000/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          target_url: targetUrl, 
          display_name: displayName 
        }),
      })

      // If the backend returns a 400 error (name taken), extract the message!
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to shorten URL.')
      }

      const data = await response.json()
      const finalShortUrl = `http://127.0.0.1:8000/${data.short_code}`

      setShortUrl(finalShortUrl)

      // ... (keep the rest of your history saving logic here) ...

      setTargetUrl('')
      setDisplayName('')
      
      // --- NEW: SAVE TO HISTORY ---
      // 1. Get existing history (or an empty array if none exists)
      const existingHistory = JSON.parse(localStorage.getItem('urlHistory') || '[]')
      // 2. Create a new item
      const newItem = { original: targetUrl, short: finalShortUrl }
      // 3. Save it back to Local Storage (putting the newest item at the top)
      localStorage.setItem('urlHistory', JSON.stringify([newItem, ...existingHistory]))
      // -----------------------------

      setTargetUrl('')
      setDisplayName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // We are moving the form into its own variable just to keep the return statement clean
  const HomeForm = (
    <div className="container">
      <div className="card">
        <h1>URL Shortener</h1>
        <p className="subtitle">Paste your long link below</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="URL"
            disabled={isLoading}
            style={{ marginBottom: '15px' }}
          />

          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
            disabled={isLoading}
            style={{ marginBottom: '15px' }}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Shortening...' : 'Shorten Link'}
          </button>
        </form>

        {shortUrl && (
          <div className="result success">
            Success! Your short link is:<br />
            {/* Added target="_blank" here too! */}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}

        {error && <div className="result error">{error}</div>}
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      
      {/* This Routes block swaps the page based on the URL */}
      <Routes>
        <Route path="/" element={HomeForm} />
        <Route path="/links" element={<Links />} />
      </Routes>
    </>
  )
}

export default App