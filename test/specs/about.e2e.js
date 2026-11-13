import { acceptCookies } from '../helpers/cookies.js';

// Page 2: About page (opened by clicking the header menu)

describe('About page', () => {
    // Scenario 4 - WebdriverIO partial link text selector (a*=text)
    it('should open the About page from the header menu', async () => {
        await browser.url('/');
        await acceptCookies();

        // Find the <a> inside <header> whose text contains "About"
        const aboutLink = await $('header').$('a*=About');
        await aboutLink.click();

        await expect(browser).toHaveUrl(expect.stringContaining('/about'));
    });
});
