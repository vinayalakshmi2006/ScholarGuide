import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useScholarships } from "../context/ScholarshipContext";
import { getRecommendedScholarships } from "../utils/eligibilityEngine";
import ScholarshipCard from "../components/ScholarshipCard";
import ScholarshipDetailModal from "../components/ScholarshipDetailModal";
import { 
  CheckCircle2, Sparkles, User, GraduationCap, DollarSign, 
  MapPin, Shield, Layers, Award, AlertTriangle, ArrowRight, RefreshCw
} from "lucide-react";

export default function EligibilityPage() {
  const { user, updateProfile } = useAuth();
  const { scholarships, selectedScholarship, setSelectedScholarship, addToast } = useScholarships();

  // Form Profile State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "20",
    gender: user?.gender || "Female",
    state: user?.state || "Maharashtra",
    category: user?.category || "OBC",
    educationLevel: user?.educationLevel || "B.Tech/UG",
    course: user?.course || "Engineering",
    cgpa: user?.cgpa || "8.4",
    annualIncome: user?.annualIncome || "350000"
  });

  const [hasCalculated, setHasCalculated] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setHasCalculated(true);
    addToast("Academic profile saved! Eligibility match recalculated.", "success");
  };

  // Run Rule-Based Matching Algorithm
  const matchedResults = getRecommendedScholarships(scholarships, formData, { sortBy: "match" });

  const eligibleList = matchedResults.filter(s => s.matchStatus === "Eligible");
  const nearMatchList = matchedResults.filter(s => s.matchStatus === "Near Match");
  const ineligibleList = matchedResults.filter(s => s.matchStatus === "Ineligible");

  return (
    <div className="eligibility-page-container section-padding">
      <div className="page-header-row mb-4">
        <div>
          <span className="section-subtitle">SMARTSCHOLAR ENGINE</span>
          <h1 className="page-main-title">Student Eligibility & Match Engine</h1>
          <p className="page-main-subtitle">
            Enter your academic and personal details to run multi-factor matching across all scholarships.
          </p>
        </div>
      </div>

      <div className="eligibility-grid-layout">
        {/* Form Card */}
        <div className="profile-form-card">
          <div className="card-header flex-align-center gap-2 mb-3">
            <User size={22} className="text-primary" />
            <h3 className="card-title">Student Academic Profile</h3>
          </div>

          <form onSubmit={handleSubmit} className="academic-form">
            {/* Name & Age */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age (Years)</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>

            {/* Gender & Social Category */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other / Prefer Not to Say</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Social Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                  <option value="General">General / Open</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
              </div>
            </div>

            {/* State Domicile & Education Level */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">State Domicile</label>
                <select name="state" value={formData.state} onChange={handleChange} className="form-control">
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Education Level</label>
                <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="form-control">
                  <option value="B.Tech/UG">B.Tech / Undergraduate</option>
                  <option value="Postgraduate">Postgraduate (M.Tech/M.Sc)</option>
                  <option value="High School">High School (Class 10/12)</option>
                  <option value="Diploma">Diploma / Vocational</option>
                </select>
              </div>
            </div>

            {/* Course Stream */}
            <div className="form-group">
              <label className="form-label">Course / Field of Study</label>
              <select name="course" value={formData.course} onChange={handleChange} className="form-control">
                <option value="Engineering">Engineering (B.E / B.Tech)</option>
                <option value="Computer Science">Computer Science & IT</option>
                <option value="Medical">Medical (MBBS / Pharmacy)</option>
                <option value="Science & Research">Science & Basic Research</option>
                <option value="All Courses">Arts / Commerce / General Degree</option>
              </select>
            </div>

            {/* CGPA & Annual Family Income */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">CGPA / Percentage</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 8.4"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Family Income (₹)</label>
                <input 
                  type="number" 
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 350000"
                  className="form-control"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-block flex-align-center gap-2 mt-2">
              <RefreshCw size={18} />
              <span>Calculate Eligibility Match</span>
            </button>
          </form>
        </div>

        {/* Match Engine Results Column */}
        <div className="match-results-column">
          {/* Summary Stat Cards */}
          <div className="match-stats-banner">
            <div className="stat-card-pill bg-emerald-light text-emerald">
              <div className="num-val">{eligibleList.length}</div>
              <div className="num-lbl">100% Eligible</div>
            </div>
            <div className="stat-card-pill bg-amber-light text-amber">
              <div className="num-val">{nearMatchList.length}</div>
              <div className="num-lbl">Near Matches</div>
            </div>
            <div className="stat-card-pill bg-slate text-muted">
              <div className="num-val">{ineligibleList.length}</div>
              <div className="num-lbl">Ineligible</div>
            </div>
          </div>

          {/* Section 1: Fully Eligible Scholarships */}
          <div className="results-group-section">
            <div className="group-header flex-align-center gap-2 mb-3">
              <CheckCircle2 size={22} className="text-emerald" />
              <h2 className="group-title">Fully Eligible Opportunities ({eligibleList.length})</h2>
            </div>

            {eligibleList.length > 0 ? (
              <div className="scholarships-grid-2">
                {eligibleList.map(sch => (
                  <ScholarshipCard key={sch.id} scholarship={sch} onSelect={setSelectedScholarship} />
                ))}
              </div>
            ) : (
              <div className="info-box-alert">
                <p>No 100% eligible scholarships found for this profile combination. Check near-matches below!</p>
              </div>
            )}
          </div>

          {/* Section 2: Near Matches (70-99%) */}
          {nearMatchList.length > 0 && (
            <div className="results-group-section mt-5">
              <div className="group-header flex-align-center gap-2 mb-3">
                <AlertTriangle size={22} className="text-amber" />
                <h2 className="group-title">Near-Match Opportunities ({nearMatchList.length})</h2>
              </div>
              <p className="group-subtext">
                Scholarships where you meet most parameters but fall slightly short on one condition (e.g. CGPA or income limit).
              </p>

              <div className="scholarships-grid-2 mt-3">
                {nearMatchList.map(sch => (
                  <ScholarshipCard key={sch.id} scholarship={sch} onSelect={setSelectedScholarship} />
                ))}
              </div>
            </div>
          )}
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
