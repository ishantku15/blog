// Particles effect for Ishant Webworks Blog

document.addEventListener('DOMContentLoaded', function() {
  initParticles();
});

function initParticles() {
  const particlesContainer = document.querySelector('.particles-container');
  
  if (!particlesContainer) return;
  
  // Configuration
  const config = {
    particleCount: particlesContainer.classList.contains('small') ? 30 : 50,
    colors: ['#1a73e8', '#00bcd4', '#6200ee', '#f5f5f5'],
    minSize: 3,
    maxSize: 12,
    minSpeed: 0.5,
    maxSpeed: 1.5,
    minOpacity: 0.2,
    maxOpacity: 0.6,
    connectionDistance: 150,
    connectionOpacity: 0.1
  };
  
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = particlesContainer.classList.contains('small') ? 
    window.innerHeight / 2 : window.innerHeight;
  
  // Style canvas
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  
  // Add canvas to container
  particlesContainer.appendChild(canvas);
  
  // Particles array
  let particles = [];
  
  // Create particles
  function createParticles() {
    particles = [];
    
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * (config.maxSize - config.minSize) + config.minSize,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity,
        speedX: (Math.random() - 0.5) * (config.maxSpeed - config.minSpeed) + config.minSpeed,
        speedY: (Math.random() - 0.5) * (config.maxSpeed - config.minSpeed) + config.minSpeed
      });
    }
  }
  
  // Draw particles
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.opacity})`;
      ctx.fill();
      
      // Draw connections
      drawConnections(particle);
    });
    
    requestAnimationFrame(drawParticles);
  }
  
  // Draw connections between particles
  function drawConnections(particle) {
    particles.forEach(otherParticle => {
      if (particle === otherParticle) return;
      
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < config.connectionDistance) {
        const opacity = (1 - distance / config.connectionDistance) * config.connectionOpacity;
        
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(otherParticle.x, otherParticle.y);
        ctx.strokeStyle = `rgba(${hexToRgb(particle.color)}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }
  
  // Helper function to convert hex to rgb
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '255, 255, 255';
  }
  
  // Handle resize
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = particlesContainer.classList.contains('small') ? 
      window.innerHeight / 2 : window.innerHeight;
    createParticles();
  }
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let mouseRadius = 100;
  
  // Track mouse position
  particlesContainer.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Repel particles near mouse
    particles.forEach(particle => {
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        
        particle.speedX += Math.cos(angle) * force * 0.5;
        particle.speedY += Math.sin(angle) * force * 0.5;
      }
    });
  });
  
  // Initialize
  createParticles();
  drawParticles();
}