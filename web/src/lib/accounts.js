import { Wallet, ShoppingBag, ShieldCheck } from 'lucide-react';

export const ACCT = {
    working: { name: 'Working Account', label: 'メイン口座', Icon: Wallet },
    daily: { name: 'Daily Expenses', label: '日々の支出口座', Icon: ShoppingBag },
    emergency: { name: 'Emergency Account', label: '緊急資金口座', Icon: ShieldCheck },
};