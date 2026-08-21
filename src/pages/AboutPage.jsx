import React, { useState } from "react";
import { useScholarships } from "../context/ScholarshipContext";
import { 
  GraduationCap, Cpu, Layers, ShieldCheck, Mail, Phone, 
  MapPin, Send, HelpCircle, ChevronDown, CheckCircle2 
} from "lucide-react";

export default function AboutPage() {
  const { addToast } = useScholarships();

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [openFaq, setOpenFaq] = useState(0);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    addToast("Thank you! Your message has been sent to SmartScholar support.", "success");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const faqs = [
    {
      q: "How does the SmartScholar Eligibility Engine work?",
      a: "Our rule-based recommendation algorithm evaluates student profile inputs (CGPA, Education Level, Stream, Family Income, State Domicile, Gender, Social Category) against criteria parameters of registered scholarships using weighted score scoring to deliver a 0% to 100% match percentage."
    },
    {
      q: "Is SmartScholar free for students?",
      a: "Yes, 100% free. SmartScholar is developed to streamline access to central national portals (NSP), state DBTs, and private/corporate scholarships."
    },
    {
      q: "What does 'Near Match' mean?",
      a: "'Near Match' (70% - 99%) means you fulfill the primary criteria for the scholarship, but might be slightly below a secondary restriction (e.g. CGPA 7.8 vs 8.0 required, or income slightly over limit)."
    },
    {
      q: "Can I track my application status across multiple government portals?",
      a: "Yes! Use our Application Tracker page to save, update status ('Applied', 'Under Review', 'Selected'), and record application reference numbers in one central place."
    }
  ];

  return (
    <div className="about-page-container section-padding">
      {/* About Section Header */}
      <div className="about-hero text-center mb-5">
        <div className="brand-icon-wrapper mx-auto mb-3">
          <GraduationCap size={36} className="brand-icon text-primary" />
        </div>
        <h1 className="page-main-title">About SmartScholar</h1>
        <p className="page-main-subtitle max-w-2xl mx-auto">
          Scholarship Discovery & Eligibility Recommendation System built as a B.Tech Computer Engineering Major Project.
        </p>
      </div>

      {/* Engine Methodology */}
      <div className="methodology-card-box mb-5">
        <h2 className="section-title text-center mb-4">Rule-Based Match Engine Methodology</h2>
        <div className="weights-grid-3">
          <div className="weight-card">
            <div className="weight-val text-primary">20%</div>
            <h4 className="weight-title">Academic Score / CGPA</h4>
            <p className="weight-desc">Evaluates student CGPA against scholarship minimum cutoff with proportional near-miss scoring.</p>
          </div>
          <div className="weight-card">
            <div className="weight-val text-emerald">20%</div>
            <h4 className="weight-title">Annual Income Cap</h4>
            <p className="weight-desc">Checks family income threshold against economic limits (EBC/EWS/Means-based).</p>
          </div>
          <div className="weight-card">
            <div className="weight-val text-purple">20%</div>
            <h4 className="weight-title">Education Degree Level</h4>
            <p className="weight-desc">Validates High School, Diploma, B.Tech/UG, and Postgraduate level constraints.</p>
          </div>
          <div className="weight-card">
            <div className="weight-val text-amber">15%</div>
            <h4 className="weight-title">Social Category</h4>
            <p className="weight-desc">Matches General, OBC, SC, ST, and EWS quota requirements.</p>
          </div>
          <div className="weight-card">
            <div className="weight-val text-rose">15%</div>
            <h4 className="weight-title">Gender Criteria</h4>
            <p className="weight-desc">Applies gender-specific incentives (e.g. AICTE Pragati female engineering grants).</p>
          </div>
          <div className="weight-card">
            <div className="weight-val text-indigo">10%</div>
            <h4 className="weight-title">Course & State Stream</h4>
            <p className="weight-desc">Considers state domicile and special branch requirements (CS, Engineering, Medical).</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="faq-section mb-5">
        <h2 className="section-title text-center mb-4">Frequently Asked Questions</h2>
        <div className="faq-accordion-list max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`faq-item-card ${openFaq === idx ? "open" : ""}`}>
              <div className="faq-question flex-between" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <span className="font-semibold">{faq.q}</span>
                <ChevronDown size={18} className={`faq-arrow ${openFaq === idx ? "rotated" : ""}`} />
              </div>
              {openFaq === idx && (
                <div className="faq-answer text-muted">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-grid-2">
        <div className="contact-info-card">
          <h3 className="card-title mb-3">Get in Touch</h3>
          <p className="text-muted mb-4">
            Have questions about the SmartScholar system, scholarship listings, or project presentation details? Contact our development team.
          </p>

          <div className="contact-details-list">
            <div className="c-item flex-align-center gap-3">
              <Mail className="text-primary" size={20} />
              <div>
                <strong>Email Us:</strong>
                <div>support@smartscholar.edu</div>
              </div>
            </div>
            <div className="c-item flex-align-center gap-3">
              <Phone className="text-emerald" size={20} />
              <div>
                <strong>Call Support:</strong>
                <div>+91 (022) 2800-SCHOLAR</div>
              </div>
            </div>
            <div className="c-item flex-align-center gap-3">
              <MapPin className="text-amber" size={20} />
              <div>
                <strong>Location:</strong>
                <div>Department of Computer Engineering, B.Tech Campus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          <h3 className="card-title mb-3">Send a Message</h3>
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input 
                type="text" 
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Email</label>
              <input 
                type="email" 
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                required 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required 
                className="form-control"
              />
            </div>
            <button type="submit" className="btn-primary-block flex-align-center gap-2">
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
