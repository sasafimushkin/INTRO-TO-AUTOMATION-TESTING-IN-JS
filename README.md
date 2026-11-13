# EPAM UI Test Automation Framework (WebdriverIO)

> **PRACTICAL TASK 3: WEBDRIVERIO — Test Automation Fundamentals & Execution**

This repository contains an end-to-end UI test automation framework built **from scratch** using **WebdriverIO (v9)**, **Mocha**, and **Allure Reporter**. It features cross-browser execution on **Google Chrome** and **Mozilla Firefox**, automatic screenshot capture on test failure, and comprehensive test reporting.

---

## ✅ Task Requirements Checklist

| # | Task Condition | Status | Details |
|---|---|---|---|
| 1 | **Create a New Branch** named `ui_tests` | ✅ Done | Branch `ui_tests` created from `main` |
| 2 | **Select a Framework**: Initialize and use WebdriverIO | ✅ Done | WebdriverIO v9.33.1 + Mocha BDD |
| 3 | **Project Configuration**: Initialize from scratch, use epam.com or own app | ✅ Done | Local app modeling EPAM structure (4 pages). Supports `BASE_URL=https://www.epam.com` |
| 4 | **Write Test Scenarios**: Minimum 5 scenarios, at least 3 webpages, diverse locators (CSS, XPath, etc.) | ✅ Done | **7 scenarios** across **4 web pages** using ID, CSS Attribute, Partial Link Text, XPath, Form selectors |
| 5 | **Cross-Browser Testing**: Execute on Chrome and Firefox | ✅ Done | Both Chrome and Firefox configured and verified (10/10 passed) |
| 6 | **Error Handling**: Auto-capture screenshots for failed tests | ✅ Done | `afterTest` hook in `wdio.conf.js` saves timestamped `.png` to `./screenshots/` |
| 7 | **Reporting**: Configure a test reporter (spec or Allure) | ✅ Done | Spec Reporter (console) + Allure Reporter + HTML Report Generator |
| 8 | **Milestone Deliverable**: Prepare and submit Merge Request | ✅ Done | `MERGE_REQUEST.md` with attached report and screenshots |

### Acceptance Criteria Verification

| Acceptance Criterion | Status |
|---|---|
| A new project is correctly set up from scratch using WebdriverIO | ✅ Verified |
| At least 5 test scenarios are created, each utilizing a diverse locator strategy (CSS, XPath, etc.) | ✅ 7 scenarios with ID, CSS, XPath, Partial Link Text, Chained selectors |
| Successful execution of test scenarios on both Chrome and Firefox | ✅ 10/10 spec files passed (5 Chrome + 5 Firefox) |
| Configuration includes automatic screenshot capture for any failed tests | ✅ `afterTest` hook captures screenshots; verified via `npm run test:demo-fail` |
| Detailed Test Result Reports are generated successfully | ✅ Spec Reporter + Allure + HTML report in `docs/reports/` |
| Merge request to main branch with attached Test result report and Screenshots-on-failure is provided | ✅ `MERGE_REQUEST.md` + `docs/reports/` + `docs/screenshots-on-failure/` |

---

## Table of Contents

