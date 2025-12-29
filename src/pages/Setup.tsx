import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const Setup = () => {
    const { updateState } = useAppContext();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);
    const [goal, setGoal] = useState('track');
    const [name, setName] = useState('');

    const handleComplete = () => {

        updateState({
            lastPeriodStart: selectedDate.toISOString(),
            cycleLength,
            periodLength,
            goal,
            full_name: name,
            setupComplete: true
        });
    };

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const nextMonth = () => setCurrentMonth(addDays(endOfMonth(currentMonth), 1));
    const prevMonth = () => setCurrentMonth(addDays(startOfMonth(currentMonth), -1));

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark">
            <header className="flex items-center px-4 pt-6 pb-2 justify-between z-10 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <button className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-slate-800 dark:text-white">arrow_back</span>
                </button>
                <h1 className="text-slate-800 dark:text-white text-lg font-bold flex-1 text-center pr-10">Setup Profile</h1>
            </header>

            <div className="flex w-full flex-row items-center justify-center gap-2 py-4 px-6">
                <div className="h-1.5 flex-1 rounded-full bg-primary shadow-[0_0_10px_rgba(238,43,173,0.5)]"></div>
                <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-white/10"></div>
                <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-white/10"></div>
            </div>

            <main className="flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pb-32">
                <div className="mb-8 mt-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">Let's get to know your cycle</h2>
                    <p className="text-slate-500 dark:text-white/60 text-sm">Accurate predictions start with your history.</p>
                </div>

                {/* Question 0: Personal Info */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">What should we call you?</h3>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 py-2 text-lg focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
                        />
                    </div>
                </div>


                {/* Question 1: Last Period */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">3</span>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">When did your last period start?</h3>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <button
                                onClick={prevMonth}
                                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                            >
                                <span className="material-symbols-outlined text-slate-600 dark:text-white/80">chevron_left</span>
                            </button>
                            <p className="text-slate-800 dark:text-white font-bold">{format(currentMonth, 'MMMM yyyy')}</p>
                            <button
                                onClick={nextMonth}
                                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                            >
                                <span className="material-symbols-outlined text-slate-600 dark:text-white/80">chevron_right</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <span key={day} className="text-slate-400 dark:text-white/40 text-xs font-medium py-2 text-center">{day}</span>
                            ))}
                            {days.map(day => (
                                <button
                                    key={day.toString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all ${isSameDay(day, selectedDate)
                                        ? 'bg-primary text-white shadow-lg shadow-primary/40 font-semibold'
                                        : 'text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {format(day, 'd')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Question 2: Lengths */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-3 h-10">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">4</span>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">Cycle Length</h3>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center h-32 relative overflow-hidden group cursor-pointer">
                            <input
                                type="number"
                                value={cycleLength}
                                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                                className="bg-transparent border-none text-primary text-3xl font-bold text-center w-full focus:ring-0"
                            />
                            <span className="text-xs font-medium text-slate-500 dark:text-white/60">days</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-3 h-10">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">5</span>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">Period Length</h3>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center h-32 relative overflow-hidden group cursor-pointer">
                            <input
                                type="number"
                                value={periodLength}
                                onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                                className="bg-transparent border-none text-primary text-3xl font-bold text-center w-full focus:ring-0"
                            />
                            <span className="text-xs font-medium text-slate-500 dark:text-white/60">days</span>
                        </div>
                    </div>
                </div>

                {/* Question 3: Goals */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">6</span>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">What's your main goal?</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            { id: 'track', title: 'Track Cycle', sub: 'Monitor periods and health', icon: 'calendar_month' },
                            { id: 'conceive', title: 'Try to Conceive', sub: 'Identify fertile windows', icon: 'child_care' },
                            { id: 'pregnancy', title: 'Track Pregnancy', sub: 'Follow baby\'s growth', icon: 'pregnant_woman' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setGoal(item.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${goal === item.id
                                    ? 'border-primary bg-primary/10 dark:bg-primary/5'
                                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${goal === item.id ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60'}`}>
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-white/60">{item.sub}</p>
                                    </div>
                                </div>
                                {goal === item.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent z-20 max-w-md mx-auto text-center">
                <button
                    onClick={handleComplete}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
                >
                    Continue to Dashboard
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default Setup;
