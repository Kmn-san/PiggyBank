import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    X,
    Plus,
    ArrowLeftRight,
    ShoppingBag,
    Wallet,
    ShieldCheck,
    CircleAlert,
    Loader2,
    Coffee,
    Car,
    GraduationCap,
    ShoppingCart,
    Film,
    MoreHorizontal,
} from 'lucide-react';
import { formatYen } from '../lib/utlis';

const ACCT = {
    working: { name: 'Working Account', label: 'メイン口座', Icon: Wallet },
    daily: { name: 'Daily Expenses', label: '日々の支出口座', Icon: ShoppingBag },
    emergency: { name: 'Emergency Account', label: '緊急資金口座', Icon: ShieldCheck },
};

// Category ids are sent to the backend, names are shown as-is (English)
const CATEGORIES = [
    { id: 'food', name: 'Food', Icon: Coffee },
    { id: 'transport', name: 'Transport', Icon: Car },
    { id: 'education', name: 'Education', Icon: GraduationCap },
    { id: 'shopping', name: 'Shopping', Icon: ShoppingCart },
    { id: 'entertainment', name: 'Entertainment', Icon: Film },
    { id: 'other', name: 'Other', Icon: MoreHorizontal },
];

const MODES = {
    income: { label: '収入', Icon: Plus, desc: 'メイン口座に入るお金を記録します' },
    transfer: { label: '振替', Icon: ArrowLeftRight, desc: 'メイン口座から他の口座へお金を移します' },
    expense: { label: '支出', Icon: ShoppingBag, desc: '日々の支出口座から使ったお金を記録します' },
};

// Today's date in Japan as YYYY-MM-DD
const todayJst = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());

const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#12202F] mb-2">
        {children}
    </label>
);

const inputBase =
    'w-full bg-white border border-[#D9DDD8] rounded-xl text-base text-[#12202F] placeholder:text-[#12202F]/35 focus:outline-none focus:border-[#0F7B5F] focus:ring-2 focus:ring-[#0F7B5F]/40';

