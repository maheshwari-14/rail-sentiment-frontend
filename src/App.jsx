import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import DashboardPage from "./pages/dashboard-page";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import UploadPage from "./pages/upload-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
