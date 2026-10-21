import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { getUserTickets, deleteTicket, reopenTicket } from '../api/ticketApi';
import '../styles/TicketsPage.css';

const TicketsPage = ({ user }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const filters = ['ALL', 'OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED'];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getUserTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load tickets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      await deleteTicket(ticketToDelete._id || ticketToDelete.id);
      setTickets(prev => prev.filter(t => (t._id || t.id) !== (ticketToDelete._id || ticketToDelete.id)));
      setNotification(`Ticket ${ticketToDelete.ticketId || ''} deleted.`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      alert('Could not delete ticket.');
    } finally {
      setTicketToDelete(null);
    }
  };

  const handleReopen = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updated = await reopenTicket(id);
      setTickets(prev => prev.map(t => (t._id === id || t.id === id) ? updated : t));
      setNotification('Ticket reopened. It can only be reopened once.');
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      alert(err.message || 'Could not reopen ticket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === 'ALL') return true;
    return (ticket.status || 'OPEN').toUpperCase() === activeFilter;
  });

  return (
    <div className="tickets-page-wrapper">
      {notification && (
        <div className="notification-toast">
          <span className="notif-dot"></span> {notification}
        </div>
      )}

      {ticketToDelete && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <span className="modal-pill-tag">DELETE CONFIRMATION</span>
            <h3 className="modal-title">Delete ticket {ticketToDelete.ticketId}?</h3>
            <p className="modal-desc">This cannot be undone. Only Open tickets can be deleted.</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="btn-primary modal-delete-btn">DELETE</button>
              <button onClick={() => setTicketToDelete(null)} className="btn-outline">KEEP IT</button>
            </div>
          </div>
        </div>
      )}

      <div className="tickets-header-section">
        <div>
          <span className="pill-badge">CUSTOMER · MY TICKETS</span>
          <h1 className="tickets-title">My tickets.</h1>
        </div>
        <Link to="/tickets/new" className="btn-primary new-tkt-btn">
          + NEW TICKET
        </Link>
      </div>

      <div className="filter-pills-bar">
        {filters.map(filter => (
          <button
            key={filter}
            className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="tickets-card-container loading-container">
          <div className="loading-row"></div>
          <div className="loading-row"></div>
          <div className="loading-row"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="tickets-card-container error-card">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && filteredTickets.length === 0 && (
        <div className="tickets-card-container empty-state-box">
          <span className="empty-state-tag">EMPTY STATE</span>
          <h3 className="empty-title">No tickets yet.</h3>
          <p className="empty-sub">Anything bothering you? Tell us.</p>
          <Link to="/tickets/new" className="btn-primary">
            RAISE YOUR FIRST TICKET
          </Link>
        </div>
      )}

      {!isLoading && !error && filteredTickets.length > 0 && (
        <div className="tickets-card-container">
          {filteredTickets.map((ticket, index) => {
            const status = ticket.status || 'Open';
            const statusUpper = status.toUpperCase();
            const isOpen = statusUpper === 'OPEN';
            const isResolved = statusUpper === 'RESOLVED';
            const isInProgress = statusUpper === 'IN PROGRESS';
            const isClosed = statusUpper === 'CLOSED';

            return (
              <div 
                key={ticket._id || ticket.id || index} 
                className="ticket-row-item"
                onClick={() => navigate(`/tickets/${ticket._id || ticket.id}`)}
              >
                <div className="ticket-col-id">
                  {ticket.ticketId || 'TKT-1025'}
                </div>

                <div className="ticket-col-subject">
                  <div className="ticket-row-title">{ticket.title}</div>
                  <div className="ticket-row-category">{ticket.category || 'Account'}</div>
                </div>

                <div className="ticket-col-status">
                  <StatusBadge status={status} />
                </div>

                <div className="ticket-col-actions" onClick={e => e.stopPropagation()}>
                  {isOpen && (
                    <div className="row-btn-group">
                      <button
                        className="btn-outline row-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${ticket._id || ticket.id}/edit`);
                        }}
                      >
                        EDIT
                      </button>
                      <button
                        className="btn-outline row-btn btn-danger-outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTicketToDelete(ticket);
                        }}
                      >
                        DELETE
                      </button>
                    </div>
                  )}

                  {isInProgress && (
                    <span className="status-secondary-note">Support is on it</span>
                  )}

                  {isResolved && (
                    <button
                      className="btn-outline row-btn"
                      onClick={(e) => handleReopen(e, ticket._id || ticket.id)}
                    >
                      REOPEN ONCE
                    </button>
                  )}

                  {isClosed && (
                    <span className="status-secondary-note">Read-only</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;