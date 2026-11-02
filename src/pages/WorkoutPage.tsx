import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, CircleHelp, Dumbbell, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RestTimer } from '@/components/RestTimer'
import { RoutineStage } from '@/components/RoutineStage'
import { exerciseById } from '@/data/exercises'
import { workoutById } from '@/data/workouts'
import { getPreviousSets, plural } from '@/lib/fitness'
import type { ActiveSession, Effort, Exercise, SetLog, WorkoutLog } from '@/types/fitness'

interface WorkoutPageProps {
  session: ActiveSession
  history: WorkoutLog[]
  onChange: (session: ActiveSession) => void
  onFinish: (log: WorkoutLog) => void
  onExit: () => void
  onShowExercise: (exercise: Exercise) => void
}

function buildWorkoutLog(session: ActiveSession, doneSets: number, doneReps: number, volume: number, effort: Effort): WorkoutLog {
  const workout = workoutById[session.workoutId]
  const loggedExercises = workout.exercises.map((item) => ({ exerciseId: item.exerciseId, name: exerciseById[item.exerciseId].name, sets: (session.logs[item.exerciseId] || []).filter((set) => set.done) })).filter((item) => item.sets.length > 0)
  const now = Date.now()
  return {
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(now),
    workoutId: workout.id, title: `${workout.letter} · ${workout.title}`, week: session.week,
    completedAt: new Date(now).toISOString(), durationMinutes: Math.max(1, Math.round((now - new Date(session.startedAt).getTime()) / 60000)),
    sets: doneSets, reps: doneReps, volume, exercises: loggedExercises, effort,
    warmupCompleted: (session.warmupSteps || []).length === 6, cooldownCompleted: (session.cooldownSteps || []).length === 4,
  }
}

