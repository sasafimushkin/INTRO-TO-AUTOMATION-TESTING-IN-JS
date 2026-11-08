import { acceptCookies } from '../helpers/cookies.js';

// Page 4: Search results page
describe('Search results page', () => {
    // Scenario 6 - XPath locator with text matching
    it('should show results that mention the search word', async () => {
        await browser.url('/search?q=automation');
        await acceptCookies();

        await expect(browser).toHaveUrl(expect.stringContaining('q=automation'));

        // XPath locator: search result link containing "Automation"
        const resultLink = await $('//a[contains(translate(text(), "AUTOMATION", "automation"), "automation")]');
        await expect(resultLink).toBeDisplayed();
    });

    // Scenario 7 - Form interaction & CSS ID / tag selector
    it('should allow searching from the search input field', async () => {
        await browser.url('/search');
        await acceptCookies();

        const input = await $('#search-input');
        await input.setValue('engineering');

        const submitBtn = await $('#search-submit');
        await submitBtn.click();

        await expect(browser).toHaveUrl(expect.stringContaining('q=engineering'));
    });
});
