'use server'

// WiseOldMan API Types
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
  role: string // "administrator", "moderator", etc.
  createdAt: string
  updatedAt: string
  player: Player
}

interface Group {
  id: number
  name: string
  clanChat?: string
  description: string
  homeworld?: number
  verified: boolean
  patron: boolean
  profileImage?: string
  bannerImage?: string
  score: number
  createdAt: string
  updatedAt: string
  memberships: Membership[]
  memberCount: number
}

export type MemberData = {
  displayName: string
  role: string
}

export async function getMemberDataForCSV(): Promise<MemberData[]> {
  try {
    const response = await fetch('https://api.wiseoldman.net/v2/groups/10494', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`WiseOldMan API returned status ${response.status}`)
    }

    const group: Group = await response.json()

    return group.memberships.map((membership) => ({
      displayName: membership.player.displayName,
      role: membership.role,
    }))
  } catch (error) {
    console.error('Error fetching member data for CSV:', error)
    throw new Error(
      `Failed to fetch member data: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
