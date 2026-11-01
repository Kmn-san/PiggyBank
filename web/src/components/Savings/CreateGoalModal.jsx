import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X, Target, CircleAlert, Loader2 } from 'lucide-react';

const inputBase =
    'w-full bg-white border border-[#D9DDD8] rounded-xl text-base text-[#12202F] placeholder:text-[#12202F]/35 focus:outline-none focus:border-[#0F7B5F] focus:ring-2 focus:ring-[#0F7B5F]/40';

const CreateGoalModal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setError('');
        }
    }, [isOpen]);

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

    const validate = () => {
        const n = name.trim();
        if (!n) return '目標の名前を入力してください';
        if (n.length > 30) return '目標の名前は30文字以内で入力してください';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = validate();
        if (message) return setError(message);

        setError('');
        setIsSubmitting(true);
        try {
            await onSubmit?.({ name: name.trim() });
            toast.success('目標口座を作成しました', { id: 'goal' });
            onClose?.();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? '作成できませんでした。もう一度お試しください。', { id: 'goal' });
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
            aria-labelledby="goal-title"
        >
            <div
                className="w-full sm:max-w-md bg-[#F5F6F4] rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92dvh] overflow-y-auto text-[#12202F]"
                style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-[#F5F6F4] border-b border-[#D9DDD8] px-5 py-3 flex items-center justify-between">
                    <div>
                        <h2 id="goal-title" className="text-lg font-bold">目標口座を作成</h2>
                        <p className="text-xs text-[#12202F]/60 mt-0.5">目標のために貯める口座を追加します</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="閉じる"
                        className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/70 active:bg-black/5">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="p-5 space-y-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                    <div>
                        <label htmlFor="goal-name" className="block text-sm font-semibold mb-2">目標の名前</label>
                        <div className="relative">
                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#12202F]/40" aria-hidden="true" />
                            <input
                                id="goal-name"
                                type="text"
                                maxLength={30}
                                placeholder="例：旅行、ノートPC"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`${inputBase} h-14 pl-12 pr-4`}
                                autoFocus
                            />
                        </div>
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
                            {isSubmitting ? (
                                <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />作成中…</>
                            ) : (
                                '作成する'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGoalModal;