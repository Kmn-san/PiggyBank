
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    PiggyBank,
    UserRound,
} from 'lucide-react';

import { forgetPassword } from '../lib/api.js';

const FONT_JP =
    "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";

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
    value,
    onChange,
    error,
    show,
    onToggle,
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
                autoComplete="new-password"
                placeholder={t('forgotPassword.passwordPlaceholder', {
                    label,
                })}
                className={inputClass}
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={
                    error
                        ? `${id}-error`
                        : hint
                            ? `${id}-hint`
                            : undefined
                }
            />

            <button
                type="button"
                onClick={onToggle}
                disabled={disabled}
                className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/50 active:bg-black/5 disabled:opacity-50"
                aria-label={
                    show
                        ? t('forgotPassword.hidePassword')
                        : t('forgotPassword.showPassword')
                }
            >
                {show ? (
                    <EyeOff
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                ) : (
                    <Eye
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                )}
            </button>
        </div>

        {error ? (
            <p
                id={`${id}-error`}
                className="text-sm text-red-700 mt-2"
            >
                {error}
            </p>
        ) : (
            hint && (
                <p
                    id={`${id}-hint`}
                    className="text-sm text-[#12202F]/55 mt-2"
                >
                    {hint}
                </p>
            )
        )}
    </div>
);

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [userCode, setUserCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const next = {};

        if (!userCode.trim()) {
            next.userCode = t(
                'forgotPassword.validation.userCodeRequired'
            );
        }

        if (!password) {
            next.password = t(
                'forgotPassword.validation.passwordRequired'
            );
        } else if (password.length < 8) {
            next.password = t(
                'forgotPassword.validation.passwordMinLength'
            );
        }

        if (!confirm) {
            next.confirm = t(
                'forgotPassword.validation.confirmRequired'
            );
        } else if (confirm !== password) {
            next.confirm = t(
                'forgotPassword.validation.passwordMismatch'
            );
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            const data = await forgetPassword(
                userCode.trim(),
                password
            );

            if (!data?.success) {
                toast.error(
                    data?.message ??
                    t('forgotPassword.toast.failed'),
                    {
                        id: 'forget-password',
                    }
                );

                return;
            }

            toast.success(
                t('forgotPassword.toast.success'),
                {
                    id: 'forget-password',
                }
            );

            // Password reset is not a login.
            navigate('/login', {
                replace: true,
            });
        } catch (err) {
            toast.error(

                t('forgotPassword.toast.error'),
                {
                    id: 'forget-password',
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-[#F5F6F4] sm:flex sm:items-center sm:justify-center sm:p-6"
            style={{ fontFamily: FONT_JP }}
        >
            <main className="w-full sm:max-w-sm min-h-screen sm:min-h-0 bg-[#F5F6F4] sm:bg-white sm:rounded-2xl sm:border sm:border-[#D9DDD8] flex flex-col px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8 text-[#12202F]">

                {/* Back */}
                <Link
                    to="/login"
                    className="-ml-2 mb-4 self-start h-11 px-2 flex items-center gap-1.5 rounded-lg text-sm font-semibold text-[#12202F]/70 active:bg-black/5"
                >
                    <ArrowLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                    />

                    {t('forgotPassword.backToLogin')}
                </Link>

                {/* Brand */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-xl bg-[#12202F] text-white flex items-center justify-center">
                        <PiggyBank
                            className="h-6 w-6"
                            aria-hidden="true"
                        />
                    </div>

                    <span className="text-lg font-bold">
                        PiggyBank
                    </span>
                </div>

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight">
                        {t('forgotPassword.title')}
                    </h1>

                    <p className="text-base text-[#12202F]/65 mt-2 leading-relaxed">
                        {t('forgotPassword.description')}
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
                            className="block text-sm font-semibold mb-2"
                        >
                            {t('forgotPassword.userCode')}
                        </label>

                        <div className={fieldClass(errors.userCode)}>
                            <UserRound
                                className="h-5 w-5 text-[#12202F]/40 shrink-0"
                                aria-hidden="true"
                            />

                            <input
                                id="userCode"
                                type="text"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                placeholder={t(
                                    'forgotPassword.userCodePlaceholder'
                                )}
                                className={inputClass}
                                value={userCode}
                                disabled={isLoading}
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

                    {/* New password */}
                    <PasswordField
                        id="password"
                        label={t('forgotPassword.newPassword')}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearError('password');
                        }}
                        error={errors.password}
                        show={showPassword}
                        onToggle={() =>
                            setShowPassword((prev) => !prev)
                        }
                        hint={t('forgotPassword.passwordHint')}
                        disabled={isLoading}
                        t={t}
                    />

                    {/* Confirm new password */}
                    <PasswordField
                        id="confirm"
                        label={t('forgotPassword.confirmPassword')}
                        value={confirm}
                        onChange={(e) => {
                            setConfirm(e.target.value);
                            clearError('confirm');
                        }}
                        error={errors.confirm}
                        show={showConfirm}
                        onToggle={() =>
                            setShowConfirm((prev) => !prev)
                        }
                        disabled={isLoading}
                        t={t}
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="h-14 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#0B5F49] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F7B5F]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2
                                    className="h-5 w-5 animate-spin"
                                    aria-hidden="true"
                                />

                                {t('forgotPassword.submitting')}
                            </>
                        ) : (
                            t('forgotPassword.submit')
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default ForgotPasswordPage;
