"use client";

import { ArrowUpRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LESSONS } from "../lib/lessons";
import { getProgress, type Progress } from "../lib/storage";

const subjects = [
  { id: "reading", label: "阅读", english: "Reading", note: "读懂文章，讲清解题思路。" },
  { id: "writing", label: "写作", english: "Writing", note: "理清结构，把观点写明白。" },
  { id: "translation", label: "翻译", english: "Translation", note: "拆解句子，准确表达意思。" }
] as const;

export default function HomePage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [subject, setSubject] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setProgress(getProgress());
    const video = videoRef.current;
    if (video?.error) setVideoFailed(true);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => {
      if (preference.matches) video?.pause();
      else void video?.play().catch(() => {
        setPlaying(false);
        if (video?.error) setVideoFailed(true);
      });
    };
    applyMotionPreference();
    preference.addEventListener("change", applyMotionPreference);
    return () => preference.removeEventListener("change", applyMotionPreference);
  }, []);

  const saved = progress?.lessons ?? {};
  const validProgress = LESSONS.filter((lesson) => saved[lesson.id]);
  const masteredCount = validProgress.filter((lesson) => saved[lesson.id].status === "mastered").length;
  const due = validProgress.filter((lesson) => saved[lesson.id].nextReviewAt <= Date.now());
  const recent = [...validProgress].sort((a, b) => saved[b.id].updatedAt - saved[a.id].updatedAt)[0];
  const continueLesson = due[0] ?? (recent && saved[recent.id].status !== "mastered" ? recent : LESSONS.find((lesson) => saved[lesson.id]?.status !== "mastered"));
  const selected = subjects[subject];
  const featured = LESSONS.find((lesson) => (lesson.category ?? "reading") === selected.id && saved[lesson.id]?.status !== "mastered")
    ?? LESSONS.find((lesson) => (lesson.category ?? "reading") === selected.id)!;
  const featuredNumber = LESSONS.indexOf(featured) + 1;

  async function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) video.pause();
    else {
      try { await video.play(); }
      catch { setPlaying(false); }
    }
  }

  return (
    <section className="film-home">
      <video ref={videoRef} className="film-background" src="/videos/be-better-intro-web-v2.mp4"
        poster="/images/intro-poster.jpg" muted loop playsInline preload="metadata" aria-hidden="true"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => { setVideoFailed(true); setPlaying(false); }} />
      <div className="film-scrim" />
      <div className="film-content">
        <div className="film-introduction">
          <p className="eyebrow">CET-4 / 学习，从理解开始</p>
          <h1>学懂。<br />再讲给<em>自己听。</em></h1>
          <p className="film-lead">把阅读、写作、翻译的方法讲清楚。<br />学一个要点，用自己的话讲一遍，<br />再看哪里需要补。</p>
          <Link href={continueLesson ? `/learn/${continueLesson.id}` : "/learn"} className="design-cta design-cta-light">
            {due.length ? "复习待巩固的内容" : validProgress.length ? "继续今天的学习" : "进入今天的学习"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <aside className="film-rail" aria-label="学习方向">
          <p className="eyebrow">三个方向 / 一个学习循环</p>
          <div className="film-subjects">{subjects.map((item, index) => (
            <button key={item.id} type="button" className={`film-subject ${subject === index ? "selected" : ""}`}
              aria-pressed={subject === index} onClick={() => setSubject(index)}>
              <b>{item.label}</b><span>{item.english}</span>
            </button>
          ))}</div>
          <p className="film-rail-note">{selected.note}<br />学微课 → 复述 → 诊断</p>
          <Link href={`/learn?subject=${selected.id}`} className="film-subject-link">浏览{selected.label}课程 <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </aside>
      </div>
      <div className="film-bottom">
        <span className="film-chapter">{String(featuredNumber).padStart(2, "0")}</span>
        <div className="film-current"><span>课程选读 · {selected.label}</span><h2>{featured.title.replace(/^[^·]+·\s*/, "")}</h2></div>
        <Link href={`/learn/${featured.id}`} className="film-outline">查看课程 <ArrowUpRight size={14} aria-hidden="true" /></Link>
        <div className="film-progress"><span>已掌握 {masteredCount} / {LESSONS.length}</span><div role="progressbar" aria-label="课程掌握进度" aria-valuenow={masteredCount} aria-valuemin={0} aria-valuemax={LESSONS.length}><i style={{ width: `${masteredCount / LESSONS.length * 100}%` }} /></div></div>
        <div className="film-controls"><span>{videoFailed ? "静态影像" : "开场影像"}</span><button type="button" onClick={() => void toggleVideo()} disabled={videoFailed} aria-label={playing ? "暂停开场视频" : "播放开场视频"}>{playing ? <Pause size={15} /> : <Play size={15} />}</button></div>
      </div>
    </section>
  );
}
