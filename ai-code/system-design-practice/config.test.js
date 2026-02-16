/**
 * Tests for config.js and content files.
 * Run: node --test config.test.js
 *
 * These tests validate:
 * - config.js is syntactically valid and exports expected structure
 * - All content files referenced in config exist and are valid JSON
 * - Content files have required fields and valid problem structures
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// =============================================
// Config validation
// =============================================

describe("config.js", () => {
  let CONFIG;

  it("should be syntactically valid and importable", async () => {
    // Dynamic import will throw if syntax is invalid
    const module = await import("./config.js");
    CONFIG = module.CONFIG;
    assert.ok(CONFIG, "CONFIG should be exported");
  });

  it("should have required top-level fields", async () => {
    const module = await import("./config.js");
    CONFIG = module.CONFIG;

    assert.ok(typeof CONFIG.title === "string", "title should be a string");
    assert.ok(
      typeof CONFIG.description === "string",
      "description should be a string",
    );
    assert.ok(Array.isArray(CONFIG.units), "units should be an array");
  });

  it("should have valid unit structure", async () => {
    const module = await import("./config.js");
    CONFIG = module.CONFIG;

    for (const unit of CONFIG.units) {
      assert.ok(
        typeof unit.id === "number",
        `unit ${unit.id}: id should be a number`,
      );
      assert.ok(
        typeof unit.title === "string",
        `unit ${unit.id}: title should be a string`,
      );
      assert.ok(
        Array.isArray(unit.chapters),
        `unit ${unit.id}: chapters should be an array`,
      );

      for (const chapter of unit.chapters) {
        assert.ok(
          typeof chapter.num === "number",
          `unit ${unit.id} chapter ${chapter.num}: num should be a number`,
        );
        assert.ok(
          typeof chapter.title === "string",
          `unit ${unit.id} chapter ${chapter.num}: title should be a string`,
        );
        assert.ok(
          typeof chapter.ready === "boolean",
          `unit ${unit.id} chapter ${chapter.num}: ready should be a boolean`,
        );
      }
    }
  });

  it("should have valid interview simulation settings when configured", async () => {
    const module = await import("./config.js");
    CONFIG = module.CONFIG;

    if (!CONFIG.interviewSimulation) return;

    const { durationMinutes, questions } = CONFIG.interviewSimulation;
    assert.ok(
      Number.isFinite(durationMinutes) && durationMinutes > 0,
      "interviewSimulation.durationMinutes should be a positive number",
    );
    assert.ok(
      Number.isFinite(questions) && questions > 0,
      "interviewSimulation.questions should be a positive number",
    );
  });
});

// =============================================
// Content file validation
// =============================================

describe("content files", () => {
  let CONFIG;

  it("should exist for all ready chapters", async () => {
    const module = await import("./config.js");
    CONFIG = module.CONFIG;

    for (const unit of CONFIG.units) {
      for (const chapter of unit.chapters) {
        if (chapter.ready) {
          const filename = `unit-${unit.id}-chapter-${chapter.num}.json`;
          const filepath = join(__dirname, "content", filename);
          assert.ok(existsSync(filepath), `Missing content file: ${filename}`);
        }
      }
    }
  });

  it("should be valid JSON with required fields", async () => {
    const module = await import("./config.js");
    CONFIG = module.CONFIG;

    for (const unit of CONFIG.units) {
      for (const chapter of unit.chapters) {
        if (chapter.ready) {
          const filename = `unit-${unit.id}-chapter-${chapter.num}.json`;
          const filepath = join(__dirname, "content", filename);

          let data;
          try {
            const raw = readFileSync(filepath, "utf-8");
            data = JSON.parse(raw);
          } catch (e) {
            assert.fail(`${filename}: Invalid JSON - ${e.message}`);
          }

          assert.ok(
            Array.isArray(data.problems),
            `${filename}: problems should be an array`,
          );
          assert.ok(
            data.problems.length > 0,
            `${filename}: should have at least one problem`,
          );
          assert.ok(
            typeof data.chapterTitle === "string",
            `${filename}: chapterTitle should be a string`,
          );
        }
      }
    }
  });

  it("should have valid problem structure", async () => {
    const module = await import("./config.js");
    CONFIG = module.CONFIG;

    const validTypes = [
      "multiple-choice",
      "multi-select",
      "numeric-input",
      "ordering",
      "two-stage",
    ];

    for (const unit of CONFIG.units) {
      for (const chapter of unit.chapters) {
        if (chapter.ready) {
          const filename = `unit-${unit.id}-chapter-${chapter.num}.json`;
          const filepath = join(__dirname, "content", filename);
          const data = JSON.parse(readFileSync(filepath, "utf-8"));

          const ids = new Set();

          for (const problem of data.problems) {
            const pid = problem.id;

            // Check ID exists and is unique
            assert.ok(
              typeof pid === "string",
              `${filename}: problem missing id`,
            );
            assert.ok(!ids.has(pid), `${filename}: duplicate id ${pid}`);
            ids.add(pid);

            // Check type is valid (default to multiple-choice)
            const type = problem.type || "multiple-choice";
            if (!problem.stages) {
              assert.ok(
                validTypes.includes(type),
                `${filename} ${pid}: invalid type ${type}`,
              );
            }

            // Type-specific validation
            if (problem.stages) {
              // Two-stage
              assert.ok(
                Array.isArray(problem.stages),
                `${filename} ${pid}: stages should be an array`,
              );
              assert.ok(
                problem.stages.length >= 2,
                `${filename} ${pid}: two-stage needs at least 2 stages`,
              );
              for (const stage of problem.stages) {
                assert.ok(
                  typeof stage.question === "string",
                  `${filename} ${pid}: stage missing question`,
                );
                assert.ok(
                  Array.isArray(stage.options),
                  `${filename} ${pid}: stage missing options`,
                );
                assert.ok(
                  typeof stage.correct === "number",
                  `${filename} ${pid}: stage missing correct index`,
                );
              }
            } else if (type === "numeric-input") {
              assert.ok(
                typeof problem.question === "string",
                `${filename} ${pid}: missing question`,
              );
              assert.ok(
                typeof problem.answer === "number",
                `${filename} ${pid}: missing numeric answer`,
              );
            } else if (type === "ordering") {
              assert.ok(
                typeof problem.question === "string",
                `${filename} ${pid}: missing question`,
              );
              assert.ok(
                Array.isArray(problem.items),
                `${filename} ${pid}: missing items array`,
              );
              assert.ok(
                Array.isArray(problem.correctOrder),
                `${filename} ${pid}: missing correctOrder`,
              );
            } else if (type === "multi-select") {
              assert.ok(
                typeof problem.question === "string",
                `${filename} ${pid}: missing question`,
              );
              assert.ok(
                Array.isArray(problem.options),
                `${filename} ${pid}: missing options`,
              );
              assert.ok(
                Array.isArray(problem.correctIndices),
                `${filename} ${pid}: missing correctIndices`,
              );
            } else {
              // multiple-choice
              assert.ok(
                typeof problem.question === "string",
                `${filename} ${pid}: missing question`,
              );
              assert.ok(
                Array.isArray(problem.options),
                `${filename} ${pid}: missing options`,
              );
              assert.ok(
                typeof problem.correct === "number",
                `${filename} ${pid}: missing correct index`,
              );
            }
          }
        }
      }
    }
  });
});
