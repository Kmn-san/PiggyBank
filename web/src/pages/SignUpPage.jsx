
import React, { useState } from 'react';
import {
    PiggyBank,
    UserRound,
    LockKeyhole,
    Eye,
    EyeOff,
    CircleAlert,
    CircleCheck,
    Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { registerUser } from '../lib/api.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';

const FONT_JP = "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";

const fieldClass = (hasError) =>
    `flex items-center gap-3 h-14 px-4 rounded-xl border bg-white transition-colors focus-within:ring-2 focus-within:ring-[#0F7B5F]/40 ${hasError
        ? 'border-red-600'
        : 'border-[#D9DDD8] focus-within:border-[#0F7B5F]'
    }`;

const inputClass =
    'grow bg-transparent outline-none text-base text-[#12202F] placeholder:text-[#12202F]/35 min-w-0';

const PasswordField = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    show,
    onToggle,
    autoComplete,
    hint,
    disabled,
    t,
}) => (
    <div>
        <label
            htmlFor={id}
            className="block text-sm font-semibold text-[#12202F] mb-2"
        >
            {label}
        </label>

        <div className={fieldClass(error)}>
            <LockKeyhole
                className="h-5 w-5 text-[#12202F]/40 shrink-0"
                aria-hidden="true"
            />

            <input
                id={id}
                type={show ? 'text' : 'password'}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={inputClass}
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={
                    error ? `${id}-error` : hint ? `${id}-hint` : undefined
                }
            />

            <button
                type="button"
                onClick={onToggle}
                disabled={disabled}
                className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/50 active:bg-black/5"
                aria-label={
                    show
                        ? t('register.hidePassword')
                        : t('register.showPassword')
                }
            >
                {show ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                )}
            </button>
        </div>

        {error ? (
            <p id={`${id}-error`} className="text-sm text-red-700 mt-2">
                {t(error)}
            </p>
        ) : (
            hint && (
                <p id={`${id}-hint`} className="text-sm text-[#12202F]/55 mt-2">
                    {hint}
                </p>
            )
        )}
    </div>
);

const SignupPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [userCode, setUserCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Navigate to login after the user presses OK.
    const handleOk = () => {
        navigate('/login', { state: { registered: true } });
    };

    const validate = () => {
        const next = {};

        if (!userCode.trim()) {
            next.userCode = 'register.validation.userCodeRequired';
        } else if (!/^[A-Za-z0-9_-]{4,20}$/.test(userCode.trim())) {
            next.userCode = 'register.validation.userCodeFormat';
        }

        if (!password) {
            next.password = 'register.validation.passwordRequired';
        } else if (password.length < 8) {
            next.password = 'register.validation.passwordMinLength';
        }

        if (!confirm) {
            next.confirm = 'register.validation.confirmRequired';
        } else if (confirm !== password) {
            next.confirm = 'register.validation.passwordMismatch';
        }

        if (!agreed) {
            next.agreed = 'register.validation.agreementRequired';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSuccess || !validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const data = await registerUser(userCode.trim(), password);

            if (!data.success) {
                setErrors({
                    general: data.message || t('register.toast.createFailed'),
                });
                return;
            }

            setIsSuccess(true);
        } catch (err) {
            console.log(err);

            setErrors({
                general:
                    err.response?.data?.message ||
                    t('register.toast.createFailed'),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-[#F5F6F4] sm:flex sm:items-center sm:justify-center sm:p-6"
            style={{ fontFamily: FONT_JP }}
        >
            <main className="w-full sm:max-w-sm min-h-screen sm:min-h-0 bg-[#F5F6F4] sm:bg-white sm:rounded-2xl sm:border sm:border-[#D9DDD8] flex flex-col px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8">

                {/* Brand and language switcher */}
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
                        {t('register.title')}
                    </h1>

                    <p className="text-base text-[#12202F]/65 mt-2 leading-relaxed">
                        {t('register.subtitle')}
                    </p>
                </header>

                {/* Success popup */}
                {isSuccess && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
                        <div
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="success-title"
                            aria-describedby="success-desc"
                            className="w-full max-w-xs bg-white rounded-2xl p-6 text-center shadow-xl"
                        >
                            <div className="mx-auto w-14 h-14 rounded-full bg-green-50 text-[#0F7B5F] flex items-center justify-center mb-4">
                                <CircleCheck className="h-8 w-8" aria-hidden="true" />
                            </div>

                            <h2
                                id="success-title"
                                className="text-xl font-bold text-[#12202F]"
                            >
                                {t('register.success.title')}
                            </h2>

                            <p
                                id="success-desc"
                                className="text-sm text-[#12202F]/65 mt-2 leading-relaxed"
                            >
                                {t('register.success.description')}
                            </p>

                            <button
                                type="button"
                                autoFocus
                                onClick={handleOk}
                                className="mt-6 h-12 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold active:bg-[#0B5F49] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#0F7B5F]"
                            >
                                {t('register.success.ok')}
                            </button>
                        </div>
                    </div>
                )}

                {/* General error */}
                {errors.general && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
                    >
                        <CircleAlert className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{errors.general}</span>
                    </div>
                )}

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
                            {t('register.userCode')}
                        </label>

                        <div className={fieldClass(errors.userCode)}>
                            <UserRound className="h-5 w-5 text-[#12202F]/40 shrink-0" aria-hidden="true" />

                            <input
                                id="userCode"
                                type="text"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                placeholder={t('register.userCodePlaceholder')}
                                className={inputClass}
                                value={userCode}
                                disabled={isSuccess}
                                onChange={(e) => {
                                    setUserCode(e.target.value);
                                    clearError('userCode');
                                }}
                                aria-invalid={!!errors.userCode}
                                aria-describedby={
                                    errors.userCode
                                        ? 'userCode-error'
                                        : 'userCode-hint'
                                }
                            />
                        </div>

                        {errors.userCode ? (
                            <p id="userCode-error" className="text-sm text-red-700 mt-2">
                                {t(errors.userCode)}
                            </p>
                        ) : (
                            <p id="userCode-hint" className="text-sm text-[#12202F]/55 mt-2">
                                {t('register.userCodeHint')}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <PasswordField
                        id="password"
                        label={t('register.password')}
                        placeholder={t('register.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearError('password');
                        }}
                        error={errors.password}
                        show={showPassword}
                        onToggle={() => setShowPassword((s) => !s)}
                        autoComplete="new-password"
                        hint={t('register.passwordHint')}
                        disabled={isSuccess}
                        t={t}
                    />

                    {/* Confirm password */}
                    <PasswordField
                        id="confirm"
                        label={t('register.confirmPassword')}
                        placeholder={t('register.confirmPasswordPlaceholder')}
                        value={confirm}
                        onChange={(e) => {
                            setConfirm(e.target.value);
                            clearError('confirm');
                        }}
                        error={errors.confirm}
                        show={showConfirm}
                        onToggle={() => setShowConfirm((s) => !s)}
                        autoComplete="new-password"
                        disabled={isSuccess}
                        t={t}
                    />

                    {/* Terms and privacy policy */}
                    <div>
                        <label className="flex items-start gap-3 min-h-11 cursor-pointer py-1">
                            <input
                                type="checkbox"
                                checked={agreed}
                                disabled={isSuccess}
                                onChange={(e) => {
                                    setAgreed(e.target.checked);
                                    clearError('agreed');
                                }}
                                className="w-5 h-5 mt-0.5 rounded accent-[#0F7B5F] shrink-0"
                                aria-invalid={!!errors.agreed}
                                aria-describedby={
                                    errors.agreed ? 'agreed-error' : undefined
                                }
                            />

                            <span className="text-sm text-[#12202F] leading-relaxed">
                                <a href="/terms" className="font-semibold text-[#0F7B5F]">
                                    {t('register.terms')}
                                </a>
                                {t('register.and')}
                                <a href="/privacy" className="font-semibold text-[#0F7B5F]">
                                    {t('register.privacy')}
                                </a>
                                {t('register.agreement')}
                            </span>
                        </label>

                        {errors.agreed && (
                            <p id="agreed-error" className="text-sm text-red-700 mt-1">
                                {t(errors.agreed)}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        className="h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F7B5F]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                                {t('register.creating')}
                            </>
                        ) : isSuccess ? (
                            <>
                                <CircleCheck className="h-5 w-5" aria-hidden="true" />
                                {t('register.created')}
                            </>
                        ) : (
                            t('register.submit')
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-auto pt-8">
                    <p className="text-center text-sm text-[#12202F]/65">
                        {t('register.haveAccount')}{' '}
                        <a href="/login" className="font-semibold text-[#0F7B5F]">
                            {t('register.login')}
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SignupPage;
