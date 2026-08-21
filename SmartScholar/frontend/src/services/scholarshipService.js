import { INITIAL_SCHOLARSHIPS } from "../data/mockScholarships";
import { db } from "./firebase";
import { 
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc 
} from "firebase/firestore";

const STORAGE_KEYS = {
  SCHOLARSHIPS: "smartscholar_list",
  SAVED: "smartscholar_saved",
  APPLICATIONS: "smartscholar_applications",
  USERS: "smartscholar_registered_students"
};

// Helper for local storage read/write
const getLocal = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("LocalStorage write error", e);
  }
};

export const scholarshipService = {
  // Fetch all scholarships (from Firestore with LocalStorage fallback)
  async getScholarships() {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "scholarships"));
        if (!querySnapshot.empty) {
          const list = [];
          querySnapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          setLocal(STORAGE_KEYS.SCHOLARSHIPS, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore fetch error, utilizing fallback dataset:", err);
      }
    }
    let localList = getLocal(STORAGE_KEYS.SCHOLARSHIPS, null);
    if (!localList || localList.length === 0) {
      localList = INITIAL_SCHOLARSHIPS;
      setLocal(STORAGE_KEYS.SCHOLARSHIPS, localList);
    }
    return localList;
  },

  // Add Scholarship (Admin)
  async addScholarship(scholarshipData) {
    const newScholarship = {
      ...scholarshipData,
      id: "sch-" + Date.now(),
      amountValue: parseInt(scholarshipData.amountValue, 10) || 50000,
      minCgpa: parseFloat(scholarshipData.minCgpa) || 6.0,
      maxIncome: parseFloat(scholarshipData.maxIncome) || 500000,
      featured: scholarshipData.featured || false,
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = await addDoc(collection(db, "scholarships"), newScholarship);
        newScholarship.id = docRef.id;
      } catch (e) {
        console.warn("Firestore add failed, saved locally", e);
      }
    }

    const current = getLocal(STORAGE_KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
    const updated = [newScholarship, ...current];
    setLocal(STORAGE_KEYS.SCHOLARSHIPS, updated);
    return newScholarship;
  },

  // Update Scholarship (Admin)
  async updateScholarship(id, updatedData) {
    if (db) {
      try {
        await updateDoc(doc(db, "scholarships", id), updatedData);
      } catch (e) {
        console.warn("Firestore update failed", e);
      }
    }

    const current = getLocal(STORAGE_KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
    const updated = current.map(item => item.id === id ? { ...item, ...updatedData } : item);
    setLocal(STORAGE_KEYS.SCHOLARSHIPS, updated);
    return updated;
  },

  // Delete Scholarship (Admin)
  async deleteScholarship(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "scholarships", id));
      } catch (e) {
        console.warn("Firestore delete failed", e);
      }
    }

    const current = getLocal(STORAGE_KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS);
    const updated = current.filter(item => item.id !== id);
    setLocal(STORAGE_KEYS.SCHOLARSHIPS, updated);
    return updated;
  },

  // Saved Scholarships Operations
  getSavedScholarships(userId = "guest") {
    const allSaved = getLocal(STORAGE_KEYS.SAVED, {});
    return allSaved[userId] || [];
  },

  toggleSaveScholarship(userId = "guest", scholarshipId) {
    const allSaved = getLocal(STORAGE_KEYS.SAVED, {});
    const userSaved = allSaved[userId] || [];
    let updated;
    if (userSaved.includes(scholarshipId)) {
      updated = userSaved.filter(id => id !== scholarshipId);
    } else {
      updated = [...userSaved, scholarshipId];
    }
    allSaved[userId] = updated;
    setLocal(STORAGE_KEYS.SAVED, allSaved);
    return updated;
  },

  // Applications Operations
  getApplications(userId = "guest") {
    const allApps = getLocal(STORAGE_KEYS.APPLICATIONS, {});
    return allApps[userId] || [];
  },

  updateApplicationStatus(userId = "guest", scholarshipId, status, extraNotes = "") {
    const allApps = getLocal(STORAGE_KEYS.APPLICATIONS, {});
    const userApps = allApps[userId] || [];
    
    const existingIndex = userApps.findIndex(app => app.scholarshipId === scholarshipId);
    let updatedApps = [...userApps];

    if (existingIndex >= 0) {
      updatedApps[existingIndex] = {
        ...updatedApps[existingIndex],
        status,
        updatedAt: new Date().toISOString(),
        notes: extraNotes || updatedApps[existingIndex].notes
      };
    } else {
      updatedApps.push({
        id: "app-" + Date.now(),
        scholarshipId,
        status,
        appliedDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: extraNotes,
        refNumber: "SCH-APP-" + Math.floor(100000 + Math.random() * 900000)
      });
    }

    allApps[userId] = updatedApps;
    setLocal(STORAGE_KEYS.APPLICATIONS, allApps);
    return updatedApps;
  },

  // All Registered Students (Admin view)
  getRegisteredStudents() {
    return getLocal(STORAGE_KEYS.USERS, [
      { id: "usr-1", name: "Aarav Sharma", email: "aarav.sharma@example.com", course: "B.Tech Engineering", state: "Maharashtra", cgpa: 8.4, category: "General", income: "₹3,50,000" },
      { id: "usr-2", name: "Priya Patel", email: "priya.patel@example.com", course: "B.Tech Engineering", state: "Gujarat", cgpa: 8.8, category: "OBC", income: "₹2,20,000" },
      { id: "usr-3", name: "Ananya Roy", email: "ananya.roy@example.com", course: "Computer Science", state: "West Bengal", cgpa: 9.1, category: "General", income: "₹4,80,000" },
      { id: "usr-4", name: "Rohan Kumar", email: "rohan.kumar@example.com", course: "B.Tech Mechanical", state: "Bihar", cgpa: 7.6, category: "SC", income: "₹1,80,000" }
    ]);
  }
};
