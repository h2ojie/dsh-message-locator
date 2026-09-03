import assert from "node:assert/strict";
import test from "node:test";
import { MAX_MESSAGE_CHARS, messageLocatorProjectionDefinition as projection } from "../lib/index.js";

const start = (state, turn, seq = 0) => projection.apply(state, {
  type: "turn/start", seq, data: { turn },
});

const user = (state, { id, seq, text = "", source = { kind: "user" }, images = 0 }) => projection.apply(state, {
  type: "user/message",
  seq,
  data: {
    id,
    source,
    content: [
      ...(text === null ? [] : [{ type: "text", text }]),
      ...Array.from({ length: images }, () => ({ type: "image", attachment: {} })),
    ],
  },
});

test("collects every human message across turns and steering messages", () => {
  let state = projection.init();
  state = start(state, 1, 0);
  state = user(state, { id: "opening", seq: 1, text: " first\nquestion " });
  state = user(state, { id: "steer", seq: 4, text: "follow up" });
  state = projection.apply(state, { type: "turn/end", seq: 5, data: { turn: 1 } });
  state = start(state, 2, 6);
  state = user(state, { id: "second", seq: 7, text: "second turn", images: 1 });

  assert.deepEqual(projection.wire.view(state), [
    { id: "opening", seq: 1, turn: 1, text: "first question", hasImages: false },
    { id: "steer", seq: 4, turn: 1, text: "follow up", hasImages: false },
    { id: "second", seq: 7, turn: 2, text: "second turn", hasImages: true },
  ]);
});

test("ignores injected context but keeps image-only human messages", () => {
  let state = projection.init();
  state = start(state, 1);
  const unchanged = user(state, {
    id: "context", seq: 1, text: "secret context", source: { kind: "plugin", plugin: "test" },
  });
  assert.equal(unchanged, state);
  state = user(state, { id: "image", seq: 2, text: null, images: 2 });
  assert.deepEqual(state.messages, [
    { id: "image", seq: 2, turn: 1, text: "", hasImages: true },
  ]);
});

test("bounds normalized message text and validates wire order", () => {
  let state = projection.init();
  state = start(state, 1);
  state = user(state, { id: "huge", seq: 1, text: `hello ${"x".repeat(MAX_MESSAGE_CHARS * 3)}` });
  assert.equal(state.messages[0].text.length, MAX_MESSAGE_CHARS);
  assert.match(state.messages[0].text, /^hello x+…$/u);
  assert.throws(() => projection.wire.viewSchema.parse([
    { id: "later", seq: 2, turn: 1, text: "", hasImages: false },
    { id: "earlier", seq: 1, turn: 1, text: "", hasImages: false },
  ]), /strictly increasing/u);
});

test("replacement events update by stable message id without duplication", () => {
  let state = projection.init();
  state = start(state, 1);
  state = user(state, { id: "same", seq: 1, text: "before" });
  state = user(state, { id: "same", seq: 3, text: "after" });
  assert.deepEqual(state.messages, [
    { id: "same", seq: 3, turn: 1, text: "after", hasImages: false },
  ]);
});
