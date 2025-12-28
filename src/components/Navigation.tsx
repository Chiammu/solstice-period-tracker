import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="fixed bottom-0 z-20 w-full bg-background-light dark:bg-surface-dark border-t border-slate-200 dark:border-white/5 px-4 pb-6 pt-2 transition-colors">
            <div className="flex justify-between items-end gap-2 max-w-md mx-auto">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-1 flex-col items-center justify-end gap-1 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-text-secondary'}`}
                >
                    <span className="material-symbols-outlined text-[26px]">calendar_today</span>
                    <p className="text-[10px] font-medium uppercase tracking-wide">Calendar</p>
                </NavLink>

                <NavLink
                    to="/insights"
                    className={({ isActive }) => `flex flex-1 flex-col items-center justify-end gap-1 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-text-secondary'}`}
                >
                    <span className="material-symbols-outlined text-[26px]">monitoring</span>
                    <p className="text-[10px] font-medium uppercase tracking-wide">Insights</p>
                </NavLink>

                <NavLink
                    to="/log"
                    className={({ isActive }) => `flex flex-1 flex-col items-center justify-end gap-1 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-text-secondary'}`}
                >
                    <div className="bg-primary text-white rounded-full size-12 flex items-center justify-center -mb-4 shadow-lg shadow-primary/30 transform active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-[28px] fill-1">add</span>
                    </div>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => `flex flex-1 flex-col items-center justify-end gap-1 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-text-secondary'}`}
                >
                    <span className="material-symbols-outlined text-[26px]">settings</span>
                    <p className="text-[10px] font-medium uppercase tracking-wide">Settings</p>
                </NavLink>
            </div>
        </nav>
    );
};

export default Navigation;
