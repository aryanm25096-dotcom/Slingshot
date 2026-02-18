<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎮 Gemini Slingshot - AI-Powered Bubble Shooter Game

> **An innovative bubble shooter game where AI strategy guides your gameplay using real-time hand gesture recognition and Google Gemini AI analysis.**

## 🌟 What Is Gemini Slingshot?

Gemini Slingshot is a next-generation bubble shooter game that combines:

- **🎯 Hand Gesture Recognition** - Use your hands to aim and shoot via your webcam
- **🤖 AI Strategy Engine** - Google Gemini 3 Flash analyzes the board and recommends optimal moves
- **🎨 Interactive Bubble Matching** - Classic bubble shooter mechanics with a modern twist
- **📊 Real-time Analytics** - Debug panel shows AI analysis, latency, and game state

This is not just a game—it's an **AI-assisted gaming experience** where machine vision and generative AI work together to enhance gameplay.

---

## 🎮 How to Play

### Controls
1. **Show Your Hand** - The webcam tracks your hand gestures
2. **Pinch Your Fingers** - Bring your index finger and thumb together to grab the slingshot
3. **Pull Back** - Drag your hand backward to aim and increase power
4. **Release** - Open your fingers to shoot the bubble

### Objective
- **Match 3+ bubbles** of the same color to pop them and score points
- **Avoid bubbles reaching the bottom** - Game ends if bubbles overflow
- **Follow AI Recommendations** - Use the strategy hints from Gemini to maximize your score

### Scoring
| Color | Points |
|-------|--------|
| 🔴 Red | 100 |
| 🔵 Blue | 150 |
| 🟢 Green | 200 |
| 🟡 Yellow | 250 |
| 🟣 Purple | 300 |
| 🟠 Orange | 500 |

**Combo Multiplier**: Matching 4+ bubbles grants a 1.5x score multiplier!

---

## 🤖 AI Strategy Engine

### What Gemini Does
After each shot, the AI analyzes the board state and:

1. **Identifies all reachable clusters** of colored bubbles
2. **Calculates potential scores** for each target
3. **Evaluates strategic value** - prioritizes high-value colors and avalanche opportunities
4. **Recommends next move** - tells you which color to equip and where to shoot

### Strategic Priorities
- ⭐ **High Score**: Targets Orange and Purple clusters (500 & 300 pts)
- 📉 **Avalanche Effect**: Suggests shots high on the board to cascade bubbles
- 🚨 **Survival Mode**: Clears low bubbles first when danger is critical

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool

### AI & Computer Vision
- **Google Gemini 3 Flash** - Generative AI for strategy analysis
- **MediaPipe Hands** - Real-time hand gesture recognition
- **TensorFlow.js** - Underlying ML infrastructure

