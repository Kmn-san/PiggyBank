
import { Card } from '../Card';
import { formatYen } from '../../lib/utlis';
import { useTranslation } from 'react-i18next';

function AccountCard({
    title,
    Icon,
    amount,
    desc,
    amountClass = '',
    children,
    target,
    actions
}) {
    const { t } = useTranslation();

    const progress = target > 0
        ? Math.min((amount / target) * 100, 100)
        : 0;

    return (
        <Card className="relative overflow-hidden flex flex-col h-full">
            <Icon
                className="absolute -right-4 -top-4 h-32 w-32 text-[#12202F]/5"
                aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-2 pr-1">
                <p className="text-xs font-semibold text-[#12202F]/60 wrap-break-word min-w-0">
                    {title}
                </p>

                {actions && (
                    <div className="flex items-center gap-1 shrink-0 relative z-10">
                        {actions}
                    </div>
                )}
            </div>

            <p className={`text-4xl font-bold mt-1 ${amountClass}`}>
                {formatYen(amount)}
            </p>

            <p className="text-xs text-[#12202F]/55 mt-1">
                {desc}
            </p>

            {target != null && target > 0 && (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#12202F]/65">
                            {t('savings.goals.target')}
                        </span>

                        <span className="font-semibold text-[#12202F]">
                            {formatYen(target)}
                        </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-[#E5E9E5] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#0F7B5F] transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-xs text-[#12202F]/55 text-right">
                        {progress.toFixed(1)}%
                    </p>
                </div>
            )}

            <div className="mt-auto pt-5">
                {children}
            </div>
        </Card>
    );
}

export default AccountCard;
