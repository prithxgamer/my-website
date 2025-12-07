/* Discussions Manager - handles form submission and display */

const STORAGE_KEY = 'prithvi_discussions';
const LIKES_KEY = 'prithvi_likes';
const UNLIKES_KEY = 'prithvi_unlikes';
let allDiscussions = [];
let likedPosts = new Set();
let unlikedPosts = new Set();
let currentFilter = 'all';

// Load discussions from localStorage on page load
function loadDiscussions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  allDiscussions = stored ? JSON.parse(stored) : [];
  
  const likedStored = localStorage.getItem(LIKES_KEY);
  likedPosts = likedStored ? new Set(JSON.parse(likedStored)) : new Set();
  
  const unlikedStored = localStorage.getItem(UNLIKES_KEY);
  unlikedPosts = unlikedStored ? new Set(JSON.parse(unlikedStored)) : new Set();
}

// Save discussions to localStorage
function saveDiscussions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allDiscussions));
}

// Save liked posts to localStorage
function saveLikes() {
  localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(likedPosts)));
}

// Save unliked posts to localStorage
function saveUnlikes() {
  localStorage.setItem(UNLIKES_KEY, JSON.stringify(Array.from(unlikedPosts)));
}

// Create a new discussion post
function addDiscussion(category, name, message) {
  const discussion = {
    id: Date.now(),
    category: category,
    name: name || 'Anonymous',
    message: message,
    timestamp: new Date().toISOString(),
    likes: 0,
    unlikes: 0,
    replies: []
  };
  allDiscussions.unshift(discussion); // Add to front
  saveDiscussions();
  renderDiscussions();
}

// Format timestamp
function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

// Get category badge color
function getCategoryBadgeClass(category) {
  const map = {
    questions: 'badge-questions',
    comments: 'badge-comments',
    improvements: 'badge-improvements'
  };
  return map[category] || 'badge-default';
}

// Render discussions to DOM
function renderDiscussions() {
  const container = document.getElementById('discussionsList');
  
  // Filter discussions
  const filtered = currentFilter === 'all' 
    ? allDiscussions 
    : allDiscussions.filter(d => d.category === currentFilter);

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No posts in this category yet.</p>';
    return;
  }

  container.innerHTML = filtered.map(discussion => {
    const isLiked = likedPosts.has(discussion.id);
    const isUnliked = unlikedPosts.has(discussion.id);
    const likeButtonClass = isLiked ? 'like-btn liked' : 'like-btn';
    const unlikeButtonClass = isUnliked ? 'unlike-btn unliked' : 'unlike-btn';
    const likeEmoji = isLiked ? '👍' : '👍';
    const isQuestion = discussion.category === 'questions';
    const actionButtonLabel = isQuestion ? 'Answer' : 'Reply';
    const hasReplies = discussion.replies && discussion.replies.length > 0;
    const repliesCount = hasReplies ? discussion.replies.length : 0;
    const repliesHtml = hasReplies 
      ? `<div class="replies-section" id="replies-${discussion.id}" style="display:none;">
           ${discussion.replies.map(reply => `
             <div class="reply">
               <div class="reply-header">
                 <strong>${escapeHtml(reply.name)}</strong> • ${formatTime(reply.timestamp)}
               </div>
               <p class="reply-message">${escapeHtml(reply.message)}</p>
             </div>
           `).join('')}
         </div>`
      : '';
    
    return `
    <div class="discussion-post" data-id="${discussion.id}">
      <div class="post-header">
        <span class="badge ${getCategoryBadgeClass(discussion.category)}">
          ${discussion.category.charAt(0).toUpperCase() + discussion.category.slice(1)}
        </span>
        <span class="post-meta">
          <strong>${escapeHtml(discussion.name)}</strong> • ${formatTime(discussion.timestamp)}
        </span>
      </div>
      <p class="post-message">${escapeHtml(discussion.message)}</p>
      <div class="post-footer">
        <button class="${likeButtonClass}" data-id="${discussion.id}">
          👍 <span class="like-count">${discussion.likes}</span>
        </button>
        <button class="${unlikeButtonClass}" data-id="${discussion.id}">
          👎 <span class="unlike-count">${discussion.unlikes || 0}</span>
        </button>
        <button class="reply-toggle-btn" data-id="${discussion.id}">
          💬 ${actionButtonLabel}
        </button>
        ${hasReplies ? `<button class="replies-toggle-btn" data-id="${discussion.id}">
          📋 Replies (${repliesCount})
        </button>` : ''}
      </div>
      <div class="reply-form-container" id="reply-form-${discussion.id}" style="display:none;">
        <textarea class="reply-textarea" placeholder="Write your ${isQuestion ? 'answer' : 'reply'}..."></textarea>
        <input type="text" class="reply-name" placeholder="Your name (optional)">
        <div class="reply-form-buttons">
          <button class="reply-submit-btn" data-id="${discussion.id}">Send</button>
          <button class="reply-cancel-btn" data-id="${discussion.id}">Cancel</button>
        </div>
      </div>
      ${repliesHtml}
    </div>
  `;
  }).join('');

  // Attach event listeners to like buttons
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      toggleLike(id);
    });
  });

  // Attach event listeners to unlike buttons
  document.querySelectorAll('.unlike-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      toggleUnlike(id);
    });
  });

  // Attach event listeners to reply toggle buttons
  document.querySelectorAll('.reply-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const form = document.getElementById(`reply-form-${id}`);
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });
  });

  // Attach event listeners to reply submit buttons
  document.querySelectorAll('.reply-submit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const form = btn.closest('.reply-form-container');
      const message = form.querySelector('.reply-textarea').value.trim();
      const name = form.querySelector('.reply-name').value.trim();
      
      if (!message) {
        alert('Please write a reply.');
        return;
      }
      
      addReply(id, name, message);
    });
  });

  // Attach event listeners to reply cancel buttons
  document.querySelectorAll('.reply-cancel-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const form = document.getElementById(`reply-form-${id}`);
      form.style.display = 'none';
      form.querySelector('.reply-textarea').value = '';
      form.querySelector('.reply-name').value = '';
    });
  });

  // Attach event listeners to replies toggle buttons
  document.querySelectorAll('.replies-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const repliesSection = document.getElementById(`replies-${id}`);
      repliesSection.style.display = repliesSection.style.display === 'none' ? 'block' : 'none';
      btn.textContent = repliesSection.style.display === 'none' ? `📋 Replies (${btn.textContent.match(/\d+/)})` : `📋 Replies (${btn.textContent.match(/\d+/)}) ▼`;
    });
  });
}

