import { LogOut, PiggyBank, ShieldAlert } from 'lucide-react'
import { logoutUser } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';

function DashbaordHeader() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user } = useAuth();

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        toast.loading('ログアウト中...', { id: 'logout' });
        try {
            await logoutUser();
            toast.success("ログアウトしました", {
                id: "logout"
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ?? 'サーバーでログアウトできませんでした。',
                { id: 'logout' }
            );
        } finally {
            queryClient.clear();
            setIsLoggingOut(false);
            navigate('/login');
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
                    {/* Conditionally show Admin Dashboard button if user is an admin */}
                    {user?.role === 'admin' && (
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="h-11 px-3 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#12202F]/70 hover:bg-black/5 active:bg-black/10 transition-colors"
                        >
                            <ShieldAlert className="h-4 w-4 text-amber-600" aria-hidden="true" />
                            管理画面
                        </button>
                    )}

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="h-11 px-3 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#12202F]/70 hover:bg-black/5 active:bg-black/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        ログアウト
                    </button>
                </div>
            </div>
        </header>
    );
}

export default DashbaordHeader;