import { useState } from 'react';
import '../styles/CommentSection.css';

const CommentSection = ({ comments, ticketStatus, onSendReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(replyText);
    setReplyText('');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="conversation-card">
      <h2 className="conversation-heading">Conversation</h2>
      
      <div className="conversation-feed">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => {
            const author = comment.author || {};
            const authorName = author.name || comment.authorName || 'User';
            const roleName = author.role ? (author.role.charAt(0).toUpperCase() + author.role.slice(1)) : 'Customer';
            const initials = getInitials(authorName);
            const timeStr = formatDate(comment.createdAt);

            return (
              <div className="chat-message-item" key={comment._id || index}>
                <div className="chat-avatar">{initials}</div>
                <div className="chat-body">
                  <div className="chat-meta">
                    <span className="chat-author-name">{authorName}</span>
                    <span className="chat-dot">·</span>
                    <span className="chat-role">{roleName}</span>
                    <span className="chat-dot">·</span>
                    <span className="chat-timestamp">{timeStr}</span>
                  </div>
                  <div className="chat-bubble">
                    {comment.text}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-comments-hint">No replies yet. Start the conversation below.</p>
        )}
      </div>

      {ticketStatus !== 'Closed' ? (
        <form className="reply-form" onSubmit={handleSubmit}>
          <label className="reply-label">REPLY</label>
          <textarea 
            placeholder="Write a reply" 
            rows="4" 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="btn-primary reply-send-btn">
            SEND REPLY
          </button>
        </form>
      ) : (
        <div className="closed-ticket-notice">
          This ticket is closed and read-only.
        </div>
      )}
    </div>
  );
};

export default CommentSection;