
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';

function MoneyFlow() {
    const { t } = useTranslation();

    const FLOW_STEPS = [
        {
            title: t('dashboard.moneyFlow.steps.income.title'),
            text: t('dashboard.moneyFlow.steps.income.description'),
        },
        {
            title: t('dashboard.moneyFlow.steps.transfer.title'),
            text: t('dashboard.moneyFlow.steps.transfer.description'),
        },
        {
            title: t('dashboard.moneyFlow.steps.savings.title'),
            text: t('dashboard.moneyFlow.steps.savings.description'),
        },
    ];

    return (
        <Card>
            <h2 className="text-sm font-bold mb-3">
                {t('dashboard.moneyFlow.title')}
            </h2>

            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FLOW_STEPS.map((s, i) => (
                    <li
                        key={i}
                        className="flex items-center gap-3 rounded-xl bg-[#F5F6F4] p-3"
                    >
                        <span className="w-7 h-7 shrink-0 rounded-full bg-[#0F7B5F] text-white text-sm font-bold flex items-center justify-center">
                            {i + 1}
                        </span>

                        <div>
                            <p className="text-sm font-semibold">{s.title}</p>
                            <p className="text-xs text-[#12202F]/60">{s.text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </Card>
    );
}

export default MoneyFlow;
