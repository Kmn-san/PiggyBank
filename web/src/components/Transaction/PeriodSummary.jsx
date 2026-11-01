import React from 'react'
import { Card } from '../Card'
import { formatYen } from '../../lib/utlis'

function PeriodSummary({ income, count }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Card className="p-5!">
                <p className="text-sm font-semibold text-[#12202F]/60">収入</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#0F7B5F] mt-2 wrap-break-word">
                    {formatYen(income)}
                </p>
            </Card>
            <Card className="p-5!">
                <p className="text-sm font-semibold text-[#12202F]/60">件数</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{count}件</p>
            </Card>
        </div>
    )
}

export default PeriodSummary