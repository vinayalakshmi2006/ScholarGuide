import React from "react";
import { Link } from "react-router-dom";
import { useScholarships } from "../context/ScholarshipContext";
import ScholarshipCard from "../components/ScholarshipCard";
import ScholarshipDetailModal from "../components/ScholarshipDetailModal";
import { Bookmark, Search, Trash2, ArrowRight } from "lucide-react";

export default function SavedScholarshipsPage() {
  const { scholarships, savedIds, selectedScholarship, setSelectedScholarship, toggleSave } = useScholarships();

  const savedList = scholarships.filter(s => savedIds.includes(s.id));

  return (
    <div className="saved-page-container section-padding">
      <div className="page-header-row flex-between mb-4">
        <div>
          <h1 className="page-main-title flex-align-center gap-2">
            <Bookmark className="text-emerald" size={28} /> Saved Scholarships
          </h1>
          <p className="page-main-subtitle">
            You have {savedList.length} bookmarked scholarship opportunities saved for easy access.
          </p>
        </div>

        <Link to="/scholarships" className="btn-secondary-sm flex-align-center gap-1">
          <Search size={16} /> Explore More
        </Link>
      </div>

      {savedList.length > 0 ? (
        <div className="scholarships-grid-3">
          {savedList.map(sch => (
            <ScholarshipCard 
              key={sch.id} 
              scholarship={sch} 
              onSelect={setSelectedScholarship} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card text-center py-5">
          <Bookmark size={56} className="text-muted mb-3" />
          <h3>No Saved Scholarships Yet</h3>
          <p className="text-muted max-w-md mx-auto">
            When browsing scholarships, click the bookmark icon on any card to save it here for quick tracking and application!
          </p>
          <Link to="/scholarships" className="btn-primary-sm mt-4 inline-flex flex-align-center gap-2">
            <span>Browse Scholarships Directory</span>
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
