import { useEffect, useState } from 'react'
import { Pause, Play, Plus, X } from 'lucide-react'

interface RestTimerProps {
  open: boolean
  initialSeconds: number
  onClose: () => void
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function RestTimer({ open, initialSeconds, onClose }: RestTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!open || !running || remaining <= 0) return
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [open, running, remaining])

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null
  const progress = Math.max(0, Math.min(100, (remaining / initialSeconds) * 100))

  return (
    <section className="rest-timer" role="dialog" aria-label="Таймер отдыха">
      <div className="timer-copy"><span>{remaining === 0 ? 'Отдых закончен' : 'Отдыхайте'}</span><strong aria-live="polite">{formatTime(remaining)}</strong></div>
      <div className="timer-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className="timer-actions">
        <button onClick={() => setRunning((value) => !value)} disabled={remaining === 0} aria-label={running ? 'Приостановить таймер' : 'Продолжить таймер'}>{running ? <Pause size={19} /> : <Play size={19} />}</button>
        <button onClick={() => setRemaining((value) => value + 30)}><Plus size={18} /><span>30 сек</span></button>
        <button className="timer-skip" onClick={onClose}>{remaining === 0 ? 'Продолжить' : 'Пропустить'}</button>
      </div>
      <button className="timer-close" onClick={onClose} aria-label="Закрыть таймер"><X size={19} /></button>
    </section>
  )
}
