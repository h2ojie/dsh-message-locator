import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const clientSource = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/**
 * `--dsw-specific-menu` is a deliberately translucent surface token that
 * resolves through `--dsw-menu-surface-fill` to a sub-1.0 alpha fill in both
 * themes (dark `rgba(67, 69, 74, 0.45)`, light `rgba(248, 249, 250, 0.58)`).
 * In-box components may paint it only together with
 * `backdrop-filter: var(--dsw-menu-backdrop-filter)`, which blurs the content
 * behind the 45%/58% fill. Painted alone it lets chat text bleed through the
 * panel, which is exactly the unreadable half-transparent look this test
 * guards against.
 */
const TRANSLUCENT_SURFACE_TOKENS = ["--dsw-specific-menu", "--dsw-menu-surface-fill"];

/** Every `selector { ... }` rule in the bundle's injected stylesheet. */
function cssRules(source) {
  const css = source.slice(source.indexOf("const CSS = `") + 13, source.indexOf("`;", source.indexOf("const CSS = `")));
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: match[1].trim().replace(/\s+/gu, " "),
    body: match[2],
  }));
}

const rules = cssRules(clientSource);

/** The `background:` value of the rule whose selector ends with `suffix`. */
function background(suffix) {
  const rule = rules.find((candidate) => candidate.selector.endsWith(suffix));
  assert.ok(rule, `no stylesheet rule for ${suffix}`);
  return rule.body.match(/(?:^|;)\s*background:\s*([^;]+);/u)?.[1]?.trim();
}

test("no locator surface paints a translucent menu token without a backdrop blur", () => {
  const offenders = rules.filter(({ body }) => {
    const paintsTranslucent = TRANSLUCENT_SURFACE_TOKENS.some((token) => body.includes(token));
    return paintsTranslucent && !body.includes("backdrop-filter");
  }).map(({ selector }) => selector);

  assert.deepEqual(offenders, [],
    "a surface using --dsw-specific-menu must also set backdrop-filter: var(--dsw-menu-backdrop-filter)");
});

test("every opaque locator surface uses the solid layer token", () => {
  // The three floating surfaces must stay fully opaque so chat text behind
  // them never shows through.
  for (const surface of [".dml-panel", ".dml-preview", ".dml-open"]) {
    assert.match(background(surface), /var\(--dsw-alias-bg-layer-3\b/u,
      `${surface} must paint the opaque --dsw-alias-bg-layer-3 token`);
  }
});

test("the bundle keeps a solid fallback colour for every opaque surface", () => {
  // A missing theme must still render an opaque fill rather than no background.
  for (const surface of [".dml-panel", ".dml-preview", ".dml-open"]) {
    assert.match(background(surface), /var\([^)]*,\s*#[0-9a-f]{3,8}\s*\)/iu,
      `${surface} must keep a hex fallback inside its var()`);
  }
});
