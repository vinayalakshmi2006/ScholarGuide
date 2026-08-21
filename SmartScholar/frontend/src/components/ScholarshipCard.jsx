import React from "react";
import { useScholarships } from "../context/ScholarshipContext";
import { 
  Bookmark, Award, Calendar, DollarSign, ArrowRight, CheckCircle2, 
  AlertTriangle, Sparkles, Building2, MapPin
} from "lucide-react";

export default function ScholarshipCard({ scholarship, onSelect }) {
  const { savedIds, toggleSave } = useScholarships();
  const isSaved = savedIds.includes(scholarship.id);

  // Match score color formatting
  const score = scholarship.matchScore !== undefined ? scholarship.matchScore : null;
  let scoreClass = "score-neutral";
  if (score !== null) {
    if (score >= 85) scoreClass = "score-high";
    else if (score >= 65) scoreClass = "score-medium";
    else scoreClass = "score-low";
  }

  return (
    <div className={`scholarship-card ${scholarship.featured ? "featured-card" : ""}`}>
      {/* Top Header */}
      <div className="card-top-bar">
        <div className="card-category-badges">
          <span className={`category-badge ${scholarship.category?.toLowerCase().replace(/\s+/g, '-')}`}>
            {scholarship.category}
          </span>
          <span className="state-badge flex-align-center gap-1">
            <MapPin size={12} />
            {scholarship.state}
          </span>
        </div>

        <button 
          className={`bookmark-btn ${isSaved ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(scholarship.id);
          }}
          title={isSaved ? "Remove Bookmark" : "Save Scholarship"}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Provider & Title */}
      <div className="card-body">
        <div className="provider-name flex-align-center gap-1">
          <Building2 size={14} className="text-muted" />
          <span>{scholarship.provider}</span>
        </div>

        <h3 className="scholarship-title" onClick={() => onSelect(scholarship)}>
          {scholarship.name}
        </h3>

        {/* Match Percentage Pill */}
        {score !== null && (
          <div className={`match-score-pill ${scoreClass}`}>
            <Sparkles size={14} />
            <span>{score}% Match</span>
            <span className="match-status-label">• {scholarship.matchStatus}</span>
          </div>
        )}

        {/* Key Stats Row */}
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-label">Amount</span>
            <span className="stat-value text-emerald">{scholarship.amount}</span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Deadline</span>
            <span className="stat-value text-dark flex-align-center gap-1">
              <Calendar size={13} />
              {scholarship.deadline}
            </span>
          </div>
        </div>

        {/* Requirements Summary Checklist */}
        <div className="requirements-summary">
          <div className="req-item">
            <span className="req-label">Min CGPA:</span>
            <span className="req-val">{scholarship.minCgpa}</span>
          </div>
          <div className="req-item">
            <span className="req-label">Max Income:</span>
            <span className="req-val">
              {scholarship.maxIncome >= 10000000 
                ? "No Limit" 
                : `₹${(scholarship.maxIncome / 100000).toFixed(1)} Lakh`}
            </span>
          </div>
          <div className="req-item">
            <span className="req-label">Gender:</span>
            <span className="req-val">{scholarship.gender}</span>
          </div>
          <div className="req-item">
            <span className="req-label">Level:</span>
            <span className="req-val">{scholarship.educationLevel}</span>
          </div>
        </div>

        {/* Tags */}
        {scholarship.tags && scholarship.tags.length > 0 && (
          <div className="card-tags-row">
            {scholarship.tags.map((tag, idx) => (
              <span key={idx} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="card-footer-actions">
        <button 
          className="btn-details"
          onClick={() => onSelect(scholarship)}
        >
          View Details
        </button>

        <a 
          href={scholarship.applicationLink}
          target="_blank"
          rel="noreferrer"
          className="btn-apply-direct flex-align-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Apply</span>
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
