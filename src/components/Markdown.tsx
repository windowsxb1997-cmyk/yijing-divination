import type { ReactNode } from 'react'

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i} className="text-amber-300">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

/** 极简 Markdown 渲染：标题、引用、列表、加粗、段落 */
export default function Markdown({ text }: { text: string }) {
  const out: ReactNode[] = []
  let list: string[] = []
  const flush = (key: string) => {
    if (list.length > 0) {
      out.push(
        <ul key={key} className="list-disc space-y-1 pl-6">
          {list.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>,
      )
      list = []
    }
  }

  text.split('\n').forEach((ln, idx) => {
    const t = ln.trimEnd()
    if (/^###\s/.test(t)) {
      flush(`l${idx}`)
      out.push(<h3 key={idx} className="mt-4 text-lg font-bold text-amber-200">{inline(t.slice(4))}</h3>)
    } else if (/^##\s/.test(t)) {
      flush(`l${idx}`)
      out.push(<h2 key={idx} className="mt-6 border-b border-amber-500/20 pb-1 text-xl font-bold text-amber-300">{inline(t.slice(3))}</h2>)
    } else if (/^#\s/.test(t)) {
      flush(`l${idx}`)
      out.push(<h1 key={idx} className="mt-6 text-2xl font-bold text-amber-200">{inline(t.slice(2))}</h1>)
    } else if (/^>\s?/.test(t)) {
      flush(`l${idx}`)
      out.push(
        <blockquote key={idx} className="border-l-2 border-amber-500/50 pl-3 text-stone-400 italic">
          {inline(t.replace(/^>\s?/, ''))}
        </blockquote>,
      )
    } else if (/^[-*]\s+/.test(t)) {
      list.push(t.replace(/^[-*]\s+/, ''))
    } else if (t === '') {
      flush(`l${idx}`)
    } else {
      flush(`l${idx}`)
      out.push(<p key={idx} className="leading-relaxed">{inline(t)}</p>)
    }
  })
  flush('end')

  return <div className="space-y-2 text-stone-200">{out}</div>
}
