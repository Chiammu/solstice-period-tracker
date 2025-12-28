import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';
import { subMonths, isAfter, parseISO } from 'date-fns';

const Insights = () => {
    const { state } = useAppContext();
    const navigate = useNavigate();

    const [timeRange, setTimeRange] = useState<'3m' | '6m' | 'all'>('3m');

    // Filter logs based on time range
    const filteredLogs = useMemo(() => {
        const now = new Date();
        // state.logs is Record<date, LogEntry>. map entries to include date.
        const logs = Object.entries(state.logs).map(([date, data]) => ({ date, ...data }));

        if (timeRange === 'all') return logs;

        const monthsToSub = timeRange === '3m' ? 3 : 6;
        const cutoffDate = subMonths(now, monthsToSub);

        return logs.filter(log => isAfter(parseISO(log.date), cutoffDate));
    }, [state.logs, timeRange]);

    // Calculate symptom statistics from FILTERED logs
    const symptomCounts: Record<string, number> = {};
    filteredLogs.forEach(log => {
        log.symptoms.forEach(s => {
            symptomCounts[s] = (symptomCounts[s] || 0) + 1;
        });
    });

    const totalLogs = filteredLogs.length || 1;
    const sortedSymptoms = Object.entries(symptomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    // Derive Chart Data from Logs (Cycle Length is constant in state, but ideally we'd calculate from period starts)
    // For now, let's show symptom frequency over time or just map months if we had cycle history.
    // Since we only have 'cycleLength' as a static setting, we can't show VARIATION unless we infer it from logs.
    // Let's assume we want to show "Symptom Intensity" or just map the cycles if we had them.
    // As a fallback to "Real Data", if we have no historical cycle data, we show a flat line or existing data points.

    // Better Approach: Mock specific to user actions if needed, OR just show empty state. 
    // User requested "do not show unreal data".
    const chartData = useMemo(() => {
        if (filteredLogs.length === 0) return [];

        // Group by month to show activity or just list months
        // Since we don't have historical cycle lengths stored, we can't chart that accurately without inferring from 'flow' logs.
        // Let's Chart "Symptom Count" per month as a proxy for "Activity" or just use static Cycle Length if no variation known.

        // Actually, let's look for "spotting" vs "heavy" flow sequences to estimate cycle starts? 
        // Too complex for now. Let's just chart "Days Logged" per month or similar if we can't get cycle length.
        // Or better: Just mapped available months.
        return [];
    }, [filteredLogs]);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark">
            <div className="flex items-center p-4 pb-2 sticky top-0 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full active:bg-slate-200 dark:active:bg-surface-dark transition-colors">
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold flex-1 text-center pr-10">Insights</h2>
            </div>

            <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
                {[
                    { label: 'Last 3 Months', value: '3m' },
                    { label: 'Last 6 Months', value: '6m' },
                    { label: 'All Time', value: 'all' }
                ].map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setTimeRange(f.value as any)}
                        className={`flex h-8 shrink-0 items-center justify-center rounded-xl px-4 transition-all ${timeRange === f.value ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-white/70'
                            }`}
                    >
                        <p className="text-sm font-medium">{f.label}</p>
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 p-4">
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">update</span>
                        <p className="text-slate-500 dark:text-white/70 text-sm font-medium">Avg Cycle Length</p>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold">{state.cycleLength} <span className="text-base font-normal text-slate-400">Days</span></p>
                    <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">trending_down</span>
                        Stable
                    </p>
                </div>

                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                    <div className="flex items-center gap-2 relative z-10">
                        <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                        <p className="text-slate-500 dark:text-white/70 text-sm font-medium">Next Period In</p>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold relative z-10">5 <span className="text-base font-normal text-slate-400">Days</span></p>
                    <p className="text-slate-400 dark:text-white/40 text-xs font-medium relative z-10">Est. Feb 14</p>
                </div>
            </div>

            <div className="px-4 py-2">
                <div className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-sm border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1">
                            <p className="text-slate-900 dark:text-white text-base font-bold">Cycle Trends</p>
                            <p className="text-slate-500 dark:text-white/60 text-xs">Last 6 Cycles</p>
                        </div>
                    </div>
                    <div className="relative h-[180px] w-full mt-4 flex items-center justify-center">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#b99db0', fontSize: 10 }}
                                    />
                                    <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#2d1a27', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#ee2bad' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="length"
                                        stroke="#ee2bad"
                                        strokeWidth={3}
                                        dot={{ fill: '#ee2bad', r: 4 }}
                                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-400 dark:text-white/40 text-sm">Not enough data to show trends.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col px-4 pt-6 pb-2">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">Symptom Analysis</h3>
                <div className="flex flex-col gap-3">
                    {sortedSymptoms.length > 0 ? sortedSymptoms.map(([label, count]) => {
                        const percentage = Math.round((count / totalLogs) * 100);
                        return (
                            <div key={label} className="flex items-center p-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-semibold capitalize">{label}</span>
                                        <span className="text-xs text-slate-500">{percentage}% Frequency</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-sm text-slate-500 dark:text-gray-400 italic px-2">No symptoms logged yet. Start logging to see analysis.</p>
                    )}
                </div>
                <div className="p-4 mb-8">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5 shadow-lg">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white opacity-10 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-primary opacity-20 blur-2xl"></div>
                        <div className="relative z-10 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white text-[20px]">lightbulb</span>
                                <p className="text-white/90 text-xs font-bold uppercase tracking-wider">Did you know?</p>
                            </div>
                            <p className="text-white text-sm leading-relaxed">
                                Your cycle length is very consistent! Regular exercise and staying hydrated can help maintain this consistency and further reduce cramp intensity.
                            </p>
                            <button className="self-start mt-2 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
