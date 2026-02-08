import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

class FakeClassList {
  #set = new Set();

  add(...tokens) {
    tokens.forEach((token) => this.#set.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this.#set.delete(token));
  }

  contains(token) {
    return this.#set.has(token);
  }

  toggle(token, force) {
    if (force === true) {
      this.#set.add(token);
      return true;
    }
    if (force === false) {
      this.#set.delete(token);
      return false;
    }
    if (this.#set.has(token)) {
      this.#set.delete(token);
      return false;
    }
    this.#set.add(token);
    return true;
  }

  toString() {
    return [...this.#set].join(" ");
  }
}

class FakeElement {
  #className = "";
  #innerHTML = "";

  constructor(tagName = "div", id = "") {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.children = [];
    this.parentNode = null;
    this.classList = new FakeClassList();
    this.dataset = {};
    this.style = {};
    this.listeners = new Map();
    this.attributes = new Map();
    this.disabled = false;
    this.textContent = "";
    this.value = "";
  }

  get className() {
    return this.#className;
  }

  set className(value) {
    this.#className = value || "";
    this.classList = new FakeClassList();
    this.#className
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => this.classList.add(token));
  }

  get innerHTML() {
    return this.#innerHTML;
  }

  set innerHTML(value) {
    this.#innerHTML = value || "";
    this.children = [];
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    this.children = this.children.filter((entry) => entry !== child);
    child.parentNode = null;
    return child;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  addEventListener(type, handler) {
    const handlers = this.listeners.get(type) || [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  }

  querySelectorAll(selector) {
    const all = [];
    const visit = (node) => {
      node.children.forEach((child) => {
        all.push(child);
        visit(child);
      });
    };
    visit(this);

    return all.filter((element) => matchesSelector(element, selector));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  closest(selector) {
    let node = this;
    while (node) {
      if (matchesSelector(node, selector)) return node;
      node = node.parentNode;
    }
    return null;
  }

  focus() {}

  select() {}
}

function matchesSelector(element, selector) {
  if (selector === ".chapter-btn[data-original-text]") {
    return element.classList.contains("chapter-btn") &&
      Object.prototype.hasOwnProperty.call(element.dataset, "originalText");
  }
  if (selector === ".option-btn") {
    return element.classList.contains("option-btn");
  }
  if (selector === ".option-btn.multi-select") {
    return (
      element.classList.contains("option-btn") &&
      element.classList.contains("multi-select")
    );
  }
  if (selector.startsWith("[data-index=\"")) {
    const expected = selector.slice(13, -2);
    return element.dataset.index === expected;
  }
  return false;
}

function createFakeDocument(requiredIds) {
  const byId = new Map();
  const metaDescription = new FakeElement("meta");
  const body = new FakeElement("body");

  const document = {
    body,
    createElement(tagName) {
      return new FakeElement(tagName);
    },
    getElementById(id) {
      if (!byId.has(id)) {
        const element = new FakeElement("div", id);
        byId.set(id, element);
        body.appendChild(element);
      }
      return byId.get(id);
    },
    querySelector(selector) {
      if (selector === 'meta[name="description"]') return metaDescription;
      return null;
    },
    querySelectorAll(selector) {
      return body.querySelectorAll(selector);
    },
    execCommand(command) {
      return command === "copy";
    },
  };

  requiredIds.forEach((id) => {
    document.getElementById(id);
  });

  return { document, byId, metaDescription };
}

class MockOpenQuizzer {
  static lastInstance = null;

  constructor() {
    this.handlers = new Map();
    this.state = "idle";
    this.progress = { current: 1, total: 10 };
    this.problem = null;
    this.score = { correct: 0, total: 0, percentage: 0 };
    MockOpenQuizzer.lastInstance = this;
  }

  on(event, handler) {
    const list = this.handlers.get(event) || [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  emit(event, payload) {
    const list = this.handlers.get(event) || [];
    list.forEach((handler) => handler(payload));
  }

  loadProblems() {}

  start() {}

  reset() {
    this.state = "idle";
  }

  retry() {}

  next() {}

  toggleMultiSelect() {}

  selectOption() {}

  submitNumeric() {}

  moveOrderingItem() {}

  submitOrdering() {}

  submitMultiSelect() {}

  getSessionSummary() {
    return {
      timestamp: "2026-02-08T00:00:00.000Z",
      score: { correct: 1, total: 2, percentage: 50 },
      results: [],
    };
  }
}

function extractModuleScript(html) {
  const match = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error("Could not find module script in index.html");
  }
  return match[1];
}

function runIndexScript({ config, document, window, navigator }) {
  const html = readFileSync(join(__dirname, "index.html"), "utf8");
  const moduleBody = extractModuleScript(html).replace(
    /^\s*import\s+.*$/gm,
    "",
  );

  const run = new Function(
    "OpenQuizzer",
    "CONFIG",
    "document",
    "window",
    "navigator",
    "fetch",
    "setTimeout",
    "clearTimeout",
    "console",
    moduleBody,
  );

  run(
    MockOpenQuizzer,
    config,
    document,
    window,
    navigator,
    async () => ({ ok: true, json: async () => ({}) }),
    (fn) => fn(),
    () => {},
    console,
  );
}

describe("index bootstrap smoke test", () => {
  const requiredIds = [
    "landing",
    "practice",
    "results",
    "error-msg",
    "practice-title",
    "chapter-desc",
    "current",
    "total",
    "progress",
    "quit-btn",
    "problem-id",
    "question-text",
    "options",
    "feedback",
    "feedback-title",
    "feedback-explanation",
    "next-btn",
    "multi-submit",
    "numeric-container",
    "numeric-input",
    "numeric-unit",
    "numeric-submit",
    "correct-answer-display",
    "correct-answer-value",
    "ordering-container",
    "ordering-items",
    "ordering-submit",
    "multi-submit-container",
    "stage-indicator",
    "stage-context",
    "stage-context-text",
    "score",
    "correct-count",
    "total-count",
    "session-status-label",
    "retry-btn",
    "back-btn",
    "copy-json-btn",
    "show-summary-btn",
    "results-export-status",
    "results-summary",
    "unit-list",
    "landing-title",
    "landing-description",
    "back-link-container",
  ];

function buildTestContext() {
    const { document, byId } = createFakeDocument(requiredIds);
    const window = { scrollTo() {} };
    const navigator = { clipboard: { writeText: async () => {} } };
    const config = {
      title: "System Design Practice",
      description: "Practice",
      backLink: { href: "/", text: "Back" },
      maxProblems: 10,
      showProblemId: true,
      units: [
        {
          id: 1,
          title: "Unit One",
          chapters: [
            { num: 1, title: "Ready", ready: true },
            { num: 2, title: "Soon", ready: false },
          ],
        },
      ],
    };
    return { document, byId, window, navigator, config };
  }

  it("initializes without throwing and binds critical controls", () => {
    const { document, byId, window, navigator, config } = buildTestContext();

    assert.doesNotThrow(() => {
      runIndexScript({ config, document, window, navigator });
    });

    const backHandlers = byId.get("back-btn").listeners.get("click") || [];
    const quitHandlers = byId.get("quit-btn").listeners.get("click") || [];
    assert.ok(backHandlers.length > 0);
    assert.ok(quitHandlers.length > 0);
  });

  it("handles quit flow for a partial session without throwing", () => {
    const { document, byId, window, navigator, config } = buildTestContext();
    runIndexScript({ config, document, window, navigator });

    const quiz = MockOpenQuizzer.lastInstance;
    quiz.state = "practicing";
    quiz.progress = { current: 3, total: 10 };

    const quitHandler = byId.get("quit-btn").listeners.get("click")[0];
    assert.doesNotThrow(() => quitHandler());
    assert.equal(
      byId.get("session-status-label").textContent,
      "Partial session: answered 2 of 10",
    );
  });
});
