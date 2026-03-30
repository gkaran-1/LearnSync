# LearnSync - AI-Powered Learning Platform

An intelligent learning platform connecting students with mentors, featuring AI-based mentor allocation, personalized study plans, and adaptive learning modes.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/project/learnsync-dd2d7)
2. Enable Email/Password authentication
3. Enable Google Sign-In
4. Create admin account: `gruthwik44@gmail.com` / `123456`

### 3. Create Demo Accounts
Open `createDemoAccounts.html` in browser and click "Create All Demo Accounts"

### 4. Start Development Server
```bash
npm run dev
```

## 🎭 Demo Accounts

All demo accounts use password: `demo123`

- **Priya** (9 years, Class 4th) - `priya@demo.com`
- **Aarav** (12 years, Class 7th) - `aarav@demo.com`
- **Rohan** (16 years, Class 11th) - `rohan@demo.com`
- **Dr. Anjali** (Mentor) - `anjali@demo.com`

## ✨ Features

- Firebase Authentication (Email/Password + Google Sign-In)
- Firestore Database with auto-seeding
- AI-based mentor allocation
- Role-based dashboards (Student, Mentor, Admin)
- Adaptive learning modes (Foundation, Growth, Mastery)
- Progress tracking and analytics
- Doubt resolution system
- Session management
- Voice AI tutor

## 🏗️ Tech Stack

- React + Vite
- Firebase (Auth + Firestore)
- Tailwind CSS
- React Router
- Gemini AI

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
│   ├── admin/      # Admin dashboard pages
│   ├── mentor/     # Mentor dashboard pages
│   └── student/    # Student dashboard pages
├── services/       # Firebase services
├── utils/          # Utility functions
└── context/        # React context providers
```

## 🎓 Learning Modes

- **Foundation** (Ages 5-10): Super gamified, colorful UI
- **Growth** (Ages 11-14): Gamified with XP system
- **Mastery** (Ages 15-19): Clean, minimal interface

## 🔧 Utility Tools

- `createDemoAccounts.html` - Create demo accounts
- `checkAndFixAssignments.html` - Fix student-mentor assignments
- `migrateLocalStorageToFirestore.html` - Migrate old data
- `addMockMentor.html` - Add mock mentors

## 📝 Environment Variables

Create `.env` file with:
```
VITE_GEMINI_API_KEY=your_key
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

This is an educational project. Feel free to fork and modify.

## 📄 License

MIT
