import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Insights = () => {
    const { state } = useAppContext();
    const navigate = useNavigate();

    // Calculate symptom statistics
    const symptomCounts: Record<string, number> = {};
    const logsArray = Object.values(state.logs);

    logsArray.forEach(log => {
        log.symptoms.forEach(s => {
            symptomCounts[s] = (symptomCounts[s] || 0) + 1;
        });
    });

    const totalLogs = logsArray.length || 1;
    const sortedSymptoms = Object.entries(symptomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    // Mock historical data for the chart if empty
    const chartData = [
        { name: 'Aug', length: 29 },
        { name: 'Sep', length: 28 },
        { name: 'Oct', length: 27 },
        { name: 'Nov', length: 28 },
        { name: 'Dec', length: state.cycleLength || 28 },
        { name: 'Jan', length: state.cycleLength || 28 },
    ];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark">
            <div className="flex items-center p-4 pb-2 sticky top-0 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full active:bg-slate-200 dark:active:bg-surface-dark transition-colors">
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold flex-1 text-center pr-10">Insights</h2>
            </div>

            <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
                {['Last 3 Months', 'Last 6 Months', 'All Time'].map((f, i) => (
                    <button
                        key={f}
                        className={`flex h-8 shrink-0 items-center justify-center rounded-xl px-4 transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-white/70'
                            }`}
                    >
                        <p className="text-sm font-medium">{f}</p>
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
                            <p className="text-slate-900 dark:text-white text-base font-bold">Cycle Length Variation</p>
                            <p className="text-slate-500 dark:text-white/60 text-xs">Last 6 Cycles</p>
                        </div>
                    </div>
                    <div className="relative h-[180px] w-full mt-4">
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
