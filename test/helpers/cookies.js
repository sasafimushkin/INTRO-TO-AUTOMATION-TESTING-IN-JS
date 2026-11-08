/**
 * Closes the cookie consent banner if it appears.
 * If the banner is not shown (already accepted, or not shown in your region),
 * the function just continues without failing the test.
 */
export async function acceptCookies() {
    const acceptButton = await $('#onetrust-accept-btn-handler');
    try {
        await acceptButton.waitForClickable({ timeout: 5000 });
        await acceptButton.click();
        await acceptButton.waitForDisplayed({ reverse: true, timeout: 5000 });
    } catch {
        // Banner did not appear - nothing to do
    }
}
