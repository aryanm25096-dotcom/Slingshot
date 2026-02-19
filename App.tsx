/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import GeminiSlingshot from './components/GeminiSlingshot';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

import { Difficulty } from './types';

import GameOverScreen from './components/GameOverScreen';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'gameover'>('welcome');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [bestScore, setBestScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);

  // Load Best Score
  React.useEffect(() => {
    const saved = localStorage.getItem('camblaster_best_score');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('camblaster_best_score', score.toString());
    }
  };

  const handleGameOver = (finalScore: number) => {
    setCurrentScore(finalScore);
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem('camblaster_best_score', finalScore.toString());
    }
    setGameState('gameover');
  };

  if (loading) {
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
    return <WelcomeScreen onComplete={(diff) => {
      setDifficulty(diff);
      setGameState('playing');
      setCurrentScore(0);
    }} />;
  }

  if (gameState === 'gameover') {
    return <GameOverScreen
      score={currentScore}
      bestScore={bestScore}
      difficulty={difficulty}
      onRestart={() => {
        setGameState('playing');
        setCurrentScore(0);
      }}
      onMenu={() => setGameState('welcome')}
    />;
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
