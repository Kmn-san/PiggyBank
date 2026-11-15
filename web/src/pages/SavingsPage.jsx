
import {
    ArrowLeftRight,
    Plus,
    ShieldCheck,
    Target,
    Trash2,
    Wallet
} from 'lucide-react';
import { Card } from '../components/Card';
import AccountCard from '../components/Savings/AccountCard';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TransactionModal from '../components/TransactionModal';
import { useSavings } from '../hooks/useSavings';
import useTransferAccounts from '../hooks/useTransferAccounts';
import useCreateGoal from '../hooks/useCreateGoal';
import CreateGoalModal from '../components/Savings/CreateGoalModal';
import useDeleteGoal from '../hooks/useDeleteGoal';
import DeleteGoalModal from '../components/Savings/DeleteGoalModal';
import { useTranslation } from 'react-i18next';

const WORKING = 'Working Account';
const EMERGENCY = 'Emergency Account';

const primaryBtn =
    'h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49]';

const SavingsPage = () => {
    const { t } = useTranslation();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('income');
    const [goalOpen, setGoalOpen] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const deleteMutation = useDeleteGoal();
    const { data, isPending, error, isError } = useSavings();
    const { submit } = useTransferAccounts();
    const createGoal = useCreateGoal();

    const newGoalBtn =
        'h-11 px-4 rounded-xl bg-[#0F7B5F] text-white text-sm font-semibold flex items-center gap-1.5 active:bg-[#0B5F49]';

    const openModal = (mode) => {
        setModalMode(mode);
        setModalOpen(true);
    };

    useEffect(() => {
        if (isPending) {
            toast.loading(t('savings.loading'), { id: 'savings' });
        } else if (isError) {
            toast.error(
                error?.response?.data?.message ?? t('savings.fetchError'),
                { id: 'savings' }
            );
        } else {
            toast.dismiss('savings');
        }
    }, [isPending, isError, error, t]);

    if (!data) {
        return <div className="min-h-screen bg-[#F5F6F4]" />;
    }

    const accounts = Array.isArray(data) ? data : data ?? [];

    const amountOf = (name) =>
        Number(accounts.find((a) => a.name === name)?.currentAmount ?? 0);

    const goals = accounts.filter(
        (a) => a.type === 'savings' && a.name !== EMERGENCY
    );

    return (
        <main className="max-w-5xl mx-auto px-4 pt-6 pb-8 space-y-6">
            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-bold">
                    {t('savings.title')}
                </h1>
                <p className="text-sm text-[#12202F]/60 mt-1">
                    {t('savings.description')}
                </p>
            </div>

            {/* Emergency + Main accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccountCard
                    Icon={ShieldCheck}
                    title={t('savings.emergency.title')}
                    amount={amountOf(EMERGENCY)}
                    desc={t('savings.emergency.description')}
                    amountClass="text-[#0F7B5F]"
                >
                    <button
                        type="button"
                        onClick={() => openModal('transfer', EMERGENCY)}
                        className={primaryBtn}
                    >
                        <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />
                        {t('savings.emergency.transfer')}
                    </button>
                </AccountCard>

                <AccountCard
                    Icon={Wallet}
                    title={t('savings.working.title')}
                    amount={amountOf(WORKING)}
                    desc={t('savings.working.description')}
                >
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => openModal('income')}
                            className="h-14 rounded-xl bg-[#12202F] text-white text-sm font-semibold flex items-center justify-center gap-1.5 active:bg-[#12202F]/90"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            {t('savings.working.recordIncome')}
                        </button>

                        <button
                            type="button"
                            onClick={() => openModal('transfer')}
                            className="h-14 rounded-xl border border-[#D9DDD8] bg-white text-sm font-semibold flex items-center justify-center gap-1.5 active:bg-black/5"
                        >
                            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                            {t('savings.working.transfer')}
                        </button>
                    </div>
                </AccountCard>
            </div>

            {/* Goal accounts */}
            <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold flex items-center gap-2 min-w-0">
                        <Target
                            className="h-5 w-5 text-[#0F7B5F] shrink-0"
                            aria-hidden="true"
                        />
                        <span>{t('savings.goals.title')}</span>
                        <span className="text-xs font-normal text-[#12202F]/55 whitespace-nowrap">
                            {t('savings.goals.count', { count: goals.length })}
                        </span>
                    </h2>

                    <button
                        type="button"
                        onClick={() => setGoalOpen(true)}
                        className={newGoalBtn}
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        {t('savings.goals.create')}
                    </button>
                </div>

                {goals.length === 0 ? (
                    <Card>
                        <p className="text-sm text-[#12202F]/55 pt-4 text-center">
                            {t('savings.goals.empty')}
                        </p>

                        <div className="flex justify-center py-4">
                            <button
                                type="button"
                                onClick={() => setGoalOpen(true)}
                                className={newGoalBtn}
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                {t('savings.goals.createFirst')}
                            </button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {goals.map((goal) => (
                            <AccountCard
                                key={goal.id ?? goal.name}
                                Icon={Target}
                                title={goal.name}
                                amount={Number(goal.currentAmount ?? 0)}
                                desc={t('savings.goals.description')}
                                amountClass="text-[#0F7B5F]"
                                target={goal.target ? Number(goal.target) : null}
                            >
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => openModal('transfer')}
                                        className={primaryBtn}
                                    >
                                        <Plus className="h-5 w-5" aria-hidden="true" />
                                        {t('savings.goals.deposit')}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDeleting(goal)}
                                        className="h-11 w-full rounded-xl text-sm font-semibold text-red-700 flex items-center justify-center gap-1.5 active:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        {t('savings.goals.delete')}
                                    </button>
                                </div>
                            </AccountCard>
                        ))}
                    </div>
                )}
            </section>

            {/* Modals */}
            <TransactionModal
                isOpen={modalOpen}
                mode={modalMode}
                accounts={accounts}
                onClose={() => setModalOpen(false)}
                onSubmit={submit}
            />

            <CreateGoalModal
                isOpen={goalOpen}
                onClose={() => setGoalOpen(false)}
                onSubmit={createGoal.mutateAsync}
            />

            {deleting && (
                <DeleteGoalModal
                    key={deleting.id}
                    goal={deleting}
                    onClose={() => setDeleting(null)}
                    onConfirm={() => deleteMutation.mutateAsync(deleting.id)}
                    onTransfer={() => openModal('transfer')}
                />
            )}
        </main>
    );
};

export default SavingsPage;
