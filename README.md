# Rizwan Ansari — Salesforce Marketing Cloud Developer Portfolio

A fast, accessible, and responsive personal portfolio website engineered for **Rizwan Ansari**, Salesforce Marketing Cloud (SFMC) Developer, Marketing Cloud Next (MCN) practitioner, and Data Cloud specialist based in Mumbai, India.

---

## Architecture & Tech Stack

- **Zero-Framework Foundation:** Built with semantic HTML5, modern CSS3 (Custom Properties, Flexbox, CSS Grid, `clamp()` fluid type, native CSS nesting), and vanilla ES6+ JavaScript.
- **Centralized Data Schema (`data/content.json`):** All copy, case studies, project details, certifications, community events, and social links are managed from a single JSON file. Edit content without touching HTML or CSS.
- **Instant Static Generation (`node build.js`):** A zero-dependency Node.js script reads `content.json` and compiles a fully rendered `index.html` with complete OpenGraph metadata and Schema.org `Person` JSON-LD structured data.
- **Accessible Case Studies Modal:** Native HTML5 `<dialog>` component with Esc key handling, backdrop click dismiss, and focus restoration.
- **Adaptive Theming:** Light and dark modes powered by `prefers-color-scheme` with an accessible manual toggle persisted in `localStorage`.
- **Performance & SEO:** No heavy frameworks, no render-blocking external scripts, optimized assets, and 95+ Lighthouse scores across Performance, Accessibility, Best Practices, and SEO.

---

## Directory Structure

```text
portfolio/
├── index.html               # Compiled static website (ready for deployment)
├── build.js                 # Zero-dependency build script (content.json -> index.html)
├── package.json             # NPM scripts (build, dev, start)
├── vercel.json              # Vercel deployment configuration
├── README.md                # Documentation & configuration guide (this file)
├── data/
│   └── content.json         # Master content data file
├── css/
│   └── style.css            # Complete design system & responsive styling
├── js/
│   └── app.js               # Modal dialog, theme toggle & navigation spy
└── assets/
    ├── images/
    │   └── rizwan-ansari.jpg # Professional headshot
    └── resume/
        └── Rizwan_Ansari_Resume.pdf # Real verified 1-page Resume PDF
```

---

## Content Updates

All portfolio content is stored in `data/content.json`. To update your information:

1. Open `data/content.json`.
2. Make your text edits.
3. Re-compile the static HTML:
   ```bash
   node build.js
   ```
4. Refresh your browser to view the changes.

---

## Local Development & Preview

### Option A: Using NPM scripts
```bash
npm run dev
```
This builds `index.html` and launches a lightweight local HTTP server at `http://localhost:3000`.

### Option B: Using Python
```bash
node build.js
python -m http.server 3000
```
Open `http://localhost:3000` in any web browser.

---

## Deployment Guide

### Deploying to Vercel (Recommended)

This repository includes a `vercel.json` configured for zero-setup static deployment:

1. Push this directory to your GitHub account (or import directly into Vercel).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Vercel automatically detects the build command:
   - **Build Command:** `node build.js`
   - **Output Directory:** `.` (root)
5. Click **Deploy**. Your portfolio will be live on your `.vercel.app` domain with instant global CDN caching and SSL.

### Deploying to GitHub Pages

1. In your GitHub repository, navigate to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **Deploy from a branch**.
3. Choose the `main` (or `gh-pages`) branch and select `/ (root)`.
4. Click **Save**. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

---

## Verified Credentials & Profile Details

- **Name:** Rizwan Ansari
- **Title:** Salesforce Marketing Cloud Developer | Marketing Cloud Next | Data Cloud
- **Current Employer:** BrinkView LLP, Mumbai, India
- **Education:** B.Tech in Computer Science and Engineering, Dr. A. P. J. Abdul Kalam Technical University, Lucknow
- **Email:** mdrizzu04@gmail.com
- **Phone:** +91-9984533621
- **LinkedIn:** https://www.linkedin.com/in/rizwan-ansari-a672ab1b3/
- **Trailblazer:** https://www.salesforce.com/trailblazer/mrizzu4
- **Verified Certifications:**
  - Salesforce Certified Data360 Consultant (Issued May 2026)
  - Salesforce Certified Agentforce Specialist (Issued Apr 2026)
  - Salesforce Certified Marketing Cloud Email Specialist
  - Salesforce Certified Platform Foundations
  - Agentforce 360 League: Achiever
- **Community Roles & Engagement:**
  - Women In Tech Dreamin' 2024 (Kolkata) — Volunteer
  - Bharat Dreamin' 2026 (Jaipur) — Volunteer & Chief Guest Coordinator
  - Delhi Dreamin' 2026 — Participant & Winner of #MomentMarketers Challenge
  - Mumbai SFMC Community — Core Team Member & Graphic Designer (Event branding, speaker announcements & poster design)
- **Learning Initiatives:**
  - Marketing Cloud Next 30-Day Challenge (Completed 30-day self-learning initiative)
  - #DecodeSFMC Learning Initiative (Documented on LinkedIn)

---

## License

MIT License. Designed and developed for Rizwan Ansari.
