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
import { getAllSkills, getMembersData } from '@/app/actions/skills/actions'
import { SkillsAndActivites } from './ManageEvents/types'
import { Member, Permissions } from '@workspace/db/schemaTypes'

export function ToolTabs({
  defaultTab,
  defaultData,
  userPermissions,
}: {
  defaultTab: string
  defaultData: SkillsAndActivites | Member[] | null
  userPermissions: Set<Permissions>
}) {
  const [currentTab, setCurrentTab] = useState(defaultTab)
  const [eventsData, setEventsData] = useState<SkillsAndActivites>(
    defaultTab === 'events' &&
      defaultData &&
      'skills' in defaultData &&
      defaultData?.skills?.length > 0
      ? defaultData
      : { skills: [], activities: [] }
  )
  const [membersData, setMembersData] = useState<Member[]>(
    defaultTab === 'members' ? (defaultData as Member[]) : []
  )

  async function getEventsData() {
    const skills = await getAllSkills()
    const activities = await getAllActivities()
    setEventsData({ skills, activities })
  }

  async function fetchMembersData() {
    const members = await getMembersData()
    setMembersData(members)
  }

  async function switchTabs(newTab: string) {
    const validTabs = ['events', 'members', 'announcements']
    if (validTabs.includes(newTab)) {
      switch (newTab) {
        case 'events':
          await getEventsData()
          break
        case 'members':
          await fetchMembersData()
          break
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
          <ManageMembers data={membersData} userPermisisons={userPermissions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
