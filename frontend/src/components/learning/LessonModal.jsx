import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiX, FiBookOpen, FiVideo, FiSearch, FiLayers, FiExternalLink } from 'react-icons/fi'
import Button from '../ui/Button'

const LessonModal = ({ isOpen, onClose, topic, lesson }) => {
  const [activeTab, setActiveTab] = useState('notes')
  const [notesSearch, setNotesSearch] = useState('')

  useEffect(() => {
    if (isOpen) {
      setActiveTab('notes')
      setNotesSearch('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // Safely encode the topic for clean, copyright-filtered external redirection
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial full course')}`

  const getFilteredContent = () => {
    if (!lesson) return "Loading educational modules..."
    if (!notesSearch) return lesson

    return lesson
      .split('\n')
      .filter(line => line.toLowerCase().includes(notesSearch.toLowerCase()))
      .join('\n\n') || `*No notes sections found matching "${notesSearch}".*`
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(6px)', position: 'fixed', inset: 0, zIndex: 9999 }}>
      <div className="modal-box animate-fade-up" style={{ maxWidth: '800px', width: '95%', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '75vh', background: '#13131a', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
        
        {/* MODAL HEADER */}
        <div className="modal-header" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiLayers style={{ color: 'var(--color-accent)', fontSize: '1.4rem' }} />
            <h2 className="modal-title" style={{ fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>Learn: {topic}</h2>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '1.2rem' }}><FiX /></button>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <button 
              onClick={() => setActiveTab('notes')}
              style={{
                padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
                color: activeTab === 'notes' ? 'var(--color-accent, #4f46e5)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === 'notes' ? '3px solid var(--color-accent, #4f46e5)' : '3px solid transparent',
              }}
            >
              <FiBookOpen /> Structured Short Notes
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              style={{
                padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
                color: activeTab === 'video' ? '#ef4444' : 'var(--color-text-secondary)',
                borderBottom: activeTab === 'video' ? '3px solid #ef4444' : '3px solid transparent',
              }}
            >
              <FiVideo /> Recommended Video Tutorials
            </button>
          </div>

          {activeTab === 'notes' && (
            <div style={{ paddingRight: 'var(--space-6)', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '10px', color: 'var(--color-text-secondary)' }} />
              <input 
                type="text"
                placeholder="Search notes..."
                value={notesSearch}
                onChange={(e) => setNotesSearch(e.target.value)}
                style={{
                  width: '200px', padding: '6px 12px 6px 32px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: 'var(--text-xs)', outline: 'none'
                }}
              />
            </div>
          )}
        </div>
        
        {/* WORKSPACE CONTENT AREA */}
        <div className="lesson-content" style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', background: '#161622' }}>
          
          {/* TAB 1: NOTES */}
          {activeTab === 'notes' && (
            <div style={{ color: '#e4e4e7', fontSize: '1.05rem', lineHeight: '1.8' }}>
              <div className="markdown-structured-body">
                <ReactMarkdown>{getFilteredContent()}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* TAB 2: STREAMING HUBS DASHBOARD */}
          {activeTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) 0', textAlign: 'center' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                <FiVideo style={{ fontSize: '3rem', color: '#ef4444', display: 'block' }} />
              </div>
              
              <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: 'var(--text-lg)' }}>External Media Stream Linker</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: '24px' }}>
                To comply perfectly with global copyright standards and prevent iframe rendering blockages, video resources are dynamically isolated per topic step.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '400px' }}>
                <a href={searchUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#ef4444', borderColor: '#ef4444', padding: '12px' }}>
                    Stream Filtered Videos on YouTube <FiExternalLink />
                  </Button>
                </a>
                
                <a href={`https://www.google.com/search?q=${encodeURIComponent(topic + ' documentation technical')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px' }}>
                    Open Technical Documentation Reference <FiExternalLink />
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
          <Button variant="primary" onClick={onClose} style={{ padding: '8px 24px' }}>Got it!</Button>
        </div>
      </div>
    </div>
  )
}

export default LessonModal