import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
    { code: 'ja', label: '日本語', shortLabel: '日本語' },
    { code: 'en', label: 'English', shortLabel: 'EN' },
    { code: 'zh', label: '中文', shortLabel: '中文' },
];

const LanguageSwitcher = ({ variant = 'compact', className = '' }) => {
    const { i18n } = useTranslation();

    // Handles cases where i18n detects 'en-US' or 'zh-CN'
    const currentLang = i18n.resolvedLanguage || i18n.language || 'ja';

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code);
        // Optional: keep the HTML lang attribute synced for proper CJK font rendering
        document.documentElement.lang = code;
    };

    if (variant === 'full') {
        return (
            <div
                className={`grid grid-cols-3 gap-1.5 bg-[#E8EAE7] p-1.5 rounded-xl ${className}`}
                role="group"
                aria-label="Language selector"
            >
                {LANGUAGES.map((lang) => {
                    const isActive = currentLang.startsWith(lang.code);
                    return (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            aria-pressed={isActive}
                            className={`h-11 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${isActive
                                    ? 'bg-white text-[#12202F] shadow-xs'
                                    : 'text-[#12202F]/60 hover:text-[#12202F]'
                                }`}
                        >
                            {lang.label}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Default: 'compact' pill for headers (e.g., LoginPage)
    return (
        <div
            className={`inline-flex items-center bg-[#E8EAE7] p-1 rounded-lg text-xs font-semibold ${className}`}
            role="group"
            aria-label="Language selector"
        >
            <Globe className="h-3.5 w-3.5 text-[#12202F]/50 mx-1.5 shrink-0" aria-hidden="true" />
            {LANGUAGES.map((lang) => {
                const isActive = currentLang.startsWith(lang.code);
                return (
                    <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code)}
                        aria-pressed={isActive}
                        className={`px-2 py-1 rounded-md transition-colors ${isActive
                                ? 'bg-white text-[#12202F] shadow-xs'
                                : 'text-[#12202F]/60 hover:text-[#12202F]'
                            }`}
                    >
                        {lang.shortLabel}
                    </button>
                );
            })}
        </div>
    );
};

export default LanguageSwitcher;
