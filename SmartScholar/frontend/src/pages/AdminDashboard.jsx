import React, { useState } from "react";
import { useScholarships } from "../context/ScholarshipContext";
import { scholarshipService } from "../services/scholarshipService";
import { 
  Shield, Plus, Edit, Trash2, Users, FileText, 
  CheckCircle2, Building2, MapPin, DollarSign, Calendar, X
} from "lucide-react";

export default function AdminDashboard() {
  const { scholarships, addScholarship, updateScholarship, deleteScholarship, addToast } = useScholarships();
  
  const [activeTab, setActiveTab] = useState("scholarships"); // 'scholarships' | 'students'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const registeredStudents = scholarshipService.getRegisteredStudents();

  // Form State
  const initialForm = {
    name: "",
    provider: "",
    category: "Government",
    type: "Merit-cum-Means",
    amount: "₹50,000 / year",
    amountValue: 50000,
    deadline: "2026-12-31",
    educationLevel: "B.Tech/UG",
    course: "Engineering",
    state: "All India",
    minCgpa: 7.0,
    maxIncome: 500000,
    gender: "All",
    categoryEligible: ["General", "OBC", "SC", "ST", "EWS"],
    description: "",
    applicationLink: "https://scholarships.gov.in/",
    featured: false,
    tags: ["New", "Government"]
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sch) => {
    setEditingId(sch.id);
    setFormData({
      ...sch,
      tags: sch.tags ? sch.tags.join(", ") : ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      tags: typeof formData.tags === "string" ? formData.tags.split(",").map(t => t.trim()) : formData.tags
    };

    if (editingId) {
      await updateScholarship(editingId, formattedData);
    } else {
      await addScholarship(formattedData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteScholarship(id);
    }
  };

  return (
    <div className="admin-dashboard-container section-padding">
      <div className="page-header-row flex-between mb-4">
        <div>
          <div className="badge-pill danger mb-2 flex-align-center gap-1">
            <Shield size={14} /> Admin Controls Panel
          </div>
          <h1 className="page-main-title">Admin Management Dashboard</h1>
          <p className="page-main-subtitle">
            Add, update, or remove scholarship records and view registered student profiles.
          </p>
        </div>

        <button className="btn-primary-sm flex-align-center gap-1" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add New Scholarship
        </button>
      </div>

      {/* Admin Quick Metrics */}
      <div className="metrics-cards-grid mb-4">
        <div className="metric-card bg-blue-gradient text-white">
          <div className="metric-val">{scholarships.length}</div>
          <div className="metric-lbl">Total Scholarships Listed</div>
        </div>
        <div className="metric-card bg-emerald-gradient text-white">
          <div className="metric-val">{registeredStudents.length}</div>
          <div className="metric-lbl">Registered Students</div>
        </div>
        <div className="metric-card bg-purple-gradient text-white">
          <div className="metric-val">{scholarships.filter(s => s.featured).length}</div>
          <div className="metric-lbl">Featured Scholarships</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="tracker-tabs-bar mb-4">
        <button
          className={`tracker-tab-btn ${activeTab === "scholarships" ? "active" : ""}`}
          onClick={() => setActiveTab("scholarships")}
        >
          <FileText size={16} />
          <span>Manage Scholarships ({scholarships.length})</span>
        </button>
        <button
          className={`tracker-tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <Users size={16} />
          <span>Registered Students Directory ({registeredStudents.length})</span>
        </button>
      </div>

      {/* View 1: Scholarships Management Table / List */}
      {activeTab === "scholarships" && (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Scholarship Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Deadline</th>
                <th>Level / State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map(sch => (
                <tr key={sch.id}>
                  <td>
                    <div className="font-semibold text-dark">{sch.name}</div>
                    <div className="text-xs text-muted">{sch.provider}</div>
                  </td>
                  <td>
                    <span className="category-badge">{sch.category}</span>
                  </td>
                  <td><strong className="text-emerald">{sch.amount}</strong></td>
                  <td>{sch.deadline}</td>
                  <td>
                    <div className="text-xs">{sch.educationLevel}</div>
                    <div className="text-xs text-muted">{sch.state}</div>
                  </td>
                  <td>
                    <div className="flex-align-center gap-2">
                      <button 
                        className="icon-btn edit-btn" 
                        onClick={() => handleOpenEditModal(sch)}
                        title="Edit Scholarship"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="icon-btn delete-btn" 
                        onClick={() => handleDelete(sch.id, sch.name)}
                        title="Delete Scholarship"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: Students Directory */}
      {activeTab === "students" && (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course / Stream</th>
                <th>CGPA</th>
                <th>Category</th>
                <th>State Domicile</th>
                <th>Annual Income</th>
              </tr>
            </thead>
            <tbody>
              {registeredStudents.map(st => (
                <tr key={st.id}>
                  <td>
                    <div className="font-semibold text-dark">{st.name}</div>
                    <div className="text-xs text-muted">{st.email}</div>
                  </td>
                  <td>{st.course}</td>
                  <td><span className="badge-pill primary">{st.cgpa}</span></td>
                  <td>{st.category}</td>
                  <td>{st.state}</td>
                  <td>{st.income}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Scholarship Modal */}
      {isModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <h2 className="modal-title">{editingId ? "Edit Scholarship" : "Add New Scholarship"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-sch-form modal-body-scrollable">
              <div className="form-group">
                <label className="form-label">Scholarship Title</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                  className="form-control"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Provider Name</label>
                  <input 
                    type="text" 
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    required 
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Provider Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="Government">Government</option>
                    <option value="State Government">State Government</option>
                    <option value="Private">Private</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Amount Label (e.g. ₹50,000 / year)</label>
                  <input 
                    type="text" 
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required 
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amount Numeric Value (₹)</label>
                  <input 
                    type="number" 
                    value={formData.amountValue}
                    onChange={(e) => setFormData({ ...formData, amountValue: e.target.value })}
                    required 
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input 
                    type="date" 
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required 
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State Domicile</label>
                  <input 
                    type="text" 
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required 
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Minimum CGPA Required</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                    required 
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Family Income Cap (₹)</label>
                  <input 
                    type="number" 
                    value={formData.maxIncome}
                    onChange={(e) => setFormData({ ...formData, maxIncome: e.target.value })}
                    required 
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Education Level</label>
                  <select 
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="form-control"
                  >
                    <option value="B.Tech/UG">B.Tech/UG</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender Eligibility</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="form-control"
                  >
                    <option value="All">All</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Application Link</label>
                <input 
                  type="text" 
                  value={formData.applicationLink}
                  onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="modal-footer-actions mt-3">
                <button type="button" className="btn-secondary-sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-sm">
                  {editingId ? "Save Changes" : "Create Scholarship"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
