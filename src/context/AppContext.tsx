import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AppState {
    isOnboarded: boolean;
    setupComplete: boolean;
    lastPeriodStart: string | null;
    cycleLength: number;
    periodLength: number;
    goal: string;
    logs: Record<string, LogEntry>;
    session: Session | null;
    loading: boolean;
    profileId: string | null;
    pin: string | null;
    full_name: string | null;
    notificationsEnabled: boolean;
}

export interface LogEntry {
    id?: string;
    flow: 'spotting' | 'light' | 'medium' | 'heavy' | null;
    symptoms: string[];
    moods: string[];
    notes: string;
}

interface AppContextType {
    state: AppState;
    updateState: (updates: Partial<AppState>) => Promise<void>;
    updateLog: (date: string, entry: LogEntry) => Promise<void>;
    signOut: () => Promise<void>;
}

const defaultState: AppState = {
    isOnboarded: false,
    setupComplete: false,
    lastPeriodStart: null,
    cycleLength: 28,
    periodLength: 5,
    goal: 'track',
    logs: {},
    session: null,
    loading: true,
    profileId: null,
    pin: null,
    full_name: null,
    notificationsEnabled: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(defaultState);

    // Sync with Supabase on mount
    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserData(session);
            } else {
                setState(prev => ({ ...prev, loading: false }));
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserData(session);
            } else {
                setState({ ...defaultState, loading: false });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserData = async (session: Session) => {
        try {
            // Fetch Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            // Fetch Logs
            const { data: logsData } = await supabase
                .from('logs')
                .select('*')
                .eq('user_id', session.user.id);

            const logsMap: Record<string, LogEntry> = {};
            if (logsData) {
                logsData.forEach(log => {
                    logsMap[log.date] = {
                        id: log.id,
                        flow: log.flow,
                        notes: log.notes,
                        symptoms: log.symptoms || [],
                        moods: log.moods || []
                    };
                });
            }

            setState(prev => ({
                ...prev,
                session,
                profileId: session.user.id,
                loading: false,
                isOnboarded: true, // Assuming if logged in, they are onboarded or will be redirected
                setupComplete: profile?.setup_complete || false,
                lastPeriodStart: profile?.last_period_start,
                cycleLength: profile?.cycle_length || 28,
                periodLength: profile?.period_length || 5,
                goal: profile?.goal || 'track',
                pin: profile?.pin || null,
                full_name: profile?.full_name || null,
                notificationsEnabled: profile?.notifications_enabled || false,
                logs: logsMap
            }));
        } catch (error) {
            console.error('Error fetching user data:', error);
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const updateState = async (updates: Partial<AppState>) => {
        setState(prev => ({ ...prev, ...updates }));

        if (state.session?.user) {
            const profileUpdates: any = {};
            if (updates.setupComplete !== undefined) profileUpdates.setup_complete = updates.setupComplete;
            if (updates.lastPeriodStart !== undefined) profileUpdates.last_period_start = updates.lastPeriodStart;
            if (updates.cycleLength !== undefined) profileUpdates.cycle_length = updates.cycleLength;
            if (updates.periodLength !== undefined) profileUpdates.period_length = updates.periodLength;
            if (updates.goal !== undefined) profileUpdates.goal = updates.goal;
            if (updates.pin !== undefined) profileUpdates.pin = updates.pin;
            if (updates.full_name !== undefined) profileUpdates.full_name = updates.full_name;
            if (updates.notificationsEnabled !== undefined) profileUpdates.notifications_enabled = updates.notificationsEnabled;

            if (Object.keys(profileUpdates).length > 0) {
                await supabase
                    .from('profiles')
                    .update(profileUpdates)
                    .eq('id', state.session.user.id);
            }
        }
    };

    const updateLog = async (date: string, entry: LogEntry) => {
        setState(prev => ({
            ...prev,
            logs: { ...prev.logs, [date]: entry }
        }));

        if (state.session?.user) {
            const { id, ...data } = entry;
            // Upsert log
            await supabase
                .from('logs')
                .upsert({
                    user_id: state.session.user.id,
                    date: date,
                    flow: data.flow,
                    notes: data.notes,
                    symptoms: data.symptoms,
                    moods: data.moods
                }, { onConflict: 'user_id,date' });
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AppContext.Provider value={{ state, updateState, updateLog, signOut }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
