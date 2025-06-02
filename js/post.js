// Post page JavaScript for Ishant Webworks Blog

document.addEventListener('DOMContentLoaded', function() {
  // Load post data
  loadPostData();
  
  // Initialize post functionality
  initPostFunctionality();
});

// Load post data
function loadPostData() {
  // Get post ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  if (!postId) {
    showError('Post not found. Please try another article.');
    return;
  }
  
  // Fetch blog data
  fetch('../data/blog-data.json')
    .then(response => response.json())
    .then(data => {
      // Find post by ID
      const post = data.posts.find(p => p.id.toString() === postId);
      
      if (!post) {
        showError('Post not found. Please try another article.');
        return;
      }
      
      // Update page title and meta tags
      updateMetaTags(post);
      
      // Render post
      renderPost(post);
      
      // Load related posts
      loadRelatedPosts(data.posts, post);
      
      // Load more articles
      loadMoreArticles(data.posts, post);
    })
    .catch(error => {
      console.error('Error loading post data:', error);
      showError('Failed to load post. Please try again later.');
    });
}

// Update meta tags for SEO
function updateMetaTags(post) {
  // Update title
  document.title = `${post.title} | Ishant Webworks Blogs`;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  metaDescription.setAttribute('content', post.excerpt);
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  
  if (ogTitle) ogTitle.setAttribute('content', post.title);
  if (ogDescription) ogDescription.setAttribute('content', post.excerpt);
  if (ogUrl) ogUrl.setAttribute('content', window.location.href);
  
  // Add Open Graph image if not present
  let ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) {
    ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    document.head.appendChild(ogImage);
  }
  ogImage.setAttribute('content', post.image);
}

