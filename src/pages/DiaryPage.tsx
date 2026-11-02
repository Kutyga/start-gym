import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, CalendarDays, Download, Dumbbell, RotateCcw, Trash2, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatLogDate, getCurrentWeek, getNextWorkout, plural } from '@/lib/fitness'
import type { Effort, WorkoutLog } from '@/types/fitness'

const effortLabels: Record<Effort, string> = { easy: 'Легко', normal: 'Нормально', hard: 'Тяжело' }

interface DiaryPageProps {
  history: WorkoutLog[]
  onStart: (workoutId: string, week: number) => void
  onReset: () => void
}

export function DiaryPage({ history, onStart, onReset }: DiaryPageProps) {
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const totalMinutes = history.reduce((sum, log) => sum + log.durationMinutes, 0)
  const totalSets = history.reduce((sum, log) => sum + log.sets, 0)
  const totalVolume = history.reduce((sum, log) => sum + log.volume, 0)
  const chartData = [...history].reverse().map((log) => ({ label: new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(log.completedAt)), volume: log.volume }))
  const nextWorkout = getNextWorkout(history)

  function exportData() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), workouts: history }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'start-training-diary.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page diary-page">
      <header className="page-heading diary-heading"><div><p className="date-label">Ваши записи</p><h1>Прогресс,<br />который видно.</h1></div><div className="diary-actions"><button className="secondary-button" onClick={exportData} disabled={history.length === 0}><Download size={18} /> Экспорт JSON</button><button className="icon-button danger" onClick={() => setResetOpen(true)} disabled={history.length === 0} aria-label="Удалить все записи"><Trash2 size={19} /></button></div></header>
      <section className="stats-strip" aria-label="Общая статистика"><div><strong>{history.length}</strong><span>{plural(history.length, ['тренировка', 'тренировки', 'тренировок'])}</span></div><div><strong>{totalSets}</strong><span>{plural(totalSets, ['подход', 'подхода', 'подходов'])}</span></div><div><strong>{totalMinutes}</strong><span>{plural(totalMinutes, ['минута в зале', 'минуты в зале', 'минут в зале'])}</span></div><div><strong>{Math.round(totalVolume).toLocaleString('ru-RU')}</strong><span>кг общего объёма</span></div></section>
      <section className="diary-main">
        <div className="volume-chart-panel"><div className="panel-heading"><div><p className="section-label">Динамика</p><h2>Объём тренировки</h2></div><span>кг</span></div>
          {history.length > 0 ? <div className="chart-wrap" aria-label="График объёма по тренировкам"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 16, right: 0, left: 0, bottom: 0 }}><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#65665f', fontSize: 12 }} /><YAxis hide domain={[0, 'auto']} /><Tooltip cursor={{ fill: '#efefe9' }} contentStyle={{ border: '1px solid #1d1e1b', borderRadius: 12, boxShadow: 'none' }} formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} кг`, 'Объём']} /><Bar dataKey="volume" fill="#1d1e1b" radius={[6, 6, 0, 0]} maxBarSize={52} /></BarChart></ResponsiveContainer></div> : <div className="chart-empty"><div className="empty-bars" aria-hidden="true"><span /><span /><span /><span /></div><h3>Здесь появится первая отметка</h3><p>Завершите тренировку, и мы посчитаем объём отмеченных подходов.</p><button className="primary-inline" onClick={() => onStart(nextWorkout.id, getCurrentWeek(history))}>Перейти к тренировке <ArrowRight size={18} /></button></div>}
        </div>
        <aside className="diary-explainer"><Dumbbell size={25} /><h3>Что считается объёмом?</h3><p>Вес × повторы × подходы. Это ориентир для сравнения похожих тренировок, а не цель любой ценой.</p><span>Техника важнее цифры на графике.</span></aside>
      </section>
      <section className="history-section"><div className="panel-heading"><div><p className="section-label">Архив</p><h2>История тренировок</h2></div><CalendarDays size={23} /></div>
        {history.length > 0 ? <div className="history-list">{history.map((log) => <button key={log.id} className="history-row" onClick={() => setSelectedLog(log)}><span className="history-letter">{log.workoutId.split('-').pop()?.toUpperCase()}</span><span className="history-title"><strong>{log.title}</strong><small>{formatLogDate(log.completedAt)} · неделя {log.week}{log.effort ? ` · ${effortLabels[log.effort]}` : ''}</small></span><span className="history-stat"><strong>{log.sets}</strong><small>{plural(log.sets, ['подход', 'подхода', 'подходов'])}</small></span><span className="history-stat volume"><strong>{log.volume.toLocaleString('ru-RU')}</strong><small>кг</small></span><ArrowRight size={20} /></button>)}</div> : <div className="history-empty"><p>После первого занятия здесь появятся упражнения, веса и повторы.</p></div>}
      </section>
      <Dialog open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}><DialogContent className="log-dialog" showCloseButton={false}><DialogClose className="dialog-close" aria-label="Закрыть запись"><X size={20} /></DialogClose>{selectedLog && <><DialogHeader><p className="date-label">{formatLogDate(selectedLog.completedAt)}</p><DialogTitle>{selectedLog.title}</DialogTitle><DialogDescription>{selectedLog.durationMinutes} мин · {selectedLog.sets} подходов · {selectedLog.volume.toLocaleString('ru-RU')} кг</DialogDescription></DialogHeader>{selectedLog.effort && <span className="log-effort">Нагрузка: {effortLabels[selectedLog.effort]}{selectedLog.warmupCompleted ? ' · разминка выполнена' : ''}</span>}<div className="log-exercise-list">{selectedLog.exercises.map((exercise) => <div key={exercise.exerciseId}><strong>{exercise.name}</strong><p>{exercise.sets.map((set, index) => <span key={index}>{set.weight} кг × {set.reps}</span>)}</p></div>)}</div></>}</DialogContent></Dialog>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}><DialogContent className="confirm-dialog" showCloseButton={false}><DialogHeader><div className="confirm-icon"><RotateCcw size={23} /></div><DialogTitle>Удалить все записи?</DialogTitle><DialogDescription>История, статистика и незавершённая тренировка будут удалены с этого устройства. Отменить действие нельзя.</DialogDescription></DialogHeader><DialogFooter><button className="secondary-button" onClick={() => setResetOpen(false)}>Отмена</button><button className="danger-button" onClick={() => { onReset(); setResetOpen(false) }}>Удалить данные</button></DialogFooter></DialogContent></Dialog>
    </div>
  )
}
