import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home renders hero, featured grid, and footer", async ({ page }) => {
  await page.goto("/");

  // Hero
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/right car/i);
  await expect(page.getByRole("link", { name: /browse 150 vehicles/i }).first()).toBeVisible();

  // Featured grid renders sample vehicles
  await expect(page.getByRole("heading", { name: /featured vehicles/i })).toBeVisible();

  // Header phone CTA
  await expect(page.getByRole("link", { name: /call 905-678-0048/i }).first()).toHaveAttribute(
    "href",
    "tel:9056780048",
  );

  // Footer carries both lot addresses
  await expect(page.getByText(/2701 Derry Rd East/i)).toBeVisible();
  await expect(page.getByText(/333 Wyecroft Rd/i)).toBeVisible();
});

test("security headers are applied", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};
  expect(headers["strict-transport-security"]).toBeDefined();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
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
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    // Picsum thumbnails return image/jpeg with no MIME-tight check, ignore them.
    .exclude("img[src*='picsum.photos']")
    .analyze();
  expect(results.violations).toEqual([]);
});
