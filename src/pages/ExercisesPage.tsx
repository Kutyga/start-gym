import { ArrowUpRight, Dumbbell, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { exercises } from '@/data/exercises'
import type { Exercise, MuscleGroup } from '@/types/fitness'

const filters: Array<'Все' | MuscleGroup> = ['Все', 'Ноги', 'Спина', 'Грудь', 'Плечи', 'Корпус', 'Ягодицы']

interface ExercisesPageProps {
  onShowExercise: (exercise: Exercise) => void
}

export function ExercisesPage({ onShowExercise }: ExercisesPageProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof filters)[number]>('Все')
  const filtered = useMemo(() => exercises.filter((exercise) => {
    const matchesFilter = filter === 'Все' || exercise.muscle === filter
    const text = `${exercise.name} ${exercise.secondary} ${exercise.equipment}`.toLowerCase()
    return matchesFilter && text.includes(query.trim().toLowerCase())
  }), [filter, query])

  return (
    <div className="page exercises-page">
      <header className="page-heading exercises-heading"><div><p className="date-label">Библиотека техники</p><h1>Сначала понять.<br />Затем выполнить.</h1></div><p>Короткие инструкции без сложной терминологии. Откройте упражнение перед подходом или заранее разберитесь в настройке.</p></header>
      <div className="exercise-tools">
        <label className="search-field"><Search size={20} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти упражнение" aria-label="Найти упражнение" />{query && <button onClick={() => setQuery('')} aria-label="Очистить поиск"><X size={18} /></button>}</label>
        <div className="filter-chips" aria-label="Фильтр по группе мышц">{filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div>
      </div>
      <p className="results-count">Найдено: {filtered.length}</p>
      {filtered.length > 0 ? <section className="exercise-grid" aria-label="Упражнения">{filtered.map((exercise, index) => <button className="exercise-card" key={exercise.id} onClick={() => onShowExercise(exercise)}><span className="exercise-index">{String(index + 1).padStart(2, '0')}</span><Dumbbell className="exercise-line-icon" size={30} strokeWidth={1.3} aria-hidden="true" /><div className="exercise-card-copy"><p>{exercise.muscle} · {exercise.equipment}</p><h2>{exercise.name}</h2><span>{exercise.secondary}</span></div><div className="exercise-card-bottom"><span>{exercise.level}</span><ArrowUpRight size={22} /></div></button>)}</section> : <div className="empty-state"><Search size={30} /><h2>Ничего не нашлось</h2><p>Попробуйте другое название или сбросьте фильтры.</p><button className="secondary-button" onClick={() => { setQuery(''); setFilter('Все') }}>Показать все упражнения</button></div>}
    </div>
  )
}
