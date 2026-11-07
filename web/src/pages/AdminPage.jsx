// pages/AdminPage.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
    PieChart, Pie, Cell,
} from 'recharts';

import { Card } from '../components/Card';
import PeriodFilter from '../components/Admin/PeriodFilter.jsx';
import { useAdminDashboard } from '../hooks/useAdminDashboard.js';
import { capitalize, CATEGORY_COLORS, FALLBACK_COLORS, formatYen, shiftMonth } from '../lib/utlis';

const FONT_JP = "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif";
const MAX_DAYS = 366;

const tooltipStyle = { borderRadius: 12, borderColor: '#D9DDD8', fontFamily: FONT_JP };
const tickYen = (v) => (v >= 10000 ? `${v / 10000}万` : v);

const METRICS = [
    { id: 'average', label: '1人あたりの平均', key: 'average' },
    { id: 'total', label: '全員の合計', key: 'total' },
];

// ---------- Date helpers (Japan time) ----------

const todayJst = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());

const addDays = (dateStr, n) => {
    const d = new Date(`${dateStr}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
};

const monthRange = (key) => {
    const [y, m] = key.split('-').map(Number);
    const last = new Date(y, m, 0).getDate();
    return { from: `${key}-01`, to: `${key}-${String(last).padStart(2, '0')}` };
};

const daysBetween = (from, to) => Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1;

// "2026-10-31" -> "10月31日(土)". It is a calendar date, so format it as UTC to avoid any shift.
const dayLabel = (fullDate) =>
    new Intl.DateTimeFormat('ja-JP', { timeZone: 'UTC', month: 'long', day: 'numeric', weekday: 'short' })
        .format(new Date(`${fullDate}T00:00:00Z`));

// ---------- Page ----------

const AdminPage = () => {
    // 1. Date range
    const today = todayJst();
    const thisMonth = today.slice(0, 7);

    const presets = [
        { id: '7', label: '直近7日', range: { from: addDays(today, -6), to: today } },
        { id: 'month', label: '今月', range: { from: `${thisMonth}-01`, to: today } },
        { id: 'last', label: '先月', range: monthRange(shiftMonth(thisMonth, -1)) },
    ];

    const [range, setRange] = useState(presets[0].range);
    const [metric, setMetric] = useState('average');
    const [selectedDate, setSelectedDate] = useState(null);
    const pieRef = useRef(null);

    // 2. Validate the range
    let rangeError = '';
    if (!range.from || !range.to) rangeError = '開始日と終了日を選択してください';
    else if (range.from > range.to) rangeError = '開始日は終了日より前の日付にしてください';
    else if (range.to > today) rangeError = '未来の日付は選択できません';
    else if (daysBetween(range.from, range.to) > MAX_DAYS) rangeError = '期間は1年以内にしてください';

    // 3. Fetch
    const { data, isFetching, isError, error } = useAdminDashboard({
        startDate: range.from,
        endDate: range.to,
        enabled: !rangeError,
    });

    // 4. Loading / error toast
    useEffect(() => {
        if (isFetching) toast.loading('読み込み中…', { id: 'admin' });
        else if (isError) toast.error(error?.response?.data?.message ?? 'データを取得できませんでした。', { id: 'admin' });
        else toast.dismiss('admin');
    }, [isFetching, isError, error]);

    useEffect(() => () => toast.dismiss('admin'), []);

    // A new period clears the selected day
    useEffect(() => {
        setSelectedDate(null);
    }, [range.from, range.to]);

    // 5. Prepare data (the API sends numbers as strings)
    const { daily, categories, sum, average } = useMemo(() => {
        const daily = (data?.DailyExpenses ?? []).map((r) => {
            const fullDate = String(r.date).slice(0, 10); // the API sends "YYYY-MM-DD"
            return {
                fullDate,
                date: fullDate.slice(5).replace('-', '/'),
                total: Number(r.total_expense),
                average: Number(r.average_expense_per_user),
            };
        });

        const categories = (data?.expensesChart ?? []).map((c, i) => ({
            name: capitalize(c.category),
            amount: Number(c.amount),
            percent: Number(c.percent),
            color: CATEGORY_COLORS[c.category] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        }));

        return {
            daily,
            categories,
            sum: daily.reduce((s, r) => s + r.total, 0),
            average: Number(data?.totalAverageExpenses ?? 0),
        };
    }, [data]);

    // Pie chart: the selected day, or the whole period
    const shownCategories = useMemo(() => {
        if (!selectedDate) return categories;

        const rows = (data?.DailyCategoryExpenses ?? []).filter((item) => item.date === selectedDate);
        const total = rows.reduce((s, item) => s + Number(item.amount), 0);

        return rows.map((item, i) => ({
            name: capitalize(item.category),
            amount: Number(item.amount),
            percent: total ? Math.round((Number(item.amount) / total) * 1000) / 10 : 0,
            color: CATEGORY_COLORS[item.category] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        }));
    }, [data, selectedDate, categories]);

    // 6. Selecting a day (chart or table)
    const selectDay = (fullDate, { scroll = false } = {}) => {
        if (!fullDate) return;
        setSelectedDate((prev) => (prev === fullDate ? null : fullDate)); // click again to clear
        if (scroll) {
            // On a phone the pie chart can be off screen, so bring it into view
            setTimeout(() => pieRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
        }
    };

    const hasData = daily.length > 0 && sum > 0;
    const metricKey = METRICS.find((m) => m.id === metric).key;
    const metricLabel = METRICS.find((m) => m.id === metric).label;
    const selectedChartLabel = daily.find((d) => d.fullDate === selectedDate)?.date;

    // 7. Render
    return (
        <div className="min-h-screen bg-[#F5F6F4] text-[#12202F]" style={{ fontFamily: FONT_JP }}>
            <main className="max-w-5xl mx-auto px-4 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] space-y-4">
                <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>

                <PeriodFilter
                    range={range}
                    onRangeChange={setRange}
                    presets={presets}
                    rangeError={rangeError}
                    today={today}
                />

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <p className="text-sm font-semibold text-[#12202F]/60">1人あたりの1日平均支出</p>
                        <p className="text-3xl font-bold text-[#0F7B5F] mt-2">{formatYen(Math.round(average))}</p>
                    </Card>
                    <Card>
                        <p className="text-sm font-semibold text-[#12202F]/60">期間の支出合計（全員）</p>
                        <p className="text-3xl font-bold mt-2 wrap-break-word">{formatYen(sum)}</p>
                    </Card>
                    <Card>
                        <p className="text-sm font-semibold text-[#12202F]/60">対象の日数</p>
                        <p className="text-3xl font-bold mt-2">{daily.length}日</p>
                    </Card>
                </div>

                {isFetching && !data && (
                    <Card>
                        <p className="text-center py-10 text-sm text-[#12202F]/55">データを読み込んでいます...</p>
                    </Card>
                )}

                {!isFetching && !hasData && (
                    <Card>
                        <p className="text-sm text-[#12202F]/55 py-10 text-center">この期間の支出データはありません</p>
                    </Card>
                )}

                {hasData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        {/* Left: trend chart + day table */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card>
                                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                    <div>
                                        <h2 className="font-bold">1日ごとの支出の推移</h2>
                                        <p className="text-xs text-[#12202F]/60 leading-relaxed">
                                            グラフの日付をタップすると、その日のカテゴリ別支出を表示します。
                                        </p>
                                    </div>

                                    <div className="flex gap-1 p-1 rounded-xl bg-[#12202F]/5" role="tablist">
                                        {METRICS.map((m) => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                role="tab"
                                                aria-selected={metric === m.id}
                                                onClick={() => setMetric(m.id)}
                                                className={`h-9 px-3 rounded-lg text-xs font-semibold transition ${metric === m.id ? 'bg-[#0F7B5F] text-white' : 'text-[#12202F]/60 active:bg-black/5'
                                                    }`}
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={daily}
                                            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                                            style={{ cursor: 'pointer' }}
                                            onClick={(state) => {
                                                // works in recharts 2 and 3
                                                const i = Number(state?.activeTooltipIndex ?? state?.activeIndex);
                                                selectDay(daily[i]?.fullDate);
                                            }}
                                        >
                                            <defs>
                                                <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0F7B5F" stopOpacity={0.35} />
                                                    <stop offset="95%" stopColor="#0F7B5F" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#D9DDD8" />
                                            <XAxis dataKey="date" stroke="#12202F99" fontSize={12} minTickGap={16} />
                                            <YAxis stroke="#12202F99" fontSize={12} tickFormatter={tickYen} />
                                            <Tooltip formatter={(v) => [formatYen(v), metricLabel]} contentStyle={tooltipStyle} />
                                            <Area
                                                type="monotone"
                                                dataKey={metricKey}
                                                stroke="#0F7B5F"
                                                fill="url(#gSpend)"
                                                strokeWidth={2}
                                                activeDot={{ r: 7 }}
                                            />
                                            {selectedChartLabel && (
                                                <ReferenceLine x={selectedChartLabel} stroke="#D9480F" strokeDasharray="4 4" />
                                            )}
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Day table: tap a row to see that day's categories */}
                            <Card>
                                <h2 className="font-bold">日ごとの支出</h2>
                                <p className="text-xs text-[#12202F]/60 mb-3">行をタップすると、その日のカテゴリ別支出を表示します。</p>

                                <div className="max-h-80 overflow-y-auto overflow-x-hidden rounded-xl border border-[#D9DDD8]">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-[#F5F6F4] text-xs text-[#12202F]/60">
                                            <tr>
                                                <th scope="col" className="text-left font-semibold px-3 py-2">日付</th>
                                                <th scope="col" className="text-right font-semibold px-3 py-2">1人あたり</th>
                                                <th scope="col" className="text-right font-semibold px-3 py-2">合計</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#D9DDD8] bg-white">
                                            {daily.map((d) => {
                                                const selected = d.fullDate === selectedDate;
                                                return (
                                                    <tr
                                                        key={d.fullDate}
                                                        onClick={() => selectDay(d.fullDate, { scroll: true })}
                                                        className={`cursor-pointer transition ${selected ? 'bg-green-50' : 'active:bg-black/5'}`}
                                                    >
                                                        <td className="px-3 py-3 font-semibold">
                                                            <button
                                                                type="button"
                                                                aria-pressed={selected}
                                                                className="text-left min-h-6"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // the row handler already runs on click
                                                                    selectDay(d.fullDate, { scroll: true });
                                                                }}
                                                            >
                                                                {dayLabel(d.fullDate)}
                                                            </button>
                                                        </td>
                                                        <td className="px-3 py-3 text-right">{formatYen(Math.round(d.average))}</td>
                                                        <td className={`px-3 py-3 text-right ${d.total === 0 ? 'text-[#12202F]/40' : 'font-semibold'}`}>
                                                            {formatYen(d.total)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>

                        {/* Right: category share */}
                        <div ref={pieRef} className="lg:sticky lg:top-4">
                            <Card>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h2 className="font-bold">{selectedDate ? '選択した日のカテゴリ別支出' : 'カテゴリ別の割合'}</h2>
                                        <p className="text-xs text-[#12202F]/60 mb-2">
                                            {selectedDate ? `${dayLabel(selectedDate)}の支出内訳` : '期間全体の支出に対する割合'}
                                        </p>
                                    </div>
                                    {selectedDate && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDate(null)}
                                            className="h-9 text-xs text-[#0F7B5F] font-semibold whitespace-nowrap"
                                        >
                                            全期間に戻す
                                        </button>
                                    )}
                                </div>

                                {shownCategories.length === 0 ? (
                                    <p className="text-sm text-[#12202F]/55 py-10 text-center">この日の支出データはありません</p>
                                ) : (
                                    <>
                                        <div className="h-44 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={shownCategories} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3}>
                                                        {shownCategories.map((c) => (
                                                            <Cell key={c.name} fill={c.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(v, name) => [formatYen(v), name]} contentStyle={tooltipStyle} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <ul className="mt-2 space-y-2">
                                            {shownCategories.map((c) => (
                                                <li key={c.name} className="flex items-center justify-between gap-3 text-sm">
                                                    <span className="flex items-center gap-2 min-w-0">
                                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                                                        <span className="truncate">{c.name}</span>
                                                    </span>
                                                    <span className="shrink-0">
                                                        <span className="font-bold">{c.percent}%</span>
                                                        <span className="text-xs text-[#12202F]/55 ml-2">{formatYen(c.amount)}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;