export function WorkoutPage({ session, history, onChange, onFinish, onExit, onShowExercise }: WorkoutPageProps) {
  const workout = workoutById[session.workoutId]
  const currentIndex = Math.min(session.currentExercise, workout.exercises.length - 1)
  const currentItem = workout.exercises[currentIndex]
  const exercise = exerciseById[currentItem.exerciseId]
  const currentSets = session.logs[exercise.id] || []
  const stage = session.stage || 'main'
  const [timer, setTimer] = useState({ open: false, key: 0 })
  const [finishOpen, setFinishOpen] = useState(false)
  const [effort, setEffort] = useState<Effort>('normal')

  const allSets = useMemo(() => Object.values(session.logs).flat(), [session.logs])
  const doneSets = allSets.filter((set) => set.done).length
  const doneReps = allSets.filter((set) => set.done).reduce((sum, set) => sum + set.reps, 0)
  const volume = allSets.filter((set) => set.done).reduce((sum, set) => sum + set.weight * set.reps, 0)
  const progress = allSets.length ? (doneSets / allSets.length) * 100 : 0
  const previousSets = getPreviousSets(history, exercise.id)

  function updateSet(setIndex: number, patch: Partial<SetLog>) {
    const nextSets = currentSets.map((set, index) => index === setIndex ? { ...set, ...patch } : set)
    onChange({ ...session, currentExercise: currentIndex, logs: { ...session.logs, [exercise.id]: nextSets } })
  }
  function toggleSet(setIndex: number) {
    const willBeDone = !currentSets[setIndex].done
    updateSet(setIndex, { done: willBeDone })
    if (willBeDone) setTimer({ open: true, key: Date.now() })
  }
  function goToExercise(index: number) {
    onChange({ ...session, currentExercise: index })
    setTimer((value) => ({ ...value, open: false }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function toggleRoutineStep(index: number) {
    const key = stage === 'warmup' ? 'warmupSteps' : 'cooldownSteps'
    const completed = session[key] || []
    onChange({ ...session, [key]: completed.includes(index) ? completed.filter((item) => item !== index) : [...completed, index] })
  }
  function finishWorkout() {
    onFinish(buildWorkoutLog(session, doneSets, doneReps, volume, effort))
  }

  const stageLabel = stage === 'warmup' ? 'Разминка' : stage === 'cooldown' ? 'Заминка' : `Тренировка ${workout.letter}`
  const header = <><header className="workout-header"><button className="workout-exit" onClick={onExit}><X size={20} /><span>Сохранить и выйти</span></button><div className="workout-header-title"><span>{stageLabel}</span><strong>{workout.title}</strong></div><span className="workout-week">Неделя {session.week}</span></header><div className="workout-progress" aria-label={`Выполнено ${doneSets} из ${allSets.length} подходов`}><span style={{ width: `${stage === 'warmup' ? 0 : progress}%` }} /></div></>

  if (stage !== 'main') {
    return <div className="workout-page">{header}<RoutineStage kind={stage} workoutId={session.workoutId} completed={stage === 'warmup' ? session.warmupSteps || [] : session.cooldownSteps || []} onToggle={toggleRoutineStep} onBack={stage === 'cooldown' ? () => onChange({ ...session, stage: 'main' }) : undefined} onComplete={() => {
      if (stage === 'warmup') { onChange({ ...session, stage: 'main' }); window.scrollTo({ top: 0 }) } else { setFinishOpen(true) }
    }} /><Dialog open={finishOpen} onOpenChange={setFinishOpen}><DialogContent className="finish-dialog" showCloseButton={false}><DialogHeader><span className="finish-mark"><Check size={30} /></span><DialogTitle>Как прошла тренировка?</DialogTitle><DialogDescription>{doneSets < allSets.length ? `Выполнено ${doneSets} из ${allSets.length} подходов. Неотмеченные подходы не попадут в дневник — это нормально.` : 'Все подходы отмечены. Оценка поможет выбирать нагрузку в следующий раз.'}</DialogDescription></DialogHeader><div className="effort-picker" role="group" aria-label="Оценка нагрузки">{([['easy', 'Легко'], ['normal', 'Нормально'], ['hard', 'Тяжело']] as const).map(([value, label]) => <button key={value} className={effort === value ? 'selected' : ''} onClick={() => setEffort(value)} aria-pressed={effort === value}>{label}</button>)}</div><p className="effort-hint">{effort === 'easy' ? 'Сохраните технику. В следующий раз можно немного увеличить вес или повторы.' : effort === 'hard' ? 'На следующем занятии повторите вес или немного снизьте его. Не наращивайте нагрузку через усталость.' : 'Хороший рабочий уровень: оставался запас примерно в 2–3 повтора.'}</p><div className="finish-stats"><div><strong>{doneSets}</strong><span>{plural(doneSets, ['подход', 'подхода', 'подходов'])}</span></div><div><strong>{doneReps}</strong><span>{plural(doneReps, ['повтор', 'повтора', 'повторов'])}</span></div><div><strong>{volume.toLocaleString('ru-RU')}</strong><span>кг объёма</span></div></div><DialogFooter><button className="secondary-button" onClick={() => setFinishOpen(false)}><ArrowLeft size={18} /> К заминке</button><button className="primary-inline" onClick={finishWorkout}>Сохранить результат <ArrowRight size={18} /></button></DialogFooter></DialogContent></Dialog></div>
  }

  return (
    <div className="workout-page">
      {header}
      <main className="workout-main">
        <nav className="exercise-stepper" aria-label="Упражнения тренировки">{workout.exercises.map((item, index) => {
          const isDone = (session.logs[item.exerciseId] || []).every((set) => set.done)
          return <button key={item.exerciseId} className={`${index === currentIndex ? 'current' : ''} ${isDone ? 'done' : ''}`} onClick={() => goToExercise(index)} aria-label={`${index + 1}. ${exerciseById[item.exerciseId].name}${isDone ? ', выполнено' : ''}`} aria-current={index === currentIndex ? 'step' : undefined}><span>{isDone ? <Check size={18} /> : index + 1}</span><small>{exerciseById[item.exerciseId].muscle}</small></button>
        })}</nav>
        <section className="active-exercise">
          <div className="active-exercise-heading"><div><p>Упражнение {currentIndex + 1} из {workout.exercises.length} · {exercise.equipment}</p><h1>{exercise.name}</h1><span>{exercise.secondary}</span></div><button className="technique-button" onClick={() => onShowExercise(exercise)}><CircleHelp size={19} /> Техника</button></div>
          <div className="target-strip"><div><span>Ваша цель</span><strong>{currentSets.length} × {currentItem.reps}</strong></div><p>{currentItem.note}</p><div><span>Отдых</span><strong>{currentItem.rest} сек</strong></div></div>
          {previousSets.length > 0 && <div className="previous-result"><span>В прошлый раз</span><p>{previousSets.map((set, index) => <strong key={index}>{set.weight} кг × {set.reps}</strong>)}</p></div>}
          <section className="sets-panel" aria-label={`Подходы: ${exercise.name}`}>
            <div className="sets-header"><span>Подход</span><span>Вес, кг</span><span>{currentItem.unit === 'seconds' ? 'Секунды' : 'Повторы'}</span><span>Готово</span></div>
            {currentSets.map((set, index) => <div className={set.done ? 'set-row done' : 'set-row'} key={index}><span className="set-number">{index + 1}</span><label><span className="mobile-field-label">Вес, кг</span><input type="number" min="0" step="0.5" inputMode="decimal" value={set.weight} onChange={(event) => updateSet(index, { weight: Math.max(0, Number(event.target.value)) })} aria-label={`Вес в подходе ${index + 1}, килограммы`} /></label><label><span className="mobile-field-label">{currentItem.unit === 'seconds' ? 'Секунды' : 'Повторы'}</span><input type="number" min="1" step="1" inputMode="numeric" value={set.reps} onChange={(event) => updateSet(index, { reps: Math.max(0, Number(event.target.value)) })} aria-label={`${currentItem.unit === 'seconds' ? 'Секунды' : 'Повторы'} в подходе ${index + 1}`} /></label><button className="set-check" onClick={() => toggleSet(index)} disabled={set.reps < 1} aria-pressed={set.done} aria-label={set.done ? `Отменить отметку подхода ${index + 1}` : `Завершить подход ${index + 1}`}><Check size={22} /></button></div>)}
          </section>
          <p className="set-hint"><Dumbbell size={17} /> Отметьте подход — включится таймер отдыха. Записи сохраняются автоматически.</p>
        </section>
      </main>
      <footer className="workout-footer"><button className="workout-prev" onClick={() => goToExercise(currentIndex - 1)} disabled={currentIndex === 0}><ChevronLeft size={20} /><span>Назад</span></button><div><strong>{doneSets} / {allSets.length}</strong><span>подходов</span></div>{currentIndex < workout.exercises.length - 1 ? <button className="workout-next" onClick={() => goToExercise(currentIndex + 1)}><span>Следующее</span><ChevronRight size={20} /></button> : <button className="workout-next" onClick={() => { onChange({ ...session, stage: 'cooldown' }); window.scrollTo({ top: 0 }) }} disabled={doneSets === 0}><span>К заминке</span><Check size={20} /></button>}</footer>
      <RestTimer key={timer.key} open={timer.open} initialSeconds={currentItem.rest} onClose={() => setTimer((value) => ({ ...value, open: false }))} />
    </div>
  )
}
