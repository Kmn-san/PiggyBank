
import {
    X,
    Plus,
    ArrowLeftRight,
    ArrowDown,
    ShoppingBag,
    CircleAlert,
    Loader2,
    Coffee,
    Car,
    GraduationCap,
    ShoppingCart,
    Film,
    MoreHorizontal,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { formatYen } from '../lib/utlis';
import { getAccountMeta } from '../lib/accounts';
import { AccountPicker } from './AccountPicker';

// Fixed account names stored in the database.
// Do not translate these values.
const FIXED_ACCOUNT_NAMES = {
    working: 'Working Account',
    daily: 'Daily Expenses',
    emergency: 'Emergency Account',
};

// Translate fixed account labels.
// Custom goal account names remain unchanged.
const getTranslatedAccountLabel = (account, t) => {
    if (!account) return '';

    const translationKeys = {
        'Working Account': 'accounts.working',
        'Daily Expenses': 'accounts.daily',
        'Emergency Account': 'accounts.emergency',
    };

    const key = translationKeys[account.name];

    return key
        ? t(key)
        : getAccountMeta(account).label;
};

// Category IDs are sent to the backend.
// Only displayed category names are translated.
const CATEGORIES = [
    { id: 'food', Icon: Coffee },
    { id: 'transport', Icon: Car },
    { id: 'education', Icon: GraduationCap },
    { id: 'shopping', Icon: ShoppingCart },
    { id: 'entertainment', Icon: Film },
    { id: 'other', Icon: MoreHorizontal },
];

const todayJst = () =>
    new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Tokyo',
    }).format(new Date());

