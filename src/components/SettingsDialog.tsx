import { useState } from 'react'
import type { LlmSettings } from '@/lib/llm'
import { saveSettings } from '@/lib/llm'

interface SettingsDialogProps {
  settings: LlmSettings
  onSave: (s: LlmSettings) => void
  onClose: () => void
}

export default function SettingsDialog({ settings, onSave, onClose }: SettingsDialogProps) {
  const [form, setForm] = useState<LlmSettings>(settings)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-stone-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-1 text-lg font-bold text-amber-200">解读设置</h2>
        <p className="mb-4 text-xs leading-relaxed text-stone-400">
          填写任意 OpenAI 兼容接口（如 Kimi / DeepSeek / OpenAI），密钥仅保存在本机浏览器中。
          不填写也可使用内置的简版解读。
        </p>
        <div className="space-y-3">
          <label className="block text-sm text-stone-300">
            接口地址
            <input
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              value={form.baseUrl}
              onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
              placeholder="https://api.moonshot.cn/v1"
            />
          </label>
          <label className="block text-sm text-stone-300">
            API Key
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              placeholder="sk-..."
            />
          </label>
          <label className="block text-sm text-stone-300">
            模型
            <input
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="kimi-k2-0905-preview"
            />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            className="rounded-lg px-4 py-2 text-sm text-stone-400 hover:text-stone-200"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-stone-950 hover:bg-amber-500"
            onClick={() => {
              saveSettings(form)
              onSave(form)
              onClose()
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
