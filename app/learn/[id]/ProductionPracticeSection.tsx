"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { ProductionTask } from "../../../lib/types";

type Feedback = { summary: string; strengths: string[]; improvements: string[]; nextStep: string };
type Reveal = "direct" | "ai";

export function ProductionPracticeSection({ lessonId, category, tasks }: { lessonId: string; category: "writing" | "translation"; tasks: ProductionTask[] }) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, Reveal>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isWriting = category === "writing";

  async function requestFeedback(task: ProductionTask) {
    if (!drafts[task.id]?.trim() || loadingId) return;
    setLoadingId(task.id);
    setErrors((current) => ({ ...current, [task.id]: "" }));
    try {
      const response = await fetch("/api/production/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, taskId: task.id, answer: drafts[task.id] })
      });
      const data = (await response.json()) as Feedback | { error: string };
      if (!response.ok || !("strengths" in data)) {
        throw new Error("error" in data ? data.error : "AI 反馈暂时不可用");
      }
      setFeedback((current) => ({ ...current, [task.id]: data }));
      setRevealed((current) => ({ ...current, [task.id]: "ai" }));
    } catch (caught) {
      setErrors((current) => ({ ...current, [task.id]: caught instanceof Error ? caught.message : "AI 反馈暂时不可用" }));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="border-t border-ink/20 pt-8">
      <p className="text-xs font-medium tracking-[0.16em] text-ink/45">OPTIONAL PRACTICE</p>
      <h2 className="mt-3 text-xl font-semibold text-ink">{isWriting ? "写作练习" : "翻译练习"}</h2>
      <p className="mt-2 text-sm leading-7 text-ink/60">
        本节 {tasks.length} 道原创题，可任选。先独立写，再获取 AI 反馈或直接查看参考写法与解析；参考写法不是唯一答案。
      </p>
      <div className="mt-8 space-y-10">
        {tasks.map((task, index) => {
          const route = revealed[task.id];
          const result = feedback[task.id];
          const answer = drafts[task.id] ?? "";
          const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;
          return (
            <article key={task.id} className="border-t border-ink/15 pt-6">
              <p className="text-xs text-ink/45">第 {index + 1} 题 · {isWriting ? "主题写作" : "汉译英"}</p>
              <h3 className="mt-4 whitespace-pre-line text-base font-medium leading-8 text-ink">{task.prompt}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/55">训练重点：{task.focus}</p>
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-medium">你的英文答案</span>
                <textarea
                  value={answer}
                  maxLength={8000}
                  onChange={(event) => {
                    setDrafts((current) => ({ ...current, [task.id]: event.target.value }));
                    if (route) setRevealed((current) => { const next = { ...current }; delete next[task.id]; return next; });
                  }}
                  placeholder={isWriting ? "先写提纲，再在这里完成英文短文……" : "先自己翻译，再在这里写下英文段落……"}
                  className="min-h-52 w-full resize-y border border-ink/20 bg-white p-4 text-sm leading-7 text-ink outline-none placeholder:text-ink/35 focus:border-ink"
                />
              </label>
              <p className="mt-2 text-xs text-ink/45">{isWriting ? `英文词数（按空格估算）：${words}；正式练习建议 120—180 词` : `已输入 ${answer.length} 字符`}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" disabled={!answer.trim() || Boolean(loadingId)} onClick={() => requestFeedback(task)} className="inline-flex h-12 items-center gap-2 bg-ink px-5 text-sm font-medium text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40">
                  {loadingId === task.id ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  {loadingId === task.id ? "正在反馈" : "获取 AI 反馈"}
                </button>
                <button type="button" disabled={!answer.trim() || Boolean(loadingId)} onClick={() => setRevealed((current) => ({ ...current, [task.id]: "direct" }))} className="h-12 border border-ink/25 px-5 text-sm font-medium text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40">
                  直接看参考写法与解析
                </button>
              </div>
              {errors[task.id] ? <p role="alert" className="mt-3 text-sm text-coral">{errors[task.id]}</p> : null}
              {route ? (
                <div className="mt-6 border-l-2 border-ink bg-paper p-5 text-sm leading-7 text-ink/75">
                  {route === "ai" && result ? (
                    <div className="mb-5 border-b border-ink/15 pb-5">
                      <h4 className="font-semibold text-ink">针对你的答案</h4>
                      <p className="mt-2">{result.summary}</p>
                      <p className="mt-3 font-medium text-ink">做得好的地方</p>
                      <ul className="list-disc pl-5">{result.strengths.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
                      <p className="mt-3 font-medium text-ink">可以改进</p>
                      <ul className="list-disc pl-5">{result.improvements.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
                      <p className="mt-3">下一步：{result.nextStep}</p>
                    </div>
                  ) : null}
                  <h4 className="font-semibold text-ink">参考{isWriting ? "写法" : "译文"}</h4>
                  <p className="mt-2 whitespace-pre-line">{task.reference}</p>
                  <h4 className="mt-5 font-semibold text-ink">解析</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5">{task.analysis.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
                  <button type="button" onClick={() => {
                    setDrafts((current) => ({ ...current, [task.id]: "" }));
                    setRevealed((current) => { const next = { ...current }; delete next[task.id]; return next; });
                    setFeedback((current) => { const next = { ...current }; delete next[task.id]; return next; });
                  }} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4">
                    <RotateCcw aria-hidden="true" className="h-4 w-4" /> 清空并重做这一题
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
