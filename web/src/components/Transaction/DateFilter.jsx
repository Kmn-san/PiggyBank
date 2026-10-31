import React from 'react'
import { Card } from '../Card'

function DateFilter() {
    return (
        <Card>
            <h2 className="font-bold mb-3">期間で絞り込む</h2>
            <div className="flex gap-2 mb-4" role="group" aria-label="期間のショートカット">
                {presets.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => setRange(p.range)}
                        aria-pressed={activePreset === p.id}
                        className={`h-11 px-4 rounded-full text-sm font-semibold border transition ${activePreset === p.id
                            ? 'bg-[#0F7B5F] text-white border-[#0F7B5F]'
                            : 'bg-white text-[#12202F]/70 border-[#D9DDD8] active:bg-black/5'
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="from" className="block text-xs font-semibold text-[#12202F]/60 mb-1.5">
                        開始日
                    </label>
                    <input
                        id="from"
                        type="date"
                        value={range.from}
                        onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                        className={dateInput}
                    />
                </div>
                <div>
                    <label htmlFor="to" className="block text-xs font-semibold text-[#12202F]/60 mb-1.5">
                        終了日
                    </label>
                    <input
                        id="to"
                        type="date"
                        value={range.to}
                        onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                        className={dateInput}
                    />
                </div>
            </div>
            {invalidRange && (
                <p role="alert" className="text-sm text-red-700 mt-3">
                    開始日は終了日より前の日付にしてください
                </p>
            )}
        </Card>
    )
}

export default DateFilter