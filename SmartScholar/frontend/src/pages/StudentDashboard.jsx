import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useScholarships } from "../context/ScholarshipContext";
import { getRecommendedScholarships } from "../utils/eligibilityEngine";
import ScholarshipCard from "../components/ScholarshipCard";
import ScholarshipDetailModal from "../components/ScholarshipDetailModal";
import { 
  LayoutDashboard, Bookmark, ClipboardList, CheckCircle2, 
  Sparkles, Calendar, User, ArrowRight, TrendingUp, Clock
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { scholarships, savedIds, applications, selectedScholarship, setSelectedScholarship } = useScholarships();

  const recommendedList = getRecommendedScholarships(scholarships, user, { sortBy: "match" });
  const eligibleCount = recommendedList.filter(s => s.matchStatus === "Eligible").length;

  const savedList = scholarships.filter(s => savedIds.includes(s.id));

  return (
    <div className="dashboard-page-container section-padding">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner mb-4">
        <div className="welcome-text">
          <h1 className="welcome-title">Welcome back, {user?.name || "Student"}! 👋</h1>
          <p className="welcome-subtext">
            Here is your personalized scholarship dashboard and application tracker summary.
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/eligibility" className="btn-light-sm flex-align-center gap-1">
            <User size={16} /> Edit Academic Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-cards-grid mb-5">
        <div className="metric-card bg-blue-gradient text-white">
          <div className="metric-icon-box">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-val">{eligibleCount}</div>
          <div className="metric-lbl">Total Eligible Scholarships</div>
        </div>

        <div className="metric-card bg-purple-gradient text-white">
          <div className="metric-icon-box">
            <Sparkles size={24} />
          </div>
          <div className="metric-val">{recommendedList.length}</div>
          <div className="metric-lbl">Recommended for You</div>
        </div>

        <div className="metric-card bg-emerald-gradient text-white">
          <div className="metric-icon-box">
            <Bookmark size={24} />
          </div>
          <div className="metric-val">{savedIds.length}</div>
          <div className="metric-lbl">Saved Scholarships</div>
        </div>

        <div className="metric-card bg-amber-gradient text-white">
          <div className="metric-icon-box">
            <ClipboardList size={24} />
          </div>
          <div className="metric-val">{applications.length}</div>
          <div className="metric-lbl">Active Applications</div>
        </div>
      </div>

      {/* Dashboard Main 2-Column Section */}
      <div className="dashboard-main-grid">
        {/* Left Column: Recommended & Saved */}
        <div className="dash-left-col">
          {/* Top Recommended Preview */}
          <div className="dash-section-card mb-4">
            <div className="card-header flex-between mb-3">
              <h3 className="section-card-title flex-align-center gap-2">
                <Sparkles size={20} className="text-purple" /> Top Match Recommendations
              </h3>
              <Link to="/recommendations" className="btn-text-sm text-primary flex-align-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="scholarships-grid-2">
              {recommendedList.slice(0, 4).map(sch => (
                <ScholarshipCard key={sch.id} scholarship={sch} onSelect={setSelectedScholarship} />
              ))}
            </div>
          </div>

          {/* Saved List Quick View */}
          <div className="dash-section-card">
            <div className="card-header flex-between mb-3">
              <h3 className="section-card-title flex-align-center gap-2">
                <Bookmark size={20} className="text-emerald" /> Saved Scholarships ({savedList.length})
              </h3>
              <Link to="/saved" className="btn-text-sm text-primary flex-align-center gap-1">
                Manage Saved <ArrowRight size={14} />
              </Link>
            </div>

            {savedList.length > 0 ? (
              <div className="saved-quick-list">
                {savedList.slice(0, 3).map(sch => (
                  <div key={sch.id} className="saved-item-row flex-between" onClick={() => setSelectedScholarship(sch)}>
                    <div>
                      <h4 className="saved-item-title">{sch.name}</h4>
                      <p className="saved-item-sub text-muted">{sch.provider} • Deadline: {sch.deadline}</p>
                    </div>
                    <div className="flex-align-center gap-2">
                      <span className="amount-pill">{sch.amount}</span>
                      <ArrowRight size={16} className="text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-3">No saved scholarships yet. Click the bookmark icon on any scholarship to save it!</p>
            )}
          </div>
        </div>

        {/* Right Column: Applications Tracker & Profile Card */}
        <div className="dash-right-col">
          {/* Profile Card */}
          <div className="dash-section-card profile-summary-box mb-4">
            <h3 className="section-card-title flex-align-center gap-2 mb-3">
              <User size={20} className="text-primary" /> Academic Profile Summary
            </h3>
            <div className="profile-details-list">
              <div className="p-row"><span>Degree:</span> <strong>{user?.educationLevel}</strong></div>
              <div className="p-row"><span>Stream:</span> <strong>{user?.course}</strong></div>
              <div className="p-row"><span>CGPA:</span> <strong>{user?.cgpa} / 10.0</strong></div>
              <div className="p-row"><span>Category:</span> <strong>{user?.category}</strong></div>
              <div className="p-row"><span>Family Income:</span> <strong>₹{parseInt(user?.annualIncome || 0).toLocaleString()}</strong></div>
              <div className="p-row"><span>State:</span> <strong>{user?.state}</strong></div>
            </div>
            <Link to="/eligibility" className="btn-secondary-block mt-3">Edit Profile</Link>
          </div>

          {/* Application Tracker Pipeline Widget */}
          <div className="dash-section-card">
            <div className="card-header flex-between mb-3">
              <h3 className="section-card-title flex-align-center gap-2">
                <ClipboardList size={20} className="text-amber" /> Applications Pipeline
              </h3>
              <Link to="/tracker" className="btn-text-sm text-primary">Full Tracker</Link>
            </div>

            {applications.length > 0 ? (
              <div className="tracker-mini-list">
                {applications.map(app => {
                  const sch = scholarships.find(s => s.id === app.scholarshipId);
                  return (
                    <div key={app.id} className="app-mini-card">
                      <div className="app-mini-title">{sch ? sch.name : "Scholarship"}</div>
                      <div className="app-mini-status flex-between mt-1">
                        <span className={`status-badge-sm status-${app.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {app.status}
                        </span>
                        <span className="app-date text-muted">{app.appliedDate?.split("T")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted text-center py-3">No active applications tracked yet.</p>
            )}
          </div>
        </div>
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
