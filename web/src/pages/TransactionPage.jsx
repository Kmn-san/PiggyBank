// pages/TransactionsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { dayKeyOf, dayLabelOf, monthKeyOf } from '../lib/utlis';
import RecordButton from '../components/Transaction/RecordButton';
import PeriodSummary from '../components/Transaction/PeriodSummary';
import TransactionList from '../components/Transaction/TransactionList';
import MonthFilter from '../components/Expenses/MonthFilter';
import useTransactions from '../hooks/useTransactions.js';

const TransactionsPage = ({ onOpenModal }) => {
    const thisMonth = monthKeyOf(new Date().toISOString());
    const [month, setMonth] = useState(thisMonth);

    const { data, isFetching, error, isError } = useTransactions(month);


    useEffect(() => {
        if (isFetching) {
            toast.loading('読み込み中…', { id: 'transactions' });
        } else if (isError) {
            toast.error(error?.response?.data?.message ?? 'データを取得できませんでした。', { id: 'transactions' });
        } else {
            toast.dismiss('transactions');
        }
    }, [isFetching, isError, error]);

    useEffect(() => () => toast.dismiss('transactions'), []);

    const { days, income, expense, count } = useMemo(() => {
        const list = [...(Array.isArray(data) ? data : data?.transactions ?? [])]
            .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));

        const byDay = new Map();
        list.forEach((tx) => {
            const key = dayKeyOf(tx.transactionDate);
            if (!byDay.has(key)) byDay.set(key, { key, label: dayLabelOf(tx.transactionDate), items: [] });
            byDay.get(key).items.push(tx);
        });

        const sumOf = (type) =>
            list.filter((tx) => tx.type === type).reduce((s, tx) => s + Number(tx.amount), 0);

        return { days: [...byDay.values()], income: sumOf('income'), expense: sumOf('expense'), count: list.length };
    }, [data]);

    return (
        <main className="max-w-5xl mx-auto px-4 pt-6 pb-8 space-y-4">
            <h1 className="text-2xl font-bold">取引履歴</h1>

            <RecordButton onOpenModal={onOpenModal} />

            <MonthFilter
                month={month}
                thisMonth={thisMonth}
                isThisMonth={month >= thisMonth}
                setMonth={setMonth}
                total={expense}
            />

            <PeriodSummary
                count={count}
                income={income} />

            <TransactionList days={days} />
        </main>
    );
};

export default TransactionsPage;