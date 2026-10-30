import { NavLink } from 'react-router-dom';
import { Banknote, LayoutDashboard, Receipt } from 'lucide-react';

const TABS = [
    { to: '/dashboard', label: 'ホーム', Icon: LayoutDashboard },
    { to: '/savings', label: '貯金', Icon: Banknote },
];

const TabBar = () => (
    <nav
        aria-label="メインメニュー"
        className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#D9DDD8] pb-[env(safe-area-inset-bottom)]"
    >
        <ul className="max-w-5xl mx-auto grid grid-cols-2">
            {TABS.map(({ to, label, Icon }) => (
                <li key={to}>
                    <NavLink
                        to={to}
                        className={({ isActive }) =>
                            `h-16 flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${isActive ? 'text-[#0F7B5F]' : 'text-[#12202F]/50 active:bg-black/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                                {label}
                            </>
                        )}
                    </NavLink>
                </li>
            ))}
        </ul>
    </nav>
);

export default TabBar;