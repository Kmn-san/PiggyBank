import { ArrowLeftRight, Plus, ShieldCheck, ShoppingBag, Wallet } from "lucide-react";
import { formatYen } from "../../lib/utlis.js"
import { Card } from "../Card.jsx"

const ACCOUNT = {
    working: "Working Account",
    daily: "Daily Expenses",
    emergency: "Emergency Account",
}

function SummaryCard({ accounts = [], onOpenModal }) {

    const amountOf = (name) =>
        accounts.find((a) => a.name === name)?.currentamount ?? 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Working account: record income or transfer */}
            <section className="rounded-2xl bg-[#12202F] text-white p-5 relative overflow-hidden">
                <Wallet className="absolute -right-4 -top-4 h-28 w-28 text-white/10" aria-hidden="true" />
                <p className="text-xs font-semibold text-white/70">メイン口座</p>
                <p className="text-3xl font-bold mt-1">{formatYen(amountOf(ACCOUNT.working))}</p>
                <p className="text-xs text-white/60 mt-1">収入はすべてここに入ります</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => onOpenModal?.('income')}
                        className="h-12 rounded-xl bg-white text-[#12202F] text-sm font-semibold flex items-center justify-center gap-1.5 active:bg-white/80"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        収入を記録
                    </button>
                    <button
                        type="button"
                        onClick={() => onOpenModal?.('transfer')}
                        className="h-12 rounded-xl border border-white/30 text-white text-sm font-semibold flex items-center justify-center gap-1.5 active:bg-white/10"
                    >
                        <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                        資金を移動
                    </button>
                </div>
            </section>

            {/* Daily expenses: record expenses. First on phones, since it is the most-used action */}
            <Card className="order-first md:order-0">
                <p className="text-xs font-semibold text-[#12202F]/60">日々の支出口座</p>
                <p className="text-3xl font-bold mt-1">{formatYen(amountOf(ACCOUNT.daily))}</p>
                <p className="text-xs text-[#12202F]/55 mt-1">日々の支出はここから使います</p>
                <button
                    type="button"
                    onClick={() => onOpenModal?.('expense')}
                    className="mt-4 h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49]"
                >
                    <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                    支出を記録
                </button>
            </Card>

            {/* Emergency account: balance only */}
            <Card className="relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -top-4 h-28 w-28 text-[#0F7B5F]/10" aria-hidden="true" />
                <p className="text-xs font-semibold text-[#12202F]/60">緊急資金口座</p>
                <p className="text-3xl font-bold mt-1">{formatYen(amountOf(ACCOUNT.emergency))}</p>
                <p className="text-xs text-[#12202F]/55 mt-1">急な出費に備えて貯めておくお金です</p>
            </Card>
        </div>
    )
}

export default SummaryCard