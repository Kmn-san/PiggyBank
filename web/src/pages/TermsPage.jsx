
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
                    aria-label="Go back"
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
            <h1 className="text-3xl font-bold text-[#12202F] leading-tight mb-8">
                Terms of Service
            </h1>

            <P>
                These Terms of Service (hereinafter referred to as the "Terms") set forth the conditions for using the expense-tracking web application and AI advice features (hereinafter referred to as the "Service") provided by {import.meta.env.VITE_ADMIN} (hereinafter referred to as the "Administrator"). Participants in the research study who use the Service (hereinafter referred to as "Users") shall use the Service only after agreeing to these Terms.
            </P>

            <H2>Article 1 (Purpose)</H2>
            <P>
                The Service is a prototype application provided for the purpose of conducting academic research and practical experiments to evaluate the effectiveness of AI Bot advice on reviewing spending habits, saving money, and building savings among university students.
            </P>

            <H2>Article 2 (Account and Login Information Management)</H2>
            <OL>
                <li>
                    The Administrator will issue and assign each User a dedicated "User Code."
                </li>
                <li>
                    Users are responsible for appropriately managing their passwords and User Codes.
                </li>
                <li>
                    Users must not transfer, lend, or disclose their User Codes or passwords to any third party.
                </li>
            </OL>

            <H2>Article 3 (Usage Conditions and Data Recording)</H2>
            <OL>
                <li>
                    During the research period (Period 1 and Period 2), Users shall record their daily income, expenses, and savings account information in the Service using the specified methods.
                </li>
                <li>
                    Users may manually copy their records from the Service and provide them to the AI Bot to receive advice.
                </li>
                <li>
                    As the Service is currently in the prototype (MVP) stage, certain features, such as a personal settings page and automatic integration between the application and the AI Bot, are not included.
                </li>
            </OL>

            <H2>Article 4 (Prohibited Activities)</H2>
            <P>
                Users must not engage in any of the following activities when using the Service:
            </P>
            <OL>
                <li>
                    Using another User's User Code or password.
                </li>
                <li>
                    Unauthorized access to the Service's systems or reverse engineering.
                </li>
                <li>
                    Intentionally and repeatedly entering false information in a manner that significantly compromises the accuracy of the research data.
                </li>
                <li>
                    Any activity that infringes upon the rights or interests of the Service, other Users, or the Administrator.
                </li>
            </OL>

            <H2>Article 5 (Suspension, Modification, and Termination of the Service)</H2>
            <P>
                The Administrator may suspend, modify, or terminate the provision of the Service without prior notice to Users in the event of the end of the research period, system maintenance, or other unavoidable circumstances.
            </P>

            <H2>Article 6 (Disclaimer)</H2>
            <OL>
                <li>
                    Information provided by the Service, including advice from the AI Bot, is for reference purposes only and does not guarantee any specific financial results or successful savings outcomes.
                </li>
                <li>
                    The Administrator shall not be liable for any damages incurred by Users as a result of using the Service, except in cases involving intentional misconduct or gross negligence.
                </li>
            </OL>
        </main>
    </div>
);

export default TermsOfService;
