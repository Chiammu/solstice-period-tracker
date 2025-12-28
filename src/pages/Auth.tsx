import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                // Sign Up with Magic Link logic or Password logic.
                // For simplicity, using Magic Link via email for both or just OTP.
                // Let's use Magic Link for now as it doesn't require password management UI.
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: window.location.origin
                    }
                });
                if (error) throw error;
                setMessage('Check your email for the login link!');
            } else {
                // Sign In
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: window.location.origin
                    }
                });
                if (error) throw error;
                setMessage('Check your email for the login link!');
            }
        } catch (error: any) {
            setMessage(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white items-center justify-center p-4">
            <div className="w-full max-w-sm flex flex-col items-center">
                <div className="size-20 bg-gradient-to-tr from-primary to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
                    <span className="material-symbols-outlined text-4xl text-white">water_drop</span>
                </div>

                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-slate-500 dark:text-gray-400 mb-8 text-center">
                    Sign in to sync your data across devices and keep your history safe.
                </p>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 pl-1">Email address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl bg-white dark:bg-surface-dark border-transparent focus:border-primary focus:ring-primary px-4 py-3 placeholder-slate-400"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 transition-all"
                    >
                        {loading ? 'Sending link...' : 'Send Magic Link'}
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-sm text-center">
                        {message}
                    </div>
                )}

                {/* Skip for testing if needed */}
                {/* <button onClick={() => navigate('/')} className="mt-8 text-xs text-slate-400 hover:text-primary">
            Skip setup (Data will be lost on refresh)
        </button> */}
            </div>
        </div>
    );
};

export default Auth;
