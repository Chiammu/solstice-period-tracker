import { useAppContext } from '../context/AppContext';

const Settings = () => {
    const { state } = useAppContext();

    const { signOut } = useAppContext();
    const handleReset = () => {
        if (confirm("Are you sure you want to sign out?")) {
            signOut();
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark pb-24">
            <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-white/5">
                <h2 className="text-xl font-bold flex-1">Settings</h2>
            </header>

            <main className="flex-1">
                <div className="px-4 py-6">
                    <div className="flex flex-col items-center gap-4 bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm">
                        <div className="relative">
                            <div className="bg-center bg-cover rounded-full h-24 w-24 ring-4 ring-background-light dark:ring-background-dark" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_hKGegk0kOpNj0ipjUJfUIXJ2OaQzwLZHakdXddJvCi_IKaR3vTr6NFXE1VNnNTDIqJWrj0grJvrJouhfU-J9E3FHSaoA4kmK58MiTU8GKEUDONcwVFjC4LtNIQ6HB9qIGwdfj_uP05FaqFmmvwyKvJtECC_MX4wZ5iCa79bFEXbdVgwFxL63Zk_a_9ZHKKqJfViFRU8AbRYyHK_mOXKPvKqi5EF9OJJa3Rb8GHlCisUYuPJ4Ac0fZfoL7cprFzZgMnEwbnX1Fwy2")' }}></div>
                            <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-lg border-2 border-background-light dark:border-background-dark flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold">{state.full_name || 'User'}</h3>
                            <p className="text-gray-500 dark:text-[#b99db0] text-sm font-medium mt-1">Free Plan</p>
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider px-6 pb-2">Cycle & Health</h3>
                    <div className="flex flex-col gap-[1px] bg-gray-200 dark:bg-white/5 mx-4 rounded-xl overflow-hidden">
                        {[
                            { label: 'Cycle Length', value: `${state.cycleLength} Days`, icon: 'sync', color: 'bg-blue-500' },
                            { label: 'Period Length', value: `${state.periodLength} Days`, icon: 'water_drop', color: 'bg-primary' },
                            { label: 'Contraceptive', value: 'None', icon: 'medication', color: 'bg-purple-500' },
                        ].map(item => (
                            <button key={item.label} className="flex items-center gap-4 bg-white dark:bg-surface-dark px-4 min-h-[60px] justify-between hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`text-white flex items-center justify-center rounded-full ${item.color} size-8 shadow-sm`}>
                                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                    </div>
                                    <p className="font-medium">{item.label}</p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="text-sm">{item.value}</span>
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 px-4">
                    <button
                        onClick={handleReset}
                        className="w-full py-4 text-center rounded-xl bg-white dark:bg-surface-dark text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-colors shadow-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Settings;
