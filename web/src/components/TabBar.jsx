
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Banknote,
    History,
    LayoutDashboard,
    Receipt,
    User
} from 'lucide-react';

const TABS = [
    { to: '/dashboard', key: 'home', Icon: LayoutDashboard },
    { to: '/savings', key: 'savings', Icon: Banknote },
    { to: '/expenses', key: 'expenses', Icon: Receipt },
    { to: '/transaction', key: 'transactions', Icon: History },
    { to: '/me', key: 'account', Icon: User },
];

const TabBar = () => {
    const { t } = useTranslation();

    return (
        <nav
            aria-label={t('navigation.mainMenu')}
            className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#D9DDD8] pb-[env(safe-area-inset-bottom)]"
        >
            <ul className="max-w-5xl mx-auto grid grid-cols-5">
                {TABS.map(({ to, key, Icon }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            className={({ isActive }) =>
                                `h-16 flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${isActive
                                    ? 'text-[#0F7B5F]'
                                    : 'text-[#12202F]/50 active:bg-black/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        className="h-6 w-6"
                                        strokeWidth={isActive ? 2.5 : 2}
                                        aria-hidden="true"
                                    />
                                    {t(`navigation.${key}`)}
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TabBar;
