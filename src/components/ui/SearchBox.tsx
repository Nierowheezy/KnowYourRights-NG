import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { IconSearch, IconMic, IconMicOff } from "../icons";

type Variant = "large" | "small";

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
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const rec = new SpeechRecognitionCtor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-NG";
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      const transcript = Array.from(ev.results)
        .map((r) => r[0].transcript)
        .join(" ");
      onChange(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    return () => rec.stop();
  }, [onChange]);

  const toggleListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      rec.start();
      setListening(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Let parent handle focus/scroll; prevent form submit
      (e.target as HTMLInputElement).blur();
    }
  };

  const fieldClass =
    variant === "large" ? "search-box__field" : "search-sm";
  const inputClass =
    variant === "large" ? "search-box__query" : "search-sm__input";

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
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
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
      <button
        type="button"
        aria-label={listening ? "Stop voice input" : "Search by voice"}
        onClick={toggleListening}
        title={listening ? "Stop listening" : "Speak to search"}
        className="search-voice"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: variant === "large" ? 36 : 28,
          height: variant === "large" ? 36 : 28,
          borderRadius: "999px",
          border: "1px solid var(--line)",
          background: listening ? "var(--warning-tint)" : "var(--surface)",
          color: "var(--text)",
          cursor: "pointer",
          marginLeft: 8,
        }}
      >
        {listening ? (
          <IconMicOff width={variant === "large" ? 18 : 14} height={variant === "large" ? 18 : 14} />
        ) : (
          <IconMic width={variant === "large" ? 18 : 14} height={variant === "large" ? 18 : 14} />
        )}
      </button>
    </div>
  );
}
