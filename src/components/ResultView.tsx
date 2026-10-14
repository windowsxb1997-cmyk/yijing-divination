import { useState } from 'react'
import type { Divination } from '@/lib/yijing'
import HexagramView from '@/components/HexagramView'
import Markdown from '@/components/Markdown'
import type { LlmSettings } from '@/lib/llm'
import { fallbackInterpretation, fetchInterpretation } from '@/lib/llm'

interface ResultViewProps {
  divination: Divination
  settings: LlmSettings
  onRestart: () => void
}

const ROUND_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']

export default function ResultView({ divination: d, settings, onRestart }: ResultViewProps) {
  const [reading, setReading] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const interpret = async () => {
    setLoading(true)
    setError(null)
    try {
      if (settings.apiKey.trim()) {
        setReading(await fetchInterpretation(settings, d))
      } else {
        setReading(fallbackInterpretation(d))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '解读请求失败')
      setReading(fallbackInterpretation(d))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 pb-16">
      {/* 所问之事 */}
      <div className="w-full rounded-2xl border border-amber-500/25 bg-white/[0.04] px-6 py-4 text-center">
        <span className="mr-2 text-sm tracking-widest text-amber-500/70">所问之事</span>
        <span className="text-lg text-amber-100">{d.question}</span>
      </div>

      {/* 起卦经过 */}
      <div className="w-full rounded-2xl border border-amber-500/25 bg-white/[0.04] p-6">
        <h3 className="mb-4 text-sm font-bold tracking-widest text-amber-500/70">起卦经过（六掷）</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {d.tosses.map((toss, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm"
            >
              <span className="w-14 shrink-0 text-stone-400">
                第{'一二三四五六'[i]}次<span className="ml-1 text-xs">({ROUND_NAMES[i]})</span>
              </span>
              <span className="flex gap-1">
                {toss.map((face, j) => (
                  <span
                    key={j}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                      face
                        ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
                        : 'border-stone-500/60 bg-stone-700/40 text-stone-300'
                    }`}
                  >
                    {face ? '背' : '字'}
                  </span>
                ))}
              </span>
              <span className={d.yaos[i].moving ? 'font-bold text-red-300' : 'text-amber-200'}>
                {d.yaos[i].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 本卦 / 变卦 */}
      <div className="flex w-full flex-col items-stretch gap-6 lg:flex-row">
        <HexagramView hexagram={d.ben} yaos={d.yaos} title="本卦 · 事情现状" />
        {d.bian && d.bianYaos && (
          <>
            <div className="flex items-center justify-center text-3xl text-amber-500/60 lg:flex-col">
              <span className="rotate-90 lg:rotate-0">→</span>
            </div>
            <HexagramView hexagram={d.bian} yaos={d.bianYaos} title="变卦 · 发展趋势" />
          </>
        )}
      </div>
      {!d.bian && (
        <div className="text-sm text-stone-400">六爻安静，无动爻，故无变卦，参看本卦即可。</div>
      )}

      {/* 详细解读 */}
      {!reading && (
        <button
          onClick={interpret}
          disabled={loading}
          className="rounded-full border border-amber-500/50 bg-amber-600/20 px-10 py-3 text-lg font-bold tracking-widest text-amber-200 transition hover:bg-amber-600/40 disabled:opacity-50"
        >
          {loading ? '解读中…' : '详细解读'}
        </button>
      )}
      {loading && <div className="text-sm text-stone-400">正在请大模型解卦，请稍候…</div>}
      {error && (
        <div className="w-full rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          大模型解读失败（{error}），以下为内置简版解读。
        </div>
      )}
      {reading && (
        <div className="w-full rounded-2xl border border-amber-500/25 bg-white/[0.04] p-6">
          <h3 className="mb-3 text-sm font-bold tracking-widest text-amber-500/70">详细解读</h3>
          <Markdown text={reading} />
        </div>
      )}

      {/* 再来一卦 */}
      <button
        onClick={onRestart}
        className="rounded-full bg-amber-600 px-12 py-3 text-lg font-bold tracking-widest text-stone-950 transition hover:bg-amber-500"
      >
        再来一卦
      </button>
      <div className="text-xs text-stone-500">古人有言：一事不二占。卦象仅供参考，事在人为。</div>
    </div>
  )
}
