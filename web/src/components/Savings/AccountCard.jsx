import { Card } from '../Card';
import { formatYen } from '../../lib/utlis';

function AccountCard({ title, Icon, amount, desc, amountClass = '', children }) {

    return (
        <Card className="relative overflow-hidden flex flex-col h-full">
            <Icon className="absolute -right-4 -top-4 h-32 w-32 text-[#12202F]/5" aria-hidden="true" />

            <p className="text-xs font-semibold text-[#12202F]/60 wrap-break-word pr-16">{title}</p>
            <p className={`text-4xl font-bold mt-1 ${amountClass}`}>{formatYen(amount)}</p>
            <p className="text-xs text-[#12202F]/55 mt-1">{desc}</p>


            <div className="mt-auto pt-5">{children}</div>
        </Card>
    );
}

export default AccountCard