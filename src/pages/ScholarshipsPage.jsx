import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useScholarships } from "../context/ScholarshipContext";
import { useAuth } from "../context/AuthContext";
import { getRecommendedScholarships } from "../utils/eligibilityEngine";
import ScholarshipCard from "../components/ScholarshipCard";
import ScholarshipDetailModal from "../components/ScholarshipDetailModal";
import { Search, Filter, RotateCcw, SlidersHorizontal, Sparkles, AlertCircle } from "lucide-react";

export default function ScholarshipsPage() {
  const { scholarships, selectedScholarship, setSelectedScholarship } = useScholarships();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [educationLevel, setEducationLevel] = useState("All");
  const [state, setState] = useState("All States");
  const [category, setCategory] = useState("All Categories");
  const [gender, setGender] = useState("All");
  const [maxIncome, setMaxIncome] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [sortBy, setSortBy] = useState("match");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearch("");
    setEducationLevel("All");
    setState("All States");
    setCategory("All Categories");
    setGender("All");
    setMaxIncome("");
    setMinCgpa("");
    setSortBy("match");
    setSearchParams({});
  };

  const filteredScholarships = getRecommendedScholarships(scholarships, user, {
    search,
    educationLevel,
    state,
    category,
    gender,
    maxIncome,
    minCgpa,
    sortBy
  });

  return (
    <div className="scholarships-page-container section-padding">
      {/* Top Header */}
      <div className="page-header-row flex-between mb-4">
        <div>
          <h1 className="page-main-title">Explore Scholarships</h1>
          <p className="page-main-subtitle">
            Showing {filteredScholarships.length} of {scholarships.length} available opportunities
          </p>
        </div>

        <button 
          className="mobile-filter-toggle-btn btn-secondary-sm"
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
        >
          <SlidersHorizontal size={16} />
          <span>{showFiltersMobile ? "Hide Filters" : "Filters & Controls"}</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="scholarships-layout-grid">
        {/* Sidebar Filters Box */}
        <aside className={`filters-sidebar-card ${showFiltersMobile ? "open-mobile" : ""}`}>
          <div className="sidebar-header flex-between">
            <h3 className="sidebar-title flex-align-center gap-2">
              <Filter size={18} /> Filter Criteria
            </h3>
            <button className="btn-text-sm text-primary flex-align-center gap-1" onClick={handleResetFilters}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="filters-form">
            {/* Search Input */}
            <div className="filter-group">
              <label className="filter-label">Search Query</label>
              <div className="input-with-icon">
                <Search size={16} className="input-icon" />
                <input 
                  type="text"
                  placeholder="Keyword, Provider..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="filter-input-text"
                />
              </div>
            </div>

            {/* Education Level */}
            <div className="filter-group">
              <label className="filter-label">Education Level</label>
              <select 
                value={educationLevel} 
                onChange={(e) => setEducationLevel(e.target.value)}
                className="filter-select-input"
              >
                <option value="All">All Education Levels</option>
                <option value="B.Tech/UG">B.Tech / Undergraduate</option>
                <option value="Postgraduate">Postgraduate (M.Tech/M.Sc)</option>
                <option value="High School">High School (Class 10/12)</option>
                <option value="Diploma">Diploma / Vocational</option>
              </select>
            </div>

            {/* State Domicile */}
            <div className="filter-group">
              <label className="filter-label">State Domicile</label>
              <select 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                className="filter-select-input"
              >
                <option value="All States">All India & States</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Bihar">Bihar</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>

            {/* Scholarship Category */}
            <div className="filter-group">
              <label className="filter-label">Provider Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="filter-select-input"
              >
                <option value="All Categories">All Categories</option>
                <option value="Government">Central Government</option>
                <option value="State Government">State Government</option>
                <option value="Private">Private / NGO</option>
                <option value="Corporate">Corporate CSR</option>
              </select>
            </div>

            {/* Gender Eligibility */}
            <div className="filter-group">
              <label className="filter-label">Gender Eligibility</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                className="filter-select-input"
              >
                <option value="All">All Genders</option>
                <option value="Female">Female Only</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Max Income Input */}
            <div className="filter-group">
              <label className="filter-label">Maximum Annual Income (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 500000"
                value={maxIncome}
                onChange={(e) => setMaxIncome(e.target.value)}
                className="filter-input-text"
              />
            </div>

            {/* Min CGPA Input */}
            <div className="filter-group">
              <label className="filter-label">Your CGPA / Percentage</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="e.g. 8.0"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                className="filter-input-text"
              />
            </div>

            {/* Sorting */}
            <div className="filter-group">
              <label className="filter-label">Sort Results By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select-input"
              >
                <option value="match">Highest Match Score %</option>
                <option value="amountHigh">Highest Amount First</option>
                <option value="deadline">Upcoming Deadline</option>
                <option value="cgpa">Lowest CGPA Requirement</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Cards List */}
        <main className="results-container">
          {filteredScholarships.length > 0 ? (
            <div className="scholarships-grid-2">
              {filteredScholarships.map(sch => (
                <ScholarshipCard 
                  key={sch.id} 
                  scholarship={sch} 
                  onSelect={setSelectedScholarship} 
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <AlertCircle size={48} className="text-muted mb-3" />
              <h3>No Scholarships Found</h3>
              <p>We couldn't find any scholarships matching your active filter criteria.</p>
              <button className="btn-primary-sm mt-3" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Details Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal 
          scholarship={selectedScholarship} 
          onClose={() => setSelectedScholarship(null)} 
        />
      )}
    </div>
  );
}
