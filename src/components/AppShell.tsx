import type { ReactNode } from 'react'
import { CalendarRange, Dumbbell, Home, NotebookTabs, Play } from 'lucide-react'
import type { AppView } from '@/types/fitness'

const navItems = [
  { id: 'today' as const, label: 'Сегодня', icon: Home },
  { id: 'program' as const, label: 'Программа', icon: CalendarRange },
  { id: 'diary' as const, label: 'Дневник', icon: NotebookTabs },
  { id: 'exercises' as const, label: 'Техника', icon: Dumbbell },
]

interface AppShellProps {
  view: AppView
  onViewChange: (view: AppView) => void
  children: ReactNode
  hasActiveWorkout: boolean
  onResumeWorkout: () => void
}

export function AppShell({ view, onViewChange, children, hasActiveWorkout, onResumeWorkout }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <button className="brand" onClick={() => onViewChange('today')} aria-label="СТАРТ — на главную"><span className="brand-mark" aria-hidden="true">С</span><span><strong>СТАРТ</strong><small>зал без паники</small></span></button>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'nav-item active' : 'nav-item'} onClick={() => onViewChange(id)} aria-current={view === id ? 'page' : undefined}><Icon size={20} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></button>)}
        </nav>
        <div className="sidebar-bottom">
          {hasActiveWorkout && <button className="resume-card" onClick={onResumeWorkout}><span className="resume-icon"><Play size={18} fill="currentColor" aria-hidden="true" /></span><span><strong>Тренировка идёт</strong><small>Вернуться к подходам</small></span></button>}
          <p>Ваши записи хранятся только на этом устройстве.</p>
        </div>
      </aside>
      <header className="mobile-header">
        <button className="brand compact" onClick={() => onViewChange('today')} aria-label="СТАРТ — на главную"><span className="brand-mark" aria-hidden="true">С</span><strong>СТАРТ</strong></button>
        {hasActiveWorkout && <button className="resume-mobile" onClick={onResumeWorkout}><Play size={16} fill="currentColor" /> Продолжить</button>}
      </header>
      <main className="main-content" id="main-content">{children}</main>
      <nav className="mobile-nav" aria-label="Основная навигация">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => onViewChange(id)} aria-current={view === id ? 'page' : undefined}><Icon size={21} strokeWidth={view === id ? 2.4 : 1.8} aria-hidden="true" /><span>{label}</span></button>)}
      </nav>
    </div>
  )
}
