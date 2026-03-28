# 🔁 RUE — Recursive Understanding Engine

> A web app that helps you achieve deep conceptual understanding through recursive concept exploration, powered by Google Gemini.

##  Features

-  **Structured AI Answers** — Overview, visual analogy, explanation, and key takeaway
-  **Clickable Concept Chips** — Every key term in the answer is highlighted and clickable
-  **Recursive Exploration** — Click a concept → get explanation → click new concepts → infinite depth
-  **Breadcrumb Navigation** — Track and navigate your exploration path
- **Text-to-Speech** — Read any answer or explanation aloud
-  **Voice Input** — Ask questions by microphone
-  **Dark/Light Mode** — Toggleable theme
-  **Language Selector** — UI-ready multilingual support
-  **Auth** — Google OAuth + Email/Password via Firebase
-  **Chat History** — Session-based exploration memory

---

##  Project Structure

```
aphelion-feynman/
├── rue-backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   ├── answer.js
│   │   │   ├── explain.js
│   │   │   └── concepts.js
│   │   └── services/
│   │       └── gemini.service.js
│   ├── .env
│   └── package.json
└── rue-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── chat/       ← SearchBar, AnswerPanel
    │   │   ├── concepts/   ← ConceptPanel, ConceptHighlighter, BreadcrumbTrail
    │   │   └── layout/     ← LeftSidebar, RightSidebar, TopBar
    │   ├── context/        ← AuthContext, ThemeContext, SessionContext
    │   ├── pages/          ← LoginPage, SignupPage, MainPage
    │   ├── firebase.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

##  Setup Instructions

### Step 1: Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy your key

### Step 2: Configure Backend
```bash
cd rue-backend
```
Edit `.env`:
```
GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE
PORT=3001
```
Install dependencies and start:
```bash
npm install
npm run dev
```
Backend runs at `http://localhost:3001`

### Step 3: Firebase Setup (for Google Auth)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project → **Add a Web App**
3. Copy the config values
4. Enable **Authentication → Google** sign-in provider
5. Add `localhost` to Authorized domains

### Step 4: Configure Frontend
```bash
cd rue-frontend
```
Create `.env` from `.env.example`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourproject
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
Install and start:
```bash
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### Step 5: Open the App
Navigate to **http://localhost:5173** → Sign in → Start exploring!

---

##  Example Flow

1. Ask: **"What is machine learning?"**
2. RUE returns a structured 4-section answer
3. Terms like **neural networks**, **training data**, **gradient descent** are highlighted
4. Click **"gradient descent"** → side panel opens with a beginner-friendly explanation
5. Click **"loss function"** from the panel → new explanation loads
6. Breadcrumb shows: `machine learning → gradient descent → loss function`
7. Click any breadcrumb to navigate back

---

## 🔌 API Reference

### `POST /api/answer`
```json
{ "question": "What is quantum computing?" }
```
Returns: `{ answer: { overview, imageDescription, explanation, summary }, concepts: [...] }`

### `POST /api/explain`
```json
{ "term": "superposition", "contextChain": ["quantum computing"] }
```
Returns: `{ explanation: { ... }, concepts: [...] }`

### `POST /api/concepts`
```json
{ "text": "any block of text here" }
```
Returns: `{ concepts: ["term1", "term2", ...] }`

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Auth | Firebase 10 (Google + Email) |
| Backend | Node.js, Express 4 |
| AI | Google Gemini 1.5 Flash |
| Routing | React Router v6 |
| State | React Context + `useReducer` pattern |
