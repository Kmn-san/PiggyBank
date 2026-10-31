import { ChevronRight } from 'lucide-react';
import { Card } from '../Card';
import { useNavigate } from 'react-router-dom';
import { formatDateFull, formatYen, TX_STYLE } from '../../lib/utlis';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const getLabel = (tx) => {
    if (tx.category) return { main: capitalize(tx.category), sub: tx.fromAccountName };
    const { fromAccountName: from, toAccountName: to } = tx;
    if (from && to) return { main: from, sub: `→ ${to}` };
    return { main: from ?? to ?? '', sub: null };
};

const RecentTransactions = ({ transactions = [] }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold">最近の取引</h2>
                <button
                    type="button"
                    onClick={() => navigate('/transaction')}
                    className="h-11 -mr-2 px-2 text-sm font-semibold text-[#0F7B5F] flex items-center gap-0.5"
                >
                    すべて見る
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>

            {transactions.length === 0 ? (
                <p className="text-sm text-[#12202F]/55 py-8 text-center">取引はまだありません</p>
            ) : (
                <ul className="divide-y divide-[#D9DDD8]">
                    {transactions.slice(0, 4).map((tx) => {
                        const s = TX_STYLE[tx.type] ?? TX_STYLE.transfer;
                        const { main, sub } = getLabel(tx);
                        return (
                            <li key={tx.id} className="py-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${s.badge}`}>
                                        <s.Icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold wrap-break-word">{main}</p>
                                        {sub && (
                                            <p className="text-xs text-[#12202F]/60 wrap-break-word">{sub}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className={`text-sm font-bold ${s.amount}`}>
                                        {s.sign}
                                        {formatYen(tx.amount)}
                                    </p>
                                    <p className="text-[11px] text-[#12202F]/50">
                                        {formatDateFull(tx.transactionDate)}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
};

export default RecentTransactions;