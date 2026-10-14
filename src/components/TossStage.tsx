import { useEffect, useRef, useState } from 'react'
import type { Toss, YaoResult } from '@/lib/yijing'
import Coin from '@/components/Coin'

interface TossStageProps {
  tosses: Toss[]
  yaos: YaoResult[]
  onDone: () => void
}

const SHAKE_MS = 1100
const SHOW_MS = 1100

export default function TossStage({ tosses, yaos, onDone }: TossStageProps) {
  const [round, setRound] = useState(0)
  const [landed, setLanded] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  // 每一轮：先摇币，后落定
  useEffect(() => {
    const t = window.setTimeout(() => setLanded(true), SHAKE_MS)
    return () => window.clearTimeout(t)
  }, [round])

  // 落定展示后进入下一轮，或结束
  useEffect(() => {
    if (!landed) return
    const t = window.setTimeout(
      () => {
        if (round >= 5) {
          onDoneRef.current()
        } else {
          setLanded(false)
          setRound((r) => r + 1)
        }
      },
      round >= 5 ? SHOW_MS + 600 : SHOW_MS,
    )
    return () => window.clearTimeout(t)
  }, [landed, round])

  const toss = tosses[round]
  const yao = yaos[round]
  const backs = toss.filter(Boolean).length
  const comboText = ['三个字', '一背二字', '两背一字', '三个背'][backs]
  const doneCount = round + (landed ? 1 : 0)

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <div className="mb-1 text-sm tracking-[0.4em] text-amber-500/70">焚香静心 · 摇币起卦</div>
        <div className="text-2xl font-bold text-amber-100">
          第 {round + 1} 次 <span className="text-base font-normal text-stone-400">/ 共 6 次</span>
        </div>
      </div>

      {/* 三枚硬币 */}
      <div className="flex gap-6">
        {toss.map((face, i) => (
          <Coin key={`${round}-${i}`} face={face} flipping={!landed} delay={i * 120} />
        ))}
      </div>

      {/* 本轮结果 */}
      <div className="h-8 text-lg">
        {landed && (
          <span className="fade-in text-amber-200">
            {comboText} · <b className="text-amber-400">{yao.label}</b>
            {yao.moving && <span className="ml-2 text-red-400">（动爻）</span>}
          </span>
        )}
      </div>

      {/* 已排出的爻（自下而上） */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex w-48 flex-col-reverse gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex h-3.5 items-center">
              {i < doneCount &&
                (yaos[i].yang ? (
                  <div className="line-grow h-3.5 w-full rounded-sm bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200" />
                ) : (
                  <div className="flex w-full gap-3">
                    <div className="line-grow h-3.5 flex-1 rounded-sm bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200" />
                    <div className="line-grow h-3.5 flex-1 rounded-sm bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200" />
                  </div>
                ))}
            </div>
          ))}
        </div>
        <div className="text-xs tracking-widest text-stone-500">自下而上 · 依次成卦</div>
      </div>
    </div>
  )
}
