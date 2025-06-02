// Admin Panel JavaScript for Ishant Webworks Blog

document.addEventListener('DOMContentLoaded', function() {
  // Initialize admin navigation
  initAdminNavigation();
  
  // Initialize admin dashboard
  initDashboard();
  
  // Initialize posts management
  initPostsManagement();
  
  // Initialize categories management
  initCategoriesManagement();
  
  // Initialize authors management
  initAuthorsManagement();
  
  // Initialize settings management
  initSettingsManagement();
  
  // Initialize data import/export
  initDataManagement();
  
  // Load blog data
  loadBlogData();
});

// Global blog data object
let blogData = {
  posts: [],
  categories: [],
  authors: [],
  settings: {},
  activity: []
};

// Load blog data
function loadBlogData() {
  // Check if data exists in localStorage
  const savedData = localStorage.getItem('ishant_blog_data');
  
  if (savedData) {
    try {
      blogData = JSON.parse(savedData);
      updateUI();
      showToast('Blog data loaded from local storage.', 'info');
    } catch (error) {
      console.error('Error parsing saved data:', error);
      loadDefaultData();
    }
  } else {
    loadDefaultData();
  }
}

// Load default data
function loadDefaultData() {
  // Fetch default data
  fetch('../data/blog-data.json')
    .then(response => response.json())
    .then(data => {
      blogData = data;
      updateUI();
      saveBlogData();
      showToast('Default blog data loaded.', 'info');
    })
    .catch(error => {
      console.error('Error loading default data:', error);
      createDefaultData();
      showToast('Failed to load data. Created empty blog data.', 'error');
    });
}

// Create default empty data structure
function createDefaultData() {
  blogData = {
    posts: [],
    categories: [
      { id: 1, name: 'Web Development', slug: 'web-development' },
      { id: 2, name: 'Design', slug: 'design' },
      { id: 3, name: 'Technology', slug: 'technology' }
    ],
    authors: [
      {
        id: 1, 
        name: 'Admin',
        email: 'admin@ishantwebworks.com',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=random',
        bio: 'Administrator of Ishant Webworks Blogs'
      }
    ],
    settings: {
      blogTitle: 'Ishant Webworks Blogs',
      blogDescription: 'Discover insights, tutorials, and news about web development, design, and technology.',
      postsPerPage: 6,
      featuredPostsCount: 3,
      metaTitle: 'Ishant Webworks Blogs',
      metaDescription: 'Discover insights, tutorials, and news about web development, design, and technology.',
      metaKeywords: 'Ishant Webworks, blog, web development, design, technology',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      shopIntegration: {
        url: 'https://ishant.shop',
        description: 'Premium digital products, templates, and resources to elevate your online presence.',
        showPromo: true
      }
    },
    activity: []
  };
  
  updateUI();
}

// Save blog data to localStorage
function saveBlogData() {
  try {
    localStorage.setItem('ishant_blog_data', JSON.stringify(blogData));
  } catch (error) {
    console.error('Error saving blog data:', error);
    showToast('Failed to save blog data.', 'error');
  }
}

// Export blog data to JSON file
function exportBlogData() {
  const dataStr = JSON.stringify(blogData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const filename = `ishant-blog-data-${timestamp}.json`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('Blog data exported successfully!', 'success');
}

// Import blog data from JSON file
function importBlogData(file) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Validate imported data
      if (!importedData.posts || !importedData.categories || !importedData.authors) {
        throw new Error('Invalid blog data format.');
      }
      
      blogData = importedData;
      updateUI();
      saveBlogData();
      
      // Add activity
      addActivity('import', 'Imported blog data');
      
      showToast('Blog data imported successfully!', 'success');
    } catch (error) {
      console.error('Error importing blog data:', error);
      showToast('Failed to import blog data. Invalid format.', 'error');
    }
  };
  
  reader.onerror = function() {
    showToast('Failed to read file.', 'error');
  };
  
  reader.readAsText(file);
}

// Add activity to activity log
function addActivity(type, message) {
  const activity = {
    id: Date.now(),
    type: type,
    message: message,
    date: new Date().toISOString()
  };
  
  blogData.activity.unshift(activity);
  
  // Limit to 20 most recent activities
  if (blogData.activity.length > 20) {
    blogData.activity = blogData.activity.slice(0, 20);
  }
  
  saveBlogData();
  updateActivityList();
}

