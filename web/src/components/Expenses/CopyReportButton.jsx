
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Check, ClipboardCopy } from 'lucide-react';
import { Card } from '../Card';

// navigator.clipboard only works on https or localhost, so keep a fallback
const copyText = async (text) => {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.select();

    const ok = document.execCommand('copy');
    document.body.removeChild(ta);

    if (!ok) throw new Error('copy failed');
};

function CopyReportButton({ getText, disabled, label }) {
    const { t } = useTranslation();

    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const handleClick = async () => {
        try {
            await copyText(getText());

            setCopied(true);

            toast.success(t('expenses.copyReportButton.successToast'), {
                id: 'copy',
            });

            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2500);
        } catch {
            toast.error(t('expenses.copyReportButton.errorToast'), {
                id: 'copy',
            });
        }
    };

    return (
        <Card>
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className="h-14 w-full rounded-xl bg-[#12202F] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#12202F]/90 disabled:opacity-50"
            >
                {copied ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                    <ClipboardCopy className="h-5 w-5" aria-hidden="true" />
                )}

                {copied
                    ? t('expenses.copyReportButton.copied')
                    : label}
            </button>

            <p className="text-xs text-[#12202F]/55 mt-3 leading-relaxed">
                {t('expenses.copyReportButton.description')}
            </p>
        </Card>
    );
}

export default CopyReportButton;
