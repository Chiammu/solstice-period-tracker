import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const slides = [
    {
        title: "Track your cycle",
        highlight: "with precision",
        description: "Predict your next period and ovulation with AI-powered insights designed for you.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD46Ccsrd3QP1hkABh97552MuqcHxDSaUytVPxLmyP_M0S_qv-ftnABVGe7gK66IrNjlHsTPAybUM8gGmkST2qBSq7cVvldjBCFkrO329wzh9m1mbl4CwtqF4_rDpSpf-FktcjNCsqbyO_8-SFaBYvq2Xm6hMrIEmxkOC2rRcg5REEQ789XfcvAjVKJAPpEUwksrfocb6H_ozNvpAcROYnQNz14Two6KBBGnTtMo5EfQEQst4fmgHUqderr_ovz449iUdGa7Nn9z5l"
    },
    {
        title: "Understand your",
        highlight: "unique patterns",
        description: "Log symptoms, mood, and activity to get personalized health recommendations.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuKJpCTymAHJ5ZcVIowxPjYQL9OCu4OCQO4x6JV-mtU2yVCfP2WbLJ3CVAzD5jpFaYeEt68LElnhyEwzstiVXGF5Mo7AYR4GyRa-2oqy-OPwfLfRlJrd_f40IQcYMdrfuC6WszzGH3Pe-M1bcs9MOmJQq61IAfhqGbbHCEQQNoOj5bT9JfBo2YMMTPLTs6ITYh1si8IC80i0Po0wK4_DJw1B46lmezgdEOfbFQSkCEiEjWK9oHApSb7c5InaF76_LWQC_I_WGuCoIs"
    },
    {
        title: "Your data is",
        highlight: "private & secure",
        description: "Your health data stays on your device, fully encrypted and safe from prying eyes.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8IA5yc2vGBGI4STOCCIICx2aE1-ulydWnYVu9jtyEKRbVDoZPLkJ9218CjSVYDGUOY5j-jVH0-FrQhgNFoazQaJWHpgcJYMZJJf8CFFGnnSjPPQO9mOK6EckIZOeKDhp65ZvLm4BB8bhi6GqkW2f2IP-83F1QoCBChdeVmGttF-l7CGMzINpD1k40ufX5d05gqaFKhvBrctXFgEc_sk3YLXtW26aJXz1EStyFxWr259d4RINnvU2HHEzH1RQWl5NLzmOHPA1gfXZh"
    }
];

const Onboarding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { updateState } = useAppContext();

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            updateState({ isOnboarded: true });
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

            {/* Main Content Area: Carousel */}
            <div className="flex-1 flex flex-col justify-center relative z-10 w-full pt-12">
                <div className="relative w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="w-full px-6 flex flex-col items-center justify-center gap-8"
                        >
                            <div
                                className="w-full aspect-[4/5] max-h-[400px] rounded-xl bg-center bg-cover shadow-2xl shadow-primary/5 relative overflow-hidden"
                                style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
                            </div>

                            <div className="text-center max-w-xs space-y-3">
                                <h2 className="text-3xl font-bold leading-tight tracking-tight">
                                    {slides[currentSlide].title} <br />
                                    <span className="text-primary">{slides[currentSlide].highlight}</span>
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
                                    {slides[currentSlide].description}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Static Pagination Dots */}
                <div className="flex justify-center gap-2 py-8">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="w-full px-6 pb-12 pt-4 bg-background-light dark:bg-background-dark z-20 space-y-3">
                <button
                    onClick={handleNext}
                    className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-primary/90 transition-colors text-white text-lg font-bold shadow-lg shadow-primary/25"
                >
                    {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                </button>

                <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-white dark:bg-[#392833] border border-gray-200 dark:border-transparent hover:bg-gray-50 dark:hover:bg-[#4a3543] transition-colors text-gray-900 dark:text-white text-base font-bold gap-3">
                    <span className="material-symbols-outlined text-2xl">smartphone</span>
                    <span className="truncate">Sign in with Apple</span>
                </button>

                <div className="pt-2 text-center">
                    <p className="text-gray-500 dark:text-[#b99db0] text-sm font-medium">
                        I already have an account.
                        <button className="ml-1 text-primary dark:text-white underline decoration-1 underline-offset-4 hover:text-primary/80 transition-colors">Log in</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
