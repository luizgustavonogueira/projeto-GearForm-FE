import { useState } from "react";
import Navbar from "../components/Navbar";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Step {
  id: number;
  title: string;
  duration: string;
  type: "video" | "projeto" | "quiz" | "live";
  done?: boolean;
}

interface Trail {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  accentColor: string;
  borderColor: string;
  glowColor: string;
  icon: string;
  totalHours: string;
  modules: number;
  students: string;
  steps: Step[];
}

// ─── Data ────────────────────────────────────────────────────────────────────
const trails: Trail[] = [
  {
    id: 1,
    tag: "01 / TRILHA",
    title: "FULL STACK",
    subtitle: "Dev",
    level: "Iniciante",
    accentColor: "#00ffcc",
    borderColor: "rgba(0,255,204,0.3)",
    glowColor: "rgba(0,255,204,0.12)",
    icon: "⚡",
    totalHours: "120h",
    modules: 8,
    students: "12.4k",
    steps: [
      { id: 1, title: "Fundamentos de HTML & CSS", duration: "8h", type: "video", done: true },
      { id: 2, title: "JavaScript Essencial", duration: "14h", type: "video", done: true },
      { id: 3, title: "React do Zero", duration: "18h", type: "video" },
      { id: 4, title: "Projeto: Clone do Spotify", duration: "6h", type: "projeto" },
      { id: 5, title: "Node.js & APIs REST", duration: "16h", type: "video" },
      { id: 6, title: "Banco de Dados SQL", duration: "12h", type: "video" },
      { id: 7, title: "Deploy & DevOps básico", duration: "8h", type: "live" },
      { id: 8, title: "Quiz Final — Full Stack", duration: "1h", type: "quiz" },
    ],
  },
  {
    id: 2,
    tag: "02 / TRILHA",
    title: "DESIGN",
    subtitle: "UX/UI",
    level: "Intermediário",
    accentColor: "#ff3d6e",
    borderColor: "rgba(255,61,110,0.3)",
    glowColor: "rgba(255,61,110,0.1)",
    icon: "🎯",
    totalHours: "80h",
    modules: 6,
    students: "8.9k",
    steps: [
      { id: 1, title: "Princípios de Design Visual", duration: "6h", type: "video", done: true },
      { id: 2, title: "Figma Completo", duration: "10h", type: "video" },
      { id: 3, title: "Pesquisa com Usuários (UX)", duration: "8h", type: "video" },
      { id: 4, title: "Prototipagem Avançada", duration: "12h", type: "projeto" },
      { id: 5, title: "Design Systems", duration: "10h", type: "video" },
      { id: 6, title: "Apresentação de portfólio — Live", duration: "2h", type: "live" },
    ],
  },
  {
    id: 3,
    tag: "03 / TRILHA",
    title: "DATA",
    subtitle: "Science & AI",
    level: "Avançado",
    accentColor: "#7b5ef8",
    borderColor: "rgba(123,94,248,0.3)",
    glowColor: "rgba(123,94,248,0.12)",
    icon: "🏆",
    totalHours: "160h",
    modules: 10,
    students: "5.2k",
    steps: [
      { id: 1, title: "Python para Dados", duration: "12h", type: "video", done: true },
      { id: 2, title: "Pandas & NumPy", duration: "10h", type: "video", done: true },
      { id: 3, title: "Machine Learning com Sklearn", duration: "20h", type: "video" },
      { id: 4, title: "Projeto: Modelo preditivo real", duration: "8h", type: "projeto" },
      { id: 5, title: "Deep Learning & Redes Neurais", duration: "24h", type: "video" },
      { id: 6, title: "NLP & LLMs", duration: "18h", type: "video" },
      { id: 7, title: "MLOps & Deploy de Modelos", duration: "14h", type: "live" },
      { id: 8, title: "Quiz Final — Data Science", duration: "1h", type: "quiz" },
    ],
  },
];

// ─── Badge helpers ────────────────────────────────────────────────────────────
const typeLabels: Record<Step["type"], string> = {
  video: "VÍDEO",
  projeto: "PROJETO",
  quiz: "QUIZ",
  live: "AO VIVO",
};

