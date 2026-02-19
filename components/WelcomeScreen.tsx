/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrainCircuit, ChevronRight, Play } from 'lucide-react';

import { Difficulty } from '../types';

interface WelcomeScreenProps {
    onComplete: (difficulty: Difficulty) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('normal');
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState("Initializing system...");
    const [showSkip, setShowSkip] = useState(false);

    // Phase 1: Logo Reveal (0s - 1.5s)
    // Phase 2: Subtitle (1.5s - 2.5s)
    // Phase 3: Loading (2.5s - 5.5s)
    // Phase 4: Transition (5.5s+)

    useEffect(() => {
        // Phase Transitions
        const t1 = setTimeout(() => setPhase(2), 1500);
        const t2 = setTimeout(() => setPhase(3), 2500);
        const t3 = setTimeout(() => {
            // Wait for user interaction 
            // setPhase(4); 
            // setTimeout(onComplete, 1000); 
        }, 5500);

        const tSkip = setTimeout(() => setShowSkip(true), 2000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(tSkip);
        };
    }, [onComplete]);

    // Loading Simulation
    useEffect(() => {
        if (phase === 3) {
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += Math.random() * 5;
                if (currentProgress > 100) currentProgress = 100;

                setProgress(currentProgress);

                if (currentProgress < 30) setLog("Initializing MediaPipe Hands...");
                else if (currentProgress < 60) setLog("Connecting to Gemini API...");
                else if (currentProgress < 80) setLog("Loading Game Assets...");
                else if (currentProgress < 100) setLog("Finalizing...");
                else setLog("Ready.");

                if (currentProgress >= 100) clearInterval(interval);
            }, 100);

            return () => clearInterval(interval);
        }
    }, [phase]);

    const handleSkip = () => {
        setPhase(4);
        setTimeout(() => onComplete(difficulty), 500);
    };

    const handleStart = () => {
        setPhase(4);
        setTimeout(() => onComplete(difficulty), 1000);
    };

    const renderLogo = () => {
        const text = "CAMBLASTER";
        return (
            <div className="flex overflow-hidden">
                {text.split('').map((char, index) => (
                    <span
                        key={index}
                        className={`font-oxanium font-bold text-4xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#00FFFF] to-[#CCFF00]
              ${phase >= 1 ? 'animate-fade-in-up' : 'opacity-0'}
            `}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className={`fixed inset-0 z-[60] bg-[#0a0a14] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${phase === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Noise Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay"></div>

                {/* Radial Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-pulse-glow" />

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bubble-particle bg-gradient-to-tr from-[#00FFFF]/20 to-[#CCFF00]/20 backdrop-blur-sm border border-[#00FFFF]/10"
                        style={{
                            width: `${Math.random() * 60 + 20}px`,
                            height: `${Math.random() * 60 + 20}px`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${10 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">

                {/* Phase 1: Logo */}
                <div className="mb-6">
                    {renderLogo()}
                </div>

                {/* Phase 2: Subtitle */}
                <div className={`flex items-center gap-3 text-blue-300 font-mono text-sm md:text-lg tracking-widest uppercase transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    <span>Powered by Gemini 1.5 Flash</span>
                </div>

                {/* Phase 3: Loading Bar */}
                <div className={`mt-16 w-64 md:w-96 transition-all duration-700 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-[#00FFFF] via-[#CCFF00] to-[#00FFFF] transition-all duration-100 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="font-mono text-xs text-gray-500 h-4 text-left animate-pulse">
                        {'>'} {log}
                    </p>
                </div>

            </div>

            {/* Difficulty & Start (Phase 3+) */}
            <div className={`absolute bottom-20 z-20 flex flex-col items-center gap-6 transition-all duration-700 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Difficulty Selector */}
                <div className="flex gap-4 mb-4">
                    {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`px-6 py-2 rounded-full font-oxanium font-bold uppercase tracking-wider transition-all duration-300 border
                                ${difficulty === d
                                    ? 'bg-[#00FFFF] text-black border-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.6)] scale-110'
                                    : 'bg-transparent text-gray-500 border-gray-700 hover:border-[#CCFF00] hover:text-[#CCFF00]'}
                            `}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                {/* Start Button usually appears after loading, but we can enable it when ready */}
                <button
                    onClick={handleStart}
                    disabled={progress < 100}
                    className={`
                        group relative px-12 py-4 bg-transparent overflow-hidden rounded-xl
                        ${progress < 100 ? 'opacity-50 cursor-wait' : 'opacity-100 cursor-pointer hover:scale-105'}
                        transition-all duration-300
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] to-[#CCFF00] opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 border border-[#00FFFF] rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all" />

                    <span className="relative flex items-center gap-3 font-oxanium font-bold text-2xl text-white tracking-widest uppercase">
                        <Play className="w-6 h-6 fill-current" />
                        Enter Simulation
                    </span>
                </button>
            </div>

            {/* Skip Button */}
            {/* {showSkip && (
                <button
                    onClick={handleStart}
                    className="absolute bottom-8 right-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest z-20 group"
                >
                    Skip Intro
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            )} */}

        </div>
    );
};

export default WelcomeScreen;
