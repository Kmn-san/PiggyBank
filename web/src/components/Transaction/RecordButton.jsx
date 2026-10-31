import { Plus, ShoppingBag } from 'lucide-react'
import React from 'react'

function RecordButton() {
    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                type="button"
                onClick={() => onOpenModal?.('income')}
                className="h-14 rounded-xl bg-[#12202F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#12202F]/90"
            >
                <Plus className="h-5 w-5" aria-hidden="true" />
                収入を記録
            </button>
            <button
                type="button"
                onClick={() => onOpenModal?.('expense')}
                className="h-14 rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49]"
            >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                支出を記録
            </button>
        </div>
    )
}

export default RecordButton