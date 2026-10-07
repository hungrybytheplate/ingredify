// Runs before `vite dev` and `vite build`; writes public/sitemap.xml with every public page and recipe page.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { allRecipeSlugs } from "../src/lib/recipeSlug";

const BASE_URL = "https://ingredify.org";

const staticEntries = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/pantry", changefreq: "weekly", priority: "0.8" },
  { path: "/install", changefreq: "monthly", priority: "0.6" },
  { path: "/auth", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", lastmod: "2026-04-30", changefreq: "yearly", priority: "0.3" },
];

const entries = [
  ...staticEntries,
  ...allRecipeSlugs().map((s) => ({ path: `/recipe/${s}`, changefreq: "monthly", priority: "0.7" })),
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      "lastmod" in e && e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      `  </url>`,
    ].filter(Boolean).join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml + "\n");
console.log(`sitemap.xml written (${entries.length} entries)`);
