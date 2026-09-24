"use client";

import { useState, useCallback, useEffect } from "react";
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
  Sun,
  Moon,
  CircleUserRound,
} from "lucide-react";
import { PERSONAS } from "@/lib/personas";

// Maps the icon name stored in lib/personas.js to an actual component.
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
  {
    label: "Build a React app",
    icon: Code2,
    mode: "swe",
    text: "Build a React app that lets users track daily habits with streaks and reminders.",
  },
  {
    label: "Write a professional email",
    icon: Mail,
    mode: "email",
    text: "Tell my team the launch is delayed two weeks because of a vendor issue.",
  },
  {
    label: "Research latest AI tools",
    icon: Search,
    mode: "research",
    text: "What are the best AI coding assistants right now and how do they compare?",
  },
  {
    label: "Design a system architecture",
    icon: Layers,
    mode: "architecture",
    text: "Design a scalable production architecture for a modern web application.",
  },
];

const STATS = [
  {
    icon: Zap,
    title: "100% Free",
    subtitle: "No hidden costs. No limits.",
  },
  {
    icon: ShieldCheck,
    title: "Powered by Groq",
    subtitle: "Fast, accurate, and intelligent.",
  },
  {
    icon: Rocket,
    title: "Multiple Personas",
    subtitle: "Tailored for your specific needs.",
  },
  {
    icon: Sparkles,
    title: "Instant Results",
    subtitle: "Get structured prompts in seconds.",
  },
];

