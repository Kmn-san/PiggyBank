import DashbaordHeader from '../components/Dashbaord/DashbaordHeader';
import SummaryCard from '../components/Dashbaord/SummaryCard';
import { FONT_JP } from '../lib/utlis';
import Charts from '../components/Dashbaord/Charts';
import RecentTransactions from '../components/Dashbaord/RecentTransactions';
import MoneyFlow from '../components/Dashbaord/MoneyFlow';
import { useDashboard } from '../hooks/useDashboard';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { data, isPending, error, isError } = useDashboard();
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

    // Remove the toast if the user leaves the page while it is still loading
    useEffect(() => () => toast.dismiss('dashboard'), []);

    // No data yet (loading or failed): show the empty page background only
    if (!data) {
        return <div className="min-h-screen bg-[#F5F6F4]" />;
    }

    return (
        <div className="min-h-screen bg-[#F5F6F4] text-[#12202F]" style={{ fontFamily: FONT_JP }}>

            <main className="max-w-5xl mx-auto px-4 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] space-y-4">

                {/* Summary cards */}
                <SummaryCard accounts={data.accounts} />

                {/* Money flow */}
                <MoneyFlow />

                {/* Charts */}
                <Charts expenses={data.expenses} />

                {/* Recent transactions */}
                <RecentTransactions transactions={data.transactions} />
            </main>
        </div >
    );
};

export default Dashboard;