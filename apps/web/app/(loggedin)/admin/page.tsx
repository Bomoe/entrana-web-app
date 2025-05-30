import { getSession } from '@/lib/auth/getSession'
import { redirect } from 'next/navigation'
import { ToolTabs } from './_components/ToolTabs'
import { db } from '@workspace/db/db'
import { activitiesTable, skillsTable } from '@workspace/db/schema'
import { Activity, Skill } from '@workspace/db/schemaTypes'
import { getAllSkills } from '@/app/actions/skills/actions'
import { getAllActivities } from '@/app/actions/activities/actions'
import { SkillsAndActivites } from './_components/ManageEvents/types'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  const { tab } = await searchParams
  const defaultTab = tab || 'events'
  let defaultData: SkillsAndActivites | null = null
  if (defaultTab === 'events') {
    const skills = await getAllSkills()
    const activities = await getAllActivities()
    defaultData = { skills, activities }
  }

  return (
    <div>
      <ToolTabs defaultTab={defaultTab} defaultData={defaultData} />
    </div>
  )
}
