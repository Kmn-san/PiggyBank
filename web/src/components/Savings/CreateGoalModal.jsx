
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X, Target, CircleAlert, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const inputBase =
    'w-full bg-white border border-[#D9DDD8] rounded-xl text-base text-[#12202F] placeholder:text-[#12202F]/35 focus:outline-none focus:border-[#0F7B5F] focus:ring-2 focus:ring-[#0F7B5F]/40';

const CreateGoalModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name ?? '')
            setTargetAmount(
                initialData?.targetAmount != null
                    ? String(initialData.targetAmount)
                    : ''
            )
            setError('')
        }
    }, [isOpen, initialData])

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

        if (!n) return t('createGoal.validation.required');
        if (n.length > 30) return t('createGoal.validation.maxLength');

        if (!targetAmount) return t('createGoal.validation.amountRequired');

        const amount = Number(targetAmount);

        if (!Number.isInteger(amount) || amount <= 0) {
            return t('createGoal.validation.invalidAmount');
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = validate();

        if (message) return setError(message);

        setError('');
        setIsSubmitting(true);

        try {
            await onSubmit?.({ name: name.trim(), targetAmount: Number(targetAmount) });

            toast.success(t('createGoal.success'), { id: 'goal' });
            onClose?.();
        } catch (err) {
            toast.error(
                err?.response?.data?.message ?? t('createGoal.error'),
                { id: 'goal' }
            );
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
                style={{
                    fontFamily: "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#F5F6F4] border-b border-[#D9DDD8] px-5 py-3 flex items-center justify-between">
                    <div>
                        <h2 id="goal-title" className="text-lg font-bold">
                            {initialData
                                ? t('createGoal.editTitle')
                                : t('createGoal.title')}
                        </h2>

                        <p className="text-xs text-[#12202F]/60 mt-0.5">
                            {t('createGoal.description')}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('common.close')}
                        className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/70 active:bg-black/5"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-5 space-y-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                >
                    <div>
                        <label
                            htmlFor="goal-name"
                            className="block text-sm font-semibold mb-2"
                        >
                            {t('createGoal.nameLabel')}
                        </label>

                        <div className="relative">
                            <Target
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#12202F]/40"
                                aria-hidden="true"
                            />

                            <input
                                id="goal-name"
                                type="text"
                                maxLength={30}
                                placeholder={t('createGoal.placeholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`${inputBase} h-14 pl-12 pr-4`}
                                autoFocus
                            />
                        </div>
                        <label
                            htmlFor="goal-amount"
                            className="block text-sm font-semibold mb-2"
                        >
                            {t('createGoal.amountLabel')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#12202F]/50">
                                ¥
                            </span>

                            <input
                                id="goal-amount"
                                type="number"
                                min="1"
                                step="1"
                                placeholder="10000"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                className={`${inputBase} h-14 pl-12 pr-4`}
                                autoFocus
                            />
                        </div>
                    </div>

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

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-3">
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
                                    {t('createGoal.submitting')}
                                </>
                            ) : (
                                initialData
                                    ? t('createGoal.editSubmit')
                                    : t('createGoal.submit')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGoalModal;
