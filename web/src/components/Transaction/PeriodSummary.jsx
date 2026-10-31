import React from 'react'
import { Card } from '../Card'
import { formatYen } from '../../lib/utlis'

function PeriodSummary({ income, count }) {
    return (
        <div className="grid grid-cols-3 gap-3">
            <Card className="!p-4">
                <p className="text-xs font-semibold text-[#12202F]/60">収入</p>
                <p className="text-lg font-bold text-[#0F7B5F] mt-1 break-words">{formatYen(income)}</p>
            </Card>
            <Card className="!p-4">
                <p className="text-xs font-semibold text-[#12202F]/60">件数</p>
                <p className="text-lg font-bold mt-1">{count}件</p>
            </Card>
        </div>
    )
}

export default PeriodSummary