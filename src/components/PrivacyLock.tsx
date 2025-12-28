import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

interface PrivacyLockProps {
    onUnlock: () => void;
}

const PrivacyLock: React.FC<PrivacyLockProps> = ({ onUnlock }) => {
    const { state } = useAppContext();
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const correctPin = state.pin || '1234'; // Use user's PIN or fallback

    const handleKeyPress = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                if (newPin === correctPin) {
                    setTimeout(onUnlock, 300);
                } else {
                    setError(true);
                    setTimeout(() => {
                        setPin('');
                        setError(false);
                    }, 800);
                }
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center p-6 text-white"
        >
            <div className="mb-12 text-center">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                    <span className="material-symbols-outlined text-4xl text-primary">lock</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Secure Access</h2>
                <p className="text-text-secondary text-sm">Enter your PIN to unlock</p>
            </div>

            <div className="flex gap-4 mb-12">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`size-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-primary border-primary scale-110' : 'border-white/20'
                            } ${error ? 'bg-red-500 border-red-500 animate-bounce' : ''}`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-[280px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((key, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (key === 'delete') setPin(pin.slice(0, -1));
                            else if (key !== '') handleKeyPress(key);
                        }}
                        disabled={key === ''}
                        className={`size-16 rounded-full flex items-center justify-center text-2xl font-medium transition-all active:bg-primary/20 hover:bg-white/5 ${key === '' ? 'opacity-0 cursor-default' : ''
                            }`}
                    >
                        {key === 'delete' ? (
                            <span className="material-symbols-outlined">backspace</span>
                        ) : key}
                    </button>
                ))}
            </div>

            <button
                onClick={() => alert("Please sign in again if you forgot your PIN.")}
                className="mt-12 text-primary text-sm font-semibold hover:underline"
            >
                Forgot PIN?
            </button>
        </motion.div>
    );
};

export default PrivacyLock;
