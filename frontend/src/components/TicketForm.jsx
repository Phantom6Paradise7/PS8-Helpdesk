import { useState, useEffect } from 'react';
import '../styles/TicketForm.css';

const TicketForm = ({ initialData, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Billing',
    screenshotUrl: '',
    priority: 'High',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Billing',
        screenshotUrl: initialData.screenshotUrl || '',
        priority: initialData.priority || 'Low',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrioritySelect = (level) => {
    setFormData((prev) => ({ ...prev, priority: level }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <div className="form-field-group">
        <label className="form-label-title">TITLE</label>
        <input 
          type="text" 
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Short summary of the problem"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="form-label-title">CATEGORY</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="Billing">Billing</option>
          <option value="Account">Account</option>
          <option value="Technical">Technical</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-field-group">
        <label className="form-label-title">SCREENSHOT URL (OPTIONAL)</label>
        <input 
          type="text" 
          name="screenshotUrl" 
          value={formData.screenshotUrl} 
          onChange={handleChange} 
          placeholder="https://"
        />
      </div>

      <div className="form-field-group">
        <label className="form-label-title">PRIORITY</label>
        <div className="priority-pill-selector">
          {['Low', 'Medium', 'High'].map((level) => {
            const isSelected = formData.priority.toLowerCase() === level.toLowerCase();
            return (
              <button
                key={level}
                type="button"
                className={`priority-select-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handlePrioritySelect(level)}
              >
                {level.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field-group">
        <label className="form-label-title">DESCRIPTION</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Tell us what happened"
          rows="5"
          required 
        />
      </div>

      <div className="form-actions-bar">
        <button type="submit" className="btn-primary">
          {isEdit ? 'SAVE CHANGES' : 'SUBMIT TICKET'}
        </button>
        <button type="button" className="btn-outline" onClick={onCancel}>
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default TicketForm;