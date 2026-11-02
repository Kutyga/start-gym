import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, HeartPulse, Pause, Play, RotateCcw, Wind } from 'lucide-react'
import { exerciseById } from '@/data/exercises'
import { workoutById } from '@/data/workouts'

interface RoutineStageProps {
  kind: 'warmup' | 'cooldown'
  workoutId: string
  completed: number[]
  onToggle: (index: number) => void
  onComplete: () => void
  onBack?: () => void
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function RoutineStage({ kind, workoutId, completed, onToggle, onComplete, onBack }: RoutineStageProps) {
  const [remaining, setRemaining] = useState(300)
  const [running, setRunning] = useState(false)
  const firstExercise = exerciseById[workoutById[workoutId].exercises[0].exerciseId]
  const isWarmup = kind === 'warmup'
  const steps = isWarmup ? [
    { title: 'Лёгкое кардио', text: '5 минут ходьбы на дорожке или спокойной работы на велотренажёре. Вы должны свободно говорить.' },
    { title: 'Плечи и руки', text: '8 мягких кругов плечами назад, затем 10 свободных махов руками перед корпусом.' },
    { title: 'Тазобедренные суставы', text: '8 плавных кругов каждой ногой. При необходимости придерживайтесь за опору.' },
    { title: 'Приседания без веса', text: '10 комфортных повторов. Без пружинящих движений и боли в коленях.' },
    { title: 'Мягкая активация корпуса', text: '5 спокойных наклонов в стороны и 5 вдохов с длинным выдохом. Не задерживайте дыхание.' },
    { title: `Подготовка: ${firstExercise.name}`, text: 'Один лёгкий подход на 8–10 повторов с весом заметно меньше рабочего. Этот подход не записываем.' },
  ] : [
    { title: 'Постепенно снизьте темп', text: '2–3 минуты спокойной ходьбы. Не останавливайтесь резко сразу после последнего подхода.' },
    { title: 'Восстановите дыхание', text: '5 медленных циклов: спокойный вдох и чуть более длинный выдох, без задержек.' },
    { title: 'Мягкая растяжка', text: 'По 15–20 секунд лёгкого растяжения ног и спины. Без пружинящих движений и боли.' },
    { title: 'Проверьте самочувствие', text: 'Оцените нагрузку на следующем экране. При необычной слабости, боли или головокружении остановитесь и обратитесь за помощью.' },
  ]

  useEffect(() => {
    if (!isWarmup || !running || remaining <= 0) return
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [isWarmup, running, remaining])

  return (
    <main className="routine-main">
      <section className="routine-heading">
        <span className="routine-icon">{isWarmup ? <HeartPulse size={28} /> : <Wind size={28} />}</span>
        <p>{isWarmup ? 'Перед тренировкой · 6–8 минут' : 'После тренировки · 3–5 минут'}</p>
        <h1>{isWarmup ? 'Сначала разминка.' : 'Спокойная заминка.'}</h1>
        <span>{isWarmup ? 'Постепенно подготовьте тело к нагрузке. Движения должны быть мягкими, без статической растяжки до усилия.' : 'Снизьте темп и дайте дыханию восстановиться. Не нужно доводить себя до предела и здесь.'}</span>
      </section>
      {isWarmup && <section className="cardio-timer" aria-label="Таймер лёгкого кардио">
        <div><span>Лёгкое кардио</span><strong aria-live="polite">{formatTime(remaining)}</strong><small>{remaining === 0 ? 'Готово. Переходите к подвижности.' : 'Темп, в котором легко говорить'}</small></div>
        <div className="cardio-actions">
          <button className="timer-main-button" onClick={() => remaining === 0 ? (setRemaining(300), setRunning(false)) : setRunning((value) => !value)}>{remaining === 0 ? <RotateCcw size={19} /> : running ? <Pause size={19} /> : <Play size={19} />}{remaining === 0 ? 'Заново' : running ? 'Пауза' : remaining < 300 ? 'Продолжить' : 'Начать'}</button>
          <button className="timer-done-button" onClick={() => onToggle(0)} aria-pressed={completed.includes(0)}><Check size={19} />{completed.includes(0) ? 'Выполнено' : 'Отметить'}</button>
        </div>
      </section>}
      <section className="routine-steps" aria-label={isWarmup ? 'Шаги разминки' : 'Шаги заминки'}>
        {steps.slice(isWarmup ? 1 : 0).map((step, offset) => {
          const index = isWarmup ? offset + 1 : offset
          const done = completed.includes(index)
          return <button key={step.title} className={done ? 'routine-step done' : 'routine-step'} onClick={() => onToggle(index)} aria-pressed={done}><span className="routine-step-number">{done ? <Check size={19} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.title}</strong><small>{step.text}</small></span></button>
        })}
      </section>
      <div className="routine-safety"><strong>Ориентир — самочувствие, не галочки.</strong><p>Острую боль, головокружение, онемение или боль в груди не перетерпите: прекратите занятие. Разминка не гарантирует защиту от травм.</p></div>
      <div className="routine-actions">
        {onBack && <button className="secondary-button" onClick={onBack}><ArrowLeft size={18} /> К подходам</button>}
        <button className="primary-inline" onClick={onComplete}>{isWarmup ? completed.length === steps.length ? 'Разминка готова' : 'Перейти к упражнениям' : 'Оценить тренировку'}<ArrowRight size={18} /></button>
      </div>
      {isWarmup && completed.length < steps.length && <p className="routine-skip-note">Можно продолжить без всех отметок. Если вы уже разогрелись, просто переходите дальше.</p>}
    </main>
  )
}
