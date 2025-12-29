import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday, subDays, parseISO } from 'date-fns';
import { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeCycles } from '../lib/cycleUtils';

const Dashboard = () => {
    const { state } = useAppContext();
    const navigate = useNavigate();
    const today = new Date();
    const [displayedDate, setDisplayedDate] = useState(today);

    // Smart Predictions
    const { averageLength, lastPeriodStart: calculatedLastStart } = useMemo(() =>
        analyzeCycles(state.logs, state.cycleLength),
        [state.logs, state.cycleLength]);

    const activeCycleLength = averageLength;
    const activeLastStart = calculatedLastStart || (state.lastPeriodStart ? new Date(state.lastPeriodStart) : today);

    // Basic calculations
    const cycleDay = (differenceInDays(today, activeLastStart) % activeCycleLength) + 1;
    const daysUntilNext = activeCycleLength - cycleDay + 1;

    const todayKey = format(today, 'yyyy-MM-dd');
    const todayLog = state.logs[todayKey];

    // Notifications Logic
    useEffect(() => {
        if (!state.notificationsEnabled) return;
        if (Notification.permission !== 'granted') return;

        const notifKey = `notif_sent_${todayKey}`;
        if (localStorage.getItem(notifKey)) return;

        // 1. Period Reminder
        if (daysUntilNext <= 2 && daysUntilNext > 0) {
            new Notification("Period Coming Soon", {
                body: `Your period is likely to start in ${daysUntilNext} days. Preparing is caring!`,
                icon: '/pwa-192x192.png' // ensuring icon exists or fallback
            });
            localStorage.setItem(notifKey, 'true');
            return;
        }

        // 2. Log Reminder (after 6 PM)
        const currentHour = new Date().getHours();
        if (!todayLog && currentHour >= 18) {
            new Notification("Log Your Symptoms", {
                body: "How are you feeling today? Take a moment to log your symptoms.",
                icon: '/pwa-192x192.png'
            });
            localStorage.setItem(notifKey, 'true');
        }
    }, [state.notificationsEnabled, daysUntilNext, todayLog, todayKey]);

    // Phases (simplified)

    const days = eachDayOfInterval({
        start: startOfMonth(displayedDate),
        end: endOfMonth(displayedDate)
    });

    const nextMonth = () => setDisplayedDate(addDays(endOfMonth(displayedDate), 1));
    const prevMonth = () => setDisplayedDate(addDays(startOfMonth(displayedDate), -1));
    const resetToToday = () => setDisplayedDate(today);

    // Calculate Inferred Period Days based on Start Logs
    const inferredPeriodDates = useMemo(() => {
        const dates = new Set<string>();
        const sortedLogKeys = Object.keys(state.logs).sort();

        sortedLogKeys.forEach(dateKey => {
            const log = state.logs[dateKey];
            if (log.flow) {
                const current = parseISO(dateKey);
                // Check if this is a new start (either no previous end, or current is after previous end)
                // Also allowing a small gap (e.g. if I log day 1, then day 28, day 28 is new)
                // A simple heuristic: If the previous day was NOT logged with flow, assume start.

                const prevDay = subDays(current, 1);
                const prevKey = format(prevDay, 'yyyy-MM-dd');
                const isContinuation = state.logs[prevKey]?.flow;

                if (!isContinuation) {
                    // This is a start date. Project forward state.periodLength
                    for (let i = 0; i < state.periodLength; i++) {
                        const d = addDays(current, i);
                        dates.add(format(d, 'yyyy-MM-dd'));
                    }
                }
            }
        });
        return dates;
    }, [state.logs, state.periodLength]);

    const getDayStatus = (date: Date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const log = state.logs[dateKey];

        // 1. If explicitly logged as period OR inferred from a start log
        if (log?.flow || inferredPeriodDates.has(dateKey)) return 'period';

        // 2. If it is in the PAST (before today) but NOT logged, do NOT show prediction
        if (isBefore(date, startOfToday())) return 'normal';

        // 3. For Future/Today: Use Prediction logic
        const diff = differenceInDays(date, activeLastStart) % activeCycleLength;
        const normalizedDiff = diff < 0 ? diff + activeCycleLength : diff;

        if (normalizedDiff < state.periodLength) return 'period';
        if (normalizedDiff === 13) return 'ovulation';
        if (normalizedDiff > 10 && normalizedDiff < 16) return 'fertile';
        return 'normal';
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-transparent dark:border-white/5 transition-colors">
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1">Calendar</h2>
                <div className="flex w-12 items-center justify-end">
                    <button
                        onClick={resetToToday}
                        className="text-primary text-sm font-bold leading-normal hover:opacity-80 transition-opacity"
                    >
                        Today
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col gap-6 p-4">

                {/* Calendar View */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <p className="text-slate-900 dark:text-white text-lg font-bold">{format(displayedDate, 'MMMM yyyy')}</p>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-slate-400 dark:text-gray-500 text-[11px] font-bold uppercase flex h-8 items-center justify-center">{d}</div>
                        ))}
                        {days.map(day => {
                            const status = getDayStatus(day);
                            const isToday = isSameDay(day, today);

                            return (
                                <div
                                    key={day.toString()}
                                    className="h-14 w-full relative flex items-center justify-center cursor-pointer"
                                    onClick={() => navigate(`/log?date=${format(day, 'yyyy-MM-dd')}`)}
                                >
                                    {status === 'period' && (
                                        <div className="absolute inset-y-1 w-full bg-primary/20 dark:bg-primary/30"></div>
                                    )}
                                    <div className={`relative z-10 flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all ${status === 'period' ? 'bg-primary text-white' :
                                        isToday ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/40 transform scale-110' :
                                            status === 'ovulation' ? 'border border-dashed border-primary text-primary' :
                                                'text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                                        }`}>
                                        {format(day, 'd')}
                                        {status === 'ovulation' && (
                                            <span className="absolute top-0 right-1 size-2 bg-teal-400 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-2 px-4">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-primary"></div>
                        <span className="text-xs text-slate-600 dark:text-text-secondary">Period</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full border border-dashed border-primary relative">
                            <div className="absolute -top-0.5 -right-0.5 size-1.5 bg-teal-400 rounded-full"></div>
                        </div>
                        <span className="text-xs text-slate-600 dark:text-text-secondary">Ovulation</span>
                    </div>
                </div>

                {/* Today's Log Summary */}
                {todayLog && (
                    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Today's Log</h4>
                        <div className="flex flex-wrap gap-2">
                            {todayLog.flow && (
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 capitalize">
                                    {todayLog.flow} Flow
                                </span>
                            )}
                            {todayLog.symptoms.map(s => (
                                <span key={s} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 text-xs font-medium">
                                    {s}
                                </span>
                            ))}
                            {todayLog.moods.map(m => (
                                <span key={m} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 text-xs font-medium">
                                    {m}
                                </span>
                            ))}
                        </div>
                        {todayLog.notes && (
                            <p className="text-sm italic text-slate-400 mt-1 line-clamp-2">"{todayLog.notes}"</p>
                        )}
                    </div>
                )}

                {/* FAB */}
                <div className="w-full pt-4 pb-8">
                    <Link
                        to="/log"
                        className="w-full flex cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white shadow-lg shadow-primary/25"
                    >
                        <span className="material-symbols-outlined mr-2">add_circle</span>
                        <span className="text-base font-bold tracking-wide">Log Symptoms</span>
                    </Link>
                </div>
            </main>
        </div>
    );
};
export default Dashboard;
