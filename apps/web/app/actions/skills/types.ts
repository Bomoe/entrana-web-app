export type SkillHiscore = Record<string, SkillHiscoreItem>

export interface SkillHiscoreItem {
  startingXp: number
  startingLevel: number
  endingXp: number
  endingLevel: number
}
