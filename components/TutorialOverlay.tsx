import React, { useState } from 'react';

interface TutorialOverlayProps {
    onComplete: () => void;
}

const steps = [
    {
        emoji: '🖐️',
        title: 'Show your hand to the camera',
        description: 'The game tracks your hand using your webcam. Hold your hand up so the camera can see it.',
        animation: 'animate-bounce',
    },
    {
        emoji: '🎯',
        title: 'Pinch & pull to aim',
        description: 'Pinch your thumb and index finger together, then pull back like a slingshot to aim at bubble clusters.',
        animation: 'animate-pulse',
    },
    {
        emoji: '🚀',
        title: 'Release to shoot!',
        description: 'Let go of the pinch to launch the bubble. Match 3+ of the same color to pop them and score points!',
        animation: 'animate-bounce',
    },
];

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [exiting, setExiting] = useState(false);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // Final step — mark as seen & close
            localStorage.setItem('hasSeenTutorial', 'true');
            setExiting(true);
            setTimeout(onComplete, 400);
        }
    };

    const current = steps[step];

    return (
        <div
            className={`fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center p-6 transition-opacity duration-400 ${exiting ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="max-w-md w-full text-center">
                {/* Step Indicator */}
                <div className="flex justify-center gap-2 mb-8">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#00FFFF]' : i < step ? 'w-4 bg-[#00FFFF]/50' : 'w-4 bg-white/20'
                                }`}
                        />
                    ))}
                </div>

                {/* Animated Emoji */}
                <div className={`text-8xl mb-6 ${current.animation}`} style={{ animationDuration: '1.5s' }}>
                    {current.emoji}
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-oxanium font-bold text-white mb-3">
                    {current.title}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-sm mx-auto">
                    {current.description}
                </p>

                {/* Action Button */}
                <button
                    onClick={handleNext}
                    className="px-10 py-4 bg-[#00FFFF] hover:bg-[#00E5E5] text-black font-bold text-lg rounded-xl transition-all hover:scale-105 shadow-[0_0_25px_rgba(0,255,255,0.3)]"
                >
                    {step < steps.length - 1 ? 'Next →' : "Let's Play! 🎯"}
                </button>

                {/* Skip */}
                {step < steps.length - 1 && (
                    <button
                        onClick={() => {
                            localStorage.setItem('hasSeenTutorial', 'true');
                            setExiting(true);
                            setTimeout(onComplete, 400);
                        }}
                        className="block mx-auto mt-4 text-gray-600 hover:text-gray-400 text-xs uppercase tracking-widest transition-colors"
                    >
                        Skip Tutorial
                    </button>
                )}
            </div>
        </div>
    );
};

export default TutorialOverlay;
