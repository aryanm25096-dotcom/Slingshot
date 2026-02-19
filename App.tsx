/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import GeminiSlingshot from './components/GeminiSlingshot';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import TutorialOverlay from './components/TutorialOverlay';
import GameOverScreen from './components/GameOverScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Difficulty, UserProfile } from './types';
import { upsertUserProfile, getUserProfile, updateBestScore } from './services/userService';
import { playFanfare } from './services/soundService';

type GameState = 'welcome' | 'tutorial' | 'playing' | 'gameover';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [bestScore, setBestScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // On login, upsert and load Firestore profile
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        // Race Firestore against a 3s timeout so the app never hangs
        const profilePromise = (async () => {
          await upsertUserProfile({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
          return getUserProfile(user.uid);
        })();

        const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
        const profile = await Promise.race([profilePromise, timeout]);

        if (profile) {
          setUserProfile(profile);
          setBestScore(profile.bestScore || 0);
        } else {
          // Firestore timed out or returned null — use localStorage
          const saved = localStorage.getItem('camblaster_best_score');
          if (saved) setBestScore(parseInt(saved));
        }
      } catch (e) {
        console.warn('Profile load failed, using localStorage fallback:', e);
        const saved = localStorage.getItem('camblaster_best_score');
        if (saved) setBestScore(parseInt(saved));
      }
      setProfileLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('camblaster_best_score', score.toString());
      // Async Firestore update
      if (user) updateBestScore(user.uid, score);
      playFanfare();
    }
  };

  const handleGameOver = (finalScore: number) => {
    setCurrentScore(finalScore);
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem('camblaster_best_score', finalScore.toString());
      if (user) updateBestScore(user.uid, finalScore);
    }
    setGameState('gameover');
  };

  const handleWelcomeComplete = (diff: Difficulty) => {
    setDifficulty(diff);
    setCurrentScore(0);
    // Check if tutorial has been seen
    const seen = localStorage.getItem('hasSeenTutorial');
    setGameState(seen ? 'playing' : 'tutorial');
  };

  // --- Renders ---

  if (loading || profileLoading) {
    return (
      <div className="w-full h-screen bg-[#0a0a14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (gameState === 'welcome') {
    return <WelcomeScreen userProfile={userProfile} onComplete={handleWelcomeComplete} />;
  }

  if (gameState === 'tutorial') {
    return <TutorialOverlay onComplete={() => setGameState('playing')} />;
  }

  if (gameState === 'gameover') {
    return (
      <GameOverScreen
        score={currentScore}
        bestScore={bestScore}
        difficulty={difficulty}
        uid={user.uid}
        onRestart={() => {
          setGameState('playing');
          setCurrentScore(0);
        }}
        onMenu={() => setGameState('welcome')}
      />
    );
  }

  return (
    <div className="w-full h-full">
      <GeminiSlingshot
        difficulty={difficulty}
        bestScore={bestScore}
        onScoreUpdate={handleScoreUpdate}
        onGameOver={handleGameOver}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
