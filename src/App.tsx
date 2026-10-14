import { useState } from 'react'
import type { Divination } from '@/lib/yijing'
import { divine } from '@/lib/yijing'
import type { LlmSettings } from '@/lib/llm'
import { loadSettings } from '@/lib/llm'
import TossStage from '@/components/TossStage'
import ResultView from '@/components/ResultView'
import SettingsDialog from '@/components/SettingsDialog'

type Phase = 'ask' | 'toss' | 'result'

export default function App() {
  const [phase, setPhase] = useState<Phase>('ask')
  const [question, setQuestion] = useState('')
  const [divination, setDivination] = useState<Divination | null>(null)
  const [settings, setSettings] = useState<LlmSettings>(loadSettings)
  const [showSettings, setShowSettings] = useState(false)

  const start = () => {
    const q = question.trim()
    if (!q) return
    setDivination(divine(q))
    setPhase('toss')
  }

  const restart = () => {
    setDivination(null)
    setPhase('ask')
  }

  return (
    <div className="min-h-screen font-serif text-stone-200">
      {/* 顶栏 */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 text-amber-400">
          <span className="text-2xl">䷀</span>
          <span className="text-lg font-bold tracking-widest">掷币问卦</span>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-full border border-stone-700 px-4 py-1.5 text-sm text-stone-400 transition hover:border-amber-500/50 hover:text-amber-300"
        >
            解读设置
        </button>
      </header>

      <main className="px-4">
        {phase === 'ask' && (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 pt-10">
            <div className="text-center">
              <h1 className="mb-3 text-4xl font-bold tracking-[0.2em] text-amber-100">
                掷币问卦
              </h1>
              <p className="leading-relaxed text-stone-400">
                心有所疑，卜以决之。凝神静气，默想所问之事，
                <br />
                三枚硬币，连掷六次，六爻成卦。
              </p>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="请输入你想占卜的事情，例如：这次求职面试能否顺利通过？"
              className="w-full resize-none rounded-2xl border border-amber-500/25 bg-white/[0.04] px-5 py-4 text-lg leading-relaxed text-amber-50 placeholder-stone-500 outline-none backdrop-blur-sm focus:border-amber-500/60"
            />

            <button
              onClick={start}
              disabled={!question.trim()}
              className="rounded-full bg-amber-600 px-14 py-3.5 text-xl font-bold tracking-[0.3em] text-stone-950 shadow-lg shadow-amber-900/40 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              开始起卦
            </button>

            <p className="text-xs text-stone-500">一事一占 · 心诚则灵 · 结果仅供参考</p>
          </div>
        )}

        {phase === 'toss' && divination && (
          <TossStage
            tosses={divination.tosses}
            yaos={divination.yaos}
            onDone={() => setPhase('result')}
          />
        )}

        {phase === 'result' && divination && (
          <ResultView divination={divination} settings={settings} onRestart={restart} />
        )}
      </main>

      {showSettings && (
        <SettingsDialog
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
