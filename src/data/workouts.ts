import type { Workout } from '@/types/fitness'

export const workouts: Workout[] = [
  {
    id: 'foundation-a', letter: 'A', title: 'Основа',
    description: 'Пять базовых движений в тренажёрах и с весом тела.', duration: 40, focus: 'Всё тело',
    exercises: [
      { exerciseId: 'Leg_Press', reps: '10–12', rest: 90, note: 'Начните с лёгкого веса и проверьте настройку спинки.' },
      { exerciseId: 'Leverage_Chest_Press', reps: '10–12', rest: 90, note: 'Плечи остаются ниже ушей, движение без рывка.' },
      { exerciseId: 'Wide-Grip_Lat_Pulldown', reps: '10–12', rest: 90, note: 'Тяните к верхней части груди, не за голову.' },
      { exerciseId: 'Seated_Cable_Rows', reps: '10–12', rest: 90, note: 'Корпус устойчив, локти движутся назад.' },
      { exerciseId: 'Plank', reps: '30 сек', rest: 60, unit: 'seconds', note: 'Можно выполнять с колен. Следите за дыханием.' },
    ],
  },
  {
    id: 'coordination-b', letter: 'B', title: 'Координация',
    description: 'Больше работы с гантелями и контроль положения корпуса.', duration: 45, focus: 'Всё тело',
    exercises: [
      { exerciseId: 'Goblet_Squat', reps: '8–10', rest: 90, note: 'Сначала освойте глубину с минимальным весом.' },
      { exerciseId: 'Romanian_Deadlift', reps: '10–12', rest: 90, note: 'Таз назад, гантели скользят близко к ногам.' },
      { exerciseId: 'Dumbbell_Shoulder_Press', reps: '10–12', rest: 90, note: 'Используйте скамью со спинкой и лёгкие гантели.' },
      { exerciseId: 'Close-Grip_Front_Lat_Pulldown', reps: '10–12', rest: 90, note: 'Не раскачивайтесь, тяните рукоять к груди.' },
      { exerciseId: 'Single_Leg_Glute_Bridge', reps: '12–15', rest: 60, note: 'Выполняйте на двух ногах, пауза секунда сверху.' },
    ],
  },
  {
    id: 'consistency-c', letter: 'C', title: 'Закрепление',
    description: 'Знакомые движения, чуть больше повторов и уверенности.', duration: 40, focus: 'Всё тело',
    exercises: [
      { exerciseId: 'Leg_Press', reps: '12–15', rest: 90, note: 'Сохраняйте ту же глубину, что и в первой тренировке.' },
      { exerciseId: 'Cable_Chest_Press', reps: '10–12', rest: 90, note: 'Выберите небольшой вес и устойчивую стойку.' },
      { exerciseId: 'Seated_Cable_Rows', reps: '12–15', rest: 90, note: 'Сведите лопатки до движения руками.' },
      { exerciseId: 'Dumbbell_Shoulder_Press', reps: '10–12', rest: 90, note: 'Не повышайте вес ценой прогиба в спине.' },
      { exerciseId: 'Plank', reps: '40 сек', rest: 60, unit: 'seconds', note: 'Завершите раньше, если поясница начинает провисать.' },
    ],
  },
]

export const workoutById = Object.fromEntries(workouts.map((workout) => [workout.id, workout])) as Record<string, Workout>

export const weekGuidance = [
  { week: 1, title: 'Знакомство', text: 'Два подхода на упражнение. Подберите вес, с которым техника остаётся спокойной.', target: '2 подхода' },
  { week: 2, title: 'Ритм', text: 'Добавьте третий подход. Повторяйте движения в том же комфортном диапазоне.', target: '3 подхода' },
  { week: 3, title: 'Немного больше', text: 'Если все подходы дались легко, добавьте 1–2 повтора или минимальный вес.', target: 'Контроль' },
  { week: 4, title: 'Закрепление', text: 'Сравните записи с первой неделей. Никаких максимальных весов и работы через боль.', target: 'Прогресс' },
]
