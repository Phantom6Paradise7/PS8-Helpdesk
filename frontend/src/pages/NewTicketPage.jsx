import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import { createTicket } from '../api/ticketApi';
import '../styles/NewTicketPage.css';

const NewTicketPage = ({ user }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleCreateTicket = async (formData) => {
    try {
      await createTicket(formData);
      const role = (user?.role || '').toLowerCase();
      if (role === 'admin' || role === 'support') {
        navigate('/admin/tickets');
      } else {
        navigate('/tickets');
      }
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    }
  };

  const handleCancel = () => {
    const role = (user?.role || '').toLowerCase();
    if (role === 'admin' || role === 'support') {
      navigate('/admin/tickets');
    } else {
      navigate('/tickets');
    }
  };

  return (
    <div className="ticket-form-page-layout">
      <div className="ticket-form-main-col">
        <header className="ticket-page-header">
          <span className="pill-badge">CUSTOMER · NEW TICKET</span>
          <h1 className="ticket-page-title">Raise a ticket.</h1>
        </header>

        {error && <div className="auth-error">{error}</div>}

        <div className="ticket-form-card">
          <TicketForm 
            onSubmit={handleCreateTicket} 
            onCancel={handleCancel} 
            isEdit={false} 
          />
        </div>
      </div>

      <aside className="ticket-form-side-col">
        <div className="ticket-side-info-card">
          <span className="side-card-label">YOUR TICKET ID</span>
          <div className="side-card-tktid">TKT-1025</div>
          <p className="side-card-description">
            Generated automatically. You can edit or delete the ticket while it is Open. Replies from support appear on the ticket page.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default NewTicketPage;