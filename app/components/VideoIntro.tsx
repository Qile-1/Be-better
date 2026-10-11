"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function VideoIntro({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"playing" | "leaving" | "done">("playing");
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dismiss = useCallback(() => {
    setPhase((current) => current === "playing" ? "leaving" : current);
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const video = videoRef.current;
    skipRef.current?.focus({ preventScroll: true });
    if (!video) return;
    // A failed or stalled opening must never block access to the app.
    let watchdog = window.setTimeout(dismiss, 12000);
    const onPlaying = () => {
      window.clearTimeout(watchdog);
      watchdog = window.setTimeout(dismiss, 120000);
    };
    video.addEventListener("playing", onPlaying);
    video.play().catch(dismiss);
    return () => {
      window.clearTimeout(watchdog);
      video.removeEventListener("playing", onPlaying);
      video.pause();
    };
  }, [phase, dismiss]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setPhase("done"), 800);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") contentRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <>
      <div ref={contentRef} tabIndex={-1} inert={phase !== "done"} className="outline-none">
        {children}
      </div>
      {phase !== "done" ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Be better 开场视频"
          onKeyDown={(event) => { if (event.key === "Escape") dismiss(); }}
          className={`fixed inset-0 z-[100] bg-black transition-opacity duration-[800ms] ease-out motion-reduce:duration-150 ${phase === "leaving" ? "opacity-0" : "opacity-100"}`}
        >
          <video
            ref={videoRef}
            src="/videos/be-better-intro.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onEnded={dismiss}
            onError={dismiss}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <button
            ref={skipRef}
            type="button"
            onClick={dismiss}
            aria-label="跳过开场视频，进入 Be better"
            className="absolute inset-0 flex h-full w-full cursor-pointer items-end justify-center bg-transparent pb-[max(2rem,env(safe-area-inset-bottom))] focus-visible:outline-none"
          >
            <span className="rounded-full bg-black/30 px-5 py-2 text-sm text-white backdrop-blur-sm">
              点击进入 Be better
            </span>
          </button>
        </div>
      ) : null}
    </>
  );
}
