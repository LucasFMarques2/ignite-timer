import { HandPalm, Play } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { createContext, useState } from 'react'

import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './styles'
import { NewCycleForm } from './Components/NewCycleForm'
import { Countdown } from './Components/Countdonw'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5, 'ta puco').max(60, 'ta muito'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  marCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setPassedSeconds: (seconds: number) => void
}

export const CycleContext = createContext({} as CycleContextType)

export function Home() {
  const [clycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondPassed] = useState(0)

  const newCycleFrom = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleFrom

  const activeCycle = clycles.find((clycle) => clycle.id === activeCycleId)

  const task = watch('task')
  const isSubmitDisabled = !task

  function marCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function setPassedSeconds(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function handleCreateNewRegister(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newClycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newClycle])
    setActiveCycleId(newClycle.id)
    setAmountSecondPassed(0)
    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
    document.title = 'Ignite Timer'
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewRegister)}>
        <CycleContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            marCurrentCycleAsFinished,
            amountSecondsPassed,
            setPassedSeconds,
          }}
        >
          <FormProvider {...newCycleFrom}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CycleContext.Provider>

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Parar
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
