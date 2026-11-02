import { ArrowRight, Check, ChevronRight, Clock3, ShieldCheck, Sparkles } from 'lucide-react'
import { exerciseById } from '@/data/exercises'
import { workouts } from '@/data/workouts'
import { formatLogDate, formatToday, getCurrentWeek, getNextWorkout, getThisWeekCount } from '@/lib/fitness'
import type { Exercise, WorkoutLog } from '@/types/fitness'

interface TodayPageProps {
  history: WorkoutLog[]
  onStart: (workoutId: string, week: number) => void
  onShowExercise: (exercise: Exercise) => void
  onOpenDiary: () => void
}

export function TodayPage({ history, onStart, onShowExercise, onOpenDiary }: TodayPageProps) {
  const workout = getNextWorkout(history)
  const currentWeek = getCurrentWeek(history)
  const weekCount = getThisWeekCount(history)
  const lastWorkout = history[0]
  const featured = exerciseById.Leg_Press

  return (
    <div className="page today-page">
      <header className="page-heading today-heading"><div><p className="date-label">{formatToday()}</p><h1>{history.length === 0 ? 'Начните с малого.' : 'Продолжайте в своём темпе.'}</h1></div><span className="week-badge">Неделя {currentWeek} из 4</span></header>
      <section className="today-hero" aria-label="Следующая тренировка">
        <article className="next-workout-card">
          <div className="workout-card-top"><span className="workout-letter">{workout.letter}</span><span className="dark-meta"><Clock3 size={16} /> {workout.duration} мин · {workout.exercises.length} упражнений</span></div>
          <div className="next-workout-copy"><p>Следующая тренировка</p><h2>{workout.title}</h2><span>{workout.description}</span></div>
          <div className="workout-preview-list">{workout.exercises.slice(0, 3).map((item) => <span key={item.exerciseId}>{exerciseById[item.exerciseId].name}</span>)}<span>+ ещё {workout.exercises.length - 3}</span></div>
          <button className="primary-cta" onClick={() => onStart(workout.id, currentWeek)}>Начать тренировку <ArrowRight size={20} /></button>
          <p className="warmup-note">Перед стартом: 5 минут спокойной ходьбы и мягкая суставная разминка.</p>
        </article>
        <aside className="week-progress-card">
          <p className="section-label">Эта неделя</p><div className="week-count"><strong>{weekCount}</strong><span>/ 3 тренировки</span></div>
          <div className="week-bars" aria-label={`Выполнено ${weekCount} из 3 тренировок на этой неделе`}>{[0, 1, 2].map((index) => <span key={index} className={index < weekCount ? 'filled' : ''} />)}</div>
          <p className="week-message">{weekCount === 0 ? 'Одно занятие уже считается. Не нужно ждать понедельника.' : weekCount >= 3 ? 'Неделя закрыта. Теперь — отдых и восстановление.' : 'Хороший ритм. Между силовыми оставляйте день отдыха.'}</p>
          <div className="schedule-list">{workouts.map((item, index) => <div key={item.id}><span className={index < weekCount ? 'schedule-check done' : 'schedule-check'}>{index < weekCount ? <Check size={15} /> : item.letter}</span><span>{item.title}</span><small>{item.duration} мин</small></div>)}</div>
        </aside>
      </section>
      <section className="dashboard-lower">
        <div className="start-rules">
          <p className="section-label">Три правила новичка</p><h2>Сначала контроль.<br />Потом килограммы.</h2>
          <div className="rule-row"><span>01</span><div><strong>Оставьте запас</strong><p>Заканчивайте подход с ощущением, что могли бы сделать ещё 2–3 повтора.</p></div></div>
          <div className="rule-row"><span>02</span><div><strong>Боль — не ориентир</strong><p>Жжение в мышцах допустимо. Острая боль, головокружение или онемение — сигнал остановиться.</p></div></div>
          <div className="rule-row"><span>03</span><div><strong>Записывайте всё</strong><p>Вес и повторы подскажут, когда можно сделать следующий маленький шаг.</p></div></div>
        </div>
        <div className="today-side-stack">
          {lastWorkout ? <button className="last-workout" onClick={onOpenDiary}><span><Sparkles size={18} /> Последняя тренировка</span><strong>{lastWorkout.title}</strong><small>{formatLogDate(lastWorkout.completedAt)} · {lastWorkout.sets} подходов</small><ChevronRight size={20} /></button> : <div className="first-note"><ShieldCheck size={24} /><p><strong>Первая запись появится здесь.</strong><br />Можно завершить занятие досрочно — сохранятся все отмеченные подходы.</p></div>}
          <button className="featured-exercise" onClick={() => onShowExercise(featured)}><div className="featured-photo"><img src={featured.image} alt="Жим ногами в тренажёре" /></div><div><p className="section-label">Разбор техники</p><h3>{featured.name}</h3><span>3 шага и главная ошибка <ArrowRight size={17} /></span></div></button>
        </div>
      </section>
      <p className="medical-note">Если у вас есть травмы или хронические заболевания, согласуйте нагрузку с врачом. При острой боли или головокружении прекратите упражнение.</p>
    </div>
  )
}
