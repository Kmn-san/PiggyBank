export const Card = ({ children, className = '' }) => (
    <section className={`bg-white rounded-2xl border border-[#D9DDD8] p-5 ${className}`}>{children}</section>
);