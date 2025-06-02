// Main JavaScript for Ishant Webworks Blog

document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize scroll effects
  initScrollEffects();
  
  // Load blog data
  loadBlogData();
  
  // Initialize forms
  initForms();
});

// Theme Toggle
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  
  // Check if user has a preferred theme
  if (storedTheme) {
    document.body.classList.toggle('dark-theme', storedTheme === 'dark');
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-theme', prefersDark);
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
  }
  
  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('theme', currentTheme);
    });
  }
}

// Navigation
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navItems = document.querySelector('.nav-items');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Hamburger menu toggle
  if (hamburger && navItems) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navItems.classList.toggle('active');
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (hamburger && navItems && !hamburger.contains(e.target) && !navItems.contains(e.target)) {
      hamburger.classList.remove('active');
      navItems.classList.remove('active');
    }
  });
  
  // Smooth scrolling for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Check if link is an anchor on the same page
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop;
          
          window.scrollTo({
            top: offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          hamburger.classList.remove('active');
          navItems.classList.remove('active');
        }
      }
    });
  });
  
  // Header scroll effect
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Scroll Effects
function initScrollEffects() {
  // Scroll to top button
  const scrollTopBtn = document.getElementById('scroll-top');
  
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Reveal animation on scroll
  const revealElements = document.querySelectorAll('.reveal');
  
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check on initial load
}

// Load Blog Data
function loadBlogData() {
  const featuredPostsContainer = document.getElementById('featured-posts');
  const blogPostsContainer = document.getElementById('blog-posts');
  const loadMoreBtn = document.getElementById('load-more');
  const searchInput = document.getElementById('search-input');
  const categoryButtons = document.querySelectorAll('.category');
  
  let currentPage = 1;
  let postsPerPage = 6;
  let currentCategory = 'all';
  let currentSearchTerm = '';
  let allPosts = [];
  
  // Fetch blog data
  fetch('data/blog-data.json')
    .then(response => response.json())
    .then(data => {
      allPosts = data.posts;
      
      // Load featured posts
      if (featuredPostsContainer) {
        loadFeaturedPosts(data.posts);
      }
      
      // Load initial blog posts
      if (blogPostsContainer) {
        loadBlogPosts(filterPosts(data.posts));
      }
      
      // Load more posts
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
          currentPage++;
          loadMorePosts(filterPosts(data.posts));
        });
      }
      
      // Search functionality
      if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
          currentSearchTerm = searchInput.value.toLowerCase();
          currentPage = 1;
          loadBlogPosts(filterPosts(data.posts));
        }, 300));
      }
      
      // Category filter
      if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
          button.addEventListener('click', () => {
            // Update active category
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentCategory = button.dataset.category;
            currentPage = 1;
            loadBlogPosts(filterPosts(data.posts));
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading blog data:', error);
      
      // Display error message
      if (featuredPostsContainer) {
        featuredPostsContainer.innerHTML = '<div class="error-message">Failed to load featured posts. Please try again later.</div>';
      }
      
      if (blogPostsContainer) {
        blogPostsContainer.innerHTML = '<div class="error-message">Failed to load blog posts. Please try again later.</div>';
      }
    });
  
  // Filter posts based on search and category
  function filterPosts(posts) {
    return posts.filter(post => {
      const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
      const matchesSearch = currentSearchTerm === '' || 
                          post.title.toLowerCase().includes(currentSearchTerm) || 
                          post.excerpt.toLowerCase().includes(currentSearchTerm);
      
      return matchesCategory && matchesSearch;
    });
  }
  
  // Load featured posts
  function loadFeaturedPosts(posts) {
    const featuredPosts = posts.filter(post => post.featured).slice(0, 3);
    
    if (featuredPosts.length === 0) {
      featuredPostsContainer.innerHTML = '<div class="no-posts">No featured posts available.</div>';
      return;
    }
    
    featuredPostsContainer.innerHTML = featuredPosts.map(post => createPostCard(post, true)).join('');
    
    // Apply animations
    const postCards = featuredPostsContainer.querySelectorAll('.post-card');
    postCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate');
      }, 100 * index);
    });
  }
  
  // Load blog posts
  function loadBlogPosts(posts) {
    const paginatedPosts = posts.slice(0, currentPage * postsPerPage);
    
    if (posts.length === 0) {
      blogPostsContainer.innerHTML = '<div class="no-posts">No posts found matching your criteria.</div>';
      loadMoreBtn.style.display = 'none';
      return;
    }
    
    blogPostsContainer.innerHTML = paginatedPosts.map(post => createPostCard(post)).join('');
    
    // Show/hide load more button
    loadMoreBtn.style.display = paginatedPosts.length < posts.length ? 'block' : 'none';
    
    // Apply animations
    const postCards = blogPostsContainer.querySelectorAll('.post-card');
    postCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate');
      }, 100 * index);
    });
  }
  
  // Load more posts
  function loadMorePosts(posts) {
    const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
    
    if (paginatedPosts.length > 0) {
      const newPosts = paginatedPosts.map(post => createPostCard(post)).join('');
      blogPostsContainer.insertAdjacentHTML('beforeend', newPosts);
      
      // Apply animations to new posts
      const postCards = blogPostsContainer.querySelectorAll('.post-card:not(.animate)');
      postCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate');
        }, 100 * index);
      });
    }
    
    // Show/hide load more button
    loadMoreBtn.style.display = currentPage * postsPerPage < posts.length ? 'block' : 'none';
  }
  
  // Create post card HTML
  function createPostCard(post, featured = false) {
    return `
      <article class="post-card glass-card ${featured ? 'featured-card' : ''}">
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
    `;
  }
  
  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  }
  
  // Debounce function for search input
  function debounce(func, delay) {
    let timer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
}

// Initialize Forms
function initForms() {
  const newsletterForm = document.getElementById('newsletter-form');
  const contactForm = document.getElementById('contact-form');
  
  // Newsletter form submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      
      // Simulate form submission
      this.innerHTML = '<p class="success-message">Thank you for subscribing! We\'ll keep you updated with our latest articles and news.</p>';
      
      // Log for testing
      console.log('Newsletter subscription:', email);
    });
  }
  
  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = {
        name: this.querySelector('#name').value,
        email: this.querySelector('#email').value,
        subject: this.querySelector('#subject').value,
        message: this.querySelector('#message').value
      };
      
      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Simulate API call
      setTimeout(() => {
        this.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent successfully! We\'ll get back to you soon.';
        this.prepend(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
        
        // Log for testing
        console.log('Contact form submission:', formData);
      }, 1500);
    });
  }
}