import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/departmentApi';
import '../styles/AdminDepartments.css';

const AdminDepartments = ({ user }) => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load departments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (dept) => {
    setEditingId(dept._id || dept.id);
    setFormData({ name: dept.name, description: dept.description });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDepartment(editingId, formData);
        setDepartments(prev => prev.map(d => (d._id === editingId || d.id === editingId) ? { ...d, ...formData } : d));
        handleCancelEdit();
      } else {
        const newDept = await createDepartment(formData);
        setDepartments(prev => [...prev, { ...newDept, openTickets: 0 }]);
        setFormData({ name: '', description: '' });
      }
    } catch (err) {
      alert('Failed to save department.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department? Tickets assigned to it will become Unassigned.')) {
      try {
        await deleteDepartment(id);
        setDepartments(prev => prev.filter(d => d._id !== id && d.id !== id));
        if (editingId === id) handleCancelEdit();
      } catch (err) {
        alert('Failed to delete department.');
      }
    }
  };

  return (
    <div className="dept-page-wrapper">
      <header className="dept-page-header">
        <span className="pill-badge">ADMIN · DEPARTMENTS</span>
        <h1 className="dept-page-title">Who handles what.</h1>
      </header>

      <div className="dept-two-col-grid">
        <div className="dept-form-box">
          <h2 className="dept-card-heading">
            {editingId ? 'Edit department' : 'New department'}
          </h2>

          <form onSubmit={handleSubmit} className="dept-actual-form">
            <div className="dept-input-group">
              <label className="dept-input-label">NAME</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Billing Team" 
                required 
              />
            </div>

            <div className="dept-input-group">
              <label className="dept-input-label">DESCRIPTION</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What does this team handle?" 
                rows="4" 
                required
              ></textarea>
            </div>

            <div className="dept-actions-row">
              <button type="submit" className="btn-primary dept-submit-btn">
                {editingId ? 'SAVE CHANGES' : 'ADD DEPARTMENT'}
              </button>
              {editingId && (
                <button type="button" className="btn-outline" onClick={handleCancelEdit}>
                  CANCEL
                </button>
              )}
            </div>

            {editingId && (
              <p className="dept-edit-helper">
                Pick Edit on any row to load it here. Cancel returns this card to New department.
              </p>
            )}
          </form>
        </div>

        <div className="dept-list-box">
          <h2 className="dept-card-heading">Departments</h2>

          {isLoading && <p className="dept-loading">Loading departments...</p>}
          {error && <p className="auth-error">{error}</p>}

          <div className="dept-items-list">
            {!isLoading && !error && departments.map(dept => {
              const id = dept._id || dept.id;
              const isEditing = editingId === id;

              return (
                <div className={`dept-row ${isEditing ? 'row-editing' : ''}`} key={id}>
                  <div className="dept-row-info">
                    <div className="dept-name-heading">{dept.name}</div>
                    <div className="dept-desc-text">{dept.description}</div>
                  </div>

                  <div className="dept-row-controls">
                    {isEditing ? (
                      <span className="status-badge badge-open">EDITING</span>
                    ) : (
                      <span className="status-badge badge-open">{dept.openTickets || 0} OPEN</span>
                    )}
                    <button className="btn-outline dept-action-pill" onClick={() => handleEditClick(dept)}>
                      EDIT
                    </button>
                    <button className="btn-outline dept-action-pill btn-danger-outline" onClick={() => handleDelete(id)}>
                      DELETE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDepartments;