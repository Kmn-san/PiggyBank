// pages/UserPage.jsx
import { useEffect, useState } from 'react';
import { Trash2, UserRound } from 'lucide-react';
import { Card } from '../components/Card';
import DeleteAccountModal from '../components/User/DeleteAccountModal';
import { useCurrentUser } from '../hooks/useCurrentUser.js';
import toast from 'react-hot-toast';

const UserPage = () => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { data, isFetching, error, isError } = useCurrentUser()


    useEffect(() => {
        if (isFetching) {
            toast.loading('読み込み中…', { id: 'user' });
        } else if (isError) {
            toast.error(error?.response?.data?.message ?? 'データを取得できませんでした。', { id: 'user' });
        } else {
            toast.dismiss('user');
        }
    }, [isFetching, isError, error]);

    return (
        <main className="max-w-5xl mx-auto px-4 pt-6 pb-8 space-y-4">
            <h1 className="text-2xl font-bold">アカウント</h1>

            {/* User code */}
            <Card>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#12202F] text-white flex items-center justify-center shrink-0">
                        <UserRound className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#12202F]/60">ユーザーコード</p>
                        <p className="text-xl font-bold mt-0.5 break-all">{data?.user_code}</p>
                    </div>
                </div>
            </Card>

            {/* Delete account */}
            <Card className="border-red-200!">
                <h2 className="font-bold text-red-700">アカウントを削除</h2>
                <p className="text-sm text-[#12202F]/70 mt-2 leading-relaxed">
                    アカウントを削除すると、ログインできなくなり、記録したデータも確認できなくなります。この操作は元に戻せません。
                </p>
                <button
                    type="button"
                    disabled={!data?.user_code}
                    onClick={() => setConfirmOpen(true)}
                    className="mt-4 h-14 w-full rounded-xl border border-red-300 bg-white text-red-700 text-base font-semibold flex items-center justify-center gap-2 active:bg-red-50"
                >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                    アカウントを削除する
                </button>
            </Card>

            {confirmOpen && (
                <DeleteAccountModal
                    userCode={data?.user_code}
                    onClose={() => setConfirmOpen(false)}
                />
            )}
        </main>
    );
};

export default UserPage;