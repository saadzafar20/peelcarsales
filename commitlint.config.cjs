/**
 * Conventional commits, with a curated list of scopes that match top-level
 * concerns. Type and format checks come from @commitlint/config-conventional.
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0],
    "scope-enum": [
      2,
      "always",
      [
        "app",
        "lib",
        "ui",
        "db",
        "api",
        "auth",
        "ci",
        "deps",
        "docs",
        "feeds",
        "leads",
        "fin",
        "ai",
        "search",
        "media",
        "seo",
        "scaffold",
        "repo",
        "release",
      ],
    ],
  },
};
