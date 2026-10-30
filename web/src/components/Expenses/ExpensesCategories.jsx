import React from 'react'
import { Card } from '../Card'
import { formatYen, monthLabel, CATEGORY_COLORS, FALLBACK_COLORS, capitalize } from '../../lib/utlis'

function ExpensesCategories({ categories = [], total = 0, month }) {

    return (
        <Card className="md:col-span-2">
            <h2 className="font-bold">{monthLabel(month)}のカテゴリ別支出</h2>
            <p className="text-xs text-[#12202F]/60 mb-2">金額の多い順</p>

            {categories.length === 0 ? (
                <p className="text-sm text-[#12202F]/55 py-10 text-center">この月の支出はありません</p>
            ) : (
                <ul className="divide-y divide-[#D9DDD8]">
                    {categories.map((c, i) => {
                        const pct = total ? Math.round((c.amount / total) * 100) : 0
                        const color = CATEGORY_COLORS[c.category] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                        return (
                            <li key={c.category} className="py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                        {capitalize(c.category)}
                                    </span>
                                    <span className="text-sm font-bold shrink-0">{formatYen(c.amount)}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="h-2 grow rounded-full bg-[#12202F]/10 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                                    </div>
                                    <span className="text-xs text-[#12202F]/60 w-9 text-right">{pct}%</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </Card>
    )
}

export default ExpensesCategories