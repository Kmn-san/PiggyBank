import { LogOut, PiggyBank } from 'lucide-react'
import { logoutUser } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

function DashbaordHeader() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate()

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        toast.loading('ログアウト中…', { id: 'logout' });

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await logoutUser(refreshToken);
            toast.success('ログアウトしました', { id: 'logout' });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ?? 'サーバーでログアウトできませんでした。',
                { id: 'logout' }
            );
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('expiresIn');
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
                <button
                    type="button"
                    onClick={handleLogout}
                    className="h-11 px-3 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#12202F]/70 active:bg-black/5"
                >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    ログアウト
                </button>
            </div>
        </header>
    )
}

export default DashbaordHeader