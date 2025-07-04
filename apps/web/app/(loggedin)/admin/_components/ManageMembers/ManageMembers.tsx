'use client'

import { EventType } from '@workspace/db/schema'
import { ClanRanks, Member } from '@workspace/db/schemaTypes'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import Image from 'next/image'
import { useState } from 'react'

export function ManageMembers({ data }: ManageMembersProps) {
  const [members, setMembers] = useState<Member[]>(data)

  function rankNameFormatter(name: string) {
    return name
      .split(' ')
      .map((word, index) => {
        if (index === 0 || word !== 'Owner') {
          return word
        }
        return word.toLowerCase()
      })
      .join('_')
  }

  return (
    <div>
      <p>Manage Members</p>
      <div className="flex flex-col gap-y-2">
        {members?.map((member) => (
          <div key={member.id} className="flex flex-row gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary/60">
                  <Image
                    unoptimized
                    width={24}
                    height={24}
                    alt={member.rank}
                    src={`https://oldschool.runescape.wiki/images/Clan_icon_-_${rankNameFormatter(member.rank)}.png`}
                    title={member.rank}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Ranks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(ClanRanks).map((rank) => (
                  <DropdownMenuItem
                    onClick={() =>
                      setMembers((prev) => {
                        const newMembers = [...prev]
                        const editedMemberIndex = prev.findIndex(
                          (data) => data.id === member.id
                        )
                        newMembers[editedMemberIndex] = {
                          ...prev[editedMemberIndex]!,
                          rank: rank,
                        }
                        return newMembers
                      })
                    }
                  >
                    <Image
                      unoptimized
                      width={24}
                      height={24}
                      alt={rank}
                      src={`https://oldschool.runescape.wiki/images/Clan_icon_-_${rankNameFormatter(rank)}.png`}
                      title={rank}
                    />
                    <p>{rank}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p>{member.rsn} </p>
          </div>
        ))}
      </div>
    </div>
  )
}

type ManageMembersProps = {
  data: Member[]
}
