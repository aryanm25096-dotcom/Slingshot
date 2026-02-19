/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2 } from 'lucide-react';

const LoginScreen: React.FC = () => {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[#0a0a14] text-white">
            <div className="mb-8 flex flex-col items-center animate-fade-in-down">
                <div className="bg-gradient-to-br from-[#00FFFF] to-[#CCFF00] p-4 rounded-full mb-6 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                    <Gamepad2 className="w-16 h-16 text-black" />
                </div>
                <h1 className="text-5xl font-bold mb-2 tracking-tight bg-gradient-to-r from-[#00FFFF] via-[#CCFF00] to-[#00FFFF] bg-clip-text text-transparent">
                    CamBlaster
                </h1>
                <p className="text-gray-400 text-lg">AI-Powered Hand Gesture Game</p>
            </div>

            <button
                onClick={signInWithGoogle}
                className="group relative flex items-center justify-center gap-3 bg-white text-gray-800 px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google G"
                    className="w-6 h-6"
                />
                <span>Sign in with Google</span>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-lg ring-2 ring-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>

            <div className="mt-12 text-gray-600 text-sm">
                Powered by Google Gemini & Aryan-algorithms | {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default LoginScreen;
