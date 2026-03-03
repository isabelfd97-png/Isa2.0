import { useState, useEffect } from "react";

// ── DESIGN SYSTEM ─────────────────────────────────────────────────────────────
const T = {
  // Backgrounds
  bg: "#faf9f7",
  surface: "#f4f2ee",
  surfaceHover: "#eeebe5",
  white: "#ffffff",

  // Text
  ink: "#1a1916",
  inkMid: "#3d3b36",
  inkSoft: "#7a7670",
  inkFaint: "#b0ada6",

  // Borders
  line: "#e8e4dc",
  lineMid: "#d9d4cb",

  // Semantic — soft, warm
  sage:   { text: "#3d6b57", bg: "#eef4f0", border: "#c4ddd2" },
  amber:  { text: "#8a5e1e", bg: "#fdf5e6", border: "#e8d09a" },
  rose:   { text: "#8b3a3a", bg: "#fdf0f0", border: "#e8b8b8" },
  slate:  { text: "#3a4f6b", bg: "#eef2f8", border: "#b8cce4" },
  stone:  { text: "#6b6560", bg: "#f4f2ee", border: "#d4cfc7" },
};

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY = "'DM Sans', 'Segoe UI', sans-serif";

const TODAY = new Date().toLocaleDateString("es-ES", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

async function callClaude(system, user, maxTokens = 1500) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "";
}

function parseJSON(text) {
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { return null; }
}

// ── PRIMITIVES ────────────────────────────────────────────────────────────────

function Badge({ text, color = "slate", size = "sm" }) {
  const c = T[color] || T.slate;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 4, padding: size === "sm" ? "2px 8px" : "4px 12px",
      fontSize: size === "sm" ? 11 : 12, fontWeight: 500,
      fontFamily: FONT_BODY, flexShrink: 0, whiteSpace: "nowrap",
      letterSpacing: "0.01em"
    }}>{text}</span>
  );
}

function ScoreBar({ label, score }) {
  const col = score >= 75 ? T.sage : score >= 50 ? T.amber : T.rose;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <span style={{ fontSize: 13, color: T.inkMid, fontFamily: FONT_BODY }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: col.text, fontFamily: FONT_BODY }}>{score}</span>
      </div>
      <div style={{ height: 3, background: T.line, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: col.text, borderRadius: 99, opacity: 0.7 }} />
      </div>
    </div>
  );
}

function Accordion({ title, badge, badgeColor, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${T.line}` }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 0", gap: 12, fontFamily: FONT_BODY
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: T.ink, textAlign: "left" }}>{title}</span>
          {badge && <Badge text={badge} color={badgeColor} />}
        </div>
        <span style={{
          fontSize: 11, color: T.inkFaint,
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.25s", flexShrink: 0
        }}>▾</span>
      </button>
      {open && <div style={{ paddingBottom: 22 }}>{children}</div>}
    </div>
  );
}

function Rewrite({ before, after, labelBefore = "Actual", labelAfter = "Propuesta" }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        background: T.rose.bg, border: `1px solid ${T.rose.border}`,
        borderRadius: 6, padding: "13px 16px", fontSize: 13,
        color: T.rose.text, marginBottom: 8, lineHeight: 1.75, fontFamily: FONT_BODY
      }}>
        <span style={{ fontWeight: 600, display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, opacity: 0.7 }}>{labelBefore}</span>
        {before}
      </div>
      <div style={{
        background: T.sage.bg, border: `1px solid ${T.sage.border}`,
        borderRadius: 6, padding: "13px 16px", fontSize: 13,
        color: T.sage.text, lineHeight: 1.75, fontFamily: FONT_BODY
      }}>
        <span style={{ fontWeight: 600, display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, opacity: 0.7 }}>{labelAfter}</span>
        {after}
      </div>
    </div>
  );
}

function Note({ children }) {
  return (
    <p style={{
      fontSize: 13, color: T.inkSoft, lineHeight: 1.8,
      marginTop: 12, marginBottom: 0, fontFamily: FONT_BODY
    }}>{children}</p>
  );
}

function Bullets({ items, color }) {
  return (
    <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
      {items.map((it, i) => (
        <li key={i} style={{ fontSize: 13, color: color || T.inkMid, lineHeight: 1.9, fontFamily: FONT_BODY }}>{it}</li>
      ))}
    </ul>
  );
}

function SubNav({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.line}`, marginBottom: 32, overflowX: "auto" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "10px 18px", fontSize: 12, fontWeight: active === t.id ? 600 : 400,
          color: active === t.id ? T.ink : T.inkFaint,
          borderBottom: active === t.id ? `2px solid ${T.ink}` : "2px solid transparent",
          whiteSpace: "nowrap", fontFamily: FONT_BODY,
          letterSpacing: active === t.id ? "0.01em" : "0",
          transition: "all 0.15s"
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function Btn({ onClick, disabled, children, variant = "primary", small = false }) {
  const variants = {
    primary: { background: disabled ? T.line : T.ink, color: disabled ? T.inkFaint : T.white, border: "none" },
    ghost:   { background: "transparent", color: T.inkMid, border: `1px solid ${T.lineMid}` },
    sage:    { background: T.sage.bg, color: T.sage.text, border: `1px solid ${T.sage.border}` },
  };
  const s = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...s, borderRadius: 6, padding: small ? "7px 14px" : "10px 20px",
      fontSize: small ? 12 : 13, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: FONT_BODY, transition: "all 0.15s", letterSpacing: "0.01em"
    }}>{children}</button>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} style={{
        width: "100%", border: `1px solid ${T.lineMid}`, borderRadius: 8,
        padding: "13px 16px", fontSize: 13, color: T.inkMid,
        fontFamily: FONT_BODY, lineHeight: 1.75, resize: "vertical",
        background: T.white, boxSizing: "border-box", outline: "none",
        transition: "border 0.15s"
      }}
      onFocus={e => e.target.style.borderColor = T.inkSoft}
      onBlur={e => e.target.style.borderColor = T.lineMid}
    />
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h1 style={{
        fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700,
        color: T.ink, margin: "0 0 10px", lineHeight: 1.2, letterSpacing: "-0.02em"
      }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15, color: T.inkSoft, lineHeight: 1.7, margin: 0, fontFamily: FONT_BODY }}>{subtitle}</p>}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.line, margin: "32px 0" }} />;
}