// Render post content
function renderPost(post) {
  // Render post header
  const postHeader = document.getElementById('post-header');
  postHeader.innerHTML = `
    <div class="post-header-content">
      <span class="post-category">${post.category}</span>
      <h1>${post.title}</h1>
      <div class="post-header-meta">
        <div class="post-author">
          <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
          <div>
            <span class="author-name">${post.author.name}</span>
          </div>
        </div>
        <div class="post-date">
          <i class="fas fa-calendar-alt"></i>
          <span>${formatDate(post.date)}</span>
        </div>
        <div class="post-read-time">
          <i class="fas fa-clock"></i>
          <span>${calculateReadTime(post.content)} min read</span>
        </div>
      </div>
    </div>
  `;
  
  // Render post main content
  const postMain = document.getElementById('post-main');
  postMain.innerHTML = `
    <img src="${post.image}" alt="${post.title}" class="post-image">
    <div class="post-content-body">
      ${renderMarkdownToHtml(post.content)}
    </div>
    <div class="post-tags">
      ${post.tags.map(tag => `<a href="index.html#blog" class="post-tag">${tag}</a>`).join('')}
    </div>
    <div class="post-navigation">
      ${post.prevPost ? `
        <div class="post-nav-item post-nav-prev">
          <div class="post-nav-label">Previous Post</div>
          <a href="post.html?id=${post.prevPost.id}" class="post-nav-title">${post.prevPost.title}</a>
        </div>
      ` : '<div></div>'}
      ${post.nextPost ? `
        <div class="post-nav-item post-nav-next">
          <div class="post-nav-label">Next Post</div>
          <a href="post.html?id=${post.nextPost.id}" class="post-nav-title">${post.nextPost.title}</a>
        </div>
      ` : '<div></div>'}
    </div>
  `;
  
  // Render author info
  const authorImage = document.getElementById('author-image');
  authorImage.innerHTML = `<img src="${post.author.avatar}" alt="${post.author.name}">`;
  
  const authorInfo = document.getElementById('author-info');
  authorInfo.innerHTML = `
    <h3>${post.author.name}</h3>
    <p>${post.author.bio || 'Author at Ishant Webworks Blogs'}</p>
    <div class="author-social">
      ${post.author.twitter ? `<a href="${post.author.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
      ${post.author.linkedin ? `<a href="${post.author.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
      ${post.author.github ? `<a href="${post.author.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
    </div>
  `;
}

// Load related posts
function loadRelatedPosts(posts, currentPost) {
  const relatedPostsContainer = document.getElementById('related-posts');
  
  // Find posts with same category or tags
  const relatedPosts = posts.filter(post => {
    if (post.id === currentPost.id) return false;
    
    return post.category === currentPost.category || 
           post.tags.some(tag => currentPost.tags.includes(tag));
  }).slice(0, 3);
  
  if (relatedPosts.length === 0) {
    relatedPostsContainer.innerHTML = '<p class="no-posts">No related posts found.</p>';
    return;
  }
  
  relatedPostsContainer.innerHTML = relatedPosts.map(post => `
    <div class="related-post">
      <div class="related-post-image">
        <img src="${post.image}" alt="${post.title}">
      </div>
      <div class="related-post-info">
        <a href="post.html?id=${post.id}" class="related-post-title">${post.title}</a>
        <div class="related-post-date">${formatDate(post.date)}</div>
      </div>
    </div>
  `).join('');
}

// Load more articles
function loadMoreArticles(posts, currentPost) {
  const moreArticlesContainer = document.getElementById('more-articles');
  
  // Get random posts excluding current post
  const randomPosts = posts
    .filter(post => post.id !== currentPost.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  if (randomPosts.length === 0) {
    moreArticlesContainer.innerHTML = '<p class="no-posts">No more articles found.</p>';
    return;
  }
  
  moreArticlesContainer.innerHTML = randomPosts.map(post => `
    <article class="post-card glass-card">
      <div class="zoom-effect">
        <img src="${post.image}" alt="${post.title}" class="post-image">
      </div>
      <div class="post-content">
        <span class="post-category">${post.category}</span>
        <h3 class="post-title">
          <a href="post.html?id=${post.id}">${post.title}</a>
        </h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-meta">
          <div class="post-author">
            <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
            <span>${post.author.name}</span>
          </div>
          <div class="post-date">
            <i class="fas fa-calendar-alt"></i>
            <span>${formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

// Initialize post functionality
function initPostFunctionality() {
  // Share buttons
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const postUrl = window.location.href;
      const postTitle = document.title;
      
      if (button.classList.contains('facebook')) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
      } else if (button.classList.contains('twitter')) {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`, '_blank');
      } else if (button.classList.contains('linkedin')) {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
      } else if (button.classList.contains('copy')) {
        navigator.clipboard.writeText(postUrl)
          .then(() => {
            // Show toast notification
            showToast('Link copied to clipboard!', 'success');
          })
          .catch(err => {
            console.error('Failed to copy link:', err);
            showToast('Failed to copy link.', 'error');
          });
      }
    });
  });
  
  // Comment form
  const commentForm = document.getElementById('comment-form');
  
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const commentData = {
        name: this.querySelector('#comment-name').value,
        email: this.querySelector('#comment-email').value,
        content: this.querySelector('#comment-content').value,
        date: new Date().toISOString()
      };
      
      // Simulate comment submission
      const commentsList = document.getElementById('comments-list');
      const noComments = commentsList.querySelector('.no-comments');
      
      if (noComments) {
        noComments.remove();
      }
      
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      commentElement.innerHTML = `
        <div class="comment-avatar">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(commentData.name)}&background=random" alt="${commentData.name}">
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${commentData.name}</span>
            <span class="comment-date">Just now</span>
          </div>
          <div class="comment-body">
            <p>${commentData.content}</p>
          </div>
        </div>
      `;
      
      commentsList.appendChild(commentElement);
      
      // Reset form
      this.reset();
      
      // Show toast notification
      showToast('Comment posted successfully!', 'success');
    });
  }
  
  // Newsletter form
  const sidebarNewsletterForm = document.getElementById('sidebar-newsletter-form');
  
  if (sidebarNewsletterForm) {
    sidebarNewsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      
      // Simulate form submission
      this.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
      
      // Log for testing
      console.log('Newsletter subscription:', email);
    });
  }
}

// Helper function: Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
}

// Helper function: Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime < 1 ? 1 : readTime;
}

// Helper function: Convert markdown to HTML (simple version)
function renderMarkdownToHtml(markdown) {
  // This is a simplified markdown parser
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/<\/li>\n<li>/g, '</li><li>');
  html = html.replace(/<\/li>\n\n<li>/g, '</li></ul>\n\n<ul><li>');
  html = html.replace(/^\<li\>/gm, '<ul><li>');
  html = html.replace(/\<\/li\>$/gm, '</li></ul>');
  
  // Blockquotes
  html = html.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>');
  
  // Code blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)\n```/g, function(match, language, code) {
    return `
      <div class="code-header">
        <span class="code-language">${language || 'code'}</span>
        <button class="code-copy">Copy</button>
      </div>
      <pre class="code-block"><code>${code}</code></pre>
    `;
  });
  
  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="post-content-image">');
  
  // Paragraphs
  html = html.replace(/^\s*(\n)?(.+)/gm, function(match, newline, content) {
    return /\<(\/?h[1-6]|\/?(ul|ol|li|blockquote|pre|img))/i.test(content) ? content : '<p>' + content + '</p>';
  });
  
  // Clean up extra paragraph tags
  html = html.replace(/<p><\/p>/g, '');
  
  return html;
}

// Helper function: Show toast notification
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  // Set toast content and type
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 3000);
}

// Helper function: Show error message
function showError(message) {
  const postHeader = document.getElementById('post-header');
  const postMain = document.getElementById('post-main');
  const relatedPosts = document.getElementById('related-posts');
  const moreArticles = document.getElementById('more-articles');
  
  // Display error message
  postHeader.innerHTML = `
    <div class="post-header-content">
      <h1>Oops! Something went wrong</h1>
    </div>
  `;
  
  postMain.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
      <a href="index.html" class="btn btn-primary">Go to Homepage</a>
    </div>
  `;
  
  // Hide related sections
  relatedPosts.parentElement.style.display = 'none';
  moreArticles.parentElement.style.display = 'none';
  document.querySelector('.post-comments').style.display = 'none';
}