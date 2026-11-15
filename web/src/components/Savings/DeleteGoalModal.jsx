
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, TriangleAlert } from 'lucide-react';
import { formatYen } from '../../lib/utlis';
import { useTranslation } from 'react-i18next';

const DeleteGoalModal = ({ goal, onClose, onConfirm, onTransfer }) => {
    const { t } = useTranslation();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const balance = Number(goal.currentAmount ?? 0);
    const hasMoney = balance > 0;

    useEffect(() => {
        const onKey = (e) =>
            e.key === 'Escape' && !isSubmitting && onClose?.();

        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose, isSubmitting]);

    const handleDelete = async () => {
        setIsSubmitting(true);

        try {
            await onConfirm?.();

            toast.success(t('deleteGoal.success'), {
                id: 'goal-delete'
            });

            onClose?.();
        } catch (err) {
            toast.error(
                err?.response?.data?.message ?? t('deleteGoal.error'),
                { id: 'goal-delete' }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
            onClick={() => !isSubmitting && onClose?.()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="del-title"
            aria-describedby="del-desc"
        >
            <div
                className="w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 text-[#12202F] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                style={{
                    fontFamily: "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Warning icon */}
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${hasMoney
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                >
                    <TriangleAlert
                        className="h-6 w-6"
                        aria-hidden="true"
                    />
                </div>

                {/* Title */}
                <h2 id="del-title" className="text-lg font-bold">
                    {hasMoney
                        ? t('deleteGoal.transferRequired.title')
                        : t('deleteGoal.confirm.title')}
                </h2>

                {/* Description */}
                <p
                    id="del-desc"
                    className="text-sm text-[#12202F]/70 mt-2 leading-relaxed wrap-break-word"
                >
                    {hasMoney
                        ? t('deleteGoal.transferRequired.description', {
                            name: goal.name,
                            amount: formatYen(balance)
                        })
                        : t('deleteGoal.confirm.description', {
                            name: goal.name
                        })}
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-12 rounded-xl border border-[#D9DDD8] bg-white text-base font-semibold active:bg-black/5 disabled:opacity-60"
                    >
                        {hasMoney
                            ? t('common.close')
                            : t('common.cancel')}
                    </button>

                    {hasMoney ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClose?.();
                                onTransfer?.();
                            }}
                            className="h-12 rounded-xl bg-[#0F7B5F] text-white text-base font-semibold active:bg-[#0B5F49]"
                        >
                            {t('deleteGoal.transferRequired.transfer')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="h-12 rounded-xl bg-red-700 text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-red-800 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        className="h-5 w-5 animate-spin"
                                        aria-hidden="true"
                                    />
                                    {t('deleteGoal.deleting')}
                                </>
                            ) : (
                                t('deleteGoal.confirm.delete')
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteGoalModal;
