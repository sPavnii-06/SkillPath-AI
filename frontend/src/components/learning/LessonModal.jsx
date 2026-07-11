import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiX, FiBookOpen, FiVideo, FiSearch, FiLayers } from 'react-icons/fi'
import Button from '../ui/Button'

// --- ADVANCED YOUTUBE INTELLIGENT MATCH ENGINE ---
const getVideoForTopic = (topic) => {
  const t = (topic || '').toLowerCase()
  
  // Specific Language & Field Cross-Referencing
  if (t.includes('python')) return "https://www.youtube.com/embed/_uQrJ0TkZlc"
  if (t.includes('java') && !t.includes('javascript')) return "https://www.youtube.com/embed/A74TOX803D0"
  if (t.includes('c++') || t.includes('cpp') || t.includes('operators')) return "https://www.youtube.com/embed/ZzaPdXTrSb8"
  if (t.includes('machine learning') || t.includes('data science') || t.includes('linear')) return "https://www.youtube.com/embed/GwIo3gEJu3A"
  if (t.includes('web development') || t.includes('html') || t.includes('css')) return "https://www.youtube.com/embed/zJSY8tBF_zk"
  if (t.includes('devops') || t.includes('cloud') || t.includes('docker')) return "https://www.youtube.com/embed/hQcFE0RD0cQ"
  
  // High-Quality Global Programming Fallback Stream (So it NEVER stays blank)
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(topic + ' programming tutorial')}`
}

const LessonModal = ({ isOpen, onClose, topic, lesson }) => {
  const [activeTab, setActiveTab] = useState('notes')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      setActiveTab('notes')
      setSearchTerm('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const videoEmbedUrl = getVideoForTopic(topic)

  // Sub-filtering logic for structured sections inside the notes text
  const getFilteredContent = () => {
    if (!lesson) return "Loading educational modules..."
    if (!searchTerm) return lesson

    // Filter content line by line or paragraph base to match keywords highlighted
    return lesson
      .split('\n')
      .filter(line => line.toLowerCase().includes(searchTerm.toLowerCase()))
      .join('\n\n') || `*No direct sections found matching "${searchTerm}". Try looking at the broad overview tabs.*`
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-box animate-fade-up" style={{ maxWidth: '800px', width: '90%', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '85vh', background: '#13131a', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
        
        {/* UPPER TITLE HEADER HEADER */}
        <div className="modal-header" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiLayers style={{ color: 'var(--color-accent)', fontSize: '1.4rem' }} />
            <h2 className="modal-title" style={{ fontSize: 'var(--text-xl)', color: '#fff', margin: 0 }}>Learn: {topic}</h2>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '1.2rem' }}><FiX /></button>
        </div>

        {/* CONTROLS ACTIONS BAR: NAVIGATION TABS AND SEARCH ELEMENT */}
        <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', alignItems: 'center' }}>
          <div style={{ display: 'flex', flex: 1 }}>
            <button 
              onClick={() => setActiveTab('notes')}
              style={{
                padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
                color: activeTab === 'notes' ? 'var(--color-accent, #4f46e5)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === 'notes' ? '3px solid var(--color-accent, #4f46e5)' : '3px solid transparent',
              }}
            >
              <FiBookOpen /> Core Lesson Notes
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
              <FiVideo /> Live Video Tutorial
            </button>
          </div>

          {/* INPUT FILTERING SEARCH INPUT ELEMENT */}
          {activeTab === 'notes' && (
            <div style={{ paddingRight: 'var(--space-4)', display: 'flex', alignItems: 'center', position: 'relative', width: '240px' }}>
              <FiSearch style={{ position: 'absolute', left: '10px', color: 'var(--color-text-secondary)' }} />
              <input 
                type="text"
                placeholder="Search within this lesson..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '6px 12px 6px 32px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: 'var(--text-xs)', outline: 'none'
                }}
              />
            </div>
          )}
        </div>
        
        {/* CENTRAL SCROLLABLE CONTENT ENVELOPE */}
        <div className="lesson-content" style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', background: '#161622' }}>
          
          {/* TAB 1: BEAUTIFULLY STRUCTURED LECTURE NOTES */}
          {activeTab === 'notes' && (
            <div style={{ maxWidth: '100%', color: '#e4e4e7', fontSize: '1.05rem', lineHeight: '1.8' }}>
              
              {/* Contextual Warning Flag for Filters */}
              {searchTerm && (
                <div style={{ background: 'rgba(79, 70, 229, 0.15)', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem', border: '1px dashed var(--color-accent)' }}>
                  Showing filtered lines matching <strong>"{searchTerm}"</strong>. Clear the search bar to show complete study layout documentation.
                </div>
              )}

              {/* Enhanced Styled Container Block Rendering */}
              <div className="markdown-structured-body" style={{ paddingBottom: '20px' }}>
                <ReactMarkdown>{getFilteredContent()}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* TAB 2: AUTONOMOUS VIDEO MONITOR LAYOUT */}
          {activeTab === 'video' && (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
                <iframe 
                  width="100%" height="100%" 
                  src={videoEmbedUrl} 
                  title="Dynamic Resource Course Player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* MODAL BOTTOM DOCK ACTIONS PANEL */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
          <Button variant="primary" onClick={onClose} style={{ padding: '8px 24px', fontWeight: 600 }}>Got it!</Button>
        </div>
      </div>
    </div>
  )
}

export default LessonModal