// Toggle like on a discussion
function toggleLike(id) {
  const discussion = allDiscussions.find(d => d.id === id);
  if (!discussion) return;
  
  if (likedPosts.has(id)) {
    // Unlike - set to 0
    likedPosts.delete(id);
    discussion.likes = 0;
  } else {
    // Like - set to 1
    likedPosts.add(id);
    discussion.likes = 1;
  }
  
  saveDiscussions();
  saveLikes();
  renderDiscussions();
}

// Toggle unlike on a discussion
function toggleUnlike(id) {
  const discussion = allDiscussions.find(d => d.id === id);
  if (!discussion) return;
  
  if (unlikedPosts.has(id)) {
    // Remove unlike - set to 0
    unlikedPosts.delete(id);
    discussion.unlikes = 0;
  } else {
    // Add unlike - set to 1
    unlikedPosts.add(id);
    discussion.unlikes = 1;
  }
  
  saveDiscussions();
  saveUnlikes();
  renderDiscussions();
}

// Add a reply to a discussion
function addReply(discussionId, name, message) {
  const discussion = allDiscussions.find(d => d.id === discussionId);
  if (!discussion) return;
  
  if (!discussion.replies) {
    discussion.replies = [];
  }
  
  const reply = {
    id: Date.now(),
    name: name || 'Anonymous',
    message: message,
    timestamp: new Date().toISOString()
  };
  
  discussion.replies.push(reply);
  saveDiscussions();
  renderDiscussions();
}

// Sanitize HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadDiscussions();
  renderDiscussions();

  // Form submission
  const form = document.getElementById('discussionForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const category = document.getElementById('category').value;
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!category || !message) {
      alert('Please fill in category and message.');
      return;
    }

    if (message.length > 500) {
      alert('Message must be 500 characters or less.');
      return;
    }

    addDiscussion(category, name, message);
    form.reset();
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderDiscussions();
    });
  });
});
