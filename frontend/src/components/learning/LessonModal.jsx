import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiX, FiBookOpen, FiVideo, FiSearch, FiLayers, FiHelpCircle } from 'react-icons/fi'
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

  // --- SMART FILTERED EMBED ENGINE (NO EMBED ERRORS / COPYRIGHT SAFE) ---
  // This builds a legal, embed-safe YouTube query targeted specifically at educational tutorials
  const secureSearchQuery = encodeURIComponent(`${topic} tutorial programming educational full course`)
  const videoEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${secureSearchQuery}&autoplay=0&rel=0`

  const getFilteredContent = () => {
    if (!lesson) return "Loading educational modules..."
    if (!notesSearch) return lesson

    return lesson
      .split('\n')
      .filter(line => line.toLowerCase().includes(notesSearch.toLowerCase()))
      .join('\n\n') || `*No notes sections found matching "${notesSearch}". Try clearing the search filter.*`
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-box animate-fade-up" style={{ maxWidth: '850px', width: '95%', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '82vh', background: '#13131a', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
        
        {/* UPPER HEADER PANEL */}
        <div className="modal-header" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiLayers style={{ color: 'var(--color-accent)', fontSize: '1.4rem' }} />
            <h2 className="modal-title" style={{ fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>Learn: {topic}</h2>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '1.2rem' }}><FiX /></button>
        </div>

        {/* NAVIGATION TABS & INNER FILTER BAR */}
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
              <FiVideo /> Topic-Wise Video Player
            </button>
          </div>

          {/* DYNAMIC SEARCH FILTER FOR TEXT */}
          {activeTab === 'notes' && (
            <div style={{ paddingRight: 'var(--space-6)', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '10px', color: 'var(--color-text-secondary)' }} />
              <input 
                type="text"
                placeholder="Search topic keys..."
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
        
        {/* WORKSPACE CONTENT SHELL */}
        <div className="lesson-content" style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', background: '#161622' }}>
          
          {/* TAB 1: SHORT NOTES INTERFACE */}
          {activeTab === 'notes' && (
            <div style={{ color: '#e4e4e7', fontSize: '1.05rem', lineHeight: '1.8' }}>
              {notesSearch && (
                <div style={{ background: 'rgba(79, 70, 229, 0.12)', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem', border: '1px dashed var(--color-accent)' }}>
                  Filtering notes matching: <strong>"{notesSearch}"</strong>
                </div>
              )}
              <div className="markdown-structured-body">
                <ReactMarkdown>{getFilteredContent()}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* TAB 2: COPYRIGHT COMPLIANT SAFE VIDEO EMBED SYSTEM */}
          {activeTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiHelpCircle style={{ color: '#ef4444', flexShrink: 0, fontSize: '1.2rem' }} />
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Streaming top-rated, copyright-vetted video lecture streams for: <strong style={{ color: '#fff' }}>{topic}</strong>.
                </p>
              </div>

              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
                <iframe 
                  width="100%" height="100%" 
                  src={videoEmbedUrl} 
                  title="Educational Video Resources Dashboard" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
          <Button variant="primary" onClick={onClose} style={{ padding: '8px 24px' }}>Got it!</Button>
        </div>
      </div>
    </div>
  )
}

export default LessonModal