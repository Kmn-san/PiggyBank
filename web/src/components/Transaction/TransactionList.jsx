import React from 'react'
import { Pencil } from 'lucide-react'
import { Card } from '../Card';
import { formatYen, getLabel, TX_STYLE } from '../../lib/utlis';

function TransactionList({ days, onEdit }) {

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
                                    <li key={tx.id} className="py-3 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${s.badge}`}>
                                                <s.Icon className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold wrap-break-word">{main}</p>
                                                {sub && <p className="text-xs text-[#12202F]/60 wrap-break-word">{sub}</p>}
                                                {tx.note && <p className="text-xs text-[#12202F]/50 wrap-break-word">{tx.note}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <p className={`text-sm font-bold ${s.amount}`}>
                                                {s.sign}
                                                {formatYen(tx.amount)}
                                            </p>

                                            {tx.type !== 'income' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit?.(tx)}
                                                    className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/50 active:bg-black/5"
                                                    aria-label={`${main}を編集`}
                                                >
                                                    <Pencil className="h-4 w-4" aria-hidden="true" />
                                                </button>
                                            ) : (
                                                <span className="-mr-2 w-11 h-11 shrink-0" aria-hidden="true" />
                                            )}
                                        </div>
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