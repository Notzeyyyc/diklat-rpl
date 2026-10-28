export const TOTAL_POS = 5

export const POSITIONS: { id: number; title: string }[] = [
  { id: 1, title: 'Algoritma & Logic' },
  { id: 2, title: 'Database System' },
  { id: 3, title: 'Networking' },
  { id: 4, title: 'Jaringan & Cloud' },
  { id: 5, title: 'Final Boss Challenge' },
]

export const isValidPos = (pos: number, total = TOTAL_POS) =>
  Number.isInteger(pos) && pos >= 1 && pos <= total

export const isValidTeamName = (name: string) =>
  name.length >= 3 && name.length <= 40 && /^[A-Za-z0-9 ]+$/.test(name)
