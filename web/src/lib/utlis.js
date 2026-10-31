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

export const parts = (iso, opts) => new Intl.DateTimeFormat('sv-SE', { timeZone: TIMEZONE, ...opts }).format(new Date(iso));

export const monthKeyOf = (iso) => parts(iso, { year: 'numeric', month: '2-digit' }); // "2026-10"

export const dayKeyOf = (iso) => parts(iso, { year: 'numeric', month: '2-digit', day: '2-digit' }); // "2026-10-29"

export const dayLabelOf = (iso) =>
    new Intl.DateTimeFormat('ja-JP', { timeZone: TIMEZONE, month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(iso)); // 10月29日(木)

export const monthLabel = (key) => {
    const [y, m] = key.split('-');
    return `${y}年${Number(m)}月`;
};

export const shiftMonth = (key, delta) => {
    const [y, m] = key.split('-').map(Number);
    const idx = y * 12 + (m - 1) + delta;
    return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, '0')}`;
};

export const CATEGORY_COLORS = {
    food: '#0F7B5F',
    transport: '#E8A317',
    education: '#2B7FB8',
    entertainment: '#D9480F',
    shopping: '#7C5CBF',
}
export const FALLBACK_COLORS = ['#64748B', '#B45309', '#7C5CBF']

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const getLabel = (tx) => {
    if (tx.category) return { main: capitalize(tx.category), sub: tx.fromAccountName };
    if (tx.fromAccountName && tx.toAccountName) return { main: tx.fromAccountName, sub: `→ ${tx.toAccountName}` };
    return { main: 'Income', sub: tx.toAccountName ? `→ ${tx.toAccountName}` : null };
};

