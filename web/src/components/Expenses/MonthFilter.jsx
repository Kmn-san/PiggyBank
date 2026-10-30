import React from 'react'
import { Card } from '../Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatYen, monthLabel, shiftMonth } from '../../lib/utlis'

function MonthFilter({ month, isThisMonth, count, total, setMonth, thisMonth }) {

    return (
        <Card>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setMonth((m) => shiftMonth(m, -1))}
                    className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg active:bg-black/5"
                    aria-label="前の月"
                >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="text-center">
                    <p className="text-lg font-bold" aria-live="polite">
                        {monthLabel(month)}
                    </p>
                    {isThisMonth ? (
                        <p className="text-xs font-semibold text-[#0F7B5F]">今月</p>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setMonth(thisMonth)}
                            className="text-xs font-semibold text-[#0F7B5F] underline underline-offset-2"
                        >
                            今月に戻る
                        </button>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setMonth((m) => shiftMonth(m, 1))}
                    disabled={isThisMonth}
                    className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg active:bg-black/5 disabled:opacity-30"
                    aria-label="次の月"
                >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#D9DDD8] flex items-end justify-between">
                <div>
                    <p className="text-xs font-semibold text-[#12202F]/60">支出の合計</p>
                    <p className="text-2xl font-bold text-red-700">{formatYen(total)}</p>
                </div>
                <p className="text-sm text-[#12202F]/60">{count}件</p>
            </div>
        </Card>
    )
}

export default MonthFilter