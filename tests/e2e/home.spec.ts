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
  expect(response?.headers()["strict-transport-security"]).toBeDefined();
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});
