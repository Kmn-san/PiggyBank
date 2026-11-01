import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X, CircleAlert, Loader2 } from 'lucide-react';
import { dayKeyOf, getLabel, TX_STYLE } from '../../lib/utlis';

const todayJst = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());

const inputBase =
    'w-full bg-white border border-[#D9DDD8] rounded-xl text-base text-[#12202F] placeholder:text-[#12202F]/35 focus:outline-none focus:border-[#0F7B5F] focus:ring-2 focus:ring-[#0F7B5F]/40';

// Render it only when a transaction is selected, and give it key={transaction.id}.
// The fields then start from that transaction, with no reset code needed.
const EditTransactionModal = ({ transaction, onClose, onSubmit }) => {
    const [amount, setAmount] = useState(String(transaction.amount));
    const [date, setDate] = useState(dayKeyOf(transaction.transactionDate));
    const [note, setNote] = useState(transaction.note ?? '');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const s = TX_STYLE[transaction.type] ?? TX_STYLE.transfer;
    const { main, sub } = getLabel(transaction);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = Number(amount);
        if (!amount || !Number.isInteger(value) || value <= 0) return setError('1円以上の金額を整数で入力してください');
        if (!date) return setError('日付を選択してください');

        const cleanNote = note.trim() || null;
        const unchanged =
            value === Number(transaction.amount) &&
            date === dayKeyOf(transaction.transactionDate) &&
            cleanNote === (transaction.note ?? null);
        if (unchanged) return onClose?.();           // nothing to save

        setError('');
        setIsSubmitting(true);
        try {
            await onSubmit?.({ amount: value, transactionDate: date, note: cleanNote });
            toast.success('変更しました', { id: 'edit-transaction' });
            onClose?.();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? '変更できませんでした。もう一度お試しください。', { id: 'edit-transaction' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-title"
        >
            <div
                className="w-full sm:max-w-md bg-[#F5F6F4] rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92dvh] overflow-y-auto overflow-x-hidden text-[#12202F]"
                style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 bg-[#F5F6F4] border-b border-[#D9DDD8] px-5 py-3 flex items-center justify-between">
                    <h2 id="edit-title" className="text-lg font-bold">取引を編集</h2>
                    <button type="button" onClick={onClose} aria-label="閉じる"
                        className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/70 active:bg-black/5">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="p-5 space-y-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                    {/* What is being edited (cannot be changed) */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#D9DDD8]">
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${s.badge}`}>
                            <s.Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold wrap-break-word">{main}</p>
                            {sub && <p className="text-xs text-[#12202F]/60 wrap-break-word">{sub}</p>}
                        </div>
                    </div>
                    <p className="text-xs text-[#12202F]/55 -mt-2">種類・口座・カテゴリは変更できません。</p>

                    <div>
                        <label htmlFor="edit-amount" className="block text-sm font-semibold mb-2">金額</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#12202F]/40">¥</span>
                            <input
                                id="edit-amount"
                                type="number"
                                inputMode="numeric"
                                step="1"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`${inputBase} h-16 pl-10 pr-4 text-2xl font-bold`}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="edit-date" className="block text-sm font-semibold mb-2">日付</label>
                        <input
                            id="edit-date"
                            type="date"
                            value={date}
                            max={todayJst()}
                            onChange={(e) => setDate(e.target.value)}
                            className={`${inputBase} h-14 px-4 block min-w-0 max-w-full appearance-none text-left [&::-webkit-date-and-time-value]:text-left`}
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-note" className="block text-sm font-semibold mb-2">
                            メモ <span className="text-[#12202F]/50 font-normal">（任意）</span>
                        </label>
                        <textarea
                            id="edit-note"
                            rows={2}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className={`${inputBase} px-4 py-3 resize-none`}
                        />
                    </div>

                    {error && (
                        <div role="alert" className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                            <CircleAlert className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={onClose}
                            className="h-14 rounded-xl border border-[#D9DDD8] bg-white text-base font-semibold active:bg-black/5">
                            キャンセル
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="h-14 rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49] disabled:opacity-60">
                            {isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />保存中…</>) : '変更を保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionModal;