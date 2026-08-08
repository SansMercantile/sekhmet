// Constellation Interactive System
// Shared JavaScript framework for all SansMercantile constellation systems

class ConstellationInteractiveSystem {
  constructor(systemConfig) {
    this.systemName = systemConfig.name || 'System';
    this.systemColor = systemConfig.primaryColor || '#00ff88';
    this.systemMessages = systemConfig.messages || [
      `Welcome to ${this.systemName}! 🚀`,
      `Explore ${this.systemName} features`,
      `Need help? Just click me!`,
      `${this.systemName} is online and ready!`
    ];
    
    this.avatar = null;
    this.chatBubble = null;
    this.visitorCount = Math.floor(Math.random() * 5000) + 1000;
    this.isAvatarWalking = false;
    this.currentMessageIndex = 0;
    this.particles = [];
    
    this.init();
  }

  init() {
    this.createParticleSystem();
    this.createAvatar();
    this.createVisitorCounter();
    this.setupDynamicContent();
    this.startLiveFeatures();
    this.setupPortalIntegration();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.finalizeInit());
    } else {
      this.finalizeInit();
    }
  }

  finalizeInit() {
    this.updateVisitorCount();
    this.startAvatarIdleAnimation();
    console.log(`🚀 ${this.systemName} Interactive System initialized`);
  }

  createParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-system';
    document.body.appendChild(particleContainer);

    const gridBg = document.createElement('div');
    gridBg.className = 'neural-grid-bg';
    document.body.appendChild(gridBg);

    for (let i = 0; i < 50; i++) {
      setTimeout(() => this.createParticle(particleContainer), i * 100);
    }
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (6 + Math.random() * 4) + 's';
    particle.style.background = this.systemColor;
    
    container.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        setTimeout(() => this.createParticle(container), Math.random() * 2000);
      }
    }, 10000);
  }

  createAvatar() {
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatar-container';
    avatarContainer.id = `${this.systemName.toLowerCase()}-avatar`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    
    const face = document.createElement('div');
    face.className = 'avatar-face';
    
    const eyes = document.createElement('div');
    eyes.className = 'avatar-eyes';
    eyes.innerHTML = '<div class="avatar-eye"></div><div class="avatar-eye"></div>';
    
    const mouth = document.createElement('div');
    mouth.className = 'avatar-mouth';
    
    face.appendChild(eyes);
    face.appendChild(mouth);
    avatar.appendChild(face);
    
    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble';
    chatBubble.id = 'avatar-chat';
    
    avatarContainer.appendChild(avatar);
    avatarContainer.appendChild(chatBubble);
    document.body.appendChild(avatarContainer);
    
    this.avatar = avatar;
    this.chatBubble = chatBubble;
    
    avatarContainer.addEventListener('click', () => this.handleAvatarClick());
    avatarContainer.addEventListener('mouseenter', () => this.handleAvatarHover());
    avatarContainer.addEventListener('mouseleave', () => this.handleAvatarLeave());
  }

  createVisitorCounter() {
    const counter = document.createElement('div');
    counter.className = 'visitor-counter';
    counter.id = 'visitor-counter';
    counter.innerHTML = `<span class="status-dot"></span> ${this.systemName}: <span id="visitor-count">0</span>`;
    document.body.appendChild(counter);
  }

  setupDynamicContent() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index > 0) {
        section.classList.add('interactive-section');
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'status-indicator';
        statusIndicator.innerHTML = '<div class="status-dot"></div>System Online';
        section.appendChild(statusIndicator);
      }
    });

    const cards = document.querySelectorAll('.feature-card, .card, .service-card');
    cards.forEach(card => {
      card.classList.add('content-card');
    });
  }

  setupPortalIntegration() {
    let portalSection = document.querySelector('#portal-section');
    if (!portalSection) {
      portalSection = document.createElement('section');
      portalSection.id = 'portal-section';
      portalSection.className = 'interactive-section';
      portalSection.innerHTML = `
        <h2>${this.systemName} Portal Access</h2>
        <p>Experience the full ${this.systemName} ecosystem through our integrated portal</p>
        <div class="portal-frame">
          <div class="portal-loading">
            <div class="loading-spinner"></div>
            <p>Initializing ${this.systemName} Core Systems...</p>
          </div>
        </div>
      `;
      
      const main = document.querySelector('main');
      if (main) {
        main.appendChild(portalSection);
      }
    }

    setTimeout(() => {
      this.loadPortalContent();
    }, 3000);
  }

  loadPortalContent() {
    const portalFrame = document.querySelector('.portal-frame');
    if (portalFrame) {
      const srcPath = this.findSystemSrc();
      portalFrame.innerHTML = `
        <iframe 
          src="${srcPath}" 
          width="100%" 
          height="100%" 
          frameborder="0"
          style="border-radius: 10px;"
          title="${this.systemName} Application">
        </iframe>
      `;
    }
  }

  findSystemSrc() {
    // Try to find the system's src directory
    const possiblePaths = [
      `src/index.html`,
      `frontend/src/index.html`,
      `${this.systemName.toLowerCase()}/src/index.html`,
      `demo/index.html`
    ];
    
    // For now, return a placeholder - in production, this would check actual paths
    return possiblePaths[0];
  }

  startLiveFeatures() {
    setInterval(() => {
      this.updateVisitorCount();
    }, 30000);

    setInterval(() => {
      this.rotateAvatarMessage();
    }, 10000);

    this.startLiveDataUpdates();
  }

  updateVisitorCount() {
    this.visitorCount += Math.floor(Math.random() * 3) + 1;
    const counterElement = document.getElementById('visitor-count');
    if (counterElement) {
      counterElement.textContent = this.visitorCount.toLocaleString();
    }
  }

  rotateAvatarMessage() {
    if (this.chatBubble && !this.chatBubble.classList.contains('show')) {
      this.showAvatarMessage(this.systemMessages[this.currentMessageIndex]);
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.systemMessages.length;
    }
  }

  startLiveDataUpdates() {
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
      setInterval(() => {
        const statuses = ['System Online', 'Processing', 'Optimizing', 'Secure', 'Active'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const textNode = indicator.childNodes[1];
        if (textNode) {
          textNode.textContent = randomStatus;
        }
      }, 15000);
    });
  }

  handleAvatarClick() {
    this.startAvatarWalk();
    this.showAvatarMessage(`Hi! I'm your ${this.systemName} assistant. How can I help you explore our system?`);
    
    setTimeout(() => {
      this.stopAvatarWalk();
      this.showAvatarMessage(`Let me show you around ${this.systemName}! Check out our features and capabilities.`);
    }, 2000);
  }

  handleAvatarHover() {
    if (!this.isAvatarWalking) {
      this.showAvatarMessage(`Click me to explore ${this.systemName}!`);
    }
  }

  handleAvatarLeave() {
    setTimeout(() => {
      this.hideAvatarMessage();
    }, 2000);
  }

  startAvatarWalk() {
    this.isAvatarWalking = true;
    this.avatar.classList.add('walking');
  }

  stopAvatarWalk() {
    this.isAvatarWalking = false;
    this.avatar.classList.remove('walking');
  }

  startAvatarIdleAnimation() {
    setInterval(() => {
      if (!this.isAvatarWalking && Math.random() > 0.7) {
        this.avatar.style.transform = 'scale(1.02)';
        setTimeout(() => {
          this.avatar.style.transform = 'scale(1)';
        }, 200);
      }
    }, 5000);
  }

  showAvatarMessage(message) {
    if (this.chatBubble) {
      this.chatBubble.textContent = message;
      this.chatBubble.classList.add('show');
      
      setTimeout(() => {
        this.hideAvatarMessage();
      }, 5000);
    }
  }

  hideAvatarMessage() {
    if (this.chatBubble) {
      this.chatBubble.classList.remove('show');
    }
  }

  connectToSystemCore() {
    console.log(`🔗 Connecting to ${this.systemName} Core systems...`);
    
    setTimeout(() => {
      console.log(`✅ Connected to ${this.systemName} Core`);
      this.showAvatarMessage(`${this.systemName} Core connection established! All systems operational.`);
    }, 2000);
  }
}

