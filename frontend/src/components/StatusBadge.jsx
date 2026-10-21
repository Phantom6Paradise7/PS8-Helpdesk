import '../styles/StatusBadge.css';

const StatusBadge = ({ status, isPriority = false }) => {
  const current = status || 'Open';
  const formattedClass = current.toLowerCase().replace(/\s+/g, '-');

  if (isPriority) {
    return (
      <span className={`priority-badge priority-${formattedClass}`}>
        <span className="priority-dot"></span>
        {current}
      </span>
    );
  }

  return (
    <span className={`status-badge badge-${formattedClass}`}>
      {current.toUpperCase()}
    </span>
  );
};

export default StatusBadge;