/**
 * SmartScholar Eligibility & Recommendation Engine
 * Calculates multi-factor match percentages and provides rationale.
 */

export function calculateEligibility(profile, scholarship) {
  if (!profile || !scholarship) {
    return {
      score: 0,
      status: "Ineligible",
      matchedCriteria: [],
      unmetCriteria: ["Profile or scholarship missing"],
      rationale: "Complete your student profile to check eligibility."
    };
  }

  let totalWeight = 100;
  let earnedScore = 0;
  
  const matchedCriteria = [];
  const unmetCriteria = [];
  const nearMisses = [];

  // 1. Education Level (Weight: 20)
  const eduWeight = 20;
  const isEduLevelMatch = 
    scholarship.educationLevel === "All Levels" ||
    scholarship.educationLevel === profile.educationLevel ||
    (profile.educationLevel === "B.Tech/UG" && scholarship.educationLevel?.includes("UG"));
  
  if (isEduLevelMatch) {
    earnedScore += eduWeight;
    matchedCriteria.push(`Education Level: ${profile.educationLevel}`);
  } else {
    unmetCriteria.push(`Requires ${scholarship.educationLevel} (You selected ${profile.educationLevel || "N/A"})`);
  }

  // 2. Course / Stream (Weight: 10)
  const courseWeight = 10;
  const isCourseMatch = 
    scholarship.course === "All Courses" || 
    scholarship.course?.toLowerCase() === profile.course?.toLowerCase() ||
    (scholarship.course === "Engineering" && (profile.course === "Engineering" || profile.course === "B.Tech" || profile.course === "B.E"));

  if (isCourseMatch) {
    earnedScore += courseWeight;
    matchedCriteria.push(`Course Stream: ${profile.course || "All Courses"}`);
  } else {
    unmetCriteria.push(`Course stream must be ${scholarship.course}`);
  }

  // 3. Academic Score / CGPA (Weight: 20)
  const cgpaWeight = 20;
  const studentCgpa = parseFloat(profile.cgpa) || 0;
  const reqCgpa = parseFloat(scholarship.minCgpa) || 0;

  if (studentCgpa >= reqCgpa) {
    earnedScore += cgpaWeight;
    matchedCriteria.push(`CGPA / Score: ${studentCgpa} (Req: >= ${reqCgpa})`);
  } else if (reqCgpa - studentCgpa <= 1.0) {
    // Partial score for near miss in CGPA
    const ratio = Math.max(0, 1 - (reqCgpa - studentCgpa));
    earnedScore += Math.round(cgpaWeight * ratio * 0.75);
    nearMisses.push(`CGPA is ${studentCgpa} (Slightly below ${reqCgpa} requirement)`);
    unmetCriteria.push(`Minimum CGPA required is ${reqCgpa}`);
  } else {
    unmetCriteria.push(`Minimum CGPA required is ${reqCgpa} (Your CGPA: ${studentCgpa})`);
  }

  // 4. Annual Family Income Limit (Weight: 20)
  const incomeWeight = 20;
  const studentIncome = parseFloat(profile.annualIncome) || 0;
  const reqMaxIncome = parseFloat(scholarship.maxIncome) || 999999999;

  if (studentIncome <= reqMaxIncome) {
    earnedScore += incomeWeight;
    const formattedIncome = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(reqMaxIncome);
    matchedCriteria.push(`Income Limit: Under ${formattedIncome}`);
  } else if (studentIncome <= reqMaxIncome * 1.25) {
    const ratio = 1 - ((studentIncome - reqMaxIncome) / (reqMaxIncome * 0.25));
    earnedScore += Math.round(incomeWeight * ratio * 0.5);
    nearMisses.push(`Family income (₹${studentIncome.toLocaleString()}) slightly exceeds ₹${reqMaxIncome.toLocaleString()} limit`);
    unmetCriteria.push(`Family income cap is ₹${reqMaxIncome.toLocaleString()}`);
  } else {
    unmetCriteria.push(`Family income must be below ₹${reqMaxIncome.toLocaleString()}`);
  }

  // 5. Social Category (Weight: 15)
  const catWeight = 15;
  const studentCat = profile.category || "General";
  const isCatMatch = 
    !scholarship.categoryEligible ||
    scholarship.categoryEligible.length === 0 ||
    scholarship.categoryEligible.includes("All") ||
    scholarship.categoryEligible.includes(studentCat);

  if (isCatMatch) {
    earnedScore += catWeight;
    matchedCriteria.push(`Category: ${studentCat}`);
  } else {
    unmetCriteria.push(`Eligible Categories: ${scholarship.categoryEligible?.join(", ")}`);
  }

  // 6. Gender Eligibility (Weight: 15)
  const genderWeight = 15;
  const studentGender = profile.gender || "All";
  const isGenderMatch = 
    scholarship.gender === "All" || 
    scholarship.gender === studentGender ||
    studentGender === "Other";

  if (isGenderMatch) {
    earnedScore += genderWeight;
    matchedCriteria.push(`Gender Criteria: ${scholarship.gender}`);
  } else {
    unmetCriteria.push(`Gender specific scholarship (${scholarship.gender} only)`);
  }

  // 7. State Eligibility Bonus / Penalty
  if (scholarship.state !== "All India" && profile.state) {
    if (scholarship.state.toLowerCase() === profile.state.toLowerCase()) {
      matchedCriteria.push(`State Domicile: ${profile.state}`);
    } else {
      earnedScore = Math.max(0, earnedScore - 15);
      unmetCriteria.push(`Requires ${scholarship.state} State Domicile`);
    }
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(earnedScore)));

  let status = "Ineligible";
  if (finalScore >= 85 && unmetCriteria.length === 0) {
    status = "Eligible";
  } else if (finalScore >= 65 || nearMisses.length > 0) {
    status = "Near Match";
  }

  // Human Readable Recommendation Rationale
  let rationale = "";
  if (status === "Eligible") {
    rationale = `High match! You satisfy all eligibility constraints (${matchedCriteria.slice(0, 3).join(", ")}).`;
  } else if (status === "Near Match") {
    rationale = `Close match (${finalScore}% score). Meets major parameters, but note: ${nearMisses[0] || unmetCriteria[0]}.`;
  } else {
    rationale = `Low match (${finalScore}% score). Key restrictions missing: ${unmetCriteria[0] || "Multiple criteria unfulfilled"}.`;
  }

  return {
    score: finalScore,
    status,
    matchedCriteria,
    unmetCriteria,
    nearMisses,
    rationale
  };
}

