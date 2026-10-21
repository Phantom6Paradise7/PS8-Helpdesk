import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import CommentSection from '../components/CommentSection';
import { getTicket, updateTicketStatus, assignDepartment, reopenTicket } from '../api/ticketApi';
import { getComments, addComment } from '../api/commentApi';
import { getDepartments } from '../api/departmentApi';
import '../styles/TicketDetailPage.css';

const TicketDetailPage = ({ user }) => {
  const { id } = useParams();
  const role = (user?.role || '').toLowerCase();
  const isStaff = role === 'admin' || role === 'support';

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ticketData, commentsData] = await Promise.all([
        getTicket(id),
        getComments(id)
      ]);
      setTicket(ticketData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
      if (isStaff) {
        const depts = await getDepartments();
        setDepartments(Array.isArray(depts) ? depts : []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load ticket details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async (text) => {
    try {
      const newComment = await addComment(id, { text });
      setComments(prev => [...prev, newComment]);
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const updated = await updateTicketStatus(id, newStatus);
      setTicket(updated);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAssignDept = async (e) => {
    const deptId = e.target.value;
    try {
      const updated = await assignDepartment(id, deptId);
      setTicket(updated);
    } catch (err) {
      alert(err.message || 'Failed to assign department');
    }
  };

  const handleReopen = async () => {
    try {
      const updated = await reopenTicket(id);
      setTicket(updated);
    } catch (err) {
      alert(err.message || 'Failed to reopen ticket');
    }
  };

  if (isLoading) {
    return (
      <div className="ticket-detail-page-wrapper">
        <p className="detail-loading-text">Loading ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="ticket-detail-page-wrapper">
        <p className="auth-error">{error || 'Ticket not found.'}</p>
      </div>
    );
  }

  const deptName = ticket.assignedDepartment?.name || 'Support Desk';
  const createdDateStr = new Date(ticket.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + ', ' + new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const statusList = ['Open', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="ticket-detail-page-wrapper">
      <div className="detail-main-flow">
        <header className="detail-header-block">
          <span className="pill-badge">CUSTOMER · TICKET</span>
          <div className="detail-heading-row">
            <h1 className="detail-ticket-id">{ticket.ticketId || 'TKT-1024'}.</h1>
            <div className="detail-badges-wrap">
              <StatusBadge status={ticket.status} />
              <span className={`status-badge badge-${(ticket.priority || 'high').toLowerCase()}`}>
                {(ticket.priority || 'HIGH').toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <div className="ticket-summary-card">
          <h2 className="summary-card-title">{ticket.title}</h2>
          <div className="summary-card-meta">
            <span>{ticket.category || 'Billing'}</span>
            <span>·</span>
            <span>{deptName}</span>
            <span>·</span>
            <span>Created {createdDateStr}</span>
          </div>
          <p className="summary-card-desc">
            {ticket.description}
          </p>
          {ticket.screenshotUrl && (
            <div className="screenshot-link-container">
              <a href={ticket.screenshotUrl} target="_blank" rel="noreferrer" className="screenshot-link">
                View Attached Screenshot ↗
              </a>
            </div>
          )}
        </div>

        <CommentSection
          comments={comments}
          ticketStatus={ticket.status}
          onSendReply={handleSendReply}
        />
      </div>

      <aside className="detail-sidebar-flow">
        <div className="sidebar-detail-card">
          <div className="sidebar-field-group">
            <span className="sidebar-group-label">STATUS</span>
            <div className="status-progress-track">
              {statusList.map(st => {
                const isActive = (ticket.status || '').toLowerCase() === st.toLowerCase();
                return (
                  <div key={st} className={`track-item ${isActive ? 'active' : ''}`}>
                    <span className="track-dot"></span>
                    <span className="track-name">{st}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sidebar-field-group">
            <span className="sidebar-group-label">DEPARTMENT</span>
            <span className="sidebar-info-val">{deptName}</span>
          </div>

          <div className="sidebar-field-group">
            <span className="sidebar-group-label">CREATED</span>
            <span className="sidebar-info-val">{createdDateStr}</span>
          </div>

          {ticket.status === 'Resolved' && (ticket.reopenCount || 0) < 1 && (
            <button onClick={handleReopen} className="btn-primary reopen-sidebar-btn">
              REOPEN TICKET
            </button>
          )}
        </div>

        {isStaff && (
          <div className="sidebar-detail-card">
            <span className="sidebar-group-label controls-label">SUPPORT CONTROLS</span>

            <div className="sidebar-control-input">
              <label className="sidebar-control-label">ASSIGN DEPARTMENT</label>
              <select
                value={ticket.assignedDepartment?._id || ''}
                onChange={handleAssignDept}
              >
                <option value="" disabled>Select Department</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="sidebar-control-input">
              <label className="sidebar-control-label">UPDATE STATUS</label>
              <select
                value={ticket.status}
                onChange={handleStatusChange}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default TicketDetailPage;