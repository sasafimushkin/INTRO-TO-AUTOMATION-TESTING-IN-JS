import fs from 'node:fs';
import path from 'node:path';

const RESULTS_DIR = './allure-results';
const SCREENSHOTS_DIR = './screenshots';
const OUTPUT_DIR = './reports';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.html');

export function generateReport() {
    if (!fs.existsSync(RESULTS_DIR)) {
        console.error('No allure-results directory found. Run tests first.');
        return;
    }

    const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('-result.json'));
    const results = files.map(file => {
        try {
            return JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, file), 'utf8'));
        } catch {
            return null;
        }
    }).filter(Boolean);

    const screenshots = fs.existsSync(SCREENSHOTS_DIR) 
        ? fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'))
        : [];

    let total = results.length;
    let passed = results.filter(r => r.status === 'passed').length;
    let failed = results.filter(r => r.status === 'failed' || r.status === 'broken').length;
    let skipped = results.filter(r => r.status === 'skipped').length;

    const testRows = results.map(r => {
        const browser = (r.parameters?.find(p => p.name === 'browser')?.value || 'unknown');
        const duration = r.stop && r.start ? ((r.stop - r.start) / 1000).toFixed(2) + 's' : 'N/A';
        const suite = r.labels?.find(l => l.name === 'parentSuite')?.value || 'Default Suite';
        const badgeClass = r.status === 'passed' ? 'badge-passed' : r.status === 'failed' ? 'badge-failed' : 'badge-skipped';

        let detailsHtml = '';
        if (r.statusDetails?.message) {
            detailsHtml = `<pre class="error-msg"><code>${escapeHtml(r.statusDetails.message)}</code></pre>`;
        }

        // Check if there is a matching screenshot
        const matchingScreenshot = screenshots.find(s => s.toLowerCase().includes(browser.split('-')[0].toLowerCase()));
        let screenshotHtml = '';
        if (r.status === 'failed' && matchingScreenshot) {
            const relPath = path.relative(OUTPUT_DIR, path.join(SCREENSHOTS_DIR, matchingScreenshot));
            screenshotHtml = `
                <div class="screenshot-box">
                    <strong>Captured Screenshot on Failure:</strong><br>
                    <a href="${relPath}" target="_blank">
                        <img src="${relPath}" alt="Failure Screenshot" class="screenshot-preview">
                    </a>
                </div>
            `;
        }

        return `
            <tr class="row-${r.status}">
                <td><span class="badge ${badgeClass}">${r.status.toUpperCase()}</span></td>
                <td><strong>${escapeHtml(suite)}</strong></td>
                <td>${escapeHtml(r.name)}</td>
                <td><span class="browser-pill">${escapeHtml(browser)}</span></td>
                <td>${duration}</td>
            </tr>
            ${detailsHtml || screenshotHtml ? `
            <tr class="details-row">
                <td colspan="5">
                    ${detailsHtml}
                    ${screenshotHtml}
                </td>
            </tr>
            ` : ''}
        `;
    }).join('\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebdriverIO Test Execution Report</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f4f6f8; color: #333; padding: 2rem; }
        .container { max-width: 1200px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
        header { background: #0b1325; color: #fff; padding: 2rem; }
        h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #00bcd4; }
        .meta { color: #cfd8dc; font-size: 0.9rem; }
        .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1.5rem 2rem; background: #fafbfc; border-bottom: 1px solid #e1e4e8; }
        .card { padding: 1rem; border-radius: 6px; text-align: center; }
        .card-total { background: #e3f2fd; color: #0277bd; }
        .card-passed { background: #e8f5e9; color: #2e7d32; }
        .card-failed { background: #ffebee; color: #c62828; }
        .card-skipped { background: #fff8e1; color: #f57f17; }
        .card-num { font-size: 2rem; font-weight: bold; display: block; }
        .card-label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-size: 0.85rem; text-transform: uppercase; color: #666; }
        .badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
        .badge-passed { background: #c8e6c9; color: #2e7d32; }
        .badge-failed { background: #ffcdd2; color: #b71c1c; }
        .badge-skipped { background: #ffe082; color: #e65100; }
        .browser-pill { background: #eceff1; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem; font-family: monospace; }
        .error-msg { background: #263238; color: #ff80ab; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.85rem; margin-top: 0.5rem; }
        .screenshot-box { margin-top: 0.75rem; }
        .screenshot-preview { max-width: 400px; border: 1px solid #ccc; border-radius: 4px; margin-top: 0.5rem; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>WebdriverIO Test Automation Execution Report</h1>
            <div class="meta">Application Under Test: EPAM Systems / Local App &bull; Generated: ${new Date().toLocaleString()}</div>
        </header>

        <section class="summary-cards">
            <div class="card card-total">
                <span class="card-num">${total}</span>
                <span class="card-label">Total Tests</span>
            </div>
            <div class="card card-passed">
                <span class="card-num">${passed}</span>
                <span class="card-label">Passed</span>
            </div>
            <div class="card card-failed">
                <span class="card-num">${failed}</span>
                <span class="card-label">Failed</span>
            </div>
            <div class="card card-skipped">
                <span class="card-num">${skipped}</span>
                <span class="card-label">Skipped</span>
            </div>
        </section>

        <section style="padding: 1.5rem 2rem;">
            <h2>Test Results Breakdown</h2>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Suite</th>
                        <th>Test Scenario</th>
                        <th>Browser</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    ${testRows}
                </tbody>
            </table>
        </section>
    </div>
</body>
</html>`;

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, html, 'utf8');
    console.log(`[Report Generator] HTML Test Report generated at ${OUTPUT_FILE}`);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    generateReport();
}

