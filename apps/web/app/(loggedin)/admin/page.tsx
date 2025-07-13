import { getSession } from '@/lib/auth/getSession'
import { redirect } from 'next/navigation'
import { ToolTabs } from './_components/ToolTabs'
import { db } from '@workspace/db/db'
import { activitiesTable, skillsTable } from '@workspace/db/schema'
import { Activity, Member, Permissions, Skill } from '@workspace/db/schemaTypes'
import { getAllSkills, getMembersData } from '@/app/actions/skills/actions'
import { getAllActivities } from '@/app/actions/activities/actions'
import { SkillsAndActivites } from './_components/ManageEvents/types'
import { getUserPermissions } from '@/app/actions/auth/actions'

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

  const userPermissions = await getUserPermissions({ userId: session.user.id })

  if (userPermissions.size === 0) {
    redirect('/dashboard')
  }

  let defaultData: SkillsAndActivites | Member[] | null = null
  if (defaultTab === 'events') {
    const skills = await getAllSkills()
    const activities = await getAllActivities()
    defaultData = { skills, activities }
  } else if (defaultTab === 'members') {
    const members = await getMembersData()
    defaultData = members
  }

  return (
    <div>
      <ToolTabs
        defaultTab={defaultTab}
        defaultData={defaultData}
        userPermissions={userPermissions}
      />
    </div>
  )
}