export default function Home() {
  const [mode, setMode] = useState(PERSONAS[0].id);
  const [input, setInput] = useState("");
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Dark mode is the default because it matches the To-Be design.
  const [darkMode, setDarkMode] = useState(true);

  // Restore saved theme preference.
  useEffect(() => {
    const savedTheme = localStorage.getItem("promptify-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  // Apply theme to the page.
  useEffect(() => {
    document.documentElement.classList.toggle(
      "light-theme",
      !darkMode
    );

    localStorage.setItem(
      "promptify-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  const runImprovise = useCallback(async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/improvise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          input,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setSections(data.sections);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
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
          s.type === "list"
            ? s.content.map((i) => `- ${i}`).join("\n")
            : s.content;

        return `# ${s.title}\n${body}`;
      })
      .join("\n\n");

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const runExample = (example) => {
    setMode(example.mode);
    setInput(example.text);
    setSections(null);
    setError(null);
  };

  /*
   * Changing the persona clears the previous raw thought.
   * This gives every mode a fresh input box.
   */
  const handleModeChange = (newMode) => {
    if (newMode === mode) return;

    setMode(newMode);
    setInput("");
    setSections(null);
    setError(null);
    setCopied(false);
  };

  return (
    <main className="promptify-page">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-area">
            <div className="brand-logo">
              <span className="brand-logo-mark">P</span>
            </div>

            <div className="brand-copy">
              <h1>Promptify</h1>

              <span className="brand-divider" />

              <span className="brand-tagline">
                Better Prompts. Better Results.
              </span>
            </div>
          </div>

          <div className="header-actions">
            <div className="free-badge">
              <Zap size={14} fill="currentColor" />
              <span>100% Free</span>
            </div>

            <div className="powered-badge">
              <span className="gemini-mark">
                <span />
                <span />
                <span />
                <span />
              </span>

              <span>Powered by Groq</span>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              className="theme-button"
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              onClick={toggleTheme}
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <div className="page-content">
        {/* HERO */}
        <section className="hero-section">
          <h2>
            Transform Your Thoughts Into{" "}
            <span className="gradient-text">
              Powerful Prompts
            </span>
          </h2>

          <p>
            Select a persona, add your raw thoughts, and let
            Promptify craft the perfect AI prompt for you.
          </p>

          <div className="gradient-bar" />
        </section>

        {/* =======================================================
            MODE SELECTOR
        ======================================================== */}
        <section className="mode-selector">
          <div className="mode-selector-label">
            Choose a mode:
          </div>

          <div className="mode-list">
            {PERSONAS.map((persona) => {
              const Icon = ICONS[persona.icon];
              const active = persona.id === mode;

              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleModeChange(persona.id)}
                  data-active={active}
                  className="persona-button"
                >
                  <span className="persona-icon">
                    {Icon ? (
                      <Icon size={20} />
                    ) : (
                      <CircleUserRound size={20} />
                    )}
                  </span>

                  <span className="persona-label">
                    {persona.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =======================================================
            MAIN WORKSPACE
        ======================================================== */}
        <section className="workspace-grid">
          {/* =====================================================
              RAW THOUGHTS
          ====================================================== */}
          <div className="workspace-card">
            <div className="workspace-card-header">
              <div className="workspace-heading">
                <div className="heading-icon gradient-icon">
                  <Code2 size={19} />
                </div>

                <div>
                  <h3>Your Raw Thoughts</h3>

                  <p>
                    Just type your ideas, questions or rough notes.
                    We&apos;ll do the rest!
                  </p>
                </div>
              </div>
            </div>

            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={2000}
                placeholder="Describe what you want to build, ask, or write..."
                className="thoughts-input"
              />

              <div className="input-footer">
                <span className="input-tip">
                  <span className="tip-bulb">♧</span>

                  Tip: Press{" "}
                  <kbd>Ctrl</kbd>
                  <span>+</span>
                  <kbd>Enter</kbd>
                  <span>to improvise</span>
                </span>

                <span className="character-count">
                  {input.length}/2000
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={runImprovise}
              disabled={!input.trim() || loading}
              className="improvise-button"
            >
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  <span>Improvising...</span>
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  <span>Improvise Prompt</span>
                  <ArrowRight size={19} />
                </>
              )}
            </button>

            {/* QUICK EXAMPLES */}
            <div className="quick-examples">
              <div className="quick-title">
                <Zap size={14} />
                <span>Quick Examples</span>
              </div>

              <div className="quick-list">
                {QUICK_EXAMPLES.map((example) => {
                  const ExampleIcon = example.icon;

                  return (
                    <button
                      type="button"
                      key={example.label}
                      onClick={() => runExample(example)}
                      className="quick-example-button"
                    >
                      <ExampleIcon size={14} />
                      <span>{example.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =====================================================
              OPTIMIZED PROMPT
          ====================================================== */}
          <div className="workspace-card output-card">
            <div className="workspace-card-header output-header">
              <div className="workspace-heading">
                <div className="heading-icon sparkle-icon">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h3>Your Optimized Prompt</h3>

                  <p>
                    A structured, detailed, and role-specific prompt
                    ready for AI.
                  </p>
                </div>
              </div>

              <div className="output-actions">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!sections}
                  className="copy-button"
                >
                  <Copy size={15} />
                  <span>Copy</span>
                </button>

                {copied && (
                  <span className="copied-badge">
                    <Check size={14} />
                    Copied!
                  </span>
                )}
              </div>
            </div>

            <div className="output-container">
              {error && (
                <p className="output-error">
                  {error}
                </p>
              )}

              {!error && !sections && !loading && (
                <div className="empty-output">
                  <div className="empty-output-icon">
                    <Sparkles size={22} />
                  </div>

                  <p>
                    Your structured prompt will appear here once you
                    hit
                    <strong> Improvise Prompt</strong>.
                  </p>
                </div>
              )}

              {loading && (
                <div className="loading-output">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  <span>Crafting your prompt...</span>
                </div>
              )}

              {!error && sections && (
                <div className="generated-prompt">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className="output-section"
                    >
                      <p className="output-heading">
                        {section.title}
                      </p>

                      {section.type === "list" ? (
                        <ul className="output-list">
                          {section.content.map(
                            (item, itemIndex) => (
                              <li key={itemIndex}>
                                {item}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="output-paragraph">
                          {section.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            BENEFITS
        ======================================================== */}
        <section className="stats-section">
          {STATS.map((stat) => {
            const StatIcon = stat.icon;

            return (
              <div
                key={stat.title}
                className="stat-item"
              >
                <div className="stat-icon">
                  <StatIcon size={20} />
                </div>

                <div>
                  <p className="stat-title">
                    {stat.title}
                  </p>

                  <p className="stat-subtitle">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <span>Promptify</span>
          <span>•</span>
          <span>Build better with AI</span>
          <span>•</span>
          <span>100% Free</span>
        </footer>
      </div>
    </main>
  );
}