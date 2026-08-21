import React, { createContext, useContext, useState, useEffect } from "react";
import { scholarshipService } from "../services/scholarshipService";
import { useAuth } from "./AuthContext";

const ScholarshipContext = createContext();

export function ScholarshipProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.email || "guest";

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load scholarships data
  const loadData = async () => {
    setLoading(true);
    const list = await scholarshipService.getScholarships();
    setScholarships(list);
    
    const saved = scholarshipService.getSavedScholarships(userId);
    setSavedIds(saved);

    const apps = scholarshipService.getApplications(userId);
    setApplications(apps);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Toggle bookmark save
  const toggleSave = (scholarshipId) => {
    const updated = scholarshipService.toggleSaveScholarship(userId, scholarshipId);
    setSavedIds(updated);
    const isSaved = updated.includes(scholarshipId);
    addToast(isSaved ? "Scholarship saved to your bookmarks!" : "Scholarship removed from saved.", isSaved ? "success" : "info");
  };

  // Application Status Update
  const updateApplicationStatus = (scholarshipId, status, notes = "") => {
    const updated = scholarshipService.updateApplicationStatus(userId, scholarshipId, status, notes);
    setApplications(updated);
    addToast(`Application status updated to "${status}"`, "success");
  };

  // Admin CRUD Actions
  const addScholarship = async (data) => {
    const newSch = await scholarshipService.addScholarship(data);
    setScholarships(prev => [newSch, ...prev]);
    addToast("New scholarship created successfully!", "success");
    return newSch;
  };

  const updateScholarship = async (id, updatedData) => {
    const newList = await scholarshipService.updateScholarship(id, updatedData);
    setScholarships(newList);
    addToast("Scholarship updated successfully!", "success");
  };

  const deleteScholarship = async (id) => {
    const newList = await scholarshipService.deleteScholarship(id);
    setScholarships(newList);
    addToast("Scholarship deleted successfully.", "info");
  };

  return (
    <ScholarshipContext.Provider
      value={{
        scholarships,
        loading,
        savedIds,
        applications,
        selectedScholarship,
        setSelectedScholarship,
        toggleSave,
        updateApplicationStatus,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        toasts,
        addToast,
        removeToast,
        refreshData: loadData
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
}

export function useScholarships() {
  return useContext(ScholarshipContext);
}
