import { acceptCookies } from '../helpers/cookies.js';

// Page 3: Services page (https://www.epam.com/services)

describe('Services page', () => {
    // Scenario 5 - XPath locator
    it('should show a main heading on the Services page', async () => {
        await browser.url('/services');
        await acceptCookies();

        await expect(browser).toHaveUrl(expect.stringContaining('/services'));

        // XPath: an <h1> element that contains some text
        const heading = await $('//h1[normalize-space()]');
        await expect(heading).toBeDisplayed();
    });
});
