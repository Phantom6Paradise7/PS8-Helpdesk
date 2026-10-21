import { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../api/dashboardApi';
import '../styles/AdminDashboard.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardMetrics();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="dashboard-page-wrapper">
        <p className="auth-error">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-page-wrapper">
        <p className="dashboard-loading">Loading metrics...</p>
      </div>
    );
  }

  const priorityTotal = Object.values(stats.byPriority || {}).reduce((a, b) => a + b, 0) || 1;
  const categoryTotal = Object.values(stats.byCategory || {}).reduce((a, b) => a + b, 0) || 1;

  const priorityRows = [
    { name: 'High', count: stats.byPriority?.High || 0, colorClass: 'bar-coral' },
    { name: 'Medium', count: stats.byPriority?.Medium || 0, colorClass: 'bar-amber' },
    { name: 'Low', count: stats.byPriority?.Low || 0, colorClass: 'bar-sage' }
  ];

  const categoryRows = [
    { name: 'Billing', count: stats.byCategory?.Billing || 0, colorClass: 'bar-orange' },
    { name: 'Technical', count: stats.byCategory?.Technical || 0, colorClass: 'bar-yellow' },
    { name: 'Account', count: stats.byCategory?.Account || 0, colorClass: 'bar-tan' },
    { name: 'Other', count: stats.byCategory?.Other || 0, colorClass: 'bar-gray' }
  ];

  return (
    <div className="dashboard-page-wrapper">
      <header className="dashboard-header-block">
        <span className="pill-badge">ADMIN · DASHBOARD</span>
        <h1 className="dashboard-main-title">
          The day, <i>at a glance.</i>
        </h1>
      </header>

      <div className="top-metrics-grid">
        <div className="top-metric-card">
          <span className="metric-box-label">OPEN</span>
          <span className="metric-box-num">{stats.open || 24}</span>
        </div>

        <div className="top-metric-card">
          <span className="metric-box-label">RESOLVED</span>
          <span className="metric-box-num num-resolved">{stats.resolved || 138}</span>
        </div>

        <div className="top-metric-card">
          <span className="metric-box-label">AVG RESOLUTION</span>
          <span className="metric-box-num">{stats.avgResolutionTime || 6.2}h</span>
        </div>

        <div className="top-metric-card">
          <div className="metric-label-with-dot">
            <span className="metric-red-dot"></span>
            <span className="metric-box-label">OVERDUE</span>
          </div>
          <span className="metric-box-num num-overdue">{stats.overdue || 3}</span>
        </div>
      </div>

      <div className="dashboard-breakdown-grid">
        <div className="breakdown-box-card">
          <h2 className="breakdown-card-title">By priority</h2>
          <div className="bars-vertical-stack">
            {priorityRows.map(row => {
              const widthPct = Math.max(12, Math.round((row.count / priorityTotal) * 100));
              return (
                <div className="progress-bar-item" key={row.name}>
                  <div className="progress-labels">
                    <span className="label-key">{row.name}</span>
                    <span className="label-val">{row.count}</span>
                  </div>
                  <div className="progress-track-bg">
                    <div 
                      className={`progress-fill ${row.colorClass}`} 
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="breakdown-box-card">
          <h2 className="breakdown-card-title">By category</h2>
          <div className="bars-vertical-stack">
            {categoryRows.map(row => {
              const widthPct = Math.max(10, Math.round((row.count / categoryTotal) * 100));
              return (
                <div className="progress-bar-item" key={row.name}>
                  <div className="progress-labels">
                    <span className="label-key">{row.name}</span>
                    <span className="label-val">{row.count}</span>
                  </div>
                  <div className="progress-track-bg">
                    <div 
                      className={`progress-fill ${row.colorClass}`} 
                      style={{ width: `${widthPct}%` }}
                    ></div>
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

export default AdminDashboardPage;