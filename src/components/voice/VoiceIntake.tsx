"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Languages } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  lang?: string; // e.g., "en-IN" or "hi-IN"
  onTranscript: (text: string) => void;
  placeholder?: string;
};

export default function VoiceIntake({ lang = "en-IN", onTranscript, placeholder }: Props) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [interim, setInterim] = useState("");
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR: any = (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) || (typeof window !== "undefined" && (window as any).SpeechRecognition);
    if (!SR) setSupported(false);
  }, []);

  const start = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    recRef.current = rec;
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
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
    try { recRef.current?.stop(); } catch {}
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
