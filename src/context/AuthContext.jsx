import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext();

const DEFAULT_PROFILE = {
  name: "Alex Kumar",
  email: "alex.kumar@student.edu",
  age: "20",
  gender: "Female",
  state: "Maharashtra",
  category: "OBC",
  educationLevel: "B.Tech/UG",
  course: "Engineering",
  cgpa: "8.4",
  annualIncome: "350000",
  role: "student" // 'student' | 'admin'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("smartscholar_current_user");
    return savedUser ? JSON.parse(savedUser) : DEFAULT_PROFILE;
  });

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          setUser(prev => ({
            ...prev,
            email: fbUser.email,
            name: fbUser.displayName || prev.name || fbUser.email.split("@")[0]
          }));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const updateProfile = (updatedData) => {
    const newProfile = { ...user, ...updatedData };
    setUser(newProfile);
    localStorage.setItem("smartscholar_current_user", JSON.stringify(newProfile));
  };

  const login = async (email, password, role = "student") => {
    setLoading(true);
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.warn("Firebase Auth fallback used:", err.message);
    }
    const loggedUser = {
      ...user,
      email,
      role: role || (email.includes("admin") ? "admin" : "student"),
      name: email.split("@")[0].replace(".", " ").toUpperCase()
    };
    setUser(loggedUser);
    localStorage.setItem("smartscholar_current_user", JSON.stringify(loggedUser));
    setLoading(false);
    return loggedUser;
  };

  const register = async (email, password, name, role = "student") => {
    setLoading(true);
    try {
      if (auth) {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.warn("Firebase Auth register fallback used:", err.message);
    }
    const newUser = {
      ...DEFAULT_PROFILE,
      name: name || email.split("@")[0],
      email,
      role
    };
    setUser(newUser);
    localStorage.setItem("smartscholar_current_user", JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  };

  const logout = async () => {
    if (auth && firebaseUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn(e);
      }
    }
    setUser(null);
    localStorage.removeItem("smartscholar_current_user");
  };

  const toggleRole = () => {
    const newRole = user?.role === "admin" ? "student" : "admin";
    updateProfile({ role: newRole });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        updateProfile,
        login,
        register,
        logout,
        toggleRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
