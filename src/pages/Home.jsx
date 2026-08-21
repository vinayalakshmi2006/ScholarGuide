import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useScholarships } from "../context/ScholarshipContext";
import { useAuth } from "../context/AuthContext";
import ScholarshipCard from "../components/ScholarshipCard";
import ScholarshipDetailModal from "../components/ScholarshipDetailModal";
import { 
  Search, Sparkles, CheckCircle2, Award, Users, TrendingUp, 
  ArrowRight, ShieldCheck, HelpCircle, BookOpen, Layers
} from "lucide-react";

export default function Home() {
  const { scholarships, selectedScholarship, setSelectedScholarship } = useScholarships();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");

  const featuredScholarships = scholarships.filter(s => s.featured).slice(0, 6);
  const totalAmountSum = "₹10+ Crore";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/scholarships?q=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/scholarships");
    }
  };

  return (
    <div className="home-page-view">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-backdrop-gradient" />
        <div className="hero-content-container">
          <div className="hero-badge flex-align-center gap-2">
            <Sparkles size={16} className="text-warning" />
            <span>Smart Scholarship Finder & Eligibility Engine</span>
          </div>

          <h1 className="hero-headline">
            Unlock Financial Support for Your <span className="highlight-text">Education</span>
          </h1>

          <p className="hero-subtext">
            Discover 500+ Indian national, state, and private scholarships matching your exact academic CGPA, family income limit, state domicile, and degree stream.
          </p>

          {/* Quick Search Bar Box */}
          <form onSubmit={handleSearchSubmit} className="hero-search-box">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by scholarship name, provider, or state (e.g. AICTE, Pragati, Maharashtra)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-button flex-align-center gap-1">
              <span>Find Scholarships</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Hero Quick Stats */}
          <div className="hero-stats-grid">
            <div className="hero-stat-card">
              <div className="stat-num text-primary">500+</div>
              <div className="stat-label">Verified Scholarships</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num text-emerald">{totalAmountSum}</div>
              <div className="stat-label">Total Fund Pool</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num text-indigo">98%</div>
              <div className="stat-label">Match Accuracy</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num text-amber">100%</div>
              <div className="stat-label">Free for Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-white">
        <div className="section-header text-center">
          <span className="section-subtitle">WHY SMARTSCHOLAR</span>
          <h2 className="section-title">Designed for Modern Student Success</h2>
          <p className="section-description">
            No more searching through dozens of messy PDF portals. SmartScholar consolidates every opportunity into one intelligent platform.
          </p>
        </div>

        <div className="features-grid-4">
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-blue-light text-primary">
              <Search size={28} />
            </div>
            <h3 className="feature-title">Multi-Facet Search</h3>
            <p className="feature-text">
              Filter easily by education level, state domicile, family income, CGPA, category, and gender restrictions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-purple-light text-purple">
              <Sparkles size={28} />
            </div>
            <h3 className="feature-title">Rule-Based Recommendations</h3>
            <p className="feature-text">
              Get an instant 0–100% compatibility score tailored to your personal academic profile.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-emerald-light text-emerald">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="feature-title">Eligibility Criteria Engine</h3>
            <p className="feature-text">
              Detailed match rationale explains why you qualify and points out any missing document or CGPA gap.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-amber-light text-amber">
              <Layers size={28} />
            </div>
            <h3 className="feature-title">Application Status Tracker</h3>
            <p className="feature-text">
              Track your journey from Saved to Applied, Under Review, and Granted with built-in status updates.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Carousel / Grid */}
      <section className="section-padding bg-slate">
        <div className="section-header flex-between">
          <div>
            <span className="section-subtitle">TOP OPPORTUNITIES</span>
            <h2 className="section-title">Featured Scholarships</h2>
          </div>
          <Link to="/scholarships" className="btn-secondary-sm flex-align-center gap-1">
            <span>View All ({scholarships.length})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="scholarships-grid-3">
          {featuredScholarships.map(sch => (
            <ScholarshipCard 
              key={sch.id} 
              scholarship={sch} 
              onSelect={setSelectedScholarship} 
            />
          ))}
        </div>
      </section>

      {/* Interactive Eligibility Teaser Banner */}
      <section className="section-padding bg-primary-gradient text-white">
        <div className="cta-banner-container flex-between">
          <div className="cta-content">
            <span className="cta-badge">PERSONALIZED ENGINE</span>
            <h2 className="cta-title">Not Sure Which Scholarship You Qualify For?</h2>
            <p className="cta-text">
              Enter your CGPA, family income, state, and branch to run our rule-based eligibility algorithm in under 30 seconds.
            </p>
            <div className="cta-buttons-group">
              <Link to="/eligibility" className="btn-light-large flex-align-center gap-2">
                <span>Check Eligibility Now</span>
                <CheckCircle2 size={18} />
              </Link>
              <Link to="/recommendations" className="btn-outline-light-large flex-align-center gap-2">
                <span>See Recommendations</span>
                <Sparkles size={18} />
              </Link>
            </div>
          </div>

          <div className="cta-graphic-card">
            <div className="graphic-header">
              <Award size={36} className="text-warning mb-2" />
              <h4>SmartScholar Engine</h4>
            </div>
            <div className="graphic-stats">
              <div className="g-row">
                <span>Education Match</span>
                <strong className="text-emerald">100%</strong>
              </div>
              <div className="g-row">
                <span>Income Limit Check</span>
                <strong className="text-emerald">Passed</strong>
              </div>
              <div className="g-row">
                <span>Academic Score</span>
                <strong className="text-emerald">8.4 / 10</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal View */}
      {selectedScholarship && (
        <ScholarshipDetailModal 
          scholarship={selectedScholarship} 
          onClose={() => setSelectedScholarship(null)} 
        />
      )}
    </div>
  );
}
