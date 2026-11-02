import { lazy, Suspense, useEffect, useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { ExerciseDialog } from '@/components/ExerciseDialog'
import { workoutById } from '@/data/workouts'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getTargetReps } from '@/lib/fitness'
import { ExercisesPage } from '@/pages/ExercisesPage'
import { ProgramPage } from '@/pages/ProgramPage'
import { TodayPage } from '@/pages/TodayPage'
import { WorkoutPage } from '@/pages/WorkoutPage'
import type { ActiveSession, AppView, Exercise, SetLog, WorkoutLog } from '@/types/fitness'

const DiaryPage = lazy(() => import('@/pages/DiaryPage').then((module) => ({ default: module.DiaryPage })))

export default function App() {
  const [view, setView] = useState<AppView>('today')
  const [history, setHistory] = useLocalStorage<WorkoutLog[]>('start-gym-history-v1', [])
  const [activeSession, setActiveSession] = useLocalStorage<ActiveSession | null>('start-gym-active-v1', null)
  const [workoutOpen, setWorkoutOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function changeView(nextView: AppView) {
    setView(nextView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startWorkout(workoutId: string, week: number) {
    if (activeSession) {
      setWorkoutOpen(true)
      setToast('Возвращаем вас к текущей тренировке')
      return
    }
    const workout = workoutById[workoutId]
    const logs: Record<string, SetLog[]> = {}
    workout.exercises.forEach((item) => {
      logs[item.exerciseId] = Array.from({ length: week === 1 ? 2 : 3 }, () => ({ weight: 0, reps: getTargetReps(item.reps), done: false }))
    })
    setActiveSession({ workoutId, week, startedAt: new Date().toISOString(), currentExercise: 0, logs, stage: 'warmup', warmupSteps: [], cooldownSteps: [] })
    setWorkoutOpen(true)
    window.scrollTo({ top: 0 })
  }

  function finishWorkout(log: WorkoutLog) {
    setHistory([log, ...history])
    setActiveSession(null)
    setWorkoutOpen(false)
    setView('diary')
    setToast('Тренировка сохранена в дневнике')
    window.scrollTo({ top: 0 })
  }

  function resetData() {
    setHistory([])
    setActiveSession(null)
    setWorkoutOpen(false)
    setToast('Все записи удалены с этого устройства')
  }

  const sharedPageProps = { onShowExercise: setSelectedExercise }
  const page = view === 'today'
    ? <TodayPage history={history} onStart={startWorkout} onOpenDiary={() => changeView('diary')} {...sharedPageProps} />
    : view === 'program'
      ? <ProgramPage history={history} onStart={startWorkout} {...sharedPageProps} />
      : view === 'diary'
        ? <DiaryPage history={history} onStart={startWorkout} onReset={resetData} />
        : <ExercisesPage {...sharedPageProps} />

  return (
    <>
      {workoutOpen && activeSession ? (
        <WorkoutPage session={activeSession} history={history} onChange={setActiveSession} onFinish={finishWorkout} onExit={() => { setWorkoutOpen(false); setToast('Тренировка сохранена. Можно продолжить позже.') }} onShowExercise={setSelectedExercise} />
      ) : (
        <AppShell view={view} onViewChange={changeView} hasActiveWorkout={Boolean(activeSession)} onResumeWorkout={() => setWorkoutOpen(true)}><Suspense fallback={<div className="page-loading" role="status">Загружаем дневник…</div>}>{page}</Suspense></AppShell>
      )}
      <ExerciseDialog exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      {toast && <div className="app-toast" role="status">{toast}</div>}
    </>
  )
}