/**
 * Filter & Sort Scholarships based on search parameters and profile
 */
export function getRecommendedScholarships(scholarships, profile, filters = {}) {
  return scholarships
    .map(sch => {
      const matchDetails = calculateEligibility(profile, sch);
      return {
        ...sch,
        matchScore: matchDetails.score,
        matchStatus: matchDetails.status,
        matchRationale: matchDetails.rationale,
        matchedCriteria: matchDetails.matchedCriteria,
        unmetCriteria: matchDetails.unmetCriteria
      };
    })
    .filter(sch => {
      // Search term
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const nameMatch = sch.name.toLowerCase().includes(q);
        const providerMatch = sch.provider.toLowerCase().includes(q);
        const tagsMatch = sch.tags?.some(t => t.toLowerCase().includes(q));
        if (!nameMatch && !providerMatch && !tagsMatch) return false;
      }
      // Education level
      if (filters.educationLevel && filters.educationLevel !== "All") {
        if (sch.educationLevel !== "All Levels" && sch.educationLevel !== filters.educationLevel) {
          return false;
        }
      }
      // State
      if (filters.state && filters.state !== "All States") {
        if (sch.state !== "All India" && sch.state !== filters.state) return false;
      }
      // Category
      if (filters.category && filters.category !== "All Categories") {
        if (sch.category !== filters.category) return false;
      }
      // Gender
      if (filters.gender && filters.gender !== "All") {
        if (sch.gender !== "All" && sch.gender !== filters.gender) return false;
      }
      // Max Income limit filter
      if (filters.maxIncome) {
        if (sch.maxIncome < parseFloat(filters.maxIncome)) return false;
      }
      // CGPA filter
      if (filters.minCgpa) {
        if (sch.minCgpa > parseFloat(filters.minCgpa)) return false;
      }
      // Minimum Match Score Filter
      if (filters.minMatchScore) {
        if (sch.matchScore < parseInt(filters.minMatchScore, 10)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "amountHigh") return b.amountValue - a.amountValue;
      if (filters.sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      if (filters.sortBy === "cgpa") return a.minCgpa - b.minCgpa;
      // Default: match score descending
      return b.matchScore - a.matchScore;
    });
}
