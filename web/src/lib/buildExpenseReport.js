import { dayKeyOf, monthLabel } from './utlis';
import { getAccountMeta } from './accounts';

// Plain numbers read better for an AI than ¥ with full-width symbols
const yen = (n) => `${Number(n || 0).toLocaleString('ja-JP')}円`;
const TYPE_JP = { income: '収入', expense: '支出', transfer: '振替' };
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export const buildExpenseReport = ({ month, accounts = [], categories = [], transactions = [] }) => {
    // Oldest first, so the AI reads the month in order
    const list = [...transactions].sort((a, b) => a.transactionDate.localeCompare(b.transactionDate));
    const sumOf = (type) => list.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0);
    const catTotal = categories.reduce((s, c) => s + Number(c.amount), 0);

    const accountLines = accounts.map((a) => `- ${getAccountMeta(a).label}: ${yen(a.currentAmount)}`);

    const categoryLines = [...categories]
        .sort((a, b) => Number(b.amount) - Number(a.amount))
        .map((c) => `- ${cap(c.category)}: ${yen(c.amount)}（${catTotal ? Math.round((Number(c.amount) / catTotal) * 100) : 0}%）`);

    const txLines = list.map((t) => {
        const date = dayKeyOf(t.transactionDate).slice(5).replace('-', '/');          // 10/29
        const detail = t.category
            ? cap(t.category)
            : [t.fromAccountName, t.toAccountName].filter(Boolean).join(' → ');
        const note = t.note ? `（${t.note}）` : '';
        return `${date} ${TYPE_JP[t.type] ?? t.type} ${detail} ${yen(t.amount)}${note}`;
    });

    return [
        `以下は私の${monthLabel(month)}の支出データです。`,
        'このデータをもとに、次のことを日本語で教えてください。',
        '1. 支出の特徴や傾向',
        '2. 無駄遣いになっていそうな点',
        '3. 来月からできる具体的な節約・貯金のアドバイス（3つ程度）',
        '',
        '■ 今月のまとめ',
        `- 収入の合計: ${yen(sumOf('income'))}`,
        `- 支出の合計: ${yen(sumOf('expense'))}`,
        '',
        '■ 口座の残高',
        ...(accountLines.length ? accountLines : ['（なし）']),
        '',
        '■ カテゴリ別の支出',
        ...(categoryLines.length ? categoryLines : ['（なし）']),
        '',
        `■ 取引の一覧（${list.length}件）`,
        ...(txLines.length ? txLines : ['（なし）']),
    ].join('\n');
};