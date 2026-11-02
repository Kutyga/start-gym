export type MuscleGroup = 'Ноги' | 'Спина' | 'Грудь' | 'Плечи' | 'Корпус' | 'Ягодицы'

export interface Exercise {
  id: string
  name: string
  muscle: MuscleGroup
  secondary: string
  equipment: string
  level: string
  image?: string
  intro: string
  steps: string[]
  cue: string
  mistake: string
}

export interface WorkoutExercise {
  exerciseId: string
  reps: string
  rest: number
  unit?: 'reps' | 'seconds'
  note: string
}

export interface Workout {
  id: string
  letter: string
  title: string
  description: string
  duration: number
  focus: string
  exercises: WorkoutExercise[]
}

export interface SetLog {
  weight: number
  reps: number
  done: boolean
}

export type WorkoutStage = 'warmup' | 'main' | 'cooldown'
export type Effort = 'easy' | 'normal' | 'hard'

export interface ActiveSession {
  workoutId: string
  week: number
  startedAt: string
  currentExercise: number
  logs: Record<string, SetLog[]>
  stage?: WorkoutStage
  warmupSteps?: number[]
  cooldownSteps?: number[]
}

export interface LoggedExercise {
  exerciseId: string
  name: string
  sets: SetLog[]
}

export interface WorkoutLog {
  id: string
  workoutId: string
  title: string
  week: number
  completedAt: string
  durationMinutes: number
  sets: number
  reps: number
  volume: number
  exercises: LoggedExercise[]
  effort?: Effort
  warmupCompleted?: boolean
  cooldownCompleted?: boolean
}

export type AppView = 'today' | 'program' | 'diary' | 'exercises'
