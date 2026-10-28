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
import { registerUser } from '../lib/api.js';

const FONT_JP = "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";

const fieldClass = (hasError) =>
    `flex items-center gap-3 h-14 px-4 rounded-xl border bg-white transition-colors focus-within:ring-2 focus-within:ring-[#0F7B5F]/40 ${hasError ? 'border-red-600' : 'border-[#D9DDD8] focus-within:border-[#0F7B5F]'
    }`;

const inputClass =
    'grow bg-transparent outline-none text-base text-[#12202F] placeholder:text-[#12202F]/35 min-w-0';

const PasswordField = ({ id, label, value, onChange, error, show, onToggle, autoComplete, hint, disabled }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-[#12202F] mb-2">
            {label}
        </label>
        <div className={fieldClass(error)}>
            <LockKeyhole className="h-5 w-5 text-[#12202F]/40 shrink-0" aria-hidden="true" />
            <input
                id={id}
                type={show ? 'text' : 'password'}
                autoComplete={autoComplete}
                placeholder={label + 'を入力'}
                className={inputClass}
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            />
            <button
                type="button"
                onClick={onToggle}
                className="-mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F]/50 active:bg-black/5"
                aria-label={show ? 'パスワードを隠す' : 'パスワードを表示'}
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
                {error}
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

    // Called when the user presses OK in the success popup
    const handleOk = () => {
        navigate('/login', { state: { registered: true } });
    };

    const validate = () => {
        const next = {};
        if (!userCode.trim()) next.userCode = 'ユーザーコードを入力してください';
        else if (!/^[A-Za-z0-9_-]{4,20}$/.test(userCode.trim()))
            next.userCode = '4〜20文字の英数字、ハイフン、アンダースコアで入力してください';
        if (!password) next.password = 'パスワードを入力してください';
        else if (password.length < 8) next.password = 'パスワードは8文字以上で入力してください';
        if (!confirm) next.confirm = '確認用パスワードを入力してください';
        else if (confirm !== password) next.confirm = 'パスワードが一致しません';
        if (!agreed) next.agreed = '利用規約とプライバシーポリシーへの同意が必要です';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const clearError = (field) => {
        if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSuccess || !validate()) return;

        setIsLoading(true);
        setErrors({});
        try {
            const data = await registerUser(userCode, password);
            if (!data.success) {
                setErrors({ general: data.message });
                return;
            }
            // Open the success popup; navigation happens when the user presses OK
            setIsSuccess(true);
        } catch (err) {
            console.log(err);

            setErrors({
                general:
                    err.response?.data?.message ??
                    'アカウントを作成できませんでした。もう一度お試しください。',
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
                {/* Brand */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-11 h-11 rounded-xl bg-[#12202F] text-white flex items-center justify-center">
                        <PiggyBank className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="text-lg font-bold text-[#12202F]">PiggyBank</span>
                </div>

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-[#12202F] leading-tight">アカウント作成</h1>
                    <p className="text-base text-[#12202F]/65 mt-2 leading-relaxed">
                        ユーザーコードとパスワードを設定してください
                    </p>
                </header>

                {/* Success popup: user must press OK to continue */}
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
                            <h2 id="success-title" className="text-xl font-bold text-[#12202F]">
                                登録が完了しました
                            </h2>
                            <p id="success-desc" className="text-sm text-[#12202F]/65 mt-2 leading-relaxed">
                                ログインページに移動します。
                            </p>
                            <button
                                type="button"
                                autoFocus
                                onClick={handleOk}
                                className="mt-6 h-12 w-full rounded-xl bg-[#0F7B5F] text-white text-base font-semibold active:bg-[#0B5F49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F7B5F]"
                            >
                                OK
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

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                    {/* User code */}
                    <div>
                        <label htmlFor="userCode" className="block text-sm font-semibold text-[#12202F] mb-2">
                            ユーザーコード
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
                                placeholder="ユーザーコードを入力"
                                className={inputClass}
                                value={userCode}
                                disabled={isSuccess}
                                onChange={(e) => {
                                    setUserCode(e.target.value);
                                    clearError('userCode');
                                }}
                                aria-invalid={!!errors.userCode}
                                aria-describedby={errors.userCode ? 'userCode-error' : 'userCode-hint'}
                            />
                        </div>
                        {errors.userCode ? (
                            <p id="userCode-error" className="text-sm text-red-700 mt-2">
                                {errors.userCode}
                            </p>
                        ) : (
                            <p id="userCode-hint" className="text-sm text-[#12202F]/55 mt-2">
                                4〜20文字の英数字、ハイフン、アンダースコア
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <PasswordField
                        id="password"
                        label="パスワード"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearError('password');
                        }}
                        error={errors.password}
                        show={showPassword}
                        onToggle={() => setShowPassword((s) => !s)}
                        autoComplete="new-password"
                        hint="8文字以上"
                        disabled={isSuccess}
                    />

                    {/* Confirm password */}
                    <PasswordField
                        id="confirm"
                        label="パスワード（確認）"
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
                    />

                    {/* Terms */}
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
                                aria-describedby={errors.agreed ? 'agreed-error' : undefined}
                            />
                            <span className="text-sm text-[#12202F] leading-relaxed">
                                <a href="/terms" className="font-semibold text-[#0F7B5F]">
                                    利用規約
                                </a>
                                と
                                <a href="/privacy" className="font-semibold text-[#0F7B5F]">
                                    プライバシーポリシー
                                </a>
                                に同意します
                            </span>
                        </label>
                        {errors.agreed && (
                            <p id="agreed-error" className="text-sm text-red-700 mt-1">
                                {errors.agreed}
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
                                作成中…
                            </>
                        ) : isSuccess ? (
                            <>
                                <CircleCheck className="h-5 w-5" aria-hidden="true" />
                                作成しました
                            </>
                        ) : (
                            'アカウントを作成'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-auto pt-8">
                    <p className="text-center text-sm text-[#12202F]/65">
                        すでにアカウントをお持ちの方は{' '}
                        <a href="/login" className="font-semibold text-[#0F7B5F]">
                            ログイン
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SignupPage;