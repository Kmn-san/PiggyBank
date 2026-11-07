import { Card } from "../Card";

const dateInput =
    "w-full h-12 px-3 block min-w-0 max-w-full appearance-none text-left bg-white border border-[#D9DDD8] rounded-xl text-base text-[#12202F] focus:outline-none focus:border-[#0F7B5F] focus:ring-2 focus:ring-[#0F7B5F]/40 [&::-webkit-date-and-time-value]:text-left";

function PeriodFilter({
    range,
    onRangeChange,
    presets,
    rangeError,
    today
}) {
    const activePreset = presets.find(
        (p) =>
            p.range.from === range.from &&
            p.range.to === range.to
    )?.id;

    return (
        <Card>
            <h2 className="font-bold mb-3">期間を選択</h2>

            <div
                className="flex flex-wrap gap-2 mb-4"
                role="group"
                aria-label="期間のショートカット"
            >
                {presets.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => onRangeChange(p.range)}
                        aria-pressed={activePreset === p.id}
                        className={`h-11 px-4 rounded-full text-sm font-semibold border transition ${activePreset === p.id
                                ? "bg-[#0F7B5F] text-white border-[#0F7B5F]"
                                : "bg-white text-[#12202F]/70 border-[#D9DDD8] active:bg-black/5"
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                <div>
                    <label
                        htmlFor="start"
                        className="block text-xs font-semibold text-[#12202F]/60 mb-1.5"
                    >
                        開始日
                    </label>

                    <input
                        id="start"
                        type="date"
                        value={range.from}
                        max={range.to || today}
                        onChange={(e) =>
                            onRangeChange((r) => ({
                                ...r,
                                from: e.target.value
                            }))
                        }
                        className={dateInput}
                    />
                </div>

                <div>
                    <label
                        htmlFor="end"
                        className="block text-xs font-semibold text-[#12202F]/60 mb-1.5"
                    >
                        終了日
                    </label>

                    <input
                        id="end"
                        type="date"
                        value={range.to}
                        min={range.from}
                        max={today}
                        onChange={(e) =>
                            onRangeChange((r) => ({
                                ...r,
                                to: e.target.value
                            }))
                        }
                        className={dateInput}
                    />
                </div>
            </div>

            {rangeError && (
                <p role="alert" className="text-sm text-red-700 mt-3">
                    {rangeError}
                </p>
            )}
        </Card>
    );
}

export default PeriodFilter;