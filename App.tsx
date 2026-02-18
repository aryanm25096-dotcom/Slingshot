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

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#0a0a14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="w-full h-full">
      <GeminiSlingshot />
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
