import { ArrowLeft, PiggyBank } from 'lucide-react';

const FONT_JP = "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";

const H2 = ({ children }) => (
    <h2 className="text-xl font-bold text-[#12202F] mt-10 mb-3">{children}</h2>
);
const P = ({ children }) => (
    <p className="text-base text-[#12202F]/80 leading-8 mb-4">{children}</p>
);
const OL = ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-base text-[#12202F]/80 leading-8 marker:text-[#0F7B5F]">
        {children}
    </ol>
);
const UL = ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-base text-[#12202F]/80 leading-8 marker:text-[#0F7B5F]">
        {children}
    </ul>
);

const PrivacyPolicy = () => (
    <div className="min-h-screen bg-[#F5F6F4]" style={{ fontFamily: FONT_JP }}>
        <header className="sticky top-0 z-10 bg-[#F5F6F4]/95 backdrop-blur border-b border-[#D9DDD8] pt-[env(safe-area-inset-top)]">
            <div className="max-w-2xl mx-auto h-14 px-2 flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-11 h-11 flex items-center justify-center rounded-lg text-[#12202F] active:bg-black/5"
                    aria-label="前のページに戻る"
                >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-2 text-[#12202F]">
                    <PiggyBank className="h-5 w-5" aria-hidden="true" />
                    <span className="font-bold">PiggyBank</span>
                </div>
            </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 pt-8 pb-[max(3rem,env(safe-area-inset-bottom))]">
            <h1 className="text-3xl font-bold text-[#12202F] leading-tight">プライバシーポリシー</h1>
            <p className="text-sm text-[#12202F]/55 mt-2 mb-8">個人情報保護方針</p>

            <P>
                {import.meta.env.VITE_ADMIN}（以下「管理者」といいます。）は、本調査および本サービスにおけるユーザーの情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定め、適切に管理いたします。
            </P>

            <H2>1. 取得する情報</H2>
            <P>本サービスでは、以下の情報を取得・保持します。</P>
            <UL>
                <li>
                    <strong>アカウント識別情報：</strong>ユーザーコード、ハッシュ化されたパスワード
                </li>
                <li>
                    <strong>取引・利用データ：</strong>収入・支出の金額、取引日、カテゴリー、メモ、口座情報（口座種別・貯金額等）
                </li>
                <li>
                    <strong>集計・分析データ：</strong>1週間の支出合計、1日平均支出額、利用前後における支出の変化率など
                </li>
            </UL>

            <H2>2. 利用目的</H2>
            <P>取得したデータは、以下の目的でのみ利用します。</P>
            <OL>
                <li>本サービス上でのユーザー自身による支出状況の確認および管理機能の提供</li>
                <li>学術研究・調査における「支出見直し効果および支出変化率」の集計・分析</li>
                <li>研究成果発表（論文、レポート、発表資料等）への活用</li>
            </OL>

            <H2>3. データの匿名化と管理</H2>
            <OL>
                <li>
                    調査結果の分析・公表において、ユーザーの本名や個人が直ちに特定される情報は使用せず、すべて「ユーザーA」「ユーザーB」等の匿名ID（符号）で処理されます。
                </li>
                <li>
                    パスワードは暗号化（ハッシュ化）してデータベースに保管され、管理者であっても平文（元のパスワード）を参照することはできません。
                </li>
            </OL>

            <H2>4. 第三者提供の有無</H2>
            <P>
                管理者は、法令に基づく場合を除き、取得したユーザーの情報を事前に本人の同意を得ることなく第三者に提供することはありません。なお、AI Bot利用時にユーザーが手動でコピー＆ペーストして外部AIサービスに入力するデータについては、ユーザーご自身の操作に基づくものとします。
            </P>

            <H2>5. データの保存期間と消去</H2>
            <P>
                本調査のために取得したデータは、研究・報告書の作成完了後、適切な方法で安全に消去または復元不可能な状態で破棄いたします。
            </P>

            <H2>6. 参加の任意性と撤回</H2>
            <P>
                本調査への参加は任意です。参加同意後であっても、ユーザーはいつでも不利益を被ることなく参加を撤回することができます。撤回のお申し出があった場合、該当するユーザーのデータは集計対象から除外します。
            </P>

            <H2>7. お問い合わせ窓口</H2>
            <P>本ポリシーおよびデータの取扱いに関するお問い合わせ・ご相談は、下記までご連絡ください。</P>
            <UL>
                <li>
                    <strong>担当者（管理者）：</strong>{import.meta.env.VITE_ADMIN}
                </li>
                <li>
                    <strong>連絡先：</strong>{import.meta.env.VITE_EMAIL}
                </li>
            </UL>
        </main>
    </div>
);

export default PrivacyPolicy;