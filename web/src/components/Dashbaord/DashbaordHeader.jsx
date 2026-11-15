
import { LogOut, PiggyBank, ShieldAlert } from 'lucide-react';
import { logoutUser } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

function DashbaordHeader() {
    const { t } = useTranslation();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user } = useAuth();

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        toast.loading(t('dashboard.header.loggingOut'), { id: 'logout' });

        try {
            await logoutUser();

            queryClient.clear();

            toast.success(t('dashboard.header.logoutSuccess'), {
                id: 'logout'
            });

            navigate('/login', { replace: true });

        } catch (error) {
            toast.error(
                error?.response?.data?.message ?? t('dashboard.header.logoutError'),
                { id: 'logout' }
            );

        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-10 bg-[#F5F6F4]/95 backdrop-blur border-b border-[#D9DDD8] pt-[env(safe-area-inset-top)]">
            <div className="max-w-5xl mx-auto h-14 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-[#12202F] text-white flex items-center justify-center">
                        <PiggyBank className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="font-bold">PiggyBank</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Admin Dashboard */}
                    {user?.role === 'admin' && (
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="h-11 px-3 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#12202F]/70 hover:bg-black/5 active:bg-black/10 transition-colors"
                        >
                            <ShieldAlert className="h-4 w-4 text-amber-600" aria-hidden="true" />
                            {t('dashboard.header.admin')}
                        </button>
                    )}

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="h-11 px-3 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#12202F]/70 hover:bg-black/5 active:bg-black/10 transition-colors disabled:opacity-50"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        {t('dashboard.header.logout')}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default DashbaordHeader;
