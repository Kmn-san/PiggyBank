
import { useEffect, useState } from 'react';
import { Trash2, UserRound, Languages, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card';
import DeleteAccountModal from '../components/User/DeleteAccountModal';
import { useCurrentUser } from '../hooks/useCurrentUser.js';
import toast from 'react-hot-toast';

const UserPage = () => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { t, i18n } = useTranslation();
    const { data, isFetching, error, isError } = useCurrentUser();

    useEffect(() => {
        if (isFetching) {
            toast.loading(t('user.loading'), { id: 'user' });
        } else if (isError) {
            toast.error(
                error?.response?.data?.message ?? t('user.fetchError'),
                { id: 'user' }
            );
        } else {
            toast.dismiss('user');
        }
    }, [isFetching, isError, error, t]);

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <main className="max-w-5xl mx-auto px-4 pt-6 pb-8 space-y-4">
            <h1 className="text-2xl font-bold">
                {t('user.title')}
            </h1>

            {/* User code */}
            <Card>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#12202F] text-white flex items-center justify-center shrink-0">
                        <UserRound className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#12202F]/60">
                            {t('user.userCode')}
                        </p>

                        <p className="text-xl font-bold mt-0.5 break-all">
                            {data?.user_code}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Language selector */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Languages size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">
                            {t('user.language.title')}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {t('user.language.description')}
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <select
                        value={i18n.resolvedLanguage?.split('-')[0] ?? 'en'}
                        onChange={handleLanguageChange}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                        <option value="zh">简体中文</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                </div>
            </Card>

            {/* Delete account */}
            <Card className="border-red-200!">
                <h2 className="font-bold text-red-700">
                    {t('user.delete.title')}
                </h2>

                <p className="text-sm text-[#12202F]/70 mt-2 leading-relaxed">
                    {t('user.delete.description')}
                </p>

                <button
                    type="button"
                    disabled={!data?.user_code}
                    onClick={() => setConfirmOpen(true)}
                    className="mt-4 h-14 w-full rounded-xl border border-red-300 bg-white text-red-700 text-base font-semibold flex items-center justify-center gap-2 active:bg-red-50 disabled:opacity-50"
                >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                    {t('user.delete.button')}
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
