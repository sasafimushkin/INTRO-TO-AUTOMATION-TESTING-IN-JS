import fs from 'node:fs';
import path from 'node:path';
import { createServer } from './app/server.js';

let localServer;

// Run in headless mode (no visible browser window) when HEADLESS=true
const headless = process.env.HEADLESS === 'true';

// Pick browsers with BROWSERS=chrome or BROWSERS=firefox (default: both)
const selectedBrowsers = (process.env.BROWSERS || 'chrome,firefox')
    .split(',')
    .map((name) => name.trim().toLowerCase());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const defaultBaseUrl = `http://localhost:${PORT}`;
const targetBaseUrl = process.env.BASE_URL || defaultBaseUrl;

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

const SCREENSHOT_DIR = './screenshots';

export const config = {
    runner: 'local',

    // Where the test files are
    specs: ['./test/specs/**/*.e2e.js'],

    // How many browsers can run at the same time
    maxInstances: 2,

    // Cross-browser testing: Chrome + Firefox
    capabilities: allCapabilities.filter((cap) =>
        selectedBrowsers.includes(cap.browserName)
    ),

    logLevel: 'warn',

    // Application Under Test
    baseUrl: targetBaseUrl,

    // Default wait for waitFor* commands and expect() matchers (ms)
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    // Reporting: spec (console) + Allure (HTML report)
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],

    // Runs once before workers start: clean old artifacts & launch server if needed
    async onPrepare() {
        fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true });
        fs.rmSync('./allure-results', { recursive: true, force: true });

        if (targetBaseUrl.includes('localhost') || targetBaseUrl.includes('127.0.0.1')) {
            localServer = createServer(PORT);
            await localServer.start();
            console.log(`[WDIO Launcher] Application under test started at http://localhost:${PORT}`);
        }
    },

    // Runs once after all workers finish: shutdown server
    async onComplete() {
        if (localServer) {
            await localServer.stop();
            console.log('[WDIO Launcher] Application under test server stopped.');
        }
    },

    // Runs in each browser session before tests start
    async before() {
        await browser.setWindowSize(1920, 1080);
    },

    // Error handling: save a screenshot for every failed test
    async afterTest(test, context, { passed }) {
        if (passed) return;

        fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

        const browserName = browser.capabilities.browserName;
        const safeTitle = test.title.replace(/[^a-z0-9]+/gi, '_');
        const fileName = `${browserName}_${safeTitle}_${Date.now()}.png`;

        // saveScreenshot saves to disk and attaches image to Allure report
        await browser.saveScreenshot(path.join(SCREENSHOT_DIR, fileName));
    },
};
