export type ActivityHiscore = Record<string, ActivityHiscoreItem>

export interface ActivityHiscoreItem {
  startingScore: number
  endingScore: number
}
