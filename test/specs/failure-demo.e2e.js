// This test FAILS ON PURPOSE to show the "screenshot on failure" feature.
// It is skipped by default. Run it with:  npm run test:demo-fail

const runDemo = process.env.DEMO_FAIL === 'true';

(runDemo ? describe : describe.skip)('Failure demo', () => {
    it('should fail on purpose and save a screenshot', async () => {
        await browser.url('/');
        await expect(browser).toHaveTitle('This title does not exist');
    });
});