// ── HOME ──────────────────────────────────────────────────────────────────────

const WEEKLY_TASK = {
  title: "Reescribir los case studies del portfolio",
  priority: "Prioridad alta",
  why: "Es el gap más urgente. Sin narrativa de proceso, el portfolio no convierte aunque la estética sea buena.",
};

const TODAY_LEARN = [
  { text: "Maggie Appleton — LLM Interface Patterns", time: "30 min", url: "https://maggieappleton.com" },
  { text: "AI Agent UX Patterns — Nielsen Norman Group", time: "20 min", url: "https://www.nngroup.com" },
  { text: "Apple Vision Pro HIG · Spatial Interactions", time: "15 min", url: "https://developer.apple.com/design/human-interface-guidelines/" },
];

function HomeSection({ goTo }) {
  const [msg, setMsg] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(true);
  const [taskInput, setTaskInput] = useState("");
  const [taskFeedback, setTaskFeedback] = useState(null);
  const [loadingTask, setLoadingTask] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const text = await callClaude(
          `Eres un career coach cálido y real, nada corporativo. Genera un mensaje motivacional muy corto (máximo 2 frases) en español para Isabel Ferrer-Dalmau. Es Senior Product Designer en Aily Labs buscando nuevo trabajo. Hoy es ${TODAY}. Sé cercana e inspira sin ser cursi. Responde solo con el mensaje, sin comillas ni saludos.`,
          "Mensaje de hoy", 120
        );
        setMsg(text.trim().replace(/^[\"']|[\"']$/g, ""));
      } catch {
        setMsg("Un paso pequeño hecho bien vale más que diez a medias. Hoy elige uno.");
      } finally { setLoadingMsg(false); }
    })();
  }, []);

  const analyzeTask = async () => {
    if (!taskInput.trim()) return;
    setLoadingTask(true);
    try {
      const text = await callClaude(
        `Eres career advisor para Isabel Ferrer-Dalmau, Senior Product Designer. Analiza el avance en su tarea y da feedback honesto y constructivo. Devuelve SOLO JSON sin markdown: {"score":1-10,"verdict":"Bien encaminada"|"Buen inicio"|"Necesita más foco"|"Hay que ajustar","verdictColor":"sage"|"amber"|"rose","strengths":["..."],"improvements":["..."],"nextStep":"acción concreta siguiente en 1 frase"}`,
        `Tarea: "${WEEKLY_TASK.title}"\n\nAvance de Isabel:\n${taskInput}`
      );
      setTaskFeedback(parseJSON(text));
    } catch {} finally { setLoadingTask(false); }
  };

  const scores = [{ label: "LinkedIn", score: 53 }, { label: "CV", score: 56 }, { label: "Portfolio", score: 51 }];

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 52 }}>
        <p style={{ fontSize: 12, color: T.inkFaint, textTransform: "capitalize", letterSpacing: "0.04em", marginBottom: 16, fontFamily: FONT_BODY }}>{TODAY}</p>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: T.ink, margin: "0 0 20px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          Hola, Isabel.
        </h1>
        <div style={{ minHeight: 48, maxWidth: 480 }}>
          {loadingMsg
            ? <p style={{ fontSize: 15, color: T.inkFaint, fontStyle: "italic", fontFamily: FONT_BODY, margin: 0 }}>Cargando mensaje del día...</p>
            : <p style={{ fontSize: 16, color: T.inkSoft, lineHeight: 1.85, fontStyle: "italic", fontFamily: FONT_DISPLAY, margin: 0 }}>
                "{msg}"
              </p>
          }
        </div>
      </div>

      {/* Status */}
      <div style={{ marginBottom: 44 }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing]