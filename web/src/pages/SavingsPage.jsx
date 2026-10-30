import { ArrowLeftRight, Plus, ShieldCheck, Target, Wallet } from 'lucide-react';
import { Card } from '../components/Card';
import AccountCard from '../components/Savings/AccountCard';
import { useDashboard } from '../hooks/useDashboard';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TransactionModal from '../components/TransactionModal';

const WORKING = 'Working Account';
const EMERGENCY = 'Emergency Account';

const primaryBtn =
    'h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49]';

const SavingsPage = () => {
    const { data, isPending, error, isError } = useDashboard();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('income');

    const openModal = (mode) => {
        setModalMode(mode);
        setModalOpen(true);
    };

    const handleSubmit = (payload) => {
        console.log('Transaction submitted:', payload);
    };
    useEffect(() => {
        if (isPending) {
            toast.loading('読み込み中…', { id: 'savings' });
        } else if (isError) {
            toast.error(
                error?.response?.data?.message ?? 'データを取得できませんでした。',
                { id: 'savings' }
            );
        } else {
            toast.dismiss('savings');
        }
    }, [isPending, isError, error]);


    if (!data) {
        return <div className="min-h-screen bg-[#F5F6F4]" />;
    }
    const accounts = Array.isArray(data) ? data : data?.accounts ?? [];
    const amountOf = (name) =>
        Number(accounts.find((a) => a.name === name)?.currentamount ?? 0);

    // Goal accounts = every savings account except the Emergency one
    const goals = data?.accounts.filter((a) => a.type === 'savings' && a.name !== EMERGENCY);

    return (
        <main className="max-w-5xl mx-auto px-4 pt-6 pb-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">貯蓄</h1>
                <p className="text-sm text-[#12202F]/60 mt-1">緊急資金、メイン口座、目標口座の残高を確認できます</p>
            </div>

            {/* Emergency + Main: same size, side by side on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccountCard
                    Icon={ShieldCheck}
                    title="緊急資金口座"
                    amount={amountOf(EMERGENCY)}
                    desc="急な出費に備えて貯めておくお金です"
                    amountClass="text-[#0F7B5F]"
                >
                    <button type="button" onClick={() => openModal('transfer', EMERGENCY)} className={primaryBtn}>
                        <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />
                        メイン口座から積み立てる
                    </button>
                </AccountCard>

                <AccountCard
                    Icon={Wallet}
                    title="メイン口座"
                    amount={amountOf(WORKING)}
                    desc="収入はすべてここに入ります"
                >
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => openModal('income')}
                            className="h-14 rounded-xl bg-[#12202F] text-white text-sm font-semibold flex items-center justify-center gap-1.5 active:bg-[#12202F]/90"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            収入を記録
                        </button>
                        <button
                            type="button"
                            onClick={() => openModal('transfer')}
                            className="h-14 rounded-xl border border-[#D9DDD8] bg-white text-sm font-semibold flex items-center justify-center gap-1.5 active:bg-black/5"
                        >
                            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                            資金を移動
                        </button>
                    </div>
                </AccountCard>
            </div>

            {/* Goal accounts: same card, same size */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2">
                        <Target className="h-5 w-5 text-[#0F7B5F]" aria-hidden="true" />
                        目標口座
                    </h2>
                    <span className="text-xs text-[#12202F]/55">{goals.length}件</span>
                </div>

                {goals.length === 0 ? (
                    <Card>
                        <p className="text-sm text-[#12202F]/55 py-6 text-center">目標口座はまだありません</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {goals.map((goal) => (
                            <AccountCard
                                key={goal.id ?? goal.name}
                                Icon={Target}
                                title={goal.name}
                                amount={Number(goal.currentamount ?? 0)}
                                desc="目標のために貯めているお金です"
                                amountClass="text-[#0F7B5F]"
                                target={goal.target ? Number(goal.target) : null}
                            >
                                <button type="button" onClick={() => onOpenModal?.('transfer', goal.name)} className={primaryBtn}>
                                    <Plus className="h-5 w-5" aria-hidden="true" />
                                    積み立てる
                                </button>
                            </AccountCard>
                        ))}
                    </div>
                )}
            </section>
            <TransactionModal
                isOpen={modalOpen}
                mode={modalMode}
                accounts={accounts}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </main>
    );
};

export default SavingsPage;