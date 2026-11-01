import { Wallet, ShoppingBag, ShieldCheck, Target } from 'lucide-react';

// Account names must match the backend exactly
export const ACCT = {
    working: { name: 'Working Account', label: 'メイン口座', Icon: Wallet },
    daily: { name: 'Daily Expenses', label: '日々の支出口座', Icon: ShoppingBag },
    emergency: { name: 'Emergency Account', label: '緊急資金口座', Icon: ShieldCheck },
};

const FIXED = Object.values(ACCT);

// Label and icon for ANY account. Anything that is not one of the three fixed accounts is a goal account.
export const getAccountMeta = (account) => {
    const fixed = FIXED.find((a) => a.name === account.name);
    return fixed
        ? { label: fixed.label, Icon: fixed.Icon, isGoal: false }
        : { label: account.name, Icon: Target, isGoal: true };
};

// Fixed accounts first (in the order above), then goal accounts A to Z
export const sortAccounts = (accounts) =>
    [...accounts].sort((a, b) => {
        const ia = FIXED.findIndex((f) => f.name === a.name);
        const ib = FIXED.findIndex((f) => f.name === b.name);
        if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        return a.name.localeCompare(b.name, 'ja');
    });