// Update all UI elements with current data
function updateUI() {
  updateDashboardStats();
  updateActivityList();
  updatePostsTable();
  updateCategoriesTable();
  updateAuthorsTable();
  updateFormSelects();
  updateSettingsForm();
}

// Initialize admin navigation
function initAdminNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sidebarToggle = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.admin-sidebar');
  const actionCards = document.querySelectorAll('.action-card');
  const previewSiteBtn = document.getElementById('preview-site');
  
  // Section navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      
      // Update active nav item
      navItems.forEach(navItem => navItem.classList.remove('active'));
      item.classList.add('active');
      
      // Show selected section
      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(sectionId).classList.add('active');
      
      // Close mobile sidebar if open
      if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
  });
  
  // Action cards navigation
  if (actionCards) {
    actionCards.forEach(card => {
      card.addEventListener('click', () => {
        const sectionId = card.getAttribute('data-section');
        
        if (sectionId) {
          // Update active nav item
          navItems.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('data-section') === sectionId) {
              navItem.classList.add('active');
            }
          });
          
          // Show selected section
          document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
          });
          document.getElementById(sectionId).classList.add('active');
        }
      });
    });
  }
  
  // Sidebar toggle for mobile
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && 
          !sidebar.contains(e.target) && 
          !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }
  
  // Preview site button
  if (previewSiteBtn) {
    previewSiteBtn.addEventListener('click', () => {
      window.open('../index.html', '_blank');
    });
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // In a real app, this would clear session
      window.location.href = '../index.html';
    });
  }
}

// Initialize dashboard
function initDashboard() {
  const exportDataDash = document.getElementById('export-data-dash');
  
  if (exportDataDash) {
    exportDataDash.addEventListener('click', exportBlogData);
  }
}

// Update dashboard stats
function updateDashboardStats() {
  // Update counts
  document.getElementById('total-posts').textContent = blogData.posts.length;
  document.getElementById('total-categories').textContent = blogData.categories.length;
  document.getElementById('total-authors').textContent = blogData.authors.length;
  
  // Calculate total views
  const totalViews = blogData.posts.reduce((sum, post) => sum + (post.views || 0), 0);
  document.getElementById('total-views').textContent = totalViews;
}

