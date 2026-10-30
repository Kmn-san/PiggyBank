import { Card } from '../Card'
import {
    ResponsiveContainer,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { FONT_JP, formatYen } from '../../lib/utlis'
const CATEGORY_COLORS = {
    food: '#0F7B5F',
    transport: '#E8A317',
    education: '#2B7FB8',
    entertainment: '#D9480F',
    shopping: '#7C5CBF',
}
const FALLBACK_COLORS = ['#64748B', '#B45309', '#7C5CBF']

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function Charts({ expenses = [] }) {
    const chartData = expenses
        .map((e, i) => ({
            name: capitalize(e.category),
            amount: Number(e.amount),
            color: CATEGORY_COLORS[e.category] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        }))
        .filter((e) => e.amount > 0)
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
                <h2 className="font-bold">今月の支出内訳</h2>
                <p className="text-xs text-[#12202F]/60 mb-2">カテゴリ別</p>

                {chartData.length === 0 ? (
                    <p className="text-sm text-[#12202F]/55 py-10 text-center">
                        今月の支出はまだありません
                    </p>
                ) : (
                    <>
                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={48}
                                        outerRadius={72}
                                        paddingAngle={3}
                                    >
                                        {chartData.map((c) => (
                                            <Cell key={c.name} fill={c.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v, name) => [formatYen(v), name]}
                                        contentStyle={{ borderRadius: 12, borderColor: '#D9DDD8', fontFamily: FONT_JP }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <ul className="mt-2 space-y-2">
                            {chartData.map((c) => (
                                <li key={c.name} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                                        {c.name}
                                    </span>
                                    <span className="font-semibold">{formatYen(c.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Card>
        </div>
    )
}

export default Charts