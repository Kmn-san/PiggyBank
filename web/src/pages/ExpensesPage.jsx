// pages/ExpensesPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { monthKeyOf } from '../lib/utlis';
import DailyExpenses from '../components/Expenses/DailyExpenses';
import MonthFilter from '../components/Expenses/MonthFilter';
import ExpensesCategories from '../components/Expenses/ExpensesCategories';
import { useExpenses } from '../hooks/useExpenses';

const ExpensesPage = ({ onOpenModal }) => {
    const thisMonth = monthKeyOf(new Date().toISOString());
    const [month, setMonth] = useState(thisMonth);

    const { data, isFetching, error, isError } = useExpenses(month);

    useEffect(() => {
        if (isFetching) {
            toast.loading('読み込み中…', { id: 'expenses' });
        } else if (isError) {
            toast.error(error?.response?.data?.message ?? 'データを取得できませんでした。', { id: 'expenses' });
        } else {
            toast.dismiss('expenses');
        }
    }, [isFetching, isError, error]);

    useEffect(() => () => toast.dismiss('expenses'), []);

    const { categories, total } = useMemo(() => {
        const list = (data?.expenses ?? [])
            .map((e) => ({ category: e.category, amount: Number(e.amount) }))
            .filter((e) => e.amount > 0)
            .sort((a, b) => b.amount - a.amount);

        return { categories: list, total: list.reduce((sum, e) => sum + e.amount, 0) };
    }, [data]);

    return (
        <main className="max-w-5xl mx-auto px-4 pt-6 pb-8 space-y-4">
            <h1 className="text-2xl font-bold">支出</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="space-y-4">
                    <DailyExpenses account={data?.account} onOpenModal={onOpenModal} />

                    <MonthFilter
                        month={month}
                        thisMonth={thisMonth}
                        isThisMonth={month >= thisMonth}
                        count={categories.length}
                        total={total}
                        setMonth={setMonth}
                    />
                </div>

                <ExpensesCategories categories={categories} total={total} month={month} />
            </div>
        </main>
    );
};

export default ExpensesPage;