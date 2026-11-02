import { workouts } from '@/data/workouts'
import type { WorkoutLog } from '@/types/fitness'

export function formatToday(date = new Date()) {
  const value = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatLogDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

export function getCurrentWeek(history: WorkoutLog[]) {
  return Math.min(4, Math.floor(history.length / 3) + 1)
}

export function getNextWorkout(history: WorkoutLog[]) {
  return workouts[history.length % workouts.length]
}

export function getThisWeekCount(history: WorkoutLog[]) {
  const now = new Date()
  const monday = new Date(now)
  const day = now.getDay() || 7
  monday.setHours(0, 0, 0, 0)
  monday.setDate(now.getDate() - day + 1)
  return history.filter((log) => new Date(log.completedAt) >= monday).length
}

export function getPreviousSets(history: WorkoutLog[], exerciseId: string) {
  for (const log of history) {
    const exercise = log.exercises.find((item) => item.exerciseId === exerciseId)
    if (exercise && exercise.sets.some((set) => set.done)) return exercise.sets.filter((set) => set.done)
  }
  return []
}

export function getTargetReps(target: string) {
  return Number.parseInt(target, 10) || 10
}

export function plural(value: number, forms: [string, string, string]) {
  const mod100 = Math.abs(value) % 100
  const mod10 = mod100 % 10
  if (mod100 > 10 && mod100 < 20) return forms[2]
  if (mod10 > 1 && mod10 < 5) return forms[1]
  if (mod10 === 1) return forms[0]
  return forms[2]
}
