import React, { useState } from "react";
import { useScholarships } from "../context/ScholarshipContext";
import { useAuth } from "../context/AuthContext";
import { calculateEligibility } from "../utils/eligibilityEngine";
import { 
  X, ExternalLink, Bookmark, CheckCircle2, XCircle, AlertCircle, 
  Calendar, FileText, Building2, MapPin, Sparkles, Send, Award
} from "lucide-react";

export default function ScholarshipDetailModal({ scholarship, onClose }) {
  const { user } = useAuth();
  const { savedIds, toggleSave, applications, updateApplicationStatus } = useScholarships();
  
  if (!scholarship) return null;

  const isSaved = savedIds.includes(scholarship.id);
  const currentApp = applications.find(a => a.scholarshipId === scholarship.id);
  const currentStatus = currentApp ? currentApp.status : "Not Applied";

  // Calculate detailed match score against current user profile
  const matchInfo = calculateEligibility(user, scholarship);

  const [statusSelect, setStatusSelect] = useState(currentStatus);
  const [notes, setNotes] = useState(currentApp?.notes || "");
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    setUpdating(true);
    updateApplicationStatus(scholarship.id, statusSelect, notes);
    setTimeout(() => setUpdating(false), 300);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-container-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Top Bar */}
        <div className="modal-header">
          <div className="flex-align-center gap-2 mb-2">
            <span className="category-badge">{scholarship.category}</span>
            <span className="state-badge flex-align-center gap-1">
              <MapPin size={12} /> {scholarship.state}
            </span>
            <span className="type-badge">{scholarship.type}</span>
          </div>

          <h2 className="modal-title">{scholarship.name}</h2>
          <div className="modal-provider flex-align-center gap-1">
            <Building2 size={16} />
            <span>Provided by {scholarship.provider}</span>
          </div>
        </div>

        <div className="modal-body-scrollable">
          {/* Eligibility Match Card Banner */}
          <div className={`modal-match-banner ${matchInfo.status.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="match-banner-header">
              <div className="flex-align-center gap-2">
                <Sparkles size={20} />
                <span className="match-score-heading">
                  Your Compatibility Score: <strong>{matchInfo.score}%</strong> ({matchInfo.status})
                </span>
              </div>
            </div>

            <p className="match-rationale-text">{matchInfo.rationale}</p>

            <div className="match-breakdown-grid">
              <div className="breakdown-col">
                <h5 className="breakdown-title text-success flex-align-center gap-1">
                  <CheckCircle2 size={14} /> Met Requirements ({matchInfo.matchedCriteria.length})
                </h5>
                <ul className="criteria-list met">
                  {matchInfo.matchedCriteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {matchInfo.unmetCriteria.length > 0 && (
                <div className="breakdown-col">
                  <h5 className="breakdown-title text-danger flex-align-center gap-1">
                    <XCircle size={14} /> Unmet / Attention ({matchInfo.unmetCriteria.length})
                  </h5>
                  <ul className="criteria-list unmet">
                    {matchInfo.unmetCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="modal-info-grid">
            <div className="modal-info-box">
              <span className="info-box-label">Reward Amount</span>
              <span className="info-box-val text-emerald">{scholarship.amount}</span>
            </div>
            <div className="modal-info-box">
              <span className="info-box-label">Deadline</span>
              <span className="info-box-val text-dark">{scholarship.deadline}</span>
            </div>
            <div className="modal-info-box">
              <span className="info-box-label">Min CGPA</span>
              <span className="info-box-val">{scholarship.minCgpa}</span>
            </div>
            <div className="modal-info-box">
              <span className="info-box-label">Max Family Income</span>
              <span className="info-box-val">
                {scholarship.maxIncome >= 10000000 ? "No Limit" : `₹${scholarship.maxIncome.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="modal-section">
            <h4 className="section-title flex-align-center gap-2">
              <FileText size={18} /> Description & Overview
            </h4>
            <p className="modal-text-content">{scholarship.description}</p>
          </div>

          {/* Eligibility Requirements List */}
          <div className="modal-section">
            <h4 className="section-title flex-align-center gap-2">
              <Award size={18} /> Eligibility Constraints
            </h4>
            <div className="requirements-table">
              <div className="table-row">
                <span className="col-label">Education Level:</span>
                <span className="col-val">{scholarship.educationLevel}</span>
              </div>
              <div className="table-row">
                <span className="col-label">Course Stream:</span>
                <span className="col-val">{scholarship.course}</span>
              </div>
              <div className="table-row">
                <span className="col-label">Gender Eligibility:</span>
                <span className="col-val">{scholarship.gender}</span>
              </div>
              <div className="table-row">
                <span className="col-label">Category Eligibility:</span>
                <span className="col-val">
                  {scholarship.categoryEligible ? scholarship.categoryEligible.join(", ") : "All"}
                </span>
              </div>
              <div className="table-row">
                <span className="col-label">State / Region:</span>
                <span className="col-val">{scholarship.state}</span>
              </div>
            </div>
          </div>

          {/* Documents Checklist */}
          {scholarship.documents && scholarship.documents.length > 0 && (
            <div className="modal-section">
              <h4 className="section-title flex-align-center gap-2">
                <FileText size={18} /> Mandatory Documents Required
              </h4>
              <div className="documents-grid">
                {scholarship.documents.map((doc, idx) => (
                  <div key={idx} className="doc-chip flex-align-center gap-2">
                    <CheckCircle2 size={14} className="text-primary" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Application Tracker Status Updater */}
          {user && (
            <div className="modal-section tracker-updater-box">
              <h4 className="section-title flex-align-center gap-2">
                <Send size={18} /> Update Your Application Status
              </h4>
              <form onSubmit={handleStatusUpdate} className="status-update-form">
                <div className="form-group-inline">
                  <select 
                    value={statusSelect} 
                    onChange={(e) => setStatusSelect(e.target.value)}
                    className="select-status-input"
                  >
                    <option value="Saved">Saved for Later</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Selected">Selected / Granted 🎉</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <input 
                    type="text" 
                    placeholder="Application Ref No. / Notes (e.g. NSP-982173)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="notes-input"
                  />

                  <button type="submit" className="btn-primary-sm">
                    {updating ? "Saving..." : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="modal-footer-actions">
          <button 
            className={`btn-bookmark-action ${isSaved ? "saved" : ""}`}
            onClick={() => toggleSave(scholarship.id)}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            <span>{isSaved ? "Saved in Bookmarks" : "Save Scholarship"}</span>
          </button>

          <a 
            href={scholarship.applicationLink} 
            target="_blank" 
            rel="noreferrer"
            className="btn-primary-large flex-align-center gap-2"
          >
            <span>Proceed to Official Application Portal</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
