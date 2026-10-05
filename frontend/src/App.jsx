import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/shared/Navbar";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import { RegisterPage, LoginPage } from "./pages/AuthPages";
import DashboardPage from "./pages/DashboardPage";
import BuilderPage from "./pages/BuilderPage";
import PortfolioPage from "./pages/PortfolioPage";
import ThemePreviewPage from "./pages/ThemePreviewPage";
import PreviewPage from "./pages/PreviewPage";

const WithNav = ({ children }) => <><Navbar />{children}</>;

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/theme-preview" element={<ThemePreviewPage />} />
            <Route path="/"         element={<WithNav><LandingPage /></WithNav>} />
            <Route path="/register" element={<WithNav><RegisterPage /></WithNav>} />
            <Route path="/login"    element={<WithNav><LoginPage /></WithNav>} />
            <Route path="/dashboard" element={<ProtectedRoute><WithNav><DashboardPage /></WithNav></ProtectedRoute>} />
            <Route path="/builder"   element={<ProtectedRoute><WithNav><BuilderPage /></WithNav></ProtectedRoute>} />
            <Route path="/builder/:id" element={<ProtectedRoute><WithNav><BuilderPage /></WithNav></ProtectedRoute>} />
            <Route path="/p/:slug"  element={<PortfolioPage />} />
            <Route path="/preview/:id" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
            <Route path="/preview"  element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
