import rawHexagrams from '@/data/hexagrams.json'

export interface YaoLine {
  id: number
  type: number // 1 阳 0 阴
  name: string // 初九 / 六二 ...
  scripture: string
}

export interface Hexagram {
  id: number
  name: string
  symbol: string
  array: number[] // 自下而上，1 阳 0 阴
  combination: [string, string] // [下卦(内), 上卦(外)]
  scripture: string
  lines: YaoLine[]
}

export const HEXAGRAMS = rawHexagrams as Hexagram[]

/** 一次投掷：三枚硬币，true = 背面朝上（阳），false = 字面朝上（阴） */
export type Toss = [boolean, boolean, boolean]

export interface YaoResult {
  yang: boolean
  moving: boolean
  /** 少阳 / 少阴 / 老阳 / 老阴 */
  label: string
  /** 传统记数：6 老阴 7 少阳 8 少阴 9 老阳 */
  value: 6 | 7 | 8 | 9
}

/** 随机掷出三枚硬币 */
export function randomToss(): Toss {
  return [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5]
}

/** 三枚硬币的正背组合 -> 爻 */
export function evalToss(toss: Toss): YaoResult {
  const backs = toss.filter(Boolean).length // 背 = 阳
  switch (backs) {
    case 1:
      return { yang: true, moving: false, label: '少阳', value: 7 }
    case 2:
      return { yang: false, moving: false, label: '少阴', value: 8 }
    case 3:
      return { yang: true, moving: true, label: '老阳', value: 9 }
    default:
      return { yang: false, moving: true, label: '老阴', value: 6 }
  }
}

const byKey = new Map<string, Hexagram>(
  HEXAGRAMS.map((h) => [h.array.join(''), h]),
)

/** 自下而上的六爻 -> 本卦 */
export function findHexagram(yaos: YaoResult[]): Hexagram {
  const key = yaos.map((y) => (y.yang ? '1' : '0')).join('')
  const h = byKey.get(key)
  if (!h) throw new Error(`未找到卦象: ${key}`)
  return h
}

/** 动爻阴阳互变 -> 变卦的六爻 */
export function changeYaos(yaos: YaoResult[]): YaoResult[] {
  return yaos.map((y) =>
    y.moving
      ? { yang: !y.yang, moving: false, label: y.yang ? '少阴' : '少阳', value: y.yang ? 8 : 7 }
      : y,
  )
}

/** 八卦取象 */
const TRIGRAM_NATURE: Record<string, string> = {
  乾: '天',
  坤: '地',
  震: '雷',
  巽: '风',
  坎: '水',
  离: '火',
  艮: '山',
  兑: '泽',
}

/** 全称，如 地天泰 / 乾为天 */
export function fullName(h: Hexagram): string {
  const [lower, upper] = h.combination
  if (lower === upper) return `${h.name}为${TRIGRAM_NATURE[lower] ?? lower}`
  return `${TRIGRAM_NATURE[upper] ?? upper}${TRIGRAM_NATURE[lower] ?? lower}${h.name}`
}

/** 一次完整占卜的结果 */
export interface Divination {
  question: string
  tosses: Toss[]
  yaos: YaoResult[] // 自下而上
  ben: Hexagram
  bian: Hexagram | null
  bianYaos: YaoResult[] | null
  movingIndexes: number[] // 0-5，自下而上
}

export function divine(question: string): Divination {
  const tosses = Array.from({ length: 6 }, () => randomToss())
  const yaos = tosses.map(evalToss)
  const ben = findHexagram(yaos)
  const movingIndexes = yaos.map((y, i) => (y.moving ? i : -1)).filter((i) => i >= 0)
  const bianYaos = movingIndexes.length > 0 ? changeYaos(yaos) : null
  const bian = bianYaos ? findHexagram(bianYaos) : null
  return { question, tosses, yaos, ben, bian, bianYaos, movingIndexes }
}
