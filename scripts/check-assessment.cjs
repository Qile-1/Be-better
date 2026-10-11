const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "be-better-assessment-"));
const originalFetch = global.fetch;
const originalKey = process.env.DEEPSEEK_API_KEY;
let testCount = 0;

(async () => {
  const packagePath = require.resolve("typescript/package.json");
  const major = Number(require(packagePath).version.split(".")[0]);
  execFileSync(process.execPath, [path.join(path.dirname(packagePath), "bin/tsc"),
    ...(major >= 6 ? ["--ignoreConfig"] : []), "--module", "commonjs", "--target", "es2017", "--skipLibCheck", "--strict",
    "--rootDir", root, "--outDir", temporary,
    path.join(root, "app/api/diagnose/route.ts"), path.join(root, "app/api/remedy/route.ts")], { stdio: "inherit" });
  process.env.NODE_PATH = path.join(root, "node_modules");
  require("node:module").Module._initPaths();
  const { POST: diagnose } = require(path.join(temporary, "app/api/diagnose/route.js"));
  const { POST: remedy } = require(path.join(temporary, "app/api/remedy/route.js"));
  const { getLessonById } = require(path.join(temporary, "lib/lessons.js"));
  process.env.DEEPSEEK_API_KEY = "assessment-test-only";
  function request(body) { return new Request("http://localhost/api/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); }
  function mock(responses, check = () => {}) {
    let calls = 0;
    global.fetch = async (url, options) => {
      assert.equal(url, "https://api.deepseek.com/chat/completions");
      const body = JSON.parse(options.body);
      assert.equal(body.model, "deepseek-chat");
      assert.equal(body.response_format.type, "json_object");
      check(body);
      const value = responses[Math.min(calls++, responses.length - 1)];
      if (value instanceof Error) throw value;
      return new Response(JSON.stringify({ choices: [{ message: { content: typeof value === "string" ? value : JSON.stringify(value) } }] }), { status: 200 });
    };
    return () => calls;
  }
  function diagnosis(ids, overrides = {}) {
    return { coveredPointIds: ids, missedPointIds: [], errors: [], fatalErrorCount: 0, coverage: 1, passed: true, modelAnswer: "先按本节任务和要点解释方法。", encouragement: "继续用例子核对自己的理解。", ...overrides };
  }
  function item(id, kind = "gap") { return { pointId: id, kind, title: `目标 ${id}`, explanation: "依据本节要点核对当前说法。", example: "用一个与这个要点有关的小例子解释。", tip: "合上讲义，再用自己的话讲。" }; }
  for (const id of ["l13", "w5", "t5", "t6"]) {
    const lesson = getLessonById(id);
    const ids = lesson.rubricPoints.filter((point) => point.tier === "core").map((point) => point.id);
    mock([diagnosis(ids)], (body) => {
      const system = body.messages[0].content;
      assert.ok(system.includes(lesson.title));
      assert.ok(system.includes(`"category":"${lesson.category ?? "reading"}"`));
      assert.ok(system.includes(lesson.rubricPoints[0].point));
      assert.ok(system.includes("课程优先级"));
    });
    const response = await diagnose(request({ lessonId: id, userText: "这里是本节方法的复述。" }));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.coverage, 1); assert.equal(result.passed, true); testCount++;
  }
  const lesson = getLessonById("l11");
  const core = lesson.rubricPoints.filter((point) => point.tier === "core").map((point) => point.id);
  const bonus = lesson.rubricPoints.filter((point) => point.tier === "bonus").map((point) => point.id);
  assert.ok(bonus.length);
  mock([diagnosis(core)]);
  let result = await (await diagnose(request({ lessonId: "l11", userText: "核心都解释了。" }))).json();
  assert.equal(result.passed, true); assert.ok(bonus.every((id) => result.missedPointIds.includes(id))); testCount++;
  mock([diagnosis([core[0], core[0], "invented"], { coverage: 1, passed: true })]);
  result = await (await diagnose(request({ lessonId: "l11", userText: "只解释一个点。" }))).json();
  assert.equal(result.coverage, Math.round(100 / core.length) / 100); assert.equal(result.passed, false); testCount++;
  mock([diagnosis(core, { errors: [{ pointId: core[0], point: "相关要点", detail: "原话与本节明确冲突。" }], fatalErrorCount: 0 })]);
  result = await (await diagnose(request({ lessonId: "l11", userText: "有一处讲错。" }))).json();
  assert.equal(result.fatalErrorCount, 1); assert.equal(result.passed, false); assert.ok(!result.coveredPointIds.includes(core[0])); testCount++;
  let calls = mock(["not json", diagnosis(core)]);
  assert.equal((await diagnose(request({ lessonId: "l11", userText: "测试重试。" }))).status, 200); assert.equal(calls(), 2); testCount++;
  calls = mock([{}, {}]);
  assert.equal((await diagnose(request({ lessonId: "l11", userText: "测试异常结构。" }))).status, 500); assert.equal(calls(), 2); testCount++;
  calls = mock([diagnosis(core)]);
  assert.equal((await diagnose(request({ lessonId: "l11", userText: "   " }))).status, 400);
  assert.equal((await diagnose(request(null))).status, 400); assert.equal(calls(), 0); testCount++;
  const input = { lessonId: "l11", userText: "只讲了少量内容。", coveredPointIds: [], missedPointIds: [...core, ...bonus], errors: [{ pointId: core[0], point: "相关要点", detail: "这里与本节规则冲突。" }] };
  mock([{ recap: "这次已找到需要核对的步骤。", remedyItems: [item(core[0]), ...core.slice(1).map((id) => item(id)), item(core[0], "error"), item(bonus[0])], nextPrompt: "合上讲义，再讲一遍。" }], (body) => {
    assert.ok(body.messages[0].content.includes(lesson.rubricPoints[0].point));
    const user = JSON.parse(body.messages[1].content);
    assert.deepEqual(user.missedPoints.map((point) => point.id), core);
  });
  result = await (await remedy(request(input))).json();
  assert.equal(result.remedyItems[0].kind, "error");
  assert.deepEqual(result.remedyItems.map((value) => value.pointId), core);
  assert.ok(!result.remedyItems.some((value) => bonus.includes(value.pointId))); testCount++;
  calls = mock([{ recap: "", remedyItems: [item(core[0], "error")], nextPrompt: "" }]);
  assert.equal((await remedy(request(input))).status, 500); assert.equal(calls(), 2); testCount++;
  calls = mock([]);
  assert.equal((await remedy(request({ ...input, missedPointIds: bonus, errors: [] }))).status, 400); assert.equal(calls(), 0); testCount++;
  mock([new Error("mock network failure")]);
  assert.equal((await remedy(request(input))).status, 500); testCount++;
  delete process.env.DEEPSEEK_API_KEY;
  calls = mock([]);
  assert.equal((await diagnose(request({ lessonId: "l11", userText: "方法复述" }))).status, 500); assert.equal(calls(), 0); testCount++;
  console.log(JSON.stringify({ passed: true, checks: testCount, realModelCalls: 0 }, null, 2));
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = originalKey;
  fs.rmSync(temporary, { recursive: true, force: true });
});
