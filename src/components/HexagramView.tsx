import type { Hexagram, YaoResult } from '@/lib/yijing'
import { fullName } from '@/lib/yijing'

interface HexagramViewProps {
  hexagram: Hexagram
  /** 自下而上的六爻（用于标动爻） */
  yaos: YaoResult[]
  title: string
}

/** 画一爻的卦画 */
function YaoBar({ yang, animate }: { yang: boolean; animate?: boolean }) {
  const cls = animate ? 'line-grow' : ''
  if (yang) {
    return <div className={`h-3.5 w-full rounded-sm bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 ${cls}`} />
  }
  return (
    <div className="flex w-full gap-4">
      <div className={`h-3.5 flex-1 rounded-sm bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 ${cls}`} />
      <div className={`h-3.5 flex-1 rounded-sm bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 ${cls}`} />
    </div>
  )
}

export default function HexagramView({ hexagram, yaos, title }: HexagramViewProps) {
  return (
    <div className="flex-1 rounded-2xl border border-amber-500/25 bg-white/[0.04] p-6 backdrop-blur-sm">
      <div className="mb-1 text-sm tracking-widest text-amber-500/70">{title}</div>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-4xl text-amber-300">{hexagram.symbol}</span>
        <span className="text-2xl font-bold text-amber-100">{fullName(hexagram)}</span>
        <span className="text-sm text-stone-400">第{hexagram.id}卦 · {hexagram.name}</span>
      </div>

      {/* 卦画：自上而下显示 */}
      <div className="mb-5 flex w-56 flex-col gap-2.5">
        {[5, 4, 3, 2, 1, 0].map((i) => {
          const yao = yaos[i]
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-full">
                <YaoBar yang={yao.yang} />
              </div>
              <span className="w-5 text-center text-lg font-bold text-red-400">
                {yao.moving ? (yao.yang ? '○' : '×') : ''}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mb-4 rounded-lg bg-amber-500/10 p-3 text-sm leading-relaxed text-amber-100/90">
        <span className="mr-2 font-bold text-amber-400">卦辞</span>
        {hexagram.scripture}
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1, 0].map((i) => {
          const line = hexagram.lines[i]
          const moving = yaos[i].moving
          return (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                moving
                  ? 'border border-red-500/40 bg-red-500/10 text-red-100'
                  : 'text-stone-300'
              }`}
            >
              <span className={`mr-2 font-bold ${moving ? 'text-red-300' : 'text-amber-400/80'}`}>
                {line.name}
                {moving ? '（动爻）' : ''}
              </span>
              {line.scripture}
            </div>
          )
        })}
      </div>
    </div>
  )
}
