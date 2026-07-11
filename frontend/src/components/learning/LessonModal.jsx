import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiX, FiBookOpen, FiVideo, FiExternalLink } from 'react-icons/fi'
import Button from '../ui/Button'

// --- AUTOMATIC YOUTUBE VIDEO MATCHER ---
const getVideoForTopic = (topic) => {
  const t = (topic || '').toLowerCase()
  if (t.includes('python')) return "https://www.youtube.com/embed/_uQrJ0TkZlc"
  if (t.includes('java')) return "https://www.youtube.com/embed/A74TOX803D0"
  if (t.includes('c++') || t.includes('cpp')) return "https://www.youtube.com/embed/ZzaPdXTrSb8"
  if (t.includes('machine learning') || t.includes('data science')) return "https://www.youtube.com/embed/GwIo3gEJu3A"
  if (t.includes('web development') || t.includes('html') || t.includes('css')) return "https://www.youtube.com/embed/zJSY8tBF_zk"
  if (t.includes('devops') || t.includes('cloud')) return "https://www.youtube.com/embed/hQcFE0RD0cQ"
  return null
}

const LessonModal = ({ isOpen, onClose, topic, lesson }) => {
  const [activeTab, setActiveTab] = useState('notes')

  // Reset back to notes whenever a new step is clicked
  useEffect(() => {
    if (isOpen) setActiveTab('notes')
  }, [isOpen])

  if (!isOpen) return null

  const videoEmbedUrl = getVideoForTopic(topic)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box animate-fade-up" style={{ maxWidth: '750px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        
        {/* MODAL HEADER */}
        <div className="modal-header" style={{ padding: 'var(--space-4) var(--space-6)' }}>
          <h2 className="modal-title">Learn: {topic}</h2>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        {/* INTERACTIVE TABS BAR */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.15)' }}>
          <button 
            onClick={() => setActiveTab('notes')}
            style={{
              flex: 1, padding: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
              color: activeTab === 'notes' ? 'var(--color-accent, #4f46e5)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'notes' ? '2px solid var(--color-accent, #4f46e5)' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <FiBookOpen /> Study Notes
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            style={{
              flex: 1, padding: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
              color: activeTab === 'video' ? '#ef4444' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'video' ? '2px solid #ef4444' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <FiVideo /> Watch Video Tutorial
          </button>
        </div>
        
        {/* DYNAMIC CONTENT CONTAINER */}
        <div className="lesson-content" style={{ maxHeight: '55vh', overflowY: 'auto', padding: 'var(--space-6)' }}>
          
          {/* TAB 1: MARKDOWN NOTES */}
          {activeTab === 'notes' && (
            <div className="markdown-body">
              <ReactMarkdown>{lesson}</ReactMarkdown>
            </div>
          )}

          {/* TAB 2: EMBEDDED VIDEO PLAYER */}
          {activeTab === 'video' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {videoEmbedUrl ? (
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <iframe 
                    width="100%" height="100%" 
                    src={videoEmbedUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  <FiVideo style={{ fontSize: '2.5rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }} />
                  <h3 style={{ marginBottom: 'var(--space-2)' }}>No video course linked yet for this item</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                    You can quickly search resources on YouTube for: <strong>{topic}</strong>
                  </p>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Search on YouTube <FiExternalLink />
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={onClose}>Got it!</Button>
        </div>
      </div>
    </div>
  )
}

export default LessonModal