const Label = ({ htmlFor, children }) => (
    <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-[#12202F] mb-2"
    >
        {children}
    </label>
);

const inputBase =
    'w-full bg-white border border-[#D9DDD8] rounded-xl text-base text-[#12202F] placeholder:text-[#12202F]/35 focus:outline-none focus:border-[#0F7B5F] focus:ring-2 focus:ring-[#0F7B5F]/40';

const TransactionModal = ({
    isOpen,
    mode: initialMode = 'income',
    accounts = [],
    onClose,
    onSubmit,
}) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState(initialMode);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(todayJst());
    const [fromId, setFromId] = useState('');
    const [toId, setToId] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MODES = {
        income: {
            label: t('transaction.modes.income.label'),
            description: t('transaction.modes.income.description'),
            Icon: Plus,
        },
        transfer: {
            label: t('transaction.modes.transfer.label'),
            description: t('transaction.modes.transfer.description'),
            Icon: ArrowLeftRight,
        },
        expense: {
            label: t('transaction.modes.expense.label'),
            description: t('transaction.modes.expense.description'),
            Icon: ShoppingBag,
        },
    };

    // Reset form when the modal opens.
    useEffect(() => {
        if (!isOpen) return;

        setMode(initialMode);
        setAmount('');
        setNote('');
        setDate(todayJst());

        // Default transfer: Working Account -> Daily Expenses
        const idOf = (name) =>
            accounts.find((a) => a.name === name)?.id ?? '';

        setFromId(idOf(FIXED_ACCOUNT_NAMES.working));
        setToId(idOf(FIXED_ACCOUNT_NAMES.daily));

        setCategory(CATEGORIES[0].id);
        setError('');
    }, [isOpen, initialMode]);

    // Handle Escape key and background scrolling.
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e) => {
            if (e.key === 'Escape') {
                onClose?.();
            }
        };

        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Find fixed accounts by their database names.
    const byName = (key) =>
        accounts.find(
            (a) => a.name === FIXED_ACCOUNT_NAMES[key]
        );

    const balanceOf = (key) =>
        Number(byName(key)?.currentAmount ?? 0);

    const byId = (id) =>
        accounts.find((a) => a.id === id);

    const selectFrom = (id) => {
        setFromId(id);

        // If the new source is the current destination,
        // select another destination.
        if (id === toId) {
            setToId(
                accounts.find((a) => a.id !== id)?.id ?? ''
            );
        }
    };

    // Validate transaction data.
    const validate = () => {
        const num = Number(amount);

        if (!amount || !Number.isInteger(num) || num <= 0) {
            return t('transaction.validation.invalidAmount');
        }

        if (!date) {
            return t('transaction.validation.dateRequired');
        }

        if (mode === 'transfer') {
            const from = byId(fromId);
            const to = byId(toId);

            if (!from || !to) {
                return t('transaction.validation.accountRequired');
            }

            if (fromId === toId) {
                return t('transaction.validation.sameAccount');
            }

            if (num > Number(from.currentAmount ?? 0)) {
                return t(
                    'transaction.validation.insufficientAccount',
                    {
                        account: getTranslatedAccountLabel(from, t),
                        balance: formatYen(
                            Number(from.currentAmount ?? 0)
                        ),
                    }
                );
            }
        }

        if (mode === 'expense' && num > balanceOf('daily')) {
            return t(
                'transaction.validation.insufficientDaily',
                {
                    balance: formatYen(balanceOf('daily')),
                }
            );
        }

        return null;
    };

    // Submit transaction.
    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = validate();

        if (message) {
            setError(message);
            return;
        }

        setError('');
        setIsSubmitting(true);

        const payload = {
            type: mode,
            amount: Number(amount),
            note: note.trim() || null,
            transactionDate: date,

            ...(mode === 'transfer' && {
                fromAccount: fromId,
                toAccount: toId,
            }),

            ...(mode === 'expense' && {
                category,
            }),
        };

        try {
            await onSubmit?.(payload);

            toast.success(t('transaction.success'), {
                id: 'transaction',
            });

            onClose?.();
        } catch (err) {
            toast.error(
                err?.response?.data?.message ??
                t('transaction.error'),
                {
                    id: 'transaction',
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const ActiveIcon = MODES[mode].Icon;

    // Display fixed account information.
    const LockedAccount = ({ accountKey, balanceText }) => {
        const account = byName(accountKey);

        if (!account) return null;

        const { Icon } = getAccountMeta(account);
        const label = getTranslatedAccountLabel(account, t);

        return (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#D9DDD8]">
                <div className="w-10 h-10 rounded-lg bg-[#12202F] text-white flex items-center justify-center shrink-0">
                    <Icon
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">
                        {label}
                    </p>

                    <p className="text-xs text-[#12202F]/60">
                        {balanceText} {formatYen(balanceOf(accountKey))}
                    </p>
                </div>

                <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#12202F]/5 text-[#12202F]/60">
                    {t('transaction.fixed')}
                </span>
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tx-title"
        >
            <div
                className="w-full sm:max-w-md bg-[#F5F6F4] rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92dvh] overflow-y-auto overflow-x-hidden"
                style={{
                    fontFamily:
                        "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#F5F6F4] border-b border-[#D9DDD8] px-5 py-3 flex items-center justify-between">
                    <div>
                        <h2
                            id="tx-title"
                            className="text-lg font-bold text-[#12202F]"
                        >
                            {t('transaction.title')}
                        </h2>

                        <p className="text-xs text-[#12202F]/60 mt-0.5">
                            {MODES[mode].description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/70 active:bg-black/5"
                        aria-label={t('common.close')}
                    >
                        <X
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-5 space-y-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-[#12202F]"
                >
                    {/* Mode tabs */}
                    <div
                        className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#12202F]/5"
                        role="tablist"
                    >
                        {Object.entries(MODES).map(([key, cfg]) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={mode === key}
                                onClick={() => {
                                    setMode(key);
                                    setError('');
                                }}
                                className={`h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition ${mode === key
                                        ? 'bg-[#0F7B5F] text-white'
                                        : 'text-[#12202F]/60 active:bg-black/5'
                                    }`}
                            >
                                <cfg.Icon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                {cfg.label}
                            </button>
                        ))}
                    </div>

                    {/* Amount */}
                    <div>
                        <Label htmlFor="tx-amount">
                            {t('transaction.amount')}
                        </Label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#12202F]/40">
                                ¥
                            </span>

                            <input
                                id="tx-amount"
                                type="number"
                                inputMode="numeric"
                                step="1"
                                min="1"
                                placeholder="0"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                className={`${inputBase} h-16 pl-10 pr-4 text-2xl font-bold`}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Income */}
                    {mode === 'income' && (
                        <div>
                            <Label>
                                {t('transaction.income.destination')}
                            </Label>

                            <LockedAccount
                                accountKey="working"
                                balanceText={t('transaction.balance')}
                            />
                        </div>
                    )}

                    {/* Transfer */}
                    {mode === 'transfer' && (
                        <>
                            <AccountPicker
                                legend={t('transaction.transfer.from')}
                                accounts={accounts}
                                value={fromId}
                                onChange={selectFrom}
                            />

                            <div
                                className="flex justify-center -my-2"
                                aria-hidden="true"
                            >
                                <div className="w-9 h-9 rounded-full bg-white border border-[#D9DDD8] flex items-center justify-center">
                                    <ArrowDown className="h-4 w-4 text-[#12202F]/50" />
                                </div>
                            </div>

                            <AccountPicker
                                legend={t('transaction.transfer.to')}
                                accounts={accounts}
                                value={toId}
                                onChange={setToId}
                                disabledId={fromId}
                            />
                        </>
                    )}

                    {/* Expense */}
                    {mode === 'expense' && (
                        <>
                            <div>
                                <Label>
                                    {t('transaction.expense.source')}
                                </Label>

                                <LockedAccount
                                    accountKey="daily"
                                    balanceText={t('transaction.availableBalance')}
                                />
                            </div>

                            <div>
                                <Label>
                                    {t('transaction.category')}
                                </Label>

                                <div
                                    className="grid grid-cols-2 gap-2"
                                    role="radiogroup"
                                    aria-label={t('transaction.category')}
                                >
                                    {CATEGORIES.map(({ id, Icon }) => {
                                        const selected = category === id;

                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                onClick={() =>
                                                    setCategory(id)
                                                }
                                                className={`h-14 flex items-center gap-2 px-3 rounded-xl border text-left transition ${selected
                                                        ? 'border-[#0F7B5F] bg-green-50 ring-2 ring-[#0F7B5F]/30'
                                                        : 'border-[#D9DDD8] bg-white'
                                                    }`}
                                            >
                                                <Icon
                                                    className={`h-5 w-5 shrink-0 ${selected
                                                            ? 'text-[#0F7B5F]'
                                                            : 'text-[#12202F]/50'
                                                        }`}
                                                    aria-hidden="true"
                                                />

                                                <span
                                                    className={`text-sm font-semibold truncate ${selected
                                                            ? 'text-[#0F7B5F]'
                                                            : ''
                                                        }`}
                                                >
                                                    {t(`categories.${id}`)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Date */}
                    <div>
                        <Label htmlFor="tx-date">
                            {t('transaction.date')}
                        </Label>

                        <input
                            id="tx-date"
                            type="date"
                            value={date}
                            max={todayJst()}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            className={`${inputBase} h-14 px-4 block min-w-0 max-w-full appearance-none text-left [&::-webkit-date-and-time-value]:text-left`}
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <Label htmlFor="tx-note">
                            {t('transaction.note')}{' '}
                            <span className="text-[#12202F]/50 font-normal">
                                ({t('common.optional')})
                            </span>
                        </Label>

                        <textarea
                            id="tx-note"
                            rows={2}
                            placeholder={t(
                                `transaction.notePlaceholder.${mode}`
                            )}
                            value={note}
                            onChange={(e) =>
                                setNote(e.target.value)
                            }
                            className={`${inputBase} px-4 py-3 resize-none`}
                        />
                    </div>

                    {/* Validation error */}
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
                        >
                            <CircleAlert
                                className="h-5 w-5 shrink-0 mt-0.5"
                                aria-hidden="true"
                            />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-14 rounded-xl border border-[#D9DDD8] bg-white text-base font-semibold active:bg-black/5"
                        >
                            {t('common.cancel')}
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-14 rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49] disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        className="h-5 w-5 animate-spin"
                                        aria-hidden="true"
                                    />
                                    {t('transaction.saving')}
                                </>
                            ) : (
                                <>
                                    <ActiveIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    {t('transaction.save', {
                                        mode: MODES[mode].label,
                                    })}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