// Update activity list
function updateActivityList() {
  const activityList = document.getElementById('activity-list');
  
  if (!activityList) return;
  
  if (blogData.activity.length === 0) {
    activityList.innerHTML = '<div class="no-data-message">No recent activity.</div>';
    return;
  }
  
  activityList.innerHTML = blogData.activity.map(activity => {
    let iconClass = '';
    
    switch (activity.type) {
      case 'create':
        iconClass = 'create';
        break;
      case 'update':
        iconClass = 'update';
        break;
      case 'delete':
        iconClass = 'delete';
        break;
      default:
        iconClass = 'create';
    }
    
    return `
      <div class="activity-item">
        <div class="activity-icon ${iconClass}">
          <i class="fas fa-${activity.type === 'create' ? 'plus' : activity.type === 'update' ? 'pen' : activity.type === 'delete' ? 'trash' : 'sync'}"></i>
        </div>
        <div class="activity-details">
          <div class="activity-message">${activity.message}</div>
          <div class="activity-date">${formatDate(activity.date)}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Initialize posts management
function initPostsManagement() {
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');
  const postForm = document.getElementById('post-form');
  const savePostDraft = document.getElementById('save-draft');
  const publishPost = document.getElementById('publish-post');
  
  // Initialize text editor
  if (document.getElementById('post-content')) {
    const easyMDE = new EasyMDE({
      element: document.getElementById('post-content'),
      autofocus: false,
      spellChecker: false,
      status: ['lines', 'words', 'cursor'],
      toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'code', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview', 'side-by-side', 'fullscreen'],
      placeholder: 'Write your post content here...'
    });
    
    // Store editor instance globally
    window.postEditor = easyMDE;
  }
  
  // Featured image preview
  const featuredImageInput = document.getElementById('post-featured-image');
  const imagePreview = document.getElementById('image-preview');
  
  if (featuredImageInput && imagePreview) {
    featuredImageInput.addEventListener('input', () => {
      const imageUrl = featuredImageInput.value.trim();
      
      if (imageUrl) {
        imagePreview.innerHTML = `<img src="${imageUrl}" alt="Featured Image Preview">`;
      } else {
        imagePreview.innerHTML = 'Image preview will appear here';
      }
    });
  }
  
  // Title to slug conversion
  const postTitle = document.getElementById('post-title');
  const postSlug = document.getElementById('post-slug');
  
  if (postTitle && postSlug) {
    postTitle.addEventListener('input', () => {
      if (!postSlug.dataset.manuallyChanged) {
        postSlug.value = createSlug(postTitle.value);
      }
    });
    
    postSlug.addEventListener('input', () => {
      postSlug.dataset.manuallyChanged = 'true';
    });
  }
  
  // Category and status filters
  if (categoryFilter) {
    categoryFilter.addEventListener('change', updatePostsTable);
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', updatePostsTable);
  }
  
  // Save draft
  if (savePostDraft) {
    savePostDraft.addEventListener('click', () => {
      document.getElementById('post-status').value = 'draft';
      savePost();
    });
  }
  
  // Publish post
  if (publishPost) {
    publishPost.addEventListener('click', () => {
      document.getElementById('post-status').value = 'published';
      savePost();
    });
  }
  
  // Post form submission
  if (postForm) {
    postForm.addEventListener('submit', e => {
      e.preventDefault();
      savePost();
    });
  }
}

// Update posts table
function updatePostsTable() {
  const postsTableBody = document.getElementById('posts-table-body');
  const noPostsMessage = document.getElementById('no-posts-message');
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');
  
  if (!postsTableBody) return;
  
  // Apply filters
  let filteredPosts = [...blogData.posts];
  
  if (categoryFilter && categoryFilter.value) {
    filteredPosts = filteredPosts.filter(post => post.category === categoryFilter.value);
  }
  
  if (statusFilter && statusFilter.value) {
    filteredPosts = filteredPosts.filter(post => post.status === statusFilter.value);
  }
  
  // Sort by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (filteredPosts.length === 0) {
    postsTableBody.innerHTML = '';
    noPostsMessage.style.display = 'block';
    return;
  }
  
  noPostsMessage.style.display = 'none';
  
  postsTableBody.innerHTML = filteredPosts.map(post => {
    // Find author name
    const author = blogData.authors.find(author => author.id === post.author.id) || { name: 'Unknown' };
    
    return `
      <tr>
        <td>
          <div>
            <strong>${post.title}</strong>
          </div>
        </td>
        <td>${post.category}</td>
        <td>${author.name}</td>
        <td>
          <span class="post-status ${post.status}">${post.status}</span>
        </td>
        <td>${formatDate(post.date)}</td>
        <td>
          <div class="post-actions">
            <button class="action-btn edit" data-id="${post.id}" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn view" data-id="${post.id}" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn delete" data-id="${post.id}" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Add event listeners to action buttons
  addPostActionListeners();
}

// Add event listeners to post action buttons
function addPostActionListeners() {
  const editButtons = document.querySelectorAll('.action-btn.edit');
  const viewButtons = document.querySelectorAll('.action-btn.view');
  const deleteButtons = document.querySelectorAll('.action-btn.delete');
  
  // Edit post
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const postId = parseInt(button.getAttribute('data-id'));
      editPost(postId);
    });
  });
  
  // View post
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const postId = parseInt(button.getAttribute('data-id'));
      window.open(`../post.html?id=${postId}`, '_blank');
    });
  });
  
  // Delete post
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const postId = parseInt(button.getAttribute('data-id'));
      
      if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        deletePost(postId);
      }
    });
  });
}

// Edit post
function editPost(postId) {
  const post = blogData.posts.find(post => post.id === postId);
  
  if (!post) {
    showToast('Post not found.', 'error');
    return;
  }
  
  // Switch to create/edit section
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector('.nav-item[data-section="create"]').classList.add('active');
  
  document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
  document.getElementById('create').classList.add('active');
  
  // Update form title
  document.getElementById('post-form-title').textContent = 'Edit Post';
  
  // Fill form fields
  document.getElementById('post-id').value = post.id;
  document.getElementById('post-title').value = post.title;
  document.getElementById('post-slug').value = post.slug;
  document.getElementById('post-category').value = post.category;
  document.getElementById('post-author').value = post.author.id;
  document.getElementById('post-excerpt').value = post.excerpt;
  document.getElementById('post-featured-image').value = post.image;
  document.getElementById('post-tags').value = post.tags.join(', ');
  document.getElementById('post-status').value = post.status;
  
  // Set meta fields
  document.getElementById('post-meta-title').value = post.meta?.title || post.title;
  document.getElementById('post-meta-description').value = post.meta?.description || post.excerpt;
  document.getElementById('post-meta-keywords').value = post.meta?.keywords || '';
  
  // Set content in editor
  if (window.postEditor) {
    window.postEditor.value(post.content);
  }
  
  // Update image preview
  const imagePreview = document.getElementById('image-preview');
  if (imagePreview) {
    imagePreview.innerHTML = `<img src="${post.image}" alt="Featured Image Preview">`;
  }
  
  // Set slug as manually changed
  document.getElementById('post-slug').dataset.manuallyChanged = 'true';
}

