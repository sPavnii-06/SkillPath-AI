import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiX, FiBookOpen, FiVideo, FiSearch, FiLayers, FiExternalLink, FiInfo } from 'react-icons/fi'
import Button from '../ui/Button'

const getCourseVideo = (topic) => {
  const t = (topic || '').toLowerCase()
  
  // High-Impact, globally embed-permissive education streams
  if (t.includes('python')) return "https://www.youtube.com/embed/rfscVS0vtbw" // FreeCodeCamp Python Course
  if (t.includes('java')) return "https://www.youtube.com/embed/2dZiMBwXp9Y" // Computer Science Java Fundamentals
  if (t.includes('c++') || t.includes('cpp') || t.includes('operator')) return "https://www.youtube.com/embed/vLnPwxZdW4Y" // C++ Programming Crash Course
  if (t.includes('machine learning') || t.includes('data')) return "https://www.youtube.com/embed/GwIo3gEJu3A"
  if (t.includes('cyber') || t.includes('security')) return "https://www.youtube.com/embed/nzj7FwIFc04"
  
  // General production fallback embed link
  return "https://www.youtube.com/embed/zJSY8tBF_zk"
}

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

  const videoUrl = getCourseVideo(topic)

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
      <div className="modal-box animate-fade-up" style={{ maxWidth: '850px', width: '95%', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '82vh', background: '#13131a', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
        
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
              <FiVideo /> Recommended Tutorials
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
          
          {activeTab === 'notes' && (
            <div style={{ color: '#e4e4e7', fontSize: '1.05rem', lineHeight: '1.8' }}>
              <div className="markdown-structured-body">
                <ReactMarkdown>{getFilteredContent()}</ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiInfo style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Playing verified public domain interactive guide structure for: <strong>{topic}</strong>.
                </p>
              </div>

              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
                <iframe 
                  width="100%" height="100%" 
                  src={videoUrl} 
                  title="Video Player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' crash course')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Open External YouTube Search Resource <FiExternalLink />
                  </div>
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