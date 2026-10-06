import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/dashboard/Analytics';
import Profile from './pages/dashboard/Profile';
import UploadDocument from './pages/documents/UploadDocument';
import GenerateQuiz from './pages/quizzes/GenerateQuiz';
import QuizEditor from './pages/quizzes/QuizEditor';
import TakeQuiz from './pages/quizzes/TakeQuiz';
import QuizResultPage from './pages/quizzes/QuizResult';
import Flashcards from './pages/flashcards/Flashcards';
import Syllabus from './pages/syllabus/Syllabus';
import Games from './pages/games/Games';
import GamePlay from './pages/games/GamePlay';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Application Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<UploadDocument />} />
              <Route path="/generate-quiz" element={<GenerateQuiz />} />
              <Route path="/quiz-editor" element={<QuizEditor />} />
              <Route path="/take-quiz/:id" element={<TakeQuiz />} />
              <Route path="/quiz-result" element={<QuizResultPage />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/play" element={<GamePlay />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
