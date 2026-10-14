import type { Divination } from '@/lib/yijing'
import { fullName } from '@/lib/yijing'

export interface LlmSettings {
  baseUrl: string
  apiKey: string
  model: string
}

const STORAGE_KEY = 'yijing-llm-settings'

export const DEFAULT_SETTINGS: LlmSettings = {
  baseUrl: 'https://api.moonshot.cn/v1',
  apiKey: '',
  model: 'kimi-k2-0905-preview',
}

export function loadSettings(): LlmSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<LlmSettings>) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS }
}

export function saveSettings(s: LlmSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function movingLinesText(d: Divination): string {
  if (d.movingIndexes.length === 0) return '本卦六爻安静，无动爻。'
  return d.movingIndexes
    .map((i) => {
      const line = d.ben.lines[i]
      return `第${['一', '二', '三', '四', '五', '六'][i]}爻（${line.name}）：${line.scripture}`
    })
    .join('\n')
}

export function buildPrompt(d: Divination): string {
  const bianPart = d.bian
    ? `变卦：${fullName(d.bian)}（${d.bian.symbol} ${d.bian.name}卦）\n变卦卦辞：${d.bian.scripture}`
    : '本卦无动爻，故无变卦。'
  return `你是一位精通《周易》的易学专家，擅长结合卦辞、爻辞为求卦者解卦。请针对下面的占问做详细解读。

【所问之事】
${d.question}

【起卦结果】
本卦：${fullName(d.ben)}（${d.ben.symbol} ${d.ben.name}卦，上${d.ben.combination[1]}下${d.ben.combination[0]}）
本卦卦辞：${d.ben.scripture}

【动爻】
${movingLinesText(d)}

【变卦】
${bianPart}

请按以下结构用中文详细解读（使用 Markdown 格式）：
## 卦象总览
简述本卦与变卦的含义，以及它们与所问之事的关系。
## 本卦详解
结合卦辞逐条分析现状（如有动爻，重点解读动爻爻辞）。
## 变卦与趋势
分析事情的走向与变化趋势（无变卦则说明事情稳定发展）。
## 具体建议
针对所问之事给出 3-5 条切实可行的建议。
## 结语
一句话总结。

注意：解读要紧扣所问之事，通俗易懂，避免过度玄学化的空话；最后请提醒求卦者，占卜仅供参考，事在人为。`
}

/** 调用 OpenAI 兼容的聊天补全接口 */
export async function fetchInterpretation(settings: LlmSettings, d: Divination): Promise<string> {
  const url = `${settings.baseUrl.replace(/\/+$/, '')}/chat/completions`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [{ role: 'user', content: buildPrompt(d) }],
      temperature: 0.7,
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`接口返回 ${res.status}：${text.slice(0, 200)}`)
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('接口未返回解读内容')
  return content
}

/** 未配置 API 时的本地简版解读 */
export function fallbackInterpretation(d: Divination): string {
  const lines: string[] = []
  lines.push('## 卦象总览')
  lines.push(
    `你问的是「${d.question}」。本次起得本卦 **${fullName(d.ben)}**（${d.ben.symbol}），卦辞曰：「${d.ben.scripture}」`,
  )
  if (d.bian) {
    lines.push(
      `卦中有 ${d.movingIndexes.length} 个动爻，动爻变化后得变卦 **${fullName(d.bian)}**（${d.bian.symbol}），卦辞曰：「${d.bian.scripture}」本卦象征事情现状，变卦象征发展趋势。`,
    )
  } else {
    lines.push('六爻安静，没有动爻，说明事情态势稳定，可按本卦卦辞参看。')
  }
  lines.push('')
  lines.push('## 本卦详解')
  if (d.movingIndexes.length > 0) {
    lines.push('本卦动爻爻辞是解读的关键：')
    d.movingIndexes.forEach((i) => {
      const l = d.ben.lines[i]
      lines.push(`- **${l.name}**：${l.scripture}`)
    })
  } else {
    lines.push(`重点参看卦辞：「${d.ben.scripture}」`)
  }
  if (d.bian) {
    lines.push('')
    lines.push('## 变卦与趋势')
    lines.push(
      `事情的发展趋势可参考变卦 **${fullName(d.bian)}** 的卦辞：「${d.bian.scripture}」`,
    )
  }
  lines.push('')
  lines.push('## 结语')
  lines.push('卦象所示仅是一种参考视角，事在人为，祝顺遂。')
  lines.push('')
  lines.push('> 这是内置的简版解读。在右上角「解读设置」中填入 API Key 后，可由大语言模型生成更详尽的个性化解读。')
  return lines.join('\n')
}