// Constellation Blog System
class ConstellationBlogSystem {
  constructor(systemName, systemColor) {
    this.systemName = systemName;
    this.systemColor = systemColor;
    this.posts = [];
    this.categories = ['Technology', 'Innovation', 'AI', 'Research', 'Updates'];
    this.init();
  }

  init() {
    this.loadBlogPosts();
    this.setupBlogInterface();
  }

  async loadBlogPosts() {
    // Generate system-specific blog posts
    this.posts = this.generateSystemPosts();
    this.renderBlogPosts();
  }

  generateSystemPosts() {
    const systemPosts = {
      'OMEGA': [
        {
          title: "OMEGA Medical AI: Revolutionizing Healthcare",
          excerpt: "Discover how OMEGA's advanced AI systems are transforming medical diagnosis, treatment planning, and patient care through cutting-edge machine learning algorithms.",
          category: "AI",
          tags: ["medical-ai", "healthcare", "diagnosis", "treatment"]
        },
        {
          title: "Disease Forecasting with OMEGA Intelligence",
          excerpt: "Learn about OMEGA's predictive capabilities in disease outbreak prediction and prevention through advanced epidemiological modeling.",
          category: "Research",
          tags: ["disease-forecasting", "epidemiology", "prediction", "prevention"]
        }
      ],
      'ANUBIS': [
        {
          title: "ANUBIS Security: Next-Generation Threat Detection",
          excerpt: "Explore ANUBIS's advanced AI-powered security systems that detect, analyze, and neutralize cyber threats in real-time.",
          category: "Technology",
          tags: ["cybersecurity", "threat-detection", "ai-security", "protection"]
        },
        {
          title: "Behavioral Analysis and Anomaly Detection",
          excerpt: "Understanding how ANUBIS uses machine learning to identify suspicious patterns and prevent security breaches before they occur.",
          category: "Innovation",
          tags: ["behavioral-analysis", "anomaly-detection", "machine-learning", "prevention"]
        }
      ],
      'BRIGIT': [
        {
          title: "BRIGIT Assistant: Intelligent Automation",
          excerpt: "Discover how BRIGIT's AI assistant capabilities streamline workflows and enhance productivity through intelligent automation.",
          category: "AI",
          tags: ["ai-assistant", "automation", "productivity", "workflow"]
        },
        {
          title: "Natural Language Processing in BRIGIT",
          excerpt: "Learn about BRIGIT's advanced NLP capabilities that enable natural, intuitive interactions with AI systems.",
          category: "Technology",
          tags: ["nlp", "natural-language", "communication", "interaction"]
        }
      ]
      // Add more systems as needed
    };

    const posts = systemPosts[this.systemName] || [
      {
        title: `${this.systemName} System Overview`,
        excerpt: `Comprehensive overview of ${this.systemName} capabilities and features in the SansMercantile constellation.`,
        category: "Technology",
        tags: [this.systemName.toLowerCase(), "overview", "features", "capabilities"]
      }
    ];

    return posts.map((post, index) => ({
      id: index + 1,
      ...post,
      author: `${this.systemName} Team`,
      date: new Date(Date.now() - (index * 86400000)).toISOString(),
      featured: index === 0,
      readTime: `${Math.floor(Math.random() * 5) + 3} min read`,
      content: this.generatePostContent(post)
    }));
  }