- [Project Architecture](#project-architecture)
- [Application Under Test](#application-under-test)
- [Implemented Test Scenarios & Locator Strategies](#implemented-test-scenarios--locator-strategies)
- [Cross-Browser Execution](#cross-browser-execution)
- [Error Handling & Automatic Screenshots](#error-handling--automatic-screenshots)
- [Test Reporting](#test-reporting)
- [Installation & Prerequisites](#installation--prerequisites)
- [How to Run Tests](#how-to-run-tests)
- [Deliverables & Merge Request](#deliverables--merge-request)

---

## Project Architecture

```
wdio-epam-ui-tests/
├── app/                        # Application Under Test (local EPAM model)
│   ├── server.js               # Zero-dependency Node.js HTTP server
│   └── public/                 # Multi-page web application
│       ├── index.html          # Home page (cookie banner, hero, LinkedIn footer)
│       ├── about.html          # About page (stats, company info)
│       ├── services.html       # Services page (service listings, h1)
│       ├── search.html         # Search page (dynamic query, form)
│       └── styles.css          # Modern styling
├── docs/                       # Milestone deliverable artifacts
│   ├── reports/                # Saved HTML execution reports
│   │   └── test-result-report.html
│   └── screenshots-on-failure/ # Automatically captured failure screenshots
│       └── chrome_should_fail_on_purpose_and_save_a_screenshot_*.png
├── scripts/
│   └── generate-html-report.js # Standalone HTML test reporter generator
├── test/
│   ├── helpers/
│   │   └── cookies.js          # Resilient cookie banner handler
│   └── specs/                  # Test suites covering 4 web pages
│       ├── home.e2e.js         # Home page scenarios
│       ├── about.e2e.js        # About page scenarios
│       ├── services.e2e.js     # Services page scenarios
│       ├── search.e2e.js       # Search results & form scenarios
│       └── failure-demo.e2e.js # Failure screenshot demonstration scenario
├── MERGE_REQUEST.md            # Merge request template & deliverable text
├── package.json                # Project dependencies and test scripts
├── wdio.conf.js                # WebdriverIO central configuration
└── README.md                   # Complete documentation
```

---

## Application Under Test

Per Task Condition 3 (*"Use https://www.epam.com (or your own application) as the application under test"*):
- Public `epam.com` utilizes Cloudflare Turnstile anti-bot security which returns HTTP 403 / captcha challenges to automated browsers.
- To ensure 100% reliable execution in automated pipelines, this repository includes a dedicated local web application mirroring EPAM's website structure (`Home`, `About`, `Services`, `Search`).
- The local server is automatically booted by `wdio.conf.js` in `onPrepare` and gracefully terminated in `onComplete`.
- To execute against an external URL instead, simply supply `BASE_URL`:
  ```bash
  BASE_URL=https://www.epam.com npm test
  ```

---

## Implemented Test Scenarios & Locator Strategies

A total of **7 scenarios** across **4 distinct web pages** are implemented, utilizing diverse locator strategies:

| # | Web Page | Scenario | Locator Strategy | Selector Used |
|---|---|---|---|---|
| 1 | **Home Page** (`/`) | Page Title Verification | Browser level | `expect(browser).toHaveTitle(...)` |
| 2 | **Home Page** (`/`) | Cookie Banner Acceptance | **ID Selector** | `$('#onetrust-accept-btn-handler')` |
| 3 | **Home Page** (`/`) | Footer LinkedIn Verification | **CSS Attribute Selector** | `$('footer a[href*="linkedin.com"]')` |
| 4 | **About Page** (`/about`) | Header Navigation to About | **WDIO Partial Link Text & Chained Selector** | `$('header').$('a*=About')` |
| 5 | **Services Page** (`/services`) | Services Main Heading Verification | **XPath with text normalization** | `$('//h1[normalize-space()]')` |
| 6 | **Search Page** (`/search`) | Search Keyword Results Verification | **XPath with case-insensitive translation** | `$('//a[contains(translate(text(), "A...", "a..."), "automation")]')` |
| 7 | **Search Page** (`/search`) | Form Input & Submission | **CSS Element & ID Selectors** | `$('#search-input')`, `$('#search-submit')` |

An additional scenario (`failure-demo.e2e.js`) is provided to verify error handling and automatic failure screenshot capture.

---

## Cross-Browser Testing

Configured in `wdio.conf.js` to execute against both **Google Chrome** and **Mozilla Firefox**:

```javascript
const allCapabilities = [
    {
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: headless ? ['--headless=new', '--disable-gpu'] : [],
        },
    },
    {
        browserName: 'firefox',
        'moz:firefoxOptions': {
            args: headless ? ['-headless'] : [],
        },
    },
];
```

WebdriverIO manages browser drivers (Chromedriver & Geckodriver) automatically.

---

## Error Handling & Automatic Screenshots

In `wdio.conf.js`, the `afterTest` lifecycle hook detects test failures, creates the `./screenshots/` directory, and saves a timestamped screenshot:

```javascript
async afterTest(test, context, { passed }) {
    if (passed) return;

    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

    const browserName = browser.capabilities.browserName;
    const safeTitle = test.title.replace(/[^a-z0-9]+/gi, '_');
    const fileName = `${browserName}_${safeTitle}_${Date.now()}.png`;

    await browser.saveScreenshot(path.join(SCREENSHOT_DIR, fileName));
}
```

The captured screenshots are also attached to the Allure report and standalone HTML report.

---

## Test Reporting

1. **Spec Reporter (Console)**: Displays real-time test execution trees, durations, passing/failing marks, and stack traces.
2. **Allure Reporter**: Produces standard Allure test results in `./allure-results`.
3. **HTML Report Generator (`reports/index.html`)**: Generates a self-contained HTML test report including summary cards, browser details, error traces, and embedded failure screenshots (no Java required).

---

## Installation & Prerequisites

- **Node.js**: v18+ (tested on Node.js v20+)
- **Google Chrome** and/or **Mozilla Firefox**

Install dependencies:
```bash
npm install
```

---

## How to Run Tests

### 1. Run all tests on Chrome & Firefox (Headless)
```bash
npm run test:headless
# or
npm test
```

### 2. Run tests on a single browser
```bash
npm run test:chrome      # Google Chrome only
npm run test:firefox     # Mozilla Firefox only
```

### 3. Verify Error Handling & Screenshot on Failure
```bash
npm run test:demo-fail
```
This intentionally fails an assertion in `failure-demo.e2e.js` and writes the failure screenshot to `./screenshots/`.

### 4. Generate and Open Test Reports
```bash
npm run report:generate  # Generates HTML report in ./reports/index.html
npm run report:open      # Opens the generated report in your browser
```

---

## Deliverables & Merge Request

- **Branch**: `ui_tests`
- **Target Branch**: `main`
- **Merge Request Details**: See [MERGE_REQUEST.md](./MERGE_REQUEST.md)
- **Attached Artifacts**:
  - `docs/reports/test-result-report.html`
  - `docs/screenshots-on-failure/chrome_should_fail_on_purpose_and_save_a_screenshot_*.png`
