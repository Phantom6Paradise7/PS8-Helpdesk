import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { getAllTickets } from '../api/ticketApi';
import '../styles/AdminTicketsPage.css';

const AdminTicketsPage = ({ user }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const statusFilters = ['ALL', 'OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED'];

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getAllTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOverdue = (ticket) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') return false;
    if (ticket.priority !== 'High') return false;
    const createdAt = new Date(ticket.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return Date.now() - createdAt > twentyFourHours;
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = activeFilter === 'ALL' || (ticket.status || 'OPEN').toUpperCase() === activeFilter;
    const priorityMatch = priorityFilter === 'ALL' || (ticket.priority || '').toLowerCase() === priorityFilter.toLowerCase();
    const categoryMatch = categoryFilter === 'ALL' || (ticket.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return statusMatch && priorityMatch && categoryMatch;
  });

  return (
    <div className="admin-tickets-wrapper">
      <header className="admin-tickets-header">
        <span className="pill-badge">ADMIN · ALL TICKETS</span>
        <h1 className="admin-page-title">Every ticket, handled.</h1>
        <p className="admin-page-sub">Filter, assign and resolve, all in one calm place.</p>
      </header>

      <div className="admin-controls-bar">
        <div className="admin-status-pills">
          {statusFilters.map(filter => (
            <button 
              key={filter}
              className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="admin-dropdown-filters">
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select-pill"
          >
            <option value="ALL">PRIORITY ▾</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select-pill"
          >
            <option value="ALL">CATEGORY ▾</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
            <option value="Account">Account</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="admin-table-card">
          <div className="admin-loading-row"></div>
          <div className="admin-loading-row"></div>
          <div className="admin-loading-row"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="admin-table-card">
          <p className="auth-error">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="admin-table-card">
          <table className="admin-datatable">
            <thead>
              <tr>
                <th className="th-ticket">TICKET</th>
                <th className="th-subject">SUBJECT</th>
                <th className="th-dept">DEPARTMENT</th>
                <th className="th-priority">PRIORITY</th>
                <th className="th-status">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, index) => {
                  const dept = ticket.assignedDepartment?.name || 'Support Desk';
                  const overdue = isOverdue(ticket);

                  return (
                    <tr 
                      key={ticket._id || ticket.id || index}
                      onClick={() => navigate(`/tickets/${ticket._id || ticket.id}`)}
                      className="admin-table-row"
                    >
                      <td className="admin-cell-id">
                        {ticket.ticketId || 'TKT-1024'}
                      </td>
                      <td className="admin-cell-subject">
                        <div className="subject-line">
                          <span className="subject-text">{ticket.title}</span>
                          {overdue && (
                            <span className="overdue-tag">OVERDUE</span>
                          )}
                        </div>
                        <span className="subject-sub-cat">{ticket.category}</span>
                      </td>
                      <td className="admin-cell-dept">
                        {dept}
                      </td>
                      <td className="admin-cell-priority">
                        <StatusBadge status={ticket.priority || 'Low'} isPriority={true} />
                      </td>
                      <td className="admin-cell-status">
                        <StatusBadge status={ticket.status || 'Open'} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="empty-table-cell">
                    No tickets match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTicketsPage;