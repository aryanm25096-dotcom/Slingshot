import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw, Home, Share2, Loader2, Star } from 'lucide-react';
import { Difficulty } from '../types';
import { getLeaderboard, saveScore, LeaderboardEntry } from '../services/leaderboard';
import { useAuth } from '../contexts/AuthContext';
import { playSound } from '../utils/audio';

interface GameOverScreenProps {
    score: number;
    bestScore: number;
    difficulty: Difficulty;
    onRestart: () => void;
    onMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, bestScore, difficulty, onRestart, onMenu }) => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNewBest, setIsNewBest] = useState(false);

    useEffect(() => {
        setIsNewBest(score >= bestScore && score > 0);

        const fetchLeaderboard = async () => {
            if (user && score > 0) {
                // Save automatically
                await saveScore({
                    userId: user.uid,
                    userName: user.displayName || 'Anonymous',
                    photoURL: user.photoURL || undefined,
                    score,
                    difficulty,
                });
            }
            const data = await getLeaderboard(difficulty);
            setLeaderboard(data);
            setLoading(false);
        };

        fetchLeaderboard();
        playSound('gameover');
    }, [score, bestScore, difficulty, user]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'CamBlaster',
                text: `I scored ${score} on CamBlaster (${difficulty.toUpperCase()})! Can you beat me?`,
                url: window.location.href
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[#00FFFF]/10 to-transparent pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-4xl font-oxanium font-bold text-white mb-2">GAME OVER</h2>
                    <div className="flex justify-center items-baseline gap-2">
                        <span className="text-6xl font-oxanium font-bold text-[#00FFFF] drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                            {score.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Points</span>
                    </div>

                    {isNewBest && (
                        <div className="inline-flex items-center gap-2 bg-[#CCFF00]/20 text-[#CCFF00] px-4 py-1 rounded-full border border-[#CCFF00] mt-4 animate-bounce">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">New Record!</span>
                        </div>
                    )}
                </div>

                {/* Leaderboard Section */}
                <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5 max-h-48 overflow-y-auto">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Trophy className="w-3 h-3" /> Leaderboard ({difficulty})
                    </h3>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 text-[#00FFFF] animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.map((entry, index) => (
                                <div key={entry.id || index} className={`flex items-center justify-between text-sm p-2 rounded ${entry.userId === user?.uid && entry.score === score ? 'bg-[#00FFFF]/10 border border-[#00FFFF]/30' : 'hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono font-bold w-4 ${index < 3 ? 'text-[#CCFF00]' : 'text-gray-500'}`}>#{index + 1}</span>
                                        <div className="flex items-center gap-2">
                                            {entry.photoURL ? (
                                                <img src={entry.photoURL} className="w-5 h-5 rounded-full" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-gray-700" />
                                            )}
                                            <span className="text-gray-300 truncate max-w-[100px]">{entry.userName}</span>
                                        </div>
                                    </div>
                                    <span className="font-mono font-bold text-[#00FFFF]">{entry.score}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onRestart} className="col-span-2 bg-[#00FFFF] hover:bg-[#00E5E5] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                        <RefreshCw className="w-5 h-5" />
                        PLAY AGAIN
                    </button>
                    <button onClick={onMenu} className="bg-[#252525] hover:bg-[#333] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-colors">
                        <Home className="w-4 h-4" />
                        MENU
                    </button>
                    <button onClick={handleShare} className="bg-[#252525] hover:bg-[#333] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-colors">
                        <Share2 className="w-4 h-4" />
                        SHARE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverScreen;
