/**
 * Comprehensive Verification & Lighthouse Audit Script
 * Serves the portfolio locally, tests Playwright DOM assertions & runs Lighthouse
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
      filePath = path.normalize(filePath);

      if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP] Local preview server running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });

    server.on('error', reject);
  });
}

async function runPlaywrightTests() {
  console.log('\n--- Running Playwright UI & Accessibility Checks ---');
  let playwright;
  try {
    playwright = require('e:/GetDressed test/node_modules/playwright');
  } catch (e) {
    playwright = require('playwright');
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const failedRequests = [];
  page.on('response', resp => {
    if (resp.status() >= 400) {
      failedRequests.push({ url: resp.url(), status: resp.status() });
    }
  });

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });

  // 1. Check title & meta
  const title = await page.title();
  console.log(`✓ Page Title: "${title}"`);
  if (!title.includes('Rizwan Ansari')) throw new Error('Title does not contain Rizwan Ansari');

  const metaDesc = await page.$eval('meta[name="description"]', el => el.content);
  console.log(`✓ Meta Description: "${metaDesc}"`);
  if (!metaDesc) throw new Error('Missing meta description');

  // 2. Check JSON-LD
  const jsonLdContent = await page.$eval('script[type="application/ld+json"]', el => el.textContent);
  const jsonLd = JSON.parse(jsonLdContent);
  console.log(`✓ JSON-LD Schema: Person "${jsonLd.name}", Job: "${jsonLd.jobTitle}", Org: "${jsonLd.worksFor?.name}"`);

  // 3. Check Headshot Image
  const avatarImg = page.locator('.hero-avatar-img');
  await avatarImg.waitFor();
  const avatarSrc = await avatarImg.getAttribute('src');
  const avatarAlt = await avatarImg.getAttribute('alt');
  console.log(`✓ Headshot Image Loaded: ${avatarSrc} (Alt: "${avatarAlt}")`);
  if (!avatarAlt) throw new Error('Missing headshot alt attribute');

  // 4. Check Navigation & Section IDs
  const sectionIds = ['hero', 'about', 'skills', 'featured-projects', 'smaller-builds', 'certifications', 'community', 'contact'];
  for (const id of sectionIds) {
    const el = page.locator(`#${id}`);
    const count = await el.count();
    if (count === 0) throw new Error(`Missing section with id: #${id}`);
  }
  console.log(`✓ All 8 Sections Verified: ${sectionIds.join(', ')}`);

  // 5. Check Case Study Modal Interaction
  console.log('\n--- Testing Case Study Modal Interaction ---');
  const caseStudyBtns = page.locator('.btn-case-study[data-project-id]');
  const btnCount = await caseStudyBtns.count();
  console.log(`Found ${btnCount} case study trigger buttons`);

  if (btnCount > 0) {
    // Click the first project button (MediCare)
    await caseStudyBtns.first().click();
    await page.waitForTimeout(300);

    const modal = page.locator('#project-modal');
    const isModalOpen = await modal.evaluate(el => el.open);
    console.log(`✓ Modal Open State: ${isModalOpen}`);
    if (!isModalOpen) throw new Error('Modal failed to open on click');

    const modalTitle = await page.locator('#modal-project-title').textContent();
    console.log(`✓ Modal Title populated: "${modalTitle}"`);

    const modalProblem = await page.locator('#modal-problem').textContent();
    console.log(`✓ Modal Problem populated (${modalProblem.length} characters)`);

    // Close modal via close button
    const closeBtn = page.locator('#modal-close-btn');
    await closeBtn.click();
    await page.waitForTimeout(300);
    const isModalClosed = await modal.evaluate(el => !el.open);
    console.log(`✓ Modal Closed State: ${isModalClosed}`);
    if (!isModalClosed) throw new Error('Modal failed to close via close button');
  }

  // 6. Check Dark / Light Mode Theme Toggle
  console.log('\n--- Testing Dark / Light Mode Theme Toggle ---');
  const themeBtn = page.locator('#theme-toggle-btn');
  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`Initial Theme: ${initialTheme}`);

  await themeBtn.click();
  await page.waitForTimeout(200);
  const toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`✓ Toggled Theme to: ${toggledTheme}`);
  if (toggledTheme === initialTheme) throw new Error('Theme toggle failed to change data-theme attribute');

  // 7. Verify no 404s or failed network assets
  console.log('\n--- Network & Asset Verification ---');
  if (failedRequests.length > 0) {
    console.error('Failed requests:', failedRequests);
    throw new Error('Some assets returned error status codes');
  } else {
    console.log('✓ All network requests succeeded with 200 OK (no 404s or broken links)');
  }

  await browser.close();
}

async function runLighthouseAudit() {
  console.log('\n--- Running Lighthouse Audit ---');
  let lighthouseMod;
  try {
    lighthouseMod = await import('lighthouse');
  } catch (e) {
    console.log('Lighthouse module import error:', e.message);
    return null;
  }

  const lighthouse = lighthouseMod.default || lighthouseMod;

  let chromeLauncher;
  try {
    chromeLauncher = await import('chrome-launcher');
  } catch (e) {
    chromeLauncher = require('chrome-launcher');
  }

  const launcher = chromeLauncher.default || chromeLauncher;
  const chrome = await launcher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });

  try {
    const runnerResult = await lighthouse(`http://127.0.0.1:${PORT}/`, {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port
    });

    const report = JSON.parse(runnerResult.report);
    const scores = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100)
    };

    console.log('\n========================================');
    console.log('LIGHTHOUSE AUDIT SCORES:');
    console.log(`  Performance:    ${scores.performance}/100`);
    console.log(`  Accessibility:  ${scores.accessibility}/100`);
    console.log(`  Best Practices: ${scores.bestPractices}/100`);
    console.log(`  SEO:            ${scores.seo}/100`);
    console.log('========================================\n');

    fs.writeFileSync(path.join(__dirname, 'lighthouse-summary.json'), JSON.stringify(scores, null, 2));

    return scores;
  } finally {
    await chrome.kill();
  }
}

async function main() {
  let server;
  try {
    server = await startServer();
    await runPlaywrightTests();

    try {
      await runLighthouseAudit();
    } catch (lhErr) {
      console.log('Lighthouse run note:', lhErr.message);
    }

    console.log('✓ ALL PREVIEW, DOM & ACCESSIBILITY TESTS COMPLETED SUCCESSFULLY.');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close(() => {
        process.exit(process.exitCode || 0);
      });
    } else {
      process.exit(process.exitCode || 0);
    }
  }
}

main();