// Save post
function savePost() {
  // Get form data
  const postId = document.getElementById('post-id').value;
  const title = document.getElementById('post-title').value;
  const slug = document.getElementById('post-slug').value;
  const category = document.getElementById('post-category').value;
  const authorId = parseInt(document.getElementById('post-author').value);
  const excerpt = document.getElementById('post-excerpt').value;
  const image = document.getElementById('post-featured-image').value;
  const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
  const status = document.getElementById('post-status').value;
  const content = window.postEditor ? window.postEditor.value() : '';
  
  // Meta data
  const metaTitle = document.getElementById('post-meta-title').value;
  const metaDescription = document.getElementById('post-meta-description').value;
  const metaKeywords = document.getElementById('post-meta-keywords').value;
  
  // Validate required fields
  if (!title || !slug || !category || !authorId || !excerpt || !image || !content) {
    showToast('Please fill all required fields.', 'error');
    return;
  }
  
  // Find author
  const author = blogData.authors.find(author => author.id === authorId);
  
  if (!author) {
    showToast('Selected author not found.', 'error');
    return;
  }
  
  // Prepare post data
  const postData = {
    title,
    slug,
    category,
    author: {
      id: author.id,
      name: author.name,
      avatar: author.avatar
    },
    excerpt,
    content,
    image,
    tags,
    status,
    meta: {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords
    },
    date: new Date().toISOString(),
    views: 0
  };
  
  let isNewPost = true;
  
  // Check if editing existing post
  if (postId) {
    const existingPostIndex = blogData.posts.findIndex(post => post.id.toString() === postId.toString());
    
    if (existingPostIndex !== -1) {
      isNewPost = false;
      
      // Preserve original date and views
      postData.date = blogData.posts[existingPostIndex].date;
      postData.views = blogData.posts[existingPostIndex].views || 0;
      postData.id = parseInt(postId);
      
      // Update post
      blogData.posts[existingPostIndex] = postData;
      
      addActivity('update', `Updated post: ${title}`);
      showToast('Post updated successfully!', 'success');
    }
  }
  
  // If new post
  if (isNewPost) {
    // Generate new ID
    postData.id = Date.now();
    
    // Add post to data
    blogData.posts.push(postData);
    
    addActivity('create', `Created new post: ${title}`);
    showToast('Post created successfully!', 'success');
  }
  
  // Save data
  saveBlogData();
  
  // Update UI
  updateUI();
  
  // Reset form
  resetPostForm();
  
  // Switch to posts section
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector('.nav-item[data-section="posts"]').classList.add('active');
  
  document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
  document.getElementById('posts').classList.add('active');
}

// Delete post
function deletePost(postId) {
  const postIndex = blogData.posts.findIndex(post => post.id === postId);
  
  if (postIndex === -1) {
    showToast('Post not found.', 'error');
    return;
  }
  
  const postTitle = blogData.posts[postIndex].title;
  
  // Remove post
  blogData.posts.splice(postIndex, 1);
  
  // Save data
  saveBlogData();
  
  // Update UI
  updateUI();
  
  addActivity('delete', `Deleted post: ${postTitle}`);
  showToast('Post deleted successfully!', 'success');
}

// Reset post form
function resetPostForm() {
  document.getElementById('post-form-title').textContent = 'Create New Post';
  document.getElementById('post-form').reset();
  document.getElementById('post-id').value = '';
  document.getElementById('post-slug').dataset.manuallyChanged = '';
  
  if (window.postEditor) {
    window.postEditor.value('');
  }
  
  const imagePreview = document.getElementById('image-preview');
  if (imagePreview) {
    imagePreview.innerHTML = 'Image preview will appear here';
  }
}

