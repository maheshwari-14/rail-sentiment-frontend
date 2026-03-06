import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import ChartsPage from "./pages/charts-page";
import DashboardPage from "./pages/dashboard-page";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import OntologyPage from "./pages/ontology-page";
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
        <Route
          path="/charts"
          element={
            <ProtectedRoute>
              <ChartsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ontology"
          element={
            <ProtectedRoute>
              <OntologyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
