import { useContext } from 'react'
import { FormContainer, TaskInput, MinutsAmountInput } from './styles'
import { CycleContext } from '../..'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CycleContext)

  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="">Vou trabalhar em</label>
      <TaskInput
        type="text"
        placeholder="De um nome para seu projeto"
        id="task"
        disabled={!!activeCycle}
        {...register('task')}
      />
      <label htmlFor="">Durante</label>
      <MinutsAmountInput
        type="number"
        placeholder="00"
        id="minutesAmount"
        min={5}
        max={60}
        step={5}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
