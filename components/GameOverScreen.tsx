import React, { useEffect, useState, useRef } from 'react';
import { Trophy, RefreshCw, Home, Share2, Loader2, Check, Twitter } from 'lucide-react';
import { Difficulty, UserProfile } from '../types';
import { getLeaderboard, incrementGamesPlayed } from '../services/userService';
import { playFanfare, playPop } from '../services/soundService';

interface GameOverScreenProps {
    score: number;
    bestScore: number;
    difficulty: Difficulty;
    uid: string;
    onRestart: () => void;
    onMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, bestScore, difficulty, uid, onRestart, onMenu }) => {
    const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNewBest, setIsNewBest] = useState(false);
    const [displayScore, setDisplayScore] = useState(0);
    const [rank, setRank] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const countedRef = useRef(false);

    // Score countup animation
    useEffect(() => {
        if (score === 0) { setDisplayScore(0); return; }
        const duration = 1500;
        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.floor(score * eased));
            if (progress < 1) requestAnimationFrame(animate);
            else { setDisplayScore(score); playPop(); }
        };
        requestAnimationFrame(animate);
    }, [score]);

    // Load leaderboard + increment games played
    useEffect(() => {
        setIsNewBest(score >= bestScore && score > 0);
        if (score >= bestScore && score > 0) playFanfare();

        const init = async () => {
            // Increment games played once
            if (!countedRef.current) {
                countedRef.current = true;
                await incrementGamesPlayed(uid);
            }

            const data = await getLeaderboard(10);
            setLeaderboard(data);

            // Compute rank
            const myRank = data.findIndex(e => e.uid === uid);
            setRank(myRank >= 0 ? myRank + 1 : null);

            setLoading(false);
        };

        init();
    }, [score, bestScore, difficulty, uid]);

    const shareText = `🎮 I scored ${score.toLocaleString()} on CamBlaster (${difficulty.toUpperCase()})! Can you beat me? 🚀`;
    const shareUrl = window.location.href;

    const handleTwitterShare = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const el = document.createElement('textarea');
            el.value = `${shareText}\n${shareUrl}`;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-fade-in-up">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[#00FFFF]/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-4xl font-oxanium font-bold text-white mb-2">GAME OVER</h2>
                    <div className="flex justify-center items-baseline gap-2">
                        <span className="text-6xl font-oxanium font-bold text-[#00FFFF] drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] tabular-nums">
                            {displayScore.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Points</span>
                    </div>

                    {isNewBest && (
                        <div className="inline-flex items-center gap-2 bg-[#CCFF00]/20 text-[#CCFF00] px-4 py-1 rounded-full border border-[#CCFF00] mt-4 animate-bounce">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">New Record!</span>
                        </div>
                    )}

                    {rank && (
                        <p className="text-gray-400 text-sm mt-3">
                            You ranked <span className="text-[#CCFF00] font-bold">#{rank}</span> globally
                        </p>
                    )}
                </div>

                {/* Leaderboard */}
                <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5 max-h-48 overflow-y-auto">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Trophy className="w-3 h-3" /> Top Players
                    </h3>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 text-[#00FFFF] animate-spin" />
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <p className="text-center text-gray-600 text-sm py-3">No scores yet. Be the first!</p>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.map((entry, index) => (
                                <div key={entry.uid || index} className={`flex items-center justify-between text-sm p-2 rounded transition-colors ${entry.uid === uid ? 'bg-[#00FFFF]/10 border border-[#00FFFF]/30' : 'hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono font-bold w-4 ${index < 3 ? 'text-[#CCFF00]' : 'text-gray-500'}`}>#{index + 1}</span>
                                        <div className="flex items-center gap-2">
                                            {entry.photoURL ? (
                                                <img src={entry.photoURL} className="w-5 h-5 rounded-full" alt="" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-gray-700" />
                                            )}
                                            <span className="text-gray-300 truncate max-w-[100px]">{entry.displayName}</span>
                                        </div>
                                    </div>
                                    <span className="font-mono font-bold text-[#00FFFF]">{entry.bestScore?.toLocaleString()}</span>
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
                    <div className="flex gap-2">
                        <button onClick={handleTwitterShare} className="flex-1 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 text-[#1DA1F2] font-bold py-3 rounded-xl flex items-center justify-center gap-1 border border-[#1DA1F2]/30 transition-colors text-sm">
                            <Twitter className="w-4 h-4" />
                            Tweet
                        </button>
                        <button onClick={handleCopyLink} className="flex-1 bg-[#252525] hover:bg-[#333] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 border border-white/10 transition-colors text-sm">
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameOverScreen;
