
import { Target, Wallet, ShoppingBag, ShieldCheck } from 'lucide-react';

const FIXED = [
    {
        name: 'Working Account',
        label: 'Main Account',
        Icon: Wallet,
    },
    {
        name: 'Daily Expenses',
        label: 'Daily Expenses Account',
        Icon: ShoppingBag,
    },
    {
        name: 'Emergency Account',
        label: 'Emergency Fund',
        Icon: ShieldCheck,
    },
];

// Label and icon for any account.
// Accounts not listed in FIXED are treated as goal accounts.
export const getAccountMeta = (account) => {
    const fixed = FIXED.find((item) => item.name === account.name);

    return fixed
        ? { label: fixed.label, Icon: fixed.Icon, isGoal: false }
        : { label: account.name, Icon: Target, isGoal: true };
};

// Fixed accounts first, in the defined order.
// Goal accounts follow, sorted alphabetically.
export const sortAccounts = (accounts) =>
    [...accounts].sort((a, b) => {
        const ia = FIXED.findIndex((item) => item.name === a.name);
        const ib = FIXED.findIndex((item) => item.name === b.name);

        if (ia !== -1 || ib !== -1) {
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        }

        return a.name.localeCompare(b.name, 'ja');
    });