// Initialize categories management
function initCategoriesManagement() {
  const addCategoryBtn = document.getElementById('add-category');
  const newCategoryName = document.getElementById('new-category-name');
  const newCategorySlug = document.getElementById('new-category-slug');
  
  if (addCategoryBtn && newCategoryName && newCategorySlug) {
    // Name to slug conversion
    newCategoryName.addEventListener('input', () => {
      if (!newCategorySlug.dataset.manuallyChanged) {
        newCategorySlug.value = createSlug(newCategoryName.value);
      }
    });
    
    newCategorySlug.addEventListener('input', () => {
      newCategorySlug.dataset.manuallyChanged = 'true';
    });
    
    // Add category
    addCategoryBtn.addEventListener('click', () => {
      const name = newCategoryName.value.trim();
      const slug = newCategorySlug.value.trim();
      
      if (!name || !slug) {
        showToast('Please enter both name and slug for the category.', 'error');
        return;
      }
      
      // Check if slug already exists
      if (blogData.categories.some(category => category.slug === slug)) {
        showToast('A category with this slug already exists.', 'error');
        return;
      }
      
      // Create new category
      const newCategory = {
        id: Date.now(),
        name,
        slug
      };
      
      // Add to data
      blogData.categories.push(newCategory);
      
      // Save data
      saveBlogData();
      
      // Update UI
      updateUI();
      
      // Reset inputs
      newCategoryName.value = '';
      newCategorySlug.value = '';
      newCategorySlug.dataset.manuallyChanged = '';
      
      addActivity('create', `Created new category: ${name}`);
      showToast('Category added successfully!', 'success');
    });
  }
}

