import { ArrowDownRight, ArrowLeftRight, ArrowUpRight } from "lucide-react";

export const formatYen = (v) =>
    new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(v);

export const TX_STYLE = {
    income: { sign: '+', Icon: ArrowDownRight, badge: 'bg-green-50 text-[#0F7B5F]', amount: 'text-[#0F7B5F]' },
    expense: { sign: '-', Icon: ArrowUpRight, badge: 'bg-red-50 text-red-700', amount: 'text-red-700' },
    transfer: { sign: '', Icon: ArrowLeftRight, badge: 'bg-[#12202F]/5 text-[#12202F]/70', amount: 'text-[#12202F]' },
};

export const FONT_JP = "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";

const TIMEZONE = 'Asia/Tokyo'

const toDate = (iso) => {
    if (!iso) return null
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? null : d
}

// 2026/10/25
export const formatDateFull = (iso) => {
    const d = toDate(iso)
    if (!d) return ''
    return new Intl.DateTimeFormat('ja-JP', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(d)
}
