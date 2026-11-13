// Page 1: Home page (https://www.epam.com)

describe('Home page', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    // Scenario 1 - checks the page title (no element locator needed)
    it('should have "EPAM" in the page title', async () => {
        await expect(browser).toHaveTitle(expect.stringContaining('EPAM'));
    });

    // Scenario 2 - ID locator (#id)
    it('should hide the cookie banner after clicking "Accept"', async () => {
        const acceptButton = await $('#onetrust-accept-btn-handler');

        await acceptButton.waitForDisplayed({ timeout: 10000 });
        await acceptButton.click();

        await expect(acceptButton).not.toBeDisplayed();
    });

    // Scenario 3 - CSS attribute selector (a[href*="..."])
    it('should have a LinkedIn link in the footer', async () => {
        const linkedInLink = await $('footer a[href*="linkedin.com"]');

        await expect(linkedInLink).toExist();
    });
});
