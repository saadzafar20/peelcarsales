import { describe, expect, it } from "vitest";
import { cn, formatMileage, formatPriceCAD } from "@/lib/utils";

describe("cn", () => {
  it("merges tailwind classes and resolves conflicts in favour of the latter", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles falsy values", () => {
    expect(cn("text-base", false && "hidden", null, undefined, "font-bold")).toBe(
      "text-base font-bold",
    );
  });
});

describe("formatPriceCAD", () => {
  it("formats cents into Canadian dollars without fractional cents", () => {
    expect(formatPriceCAD(1_999_900)).toMatch(/\$19,999/);
  });
});

describe("formatMileage", () => {
  it("renders km with thousands separator", () => {
    expect(formatMileage(45_321)).toBe("45,321 km");
  });
});
