"use client";

import { useState, useCallback } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Rocket,
  Code2,
  Search,
  Mail,
  Layers,
  GitPullRequest,
  FileText,
  Target,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { PERSONAS } from "@/lib/personas";

// Maps the icon name stored in lib/personas.js to an actual component,
// so lib/personas.js can stay framework-agnostic.
const ICONS = {
  Code2,
  Search,
  Mail,
  Layers,
  GitPullRequest,
  FileText,
  Target,
};

const QUICK_EXAMPLES = [
  { label: "Build a React app", icon: Code2, mode: "swe", text: "Build a React app that lets users track daily habits with streaks and reminders." },
  { label: "Write a professional email", icon: Mail, mode: "email", text: "Tell my team the launch is delayed two weeks because of a vendor issue." },
  { label: "Research latest AI tools", icon: Search, mode: "research", text: "What are the best AI coding assistants right now and how do they compare?" },
  { label: "Design a system architecture", icon: Layers, mode: "architecture", text: "Design the architecture for a real-time chat app that needs to scale to 1M users." },
];

const STATS = [
  { icon: Zap, title: "100% Free", subtitle: "No hidden costs. No limits." },
  { icon: ShieldCheck, title: "Powered by Gemini", subtitle: "Fast, accurate, and intelligent." },
  { icon: Rocket, title: "Multiple Personas", subtitle: "Tailored for your specific needs." },
  { icon: Sparkles, title: "Instant Results", subtitle: "Get structured prompts in seconds." },
];

export default function Home() {
  const [mode, setMode] = useState(PERSONAS[0].id);
  const [input, setInput] = useState("");
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const runImprovise = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/improvise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSections(data.sections);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, mode, loading]);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runImprovise();
    }
  };

  const handleCopy = async () => {
    if (!sections) return;
    const text = sections
      .map((s) => {
        const body =
          s.type === "list" ? s.content.map((i) => `- ${i}`).join("\n") : s.content;
        return `# ${s.title}\n${body}`;
      })
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const runExample = (example) => {
    setMode(example.mode);
    setInput(example.text);
  };

  return (
    <main className="min-h-screen px-6 py-8 md:px-10 md:py-10 max-w-[1400px] mx-auto">
      {/* Top bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg btn-gradient flex items-center justify-center font-bold text-sm">
            P
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold">Promptify</h1>
            <span className="text-sm text-[var(--text-muted)] hidden sm:inline">
              Better Prompts. Better Results.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[var(--card-border)] text-[var(--accent-green)]">
            <Zap size={13} /> 100% Free
          </span>
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[var(--card-border)] text-[var(--text-secondary)]">
            <Sparkles size={13} /> Powered by Google Gemini
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Transform Your Thoughts Into <span className="gradient-text">Powerful Prompts</span>
        </h2>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm md:text-base">
          Select a persona, add your raw thoughts, and let Promptify craft the perfect AI prompt for you.
        </p>
      </div>

      {/* Mode selector */}
      <div className="mb-6">
        <p className="text-sm text-[var(--text-secondary)] mb-3">Choose a mode:</p>
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((p) => {
            const Icon = ICONS[p.icon];
            const active = p.id === mode;
            return (
              <button
                key={p.id}
                onClick={() => { setMode(p.id); setInput(""); }}
                data-active={active}
                className="mode-pill flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              >
                <Icon size={16} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual panel */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Left: input */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg btn-gradient flex items-center justify-center">
              <Code2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Your Raw Thoughts</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Just type your ideas, questions or rough notes. We&apos;ll do the rest!
              </p>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={2000}
            placeholder="Describe what you want to build, ask, or write..."
            className="w-full flex-1 min-h-[220px] bg-transparent border border-[var(--card-border)] rounded-xl p-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--card-border-hover)]"
          />

          <div className="flex items-center justify-between mt-2 mb-4">
            <span className="text-xs text-[var(--text-muted)]">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-[var(--card-border)]">Ctrl</kbd> +{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-[var(--card-border)]">Enter</kbd> to improvise
            </span>
            <span className="text-xs text-[var(--text-muted)]">{input.length}/2000</span>
          </div>

          <button
            onClick={runImprovise}
            disabled={!input.trim() || loading}
            className="btn-gradient w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Improvising...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Improvise Prompt <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="mt-5">
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mb-2.5">
              <Zap size={12} /> Quick Examples
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => runExample(ex)}
                  className="mode-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                >
                  <ex.icon size={13} /> {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: output */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg btn-gradient flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Your Optimized Prompt</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  A structured, detailed, role-specific prompt ready for AI.
                </p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              disabled={!sections}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--card-border)] disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-[var(--accent-green)]" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy
                </>
              )}
            </button>
          </div>

          <div className="flex-1 min-h-[300px] max-h-[520px] overflow-y-auto custom-scroll border border-[var(--card-border)] rounded-xl p-4">
            {error && <p className="text-sm text-red-400">{error}</p>}

            {!error && !sections && !loading && (
              <p className="text-sm text-[var(--text-muted)]">
                Your structured prompt will appear here once you hit Improvise Prompt.
              </p>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Loader2 size={16} className="animate-spin" /> Crafting your prompt...
              </div>
            )}

            {!error && sections && (
              <div>
                {sections.map((s, i) => (
                  <div key={i} className="output-section">
                    <p className="output-heading">{s.title}</p>
                    {s.type === "list" ? (
                      <ul className="output-list">
                        {s.content.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="output-paragraph">{s.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {STATS.map((s) => (
          <div key={s.title} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--card-border)] flex items-center justify-center shrink-0">
              <s.icon size={16} className="text-[var(--accent-blue)]" />
            </div>
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{s.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center text-xs text-[var(--text-muted)] mt-10 pb-4">
        Promptify &middot; Build better with AI &middot; 100% Free
      </footer>
    </main>
  );
}