/**
 * Static Site Builder for Rizwan Ansari Portfolio
 * Reads data/content.json and outputs fully-rendered semantic index.html
 */

const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'data', 'content.json');
const outputPath = path.join(__dirname, 'index.html');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Format [TODO] markers into styled visual pills if any remain
function formatText(text) {
  if (!text) return '';
  return text.replace(/\[TODO:?\s*([^\]]+)\]/g, (match, p1) => {
    return `<span class="todo-pill" title="Needs input: ${escapeHtml(p1)}">[TODO: ${escapeHtml(p1)}]</span>`;
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Generate project mapping for modal interactive data
const projectMap = {};
content.featuredProjects.projects.forEach(p => {
  projectMap[p.id] = p;
});

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": content.meta.author,
  "jobTitle": "Salesforce Marketing Cloud Developer",
  "email": "mailto:" + content.contact.email,
  "telephone": content.contact.phone || "+91-9984533621",
  "worksFor": {
    "@type": "Organization",
    "name": "BrinkView LLP"
  },
  "alumnusOf": {
    "@type": "EducationalOrganization",
    "name": "Dr. A. P. J. Abdul Kalam Technical University, Lucknow"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Mumbai",
    "addressCountry": "India"
  },
  "sameAs": [
    content.contact.linkedin,
    content.contact.trailblazer
  ],
  "knowsAbout": [
    "Salesforce Marketing Cloud",
    "Marketing Cloud Next",
    "Salesforce Data Cloud",
    "Agentforce",
    "AMPscript",
    "SSJS",
    "SQL",
    "Campaign Automation",
    "CRM Data Quality",
    "Marketing Operations"
  ]
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  
  <title>${escapeHtml(content.meta.title)}</title>
  <meta name="description" content="${escapeHtml(content.meta.description)}">
  <meta name="author" content="${escapeHtml(content.meta.author)}">
  <meta name="theme-color" content="#0176D3">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(content.meta.siteUrl)}">
  <meta property="og:title" content="${escapeHtml(content.meta.title)}">
  <meta property="og:description" content="${escapeHtml(content.meta.description)}">
  <meta property="og:image" content="${escapeHtml(content.meta.ogImage)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(content.meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(content.meta.description)}">
  <meta name="twitter:image" content="${escapeHtml(content.meta.ogImage)}">

  <!-- Google Font: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/style.css">

  <!-- JSON-LD Structured Data for Person -->
  <script type="application/ld+json">
${JSON.stringify(jsonLdSchema, null, 2)}
  </script>
</head>
<body>
  <!-- Accessibility Skip Link -->
  <a href="#main-content" class="skip-to-content">Skip to main content</a>

  <!-- Navigation Header -->
  <header class="site-header" role="banner">
    <div class="container nav-container">
      <a href="#hero" class="brand-link" aria-label="Rizwan Ansari - Return to top">
        <span class="brand-monogram">RA</span>
        <span>Rizwan Ansari</span>
      </a>

      <nav class="site-nav" role="navigation" aria-label="Primary Navigation">
        <ul class="nav-menu" id="nav-menu">
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#skills" class="nav-link">Skills</a></li>
          <li><a href="#featured-projects" class="nav-link">Featured Projects</a></li>
          <li><a href="#smaller-builds" class="nav-link">Tooling</a></li>
          <li><a href="#certifications" class="nav-link">Certifications</a></li>
          <li><a href="#community" class="nav-link">Community</a></li>
          <li><a href="#contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <div class="nav-controls">
        <button id="theme-toggle-btn" class="theme-toggle-btn" aria-label="Toggle dark mode" title="Toggle color theme">
          <svg id="theme-icon-sun" class="theme-icon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg id="theme-icon-moon" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content Landmark -->
  <main id="main-content" role="main">
    
    <!-- 1. HERO SECTION -->
    <section id="hero" class="hero-section" aria-label="Introduction">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-location">
            <span class="location-dot" aria-hidden="true"></span>
            <span>${escapeHtml(content.hero.location)}</span>
          </div>
          <h1 class="hero-name">${escapeHtml(content.hero.name)}</h1>
          <p class="hero-headline">${escapeHtml(content.hero.headline)}</p>
          <p class="hero-intro">${escapeHtml(content.hero.intro)}</p>
          
          <div class="hero-actions">
            ${content.hero.actions.map(action => {
              const btnClass = action.primary ? 'btn btn-primary' : 'btn btn-secondary';
              const target = action.isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
              return `<a href="${escapeHtml(action.url)}" class="${btnClass}"${target}>${escapeHtml(action.label)}</a>`;
            }).join('\n            ')}
          </div>
        </div>

        <div class="hero-avatar-wrapper">
          <div class="hero-avatar-card">
            <img 
              src="${escapeHtml(content.hero.avatar)}" 
              alt="Portrait of ${escapeHtml(content.hero.name)}" 
              class="hero-avatar-img"
              width="290" 
              height="333"
              loading="eager"
            >
            <div class="hero-avatar-caption">
              <span>SFMC &bull; MCN &bull; Data Cloud</span>
              <span class="location-dot" title="Available for roles"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. ABOUT SECTION -->
    <section id="about" class="about-section" aria-label="About Rizwan Ansari">
      <div class="container">
        <div class="section-header">
          <span class="section-label">01 // Background</span>
          <h2 class="section-title">${escapeHtml(content.about.title)}</h2>
        </div>

        <div class="about-grid">
          <div class="about-bio">
            ${content.about.bio.split('\n\n').map(p => `<p>${formatText(p.trim())}</p>`).join('\n            ')}
          </div>
          <div class="about-stats">
            ${content.about.highlights.map(item => `
              <div class="about-stat-item">
                <div class="stat-label">${escapeHtml(item.title)}</div>
                <div class="stat-value">${escapeHtml(item.value)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SKILLS SECTION -->
    <section id="skills" class="skills-section" aria-label="Technical Skills">
      <div class="container">
        <div class="section-header">
          <span class="section-label">02 // Capabilities</span>
          <h2 class="section-title">${escapeHtml(content.skills.title)}</h2>
          <p class="section-subtitle">Grouped technical capabilities across classical SFMC runtime, next-generation architectures, and engineering tooling.</p>
        </div>

        <div class="skills-grid">
          ${content.skills.groups.map(group => `
            <div class="skill-group-card" id="skill-group-${group.id}">
              <h3 class="skill-group-title">${escapeHtml(group.title)}</h3>
              <p class="skill-group-desc">${escapeHtml(group.description)}</p>
              <div class="skill-tag-list">
                ${group.skills.map(skill => `<span class="badge badge-tag">${escapeHtml(skill)}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 4. FEATURED PROJECTS -->
    <section id="featured-projects" class="projects-section" aria-label="Featured Projects">
      <div class="container">
        <div class="section-header">
          <span class="section-label">03 // Case Studies</span>
          <h2 class="section-title">${escapeHtml(content.featuredProjects.title)}</h2>
          <p class="section-subtitle">${escapeHtml(content.featuredProjects.subtitle)}</p>
        </div>

        <div class="projects-grid">
          ${content.featuredProjects.projects.map(p => `
            <article class="project-card" aria-labelledby="proj-title-${p.id}">
              <div class="project-meta-top">
                <span class="project-category">${escapeHtml(p.category)}</span>
              </div>
              <h3 id="proj-title-${p.id}" class="project-title">${escapeHtml(p.title)}</h3>
              <p class="project-tagline">${escapeHtml(p.tagline)}</p>
              
              <div class="project-tags">
                ${p.tags.map(t => `<span class="badge badge-tag">${escapeHtml(t)}</span>`).join('')}
              </div>

              <div class="project-card-footer">
                <button type="button" class="btn-case-study" data-project-id="${p.id}" aria-haspopup="dialog">
                  <span>View Case Study</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                ${p.caseStudy.link && p.caseStudy.link.startsWith('http') ? `
                  <a href="${escapeHtml(p.caseStudy.link)}" target="_blank" rel="noopener noreferrer" class="btn-case-study" title="Visit project demo">
                    <span>Live App</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                ` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 5. SMALLER BUILDS -->
    <section id="smaller-builds" class="smaller-builds-section" aria-label="Smaller Builds & Tooling">
      <div class="container">
        <div class="section-header">
          <span class="section-label">04 // Tooling & Specs</span>
          <h2 class="section-title">${escapeHtml(content.smallerBuilds.title)}</h2>
          <p class="section-subtitle">${escapeHtml(content.smallerBuilds.subtitle)}</p>
        </div>

        <div class="smaller-builds-grid">
          ${content.smallerBuilds.builds.map(b => `
            <div class="build-card">
              <h3 class="build-title">${escapeHtml(b.title)}</h3>
              <p class="build-desc">${escapeHtml(b.description)}</p>
              <div class="build-tags">
                ${b.tags.map(t => `<span class="badge badge-tag">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 6. CERTIFICATIONS & LEARNING -->
    <section id="certifications" class="certs-section" aria-label="Certifications and Continuous Learning">
      <div class="container">
        <div class="section-header">
          <span class="section-label">05 // Credentials & Learning</span>
          <h2 class="section-title">${escapeHtml(content.certifications.title)}</h2>
        </div>

        <div class="certs-container">
          <!-- Salesforce Credentials -->
          <div>
            <h3 style="font-size:1.125rem; font-weight:700; margin-bottom:16px;">Verified Salesforce Credentials</h3>
            <div class="certs-active-grid">
              ${content.certifications.salesforceCredentials.map(c => `
                <div class="cert-card">
                  <div class="cert-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <div class="cert-content">
                    <div class="cert-name">${escapeHtml(c.name)}</div>
                    <div class="cert-meta">
                      ${escapeHtml(c.status)} &bull; ${escapeHtml(c.date)}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Continuous Learning Initiatives -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
            <div class="challenge-card">
              <div>
                <h3 class="challenge-title">${escapeHtml(content.certifications.challenge.title)}</h3>
                <p class="challenge-desc">${escapeHtml(content.certifications.challenge.description)}</p>
                <div style="margin-top:10px; font-weight:600; font-size:0.875rem; color:var(--accent);">
                  ${escapeHtml(content.certifications.challenge.milestone)}
                </div>
              </div>
            </div>

            <div class="challenge-card">
              <div>
                <h3 class="challenge-title">${escapeHtml(content.certifications.learningInitiative.title)}</h3>
                <p class="challenge-desc">${escapeHtml(content.certifications.learningInitiative.description)}</p>
                <div style="margin-top:10px; font-weight:600; font-size:0.875rem; color:var(--accent);">
                  Self-directed Six-Month Milestone
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. COMMUNITY & WRITING -->
    <section id="community" class="community-section" aria-label="Community Engagement and Technical Writing">
      <div class="container">
        <div class="section-header">
          <span class="section-label">06 // Ecosystem</span>
          <h2 class="section-title">${escapeHtml(content.community.title)}</h2>
          <p class="section-subtitle">${escapeHtml(content.community.subtitle)}</p>
        </div>

        <div class="community-layout">
          <!-- Community Milestones -->
          <div>
            <h3 class="community-column-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Volunteering & Community</span>
            </h3>
            <div class="timeline-list">
              ${content.community.milestones.map(m => `
                <div class="timeline-item">
                  <span class="timeline-dot" aria-hidden="true"></span>
                  <div class="timeline-title">${escapeHtml(m.title)}</div>
                  <div class="timeline-role">${escapeHtml(m.role)}</div>
                  <p class="timeline-desc">${escapeHtml(m.description)}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Technical Posts & Articles -->
          <div>
            <h3 class="community-column-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Writing & Architectural Notes</span>
            </h3>
            <div class="posts-list">
              ${content.community.posts.map(post => `
                <article class="post-card">
                  <h4 class="post-title">${escapeHtml(post.title)}</h4>
                  <p class="post-summary">${escapeHtml(post.summary)}</p>
                  <div class="post-footer">
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                      ${post.tags.map(t => `<span class="badge badge-tag">${escapeHtml(t)}</span>`).join('')}
                    </div>
                    <div>
                      <a href="${escapeHtml(post.url)}" target="_blank" rel="noopener noreferrer" class="post-link">
                        <span>Read on LinkedIn</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. CONTACT SECTION -->
    <section id="contact" class="contact-section" aria-label="Contact Information">
      <div class="container container-narrow">
        <div class="section-header">
          <span class="section-label">07 // Connect</span>
          <h2 class="section-title">${escapeHtml(content.contact.title)}</h2>
        </div>

        <div class="contact-card">
          <p class="contact-roles">${escapeHtml(content.contact.openRolesText)}</p>

          <div class="contact-channels-grid">
            <div class="contact-channel">
              <span class="channel-label">Email</span>
              <a href="mailto:${escapeHtml(content.contact.email)}" class="channel-value">${escapeHtml(content.contact.email)}</a>
            </div>

            <div class="contact-channel">
              <span class="channel-label">Phone</span>
              <a href="tel:${escapeHtml(content.contact.phone.replace(/[^0-9+]/g, ''))}" class="channel-value">${escapeHtml(content.contact.phone)}</a>
            </div>

            <div class="contact-channel">
              <span class="channel-label">LinkedIn</span>
              <a href="${escapeHtml(content.contact.linkedin)}" target="_blank" rel="noopener noreferrer" class="channel-value">linkedin.com/in/rizwan-ansari</a>
            </div>

            <div class="contact-channel">
              <span class="channel-label">Trailblazer Profile</span>
              <a href="${escapeHtml(content.contact.trailblazer)}" target="_blank" rel="noopener noreferrer" class="channel-value">trailblazer.me/mrizzu4</a>
            </div>

            <div class="contact-channel" style="grid-column: 1 / -1;">
              <span class="channel-label">Location & Status</span>
              <span class="channel-value">${escapeHtml(content.contact.location)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Site Footer -->
  <footer class="site-footer" role="contentinfo">
    <div class="container footer-content">
      <div>
        &copy; ${new Date().getFullYear()} Rizwan Ansari. Salesforce Marketing Cloud & Data Cloud Developer.
      </div>
      <div>
        <a href="#hero" class="nav-link">Back to top &uarr;</a>
      </div>
    </div>
  </footer>

  <!-- Accessible Case Study Modal Dialog -->
  <dialog id="project-modal" class="modal-dialog" aria-labelledby="modal-project-title" aria-modal="true">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <div id="modal-project-category" class="modal-category">Featured Project</div>
          <h2 id="modal-project-title" class="modal-title">Case Study Title</h2>
        </div>
        <button id="modal-close-btn" class="modal-close-btn" aria-label="Close case study dialog">&times;</button>
      </div>

      <div class="modal-body">
        <div>
          <h3 class="modal-section-title">The Problem</h3>
          <p id="modal-problem" class="modal-text"></p>
        </div>

        <div>
          <h3 class="modal-section-title">What I Built</h3>
          <p id="modal-what-built" class="modal-text"></p>
        </div>

        <div>
          <h3 class="modal-section-title">Tools & Architecture</h3>
          <div id="modal-tools" class="modal-tools-list"></div>
        </div>

        <div>
          <h3 class="modal-section-title">Outcome & Impact</h3>
          <p id="modal-outcome" class="modal-text"></p>
        </div>
      </div>

      <div class="modal-footer">
        <button id="modal-footer-close-btn" class="btn btn-secondary" type="button">Close</button>
        <a id="modal-external-link" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:none;">View Live Project</a>
      </div>
    </div>
  </dialog>

  <!-- Embedded Project Data for Client-Side Modal Interaction -->
  <script type="application/json" id="projects-data">
${JSON.stringify(projectMap, null, 2)}
  </script>

  <!-- Application Interaction Logic -->
  <script src="js/app.js"></script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Successfully generated index.html at ${outputPath} (${html.length} bytes)`);
