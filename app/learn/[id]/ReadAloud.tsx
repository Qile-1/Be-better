"use client";

import { Square, Volume2 } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode
} from "react";

type SpeechPart = { text: string; lang: "zh-CN" | "en-US" };
type ReadAloudContextValue = {
  supported: boolean;
  activeId: string | null;
  toggle: (id: string, text: string, englishOnly?: boolean) => void;
};

const ReadAloudContext = createContext<ReadAloudContextValue | null>(null);
const englishPhrase = /[A-Za-z]+(?:['\u2019-][A-Za-z]+)*(?:[ \t]+[A-Za-z]+(?:['\u2019-][A-Za-z]+)*)*/g;

function splitSpeech(text: string, englishOnly: boolean): SpeechPart[] {
  const runs: SpeechPart[] = [];
  if (englishOnly || !/[\u3400-\u9fff]/.test(text)) {
    runs.push({ text, lang: "en-US" });
  } else {
    let cursor = 0;
    for (const match of text.matchAll(englishPhrase)) {
      runs.push({ text: text.slice(cursor, match.index), lang: "zh-CN" });
      runs.push({ text: match[0], lang: "en-US" });
      cursor = match.index + match[0].length;
    }
    runs.push({ text: text.slice(cursor), lang: "zh-CN" });
  }

  // Short utterances avoid long-text stalls in native browser speech engines.
  return runs.flatMap(({ text: run, lang }) => {
    const parts: SpeechPart[] = [];
    let remaining = run.trim();
    while (remaining.length > 160) {
      const head = remaining.slice(0, 160);
      const punctuation = Math.max(head.lastIndexOf("。"), head.lastIndexOf("；"), head.lastIndexOf("，"), head.lastIndexOf(". "), head.lastIndexOf(", "));
      const space = lang === "en-US" ? head.lastIndexOf(" ") : -1;
      const end = punctuation > 60 ? punctuation + 1 : space > 60 ? space : 160;
      parts.push({ text: remaining.slice(0, end), lang });
      remaining = remaining.slice(end).trim();
    }
    if (remaining) parts.push({ text: remaining, lang });
    return parts.filter((part) => /[A-Za-z0-9\u3400-\u9fff]/.test(part.text));
  });
}

export function ReadAloudProvider({ children }: { children: ReactNode }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const activeRef = useRef<string | null>(null);
  const sessionRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    activeRef.current = null;
    utteranceRef.current = null;
    setActiveId(null);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    const available = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(available);
    if (!available) return;
    // Voice lists may load asynchronously; getVoices also primes lazy engines.
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    const onVisibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", stop);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", stop);
      stop();
    };
  }, [stop]);

  const toggle = useCallback((id: string, text: string, englishOnly = false) => {
    const wasActive = activeRef.current === id;
    stop();
    setError("");
    if (wasActive || !supported) return;
    const parts = splitSpeech(text, englishOnly);
    if (!parts.length) return;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const unavailable = parts.find((part) => voices.length && !voices.some((voice) => voice.lang.toLowerCase().startsWith(part.lang.slice(0, 2))));
    if (unavailable) {
      setError(`当前设备没有可用的${unavailable.lang === "en-US" ? "英语" : "中文"}朗读声音，请检查系统语音设置或换个浏览器。`);
      return;
    }
    const session = sessionRef.current;
    activeRef.current = id;
    setActiveId(id);

    const fail = () => {
      if (session !== sessionRef.current) return;
      stop();
      setError("朗读暂时不可用，请再点一次，或换个浏览器试试。");
    };
    const speakPart = (index: number) => {
      if (session !== sessionRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (index >= parts.length) { stop(); return; }
      const part = parts[index];
      const utterance = new SpeechSynthesisUtterance(part.text);
      utterance.lang = part.lang;
      utterance.rate = 0.9;
      const candidates = voices.filter((voice) => voice.lang.toLowerCase().startsWith(part.lang.slice(0, 2)));
      const exact = candidates.filter((voice) => voice.lang.toLowerCase() === part.lang.toLowerCase());
      const voice = exact.find((item) => item.localService) ?? exact[0] ?? candidates.find((item) => item.localService) ?? candidates[0];
      if (voice) utterance.voice = voice;
      utterance.onstart = () => {
        if (session !== sessionRef.current) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(fail, 60000);
      };
      utterance.onend = () => speakPart(index + 1);
      utterance.onerror = fail;
      utteranceRef.current = utterance;
      timerRef.current = setTimeout(fail, 10000);
      try {
        synth.resume();
        synth.speak(utterance);
      } catch { fail(); }
    };
    speakPart(0);
  }, [stop, supported]);

  return (
    <ReadAloudContext.Provider value={{ supported: supported === true, activeId, toggle }}>
      {supported === false ? <p className="mb-4 text-sm leading-6 text-ink/55" role="status">当前浏览器不支持点读，文字学习仍可正常使用。</p> : null}
      {error ? <p className="mb-4 border-l-2 border-coral bg-coral/5 px-3 py-2 text-sm leading-6 text-ink" role="alert">{error}</p> : null}
      {children}
    </ReadAloudContext.Provider>
  );
}

export function ReadAloudBlock({ text, label, children }: { text: string; label: string; children: ReactNode }) {
  const context = useContext(ReadAloudContext);
  const id = useId();
  const active = context?.activeId === id;
  return (
    <div className="flex min-w-0 items-start gap-2 md:gap-3">
      <div className="min-w-0 flex-1">{children}</div>
      <button type="button" disabled={!context?.supported} aria-label={`${active ? "停止" : "朗读"}${label}`} title={`${active ? "停止" : "朗读"}${label}`} aria-pressed={active}
        onClick={() => context?.toggle(id, text)}
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-30 ${active ? "border-ink bg-ink text-white" : "border-ink/10 bg-white/70 text-ink/50 hover:border-ink/40 hover:text-ink"}`}>
        {active ? <Square aria-hidden="true" className="h-3.5 w-3.5" /> : <Volume2 aria-hidden="true" className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function PronounceWords({ text }: { text: string }) {
  const context = useContext(ReadAloudContext);
  const id = useId();
  const parts = text.split(/([A-Za-z]+(?:['\u2019-][A-Za-z]+)*)/g);
  return <>{parts.map((part, index) => {
    if (!/^[A-Za-z]+(?:['\u2019-][A-Za-z]+)*$/.test(part)) return part;
    const wordId = `${id}-${index}`;
    const active = context?.activeId === wordId;
    return <button key={wordId} type="button" disabled={!context?.supported} aria-label={`发音：${part}`} title={`听 ${part} 的发音`} aria-pressed={active} onClick={() => context?.toggle(wordId, part, true)}
      className={`inline rounded-sm font-[inherit] underline decoration-dotted decoration-ink/30 underline-offset-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:no-underline ${active ? "bg-ink text-white decoration-transparent" : "hover:bg-ink/10 hover:decoration-ink"}`}>
      {part}
    </button>;
  })}</>;
}
