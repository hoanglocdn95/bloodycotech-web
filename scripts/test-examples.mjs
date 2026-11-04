import assert from "node:assert/strict";
import fs from "node:fs";
import { actionFromKey } from "../examples/game-input.mjs";
import { playCoin } from "../examples/play-coin.mjs";
import { SAVE_KEY, readSave, writeSave } from "../examples/read-save.mjs";

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  setItem(key, value) {
    this.map.set(key, String(value));
  }
}

const storage = new MemoryStorage();
assert.equal(readSave(storage), null);

writeSave(storage, { version: 1, score: 3, muted: true });
assert.deepEqual(readSave(storage), { version: 1, score: 3, muted: true });
assert.equal(storage.getItem(SAVE_KEY)?.includes("\"score\":3"), true);

storage.setItem(SAVE_KEY, "{");
assert.equal(readSave(storage), null);

for (const raw of [
  JSON.stringify({ version: 2, score: 1, muted: false }),
  JSON.stringify({ version: 1, score: -1, muted: false }),
  JSON.stringify({ version: 1, score: Number.NaN, muted: false }),
  JSON.stringify({ version: 1, score: 1, muted: "no" }),
  JSON.stringify({ version: 1, score: "1", muted: false }),
]) {
  storage.setItem(SAVE_KEY, raw);
  assert.equal(readSave(storage), null, raw);
}

assert.equal(actionFromKey("ArrowLeft"), "left");
assert.equal(actionFromKey("KeyA"), "left");
assert.equal(actionFromKey("KeyD"), "right");
assert.equal(actionFromKey("Space"), "jump");
assert.equal(actionFromKey("KeyW"), "jump");
assert.equal(actionFromKey("a"), null);
assert.equal(actionFromKey("ArrowDown"), null);

function createParam() {
  return {
    calls: [],
    setValueAtTime(value, time) {
      this.calls.push(["set", value, time]);
    },
    exponentialRampToValueAtTime(value, time) {
      this.calls.push(["exp", value, time]);
    },
  };
}

const log = [];
let oscillator;
let gainNode;
const context = {
  currentTime: 5,
  destination: { name: "destination" },
  createOscillator() {
    oscillator = {
      type: "sine",
      frequency: createParam(),
      connect(target) {
        log.push(["osc", target]);
      },
      start(time) {
        log.push(["start", time]);
      },
      stop(time) {
        log.push(["stop", time]);
      },
    };
    return oscillator;
  },
  createGain() {
    gainNode = {
      gain: createParam(),
      connect(target) {
        log.push(["gain", target]);
      },
    };
    return gainNode;
  },
};

playCoin(context);
assert.equal(oscillator.type, "square");
assert.deepEqual(oscillator.frequency.calls, [
  ["set", 880, 5],
  ["exp", 1320, 5.08],
]);
for (const call of gainNode.gain.calls) {
  assert.ok(call[1] > 0, "exponential ramp needs a positive target");
}
assert.deepEqual(log[0][0], "osc");
assert.equal(log[0][1], gainNode);
assert.equal(log[1][0], "gain");
assert.equal(log[1][1], context.destination);
assert.deepEqual(log[2], ["start", 5]);
assert.deepEqual(log[3], ["stop", 5.2]);

const config = fs.readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
for (const snippet of ['output: "export"', "trailingSlash: true", "unoptimized: true"]) {
  assert.ok(config.includes(snippet), snippet);
}

const requiredIncludes = [
  ["content/blog/localstorage-trang-thai-ung-dung-va-game.mdx", "examples/read-save.mjs"],
  ["content/blog/web-audio-api.mdx", "examples/play-coin.mjs"],
  ["content/blog/giao-dien-game-responsive.mdx", "examples/game-input.mjs"],
  ["content/blog/typescript-trong-react.mdx", "examples/button-variant.tsx"],
  ["content/blog/tanstack-query-server-state.mdx", "examples/user-query.tsx"],
];

for (const [article, example] of requiredIncludes) {
  const source = fs.readFileSync(new URL(`../${article}`, import.meta.url), "utf8");
  assert.ok(source.includes(`include=${example}`), `${article} -> ${example}`);
}

console.log("example checks passed");