const typeColors: Record<Step["type"], string> = {
  video: "#00ffcc",
  projeto: "#ff3d6e",
  quiz: "#7b5ef8",
  live: "#f5a623",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TrilhasPage() {
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number>(trails[0].id);

  const activeTrail = trails.find((t) => t.id === expanded)!;

  return (
    <div style={s.page}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #080a0f; }

        @keyframes gridMove {
          0%   { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes scanline {
          0%   { top: -4px; }
          100% { top: 100%; }
        }

        .trail-card {
          cursor: pointer;
          transition: border-color 0.3s, background 0.3s;
        }
        .trail-card:hover { filter: brightness(1.06); }

        .step-row {
          transition: background 0.25s, border-color 0.25s;
        }
        .step-row:hover {
          background: rgba(255,255,255,0.03) !important;
        }

        .nav-link {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          color: #5a6070;
          text-decoration: none;
          letter-spacing: 1px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #00ffcc; }

        .btn-primary:hover {
          box-shadow: 0 0 28px rgba(0,255,204,0.45);
          background: #00e6b8 !important;
        }

        .pill-btn {
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .pill-btn:hover {
          background: rgba(0,255,204,0.1) !important;
          border-color: rgba(0,255,204,0.4) !important;
          color: #00ffcc !important;
        }
      `}</style>

      {/* ── Grid background ── */}
      <div style={s.gridBg} />

      {/* ── Glow blobs ── */}
      <div style={{ ...s.blob, width: 700, height: 700, background: "radial-gradient(circle, rgba(123,94,248,0.12) 0%, transparent 70%)", top: -200, right: -200 }} />
      <div style={{ ...s.blob, width: 500, height: 500, background: "radial-gradient(circle, rgba(0,255,204,0.07) 0%, transparent 70%)", bottom: 100, left: -150 }} />

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroTag}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffcc", animation: "blink 1.5s ease-in-out infinite", display: "inline-block" }} />
          ★ COMO FUNCIONAM AS TRILHAS DE APRENDIZADO
        </div>

        <h1 style={s.heroTitle}>
          <span style={{ display: "block", color: "#e8eaf0" }}>SEU</span>
          <span style={{ display: "block", background: "linear-gradient(135deg,#00ffcc,#7b5ef8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CAMINHO</span>
          <span style={{ display: "block", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>Do zero ao expert</span>
        </h1>

        <p style={s.heroSub}>
          As trilhas organizam cursos em sequência lógica — do básico ao avançado. Siga o caminho, construa projetos reais e conquiste o certificado de especialista.
        </p>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <button className="btn-primary" style={s.btnPrimary}>EXPLORAR TRILHAS</button>
          <button style={s.btnGhost}>
            <span style={{ fontSize: 11 }}>▶</span> Como funciona
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={s.howSection}>
        <div style={s.sectionLabel}>// COMO FUNCIONA</div>
        <h2 style={s.sectionTitle}>
          <span style={{ color: "#e8eaf0" }}>4 ETAPAS</span>{" "}
          <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>SIMPLES</span>
        </h2>

        <div style={s.stepsGrid}>
          {[
            { num: "01", icon: "🗺️", title: "Escolha sua trilha", text: "Selecione entre as trilhas disponíveis de acordo com seu objetivo de carreira e nível atual." },
            { num: "02", icon: "📹", title: "Assista os módulos", text: "Conteúdo em vídeo gravado, acesse quando quiser. Cada módulo tem exercícios práticos." },
            { num: "03", icon: "🛠️", title: "Construa projetos reais", text: "Ao fim de cada fase, um projeto real é entregue para compor seu portfólio profissional." },
            { num: "04", icon: "🏅", title: "Ganhe o certificado", text: "Aprovado no quiz final? Seu certificado é emitido e reconhecido por +200 empresas parceiras." },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                ...s.howCard,
                animationDelay: `${i * 0.1}s`,
                animation: "fadeSlideUp 0.7s ease both",
              }}
            >
              <div style={s.howNum}>{item.num}</div>
              <div style={s.howIcon}>{item.icon}</div>
              <div style={s.howCardTitle}>{item.title}</div>
              <div style={s.howCardText}>{item.text}</div>
              {i < 3 && (
                <div style={s.connector}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TRAILS EXPLORER ── */}
      <section style={s.explorerSection}>
        <div style={s.sectionLabel}>// TRILHAS DISPONÍVEIS</div>
        <h2 style={{ ...s.sectionTitle, marginBottom: 48 }}>
          <span style={{ color: "#e8eaf0" }}>ESCOLHA</span>{" "}
          <span style={{ background: "linear-gradient(135deg,#00ffcc,#7b5ef8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SUA TRILHA</span>
        </h2>

        {/* Selectors */}
        <div style={s.trailSelectors}>
          {trails.map((t) => (
            <div
              key={t.id}
              className="trail-card"
              onClick={() => setExpanded(t.id)}
              style={{
                ...s.trailSelector,
                borderColor: expanded === t.id ? t.accentColor : "rgba(255,255,255,0.06)",
                background: expanded === t.id ? t.glowColor : "rgba(13,17,23,0.8)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: t.accentColor, letterSpacing: 2 }}>{t.title}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#5a6070", letterSpacing: 1, marginTop: 2 }}>{t.subtitle}</div>
              <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ ...s.badge, background: `${t.accentColor}18`, color: t.accentColor, borderColor: `${t.accentColor}40` }}>
                  {t.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trail detail */}
        <div style={s.trailDetail}>
          {/* Header */}
          <div style={s.trailHeader}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6070", letterSpacing: 2, marginBottom: 6 }}>{activeTrail.tag}</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: activeTrail.accentColor, letterSpacing: 3, lineHeight: 1 }}>
                {activeTrail.title} <span style={{ color: "#e8eaf0" }}>{activeTrail.subtitle}</span>
              </h3>
            </div>
            <div style={s.trailMeta}>
              {[
                { label: "Horas", value: activeTrail.totalHours },
                { label: "Módulos", value: activeTrail.modules },
                { label: "Alunos", value: activeTrail.students },
              ].map((m) => (
                <div key={m.label} style={s.metaItem}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: activeTrail.accentColor }}>{m.value}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#5a6070", letterSpacing: 1 }}>{m.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div style={s.progressBar}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#5a6070", letterSpacing: 1 }}>PROGRESSO DA TRILHA</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: activeTrail.accentColor }}>
                {activeTrail.steps.filter((s) => s.done).length}/{activeTrail.steps.length} MÓDULOS
              </span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(activeTrail.steps.filter((s) => s.done).length / activeTrail.steps.length) * 100}%`,
                background: `linear-gradient(90deg, ${activeTrail.accentColor}, ${activeTrail.accentColor}99)`,
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>

          {/* Steps */}
          <div style={s.stepsList}>
            {activeTrail.steps.map((step, idx) => {
              const isExpanded = active === step.id;
              return (
                <div key={step.id}>
                  <div
                    className="step-row"
                    onClick={() => setActive(isExpanded ? null : step.id)}
                    style={{
                      ...s.stepRow,
                      borderColor: step.done ? `${activeTrail.accentColor}30` : "rgba(255,255,255,0.04)",
                      background: isExpanded ? activeTrail.glowColor : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {/* Index / check */}
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      border: `1px solid ${step.done ? activeTrail.accentColor : "rgba(255,255,255,0.1)"}`,
                      background: step.done ? activeTrail.accentColor : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Space Mono', monospace", fontSize: 11,
                      color: step.done ? "#080a0f" : "#5a6070",
                      flexShrink: 0,
                    }}>
                      {step.done ? "✓" : `${idx + 1 < 10 ? "0" : ""}${idx + 1}`}
                    </div>

                    {/* connector line */}
                    <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.06)", alignSelf: "stretch", display: idx === activeTrail.steps.length - 1 ? "none" : "block" }} />

                    {/* Title */}
                    <div style={{ flex: 1, fontFamily: "'Outfit', sans-serif", fontSize: 15, color: step.done ? "#e8eaf0" : "#8a909e", fontWeight: step.done ? 600 : 400 }}>
                      {step.title}
                    </div>

                    {/* Type badge */}
                    <span style={{
                      fontFamily: "'Space Mono', monospace", fontSize: 10,
                      padding: "3px 10px", letterSpacing: 1,
                      color: typeColors[step.type],
                      background: `${typeColors[step.type]}15`,
                      border: `1px solid ${typeColors[step.type]}40`,
                    }}>
                      {typeLabels[step.type]}
                    </span>

                    {/* Duration */}
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6070", minWidth: 32, textAlign: "right" }}>
                      {step.duration}
                    </div>

                    {/* Chevron */}
                    <div style={{ color: "#5a6070", fontSize: 12, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>▼</div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{
                      ...s.stepExpanded,
                      borderColor: `${activeTrail.accentColor}20`,
                      background: `${activeTrail.accentColor}06`,
                    }}>
                      <p style={{ color: "#5a6070", fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>
                        {step.type === "video" && `Aula gravada de ${step.duration} com exercícios práticos ao final. Acesse quando quiser, quantas vezes precisar.`}
                        {step.type === "projeto" && `Projeto hands-on de ${step.duration}. Você vai construir algo real para o seu portfólio e receber feedback de um mentor.`}
                        {step.type === "quiz" && `Avaliação final com questões de múltipla escolha e desafios práticos. Precisa de 70% para avançar.`}
                        {step.type === "live" && `Sessão ao vivo com instrutor especialista. Tire dúvidas em tempo real e faça networking com outros alunos.`}
                      </p>
                      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        <button className="btn-primary" style={{
                          ...s.btnPrimary,
                          padding: "10px 24px", fontSize: 12,
                          background: activeTrail.accentColor,
                        }}>
                          {step.done ? "REVER AULA" : "COMEÇAR"}
                        </button>
                        {step.type === "projeto" && (
                          <button style={{ ...s.btnGhost, padding: "10px 20px", fontSize: 12 }}>VER ENTREGA</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA button */}
          <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" style={s.btnPrimary}>
              INICIAR TRILHA →
            </button>
          </div>
        </div>
      </section>

      {/* ── LEGEND ── */}
      <section style={s.legendSection}>
        <div style={s.sectionLabel}>// TIPOS DE ATIVIDADE</div>
        <div style={s.legendGrid}>
          {(Object.entries(typeLabels) as [Step["type"], string][]).map(([type, label]) => (
            <div key={type} style={s.legendItem}>
              <div style={{ ...s.legendDot, background: typeColors[type], boxShadow: `0 0 12px ${typeColors[type]}60` }} />
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: typeColors[type], letterSpacing: 2 }}>{label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#5a6070", marginTop: 4, fontWeight: 300 }}>
                  {type === "video" && "Conteúdo gravado, acesso ilimitado"}
                  {type === "projeto" && "Entrega prática com feedback"}
                  {type === "quiz" && "Avaliação para certificação"}
                  {type === "live" && "Sessão ao vivo com mentor"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSection}>
        <div style={s.ctaGlow} />
        <h2 style={s.ctaTitle}>
          <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.18)", display: "block" }}>COMECE</span>
          <span style={{ background: "linear-gradient(135deg,#00ffcc,#7b5ef8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>HOJE</span>
        </h2>
        <p style={{ fontFamily: "'Outfit', sans-serif", color: "#5a6070", fontSize: 16, maxWidth: 460, margin: "0 auto 40px", fontWeight: 300, textAlign: "center", lineHeight: 1.7 }}>
          Junte-se a 47 mil profissionais que já transformaram suas carreiras com a GEARFORM.
        </p>
        <div style={{ display: "flex", maxWidth: 480, margin: "0 auto" }}>
          <input type="email" placeholder="seu@email.com" style={s.emailInput} />
          <button className="btn-primary" style={{ ...s.btnPrimary, clipPath: "none", padding: "18px 28px" }}>COMEÇAR →</button>
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6070", letterSpacing: 1, marginTop: 14, textAlign: "center" }}>
          7 dias grátis · Sem cartão · Cancele quando quiser
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4, color: "#5a6070" }}>GEARFORM</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#5a6070", letterSpacing: 1 }}>
          © 2026 GEARFORM · Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: {
    background: "#080a0f",
    color: "#e8eaf0",
    minHeight: "100vh",
    fontFamily: "'Outfit', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  gridBg: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,255,204,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.025) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    animation: "gridMove 20s linear infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob: {
    position: "fixed",
    borderRadius: "50%",
    animation: "pulse 7s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 60px",
    height: 70,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(20px)",
    background: "rgba(8,10,15,0.85)",
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 22,
    letterSpacing: 4,
    color: "#e8eaf0",
  },
  navLinks: {
    display: "flex",
    gap: 36,
    listStyle: "none",
  },
  navBtn: {
    background: "#00ffcc",
    color: "#080a0f",
    border: "none",
    padding: "10px 28px",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 2,
    cursor: "pointer",
    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
    transition: "all 0.3s",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "100px 60px 80px",
    position: "relative",
    zIndex: 1,
    animation: "fadeSlideUp 0.9s ease both",
  },
  heroTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(0,255,204,0.06)",
    border: "1px solid rgba(0,255,204,0.2)",
    padding: "8px 18px",
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#00ffcc",
    letterSpacing: 2,
    marginBottom: 32,
    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
  },
  heroTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(72px,9vw,130px)",
    lineHeight: 0.92,
    letterSpacing: 2,
    marginBottom: 28,
  },
  heroSub: {
    fontSize: 17,
    color: "#5a6070",
    lineHeight: 1.8,
    maxWidth: 520,
    marginBottom: 44,
    fontWeight: 300,
  },
  btnPrimary: {
    background: "#00ffcc",
    color: "#080a0f",
    border: "none",
    padding: "15px 40px",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 2,
    cursor: "pointer",
    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
    transition: "all 0.3s",
  },
  btnGhost: {
    background: "transparent",
    color: "#e8eaf0",
    border: "1px solid rgba(255,255,255,0.12)",
    padding: "15px 32px",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    letterSpacing: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.3s",
  },
  howSection: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "80px 60px",
    position: "relative",
    zIndex: 1,
  },
  sectionLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    color: "#00ffcc",
    letterSpacing: 3,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(42px,5vw,72px)",
    letterSpacing: 2,
    marginBottom: 52,
    lineHeight: 1,
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 1,
    position: "relative",
  },
  howCard: {
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "36px 28px",
    position: "relative",
    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
    transition: "all 0.3s",
  },
  howNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 64,
    color: "rgba(255,255,255,0.04)",
    lineHeight: 1,
    position: "absolute",
    top: 16,
    right: 20,
  },
  howIcon: {
    fontSize: 28,
    marginBottom: 18,
  },
  howCardTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 10,
    color: "#e8eaf0",
  },
  howCardText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    color: "#5a6070",
    lineHeight: 1.6,
    fontWeight: 300,
  },
  connector: {
    position: "absolute",
    right: -18,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#00ffcc",
    fontSize: 18,
    zIndex: 2,
    opacity: 0.4,
  },
  explorerSection: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 60px 80px",
    position: "relative",
    zIndex: 1,
  },
  trailSelectors: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 32,
  },
  trailSelector: {
    padding: "28px 20px",
    border: "1px solid",
    textAlign: "center",
    backdropFilter: "blur(12px)",
    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
    transition: "all 0.3s",
  },
  badge: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    letterSpacing: 1,
    padding: "3px 10px",
    border: "1px solid",
  },
  trailDetail: {
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "40px",
    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
  },
  trailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 20,
  },
  trailMeta: {
    display: "flex",
    gap: 32,
  },
  metaItem: {
    textAlign: "center",
  },
  progressBar: {
    marginBottom: 32,
  },
  stepsList: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  stepRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    border: "1px solid",
    transition: "all 0.25s",
  },
  stepExpanded: {
    padding: "20px 24px 24px",
    border: "1px solid",
    borderTop: "none",
    animation: "fadeSlideUp 0.25s ease both",
    marginBottom: 2,
  },
  legendSection: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "20px 60px 80px",
    position: "relative",
    zIndex: 1,
  },
  legendGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginTop: 24,
  },
  legendItem: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    padding: "20px",
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,0.05)",
    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: 4,
  },
  ctaSection: {
    padding: "120px 60px",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  ctaGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: 700,
    height: 700,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(123,94,248,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ctaTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(60px,8vw,110px)",
    letterSpacing: 4,
    marginBottom: 20,
    position: "relative",
  },
  emailInput: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRight: "none",
    color: "#e8eaf0",
    padding: "18px 24px",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    outline: "none",
  },
  footer: {
    padding: "48px 60px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
};