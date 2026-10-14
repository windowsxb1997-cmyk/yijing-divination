# 掷币问卦 · 六爻

一个基于《周易》六爻掷币起卦法的现代化网页应用：默念所问之事，三枚硬币连掷六次，动画演绎成卦全过程，自动排出本卦与变卦，并可调用大语言模型（LLM）结合所问之事生成详细解读。

## ✨ 功能特性

- **完整起卦流程**：遵循传统铜钱起卦法 —— 一背二字为少阳、两背一字为少阴、三背为老阳○、三字为老阴×，六掷成卦，自下而上排爻
- **掷币动画**：每轮三枚铜钱（带方孔）翻转落地，卦画随爻逐一生长，完整还原"摇卦"仪式感
- **本卦 / 变卦**：自动识别动爻（○×），动爻阴阳互变生成变卦，并排对照展示
- **完整经文**：内置六十四卦全部卦辞与三百八十四爻爻辞（附用九、用六）
- **LLM 详细解读**：一键调用任意 OpenAI 兼容接口（Kimi / DeepSeek / OpenAI 等），结合所问之事、卦辞、动爻爻辞、变卦生成结构化解读；API Key 仅保存在本机浏览器 localStorage；未配置时自动降级为内置简版解读
- **起卦经过回放**：六次投掷的每枚硬币正背、所得爻象一目了然

## 🛠 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- 纯前端实现，无后端依赖（LLM 调用直接走浏览器 fetch）

## 🚀 本地运行

```bash
npm install
npm run dev    # http://localhost:3000
```

构建生产版本：

```bash
npm run build  # 输出到 dist/
npm run preview
```

## 📁 项目结构

```
src/
├── data/hexagrams.json      # 六十四卦结构化数据（卦名、卦画、卦辞、爻辞）
├── lib/
│   ├── yijing.ts            # 起卦核心逻辑：掷币判定、卦象查找、变卦推导
│   └── llm.ts               # LLM 解读：提示词构建、OpenAI 兼容接口调用、本地兜底解读
├── components/
│   ├── Coin.tsx             # 铜钱组件（翻转动画）
│   ├── TossStage.tsx        # 六轮掷币动画编排
│   ├── HexagramView.tsx     # 卦画 + 卦辞 + 爻辞展示
│   ├── ResultView.tsx       # 占卜结果页（起卦经过 / 本卦 / 变卦 / 解读）
│   ├── SettingsDialog.tsx   # LLM 接口设置
│   └── Markdown.tsx         # 极简 Markdown 渲染
└── App.tsx                  # 主流程状态机（问卦 → 掷币 → 结果）
```

## 📜 数据来源

卦辞、爻辞文本为公有领域经典《周易》，结构化数据整理自开源项目 [john-walks-slow/open-iching](https://github.com/john-walks-slow/open-iching)（清乾隆武英殿本），在此致谢。

## ⚠️ 免责声明

本项目为传统文化学习与前端技术演示作品，占卜结果仅供娱乐与参考，不构成任何决策建议。事在人为，请理性看待。

## License

[MIT](./LICENSE)
