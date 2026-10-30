import React from 'react'
import { Card } from '../Card'

const FLOW_STEPS = [
    { title: '収入を入金', text: 'メイン口座に入ります' },
    { title: '週ごとに振替', text: 'メイン口座 → 週の予算' },
    { title: '余ったら貯蓄', text: 'メイン口座 → 緊急資金・目標' },
];
function MoneyFlow() {
    return (
        <Card  >
            <h2 className="text-sm font-bold mb-3">お金の流れ</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FLOW_STEPS.map((s, i) => (
                    <li key={s.title} className="flex items-center gap-3 rounded-xl bg-[#F5F6F4] p-3">
                        <span className="w-7 h-7 shrink-0 rounded-full bg-[#0F7B5F] text-white text-sm font-bold flex items-center justify-center">
                            {i + 1}
                        </span>
                        <div>
                            <p className="text-sm font-semibold">{s.title}</p>
                            <p className="text-xs text-[#12202F]/60">{s.text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </Card>
    )
}

export default MoneyFlow