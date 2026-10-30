export const ProgressBar = ({ pct }) => (
    <div className="h-2 rounded-full bg-[#12202F]/10 overflow-hidden">
        <div className="h-full rounded-full bg-[#0F7B5F] transition-all" style={{ width: `${pct}%` }} />
    </div>
);