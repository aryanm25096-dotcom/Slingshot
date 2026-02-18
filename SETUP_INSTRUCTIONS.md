# Gemini Slingshot - Setup Instructions

## Issues Fixed ✅

### 1. **Import Error** - FIXED
   - Removed invalid `Type` import from `@google/genai`
   - File: `services/geminiService.ts`

### 2. **Environment Variable Configuration** - FIXED
   - Changed from `GEMINI_API_KEY` to `VITE_GEMINI_API_KEY` (Vite prefix required)
   - Updated `vite.config.ts` to properly load the env variable
   - Updated `.env.local` with correct variable name

### 3. **API Initialization** - FIXED
   - Updated error message to guide users to add the key to `.env.local`

---

## 🚀 To Get It Working:

### Step 1: Get Your Free Gemini API Key
1. Go to: **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Add API Key to `.env.local`
Replace `PLACEHOLDER_API_KEY` with your actual key:

```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3: Start the Development Server
```bash
npm install
npm run dev
```

The app should now:
- ✅ Load without errors
- ✅ Access your webcam for hand tracking
- ✅ Analyze the game board with Gemini AI
- ✅ Provide strategic recommendations

---

## 🎮 How to Play

1. **Allow webcam access** when prompted
2. **Pinch and pull** your fingers to aim the slingshot
3. **Release** to shoot the colored bubble
4. **Match 3+ bubbles** of the same color to score
5. Watch the **AI Strategy Panel** on the right for recommendations

---

## ⚙️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Hand Tracking**: MediaPipe
- **AI**: Google Gemini 3 Flash
- **Styling**: Tailwind CSS

---

## 📝 File Changes Made

- `services/geminiService.ts` - Fixed import and env variable reference
- `vite.config.ts` - Fixed env variable prefix from `GEMINI_API_KEY` to `VITE_GEMINI_API_KEY`
- `.env.local` - Updated variable name to follow Vite conventions

---

## 🐛 Troubleshooting

**"API Key is missing"**
- Make sure `.env.local` has `VITE_GEMINI_API_KEY=your_key`
- Restart the dev server after updating `.env.local`

**"Cannot find module '@google/genai'"**
- Run `npm install` to ensure dependencies are installed

**Webcam not working**
- Check browser permissions for camera access
- Desktop view required (not mobile)

