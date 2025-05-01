import { db } from '@workspace/db/db'
import {
  skillHiscoresTable,
  activityHiscoresTable,
  SkillJson,
  ActivityJson,
  hiscoresTable,
} from '@workspace/db/schema'
import {
  NewActivityHiscore,
  NewHiscore,
  NewSkillHiscore,
} from '@workspace/db/schemaTypes'
import axios from 'axios'

export async function GET(request: Request) {
  let allRSNs: string[] = []
  try {
    const res = await axios({
      method: 'get',
      url: 'https://api.wiseoldman.net/v2/groups/10494',
    })
    if (res && res?.data) {
      const data: Group = res.data
      allRSNs = data.memberships.map((member) => member.player.username)
    }
  } catch (e) {
    console.error(e)
    return
  }

  let allPlayerData: {
    rsn: string
    skills: {
      id: number
      name: string
      rank: number
      level: number
      xp: number
    }[]
    activities: { id: number; name: string; rank: number; score: number }[]
  }[] = []

  console.log('Starting to fetch player data...')

  for (const rsn of allRSNs) {
    try {
      const formattedRsn = rsn.trim().replace(' ', '_').toLowerCase()
      console.log(`Fetching data for player: ${formattedRsn}`)

      const res = await axios({
        method: 'get',
        url: `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=${formattedRsn}`,
      })

      if (
        res.data &&
        res.data?.skills?.length > 0 &&
        res.data?.activities?.length > 0
      ) {
        allPlayerData.push({ ...res.data, rsn })
        console.log(`Successfully added data for: ${rsn}`)
      } else {
        console.log(`Skipped ${rsn} - incomplete data`)
      }
    } catch (e) {
      console.error(`Error fetching data for ${rsn}:`, e)
    }
  }

  console.log(`Processed ${allPlayerData.length} players successfully`)

  try {
    const skillRecords = allPlayerData.flatMap((player) =>
      player.skills.map((skill) => ({
        rsn: player.rsn,
        skill_id: skill.id,
        name: skill.name,
        rank: skill.rank,
        level: skill.level,
        xp: skill.xp,
      }))
    )
    console.log(JSON.stringify(skillRecords, null, 2))

    console.log('Inserting skill records...')
    await db.insert(skillHiscoresTable).values(skillRecords)
    console.log(`Inserted ${skillRecords.length} skill records`)

    const activityRecords = allPlayerData.flatMap((player) =>
      player.activities.map((activity) => ({
        rsn: player.rsn,
        activity_id: activity.id,
        name: activity.name,
        rank: activity.rank,
        score: activity.score,
      }))
    )

    console.log('Inserting activity records...')
    await db.insert(activityHiscoresTable).values(activityRecords)
    console.log(`Inserted ${activityRecords.length} activity records`)

    console.log('Successfully inserted all records')
  } catch (e) {
    console.error('Database insertion error:', e)
  }

  try {
    const uploadArr: NewHiscore[] = []
    for (const player of allPlayerData) {
      const formattedSkills: SkillJson = {}
      const formattedActivities: ActivityJson = {}
      for (const skill of player.skills) {
        if (!formattedSkills[skill.id]) {
          formattedSkills[skill.id] = skill
        }
      }
      for (const activity of player.activities) {
        if (!formattedActivities[activity.id]) {
          formattedActivities[activity.id] = activity
        }
      }
      uploadArr.push({
        rsn: player.rsn,
        skills: formattedSkills,
        activities: formattedActivities,
      })
    }
    await db.insert(hiscoresTable).values(uploadArr)
  } catch (e) {
    console.error('Database insertion error:', e)
  }
  return new Response('OK')
}

interface Player {
  id: number
  username: string
  displayName: string
  type: string
  build: string
  country: string
  status: string
  patron: boolean
  exp: number
  ehp: number
  ehb: number
  ttm: number
  tt200m: number
  registeredAt: string
  updatedAt: string
  lastChangedAt: string
  lastImportedAt: string
}

interface Membership {
  playerId: number
  groupId: number
  role: 'administrator' | 'moderator' // Using literal types for roles
  createdAt: string
  updatedAt: string
  player: Player
}

interface Group {
  id: number
  name: string
  clanChat: string | null
  description: string
  homeworld: number | null
  verified: boolean
  patron: boolean
  profileImage: string | null
  bannerImage: string | null
  score: number
  createdAt: string
  updatedAt: string
  memberships: Membership[]
  memberCount: number
}
