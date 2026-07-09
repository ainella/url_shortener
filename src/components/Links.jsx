import { useState, useEffect } from 'react'
import { FaExternalLinkAlt, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import { BACKEND_URL } from '../constants'

function Links() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingCode, setEditingCode] = useState(null) 
  const [editValue, setEditValue] = useState('')

  const handleDelete = async (shortCode) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/${shortCode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the link');
      }
      
      setHistory(history.filter(item => item.short_code !== shortCode));
    } catch (err) {
      alert(err.message); 
    }
  };

  const handleUpdate = async (shortCode) => {
    try {
      const response = await fetch(`${BACKEND_URL}/url/${shortCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: editValue })
      });

      if (!response.ok) throw new Error('Failed to update the name');

      setHistory(history.map(item => 
        item.short_code === shortCode ? { ...item, display_name: editValue } : item
      ));
      
      setEditingCode(null);
    } catch (err) {
      alert(err.message);
    }
  };
  
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/urls/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server')
        }
        
        const data = await response.json()
        setHistory(data) 
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUrls()
  }, []) 

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px' }}>
        <h1>Short Links History</h1>
        <p className="subtitle">All URLs currently saved in the database</p>

        {isLoading && <p>Loading data from server...</p>}
        {error && <p className="result error">{error}</p>}

        {!isLoading && !error && history.length === 0 ? (
          <p>The database is completely empty!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
          {history.map((item) => (
            <li key={item.short_code} style={{ 
              background: '#f9fafb', margin: '10px 0', padding: '15px', 
              borderRadius: '8px', border: '1px solid #e5e7eb',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>

              {/* 2. LEFT SIDE: Check if we are editing. If yes, show input. If no, show text. */}
              <div style={{ flex: 1, marginRight: '15px' }}>
                {editingCode === item.short_code ? (
                  <input 
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #3b82f6' }}
                  />
                ) : (
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                    {item.display_name || "Unnamed Link"} 
                  </div>
                )}

                <a href={`${BACKEND_URL}/${item.short_code}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                  {BACKEND_URL}/{item.short_code} <FaExternalLinkAlt size={12} />
                </a>
              </div>

              {/* 3. RIGHT SIDE: Show Save/Cancel buttons if editing, otherwise show Edit/Delete */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {editingCode === item.short_code ? (
                  <>
                    <button onClick={() => handleUpdate(item.short_code)} style={{ backgroundColor: '#dcfce7', color: '#166534', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaCheck />
                    </button>
                    <button onClick={() => setEditingCode(null)} style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditingCode(item.short_code); setEditValue(item.display_name || ''); }} style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.short_code)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>

            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  )
}

export default Links