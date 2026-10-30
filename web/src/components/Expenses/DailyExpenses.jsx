import { ShoppingBag } from 'lucide-react'
import React from 'react'
import { Card } from '../Card'
import { formatYen } from '../../lib/utlis'

function DailyExpenses({ account = [], onOpenModal }) {
    const dailyBalance = account?.currentamount;

    return (
        <Card>
            <p className="text-xs font-semibold text-[#12202F]/60">日々の支出口座</p>
            <p className="text-3xl font-bold mt-1">{formatYen(dailyBalance)}</p>
            <p className="text-xs text-[#12202F]/55 mt-1">日々の支出はここから使います</p>
            <button
                type="button"
                onClick={() => onOpenModal?.('expense')}
                className="mt-4 h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49]"
            >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                支出を記録
            </button>
        </Card>
    )
}

export default DailyExpenses