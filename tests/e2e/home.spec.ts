import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home page renders the brand mark and primary CTA", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByAltText("Peel Car Sales")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/building something better/i);
  await expect(page.getByRole("link", { name: /call 905-678-0048/i })).toHaveAttribute(
    "href",
    "tel:9056780048",
  );
});

test("security headers are applied", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};
  expect(headers["strict-transport-security"]).toBeDefined();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  // CSP is set by middleware.ts. Spot-check the must-haves.
  const csp = headers["content-security-policy"] ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toMatch(/script-src[^;]*'nonce-[^']+'/);
});

test("404 page renders with brand styling", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/no longer on the lot/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
});

test("home page has no detectable a11y violations (axe wcag2a + wcag2aa)", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
