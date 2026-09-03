const PROJECTION_KEY = "dshMessageLocator";
const MAX_MESSAGE_CHARS = 4000;

function fail(message) {
  throw new TypeError(`[dsh-message-locator] ${message}`);
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactKeys(value, expected) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function parseEntry(value, label) {
  if (!isRecord(value) || !exactKeys(value, ["id", "seq", "turn", "text", "hasImages"])) {
    fail(`${label} must be a strict message entry`);
  }
  if (typeof value.id !== "string" || value.id === "") fail(`${label}.id must be a non-empty string`);
  if (!Number.isSafeInteger(value.seq) || value.seq < 0) fail(`${label}.seq must be a non-negative safe integer`);
  if (value.turn !== null && (!Number.isSafeInteger(value.turn) || value.turn < 0)) {
    fail(`${label}.turn must be null or a non-negative safe integer`);
  }
  if (typeof value.text !== "string" || value.text.length > MAX_MESSAGE_CHARS) {
    fail(`${label}.text must be a string no longer than ${MAX_MESSAGE_CHARS} characters`);
  }
  if (typeof value.hasImages !== "boolean") fail(`${label}.hasImages must be boolean`);
  return value;
}

function parseMessages(value) {
  if (!Array.isArray(value)) fail("projection value must be an array");
  let previousSeq = -1;
  const ids = new Set();
  value.forEach((entry, index) => {
    parseEntry(entry, `messages[${index}]`);
    if (entry.seq <= previousSeq) fail("message seq values must be strictly increasing");
    if (ids.has(entry.id)) fail("message ids must be unique");
    previousSeq = entry.seq;
    ids.add(entry.id);
  });
  return value;
}

function parseState(value) {
  if (!isRecord(value) || !exactKeys(value, ["turn", "messages"])) {
    fail("projection state must contain only turn and messages");
  }
  if (value.turn !== null && (!Number.isSafeInteger(value.turn) || value.turn < 0)) {
    fail("projection state turn must be null or a non-negative safe integer");
  }
  parseMessages(value.messages);
  return value;
}

function normalizedText(content) {
  let text = "";
  let unread = false;
  for (const block of Array.isArray(content) ? content : []) {
    if (!isRecord(block) || block.type !== "text" || typeof block.text !== "string") continue;
    if (text.length >= MAX_MESSAGE_CHARS * 2) {
      unread = true;
      break;
    }
    const clipped = block.text.length > MAX_MESSAGE_CHARS * 2;
    const chunk = clipped ? block.text.slice(0, MAX_MESSAGE_CHARS * 2) : block.text;
    text += text === "" ? chunk : ` ${chunk}`;
    if (clipped) {
      unread = true;
      break;
    }
  }
  const normalized = text.replace(/\s+/gu, " ").trim();
  if (normalized.length > MAX_MESSAGE_CHARS - 1) {
    return `${normalized.slice(0, MAX_MESSAGE_CHARS - 1).trimEnd()}…`;
  }
  return unread ? `${normalized}…` : normalized;
}

function hasImages(content) {
  return Array.isArray(content) && content.some((block) => isRecord(block) && block.type === "image");
}

export const messageLocatorProjectionDefinition = {
  key: PROJECTION_KEY,
  stateVersion: 1,
  stateSchema: { parse: parseState },
  init: () => ({ turn: null, messages: [] }),
  apply: (state, event) => {
    if (!isRecord(event) || typeof event.type !== "string") return state;
    if (event.type === "turn/start") {
      const turn = event.data?.turn;
      if (!Number.isSafeInteger(turn) || turn < 0 || turn === state.turn) return state;
      return { turn, messages: state.messages };
    }
    if (event.type === "turn/end") {
      return state.turn === null ? state : { turn: null, messages: state.messages };
    }
    if (event.type !== "user/message" || event.data?.source?.kind !== "user") return state;
    const id = event.data?.id;
    if (typeof id !== "string" || id === "" || !Number.isSafeInteger(event.seq) || event.seq < 0) return state;
    const entry = {
      id,
      seq: event.seq,
      turn: state.turn,
      text: normalizedText(event.data.content),
      hasImages: hasImages(event.data.content),
    };
    const existing = state.messages.findIndex((message) => message.id === id);
    if (existing < 0) return { turn: state.turn, messages: [...state.messages, entry] };
    const previous = state.messages[existing];
    if (previous.seq === entry.seq && previous.turn === entry.turn && previous.text === entry.text
      && previous.hasImages === entry.hasImages) return state;
    const messages = [...state.messages];
    messages[existing] = entry;
    messages.sort((left, right) => left.seq - right.seq);
    return { turn: state.turn, messages };
  },
  wire: {
    viewSchema: { parse: parseMessages },
    view: (state) => state.messages,
  },
};

export const name = "message-locator";
export const inject = ["sessionProjections"];

export function apply(ctx) {
  ctx.sessionProjections.register(messageLocatorProjectionDefinition);
}

export { MAX_MESSAGE_CHARS, PROJECTION_KEY };
