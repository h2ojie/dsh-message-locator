import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const clientSource = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/**
 * The Client bundle registers itself through the page-global module loader, so
 * evaluate it against a stub that captures the factory's exports.
 */
function loadClientExports() {
  let captured;
  const previous = globalThis.window;
  globalThis.window = {
    __ModuleLoader__: {
      load(registration) {
        captured = registration.factory(() => {
          throw new Error("the Client bundle must not require modules at materialization");
        });
      },
    },
  };
  try {
    // eslint-disable-next-line no-new-func -- deliberately evaluate the bundle body
    new Function(clientSource)();
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
  return captured;
}

const { selectCurrentSessionId } = loadClientExports();

const row = (retainedBy) => ({
  id: "s", displayTitle: "s", running: false, blank: false, updatedAt: 0, retainedBy,
});

test("the selected Session is the row whose mainView reference is live", () => {
  assert.equal(selectCurrentSessionId({
    a: row({}),
    b: row({ mainView: 1 }),
    c: row({}),
  }), "b");
});

test("no selection when nothing is retained by mainView", () => {
  assert.equal(selectCurrentSessionId({
    a: row({}),
    b: row({ sidebarView: 1 }),
  }), undefined);
  assert.equal(selectCurrentSessionId({}), undefined);
});

test("tolerates missing, malformed, and absent rows", () => {
  assert.equal(selectCurrentSessionId(undefined), undefined);
  assert.equal(selectCurrentSessionId(null), undefined);
  assert.equal(selectCurrentSessionId({ a: null, b: 7, c: row({ mainView: 2 }) }), "c");
  assert.equal(selectCurrentSessionId({ a: {} }), undefined);
});

test("a retained row with a non-positive mainView count is not selected", () => {
  assert.equal(selectCurrentSessionId({ a: row({ mainView: 0 }) }), undefined);
  assert.equal(selectCurrentSessionId({ a: row({ mainView: -1 }) }), undefined);
});

test("the Client bundle never reads the removed SessionListState.current field", () => {
  // `current` was deleted from SessionListState; reading it yields undefined
  // forever, which silently blanks the locator's list and status line.
  assert.doesNotMatch(clientSource, /\.list\.getSnapshot\(\)[^\n]*\bcurrent\b/);
  assert.doesNotMatch(clientSource, /byId[^\n]*\.current\b/);
});
