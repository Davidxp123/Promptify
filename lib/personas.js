// lib/personas.js
// Single source of truth for the 7 modes. `icon` is a lucide-react component
// name (mapped to the actual component in app/page.js) so this file stays
// framework-agnostic and importable from the API route too.

export const PERSONAS = [
  {
    id: "swe",
    label: "Senior Software Engineering",
    icon: "Code2",
    description:
      "Turns a feature idea into a structured build spec: role, task, requirements, tech stack, architecture, output format.",
    sections: ["Role", "Task", "Requirements", "Output Format"],
  },
  {
    id: "research",
    label: "Deep Research",
    icon: "Search",
    description:
      "Turns a question into a structured research brief: role, objective, research questions, sources, output format.",
    sections: ["Role", "Objective", "Research Questions", "Output Format"],
  },
  {
    id: "email",
    label: "Executive Email",
    icon: "Mail",
    description:
      "Turns rough notes into a structured brief for drafting a polished executive email.",
    sections: ["Role", "Objective", "Key Points", "Output Format"],
  },
  {
    id: "architecture",
    label: "System Architecture",
    icon: "Layers",
    description:
      "Turns a system idea into an architecture brief: role, task, constraints, components, output format.",
    sections: ["Role", "Task", "Constraints", "Output Format"],
  },
  {
    id: "code-review",
    label: "Code Review & Refactoring",
    icon: "GitPullRequest",
    description:
      "Turns a code concern into a structured review brief: role, task, focus areas, output format.",
    sections: ["Role", "Task", "Focus Areas", "Output Format"],
  },
  {
    id: "docs",
    label: "Documentation & Technical Writing",
    icon: "FileText",
    description:
      "Turns rough notes into a structured brief for writing clear technical documentation.",
    sections: ["Role", "Task", "Requirements", "Output Format"],
  },
  {
    id: "prd",
    label: "Product Requirements / PRD",
    icon: "Target",
    description:
      "Turns a product idea into a structured PRD brief: role, task, requirements, output format.",
    sections: ["Role", "Task", "Requirements", "Output Format"],
  },
];

export function getPersona(id) {
  return PERSONAS.find((p) => p.id === id) || PERSONAS[0];
}

// Builds the instruction sent to Gemini for a given persona + raw input.
// Every persona is asked to return the SAME JSON shape so the frontend can
// render it generically, but the section list/content differs per persona.
export function buildSystemPrompt(personaId) {
  const persona = getPersona(personaId);
  const sectionList = persona.sections.join(", ");

  return `You are a prompt-engineering assistant embedded in a tool called Promptify.
A user will give you raw, informal notes. Rewrite them into a structured,
detailed, role-specific meta-prompt for the "${persona.label}" persona.

Respond with ONLY valid JSON (no markdown fences, no preamble, no trailing
text) matching exactly this shape:

{
  "sections": [
    { "title": "Role", "type": "paragraph", "content": "..." },
    { "title": "Task", "type": "paragraph", "content": "..." },
    { "title": "SomeListSection", "type": "list", "content": ["item 1", "item 2"] }
  ]
}

Rules:
- "type" is either "paragraph" (content is a single string) or "list"
  (content is an array of short strings).
- Use these section titles, in this order, when they make sense for the
  request: ${sectionList}. You may omit a section if it truly doesn't apply,
  but do not invent unrelated ones.
- Every list item and paragraph should be specific to what the user actually
  wrote — never generic filler.
- Keep paragraphs to 2-4 sentences. Keep list items to one line each.
- Output JSON only. Do not wrap it in \`\`\`json or any other formatting.`;
}