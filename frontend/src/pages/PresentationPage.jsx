import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PresentationPage.css';

const PresentationPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    {
      id: 1,
      badge: 'SMART INDIA HACKATHON · PS8',
      title: 'Intelligent Complaint & Helpdesk Ticket System',
      subtitle: 'A Modern, Transparent, and SLA-Enforced Incident Management Platform',
      content: (
        <div className="ppt-slide-hero">
          <div className="ppt-hero-card">
            <span className="ppt-card-tag">PROBLEM CODE: PS8</span>
            <h2 className="ppt-hero-h2">Helpdesk.</h2>
            <p className="ppt-hero-lead">
              Transforming organizational grievance redressal with automated department triage, conversational audit trails, and strict SLA compliance.
            </p>
            <div className="ppt-meta-grid">
              <div className="ppt-meta-item">
                <span className="ppt-meta-lbl">TARGET SECTOR</span>
                <span className="ppt-meta-val">Citizen Grievance / Enterprise ITSM</span>
              </div>
              <div className="ppt-meta-item">
                <span className="ppt-meta-lbl">TECH STACK</span>
                <span className="ppt-meta-val">MERN (MongoDB, Express, React, Node)</span>
              </div>
              <div className="ppt-meta-item">
                <span className="ppt-meta-lbl">DEPLOYMENT</span>
                <span className="ppt-meta-val">Vercel (Frontend) · Render (Backend)</span>
              </div>
              <div className="ppt-meta-item">
                <span className="ppt-meta-lbl">TEAM ID</span>
                <span className="ppt-meta-val">PS8-Alpha Builders</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      badge: 'PROBLEM DEFINITION',
      title: 'The Challenge & Ground Realities',
      subtitle: 'Critical bottlenecks plaguing modern public and private helpdesk ecosystems',
      content: (
        <div className="ppt-grid-3">
          <div className="ppt-card">
            <div className="ppt-icon-pill">01</div>
            <h3 className="ppt-card-h3">Opaque Ticket Lifecycles</h3>
            <p className="ppt-card-p">
              Users submit complaints into a black box with zero visibility into who is handling their issue, resulting in repeated follow-ups and high anxiety.
            </p>
          </div>
          <div className="ppt-card">
            <div className="ppt-icon-pill">02</div>
            <h3 className="ppt-card-h3">Uncontrolled SLA Breaches</h3>
            <p className="ppt-card-p">
              Without automated overdue trackers, critical high-priority tickets linger unresolved for days without escalation or administrative alerts.
            </p>
          </div>
          <div className="ppt-card">
            <div className="ppt-icon-pill">03</div>
            <h3 className="ppt-card-h3">Departmental Silos</h3>
            <p className="ppt-card-p">
              Misrouted tickets get bounced across disjointed teams, lacking unified conversation history or single-source-of-truth ownership.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: 'PROPOSED SOLUTION',
      title: 'Our Architectural Solution',
      subtitle: 'A full-stack, state-machine driven support hub designed for absolute clarity',
      content: (
        <div className="ppt-grid-2">
          <div className="ppt-card highlight-border">
            <h3 className="ppt-card-h3">Strict Lifecycle State-Machine</h3>
            <p className="ppt-card-p">
              Enforced transitions (Open → In Progress → Resolved → Closed) eliminate ambiguous states. Resolved tickets feature a guarded single-click reopen mechanism to prevent customer deadlock while preventing spam.
            </p>
            <div className="ppt-badge-row">
              <span className="status-badge badge-open">OPEN</span>
              <span className="ppt-arrow">→</span>
              <span className="status-badge badge-in-progress">IN PROGRESS</span>
              <span className="ppt-arrow">→</span>
              <span className="status-badge badge-resolved">RESOLVED</span>
              <span className="ppt-arrow">→</span>
              <span className="status-badge badge-closed">CLOSED</span>
            </div>
          </div>
          <div className="ppt-card highlight-border">
            <h3 className="ppt-card-h3">Real-time Conversational Threads</h3>
            <p className="ppt-card-p">
              Bidirectional comment threads directly on tickets allow customers and assigned support staff to exchange updates, screenshot links, and clarification notes in a clear chronological timeline.
            </p>
            <div className="ppt-highlight-box">
              <span className="ppt-h-label">OVERDUE INTELLIGENCE</span>
              <p className="ppt-h-desc">Automatic 24-hour SLA calculation triggers visual OVERDUE alert badges on high-priority unattended incidents.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      badge: 'SYSTEM ARCHITECTURE',
      title: 'Technical Workflow & Architecture',
      subtitle: 'Decoupled, scalable MERN stack with RESTful API contracts',
      content: (
        <div className="ppt-arch-diagram">
          <div className="ppt-arch-step">
            <span className="arch-step-tag">CLIENT LAYER</span>
            <h4>React 18 + Vite</h4>
            <p>Component-driven SPA, Neo-Brutalist CSS tokens, responsive dark & light themes</p>
          </div>
          <div className="ppt-arch-connector">⇄ REST / JWT ⇄</div>
          <div className="ppt-arch-step">
            <span className="arch-step-tag">BACKEND API</span>
            <h4>Node.js + Express</h4>
            <p>JWT Authentication, RBAC middleware, centralized error handling, ticket state guards</p>
          </div>
          <div className="ppt-arch-connector">⇄ Mongoose ⇄</div>
          <div className="ppt-arch-step">
            <span className="arch-step-tag">DATA LAYER</span>
            <h4>MongoDB Atlas</h4>
            <p>Schema models for Users, Tickets, Departments & Comments with fast aggregations</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      badge: 'ROLE-BASED WORKFLOWS',
      title: 'Role-Based Access Control (RBAC)',
      subtitle: 'Tailored portals built specifically for each stakeholder',
      content: (
        <div className="ppt-grid-3">
          <div className="ppt-card">
            <span className="ppt-role-badge">CUSTOMER</span>
            <h3 className="ppt-card-h3">Filing & Tracking</h3>
            <ul className="ppt-list">
              <li>Lodge tickets with category, priority & screenshot</li>
              <li>Filter tickets by state (Open, In Progress, Closed)</li>
              <li>Participate in interactive ticket chat</li>
              <li>Edit/Delete open tickets before work begins</li>
              <li>One-time reopen guard if issue persists</li>
            </ul>
          </div>
          <div className="ppt-card">
            <span className="ppt-role-badge">SUPPORT AGENT</span>
            <h3 className="ppt-card-h3">Resolution & Triage</h3>
            <ul className="ppt-list">
              <li>View tickets assigned to their department</li>
              <li>Post public replies and customer updates</li>
              <li>Advance ticket state towards resolution</li>
              <li>Monitor overdue alerts for fast SLA adherence</li>
            </ul>
          </div>
          <div className="ppt-card">
            <span className="ppt-role-badge">ADMINISTRATOR</span>
            <h3 className="ppt-card-h3">Governance & Analytics</h3>
            <ul className="ppt-list">
              <li>Manage departments (Billing, Tech, Support, Eng)</li>
              <li>Track open ticket capacity per department</li>
              <li>Real-time day metrics (Avg resolution hours, Overdue)</li>
              <li>Priority and category distribution charts</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 6,
      badge: 'INNOVATION & USP',
      title: 'Core Differentiators & Highlights',
      subtitle: 'What makes this solution stand out from standard ticket tools',
      content: (
        <div className="ppt-grid-2">
          <div className="ppt-feature-box">
            <span className="ppt-f-num">01</span>
            <div>
              <h4>Dual Editorial Aesthetics (Dark & Light)</h4>
              <p>Curated typography using Fraunces serif and Plus Jakarta Sans with distinct solid offset shadows, providing extreme readability without cognitive fatigue.</p>
            </div>
          </div>
          <div className="ppt-feature-box">
            <span className="ppt-f-num">02</span>
            <div>
              <h4>Predictable SLA Engine</h4>
              <p>Dynamic backend aggregation identifies tickets exceeding 24h threshold without requiring costly external polling services.</p>
            </div>
          </div>
          <div className="ppt-feature-box">
            <span className="ppt-f-num">03</span>
            <div>
              <h4>Auto TKT-XXXX Sequence Generation</h4>
              <p>Human-friendly sequential identifiers for effortless telephone and in-person customer reference.</p>
            </div>
          </div>
          <div className="ppt-feature-box">
            <span className="ppt-f-num">04</span>
            <div>
              <h4>Guarded Reopen State Loop</h4>
              <p>Prevents infinite re-opening loops with an immutable counter while providing genuine consumer recourse.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      badge: 'IMPACT & BUSINESS VALUE',
      title: 'Measurable Outcomes & Feasibility',
      subtitle: 'High returns on resolution efficiency and customer satisfaction',
      content: (
        <div className="ppt-metrics-showcase">
          <div className="ppt-metric-stat">
            <span className="ppt-stat-num">65%</span>
            <span className="ppt-stat-label">Reduction in Triage Delay</span>
            <p>Automated departmental routing prevents inter-team email ping-pong.</p>
          </div>
          <div className="ppt-metric-stat">
            <span className="ppt-stat-num">6.2h</span>
            <span className="ppt-stat-label">Target Average Resolution</span>
            <p>Down from industry average of 48+ hours for general support inquiries.</p>
          </div>
          <div className="ppt-metric-stat">
            <span className="ppt-stat-num">100%</span>
            <span className="ppt-stat-label">Audit & SLA Compliance</span>
            <p>Every comment, state change, and department reassignment is timestamped.</p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      badge: 'FUTURE ROADMAP',
      title: 'Scalability & Future Expansions',
      subtitle: 'Next-generation features for enterprise & government deployment',
      content: (
        <div className="ppt-grid-3">
          <div className="ppt-card">
            <h3 className="ppt-card-h3">AI NLP Auto-Tagging</h3>
            <p className="ppt-card-p">
              Integrate Gemini AI LLM to analyze user descriptions upon submission to automatically assign category, priority, and department.
            </p>
          </div>
          <div className="ppt-card">
            <h3 className="ppt-card-h3">Omnichannel WhatsApp / SMS</h3>
            <p className="ppt-card-p">
              Enable rural and mobile-first citizens to lodge tickets and receive resolution notifications over WhatsApp and text messages.
            </p>
          </div>
          <div className="ppt-card">
            <h3 className="ppt-card-h3">Multi-Tenant Portals</h3>
            <p className="ppt-card-p">
              Partition departments into multiple ministries or subsidiary companies with single sign-on (SSO) and isolated databases.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      badge: 'CONCLUSION & DEMO',
      title: 'Conclusion & Live Demonstration',
      subtitle: 'Thank you for evaluating our Smart India Hackathon solution',
      content: (
        <div className="ppt-conclusion-card">
          <span className="pill-badge">HACKATHON DELIVERABLE COMPLETE</span>
          <h2 className="ppt-conc-h2">Ready for Live Evaluation</h2>
          <p className="ppt-conc-p">
            Explore the functional live prototype featuring user registration, ticket creation, real-time status management, and the executive analytics dashboard.
          </p>
          <div className="ppt-conc-actions">
            <Link to="/login" className="btn-primary">
              TRY LIVE DEMO
            </Link>
            <Link to="/tickets" className="btn-outline">
              VIEW TICKETS
            </Link>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className={`ppt-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="ppt-deck-header">
        <div className="ppt-deck-info">
          <span className="ppt-current-badge">{slide.badge}</span>
          <span className="ppt-counter">Slide {currentSlide + 1} of {slides.length}</span>
        </div>
        <div className="ppt-deck-controls">
          <button 
            className="btn-outline ppt-ctrl-btn" 
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
          </button>
          <Link to="/" className="btn-outline ppt-ctrl-btn">
            EXIT PPT
          </Link>
        </div>
      </div>

      <div className="ppt-slide-viewport">
        <div className="ppt-slide-content-box">
          <div className="ppt-slide-heading-block">
            <h1 className="ppt-slide-title">{slide.title}</h1>
            <p className="ppt-slide-sub">{slide.subtitle}</p>
          </div>

          <div className="ppt-slide-main-body">
            {slide.content}
          </div>
        </div>
      </div>

      <div className="ppt-deck-footer">
        <button 
          className="btn-outline ppt-nav-btn" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          ← PREVIOUS
        </button>

        <div className="ppt-dots-nav">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              className={`ppt-dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          className="btn-primary ppt-nav-btn" 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
};

export default PresentationPage;
