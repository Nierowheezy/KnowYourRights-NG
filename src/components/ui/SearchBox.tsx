import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { IconSearch, IconMic, IconMicOff, IconCheck, IconX } from "../icons";

type Variant = "large" | "small";

type VoiceState = "idle" | "listening" | "confirming";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: Variant;
  showCount?: number;
  ariaLabel?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  ariaExpanded?: boolean;
  ariaControls?: string;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: any) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search the guide",
  variant = "large",
  showCount,
  ariaLabel = "Search",
  className = "",
  onFocus,
  onBlur,
  onKeyDown,
  ariaExpanded,
  ariaControls,
}: SearchBoxProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceDraft, setVoiceDraft] = useState("");
  const [inputValue, setInputValue] = useState(value);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (voiceState === "idle") setInputValue(value);
  }, [value, voiceState]);

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const rec = new SpeechRecognitionCtor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-NG";
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      let transcript = "";
      let isFinal = false;
      for (let i = 0; i < ev.results.length; i++) {
        transcript += ev.results[i][0].transcript;
        if (ev.results[i].isFinal) isFinal = true;
      }
      setVoiceDraft(transcript);
      setInputValue(transcript);
      if (isFinal) {
        rec.stop();
        setVoiceState("confirming");
      }
    };
    rec.onerror = () => {
      setVoiceState("idle");
      setVoiceDraft("");
      setInputValue(value);
    };
    rec.onend = () => {
      if (voiceState === "listening" && !voiceDraft.trim()) {
        setVoiceState("idle");
        setInputValue(value);
      }
    };
    recognitionRef.current = rec;
    return () => rec.stop();
  }, [value]);

  const startListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    setVoiceDraft("");
    setInputValue("");
    rec.start();
    setVoiceState("listening");
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    rec.stop();
    if (voiceDraft.trim()) {
      setVoiceState("confirming");
    } else {
      setVoiceState("idle");
      setInputValue(value);
    }
  };

  const confirmVoice = () => {
    if (voiceDraft.trim()) {
      onChange(voiceDraft.trim());
      setInputValue(voiceDraft.trim());
    }
    setVoiceState("idle");
    setVoiceDraft("");
  };

  const cancelVoice = () => {
    setVoiceState("idle");
    setVoiceDraft("");
    setInputValue(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const fieldClass =
    variant === "large" ? "search-box__field" : "search-sm";
  const inputClass =
    variant === "large" ? "search-box__query" : "search-sm__input";

  const isListening = voiceState === "listening";
  const isConfirming = voiceState === "confirming";
  const isVoiceActive = isListening || isConfirming;

  const listeningStyle = isListening ? {
    animation: "pulse 1.2s ease-in-out infinite",
    boxShadow: "0 0 0 2px var(--forest)",
  } : {};

  const waveBarStyle = (delay: number) => ({
    width: 3,
    height: 16,
    borderRadius: 2,
    background: "var(--forest)",
    animation: `wave 0.8s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    opacity: 0.8,
  });

  return (
    <div className={`${fieldClass} ${className}`}>
      <IconSearch
        style={{ color: "var(--forest)", flexShrink: 0 }}
        width={variant === "large" ? 24 : 16}
        height={variant === "large" ? 24 : 16}
      />
      <input
        className={inputClass}
        type="search"
        value={isVoiceActive ? inputValue : value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          if (isVoiceActive) {
            setInputValue(v);
            setVoiceDraft(v);
          } else {
            onChange(v);
          }
        }}
        placeholder={isListening ? "Listening…" : isConfirming ? "Tap ✓ to search or ✕ to cancel" : placeholder}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(e) => {
          handleKeyDown(e);
          onKeyDown?.(e);
        }}
      />
      {variant === "large" && (
        <span className="badge-lime" aria-live="polite">
          {showCount ?? 0} matches
        </span>
      )}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {isListening && (
          <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
            <div style={waveBarStyle(0)} />
            <div style={waveBarStyle(0.1)} />
            <div style={waveBarStyle(0.2)} />
            <div style={waveBarStyle(0.1)} />
            <div style={waveBarStyle(0)} />
          </div>
        )}
        <button
          type="button"
          aria-label={isListening ? "Stop listening" : isConfirming ? "Voice ready" : "Search by voice"}
          onClick={isListening ? stopListening : isConfirming ? cancelVoice : startListening}
          title={isListening ? "Stop listening" : isConfirming ? "Cancel" : "Speak to search"}
          className="search-voice"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: variant === "large" ? 36 : 28,
            height: variant === "large" ? 36 : 28,
            borderRadius: "999px",
            border: "1px solid var(--line)",
            background: isListening ? "var(--forest)" : isConfirming ? "var(--forest)" : "var(--surface)",
            color: isListening || isConfirming ? "#fff" : "var(--text)",
            cursor: "pointer",
            marginLeft: 0,
            transition: "background 150ms ease, border-color 150ms ease",
            ...listeningStyle,
          }}
        >
          {isListening ? (
            <IconMicOff width={variant === "large" ? 18 : 14} height={variant === "large" ? 18 : 14} />
          ) : isConfirming ? (
            <IconCheck width={variant === "large" ? 18 : 14} height={variant === "large" ? 18 : 14} />
          ) : (
            <IconMic width={variant === "large" ? 18 : 14} height={variant === "large" ? 18 : 14} />
          )}
        </button>
      </div>
      {isConfirming && (
        <div style={{ display: "flex", gap: 6, marginLeft: 6 }}>
          <button
            type="button"
            aria-label="Cancel voice input"
            onClick={cancelVoice}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: variant === "large" ? 32 : 24,
              height: variant === "large" ? 32 : 24,
              borderRadius: "999px",
              border: "1px solid var(--line)",
              background: "var(--surface)",
              color: "var(--text)",
              cursor: "pointer",
            }}
            title="Cancel"
          >
            <IconX width={variant === "large" ? 16 : 12} height={variant === "large" ? 16 : 12} />
          </button>
          <button
            type="button"
            aria-label="Confirm and search"
            onClick={confirmVoice}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: variant === "large" ? 32 : 24,
              height: variant === "large" ? 32 : 24,
              borderRadius: "999px",
              border: "1px solid var(--forest)",
              background: "var(--forest)",
              color: "#fff",
              cursor: "pointer",
            }}
            title="Search"
          >
            <IconCheck width={variant === "large" ? 16 : 12} height={variant === "large" ? 16 : 12} />
          </button>
        </div>
      )}
    </div>
  );
}
