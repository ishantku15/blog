// Animation and Effects for Ishant Webworks Blog

document.addEventListener('DOMContentLoaded', function() {
  // Initialize particle effect
  initParticles();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize hover effects
  initHoverEffects();
  
  // Initialize page transitions
  initPageTransitions();
});

// Particle Effect
function initParticles() {
  const particlesContainer = document.querySelector('.particles-container');
  
  if (!particlesContainer) return;
  
  const particleCount = particlesContainer.classList.contains('small') ? 30 : 50;
  const particleColors = ['#1a73e8', '#00bcd4', '#6200ee', '#f5f5f5'];
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer, particleColors);
  }
}

// Create a single particle
function createParticle(container, colors) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random properties
  const size = Math.random() * 10 + 3;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 5;
  
  // Apply styles
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background-color: ${color};
    left: ${left}%;
    top: ${top}%;
    opacity: ${Math.random() * 0.6 + 0.2};
    border-radius: 50%;
    animation: float ${duration}s ease-in-out ${delay}s infinite;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    pointer-events: none;
  `;
  
  // Add to container
  container.appendChild(particle);
}

// Scroll Animations
function initScrollAnimations() {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.reveal');
  
  // Animated counter for stats
  const countElements = document.querySelectorAll('.count-up');
  
  // Parallax effect
  const parallaxElements = document.querySelectorAll('.parallax');
  
  // Observer for reveal elements
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Apply observers
  revealElements.forEach(element => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
  
  // Animated counter function
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // ms
    const step = Math.ceil(target / (duration / 16)); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      element.textContent = current;
      
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }
  
  // Observer for count elements
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  // Apply count observers
  countElements.forEach(element => {
    countObserver.observe(element);
  });
  
  // Parallax effect on scroll
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
      const scrolled = window.scrollY;
      const rate = element.getAttribute('data-rate') || 0.3;
      const yPos = -(scrolled * rate);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  });
}

// Hover Effects
function initHoverEffects() {
  // Card hover effect with tilt
  const cards = document.querySelectorAll('.glass-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      // Skip if card has no-tilt class
      if (card.classList.contains('no-tilt')) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (y - centerY) / 10;
      const tiltY = -(x - centerX) / 10;
      
      // Apply subtle tilt effect
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset transform on mouse leave
      card.style.transform = '';
    });
  });
  
  // Image zoom effect
  const zoomImages = document.querySelectorAll('.zoom-effect img');
  
  zoomImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.1)';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });
  
  // Button hover effect
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
      button.style.boxShadow = '0 7px 14px rgba(0, 0, 0, 0.1)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
      button.style.boxShadow = '';
    });
    
    button.addEventListener('mousedown', () => {
      button.style.transform = 'translateY(-1px)';
    });
    
    button.addEventListener('mouseup', () => {
      button.style.transform = 'translateY(-3px)';
    });
  });
}

// Page Transitions
function initPageTransitions() {
  // Smooth page transitions
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
  
  links.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      
      // Only apply transition for internal links
      if (href && href.indexOf('http') !== 0) {
        e.preventDefault();
        
        // Fade out current page
        document.body.classList.add('page-transition-out');
        
        // Navigate after transition
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
  
  // Fade in page on load
  window.addEventListener('pageshow', () => {
    document.body.classList.add('page-transition-in');
    
    setTimeout(() => {
      document.body.classList.remove('page-transition-out', 'page-transition-in');
    }, 500);
  });
  
  // Add CSS for transitions
  const style = document.createElement('style');
  style.textContent = `
    .page-transition-out {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .page-transition-in {
      animation: fadeIn 0.5s ease forwards;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

// Magic cursor effect
function initMagicCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'magic-cursor';
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  
  document.addEventListener('mousemove', e => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    // Delay for trailing effect
    setTimeout(() => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, 100);
  });
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .glass-card, input, textarea');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-active');
      cursorDot.classList.add('cursor-active');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-active');
      cursorDot.classList.remove('cursor-active');
    });
  });
  
  // Add CSS for cursor
  const style = document.createElement('style');
  style.textContent = `
    body {
      cursor: none;
    }
    
    .magic-cursor {
      position: fixed;
      width: 40px;
      height: 40px;
      border: 1px solid var(--primary-color);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      transition: width 0.3s, height 0.3s, border-color 0.3s;
      z-index: 9999;
    }
    
    .cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background-color: var(--primary-color);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10000;
    }
    
    .magic-cursor.cursor-active {
      width: 60px;
      height: 60px;
      border-color: var(--accent-color);
    }
    
    .cursor-dot.cursor-active {
      background-color: var(--accent-color);
    }
    
    @media (max-width: 768px) {
      .magic-cursor, .cursor-dot {
        display: none;
      }
      
      body {
        cursor: auto;
      }
    }
  `;
  document.head.appendChild(style);
}