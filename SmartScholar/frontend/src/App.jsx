import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ScholarshipProvider } from "./context/ScholarshipContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

// Pages
import Home from "./pages/Home";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import EligibilityPage from "./pages/EligibilityPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import StudentDashboard from "./pages/StudentDashboard";
import SavedScholarshipsPage from "./pages/SavedScholarshipsPage";
import ApplicationTrackerPage from "./pages/ApplicationTrackerPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <AuthProvider>
      <ScholarshipProvider>
        <Router>
          <div className="app-main-layout">
            <Navbar />
            <main className="app-content-body">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scholarships" element={<ScholarshipsPage />} />
                <Route path="/eligibility" element={<EligibilityPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/saved" element={<SavedScholarshipsPage />} />
                <Route path="/tracker" element={<ApplicationTrackerPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
            <Toast />
          </div>
        </Router>
      </ScholarshipProvider>
    </AuthProvider>
  );
}

export default App;