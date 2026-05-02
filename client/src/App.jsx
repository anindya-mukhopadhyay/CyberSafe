import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PhishingPage from './pages/PhishingPage';
import ReportPage from './pages/ReportPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phishing" element={<PhishingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/report" replace /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/report" replace /> : <SignupPage />} />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
