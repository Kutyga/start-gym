import { AlertTriangle, Check, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Exercise } from '@/types/fitness'

interface ExerciseDialogProps {
  exercise: Exercise | null
  onClose: () => void
}

export function ExerciseDialog({ exercise, onClose }: ExerciseDialogProps) {
  return (
    <Dialog open={Boolean(exercise)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="exercise-dialog" showCloseButton={false}>
        {exercise && <>
          <DialogClose className="dialog-close" aria-label="Закрыть описание упражнения"><X size={20} /></DialogClose>
          {exercise.image && <div className="exercise-photo-wrap"><img src={exercise.image} alt={`Положение при выполнении: ${exercise.name}`} className="exercise-photo" /></div>}
          <div className="exercise-dialog-body">
            <DialogHeader className="text-left"><div className="meta-line"><span>{exercise.muscle}</span><span>{exercise.equipment}</span></div><DialogTitle className="exercise-dialog-title">{exercise.name}</DialogTitle><DialogDescription className="exercise-intro">{exercise.intro}</DialogDescription></DialogHeader>
            <div className="technique-grid">
              <section><h3>Как выполнять</h3><ol className="steps-list">{exercise.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></section>
              <aside className="technique-notes"><div className="cue-note"><Check size={20} aria-hidden="true" /><div><strong>Ориентир</strong><p>{exercise.cue}</p></div></div><div className="mistake-note"><AlertTriangle size={20} aria-hidden="true" /><div><strong>Не спешите</strong><p>{exercise.mistake}</p></div></div></aside>
            </div>
          </div>
        </>}
      </DialogContent>
    </Dialog>
  )
}
