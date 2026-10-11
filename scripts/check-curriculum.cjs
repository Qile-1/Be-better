const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");

// Use the installed compiler CLI; TypeScript 7 no longer exports transpileModule.
const tsPackage = require.resolve("typescript/package.json");
const version = require(tsPackage).version;
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "be-better-content-"));
let loaded;
try {
  execFileSync(process.execPath, [path.join(path.dirname(tsPackage), "bin/tsc"),
    ...(Number(version.split(".")[0]) >= 6 ? ["--ignoreConfig"] : []),
    "--module", "commonjs", "--target", "es2017", "--skipLibCheck", "--strict",
    "--outDir", temporary, path.join(__dirname, "../lib/lessons.ts")], { stdio: "inherit" });
  loaded = require(path.join(temporary, "lessons.js"));
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
const { LESSONS, getLessonById, getNextLesson } = loaded;
const summary = require("../docs/cet/audit-summary.json");
const tasks = require("../docs/cet/task-inventory.json");
const signals = require("../docs/cet/reading-signals.json");
const manifest = require("../docs/cet/source-manifest.json");
function unique(values, name) { assert.equal(new Set(values).size, values.length, `${name}: duplicate id`); }
function text(value, name) { assert.equal(typeof value, "string", name); assert.ok(value.trim(), name); }
function wordCount(value) { return (value.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? []).length; }
unique(LESSONS.map((lesson) => lesson.id), "lessons");
assert.equal(LESSONS.length, 27);
for (const id of ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "l12", "w1", "w2", "w3", "w4", "t1", "t2", "t3", "t4"]) assert.ok(LESSONS.some((lesson) => lesson.id === id));
for (const category of ["reading", "writing", "translation"]) {
  const grouped = LESSONS.filter((lesson) => (lesson.category ?? "reading") === category);
  const firstBonus = grouped.findIndex((lesson) => lesson.alignment.priority === "bonus");
  if (firstBonus >= 0) assert.ok(grouped.slice(firstBonus).every((lesson) => lesson.alignment.priority === "bonus"));
}
const questionIds = [];
const taskIds = [];
let formatItems = 0;
const writingCounts = [];
for (const lesson of LESSONS) {
  assert.equal(getLessonById(lesson.id), lesson);
  text(lesson.title, lesson.id);
  text(lesson.microLesson?.goal, `${lesson.id}: goal`);
  assert.ok(lesson.microLesson.blocks.length);
  assert.ok(lesson.alignment?.skills.length);
  assert.ok(lesson.alignment.evidence.length);
  for (const source of lesson.alignment.evidence) assert.equal(new URL(source.url).protocol, "https:");
  text(lesson.retellTask, `${lesson.id}: retell`);
  text(lesson.modelAnswer, `${lesson.id}: model`);
  unique(lesson.rubricPoints.map((point) => point.id), lesson.id);
  assert.ok(lesson.rubricPoints.some((point) => point.tier === "core"));
  for (const point of lesson.rubricPoints) {
    text(point.point, `${lesson.id}:${point.id}`);
    assert.equal(point.mustCover, point.tier === "core");
  }
  assert.ok(lesson.practiceQuestions?.length || lesson.productionTasks?.length);
  for (const question of lesson.practiceQuestions ?? []) {
    questionIds.push(question.id);
    assert.ok(lesson.rubricPoints.some((point) => point.id === question.pointId), `${question.id}: point missing`);
    assert.deepEqual(Object.keys(question.options).sort(), ["A", "B", "C", "D"]);
    assert.ok(question.options[question.answer]);
    for (const value of [question.passage, question.prompt, question.explanation, ...Object.values(question.options)]) text(value, question.id);
  }
  for (const task of lesson.productionTasks ?? []) {
    taskIds.push(task.id);
    for (const value of [task.prompt, task.focus, task.reference, ...task.analysis]) text(value, task.id);
    if (lesson.category === "writing") {
      const count = wordCount(task.reference);
      writingCounts.push({ id: task.id, count });
      assert.ok(count >= 120 && count <= 180, `${task.id}: reference is ${count} words, expected 120-180`);
    }
  }
  for (const practice of lesson.formatPractice ?? []) {
    assert.equal(practice.items.length, 10);
    unique(practice.items.map((item) => item.id), practice.id);
    unique(practice.options.map((option) => option.label), practice.id);
    if (practice.kind === "cloze") {
      assert.equal(practice.options.length, 15);
      unique(practice.items.map((item) => item.answer), practice.id);
      assert.deepEqual([...practice.passage.matchAll(/\[(\d+)\]/g)].map((match) => match[1]), practice.items.map((item) => item.id));
    } else {
      assert.ok(new Set(practice.items.map((item) => item.answer)).size < 10, "matching must test reuse");
      assert.ok(practice.paragraphs.some((paragraph) => !practice.items.some((item) => item.answer === paragraph.label)), "matching must include unused paragraphs");
      assert.deepEqual(practice.options.map((option) => option.label), practice.paragraphs.map((paragraph) => paragraph.label));
    }
    for (const item of practice.items) {
      assert.ok(practice.options.some((option) => option.label === item.answer));
      text(item.explanation, practice.id);
      formatItems++;
    }
  }
}
unique(questionIds, "questions"); unique(taskIds, "tasks");
assert.equal(questionIds.length, 27); assert.equal(taskIds.length, 30); assert.equal(formatItems, 20);
assert.equal(getNextLesson(LESSONS.at(-1).id), undefined);
assert.equal(getLessonById("missing"), undefined);
assert.equal(tasks.length, 36); assert.equal(signals.length, 310); assert.equal(manifest.length, 68);
assert.equal(manifest.filter((item) => item.role === "paper-compilation").length, 34);
assert.equal(Object.values(summary.writingPrimaryTaskCounts).reduce((a, b) => a + b, 0), 36);
assert.equal(Object.values(summary.translationThemeCounts).reduce((a, b) => a + b, 0), 36);
unique(tasks.map((task) => task.id), "source tasks");
unique(signals.map((item) => `${item.package}:${item.question}`), "reading inventory");
for (const task of tasks) assert.ok(manifest.some((entry) => entry.id === task.package));
assert.ok(!fs.existsSync(path.join(__dirname, "../public/private-corpus")), "private source corpus must not be published");
console.log(JSON.stringify({ passed: true, lessons: LESSONS.length, readingQuestions: questionIds.length, productionTasks: taskIds.length, formatItems, writingCounts }, null, 2));
