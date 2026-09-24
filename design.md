# Design Specification: Promptify Studio UI

This document serves as the comprehensive visual and structural blueprint for implementing the **Promptify Studio** user interface, based on the target design requirements.

---

## 1. Visual & Theme Overview

- **Aesthetic:** Dark Glassmorphic Cosmic SaaS Interface
- **Primary Background:** Static/Animated Custom Gradient Image (`public/background.png` or `public/bg.jpg`) layered behind semi-transparent glass cards with backdrop blurs.
- **Color Palette:**
  - **Hero/Canvas Base:** Dark Navy / Cosmic Black (`#070913` overlay)
  - **Panel Glass Background:** `rgba(11, 14, 29, 0.85)` with `backdrop-filter: blur(16px)`
  - **Panel Glass Border:** `rgba(255, 255, 255, 0.08)`
  - **Primary Action Gradient:** Linear horizontal gradient from Vibrant Purple (`#a855f7`) through Deep Indigo (`#6366f1`) to Electric Blue (`#3b82f6`)
  - **Text Colors:**
    - Primary Heading: Crisp White (`#ffffff`)
    - Gradient Heading Accent: Blue to Pink (`#60a5fa` → `#c084fc` → `#f472b6`)
    - Muted Body Text: Slate Gray (`#94a3b8`)
    - Output Syntax Headers: Soft Pink (`#f472b6`)

---

## 2. Layout Structure & Breakdown

The page is structured as a full-screen, single-page application divided into five key sections:

+-----------------------------------------------------------------------------------+
| 1. TOP HEADER (Brand Logo | Tagline | 100% Free Badge | Gemini/Groq Tag)          |
+-----------------------------------------------------------------------------------+
| 2. HERO BANNER (Main Title with Gradient Accent | Subtitle | Divider Accent Line)  |
+-----------------------------------------------------------------------------------+
| 3. MODE SELECTOR (Scrollable Persona Navigation Pills across the top)             |
+-----------------------------------------------------------------------------------+
| 4. DUAL WORKSPACE PANELS                                                          |
|    +------------------------------------+---------------------------------------+ |
|    | LEFT PANEL: Raw Input Input Box    | RIGHT PANEL: Output Studio            | |
|    | - Character Counter (183/2000)     | - Role/Task Syntax Highlighting       | |
|    | - Tip: Ctrl + Enter Shortcut       | - Copy to Clipboard Button            | |
|    | - Full-width Gradient Submit CTA   | - Copied! Status Confirmation Badge   | |
|    | - Quick Example Preset Buttons     | - Cosmic Star/Sparkle Accent Asset    | |
|    +------------------------------------+---------------------------------------+ |
+-----------------------------------------------------------------------------------+
| 5. FEATURE FOOTER (4 Benefit Badges | Copyright Line)                             |
+-----------------------------------------------------------------------------------+

## 3. Detailed Component Specifications

### 3.1. Top Navigation Bar
- **Left Group:**
  - Brand Logo Icon: Square container with rounded corners (`rounded-lg`), purple/indigo gradient, containing a bold `P` symbol.
  - Title: **Promptify** in `font-extrabold` white text.
  - Divider Line & Tagline: `Better Prompts. Better Results.` in muted slate text.
- **Right Group:**
  - Badge 1: `⚡ 100% Free` (emerald badge with semi-transparent green border).
  - Badge 2: `Powered by Google Gemini` / `Powered by Groq` with provider logo icon.
  - Theme Toggle Icon (Optional light/dark or decorative sun).

### 3.2. Hero Banner
- **Heading:** "Transform Your Thoughts Into **Powerful Prompts**"
  - Font Size: `text-3xl` (mobile) to `text-5xl` (desktop).
  - "Powerful Prompts" uses a CSS background gradient clipping (`bg-clip-text text-transparent`).
- **Sub-heading:** "Select a persona, add your raw thoughts, and let Promptify craft the perfect AI prompt for you."
- **Center Divider:** Centered horizontal bar (`w-16 h-1`) with rounded edges, using a blue-to-purple gradient.

