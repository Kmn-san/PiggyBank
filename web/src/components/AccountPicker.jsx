import { ACCT } from '../lib/accounts';
import { formatYen } from '../lib/utlis';

export const AccountPicker = ({ legend, value, onChange, disabledKey, balanceOf }) => (
    <div>
        <p className="block text-sm font-semibold text-[#12202F] mb-2">{legend}</p>
        <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label={legend}>
            {Object.entries(ACCT).map(([k, { Icon, label }]) => {
                const selected = value === k;
                return (
                    <button
                        key={k}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={k === disabledKey}
                        onClick={() => onChange(k)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition disabled:opacity-40 ${selected ? 'border-[#0F7B5F] bg-green-50 ring-2 ring-[#0F7B5F]/30' : 'border-[#D9DDD8] bg-white'
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-[#0F7B5F] text-white' : 'bg-[#12202F]/5 text-[#12202F]/60'
                                }`}
                        >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold">{label}</p>
                            <p className="text-xs text-[#12202F]/60">残高 {formatYen(balanceOf(k))}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    </div>
);