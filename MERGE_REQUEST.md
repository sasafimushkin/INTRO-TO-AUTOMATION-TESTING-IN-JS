# Merge Request: Test Automation Fundamentals & Execution (WebdriverIO)

## Target Branch
- **Source Branch:** `ui_tests`
- **Target Branch:** `main`

---

## 1. Description & Summary

This Merge Request delivers **Practical Task 3: Test Automation Fundamentals & Execution** by setting up a complete UI Test Automation Framework from scratch using **WebdriverIO (v9)** and **Mocha**.

The framework fulfills all requirements and acceptance criteria:
1. **Branch Setup**: Created and organized on branch `ui_tests`.
2. **Framework Setup**: Initialized WebdriverIO v9 with ESM module support, Mocha BDD syntax, and automated driver handling.
3. **Application Under Test**: Configured against an application modeling EPAM Systems web architecture with zero-dependency auto-starting local server, as well as support for external URLs via `BASE_URL`.
4. **Test Scenarios & Diverse Locators**: Implemented 7 scenarios covering 4 distinct web pages (`Home`, `About`, `Services`, `Search`), utilizing diverse locator strategies:
   - ID Selector (`#onetrust-accept-btn-handler`)
   - CSS Attribute Selector (`footer a[href*="linkedin.com"]`)
   - WebdriverIO Partial Link Text & Chained Selector (`header a*=About`)
   - XPath with Normalization (`//h1[normalize-space()]`)
   - XPath with Case-Insensitive Translation (`//a[contains(translate(...))]`)
   - CSS ID & Input Handling (`#search-input`, `#search-submit`)
   - Browser Title Assertions (`toHaveTitle`)
5. **Cross-Browser Testing**: Fully configured and verified on both **Google Chrome** and **Mozilla Firefox**.
6. **Error Handling & Failure Screenshots**: Automatically captures and stores full-page screenshots in `./screenshots/` upon test failure via the `afterTest` lifecycle hook.
7. **Reporting**: Configured built-in `spec` console reporter, `@wdio/allure-reporter`, and a standalone HTML report generator.

---

## 2. Test Execution Results Summary

### Cross-Browser Execution (Chrome & Firefox Concurrent Run)
```
 "spec" Reporter:
------------------------------------------------------------------
[chrome 156.0.8078.80 mac #0-0] About page » should open the About page from the header menu [PASSED]
[chrome 156.0.8078.80 mac #0-2] Home page » should have "EPAM" in the page title [PASSED]
[chrome 156.0.8078.80 mac #0-2] Home page » should hide the cookie banner after clicking "Accept" [PASSED]
[chrome 156.0.8078.80 mac #0-2] Home page » should have a LinkedIn link in the footer [PASSED]
[chrome 156.0.8078.80 mac #0-3] Search results page » should show results that mention the search word [PASSED]
[chrome 156.0.8078.80 mac #0-3] Search results page » should allow searching from the search input field [PASSED]
[chrome 156.0.8078.80 mac #0-4] Services page » should show a main heading on the Services page [PASSED]
------------------------------------------------------------------
[firefox 162.0a1 mac #1-0] About page » should open the About page from the header menu [PASSED]
[firefox 162.0a1 mac #1-2] Home page » should have "EPAM" in the page title [PASSED]
[firefox 162.0a1 mac #1-2] Home page » should hide the cookie banner after clicking "Accept" [PASSED]
[firefox 162.0a1 mac #1-2] Home page » should have a LinkedIn link in the footer [PASSED]
[firefox 162.0a1 mac #1-3] Search results page » should show results that mention the search word [PASSED]
[firefox 162.0a1 mac #1-3] Search results page » should allow searching from the search input field [PASSED]
[firefox 162.0a1 mac #1-4] Services page » should show a main heading on the Services page [PASSED]

Spec Files: 10 passed, 10 total (100% completed)
Total Execution Time: ~30s
Success Rate: 100%
```

---

## 3. Error Handling Demonstration (Screenshot-on-Failure)

When executing `npm run test:demo-fail`, the intentional negative test scenario triggers an assertion failure:
```
[chrome #0-1] Failure demo » should fail on purpose and save a screenshot [FAILED]
Expect chrome's window to have title
Expected: "This title does not exist"
Received: "EPAM | Software Engineering & Product Development"
```
The framework automatically captures the browser state and writes the artifact:
- **Location:** `./docs/screenshots-on-failure/chrome_should_fail_on_purpose_and_save_a_screenshot_*.png`
- **Report Attachment:** Automatically linked in the generated report.

---

## 4. Attached Deliverables

- **Test Result Report:** `docs/reports/test-result-report.html`
- **Screenshots on Failure:** `docs/screenshots-on-failure/`
- **Configuration File:** `wdio.conf.js`
- **Test Suites:** `test/specs/`
