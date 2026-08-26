"use client";
import { useRef, useState } from "react";
import { Mic, MicOff, Languages } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  lang?: string;
  onTranscript: (text: string) => void;
  placeholder?: string;
};

type SpeechRecognitionAlternative = { transcript: string };
type SpeechRecognitionResult = { isFinal: boolean; 0: SpeechRecognitionAlternative; length: number };
type SpeechRecognitionEvent = { resultIndex: number; results: SpeechRecognitionResult[] };
type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionCtor;
    SpeechRecognition?: SpeechRecognitionCtor;
  }
}

export default function VoiceIntake({ lang = "en-IN", onTranscript, placeholder }: Props) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !!(window.webkitSpeechRecognition ?? window.SpeechRecognition);
  });
  const [interim, setInterim] = useState("");
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  const start = () => {
    const SR = window.webkitSpeechRecognition ?? window.SpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    recRef.current = rec;
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let text = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) text += res[0].transcript + " ";
        else interimText += res[0].transcript;
      }
      if (text) onTranscript(text.trim());
      setInterim(interimText);
    };
    rec.onend = () => { setRecording(false); setInterim(""); };
    rec.onerror = () => setRecording(false);
    rec.start();
    setRecording(true);
  };

  const stop = () => {
    try { recRef.current?.stop(); } catch { /* ignore */ }
    setRecording(false);
  };

  if (!supported) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 flex items-center gap-2">
        <MicOff size={14} /> Voice not supported in this browser — use text. Works in Chrome/Edge desktop & Android. Text remains baseline.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant={recording ? "accent" : "outline"}
        size="sm"
        onClick={recording ? stop : start}
        aria-label={recording ? "Stop recording" : "Start voice intake"}
      >
        {recording ? <><span className="h-2 w-2 rounded-full bg-white animate-pulse" /> Listening… Stop</> : <><Mic size={14} /> Speak · {lang.startsWith("hi") ? "हिन्दी" : "English"}</>}
      </Button>
      <span className="text-xs text-zinc-500 flex items-center gap-1"><Languages size={12} /> Enhances intake; text is fallback. {interim && <span className="font-mono bg-white border border-zinc-200 rounded px-1.5 py-0.5">{interim}</span>}</span>
      {placeholder && <span className="text-xs text-zinc-400 w-full">{placeholder}</span>}
    </div>
  );
}