  generatePostContent(post) {
    return `
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <p>This is a detailed article about ${this.systemName} and its innovative capabilities. The system represents cutting-edge technology in the SansMercantile constellation, providing advanced features and functionality.</p>
      <h4>Key Features</h4>
      <ul>
        <li>Advanced AI-powered capabilities</li>
        <li>Real-time processing and analysis</li>
        <li>Seamless integration with other constellation systems</li>
        <li>Scalable and secure architecture</li>
      </ul>
      <div class="status-indicator">
        <div class="status-dot"></div>
        ${this.systemName} Active
      </div>
    `;
  }

  setupBlogInterface() {
    this.createSearchInterface();
    this.createCategoryFilters();
  }

  createSearchInterface() {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'blog-search-container';
    searchContainer.style.cssText = 'margin: 2rem 0; text-align: center;';
    
    searchContainer.innerHTML = `
      <div class="content-card" style="max-width: 600px; margin: 0 auto;">
        <h4>🔍 Search ${this.systemName} Insights</h4>
        <input 
          type="text" 
          id="blog-search" 
          placeholder="Search articles and topics..."
          style="
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--system-primary);
            border-radius: 8px;
            background: rgba(26, 26, 26, 0.5);
            color: var(--system-text);
            font-size: 1rem;
            margin-top: 1rem;
          "
        />
      </div>
    `;

    blogContainer.parentNode.insertBefore(searchContainer, blogContainer);
    
    const searchInput = document.getElementById('blog-search');
    searchInput.addEventListener('input', (e) => {
      this.searchPosts(e.target.value);
    });
  }

