import { useState, useEffect } from 'react';
import '../styles/DepartmentForm.css';
const DepartmentForm = ({ initialData, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="dept-form-container" onSubmit={handleSubmit}>
      <h2 className="dept-form-title">
        {isEdit ? 'Edit department' : 'New department'}
      </h2>

      <div className="dept-form-group">
        <label className="dept-form-label">NAME</label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Billing Team" 
          required 
        />
      </div>

      <div className="dept-form-group">
        <label className="dept-form-label">DESCRIPTION</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What does this team handle?" 
          rows="4" 
          required
        ></textarea>
      </div>

      <div className="dept-form-actions">
        <button type="submit" className="btn-primary">
          {isEdit ? 'SAVE CHANGES' : 'ADD DEPARTMENT'}
        </button>
        {isEdit && (
          <button type="button" className="btn-outline" onClick={onCancel}>
            CANCEL
          </button>
        )}
      </div>

      {isEdit && (
        <p className="dept-form-footer">
          Pick Edit on any row to load it here. Cancel returns this card to New department.
        </p>
      )}
    </form>
  );
};

export default DepartmentForm;