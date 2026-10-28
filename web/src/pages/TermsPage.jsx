// pages/TermsOfService.jsx
import React from 'react';
import { ArrowLeft, PiggyBank } from 'lucide-react';

// Standalone page. Palette: ink #12202F, paper #F5F6F4, green #0F7B5F, line #D9DDD8
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

const TermsOfService = () => (
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
            <h1 className="text-3xl font-bold text-[#12202F] leading-tight mb-8">利用規約</h1>

            <P>
                本利用規約（以下「本規約」といいます。）は、{import.meta.env.VITE_ADMIN}（以下「管理者」といいます。）が提供する支出記録WebアプリおよびAIアドバイス機能（以下「本サービス」といいます。）の利用条件を定めるものです。本サービスを利用する調査参加者（以下「ユーザー」といいます。）は、本規約に同意の上、本サービスを利用するものとします。
            </P>

            <H2>第1条（目的）</H2>
            <P>
                本サービスは、大学生の支出見直しおよび節約・貯金に関するAI Botのアドバイス効果を検証する学術調査・実証実験を目的として提供される試作アプリです。
            </P>

            <H2>第2条（アカウントおよびログイン情報の管理）</H2>
            <OL>
                <li>管理者は、ユーザーに対して専用の「ユーザーコード」を発行・付与します。</li>
                <li>ユーザーは、設定したパスワードおよびユーザーコードを適切に管理するものとします。</li>
                <li>ユーザーコードおよびパスワードの第三者への譲渡、貸与、開示は禁止します。</li>
            </OL>

            <H2>第3条（利用条件およびデータ記録）</H2>
            <OL>
                <li>
                    ユーザーは、調査期間中（第1期間および第2期間）、指定された方法で日々の収入・支出・貯蓄口座情報を本サービスに記録するものとします。
                </li>
                <li>
                    ユーザーは、本サービス上の記録内容を自らコピーし、AI Botへ手動で提供してアドバイスを受ける機能を利用できます。
                </li>
                <li>
                    本サービスは試作段階（MVP）であるため、個人設定画面やアプリとAI Botの自動連携機能等は含まれません。
                </li>
            </OL>

            <H2>第4条（禁止事項）</H2>
            <P>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</P>
            <OL>
                <li>他のユーザーのユーザーコードやパスワードを使用する行為</li>
                <li>本サービスのシステムに対する不正アクセスやリバースエンジニアリング行為</li>
                <li>虚偽の情報を意図的に連続して入力し、本調査のデータ精度を著しく阻害する行為</li>
                <li>本サービスおよび他のユーザー、管理者の権利・利益を侵害する行為</li>
            </OL>

            <H2>第5条（サービスの停止・変更・終了）</H2>
            <P>
                管理者は、調査期間の終了、システムのメンテナンス、またはやむを得ない事情がある場合、ユーザーへの事前の通知なく本サービスの提供を中断、変更、または終了することができるものとします。
            </P>

            <H2>第6条（免責事項）</H2>
            <OL>
                <li>
                    本サービス（AI Botのアドバイスを含む）が提供する情報は参考情報であり、特定の金融成果や貯蓄成功を保証するものではありません。
                </li>
                <li>
                    管理者は、本サービスの利用によりユーザーに生じた損害について、故意または重大な過失がある場合を除き、一切の責任を負わないものとします。
                </li>
            </OL>
        </main>
    </div>
);

export default TermsOfService;