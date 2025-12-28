import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const symptomsList = [
    { id: 'cramps', label: 'Cramps', icon: 'spa' },
    { id: 'headache', label: 'Headache', icon: 'neurology' },
    { id: 'bloating', label: 'Bloating', icon: 'air' },
    { id: 'acne', label: 'Acne', icon: 'face' },
    { id: 'fatigue', label: 'Fatigue', icon: 'battery_alert' },
    { id: 'backache', label: 'Backache', icon: 'accessibility_new' },
];

const moodsList = [
    { id: 'happy', label: 'Happy', icon: 'sentiment_satisfied' },
    { id: 'sad', label: 'Sad', icon: 'sentiment_dissatisfied' },
    { id: 'irritable', label: 'Irritable', icon: 'sentiment_frustrated' },
    { id: 'anxious', label: 'Anxious', icon: 'sentiment_worried' },
    { id: 'energetic', label: 'Energetic', icon: 'bolt' },
    { id: 'calm', label: 'Calm', icon: 'self_improvement' },
];

const LogDetails = () => {
    const { updateLog } = useAppContext();
    const navigate = useNavigate();
    const today = format(new Date(), 'yyyy-MM-dd');

    const [flow, setFlow] = useState<'spotting' | 'light' | 'medium' | 'heavy' | null>('medium');
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const [notes, setNotes] = useState('');

    const toggleSymptom = (id: string) => {
        setSelectedSymptoms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleMood = (id: string) => {
        setSelectedMoods(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleSave = () => {
        updateLog(today, { flow, symptoms: selectedSymptoms, moods: selectedMoods, notes });
        navigate('/');
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 pt-4 pb-3">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-bold flex-1 text-center">Log Details</h1>
                    <button className="flex h-10 items-center justify-end px-2 rounded-full">
                        <span className="text-primary font-bold text-sm">{format(new Date(), 'MMM dd')}</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Flow Intensity */}
                <section className="mt-6">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold px-5 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">water_drop</span>
                        Flow Intensity
                    </h3>
                    <div className="px-5">
                        <div className="flex p-1 bg-gray-200 dark:bg-white/5 rounded-xl">
                            {['spotting', 'light', 'medium', 'heavy'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFlow(f as any)}
                                    className={`flex-1 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${flow === f ? 'bg-primary text-white shadow-md' : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Symptoms */}
                <section className="mt-8">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold px-5 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">healing</span>
                        Symptoms
                    </h3>
                    <div className="grid grid-cols-2 gap-3 px-5">
                        {symptomsList.map(s => (
                            <button
                                key={s.id}
                                onClick={() => toggleSymptom(s.id)}
                                className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${selectedSymptoms.includes(s.id)
                                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(238,43,173,0.15)]'
                                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark'
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${selectedSymptoms.includes(s.id) ? 'text-primary fill-1' : 'text-gray-400'}`}>{s.icon}</span>
                                <span className={`text-sm font-semibold flex-1 text-left ${selectedSymptoms.includes(s.id) ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {s.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Mood */}
                <section className="mt-8">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold px-5 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">mood</span>
                        Mood
                    </h3>
                    <div className="grid grid-cols-3 gap-3 px-5">
                        {moodsList.map(m => (
                            <button
                                key={m.id}
                                onClick={() => toggleMood(m.id)}
                                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 py-4 transition-all ${selectedMoods.includes(m.id)
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-3xl ${selectedMoods.includes(m.id) ? 'text-primary fill-1' : 'text-gray-400'}`}>{m.icon}</span>
                                <span className={`text-xs font-medium ${selectedMoods.includes(m.id) ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {m.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Notes */}
                <section className="mt-8 mb-4">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold px-5 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">edit_note</span>
                        Daily Notes
                    </h3>
                    <div className="px-5">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-32 bg-white dark:bg-surface-dark text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-white/10 p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none placeholder-gray-400 dark:placeholder-gray-600 text-base"
                            placeholder="Add a personal note..."
                        ></textarea>
                    </div>
                </section>
            </main>

            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12">
                <button
                    onClick={handleSave}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    Save Log
                </button>
            </div>
        </div>
    );
};

export default LogDetails;
