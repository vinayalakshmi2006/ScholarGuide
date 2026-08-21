import React from "react";
import { useAuth } from "../context/AuthContext";
import { useScholarships } from "../context/ScholarshipContext";
import { getRecommendedScholarships } from "../utils/eligibilityEngine";
import ScholarshipCard from "../components/ScholarshipCard";
import ScholarshipDetailModal from "../components/ScholarshipDetailModal";
import { Sparkles, UserCheck, Sliders, ArrowRight, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecommendationsPage() {
  const { user } = useAuth();
  const { scholarships, selectedScholarship, setSelectedScholarship } = useScholarships();

  const recommendedList = getRecommendedScholarships(scholarships, user, { sortBy: "match" });

  return (
    <div className="recommendations-page-container section-padding">
      <div className="page-header-row flex-between mb-4">
        <div>
          <div className="badge-pill primary mb-2 flex-align-center gap-1">
            <Sparkles size={14} /> Rule-Based Recommendation Algorithm
          </div>
          <h1 className="page-main-title">Recommended for You</h1>
          <p className="page-main-subtitle">
            Scholarships ranked and prioritized specifically based on your active academic profile.
          </p>
        </div>

        <Link to="/eligibility" className="btn-secondary-sm flex-align-center gap-1">
          <Sliders size={16} />
          <span>Update Profile Parameters</span>
        </Link>
      </div>

      {/* Active Profile Summary Chip Strip */}
      <div className="profile-summary-bar mb-4">
        <div className="summary-title flex-align-center gap-1">
          <UserCheck size={16} className="text-primary" />
          <span>Active Profile:</span>
        </div>
        <div className="profile-chips-group">
          <span className="chip"><strong>Name:</strong> {user?.name || "Student"}</span>
          <span className="chip"><strong>Degree:</strong> {user?.educationLevel} ({user?.course})</span>
          <span className="chip"><strong>CGPA:</strong> {user?.cgpa}</span>
          <span className="chip"><strong>Category:</strong> {user?.category}</span>
          <span className="chip"><strong>Income:</strong> ₹{parseInt(user?.annualIncome || 0).toLocaleString()}</span>
          <span className="chip"><strong>State:</strong> {user?.state}</span>
          <span className="chip"><strong>Gender:</strong> {user?.gender}</span>
        </div>
      </div>

      {/* Recommended List Grid */}
      <div className="scholarships-grid-3">
        {recommendedList.map(sch => (
          <ScholarshipCard 
            key={sch.id} 
            scholarship={sch} 
            onSelect={setSelectedScholarship} 
          />
        ))}
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
