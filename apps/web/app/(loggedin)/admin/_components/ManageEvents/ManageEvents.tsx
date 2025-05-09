'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { EventType } from '@workspace/db/schema'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { DatePickerWithRange } from '@workspace/ui/components/date-range-picker'
import { addDays } from 'date-fns'
import { eventCreationFormSchema } from '@/app/actions/admin/types'
import { createEvent } from '@/app/actions/admin/actions'
import { useState } from 'react'
import { toast } from '@workspace/ui/components/toast'
import { Loader2 } from 'lucide-react'
import { SkillsAndActivites } from './types'
import { Activity, Skill } from '@workspace/db/schemaTypes'

export function ManageEvents({ data }: { data: SkillsAndActivites }) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEventType, setSelectedEventType] = useState<EventType>(
    EventType.Skill
  )

  const form = useForm<z.infer<typeof eventCreationFormSchema>>({
    resolver: zodResolver(eventCreationFormSchema),
    defaultValues: {
      eventName: '',
      eventDescription: '',
      eventType: EventType.Skill,
      eventDateRange: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      typeId: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof eventCreationFormSchema>) {
    setIsLoading(true)
    const isValidated = eventCreationFormSchema.safeParse(values).success
    if (isValidated) {
      setError('')
      const res = await createEvent({ eventData: values })
      if (!res.success) {
        setError(res.message)
      }
    } else {
      toast.success('Event created!', {
        style: {
          backgroundColor: 'limegreen',
          color: 'white',
          fontWeight: 600,
        },
      })
      form.reset()
    }
    setIsLoading(false)
  }

  function eventTypeDisplayText(eventType: EventType) {
    switch (eventType) {
      case EventType.Skill:
        return 'Skill'
      case EventType.Activity:
        return 'Minigame/Boss'
      case EventType.Bingo:
        return 'Bingo Board'
      case EventType.ItemRace:
        return 'Item Race'
    }
  }

  function eventSkillDisplayText(skillId: number) {
    const skill = data.skills.find((skill) => skill.skillId === skillId)
    return skill?.name ?? 'Overall'
  }

  function eventActivityDisplayText(activityId: number) {
    const activity = data.activities.find(
      (activity) => activity.activityId === activityId
    )
    return activity?.name ?? 'Overall'
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <p className="text-xl font-semibold">Manage Events</p>
      </div>
      <Card className="p-6">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="SOTW"
                      className="placeholder:italic"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Skill of the Week"
                      className="placeholder:italic"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-x-2">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="capitalize" disabled={isLoading}>
                              {eventTypeDisplayText(field.value)}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                field.onChange(EventType.Skill)
                                form.setValue('typeId', 0)
                                setSelectedEventType(EventType.Skill)
                              }}
                            >
                              Skill
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                field.onChange(EventType.Activity)
                                form.setValue('typeId', 0)
                                setSelectedEventType(EventType.Activity)
                              }}
                            >
                              Minigame/Boss
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                field.onChange(EventType.ItemRace)
                                setSelectedEventType(EventType.ItemRace)
                              }}
                            >
                              Item Race
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                field.onChange(EventType.Bingo)
                                setSelectedEventType(EventType.Bingo)
                              }}
                            >
                              Bingo Board
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedEventType === EventType.Skill ||
              selectedEventType === EventType.Activity ? (
                <FormField
                  key={selectedEventType}
                  control={form.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-start">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="capitalize"
                                disabled={isLoading}
                              >
                                {selectedEventType === EventType.Skill
                                  ? eventSkillDisplayText(field?.value ?? 0)
                                  : eventActivityDisplayText(field?.value ?? 0)}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Event Types</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <CustomDropdownItems
                                dataArr={
                                  selectedEventType === EventType.Skill
                                    ? data.skills
                                    : data.activities
                                }
                                onChange={(id) => field.onChange(id)}
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>
            <FormField
              control={form.control}
              name="eventDateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date Range</FormLabel>
                  <FormControl>
                    <DatePickerWithRange
                      {...field}
                      isDisabled={isLoading}
                      defaultDateRange={field.value}
                      onChange={field.onChange}
                      includeTime={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="animate-spin" />}
              Save Event
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

// TODO: improve this horrible custom component...
const CustomDropdownItems = ({
  dataArr,
  onChange,
}: {
  dataArr: Skill[] | Activity[]
  onChange: (id: number) => void
}) => {
  if (!dataArr || dataArr.length === 0) {
    return null
  }

  function isSkill(item: any): item is Skill {
    return 'skillId' in item
  }

  return dataArr.map((data) => {
    let idToUse: number

    if (isSkill(data)) {
      idToUse = data.skillId
    } else {
      idToUse = data.activityId
    }

    return (
      <DropdownMenuItem key={idToUse} onClick={() => onChange(idToUse)}>
        {data.name}
      </DropdownMenuItem>
    )
  })
}
