import { getAccountMeta, sortAccounts } from '../lib/accounts';
import { formatYen } from '../lib/utlis';

const Row = ({ account, selected, disabled, onSelect }) => {
    const { label, Icon } = getAccountMeta(account);
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(account.id)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition disabled:opacity-40 ${selected ? 'border-[#0F7B5F] bg-green-50 ring-2 ring-[#0F7B5F]/30' : 'border-[#D9DDD8] bg-white'
                }`}
        >
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-[#0F7B5F] text-white' : 'bg-[#12202F]/5 text-[#12202F]/60'
                    }`}
            >
                <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold wrap-break-word">{label}</p>
                <p className="text-xs text-[#12202F]/60">残高 {formatYen(Number(account.currentAmount ?? 0))}</p>
            </div>
        </button>
    );
};

export const AccountPicker = ({ legend, accounts = [], value, onChange, disabledId }) => {
    const sorted = sortAccounts(accounts);
    const basics = sorted.filter((a) => !getAccountMeta(a).isGoal);
    const goals = sorted.filter((a) => getAccountMeta(a).isGoal);

    return (
        <div>
            <p className="block text-sm font-semibold text-[#12202F] mb-2">{legend}</p>

            {/* Scrolls when there are many accounts */}
            <div className="max-h-72 overflow-y-auto pr-1 space-y-2" role="radiogroup" aria-label={legend}>
                {basics.map((a) => (
                    <Row key={a.id} account={a} selected={value === a.id} disabled={a.id === disabledId} onSelect={onChange} />
                ))}

                {goals.length > 0 && (
                    <p className="sticky top-0 z-10 bg-[#F5F6F4] pt-2 pb-1 text-xs font-semibold text-[#12202F]/60">
                        目標口座（{goals.length}）
                    </p>
                )}
                {goals.map((a) => (
                    <Row key={a.id} account={a} selected={value === a.id} disabled={a.id === disabledId} onSelect={onChange} />
                ))}
            </div>
        </div>
    );
};