// Update categories table
function updateCategoriesTable() {
  const categoriesTableBody = document.getElementById('categories-table-body');
  const noCategoriesMessage = document.getElementById('no-categories-message');
  
  if (!categoriesTableBody) return;
  
  if (blogData.categories.length === 0) {
    categoriesTableBody.innerHTML = '';
    noCategoriesMessage.style.display = 'block';
    return;
  }
  
  noCategoriesMessage.style.display = 'none';
  
  categoriesTableBody.innerHTML = blogData.categories.map(category => {
    // Count posts in this category
    const postCount = blogData.posts.filter(post => post.category === category.slug).length;
    
    return `
      <tr>
        <td>${category.name}</td>
        <td>${category.slug}</td>
        <td>${postCount}</td>
        <td>
          <div class="post-actions">
            <button class="action-btn edit" data-id="${category.id}" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" data-id="${category.id}" title="Delete" ${postCount > 0 ? 'disabled' : ''}>
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Add event listeners to action buttons
  addCategoryActionListeners();
  
  // Update category filters
  updateCategoryFilters();
}

// Update category filters in forms
function updateCategoryFilters() {
  const categoryFilters = document.querySelectorAll('#category-filter, #post-category');
  
  categoryFilters.forEach(filter => {
    // Save current value
    const currentValue = filter.value;
    
    // Clear options except first one
    while (filter.options.length > 1) {
      filter.remove(1);
    }
    
    // Add category options
    blogData.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.slug;
      option.textContent = category.name;
      filter.appendChild(option);
    });
    
    // Restore previous value if it exists
    if (currentValue && [...filter.options].some(option => option.value === currentValue)) {
      filter.value = currentValue;
    }
  });
}

// Add event listeners to category action buttons
function addCategoryActionListeners() {
  const editButtons = document.querySelectorAll('#categories-table-body .action-btn.edit');
  const deleteButtons = document.querySelectorAll('#categories-table-body .action-btn.delete');
  
  // Edit category
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const categoryId = parseInt(button.getAttribute('data-id'));
      const category = blogData.categories.find(cat => cat.id === categoryId);
      
      if (!category) {
        showToast('Category not found.', 'error');
        return;
      }
      
      // Show edit prompt
      const newName = prompt('Enter new category name:', category.name);
      
      if (newName === null) return; // Cancelled
      
      if (newName.trim() === '') {
        showToast('Category name cannot be empty.', 'error');
        return;
      }
      
      const newSlug = prompt('Enter new category slug:', category.slug);
      
      if (newSlug === null) return; // Cancelled
      
      if (newSlug.trim() === '') {
        showToast('Category slug cannot be empty.', 'error');
        return;
      }
      
      // Check if slug already exists (except for this category)
      if (blogData.categories.some(cat => cat.slug === newSlug && cat.id !== categoryId)) {
        showToast('A category with this slug already exists.', 'error');
        return;
      }
      
      // Store old slug for updating posts
      const oldSlug = category.slug;
      
      // Update category
      category.name = newName.trim();
      category.slug = newSlug.trim();
      
      // Update posts with this category
      blogData.posts.forEach(post => {
        if (post.category === oldSlug) {
          post.category = category.slug;
        }
      });
      
      // Save data
      saveBlogData();
      
      // Update UI
      updateUI();
      
      addActivity('update', `Updated category: ${category.name}`);
      showToast('Category updated successfully!', 'success');
    });
  });
  
  // Delete category
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) {
        showToast('Cannot delete category with associated posts.', 'error');
        return;
      }
      
      const categoryId = parseInt(button.getAttribute('data-id'));
      const category = blogData.categories.find(cat => cat.id === categoryId);
      
      if (!category) {
        showToast('Category not found.', 'error');
        return;
      }
      
      if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
        // Remove category
        const categoryIndex = blogData.categories.findIndex(cat => cat.id === categoryId);
        blogData.categories.splice(categoryIndex, 1);
        
        // Save data
        saveBlogData();
        
        // Update UI
        updateUI();
        
        addActivity('delete', `Deleted category: ${category.name}`);
        showToast('Category deleted successfully!', 'success');
      }
    });
  });
}

// Initialize authors management
function initAuthorsManagement() {
  const addAuthorBtn = document.getElementById('add-author-btn');
  const authorForm = document.getElementById('author-form');
  const saveAuthorBtn = document.getElementById('save-author');
  const authorModal = document.getElementById('author-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  
  // Avatar preview
  const authorAvatarInput = document.getElementById('author-avatar');
  const avatarPreview = document.getElementById('avatar-preview');
  
  if (authorAvatarInput && avatarPreview) {
    authorAvatarInput.addEventListener('input', () => {
      const avatarUrl = authorAvatarInput.value.trim();
      
      if (avatarUrl) {
        avatarPreview.innerHTML = `<img src="${avatarUrl}" alt="Avatar Preview">`;
      } else {
        avatarPreview.innerHTML = 'Avatar preview will appear here';
      }
    });
  }
  
  // Open add author modal
  if (addAuthorBtn && authorModal) {
    addAuthorBtn.addEventListener('click', () => {
      // Reset form
      authorForm.reset();
      document.getElementById('author-id').value = '';
      document.getElementById('author-modal-title').textContent = 'Add New Author';
      
      if (avatarPreview) {
        avatarPreview.innerHTML = 'Avatar preview will appear here';
      }
      
      // Show modal
      authorModal.classList.add('active');
    });
  }
  
  // Close modals
  if (closeModalBtns.length > 0) {
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        authorModal.classList.remove('active');
      });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', e => {
      if (e.target === authorModal) {
        authorModal.classList.remove('active');
      }
    });
  }
  
  // Author form submission
  if (authorForm) {
    authorForm.addEventListener('submit', e => {
      e.preventDefault();
      saveAuthor();
    });
  }
}

// Update authors table
function updateAuthorsTable() {
  const authorsTableBody = document.getElementById('authors-table-body');
  const noAuthorsMessage = document.getElementById('no-authors-message');
  
  if (!authorsTableBody) return;
  
  if (blogData.authors.length === 0) {
    authorsTableBody.innerHTML = '';
    noAuthorsMessage.style.display = 'block';
    return;
  }
  
  noAuthorsMessage.style.display = 'none';
  
  authorsTableBody.innerHTML = blogData.authors.map(author => {
    // Count posts by this author
    const postCount = blogData.posts.filter(post => post.author.id === author.id).length;
    
    return `
      <tr>
        <td>
          <div class="author-row">
            <img src="${author.avatar}" alt="${author.name}" class="author-avatar-small">
            <span>${author.name}</span>
          </div>
        </td>
        <td>${author.email}</td>
        <td>${postCount}</td>
        <td>
          <div class="post-actions">
            <button class="action-btn edit" data-id="${author.id}" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" data-id="${author.id}" title="Delete" ${postCount > 0 ? 'disabled' : ''}>
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Add CSS for author row
  const style = document.createElement('style');
  style.textContent = `
    .author-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .author-avatar-small {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }
  `;
  document.head.appendChild(style);
  
  // Add event listeners to action buttons
  addAuthorActionListeners();
  
  // Update author selects
  updateAuthorSelects();
}

// Update author selects in forms
function updateAuthorSelects() {
  const authorSelects = document.querySelectorAll('#post-author');
  
  authorSelects.forEach(select => {
    // Save current value
    const currentValue = select.value;
    
    // Clear options
    select.innerHTML = '';
    
    // Add author options
    blogData.authors.forEach(author => {
      const option = document.createElement('option');
      option.value = author.id;
      option.textContent = author.name;
      select.appendChild(option);
    });
    
    // Restore previous value if it exists
    if (currentValue && [...select.options].some(option => option.value === currentValue)) {
      select.value = currentValue;
    }
  });
}

// Update all form selects
function updateFormSelects() {
  updateCategoryFilters();
  updateAuthorSelects();
}

// Add event listeners to author action buttons
function addAuthorActionListeners() {
  const editButtons = document.querySelectorAll('#authors-table-body .action-btn.edit');
  const deleteButtons = document.querySelectorAll('#authors-table-body .action-btn.delete');
  
  // Edit author
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const authorId = parseInt(button.getAttribute('data-id'));
      editAuthor(authorId);
    });
  });
  
  // Delete author
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) {
        showToast('Cannot delete author with associated posts.', 'error');
        return;
      }
      
      const authorId = parseInt(button.getAttribute('data-id'));
      const author = blogData.authors.find(auth => auth.id === authorId);
      
      if (!author) {
        showToast('Author not found.', 'error');
        return;
      }
      
      if (confirm(`Are you sure you want to delete the author "${author.name}"?`)) {
        // Remove author
        const authorIndex = blogData.authors.findIndex(auth => auth.id === authorId);
        blogData.authors.splice(authorIndex, 1);
        
        // Save data
        saveBlogData();
        
        // Update UI
        updateUI();
        
        addActivity('delete', `Deleted author: ${author.name}`);
        showToast('Author deleted successfully!', 'success');
      }
    });
  });
}

