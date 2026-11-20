
import React, { useState } from 'react';
import {
    PiggyBank,
    UserRound,
    LockKeyhole,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { loginUser, fetchUser } from '../lib/api.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';

const FONT_JP = "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [userCode, setUserCode] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const next = {};

        if (!userCode.trim()) {
            next.userCode = t('login.validation.userCodeRequired');
        }

        if (!password) {
            next.password = t('login.validation.passwordRequired');
        } else if (password.length < 8) {
            next.password = t('login.validation.passwordMinLength');
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading || !validate()) return;

        setIsLoading(true);

        try {
            // Step 1: Login and receive authentication cookies
            const data = await loginUser(userCode.trim(), password);

            if (!data.success) {
                toast.error(
                    data.message ?? t('login.toast.loginFailed'),
                    { id: 'login' }
                );
                return;
            }

            // Step 2: Fetch authenticated user using accessToken cookie
            const user = await fetchUser();

            if (!user) {
                throw new Error('Authentication verification failed.');
            }

            // Step 3: Update TanStack Query cache
            queryClient.setQueryData(['authUser'], user);

            // Step 4: Navigate after authentication succeeds
            toast.success(t('login.toast.loginSuccess'), {
                id: 'login'
            });

            navigate('/dashboard', { replace: true });

        } catch (err) {
            queryClient.removeQueries({
                queryKey: ['authUser']
            });

            toast.error(
                err.response?.data?.message ??
                err.message ??
                t('login.toast.serverError'),
                { id: 'login' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const fieldClass = (hasError) =>
        `flex items-center gap-3 h-14 px-4 rounded-xl border bg-white transition-colors focus-within:ring-2 focus-within:ring-[#0F7B5F]/40 ${hasError
            ? 'border-red-600'
            : 'border-[#D9DDD8] focus-within:border-[#0F7B5F]'
        }`;

    return (
        <div
            className="min-h-screen bg-[#F5F6F4] sm:flex sm:items-center sm:justify-center sm:p-6"
            style={{ fontFamily: FONT_JP }}
        >
            <main className="w-full sm:max-w-sm min-h-screen sm:min-h-0 bg-[#F5F6F4] sm:bg-white sm:rounded-2xl sm:border sm:border-[#D9DDD8] flex flex-col px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8">

                {/* Brand */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#12202F] text-white flex items-center justify-center">
                            <PiggyBank className="h-6 w-6" aria-hidden="true" />
                        </div>

                        <span className="text-lg font-bold text-[#12202F]">
                            PiggyBank
                        </span>
                    </div>

                    <LanguageSwitcher variant="compact" />
                </div>

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-[#12202F] leading-tight">
                        {t('login.title')}
                    </h1>

                    <p className="text-base text-[#12202F]/65 mt-2 leading-relaxed">
                        {t('login.subtitle')}
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                >
                    {/* User code */}
                    <div>
                        <label
                            htmlFor="userCode"
                            className="block text-sm font-semibold text-[#12202F] mb-2"
                        >
                            {t('login.userCode')}
                        </label>

                        <div className={fieldClass(errors.userCode)}>
                            <UserRound className="h-5 w-5 text-[#12202F]/40 shrink-0" />

                            <input
                                id="userCode"
                                type="text"
                                inputMode="text"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                placeholder={t('login.userCodePlaceholder')}
                                className="grow bg-transparent outline-none text-base text-[#12202F] placeholder:text-[#12202F]/35 min-w-0"
                                value={userCode}
                                onChange={(e) => {
                                    setUserCode(e.target.value);
                                    clearError('userCode');
                                }}
                                aria-invalid={!!errors.userCode}
                                aria-describedby={
                                    errors.userCode
                                        ? 'userCode-error'
                                        : undefined
                                }
                            />
                        </div>

                        {errors.userCode && (
                            <p
                                id="userCode-error"
                                className="text-sm text-red-700 mt-2"
                            >
                                {errors.userCode}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-[#12202F] mb-2"
                        >
                            {t('login.password')}
                        </label>

                        <div className={fieldClass(errors.password)}>
                            <LockKeyhole className="h-5 w-5 text-[#12202F]/40 shrink-0" />

                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder={t('login.passwordPlaceholder')}
                                className="grow bg-transparent outline-none text-base text-[#12202F] placeholder:text-[#12202F]/35 min-w-0"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError('password');
                                }}
                                aria-invalid={!!errors.password}
                                aria-describedby={
                                    errors.password
                                        ? 'password-error'
                                        : undefined
                                }
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/50 active:bg-black/5"
                                aria-label={
                                    showPassword
                                        ? t('login.hidePassword')
                                        : t('login.showPassword')
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-5 w-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p
                                id="password-error"
                                className="text-sm text-red-700 mt-2"
                            >
                                {errors.password}
                            </p>
                        )}
                    </div>
                    {/* Forgot Password */}
                    <div className="flex justify-end -mt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/forget-password')}
                            className="text-sm font-semibold text-[#0F7B5F] hover:underline"
                        >
                            {t('login.forgotPassword')}
                        </button>
                    </div>
                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49] disabled:opacity-60 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#0F7B5F]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                                {t('login.loggingIn')}
                            </>
                        ) : (
                            t('login.submit')
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6">
                    <p className="text-center text-sm text-[#12202F]/65">
                        {t('login.noAccount')}{' '}
                        <a
                            href="/signup"
                            className="font-semibold text-[#0F7B5F]"
                        >
                            {t('login.signup')}
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
