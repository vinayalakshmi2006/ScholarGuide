import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Heart, ExternalLink, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <GraduationCap size={28} className="text-primary" />
              <span>SmartScholar</span>
            </div>
            <p className="footer-description">
              An intelligent scholarship discovery and eligibility recommendation system. Designed to empower students across India with financial opportunities tailored to their academic profile.
            </p>
            <div className="footer-badges">
              <span className="badge-pill">B.Tech Major Project</span>
              <span className="badge-pill alt">Vite + React + Firebase</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/scholarships">Browse All Scholarships</Link></li>
              <li><Link to="/eligibility">Eligibility Matcher</Link></li>
              <li><Link to="/recommendations">Recommended for You</Link></li>
              <li><Link to="/saved">Saved Scholarships</Link></li>
              <li><Link to="/tracker">Application Tracker</Link></li>
              <li><Link to="/about">System Methodology</Link></li>
            </ul>
          </div>

          {/* Govt & National Portals */}
          <div className="footer-col">
            <h4 className="footer-heading">Official Portals</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://scholarships.gov.in/" target="_blank" rel="noreferrer">
                  National Scholarship Portal (NSP) <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.aicte-india.org/" target="_blank" rel="noreferrer">
                  AICTE Pragati & Saksham <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://mahadbt.maharashtra.gov.in/" target="_blank" rel="noreferrer">
                  MahaDBT State Portal <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://ssp.postmatric.karnataka.gov.in/" target="_blank" rel="noreferrer">
                  Karnataka SSP Portal <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact Support</h4>
            <ul className="footer-contact-list">
              <li>
                <Mail size={16} />
                <span>support@smartscholar.edu</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+91 (022) 2800-SCHOLAR</span>
              </li>
              <li>
                <MapPin size={16} />
                <span>Department of Computer Engineering, B.Tech Campus</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p>© 2026 SmartScholar. All rights reserved.</p>
          <p className="flex-align-center gap-1">
            Built with <Heart size={14} className="text-danger" /> for B.Tech Project Demonstration
          </p>
        </div>
      </div>
    </footer>
  );
}
