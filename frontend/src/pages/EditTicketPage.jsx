import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import StatusBadge from '../components/StatusBadge';
import { getTicket, updateTicket } from '../api/ticketApi';
import '../styles/EditTicketPage.css';

const EditTicketPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const data = await getTicket(id);
        setTicketData(data);
      } catch (err) {
        setError('Failed to load ticket details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleUpdateTicket = async (formData) => {
    try {
      await updateTicket(id, formData);
      navigate(`/tickets/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update ticket');
    }
  };

  const handleCancel = () => {
    navigate(`/tickets/${id}`);
  };

  if (isLoading) {
    return (
      <div className="ticket-form-page-layout">
        <p className="loading-text">Loading ticket...</p>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="ticket-form-page-layout">
        <p className="auth-error">{error || 'Ticket not found'}</p>
      </div>
    );
  }

  return (
    <div className="ticket-form-page-layout">
      <div className="ticket-form-main-col">
        <header className="ticket-page-header">
          <span className="pill-badge">CUSTOMER · EDIT TICKET</span>
          <h1 className="ticket-page-title">Edit {ticketData.ticketId || 'TKT-1025'}.</h1>
        </header>

        <div className="ticket-form-card">
          <TicketForm 
            initialData={ticketData}
            onSubmit={handleUpdateTicket} 
            onCancel={handleCancel} 
            isEdit={true} 
          />
        </div>
      </div>

      <aside className="ticket-form-side-col">
        <div className="ticket-side-info-card">
          <span className="side-card-label">STATUS</span>
          <div className="edit-status-badge-wrap">
            <StatusBadge status={ticketData.status || 'OPEN'} />
          </div>
          <p className="side-card-description">
            You can edit or delete this ticket while it is Open. Once support starts work, it becomes read-only for you.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default EditTicketPage;