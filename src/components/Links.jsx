import { useState, useEffect } from 'react'
import { FaExternalLinkAlt, FaTrash } from 'react-icons/fa'

function Links() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
    
  // --- NEW DELETE FUNCTION ---
  const handleDelete = async (shortCode) => {
    // 1. Ask the user to confirm before deleting (always good practice!)
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      // 2. Send the DELETE request to FastAPI
      const response = await fetch(`http://127.0.0.1:8000/${shortCode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the link');
      }

      // 3. Instantly remove it from the screen by filtering it out of our state
      setHistory(history.filter(item => item.short_code !== shortCode));

    } catch (err) {
      alert(err.message); // Show a simple browser alert if it fails
    }
  };


  // useEffect runs automatically when the page loads
  useEffect(() => {
    // We create an async function to fetch the data
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/urls/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server')
        }
        
        const data = await response.json()
        setHistory(data) // Save the data to our React state!
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUrls()
  }, []) // The empty array [] means "only run this once when the page loads"

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px' }}>
        <h1>Server URL History</h1>
        <p className="subtitle">All URLs currently saved in the database</p>

        {/* Show a loading message while waiting for the server */}
        {isLoading && <p>Loading data from server...</p>}
        
        {/* Show an error if the server is offline */}
        {error && <p className="result error">{error}</p>}

        {/* Display the data once it loads */}
        {!isLoading && !error && history.length === 0 ? (
          <p>The database is completely empty!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
          {history.map((item) => (
            <li key={item.short_code} style={{ 
              background: '#f9fafb', 
              margin: '10px 0', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              display: 'flex', // Make it a flexbox container
              justifyContent: 'space-between', // Push left and right sides apart
              alignItems: 'center' // Vertically center them
            }}>

              {/* LEFT SIDE: The Link Info */}
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  {item.display_name || "Unnamed Link"} 
                </div>

                <a href={`http://127.0.0.1:8000/${item.short_code}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                  http://127.0.0.1:8000/{item.short_code} <FaExternalLinkAlt size={12} />
                </a>
              </div>

              {/* RIGHT SIDE: The Delete Button */}
              <button 
                onClick={() => handleDelete(item.short_code)}
                style={{
                  backgroundColor: '#fee2e2', // Light red background
                  color: '#dc2626', // Dark red icon
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fca5a5'} // Hover effect
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                title="Delete Link"
              >
                <FaTrash />
              </button>

            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  )
}

export default Links