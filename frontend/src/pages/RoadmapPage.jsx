import { useState, useEffect } from 'react'
import { FiRefreshCw, FiCheck } from 'react-icons/fi'
import DashboardLayout from '../components/layouts/DashboardLayout'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import useRoadmap from '../hooks/useRoadmap'
import { getLevelColor } from '../utils/helpers'
import toast from 'react-hot-toast'
import LessonModal from '../components/learning/LessonModal'
import QuizModal from '../components/learning/QuizModal'

const RoadmapPage = () => {
  const { roadmap, progress, isLoading, markStep, regenerate, getLesson, getQuiz } = useRoadmap()
  const [updating, setUpdating] = useState(null)
  const [regen, setRegen] = useState(false)
  
  // Learning states
  const [lessonData, setLessonData] = useState({ open: false, topic: '', content: '', loading: false })
  const [quizData, setQuizData] = useState({ open: false, topic: '', content: null, loading: false })

  // --- MULTI-COURSE CONTAINER STATES ---
  const [history, setHistory] = useState([])
  const [activeRoadmap, setActiveRoadmap] = useState(null)
  const [showHistoryView, setShowHistoryView] = useState(false)

  // Track and collect generated roadmaps automatically
  useEffect(() => {
    if (roadmap) {
      setActiveRoadmap(roadmap)
      setHistory((prev) => {
        if (prev.some((item) => (item._id || item.id) === (roadmap._id || roadmap.id))) return prev
        return [roadmap, ...prev]
      })
    }
  }, [roadmap])

  const handleToggle = async (stepNumber, currentCompleted) => {
    setUpdating(stepNumber)
    try {
      await markStep(stepNumber, !currentCompleted)
      toast.success(!currentCompleted ? '✅ Step completed!' : 'Step marked incomplete')
    } catch {
      toast.error('Failed to update step')
    } finally {
      setUpdating(null)
    }
  }

  const handleRegenerate = async () => {
    if (!confirm('This will replace your current roadmap. Continue?')) return
    setRegen(true)
    try {
      await regenerate(roadmap.goal, roadmap.level, roadmap.weeklyHours)
      toast.success('🎉 New roadmap generated!')
    } catch {
      toast.error('Failed to regenerate')
    } finally {
      setRegen(false)
    }
  }

  const handleLearn = async (step) => {
    setLessonData({ open: true, topic: step.title, content: '', loading: true })
    try {
      const content = await getLesson(step.title, step.description)
      setLessonData(prev => ({ ...prev, content, loading: false }))
    } catch {
      toast.error('Failed to load lesson')
      setLessonData(prev => ({ ...prev, open: false, loading: false }))
    }
  }

  const handleQuiz = async (step) => {
    setQuizData({ open: true, topic: step.title, content: null, loading: true })
    try {
      const content = await getQuiz(step.title, step.description)
      setQuizData(prev => ({ ...prev, content, loading: false }))
    } catch {
      toast.error('Failed to generate quiz')
      setQuizData(prev => ({ ...prev, open: false, loading: false }))
    }
  }

  if (isLoading) return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spinner size={48} />
      </div>
    </DashboardLayout>
  )

  // Determine which roadmap data packet to render in the view context
  const displayRoadmap = showHistoryView ? activeRoadmap : roadmap

  if (!displayRoadmap) return (
    <DashboardLayout>
      <EmptyState icon="🗺️" title="No Roadmap Found" text="Complete onboarding to generate your AI-powered roadmap." action={() => window.location.href = '/onboarding'} actionLabel="Generate Roadmap" />
    </DashboardLayout>
  )

  const pct = displayRoadmap === roadmap ? (progress?.percentComplete || 0) : 100
  const completedSet = new Set(displayRoadmap === roadmap ? (progress?.completedSteps || []) : displayRoadmap.steps.map(s => s.stepNumber))

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', gap: 'var(--space-6)', minHeight: '75vh', alignItems: 'stretch' }}>
        
        {/* ================= SIDEBAR CONTAINER SHELL ================= */}
        <aside style={{
          width: '260px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          paddingRight: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          {/* Action button to allow students to generate brand-new courses */}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => window.location.href = '/onboarding'}
            style={{ width: '100%', border: '1px dashed var(--color-accent)' }}
          >
            ➕ Create New Course Roadmap
          </Button>

          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => {
              setShowHistoryView(false)
              setActiveRoadmap(roadmap)
            }}
            style={{ width: '100%' }}
          >
            ⭐ Current Active View
          </Button>

          <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Your Courses History
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', overflowY: 'auto' }}>
            {history.map((histItem, idx) => (
              <div
                key={histItem._id || idx}
                onClick={() => {
                  setActiveRoadmap(histItem)
                  setShowHistoryView(true)
                }}
                style={{
                  padding: 'var(--space-3)',
                  background: activeRoadmap?._id === histItem._id ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid',
                  borderColor: activeRoadmap?._id === histItem._id ? 'var(--color-accent)' : 'transparent',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  color: activeRoadmap?._id === histItem._id ? '#fff' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                📚 {histItem.goal || `Course #${idx + 1}`}
              </div>
            ))}
          </div>
        </aside>

        {/* ================= DYNAMIC WORKSPACE CONTENT PANEL ================= */}
        <main style={{ flex: 1 }}>
          <div className="animate-fade-up">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
                  Your <span className="gradient-text">Roadmap</span>
                </h1>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{displayRoadmap.goal}</span>
                  <Badge variant={getLevelColor(displayRoadmap.level)}>{displayRoadmap.level}</Badge>
                  {displayRoadmap.aiGenerated && <Badge variant="primary">✨ AI Generated</Badge>}
                </div>
              </div>
              
              {!showHistoryView && (
                <Button variant="secondary" size="sm" onClick={handleRegenerate} isLoading={regen}>
                  <FiRefreshCw /> Regenerate
                </Button>
              )}
            </div>

            {/* Progress bar */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontWeight: 600 }}>Overall Progress</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{Math.round(pct)}%</span>
              </div>
              <ProgressBar value={pct} height={10} />
              <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                {completedSet.size} of {displayRoadmap.steps.length} steps completed
                {displayRoadmap.estimatedDuration && ` · Est. ${displayRoadmap.estimatedDuration}`}
              </p>
            </div>

            {/* Steps */}
            <div className="roadmap-timeline">
              {displayRoadmap.steps.map((step) => {
                const done = completedSet.has(step.stepNumber)
                return (
                  <div key={step.stepNumber} className={`roadmap-step ${done ? 'roadmap-step--completed' : ''}`}>
                    <div className="roadmap-step__number">{done ? <FiCheck /> : step.stepNumber}</div>
                    <div className="roadmap-step__body">
                      <div className="roadmap-step__title" style={{ textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--color-text-secondary)' : 'var(--color-text)' }}>
                        {step.title}
                      </div>
                      <div className="roadmap-step__desc">{step.description}</div>
                      <div className="roadmap-step__meta">
                        <Badge variant="neutral">⏱ {step.duration}</Badge>
                        {step.resources?.map((r, i) => (
                          <Badge key={i} variant="info">{r}</Badge>
                        ))}
                        
                        {!showHistoryView && (
                          <label className="roadmap-step__checkbox">
                            {updating === step.stepNumber
                              ? <Spinner size={18} />
                              : <input type="checkbox" checked={done} onChange={() => handleToggle(step.stepNumber, done)} />
                            }
                            {done ? 'Completed' : 'Mark done'}
                          </label>
                        )}
                      </div>
                      {!done && !showHistoryView && (
                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                          <Button variant="secondary" size="sm" onClick={() => handleLearn(step)} isLoading={lessonData.open && lessonData.topic === step.title && lessonData.loading}>
                            📖 Learn Now
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleQuiz(step)} isLoading={quizData.open && quizData.topic === step.title && quizData.loading}>
                            🧠 Test Knowledge
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <LessonModal 
              isOpen={lessonData.open && !lessonData.loading} 
              onClose={() => setLessonData(prev => ({ ...prev, open: false }))} 
              topic={lessonData.topic} 
              lesson={lessonData.content} 
            />

            <QuizModal 
              isOpen={quizData.open && !quizData.loading} 
              onClose={() => setQuizData(prev => ({ ...prev, open: false }))} 
              topic={quizData.topic} 
              quiz={quizData.content || []} 
              onPass={() => handleToggle(displayRoadmap.steps.find(s => s.title === quizData.topic).stepNumber, false)}
            />
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}

export default RoadmapPage