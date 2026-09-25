"use client";

import { ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { PracticeOption, PracticeQuestion } from "../../../lib/types";
import { VoiceDictation } from "./VoiceDictation";

type Phase = "intro" | "answering" | "choose" | "explain" | "review";
type PracticeFeedback = {
  summary: string;
  items: Array<{ id: string; feedback: string }>;
};

const OPTIONS: PracticeOption[] = ["A", "B", "C", "D"];

export function PracticeSection({
  lessonId,
  questions
}: {
  lessonId: string;
  questions: PracticeQuestion[];
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [choices, setChoices] = useState<Record<string, PracticeOption>>({});
  const [reasoning, setReasoning] = useState("");
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
  const [route, setRoute] = useState<"direct" | "explain" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (questions.length === 0) {
    return null;
  }

  const allAnswered = questions.every((item) => Boolean(choices[item.id]));
  const answeredCount = questions.filter((item) => Boolean(choices[item.id])).length;

  function restart() {
    setPhase("answering");
    setChoices({});
    setReasoning("");
    setFeedback(null);
    setRoute(null);
    setError("");
  }

  async function submitExplanation() {
    if (!reasoning.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/practice/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, choices, reasoning })
      });
      const data = (await response.json()) as PracticeFeedback | { error: string };

      if (!response.ok || !('items' in data) || !Array.isArray(data.items)) {
        throw new Error('error' in data ? data.error : "讲题诊断暂时不可用");
      }

      setFeedback(data);
      setRoute("explain");
      setPhase("review");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "讲题诊断暂时不可用");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-t border-ink/20 pt-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-ink/45">OPTIONAL PRACTICE</p>
          <h2 className="mt-3 text-xl font-semibold text-ink">课后例题</h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">
            {questions.length} 道原创小题。先选答案，再决定讲思路或直接看解析；不做也可以继续下一节。
          </p>
        </div>
        {phase !== "intro" ? (
          <span className="text-sm tabular-nums text-ink/50">
            {answeredCount} / {questions.length}
          </span>
        ) : null}
      </div>

      {phase === "intro" ? (
        <button
          type="button"
          onClick={() => setPhase("answering")}
          className="mt-6 inline-flex h-12 items-center gap-3 border border-ink px-5 text-sm font-medium text-ink transition hover:bg-paper"
        >
          开始做题 <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : (
        <div className="mt-7 space-y-8">
          {questions.map((item, index) => {
            const chosen = choices[item.id];
            const revealed = phase === "review";
            const itemFeedback = feedback?.items.find((entry) => entry.id === item.id);

            return (
              <article key={item.id} className="border-t border-ink/15 pt-6">
                <p className="text-xs text-ink/45">第 {index + 1} 题</p>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-ink/75">
                  {item.passage}
                </p>
                <h3 className="mt-5 text-sm font-semibold leading-7 text-ink">
                  {item.prompt}
                </h3>
                <div className="mt-3 grid gap-2" role="group" aria-label={`第 ${index + 1} 题选项`}>
                  {OPTIONS.map((option) => {
                    const selected = chosen === option;
                    const correct = revealed && item.answer === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={phase !== "answering"}
                        aria-pressed={selected}
                        onClick={() => setChoices((current) => ({ ...current, [item.id]: option }))}
                        className={[
                          "flex min-h-12 items-start gap-3 border px-4 py-3 text-left text-sm leading-6 transition",
                          correct
                            ? "border-ink bg-paper text-ink"
                            : selected
                              ? "border-ink text-ink"
                              : "border-ink/15 text-ink/70",
                          phase === "answering" ? "hover:border-ink/50" : "cursor-default"
                        ].join(" ")}
                      >
                        <span className="w-5 shrink-0 font-semibold">{option}.</span>
                        <span>{item.options[option]}</span>
                      </button>
                    );
                  })}
                </div>
                {revealed ? (
                  <div className="mt-5 border-l-2 border-ink bg-paper px-4 py-3 text-sm leading-7">
                    <p className="font-semibold">
                      你的选择：{chosen} · 正确答案：{item.answer}
                    </p>
                    <p className="mt-1 text-ink/75">{item.explanation}</p>
                    {itemFeedback ? (
                      <p className="mt-3 border-t border-ink/10 pt-3 text-ink/75">
                        讲题反馈：{itemFeedback.feedback}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}

          {phase === "answering" ? (
            <button
              type="button"
              disabled={!allAnswered}
              onClick={() => setPhase("choose")}
              className="h-12 w-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40"
            >
              做完了，选择查看方式
            </button>
          ) : null}

          {phase === "choose" ? (
            <div className="border-t border-ink/15 pt-6">
              <h3 className="text-base font-semibold">接下来怎么复盘？</h3>
              <p className="mt-2 text-sm text-ink/55">两种方式都会保留上面的题目和你的选择。</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setPhase("explain")} className="min-h-14 bg-ink px-5 text-left text-sm font-semibold text-white transition hover:bg-ink/85">
                  费曼讲解：说出每题为什么选
                </button>
                <button type="button" onClick={() => { setRoute("direct"); setPhase("review"); }} className="min-h-14 border border-ink px-5 text-left text-sm font-semibold text-ink transition hover:bg-paper">
                  直接对答案并看解析
                </button>
              </div>
            </div>
          ) : null}

          {phase === "explain" ? (
            <div className="border-t border-ink/15 pt-6">
              <h3 className="text-base font-semibold">像教同学一样讲题</h3>
              <p className="mt-2 text-sm leading-6 text-ink/55">
                按题号说明选择和原文证据。例如“第 1 题选 B，因为……”。可以打字，也可以语音输入。
              </p>
              <label className="mt-5 block">
                <span className="sr-only">讲题思路</span>
                <textarea
                  value={reasoning}
                  onChange={(event) => setReasoning(event.target.value)}
                  placeholder="第 1 题我选……，依据是……；第 2 题……"
                  className="min-h-40 w-full resize-y border border-ink/20 p-4 text-sm leading-7 outline-none placeholder:text-ink/35 focus:border-ink"
                />
              </label>
              <div className="mt-3">
                <VoiceDictation value={reasoning} onChange={setReasoning} disabled={loading} />
              </div>
              {error ? <p role="alert" className="mt-3 text-sm text-ink/70">{error}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!reasoning.trim() || loading}
                  onClick={submitExplanation}
                  className="inline-flex h-12 items-center gap-2 bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40"
                >
                  {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  {loading ? "正在诊断思路" : "提交讲解并看反馈"}
                </button>
                <button type="button" disabled={loading} onClick={() => { setRoute("direct"); setPhase("review"); }} className="h-12 border border-ink/25 px-5 text-sm text-ink/70">
                  直接对答案
                </button>
              </div>
            </div>
          ) : null}

          {phase === "review" ? (
            <div className="border-t border-ink/15 pt-6">
              {route === "explain" && feedback ? (
                <p className="text-sm leading-7 text-ink/75">{feedback.summary}</p>
              ) : null}
              <button type="button" onClick={restart} className="mt-5 inline-flex h-12 items-center gap-2 border border-ink/25 px-5 text-sm font-medium text-ink transition hover:bg-paper">
                <RotateCcw aria-hidden="true" className="h-4 w-4" /> 重新做这组题
              </button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
