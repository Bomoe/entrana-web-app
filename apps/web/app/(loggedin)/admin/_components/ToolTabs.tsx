'use client'

import { useState } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@workspace/ui/components/tabs'
import { ManageEvents } from './ManageEvents/ManageEvents'
import { ManageMembers } from './ManageMembers/ManageMembers'
import { getAllActivities } from '@/app/actions/activities/actions'
import { getAllSkills } from '@/app/actions/skills/actions'
import { SkillsAndActivites } from './ManageEvents/types'

export function ToolTabs({
  defaultTab,
  defaultData,
}: {
  defaultTab: string
  defaultData: SkillsAndActivites | null
}) {
  const [currentTab, setCurrentTab] = useState(defaultTab)
  const [eventsData, setEventsData] = useState<SkillsAndActivites>(
    defaultTab === 'events' &&
      defaultData?.skills &&
      defaultData?.skills?.length > 0
      ? defaultData
      : { skills: [], activities: [] }
  )

  async function getEventsData() {
    const skills = await getAllSkills()
    const activities = await getAllActivities()
    setEventsData({ skills, activities })
  }

  async function switchTabs(newTab: string) {
    const validTabs = ['events', 'members', 'announcements']
    if (validTabs.includes(newTab)) {
      if (newTab === 'events') {
        await getEventsData()
      }
      setCurrentTab(newTab)
    }
  }

  return (
    <div>
      <Tabs value={currentTab} onValueChange={switchTabs}>
        <TabsList>
          <TabsTrigger value="events">Manage Events</TabsTrigger>
          <TabsTrigger value="members">Manage Members</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <ManageEvents data={eventsData} />
        </TabsContent>
        <TabsContent value="members">
          <ManageMembers />
        </TabsContent>
      </Tabs>
    </div>
  )
}
