import React, { useState } from "react";
import { useScholarships } from "../context/ScholarshipContext";
import { Link } from "react-router-dom";
import ScholarshipDetailModal from "../components/ScholarshipDetailModal";
import { 
  ClipboardList, CheckCircle2, Clock, Award, XCircle, 
  ExternalLink, Edit3, Plus, ArrowRight, FileText
} from "lucide-react";

export default function ApplicationTrackerPage() {
  const { scholarships, applications, updateApplicationStatus, selectedScholarship, setSelectedScholarship } = useScholarships();
  const [activeTab, setActiveTab] = useState("All");

  const statuses = ["All", "Saved", "Applied", "Under Review", "Selected", "Rejected"];

  const filteredApps = applications.filter(app => {
    if (activeTab === "All") return true;
    return app.status === activeTab;
  });

  return (
    <div className="tracker-page-container section-padding">
      <div className="page-header-row flex-between mb-4">
        <div>
          <h1 className="page-main-title flex-align-center gap-2">
            <ClipboardList className="text-amber" size={28} /> Application Status Tracker
          </h1>
          <p className="page-main-subtitle">
            Manage your progress across all scholarship application portals in real-time.
          </p>
        </div>

        <Link to="/scholarships" className="btn-secondary-sm flex-align-center gap-1">
          <Plus size={16} /> Track New Application
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="tracker-tabs-bar mb-4">
        {statuses.map(st => {
          const count = st === "All" ? applications.length : applications.filter(a => a.status === st).length;
          return (
            <button
              key={st}
              className={`tracker-tab-btn ${activeTab === st ? "active" : ""}`}
              onClick={() => setActiveTab(st)}
            >
              <span>{st}</span>
              <span className="tab-badge">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Applications Pipeline List */}
      {filteredApps.length > 0 ? (
        <div className="applications-pipeline-list">
          {filteredApps.map(app => {
            const sch = scholarships.find(s => s.id === app.scholarshipId);
            if (!sch) return null;

            return (
              <div key={app.id} className="app-tracker-card flex-between">
                <div className="app-main-info">
                  <div className="flex-align-center gap-2 mb-1">
                    <span className={`status-pill status-${app.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {app.status}
                    </span>
                    <span className="ref-number flex-align-center gap-1 text-muted">
                      <FileText size={12} /> Ref: {app.refNumber || "N/A"}
                    </span>
                  </div>

                  <h3 className="app-sch-title" onClick={() => setSelectedScholarship(sch)}>
                    {sch.name}
                  </h3>

                  <p className="app-sch-provider text-muted">
                    {sch.provider} • Amount: <strong className="text-emerald">{sch.amount}</strong>
                  </p>

                  {app.notes && (
                    <div className="app-notes-box mt-2">
                      <strong>Notes:</strong> {app.notes}
                    </div>
                  )}
                </div>

                <div className="app-actions-column text-right">
                  <div className="app-dates text-muted mb-2">
                    Updated: {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : "Recently"}
                  </div>

                  <div className="flex-align-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(sch.id, e.target.value)}
                      className="select-status-inline"
                    >
                      <option value="Saved">Saved</option>
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Selected">Selected / Granted</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button 
                      className="btn-secondary-sm"
                      onClick={() => setSelectedScholarship(sch)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card text-center py-5">
          <ClipboardList size={56} className="text-muted mb-3" />
          <h3>No Applications Found in "{activeTab}"</h3>
          <p className="text-muted max-w-md mx-auto">
            You can mark any scholarship as "Applied" or "Under Review" from the scholarship details modal to track your status here.
          </p>
          <Link to="/scholarships" className="btn-primary-sm mt-4 inline-flex flex-align-center gap-2">
            <span>Find Scholarships to Apply</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

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
