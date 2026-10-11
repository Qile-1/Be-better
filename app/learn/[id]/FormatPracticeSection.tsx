"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { FormatPractice } from "../../../lib/types";

export function FormatPracticeSection({ practice }: { practice: FormatPractice }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const complete = practice.items.every((item) => Boolean(answers[item.id]));
  const correct = practice.items.filter((item) => answers[item.id] === item.answer).length;

  return (
    <section className="my-8 border-t border-ink/20 pt-8">
      <h2 className="text-xl font-semibold text-ink">{practice.title}</h2>
      <p className="mt-3 text-sm leading-7 text-ink/65">{practice.instructions}</p>
      {practice.passage ? <p className="mt-6 whitespace-pre-line text-base leading-8 text-ink">{practice.passage}</p> : null}
      {practice.paragraphs?.map((paragraph) => (
        <p key={paragraph.label} className="mt-4 text-sm leading-7 text-ink/85"><strong>[{paragraph.label}] </strong>{paragraph.text}</p>
      ))}
      {practice.kind === "cloze" ? (
        <ul aria-label="词库" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {practice.options.map((option) => <li key={option.label} className="break-words bg-paper px-3 py-2 text-sm">{option.label}. {option.text}</li>)}
        </ul>
      ) : null}
      <div className="mt-6 space-y-4">
        {practice.items.map((item) => (
          <div key={item.id} className="border-b border-ink/10 pb-4">
            <label htmlFor={`${practice.id}-${item.id}`} className="block text-sm leading-7 text-ink">{practice.kind === "matching" ? `${item.id}. ` : ""}{item.prompt}</label>
            <select
              id={`${practice.id}-${item.id}`}
              value={answers[item.id] ?? ""}
              disabled={submitted}
              onChange={(event) => setAnswers((previous) => ({ ...previous, [item.id]: event.target.value }))}
              className="mt-2 min-h-12 w-full rounded-lg border border-ink/25 bg-white px-3 text-base text-ink focus:border-leaf focus:outline-none disabled:bg-paper"
            >
              <option value="">请选择</option>
              {practice.options.map((option) => (
                <option key={option.label} value={option.label} disabled={practice.kind === "cloze" && Object.entries(answers).some(([id, answer]) => id !== item.id && answer === option.label)}>
                  {option.label}. {option.text}
                </option>
              ))}
            </select>
            {submitted ? (
              <div className="mt-3 text-sm leading-7">
                <p className={answers[item.id] === item.answer ? "font-semibold text-leaf" : "font-semibold text-coral"}>{answers[item.id] === item.answer ? "正确" : `待订正：你选 ${answers[item.id]}`} · 答案 {item.answer}</p>
                <p className="text-ink/70">{item.explanation}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div aria-live="polite" className="mt-5 text-sm leading-7 text-ink/70">
        {submitted ? `本次答对 ${correct} / ${practice.items.length}。这是题型练习成绩，不改变复述掌握度；本次作答不持久保存。` : `已作答 ${Object.values(answers).filter(Boolean).length} / ${practice.items.length}`}
      </div>
      {submitted ? (
        <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 border border-ink/25 px-4 text-ink"><RotateCcw className="h-4 w-4" aria-hidden="true" />重新练习</button>
      ) : (
        <button type="button" disabled={!complete} onClick={() => setSubmitted(true)} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 bg-ink px-4 text-white disabled:cursor-not-allowed disabled:opacity-40"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />提交并核对解析</button>
      )}
    </section>
  );
}