### 3.3. Mode Selector Tabs Bar
- Outer Container: Glass panel (`bg-[#0b0e1d]/90 border border-white/10 rounded-2xl p-3`).
- Header Label: "Choose a mode:" in uppercase bold muted text.
- Horizontal Scroll Container with 7 specific pills:
  1. `💻 Senior Software Engineering` (Default Active)
  2. `🔍 Deep Research`
  3. `✉️ Executive Email`
  4. `🏗️ System Architecture`
  5. `⚡ Code Review & Refactoring`
  6. `📝 Documentation & Technical Writing`
  7. `📋 Product Requirements / PRD`
- **Active Tab Style:** Purple-to-indigo gradient background with a subtle drop shadow (`shadow-indigo-500/25`) and glowing border.
- **Inactive Tab Style:** Dark slate background with a border, turning white on hover.

### 3.4. Dual Workspace Panel Architecture

#### Left Panel (Raw Thoughts Input)
- **Header:** Icon (`</>`), Title ("Your Raw Thoughts"), Subtitle ("Just type your ideas, questions or rough notes. We'll do the rest!").
- **Textarea Container:**
  - Dark interior (`bg-[#060813] border border-white/10 rounded-xl`).
  - Monospace font for developer readability.
  - Bottom Status Bar: Displays `💡 Tip: Press Ctrl + Enter to improvise` on the left and a live character counter (`183/2000`) on the right.
- **Action Button:**
  - Full-width submit button with a full gradient spectrum (`purple-600` → `indigo-600` → `blue-500`).
  - Hover state: Brightness boost and enlarged shadow (`shadow-xl shadow-indigo-500/20`).
  - Text: `✦ Improvise Prompt →`.
- **Quick Examples Footer:**
  - Label: `⚡ Quick Examples`
  - 4 Preset Buttons: "Build a React app", "Write a professional email", "Research latest AI tools", "Design a system architecture".
  - Behavior: Clicking any preset fills the textarea instantly with a sample prompt.

#### Right Panel (Optimized Output Studio)
- **Header:** Sparkle Icon (`✦`), Title ("Your Optimized Prompt"), Subtitle ("A structured, detailed, and role-specific prompt ready for AI.").
- **Actions:**
  - "Copy" Button with clipboard SVG.
  - "Copied!" Badge: Success state pill with emerald styling (`bg-emerald-500/20 text-emerald-400`).
- **Output Container:**
  - Monospace dark box with custom subtle vertical scrollbar.
  - **Syntax Formatting Rules:**
    - `# Role`, `# Task`, `# Requirements`, `# Output Format` headings styled in vibrant pink/magenta text (`#f472b6`).
    - Standard prompt output rendered in clean readable slate text (`#cbd5e1`).
  - Decorative SVG background graphic at the bottom right corner (cosmic sparkle illustration).

### 3.5. Feature Highlights Footer
4-column card grid summarizing key benefits:
1. **100% Free** — No hidden costs. No limits.
2. **Powered by Gemini / Groq** — Fast, accurate, and intelligent.
3. **Multiple Personas** — Tailored for your specific needs.
4. **Instant Results** — Get structured prompts in seconds.

---

## 4. Background Image & CSS Configuration

Since you have downloaded the custom background image, follow these steps to wire it into Next.js:

1. Place your downloaded image file into the `public/` directory and name it **`bg-cosmic.jpg`** (or `bg-cosmic.png`).
2. Update `app/globals.css` to use this background image with a dark color fallback:

```css
@import "tailwindcss";

:root {
  --hero-base: #070913;
  --panel-bg: rgba(11, 14, 29, 0.85);
  --panel-border: rgba(255, 255, 255, 0.08);
}

body {
  background-color: var(--hero-base);
  /* Uses your downloaded background image from the public/ folder */
  background-image: radial-gradient(circle at 50% 0%, rgba(7, 9, 19, 0.4), #070913), url('/bg-cosmic.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow-x: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(7, 9, 19, 0.8);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.4);
}