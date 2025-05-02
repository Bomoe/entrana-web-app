export function getSkillFromNumber(skillNum: number): string {
  return skillMap[skillNum] || ''
}

export function getSkillFromName(skillName: string): number | null {
  for (const [num, name] of Object.entries(skillMap)) {
    if (name.toLowerCase() === skillName.toLowerCase()) {
      return parseInt(num, 10)
    }
  }
  return null
}

const skillMap: Record<number, string> = {
  0: 'Overall',
  1: 'Attack',
  2: 'Defence',
  3: 'Strength',
  4: 'Hitpoints',
  5: 'Ranged',
  6: 'Prayer',
  7: 'Magic',
  8: 'Cooking',
  9: 'Woodcutting',
  10: 'Fletching',
  11: 'Fishing',
  12: 'Firemaking',
  13: 'Crafting',
  14: 'Smithing',
  15: 'Mining',
  16: 'Herblore',
  17: 'Agility',
  18: 'Thieving',
  19: 'Slayer',
  20: 'Farming',
  21: 'Runecraft',
  22: 'Hunter',
  23: 'Construction',
}
