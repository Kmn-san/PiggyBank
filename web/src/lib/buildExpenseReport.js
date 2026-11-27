
import i18n from '../lib/i18n';
import { dayKeyOf } from './utlis';
import { getAccountMeta } from './accounts';

const cap = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const buildExpenseReport = ({
    month,
    accounts = [],
    categories = [],
    transactions = [],
    language = i18n.language,
}) => {
    // Use the default translation namespace
    const t = i18n.getFixedT(language, 'translation');

    // Format currency according to selected language
    const locale =
        language === 'ja' ? 'ja-JP' :
            language === 'zh' ? 'zh-CN' :
                'en-US';

    const formatAmount = (amount) => {
        const value = Number(amount || 0).toLocaleString(locale);
        return `${value} ${t('report.currency')}`;
    };

    // Oldest transactions first
    const list = [...transactions].sort((a, b) =>
        a.transactionDate.localeCompare(b.transactionDate)
    );

    // Calculate totals by transaction type
    const sumOf = (type) =>
        list
            .filter((tx) => tx.type === type)
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Calculate total categorized expenses
    const catTotal = categories.reduce(
        (sum, c) => sum + Number(c.amount),
        0
    );

    // Account balances
    const accountLines = accounts.map((a) =>
        `- ${getAccountMeta(a).label}: ${formatAmount(a.currentAmount)}`
    );

    // Category expenses, sorted from highest to lowest
    const categoryLines = [...categories]
        .sort((a, b) => Number(b.amount) - Number(a.amount))
        .map((c) => {
            const categoryName = i18n.t(`categories.${c.category}`, {
                lng: language,
                defaultValue: cap(c.category),
            });

            const percentage = catTotal
                ? Math.round((Number(c.amount) / catTotal) * 100)
                : 0;

            return `- ${categoryName}: ${formatAmount(c.amount)} (${percentage}%)`;
        });

    // Transaction history
    const txLines = list.map((tx) => {
        const date = dayKeyOf(tx.transactionDate)
            .slice(5)
            .replace('-', '/');

        const detail = tx.category
            ? i18n.t(`categories.${tx.category}`, {
                lng: language,
                defaultValue: cap(tx.category),
            })
            : [tx.fromAccountName, tx.toAccountName]
                .filter(Boolean)
                .join(' → ');

        const note = tx.note ? ` (${tx.note})` : '';

        return `${date} ${t(`report.types.${tx.type}`, {
            defaultValue: tx.type,
        })} ${detail} ${formatAmount(tx.amount)}${note}`;
    });

    // Build final report
    return [
        t('report.introduction', { month }),
        t('report.instructions'),
        `1. ${t('report.tasks.trend')}`,
        `2. ${t('report.tasks.waste')}`,
        `3. ${t('report.tasks.advice')}`,
        '',
        t('report.summary'),
        `- ${t('report.income')}: ${formatAmount(sumOf('income'))}`,
        `- ${t('report.expense')}: ${formatAmount(sumOf('expense'))}`,
        '',
        t('report.accounts'),
        ...(accountLines.length
            ? accountLines
            : [t('report.empty')]),
        '',
        t('report.categories'),
        ...(categoryLines.length
            ? categoryLines
            : [t('report.empty')]),
        '',
        t('report.transactions', { count: list.length }),
        ...(txLines.length
            ? txLines
            : [t('report.empty')]),
    ].join('\n');
};
