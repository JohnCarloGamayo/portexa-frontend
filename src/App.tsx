import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashWrapper from './pages/SplashWrapper';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PortfoliosPage from './pages/PortfoliosPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ApiKeysPage from './pages/ApiKeysPage';
import SettingsPage from './pages/SettingsPage';
import EmbedChat from './pages/EmbedChat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashWrapper />} />
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/signup" element={<AuthPage type="signup" />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/portfolios" element={<ProtectedRoute><PortfoliosPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/api-keys" element={<ProtectedRoute><ApiKeysPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/embed/chat/:portfolioId" element={<EmbedChat />} />
      </Routes>
    </Router>
  );
}

export default App;
