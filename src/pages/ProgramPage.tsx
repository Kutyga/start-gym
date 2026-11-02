import { ArrowRight, Check, Clock3, Info, Play } from 'lucide-react'
import { useState } from 'react'
import { exerciseById } from '@/data/exercises'
import { weekGuidance, workouts } from '@/data/workouts'
import { getCurrentWeek } from '@/lib/fitness'
import type { Exercise, WorkoutLog } from '@/types/fitness'

interface ProgramPageProps {
  history: WorkoutLog[]
  onStart: (workoutId: string, week: number) => void
  onShowExercise: (exercise: Exercise) => void
}

export function ProgramPage({ history, onStart, onShowExercise }: ProgramPageProps) {
  const [week, setWeek] = useState(getCurrentWeek(history))
  const guidance = weekGuidance[week - 1]

  return (
    <div className="page program-page">
      <header className="page-heading program-heading"><div><p className="date-label">План для первого месяца</p><h1>Четыре недели.<br />Один понятный маршрут.</h1></div><p>Три тренировки в неделю, между ними — день отдыха. Если неделя сорвалась, просто продолжите с того же места.</p></header>
      <div className="week-tabs" role="tablist" aria-label="Неделя программы">{weekGuidance.map((item) => <button key={item.week} role="tab" aria-selected={week === item.week} className={week === item.week ? 'active' : ''} onClick={() => setWeek(item.week)}><span>Неделя {item.week}</span><small>{item.title}</small></button>)}</div>
      <section className="week-guidance"><div><span>0{week}</span><h2>{guidance.title}</h2></div><p>{guidance.text}</p><strong>{week === 1 ? '2 подхода' : '3 подхода'}<small>на упражнение</small></strong></section>
      <section className="program-workouts" aria-label={`Тренировки для недели ${week}`}>
        {workouts.map((workout) => <article className="program-workout" key={workout.id}>
          <header><div className="program-letter">{workout.letter}</div><div><p>{workout.focus}</p><h2>{workout.title}</h2></div><span className="duration-chip"><Clock3 size={15} /> {workout.duration} мин</span></header>
          <p className="program-description">{workout.description}</p>
          <div className="program-exercises">{workout.exercises.map((item) => {
            const exercise = exerciseById[item.exerciseId]
            return <button key={item.exerciseId} onClick={() => onShowExercise(exercise)}><span><strong>{exercise.name}</strong><small>{week === 1 ? 2 : 3} × {item.reps}</small></span><Info size={18} aria-label="Открыть технику" /></button>
          })}</div>
          <button className="program-start" onClick={() => onStart(workout.id, week)}><Play size={18} fill="currentColor" /> Начать тренировку {workout.letter}<ArrowRight size={18} /></button>
        </article>)}
      </section>
      <div className="progression-note"><Check size={20} /><p><strong>Как понять, что можно добавить вес?</strong> Если вы выполнили все подходы с верхней границей повторов и спокойной техникой два занятия подряд, попробуйте минимальное увеличение. Иначе оставьте всё как есть.</p></div>
    </div>
  )
}
