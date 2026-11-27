
import { ArrowLeft, PiggyBank } from 'lucide-react';

const FONT = "Arial, sans-serif";

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
    <div className="min-h-screen bg-[#F5F6F4]" style={{ fontFamily: FONT }}>
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
            <h1 className="text-3xl font-bold text-[#12202F] leading-tight">
                Privacy Policy
            </h1>
            <p className="text-sm text-[#12202F]/55 mt-2 mb-8">
                Personal Information Protection Policy
            </p>

            <P>
                {import.meta.env.VITE_ADMIN} (hereinafter referred to as the "Administrator") establishes this Privacy Policy (hereinafter referred to as the "Policy") regarding the handling of User information in this research study and the Service, and will manage such information appropriately.
            </P>

            <H2>1. Information Collected</H2>
            <P>
                The Service collects and retains the following information:
            </P>
            <UL>
                <li>
                    <strong>Account Identification Information:</strong> User Codes and hashed passwords.
                </li>
                <li>
                    <strong>Transaction and Usage Data:</strong> Income and expense amounts, transaction dates, categories, notes, and account information (such as account types and savings balances).
                </li>
                <li>
                    <strong>Aggregated and Analytical Data:</strong> Weekly total expenses, average daily expenses, and changes in spending patterns before and after using the Service.
                </li>
            </UL>

            <H2>2. Purpose of Use</H2>
            <P>
                The collected data will be used solely for the following purposes:
            </P>
            <OL>
                <li>
                    To provide Users with features for reviewing and managing their own spending activities through the Service.
                </li>
                <li>
                    To aggregate and analyze the effectiveness of spending reviews and changes in spending patterns for academic research.
                </li>
                <li>
                    To support the presentation of research findings in academic papers, reports, presentation materials, and other research-related publications.
                </li>
            </OL>

            <H2>3. Data Anonymization and Management</H2>
            <OL>
                <li>
                    When analyzing and publishing research results, Users' real names and other information that could directly identify individuals will not be used. All data will be processed using anonymous IDs (identifiers), such as "User A" and "User B."
                </li>
                <li>
                    Passwords are hashed before being stored in the database. Even the Administrator cannot view the original plain-text passwords.
                </li>
            </OL>

            <H2>4. Disclosure of Information to Third Parties</H2>
            <P>
                The Administrator will not provide collected User information to any third party without the User's prior consent, except where required by applicable laws and regulations. Please note that when using the AI Bot, any data that Users manually copy and paste into an external AI service is provided based on the Users' own actions.
            </P>

            <H2>5. Data Retention and Deletion</H2>
            <P>
                Data collected for this research will be securely deleted or permanently destroyed in a manner that prevents recovery after the completion of the research and preparation of the final report.
            </P>

            <H2>6. Voluntary Participation and Withdrawal</H2>
            <P>
                Participation in this research study is entirely voluntary. Even after providing consent, Users may withdraw from the study at any time without suffering any disadvantage. If a User requests to withdraw, their data will be excluded from the research analysis.
            </P>

            <H2>7. Contact Information</H2>
            <P>
                For inquiries or concerns regarding this Policy or the handling of personal information, please contact:
            </P>
            <UL>
                <li>
                    <strong>Person in Charge (Administrator):</strong> {import.meta.env.VITE_ADMIN}
                </li>
                <li>
                    <strong>Contact Email:</strong> {import.meta.env.VITE_EMAIL}
                </li>
            </UL>
        </main>
    </div>
);

export default PrivacyPolicy;
