"use client";

import { Loader2, Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
}

interface BrowserSpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionResultList {
  readonly length: number;
  readonly [index: number]: BrowserSpeechRecognitionResult;
}

interface BrowserSpeechRecognitionEvent {
  readonly results: BrowserSpeechRecognitionResultList;
}

interface BrowserSpeechRecognitionErrorEvent {
  readonly error: string;
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface BrowserSpeechRecognitionConstructor {
  new (): BrowserSpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

type VoiceDictationProps = {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
};

function createBaseText(value: string) {
  const trimmed = value.trimEnd();
  return trimmed ? `${trimmed}\n` : "";
}

function getErrorMessage(error: string) {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "麦克风权限被拒绝，请点浏览器地址栏的权限图标开启麦克风后重试";
    case "no-speech":
      return "没听到声音，靠近麦克风再试一次";
    case "network":
      return "语音识别服务连接失败，可换 Edge 浏览器，或直接打字复述";
    default:
      return "语音输入暂时不可用，请稍后重试或直接打字复述";
  }
}

export function VoiceDictation({
  value,
  onChange,
  disabled = false
}: VoiceDictationProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const disabledRef = useRef(disabled);
  const shouldListenRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const restartBlockedRef = useRef(false);
  const baseTextRef = useRef("");
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const wasChangedByTyping = shouldListenRef.current && value !== valueRef.current;
    valueRef.current = value;

    if (!wasChangedByTyping) {
      return;
    }

    baseTextRef.current = createBaseText(value);
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";

    try {
      recognitionRef.current?.abort();
    } catch {
      // The browser may already be between recognition sessions.
    }
  }, [value]);

  useEffect(() => {
    disabledRef.current = disabled;

    if (!disabled || !recognitionRef.current) {
      return;
    }

    shouldListenRef.current = false;
    stopRequestedRef.current = true;
    setIsListening(false);

    try {
      recognitionRef.current.abort();
    } catch {
      // The microphone is already released.
    }
  }, [disabled]);

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "zh-CN";
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setIsSupported(true);

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      finalTranscriptRef.current = finalTranscript;
      interimTranscriptRef.current = interimTranscript;

      const nextValue =
        baseTextRef.current + finalTranscript + interimTranscript;
      valueRef.current = nextValue;
      onChangeRef.current(nextValue);
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        return;
      }

      restartBlockedRef.current = true;
      shouldListenRef.current = false;
      stopRequestedRef.current = true;
      setIsListening(false);
      setErrorMessage(getErrorMessage(event.error));
    };

    recognition.onend = () => {
      if (
        !shouldListenRef.current ||
        stopRequestedRef.current ||
        restartBlockedRef.current ||
        disabledRef.current
      ) {
        setIsListening(false);
        return;
      }

      baseTextRef.current = createBaseText(valueRef.current);
      finalTranscriptRef.current = "";
      interimTranscriptRef.current = "";

      try {
        recognition.start();
        setIsListening(true);
      } catch {
        shouldListenRef.current = false;
        restartBlockedRef.current = true;
        setIsListening(false);
        setErrorMessage("语音输入暂时不可用，请稍后重试或直接打字复述");
      }
    };

    return () => {
      shouldListenRef.current = false;
      stopRequestedRef.current = true;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.abort();
      } catch {
        // The microphone is already released.
      }

      recognitionRef.current = null;
    };
  }, []);

  function startListening() {
    const recognition = recognitionRef.current;

    if (!recognition || disabled || shouldListenRef.current) {
      return;
    }

    baseTextRef.current = createBaseText(valueRef.current);
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    stopRequestedRef.current = false;
    restartBlockedRef.current = false;
    shouldListenRef.current = true;
    setErrorMessage("");

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      shouldListenRef.current = false;
      restartBlockedRef.current = true;
      setIsListening(false);
      setErrorMessage("语音输入启动失败，请稍后重试或直接打字复述");
    }
  }

  function stopListening() {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    shouldListenRef.current = false;
    stopRequestedRef.current = true;
    setIsListening(false);

    try {
      recognition.stop();
    } catch {
      try {
        recognition.abort();
      } catch {
        // The microphone is already released.
      }
    }
  }

  if (isSupported === false) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-black/10 bg-paper px-4 text-sm font-semibold text-ink/35"
        >
          <Mic aria-hidden="true" className="h-5 w-5" />
          用嘴讲（语音转文字）
        </button>
        <p className="text-sm leading-6 text-ink/55">
          当前浏览器不支持语音输入，可用 Chrome/Edge，或直接打字
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        aria-pressed={isListening}
        disabled={disabled || isSupported === null}
        onClick={isListening ? stopListening : startListening}
        className={[
          "flex h-14 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
          isListening
            ? "border-coral bg-coral/10 text-coral"
            : "border-leaf/40 bg-white text-leaf"
        ].join(" ")}
      >
        {isSupported === null ? (
          <>
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
            正在检测语音输入...
          </>
        ) : isListening ? (
          <>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 animate-pulse rounded-full bg-coral"
            />
            <Square aria-hidden="true" className="h-4 w-4 fill-current" />
            正在听，点此停止
          </>
        ) : (
          <>
            <Mic aria-hidden="true" className="h-5 w-5" />
            用嘴讲（语音转文字）
          </>
        )}
      </button>

      {isListening ? (
        <p aria-live="polite" className="text-sm leading-6 text-ink/55">
          请像教同学一样，用自己的话讲出来。
        </p>
      ) : null}

      {errorMessage ? (
        <p
          role="status"
          className="rounded-lg border border-coral/25 bg-coral/10 px-3 py-2 text-sm leading-6 text-coral"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
