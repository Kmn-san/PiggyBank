
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';

import { Card } from '../Card';
import { formatYen } from '../../lib/utlis';

function DailyExpenses({ account = [], onOpenModal }) {
    const { t } = useTranslation();

    const daily = account.find((a) => a.name === 'Daily Expenses');
    const dailyBalance = daily?.currentAmount ?? 0;

    return (
        <Card>
            <p className="text-xs font-semibold text-[#12202F]/60">
                {t('expenses.daily.title')}
            </p>

            <p className="text-3xl font-bold mt-1">
                {formatYen(dailyBalance)}
            </p>

            <p className="text-xs text-[#12202F]/55 mt-1">
                {t('expenses.daily.description')}
            </p>

            <button
                type="button"
                onClick={() => onOpenModal?.('expense')}
                className="mt-4 h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49]"
            >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {t('expenses.daily.recordExpense')}
            </button>
        </Card>
    );
}

export default DailyExpenses;