### Game Engine
- **Canvas API** - 2D graphics rendering
- **Physics Simulation** - Collision detection, gravity, friction
- **State Management** - React hooks for game state

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam
- Google Gemini API key (free tier available)

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd gemini-slingshot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get your Gemini API key:**
   - Visit: [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a free API key (no credit card required)
   - Copy the key

4. **Configure the API key:**
   - Open `.env.local`
   - Replace `PLACEHOLDER_API_KEY` with your actual key:
   ```bash
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   - Navigate to: `http://localhost:3000`
   - Allow webcam access when prompted
   - Start playing! 🎮

### Build for Production
```bash
npm run build
```

The optimized build will be in the `dist/` folder.

---

## 📁 Project Structure

```
gemini-slingshot/
├── components/
│   └── GeminiSlingshot.tsx      # Main game component (1000+ lines)
├── services/
│   └── geminiService.ts         # Gemini AI integration
├── types.ts                      # TypeScript interfaces
├── App.tsx                       # Root component
├── index.tsx                     # React entry point
├── index.html                    # HTML template
├── index.css                     # Global styles
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── .env.local                   # Environment variables
└── README.md                    # This file
```

---

## 🎯 Key Features

### 🖐️ Hand Tracking
- Real-time detection of hand position and pinch distance
- Mirror effect for natural gameplay
- Hand landmarks visualization (debug mode)
- Smooth gesture response

### 🤖 AI Integration
- Screenshot capture and compression for fast processing
- Vision-language model analysis of game board
- Strategic recommendations with confidence scoring
- JSON-based response parsing with fallback logic

### 🎨 Visual Design
- Material Design color palette
- Dark theme (Material Dark Background #121212)
- Glossy bubble rendering with 3D effects
- Animated UI elements and transitions
- Responsive canvas sizing

### 🎮 Gameplay Mechanics
- **Slingshot Physics**: Realistic angle and power controls
- **Collision Detection**: Accurate bubble-to-bubble interaction
- **Gravity & Friction**: Physics-based ball movement
- **Match Detection**: BFS algorithm to find connected clusters
- **Particle Effects**: Explosion animation on bubble pop

### 📊 Debug Panel
- Real-time AI latency tracking
- Vision input preview (compressed screenshot)
- Prompt context display
- Raw AI response inspection
- JSON parsing verification
- Error logging and diagnosis

---

## ⚙️ Configuration

### Environment Variables
```bash
# .env.local
VITE_GEMINI_API_KEY=your_api_key_here
```

### Game Constants
Edit `components/GeminiSlingshot.tsx` to customize:
```typescript
const BUBBLE_RADIUS = 22;           // Bubble size
const GRID_COLS = 12;               // Grid columns
const GRID_ROWS = 8;                // Grid rows
const MAX_DRAG_DIST = 180;          // Max slingshot pull
const MIN_FORCE_MULT = 0.15;        // Minimum power
const MAX_FORCE_MULT = 0.45;        // Maximum power
```

---

## 🐛 Troubleshooting

### "API Key is missing"
- ✅ Ensure `.env.local` contains `VITE_GEMINI_API_KEY`
- ✅ Restart the dev server after updating `.env.local`
- ✅ Check for typos in the API key

### "Webcam not working"
- ✅ Allow camera permissions in browser
- ✅ Check browser privacy settings
- ✅ Ensure good lighting for hand detection
- ✅ Use a desktop browser (mobile has limited hand tracking support)

### "Cannot find module '@google/genai'"
- ✅ Run `npm install` to ensure all dependencies are installed
- ✅ Delete `node_modules` and `package-lock.json`, then reinstall

### "AI returns error or invalid response"
- ✅ Check the Debug Panel on the right sidebar
- ✅ Verify API key is valid and has quota
- ✅ Check browser console for network errors (F12)

### "Hand tracking is jittery"
- ✅ Improve lighting in your environment
- ✅ Reduce camera distance
- ✅ Adjust `minDetectionConfidence` in the MediaPipe config

---

## 📈 Performance Optimization

- **Image Compression**: Screenshots downscaled to 480px width and JPEG compressed at 0.6 quality
- **Efficient Collision Detection**: Multi-step ray casting for path validation
- **Canvas Optimization**: `willReadFrequently` context attribute
- **AI Locking**: Game interaction disabled while AI is processing
- **Flight Timeout**: 5-second safety cutoff for infinite bounces

---

## 🔐 Security & Privacy

- ✅ API key stored locally (not uploaded to servers)
- ✅ Screenshots sent only to Google Gemini API
- ✅ No data storage or analytics
- ✅ Open source and transparent

---

## 📚 API Reference

### `getStrategicHint(imageBase64, validTargets, dangerRow)`
Analyzes game state and returns AI recommendation.

**Parameters:**
- `imageBase64`: Screenshot in base64 format
- `validTargets`: Array of reachable bubble clusters
- `dangerRow`: Highest row with active bubbles

**Returns:**
```typescript
{
  hint: {
    message: string,          // Operational directive
    rationale: string,        // Strategic explanation
    targetRow: number,        // Target row index
    targetCol: number,        // Target column index
    recommendedColor: string  // Color to equip
  },
  debug: {
    latency: number,          // AI response time (ms)
    screenshotBase64: string, // Input image
    promptContext: string,    // Candidates sent to AI
    rawResponse: string,      // Raw AI output
    error?: string            // Error message if any
  }
}
```

---

## 🤝 Contributing

Want to improve Gemini Slingshot? Ideas for enhancement:

- 🎨 New bubble themes and visual effects
- 🎵 Sound effects and background music
- 🏆 Leaderboard system
- 🎯 Different difficulty levels
- 🎮 Multiplayer mode
- 📱 Mobile optimization
- 🌍 Internationalization

---

## 📄 License

This project is provided as-is under the Apache 2.0 License.

---

## 🙏 Credits

- **Google Gemini API** - Generative AI backbone
- **MediaPipe** - Hand gesture recognition
- **React** - UI framework
- **Vite** - Build tool

---

## 🎬 Getting Help

- 📖 Check the [troubleshooting section](#-troubleshooting)
- 🔍 Review the [debug panel](#-debug-panel) for AI insights
- 💬 Inspect browser console (F12) for detailed errors
- 🌐 Visit [Google AI Studio Docs](https://ai.google.dev/)

---

## 🚀 What's Next?

- Deploy to production with Vercel or Netlify
- Experiment with different Gemini models
- Customize game parameters and difficulty
- Add more advanced AI strategies
- Create themed variations of the game

**Happy gaming! 🎮✨**