const TransactionModal = ({ isOpen, mode: initialMode = 'income', accounts = [], onClose, onSubmit }) => {
    const [mode, setMode] = useState(initialMode);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(todayJst());
    const [toKey, setToKey] = useState('daily'); // transfer destination
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset every time the modal opens
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setAmount('');
            setNote('');
            setDate(todayJst());
            setToKey('daily');
            setCategory(CATEGORIES[0].id);
            setError('');
        }
    }, [isOpen, initialMode]);

    // Escape to close, and lock the page behind the sheet
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const byName = (key) => accounts.find((a) => a.name === ACCT[key].name);
    const balanceOf = (key) => Number(byName(key)?.currentamount ?? 0);

    const validate = () => {
        const num = Number(amount);
        if (!amount || !Number.isInteger(num) || num <= 0) return '1円以上の金額を整数で入力してください';
        if (!date) return '日付を選択してください';
        if (mode === 'income' && !note.trim()) return '収入のメモを入力してください';
        if (mode === 'transfer' && num > balanceOf('working'))
            return `メイン口座の残高が足りません（残高 ${formatYen(balanceOf('working'))}）`;
        if (mode === 'expense' && num > balanceOf('daily'))
            return `日々の支出口座の残高が足りません（残高 ${formatYen(balanceOf('daily'))}）`;
        return null;
    };

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
            ...(mode === 'income' && { toAccountId: byName('working')?.id }),
            ...(mode === 'transfer' && {
                fromAccountId: byName('working')?.id,
                toAccountId: byName(toKey)?.id,
            }),
            ...(mode === 'expense' && { fromAccountId: byName('daily')?.id, category }),
        };

        try {
            await onSubmit?.(payload);
            toast.success('保存しました', { id: 'transaction' });
            onClose?.();
        } catch (err) {
            console.log(err);

            toast.error(err?.response?.data?.message ?? '保存できませんでした。もう一度お試しください。', {
                id: 'transaction',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const ActiveIcon = MODES[mode].Icon;

    // Fixed (locked) account row
    const LockedAccount = ({ k, balanceText }) => {
        const { Icon, label } = ACCT[k];
        return (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#D9DDD8]">
                <div className="w-10 h-10 rounded-lg bg-[#12202F] text-white flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{label}</p>
                    <p className="text-xs text-[#12202F]/60">
                        {balanceText} {formatYen(balanceOf(k))}
                    </p>
                </div>
                <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#12202F]/5 text-[#12202F]/60">固定</span>
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
                className="w-full sm:max-w-md bg-[#F5F6F4] rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92dvh] overflow-y-auto"
                style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#F5F6F4] border-b border-[#D9DDD8] px-5 py-3 flex items-center justify-between">
                    <div>
                        <h2 id="tx-title" className="text-lg font-bold text-[#12202F]">
                            取引を記録
                        </h2>
                        <p className="text-xs text-[#12202F]/60 mt-0.5">{MODES[mode].desc}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/70 active:bg-black/5"
                        aria-label="閉じる"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-5 space-y-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-[#12202F]"
                >
                    {/* Mode tabs */}
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#12202F]/5" role="tablist">
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
                                className={`h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition ${mode === key ? 'bg-[#0F7B5F] text-white' : 'text-[#12202F]/60 active:bg-black/5'
                                    }`}
                            >
                                <cfg.Icon className="h-4 w-4" aria-hidden="true" />
                                {cfg.label}
                            </button>
                        ))}
                    </div>

                    {/* Amount (whole yen) */}
                    <div>
                        <Label htmlFor="tx-amount">金額</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#12202F]/40">¥</span>
                            <input
                                id="tx-amount"
                                type="number"
                                inputMode="numeric"
                                step="1"
                                min="1"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`${inputBase} h-16 pl-10 pr-4 text-2xl font-bold`}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Income: destination is fixed */}
                    {mode === 'income' && (
                        <div>
                            <Label>入金先</Label>
                            <LockedAccount k="working" balanceText="残高" />
                        </div>
                    )}

                    {/* Transfer: from Working (fixed) to Daily Expenses or Emergency */}
                    {mode === 'transfer' && (
                        <>
                            <div>
                                <Label>移動元</Label>
                                <LockedAccount k="working" balanceText="残高" />
                            </div>
                            <div>
                                <Label>移動先</Label>
                                <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="移動先">
                                    {['daily', 'emergency'].map((k) => {
                                        const { Icon, label } = ACCT[k];
                                        const selected = toKey === k;
                                        return (
                                            <button
                                                key={k}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                onClick={() => setToKey(k)}
                                                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${selected ? 'border-[#0F7B5F] bg-green-50 ring-2 ring-[#0F7B5F]/30' : 'border-[#D9DDD8] bg-white'
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
                        </>
                    )}

                    {/* Expense: source is fixed, choose a category */}
                    {mode === 'expense' && (
                        <>
                            <div>
                                <Label>支払い元</Label>
                                <LockedAccount k="daily" balanceText="使える金額" />
                            </div>
                            <div>
                                <Label>カテゴリ</Label>
                                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="カテゴリ">
                                    {CATEGORIES.map(({ id, name, Icon }) => {
                                        const selected = category === id;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                onClick={() => setCategory(id)}
                                                className={`h-14 flex items-center gap-2 px-3 rounded-xl border text-left transition ${selected ? 'border-[#0F7B5F] bg-green-50 ring-2 ring-[#0F7B5F]/30' : 'border-[#D9DDD8] bg-white'
                                                    }`}
                                            >
                                                <Icon
                                                    className={`h-5 w-5 shrink-0 ${selected ? 'text-[#0F7B5F]' : 'text-[#12202F]/50'}`}
                                                    aria-hidden="true"
                                                />
                                                <span className={`text-sm font-semibold truncate ${selected ? 'text-[#0F7B5F]' : ''}`}>{name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Date */}
                    <div>
                        <Label htmlFor="tx-date">日付</Label>
                        <input
                            id="tx-date"
                            type="date"
                            value={date}
                            max={todayJst()}
                            onChange={(e) => setDate(e.target.value)}
                            className={`${inputBase} h-14 px-4`}
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <Label htmlFor="tx-note">
                            メモ{' '}
                            {mode === 'income' ? (
                                <span className="text-red-700">（必須）</span>
                            ) : (
                                <span className="text-[#12202F]/50 font-normal">（任意）</span>
                            )}
                        </Label>
                        <textarea
                            id="tx-note"
                            rows={2}
                            placeholder={
                                mode === 'income' ? '例：10月のアルバイト代' : mode === 'transfer' ? '例：緊急資金に積み立て' : '例：友達とランチ'
                            }
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className={`${inputBase} px-4 py-3 resize-none`}
                        />
                    </div>

                    {/* Validation error */}
                    {error && (
                        <div role="alert" className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                            <CircleAlert className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
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
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-14 rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49] disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                                    保存中…
                                </>
                            ) : (
                                <>
                                    <ActiveIcon className="h-5 w-5" aria-hidden="true" />
                                    {MODES[mode].label}を保存
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