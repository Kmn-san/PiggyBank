
import { Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FONT_JP =
    "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";

function DeleteAccountModal({ userCode, onClose }) {
    const [typed, setTyped] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const matches = typed.trim() === userCode;

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { deleteAccount } = useCurrentUser();

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        const onKey = (e) => {
            if (e.key === "Escape" && !isSubmitting) {
                onClose?.();
            }
        };

        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose, isSubmitting]);

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!matches || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await deleteAccount.mutateAsync();
            queryClient.clear();

            toast.success("アカウントを削除しました", {
                id: "delete-account",
            });

            navigate("/login", { replace: true });

        } catch (err) {
            toast.error(
                err?.response?.data?.message ??
                "削除できませんでした。もう一度お試しください。",
                { id: "delete-account" }
            );

            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
            onClick={() => !isSubmitting && onClose?.()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
        >
            <form
                onSubmit={handleDelete}
                noValidate
                className="w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 text-[#12202F] pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[92dvh] overflow-y-auto overflow-x-hidden"
                style={{ fontFamily: FONT_JP }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mb-4">
                    <TriangleAlert className="h-6 w-6" aria-hidden="true" />
                </div>

                <h2 id="delete-title" className="text-lg font-bold">
                    アカウントを削除しますか？
                </h2>

                <p id="delete-desc" className="text-sm text-[#12202F]/70 mt-2 leading-relaxed">
                    削除すると、ログインできなくなり、記録したデータも確認できなくなります。この操作は元に戻せません。
                </p>

                <label
                    htmlFor="confirm-code"
                    className="block text-sm font-semibold mt-5 mb-2"
                >
                    確認のため、ユーザーコードを入力してください
                </label>

                <p className="text-xs text-[#12202F]/55 mb-2 wrap-break-word">
                    入力するコード：
                    <span className="font-bold text-[#12202F]">
                        {userCode}
                    </span>
                </p>

                <input
                    id="confirm-code"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full h-14 px-4 bg-white border border-[#D9DDD8] rounded-xl text-base focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
                />

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-14 rounded-xl border border-[#D9DDD8] bg-white text-base font-semibold active:bg-black/5"
                    >
                        キャンセル
                    </button>

                    <button
                        type="submit"
                        disabled={!matches || isSubmitting}
                        className="h-14 rounded-xl bg-red-700 text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-red-800 disabled:opacity-40"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    className="h-5 w-5 animate-spin"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">削除中...</span>
                            </>
                        ) : (
                            "削除する"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DeleteAccountModal;