// Edit author
function editAuthor(authorId) {
  const author = blogData.authors.find(auth => auth.id === authorId);
  
  if (!author) {
    showToast('Author not found.', 'error');
    return;
  }
  
  // Set form fields
  document.getElementById('author-id').value = author.id;
  document.getElementById('author-name').value = author.name;
  document.getElementById('author-email').value = author.email;
  document.getElementById('author-bio').value = author.bio || '';
  document.getElementById('author-avatar').value = author.avatar || '';
  
  // Set social links
  if (author.social) {
    document.getElementById('author-twitter').value = author.social.twitter || '';
    document.getElementById('author-linkedin').value = author.social.linkedin || '';
    document.getElementById('author-github').value = author.social.github || '';
  }
  
  // Update avatar preview
  const avatarPreview = document.getElementById('avatar-preview');
  if (avatarPreview) {
    avatarPreview.innerHTML = `<img src="${author.avatar}" alt="Avatar Preview">`;
  }
  
  // Update modal title
  document.getElementById('author-modal-title').textContent = 'Edit Author';
  
  // Show modal
  document.getElementById('author-modal').classList.add('active');
}

// Save author
function saveAuthor() {
  // Get form data
  const authorId = document.getElementById('author-id').value;
  const name = document.getElementById('author-name').value.trim();
  const email = document.getElementById('author-email').value.trim();
  const bio = document.getElementById('author-bio').value.trim();
  const avatar = document.getElementById('author-avatar').value.trim() || 
                 `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  
  // Social links
  const twitter = document.getElementById('author-twitter').value.trim();
  const linkedin = document.getElementById('author-linkedin').value.trim();
  const github = document.getElementById('author-github').value.trim();
  
  // Validate required fields
  if (!name || !email) {
    showToast('Please fill all required fields.', 'error');
    return;
  }
  
  // Prepare author data
  const authorData = {
    name,
    email,
    bio,
    avatar,
    social: {
      twitter,
      linkedin,
      github
    }
  };
  
  let isNewAuthor = true;
  
  // Check if editing existing author
  if (authorId) {
    const existingAuthorIndex = blogData.authors.findIndex(auth => auth.id.toString() === authorId.toString());
    
    if (existingAuthorIndex !== -1) {
      isNewAuthor = false;
      
      // Preserve ID
      authorData.id = parseInt(authorId);
      
      // Update author
      blogData.authors[existingAuthorIndex] = authorData;
      
      // Update author info in posts
      blogData.posts.forEach(post => {
        if (post.author.id === authorData.id) {
          post.author.name = authorData.name;
          post.author.avatar = authorData.avatar;
        }
      });
      
      addActivity('update', `Updated author: ${name}`);
      showToast('Author updated successfully!', 'success');
    }
  }
  
  // If new author
  if (isNewAuthor) {
    // Generate new ID
    authorData.id = Date.now();
    
    // Add author to data
    blogData.authors.push(authorData);
    
    addActivity('create', `Created new author: ${name}`);
    showToast('Author created successfully!', 'success');
  }
  
  // Save data
  saveBlogData();
  
  // Update UI
  updateUI();
  
  // Close modal
  document.getElementById('author-modal').classList.remove('active');
}

// Initialize settings management
function initSettingsManagement() {
  const settingsForm = document.getElementById('settings-form');
  
  if (settingsForm) {
    settingsForm.addEventListener('submit', e => {
      e.preventDefault();
      saveSettings();
    });
  }
}

// Update settings form
function updateSettingsForm() {
  const settings = blogData.settings;
  
  if (!settings) return;
  
  // General settings
  document.getElementById('blog-title').value = settings.blogTitle || 'Ishant Webworks Blogs';
  document.getElementById('blog-description').value = settings.blogDescription || '';
  document.getElementById('posts-per-page').value = settings.postsPerPage || 6;
  document.getElementById('featured-posts-count').value = settings.featuredPostsCount || 3;
  
  // SEO settings
  document.getElementById('meta-title').value = settings.metaTitle || '';
  document.getElementById('meta-description').value = settings.metaDescription || '';
  document.getElementById('meta-keywords').value = settings.metaKeywords || '';
  
  // Social media settings
  if (settings.socialLinks) {
    document.getElementById('facebook-url').value = settings.socialLinks.facebook || '';
    document.getElementById('twitter-url').value = settings.socialLinks.twitter || '';
    document.getElementById('instagram-url').value = settings.socialLinks.instagram || '';
    document.getElementById('linkedin-url').value = settings.socialLinks.linkedin || '';
  }
  
  // Shop integration
  if (settings.shopIntegration) {
    document.getElementById('shop-url').value = settings.shopIntegration.url || 'https://ishant.shop';
    document.getElementById('shop-description').value = settings.shopIntegration.description || '';
    document.getElementById('show-shop-promo').checked = settings.shopIntegration.showPromo !== false;
  }
}

// Save settings
function saveSettings() {
  // Get form data
  const blogTitle = document.getElementById('blog-title').value.trim();
  const blogDescription = document.getElementById('blog-description').value.trim();
  const postsPerPage = parseInt(document.getElementById('posts-per-page').value) || 6;
  const featuredPostsCount = parseInt(document.getElementById('featured-posts-count').value) || 3;
  
  // SEO settings
  const metaTitle = document.getElementById('meta-title').value.trim();
  const metaDescription = document.getElementById('meta-description').value.trim();
  const metaKeywords = document.getElementById('meta-keywords').value.trim();
  
  // Social media
  const facebookUrl = document.getElementById('facebook-url').value.trim();
  const twitterUrl = document.getElementById('twitter-url').value.trim();
  const instagramUrl = document.getElementById('instagram-url').value.trim();
  const linkedinUrl = document.getElementById('linkedin-url').value.trim();
  
  // Shop integration
  const shopUrl = document.getElementById('shop-url').value.trim();
  const shopDescription = document.getElementById('shop-description').value.trim();
  const showShopPromo = document.getElementById('show-shop-promo').checked;
  
  // Create settings object
  const settings = {
    blogTitle,
    blogDescription,
    postsPerPage,
    featuredPostsCount,
    metaTitle,
    metaDescription,
    metaKeywords,
    socialLinks: {
      facebook: facebookUrl,
      twitter: twitterUrl,
      instagram: instagramUrl,
      linkedin: linkedinUrl
    },
    shopIntegration: {
      url: shopUrl,
      description: shopDescription,
      showPromo: showShopPromo
    }
  };
  
  // Update settings
  blogData.settings = settings;
  
  // Save data
  saveBlogData();
  
  addActivity('update', 'Updated blog settings');
  showToast('Settings saved successfully!', 'success');
}

// Initialize data import/export
function initDataManagement() {
  const exportDataBtn = document.getElementById('export-data');
  const importDataBtn = document.getElementById('import-data');
  const importFileInput = document.getElementById('import-file');
  
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', exportBlogData);
  }
  
  if (importDataBtn && importFileInput) {
    importDataBtn.addEventListener('click', () => {
      importFileInput.click();
    });
    
    importFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      
      if (file) {
        importBlogData(file);
      }
    });
  }
}

// Helper function: Create slug from text
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();                  // Trim hyphens from start and end
}

// Helper function: Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Helper function: Show toast notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 3000);
}