  createCategoryFilters() {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'blog-filters';
    filterContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
    `;

    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.textContent = 'All';
    allButton.style.cssText = `
      padding: 8px 16px;
      border: 1px solid var(--system-primary);
      border-radius: 20px;
      background: var(--system-primary);
      color: var(--system-bg);
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    allButton.addEventListener('click', () => this.filterByCategory('all', allButton));
    filterContainer.appendChild(allButton);

    this.categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'filter-btn';
      button.textContent = category;
      button.style.cssText = `
        padding: 8px 16px;
        border: 1px solid var(--system-primary);
        border-radius: 20px;
        background: transparent;
        color: var(--system-primary);
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      button.addEventListener('click', () => this.filterByCategory(category, button));
      filterContainer.appendChild(button);
    });

    blogContainer.parentNode.insertBefore(filterContainer, blogContainer);
  }

  renderBlogPosts(posts = this.posts) {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    blogContainer.innerHTML = posts.map(post => `
      <article class="content-card blog-post" data-post-id="${post.id}">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div class="status-indicator">
            <div class="status-dot"></div>
            ${post.category}
          </div>
          <span style="font-size: 0.9rem; color: var(--system-text-secondary);">${post.readTime}</span>
        </div>
        <h4>${post.title}</h4>
        <p>${post.excerpt}</p>
        <div class="post-meta" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(0, 255, 136, 0.2); display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: var(--system-text-secondary);">
          <span>By ${post.author}</span>
          <span>${new Date(post.date).toLocaleDateString()}</span>
        </div>
        <div class="post-tags" style="margin-top: 1rem;">
          ${post.tags.map(tag => `
            <span style="
              display: inline-block;
              padding: 4px 8px;
              margin: 2px;
              background: rgba(0, 255, 136, 0.2);
              border-radius: 12px;
              font-size: 0.8rem;
              color: var(--system-primary);
            ">#${tag}</span>
          `).join('')}
        </div>
      </article>
    `).join('');

    blogContainer.querySelectorAll('.blog-post').forEach(post => {
      post.addEventListener('click', () => {
        const postId = parseInt(post.dataset.postId);
        this.openPost(postId);
      });
      post.style.cursor = 'pointer';
    });
  }

  searchPosts(query) {
    if (!query.trim()) {
      this.renderBlogPosts();
      return;
    }

    const filteredPosts = this.posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    this.renderBlogPosts(filteredPosts);
  }

  filterByCategory(category, buttonElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--system-primary)';
    });
    buttonElement.style.background = 'var(--system-primary)';
    buttonElement.style.color = 'var(--system-bg)';

    if (category === 'all') {
      this.renderBlogPosts();
    } else {
      const filteredPosts = this.posts.filter(post => post.category === category);
      this.renderBlogPosts(filteredPosts);
    }
  }

  openPost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.createElement('div');
    modal.className = 'post-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 2rem;
      backdrop-filter: blur(10px);
    `;

    modal.innerHTML = `
      <div class="post-content" style="
        background: var(--system-card-bg);
        border: 1px solid var(--system-primary);
        border-radius: 15px;
        padding: 2rem;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      ">
        <button class="close-modal" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--system-primary);
          font-size: 1.5rem;
          cursor: pointer;
        ">×</button>
        
        <div class="status-indicator" style="margin-bottom: 1rem;">
          <div class="status-dot"></div>
          ${post.category}
        </div>
        
        <h2>${post.title}</h2>
        
        <div class="post-meta" style="margin: 1rem 0; padding: 1rem 0; border-bottom: 1px solid var(--system-primary); font-size: 0.9rem; color: var(--system-text-secondary);">
          <div>By ${post.author} • ${new Date(post.date).toLocaleDateString()} • ${post.readTime}</div>
        </div>
        
        <div class="post-body">
          ${post.content}
        </div>
        
        <div class="post-tags" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--system-primary);">
          ${post.tags.map(tag => `
            <span style="
              display: inline-block;
              padding: 6px 12px;
              margin: 4px;
              background: rgba(0, 255, 136, 0.2);
              border-radius: 15px;
              font-size: 0.9rem;
              color: var(--system-primary);
            ">#${tag}</span>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => document.body.removeChild(modal));
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }
}

// Utility Functions
function initializeConstellationWebsite(systemConfig) {
  document.body.classList.add('constellation-enhanced');
  
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.classList.add('futuristic-form');
  });
  
  const buttons = document.querySelectorAll('button, .btn, .cta');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.boxShadow = `0 0 20px ${systemConfig.primaryColor || '#00ff88'}50`;
    });
    button.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });
}

// Export for use in system-specific scripts
window.ConstellationInteractiveSystem = ConstellationInteractiveSystem;
window.ConstellationBlogSystem = ConstellationBlogSystem;
window.initializeConstellationWebsite = initializeConstellationWebsite;