import { HandPalm, Play } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'

import {
  HomeContainer,
  FormContainer,
  CountDownContainer,
  Separator,
  StartCountDownButton,
  TaskInput,
  MinutsAmountInput,
  StopCountDownButton,
} from './styles'

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

export function Home() {
  const [clycles, setClylces] = useState<Cycle[]>([])
  const [activeCycedId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = clycles.find((clycle) => clycle.id === activeCycedId)
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          setClylces(
            clycles.map((cycle) => {
              if (cycle.id === activeCycedId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
        } else {
          setAmountSecondPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycedId, activeCycle, clycles, totalSeconds])

  const task = watch('task')
  const isSubmitDisabled = !task

  function handleCreateNewRegister(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newClycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setClylces((state) => [...state, newClycle])
    setActiveCycleId(newClycle.id)
    setAmountSecondPassed(0)
    reset()
  }

  function handleInterruptCycle() {
    setClylces(
      clycles.map((cycle) => {
        if (cycle.id === activeCycedId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
    document.title = 'Ignite Timer'
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutosAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutosAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `Time ${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewRegister)}>
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

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

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
