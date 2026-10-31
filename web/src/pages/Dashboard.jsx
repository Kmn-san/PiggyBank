import DashbaordHeader from '../components/Dashbaord/DashbaordHeader';
import SummaryCard from '../components/Dashbaord/SummaryCard';
import { FONT_JP } from '../lib/utlis';
import Charts from '../components/Dashbaord/Charts';
import RecentTransactions from '../components/Dashbaord/RecentTransactions';
import MoneyFlow from '../components/Dashbaord/MoneyFlow';
import { useDashboard } from '../hooks/useDashboard';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TransactionModal from '../components/TransactionModal';
import useTrasaction from '../hooks/useTrasaction';

const Dashboard = () => {
    const { data, isPending, error, isError } = useDashboard();
    const { transferAccounts } = useTrasaction()

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('income');

    const openModal = (mode) => {
        setModalMode(mode);
        setModalOpen(true);
    };

    const handleSubmit = (payload) => {
        transferAccounts.mutate(payload)
    };

    useEffect(() => {
        if (isPending) {
            toast.loading('読み込み中…', { id: 'dashboard' });
        } else if (isError) {
            toast.error(
                error?.response?.data?.message ?? 'データを取得できませんでした。',
                { id: 'dashboard' }
            );
        } else {
            toast.dismiss('dashboard');
        }
    }, [isPending, isError, error]);

    useEffect(() => () => toast.dismiss('dashboard'), []);

    if (!data) {
        return <div className="min-h-screen bg-[#F5F6F4]" />;
    }

    return (
        <div className="min-h-screen bg-[#F5F6F4] text-[#12202F]" style={{ fontFamily: FONT_JP }}>

            <main className="max-w-5xl mx-auto px-4 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] space-y-4">

                {/* Summary cards */}
                <SummaryCard accounts={data.accounts} onOpenModal={openModal} />

                {/* Money flow */}
                <MoneyFlow />

                {/* Charts */}
                <Charts expenses={data.expenses} />

                {/* Recent transactions */}
                <RecentTransactions transactions={data.transactions} />


                <TransactionModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    accounts={data.accounts}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSubmit}
                />
            </main>
        </div >
    );
};

export default Dashboard;