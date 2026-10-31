import React from 'react'
import { Card } from '../Card';
import { formatYen, getLabel, TX_STYLE } from '../../lib/utlis';

function TransactionList({ days }) {
    return (
        <Card>
            <h2 className="font-bold">すべての取引</h2>

            {days.length === 0 ? (
                <p className="text-sm text-[#12202F]/55 py-10 text-center">この期間の取引はありません</p>
            ) : (
                days.map((day) => (
                    <section key={day.key} className="mt-4">
                        <p className="text-xs font-semibold text-[#12202F]/60 pb-1 border-b border-[#D9DDD8]">{day.label}</p>
                        <ul className="divide-y divide-[#D9DDD8]">
                            {day.items.map((tx) => {
                                const s = TX_STYLE[tx.type] ?? TX_STYLE.transfer;
                                const { main, sub } = getLabel(tx);
                                return (
                                    <li key={tx.id} className="py-3 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${s.badge}`}>
                                                <s.Icon className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold break-words">{main}</p>
                                                {sub && <p className="text-xs text-[#12202F]/60 break-words">{sub}</p>}
                                                {tx.note && <p className="text-xs text-[#12202F]/50 break-words">{tx.note}</p>}
                                            </div>
                                        </div>
                                        <p className={`text-sm font-bold shrink-0 ${s.amount}`}>
                                            {s.sign}
                                            {formatYen(tx.amount)}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))
            )}
        </Card>
    )
}

export default TransactionList