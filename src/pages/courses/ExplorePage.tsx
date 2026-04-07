// src/pages/courses/ExplorePage.tsx
import { useState } from 'react';
import {
  CURSOS_DATA, CATEGORIAS, NIVEIS, NIVEL_COLOR, CAT_EMOJI, MOD_TITLES, makeQuestions,
  type CursoData, type MatriculaLocal, type QuizQuestion,
} from '../../types/cursos';

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #080a0f; font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,204,0.2); border-radius: 2px; }
  @keyframes gf-spin { to { transform: rotate(360deg); } }
  @keyframes gf-fadeup { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gf-pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }
  input:-webkit-autofill, input:-webkit-autofill:focus {
    -webkit-text-fill-color: #e8eaf0 !important;
    -webkit-box-shadow: 0 0 0 1000px #0d1117 inset !important;
  }
`;

/* ─── PALETTE ────────────────────────────────────────────────────────────── */
const C = {
  bg:      '#080a0f',
  surface: '#0d1117',
  card:    '#10141c',
  border:  'rgba(255,255,255,0.07)',
  accent:  '#00ffcc',
  pink:    '#ff3d6e',
  violet:  '#7b5ef8',
  text:    '#e8eaf0',
  muted:   '#5a6070',
};

/* ─── ATOMS ──────────────────────────────────────────────────────────────── */
function Tag({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px',
      fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.08em',
      color, border: `1px solid ${color}40`, background: `${color}12`,
      textTransform: 'uppercase', lineHeight: 1.8,
    }}>{children}</span>
  );
}

interface ClipCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}
function ClipCard({ children, style = {}, onClick }: ClipCardProps) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick ? `${C.card}ee` : C.card,
        border: `1px solid ${hov && onClick ? C.accent + '40' : C.border}`,
        clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
        transition: 'border-color 0.2s, background 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >{children}</div>
  );
}

type NeonBtnVariant = 'primary' | 'danger' | 'ghost';
interface NeonBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  variant?: NeonBtnVariant;
}
function NeonBtn({ children, onClick, disabled, small, variant = 'primary' }: NeonBtnProps) {
  const [hov, setHov] = useState(false);
  const color = variant === 'danger' ? C.pink : variant === 'ghost' ? 'rgba(255,255,255,0.3)' : C.accent;
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov && !disabled ? color : 'transparent',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.1)' : color}`,
        color: hov && !disabled ? (variant === 'primary' ? C.bg : '#fff') : (disabled ? 'rgba(255,255,255,0.25)' : color),
        padding: small ? '6px 14px' : '10px 22px',
        fontFamily: "'Space Mono',monospace", fontSize: small ? 10 : 12,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.18s',
        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
        boxShadow: hov && !disabled ? `0 0 16px ${color}40` : 'none',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
    >{children}</button>
  );
}

interface NeonInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  maxLength?: number;
}
function NeonInput({ label, value, onChange, type = 'text', error, hint, disabled, maxLength }: NeonInputProps) {
  const [focused, setFocused] = useState(false);
  const accent = error ? C.pink : focused ? C.accent : 'rgba(255,255,255,0.12)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.2em',
        color: error ? C.pink : focused ? C.accent : 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase', transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {(['tl', 'tr', 'bl', 'br'] as const).map(p => (
          <div key={p} style={{
            position: 'absolute', width: 7, height: 7,
            ...(p === 'tl' ? { top: 0, left: 0, borderTop: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` } : {}),
            ...(p === 'tr' ? { top: 0, right: 0, borderTop: `1px solid ${accent}`, borderRight: `1px solid ${accent}` } : {}),
            ...(p === 'bl' ? { bottom: 0, left: 0, borderBottom: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` } : {}),
            ...(p === 'br' ? { bottom: 0, right: 0, borderBottom: `1px solid ${accent}`, borderRight: `1px solid ${accent}` } : {}),
            transition: 'border-color 0.2s', zIndex: 2,
          }} />
        ))}
        <input
          type={type} value={value} onChange={onChange} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          maxLength={maxLength}
          style={{
            display: 'block', width: '100%',
            background: disabled ? 'rgba(255,255,255,0.02)' : focused ? 'rgba(0,255,204,0.03)' : 'rgba(255,255,255,0.02)',
            border: 'none', borderLeft: `1px solid ${accent}`, borderRight: `1px solid ${accent}`,
            outline: 'none', padding: '10px 12px',
            color: disabled ? 'rgba(255,255,255,0.3)' : C.text,
            fontSize: 13, fontFamily: "'Outfit',sans-serif",
            transition: 'all 0.2s', cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        {focused && !disabled && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg,transparent,${accent},transparent)`,
            boxShadow: `0 0 8px ${accent}60`,
          }} />
        )}
      </div>
      {error && <p style={{ margin: 0, fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.pink }}>▸ {error}</p>}
      {hint && !error && <p style={{ margin: 0, fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(255,255,255,0.2)' }}>{hint}</p>}
    </div>
  );
}

function ProgressBar({ value, color = C.accent }: { value: number; color?: string }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
      <div style={{
        height: '100%', width: `${value}%`, background: color,
        transition: 'width 0.6s ease', boxShadow: `0 0 8px ${color}80`,
      }} />
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
type NavView = 'explore' | 'myCourses' | 'profile';
const NAV: { id: NavView; icon: string; label: string }[] = [
  { id: 'explore',   icon: '◈', label: 'Explorar' },
  { id: 'myCourses', icon: '◉', label: 'Meus Cursos' },
  { id: 'profile',   icon: '◆', label: 'Perfil' },
];

interface SidebarProps {
  view: NavView;
  setView: (v: NavView) => void;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
function Sidebar({ view, setView, userName, userEmail, userAvatar, collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside style={{
      width: collapsed ? 56 : 220, flexShrink: 0,
      background: C.surface, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ height: 2, background: `linear-gradient(90deg,${C.accent},${C.violet})` }} />

      <div style={{
        padding: collapsed ? '14px 0' : '20px 20px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${C.border}`,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <svg width="28" height="28" viewBox="0 0 52 52" fill="none">
          <polygon points="26,2 48,14 48,38 26,50 4,38 4,14" stroke={C.accent} strokeWidth="1.5" fill={`${C.accent}12`} />
          <text x="26" y="31" textAnchor="middle" fill={C.accent} fontSize="13" fontFamily="'Bebas Neue',cursive">GF</text>
        </svg>
        {!collapsed && (
          <span style={{
            fontFamily: "'Bebas Neue',cursive", fontSize: 20, letterSpacing: '0.08em',
            color: C.accent, textShadow: `0 0 14px ${C.accent}60`, lineHeight: 1,
          }}>
            GearForm
          </span>
        )}
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(n => {
          const active = view === n.id;
          return (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              padding: collapsed ? '12px 0' : '11px 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: active ? `${C.accent}14` : 'transparent',
              border: 'none', borderLeft: active ? `2px solid ${C.accent}` : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = `${C.accent}08`; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 15, color: active ? C.accent : C.muted, transition: 'color 0.18s' }}>{n.icon}</span>
              {!collapsed && (
                <span style={{
                  fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
                  color: active ? C.text : 'rgba(255,255,255,0.45)', transition: 'color 0.18s',
                }}>{n.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg,${C.violet},${C.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
            boxShadow: `0 0 10px ${C.accent}30`, overflow: 'hidden',
          }}>
            {userAvatar
              ? <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : userName[0].toUpperCase()
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
            <p style={{ margin: 0, fontSize: 10, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
          </div>
        </div>
      )}

      <button onClick={() => setCollapsed(v => !v)} style={{
        position: 'absolute', top: 22, right: -10,
        width: 20, height: 20, borderRadius: '50%',
        background: C.card, border: `1px solid ${C.border}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, color: C.muted, zIndex: 10,
      }}>
        {collapsed ? '›' : '‹'}
      </button>
    </aside>
  );
}

/* ─── QUIZ MODAL ─────────────────────────────────────────────────────────── */
interface QuizModalProps {
  curso: CursoData;
  modIdx: number;
  onClose: () => void;
  onComplete: () => void;
}
function QuizModal({ curso, modIdx, onClose, onComplete }: QuizModalProps) {
  const questions: QuizQuestion[] = makeQuestions(curso.titulo, modIdx);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIdx];
  const confirm = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === q.correta) setScore(s => s + 1);
  };
  const next = () => {
    if (qIdx < questions.length - 1) { setQIdx(i => i + 1); setSelected(null); setAnswered(false); }
    else setDone(true);
  };
  const passed = score >= 2;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(8,10,15,0.88)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: C.card, border: `1px solid ${C.border}`,
        padding: 28,
        clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))',
        animation: 'gf-fadeup 0.3s ease', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,${C.violet},transparent)` }} />

        {done ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>{passed ? '🏆' : '💡'}</div>
            <h2 style={{ margin: '0 0 8px', fontFamily: "'Bebas Neue',cursive", fontSize: 32, color: passed ? C.accent : C.pink, letterSpacing: '0.06em' }}>
              {passed ? 'APROVADO!' : 'TENTE NOVAMENTE'}
            </h2>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
              Você acertou <strong style={{ color: C.text }}>{score}/{questions.length}</strong> questões.
            </p>
            {passed ? (
              <NeonBtn onClick={() => { onComplete(); onClose(); }}>CONCLUIR MÓDULO ✓</NeonBtn>
            ) : (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <NeonBtn variant="ghost" onClick={onClose}>FECHAR</NeonBtn>
                <NeonBtn onClick={() => { setQIdx(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}>TENTAR DE NOVO</NeonBtn>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.muted }}>
              <span>// QUESTÃO {qIdx + 1}/{questions.length}</span>
              <span style={{ color: C.accent }}>Módulo {modIdx + 1}</span>
            </div>
            <ProgressBar value={(qIdx / questions.length) * 100} color={C.violet} />
            <h3 style={{ margin: '20px 0 16px', fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.45 }}>{q.pergunta}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {q.opcoes.map((op, i) => {
                let bg = 'rgba(255,255,255,0.02)', bord = C.border, col = C.text;
                if (answered) {
                  if (i === q.correta)  { bg = `${C.accent}15`; bord = C.accent; col = C.accent; }
                  else if (i === selected) { bg = `${C.pink}15`; bord = C.pink; col = C.pink; }
                } else if (i === selected) { bg = `${C.violet}15`; bord = C.violet; }
                return (
                  <button key={i} onClick={() => !answered && setSelected(i)} style={{
                    background: bg, border: `1px solid ${bord}`, color: col,
                    padding: '11px 14px', fontSize: 13, fontFamily: "'Outfit',sans-serif",
                    textAlign: 'left', cursor: answered ? 'default' : 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 10,
                    clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
                  }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: i === selected || i === q.correta ? col : C.muted, flexShrink: 0 }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {op}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={{ padding: '10px 14px', background: `${C.violet}10`, border: `1px solid ${C.violet}30`, marginBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>
                💡 {q.explicacao}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <NeonBtn variant="ghost" small onClick={onClose}>SAIR</NeonBtn>
              {!answered
                ? <NeonBtn small onClick={confirm} disabled={selected === null}>CONFIRMAR</NeonBtn>
                : <NeonBtn small onClick={next}>{qIdx < questions.length - 1 ? 'PRÓXIMA →' : 'VER RESULTADO'}</NeonBtn>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── TRAIL PAGE ─────────────────────────────────────────────────────────── */
interface TrailPageProps {
  curso: CursoData;
  mat: MatriculaLocal;
  onUpdateMat: (mat: MatriculaLocal) => void;
  onBack: () => void;
}
function TrailPage({ curso, mat, onUpdateMat, onBack }: TrailPageProps) {
  const [quiz, setQuiz] = useState<number | null>(null);
  const numMods = curso.modulos;
  const feitos: number[] = mat.modulos_feitos || [];

  const completeModulo = (idx: number) => {
    const newFeitos = [...feitos, idx];
    const prog = Math.round((newFeitos.length / numMods) * 100);
    onUpdateMat({ ...mat, modulos_feitos: newFeitos, progresso: prog, status: prog === 100 ? 'concluido' : 'ativo' });
  };

  const modTitles = MOD_TITLES.slice(0, numMods);

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease', maxWidth: 720 }}>
      {quiz !== null && (
        <QuizModal
          curso={curso} modIdx={quiz}
          onClose={() => setQuiz(null)}
          onComplete={() => !feitos.includes(quiz) && completeModulo(quiz)}
        />
      )}
      <button onClick={onBack} style={{
        background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
        alignItems: 'center', gap: 6, marginBottom: 20,
        fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', padding: 0,
      }}
        onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
      >← VOLTAR</button>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
        <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{curso.emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px', fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
            // TRILHA DE APRENDIZADO
          </p>
          <h1 style={{ margin: '0 0 6px', fontFamily: "'Bebas Neue',cursive", fontSize: 30, color: C.text, letterSpacing: '0.04em', lineHeight: 1 }}>{curso.titulo}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
            <Tag color={C.violet}>{curso.carga}h</Tag>
            <Tag color={feitos.length === numMods ? C.accent : C.muted}>{feitos.length}/{numMods} módulos</Tag>
          </div>
        </div>
      </div>

      <ClipCard style={{ padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.muted }}>
          <span>PROGRESSO GERAL</span>
          <span style={{ color: C.accent }}>{mat.progresso}%</span>
        </div>
        <ProgressBar value={mat.progresso} color={mat.progresso === 100 ? C.accent : C.violet} />
        {mat.progresso === 100 && (
          <p style={{ margin: '10px 0 0', fontSize: 12, color: C.accent, fontFamily: "'Space Mono',monospace", letterSpacing: '0.06em' }}>
            🏆 CURSO CONCLUÍDO! Certificado disponível.
          </p>
        )}
      </ClipCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modTitles.map((titulo, idx) => {
          const done   = feitos.includes(idx);
          const locked = idx > 0 && !feitos.includes(idx - 1);
          return (
            <ClipCard key={idx} style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${done ? C.accent : locked ? 'rgba(255,255,255,0.08)' : C.violet}`,
                  fontFamily: "'Bebas Neue',cursive", fontSize: 16,
                  color: done ? C.accent : locked ? 'rgba(255,255,255,0.2)' : C.violet,
                  background: done ? `${C.accent}10` : locked ? 'transparent' : `${C.violet}10`,
                }}>
                  {done ? '✓' : locked ? '🔒' : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: locked ? 'rgba(255,255,255,0.3)' : C.text }}>
                    Módulo {idx + 1}: {titulo}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
                    {done ? 'CONCLUÍDO' : locked ? 'BLOQUEADO — conclua o anterior' : '3 questões de múltipla escolha'}
                  </p>
                </div>
                {!locked && !done && <NeonBtn small onClick={() => setQuiz(idx)}>INICIAR</NeonBtn>}
                {done && <NeonBtn small variant="ghost" onClick={() => setQuiz(idx)}>REVISAR</NeonBtn>}
              </div>
            </ClipCard>
          );
        })}
      </div>
    </div>
  );
}

/* ─── EXPLORE PAGE ───────────────────────────────────────────────────────── */
interface ExplorePageProps {
  matriculas: MatriculaLocal[];
  setMatriculas: React.Dispatch<React.SetStateAction<MatriculaLocal[]>>;
  setView: (v: NavView) => void;
  setActiveCurso: React.Dispatch<React.SetStateAction<number | null>>;
}
function ExplorePageContent({ matriculas, setMatriculas, setView, setActiveCurso }: ExplorePageProps) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todos');
  const [nivel, setNivel] = useState('Todos');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const filtered = CURSOS_DATA.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) || c.categoria.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (cat === 'Todos' || c.categoria === cat) && (nivel === 'Todos' || c.nivel === nivel);
  });

  const enroll = (id: number) => {
    if (matriculas.find(m => m.cursoId === id)) return;
    setMatriculas(prev => [...prev, { cursoId: id, progresso: 0, status: 'ativo', modulos_feitos: [] }]);
    const c = CURSOS_DATA.find(x => x.id === id)!;
    showToast(`✓ Matriculado em "${c.titulo}"`);
  };

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: `${C.accent}18`, border: `1px solid ${C.accent}50`,
          padding: '10px 18px', fontFamily: "'Space Mono',monospace", fontSize: 11,
          color: C.accent, letterSpacing: '0.06em',
          clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
          animation: 'gf-fadeup 0.3s ease',
        }}>{toast}</div>
      )}

      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>// CATÁLOGO</p>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',cursive", fontSize: 36, letterSpacing: '0.05em', color: C.text, lineHeight: 1 }}>EXPLORAR CURSOS</h1>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: C.muted, pointerEvents: 'none' }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cursos..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${C.border}`, outline: 'none',
              padding: '9px 12px 9px 34px', color: C.text, fontSize: 13,
              fontFamily: "'Outfit',sans-serif",
              clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
            }}
          />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, padding: '8px 12px', fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: 'none', cursor: 'pointer' }}>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={nivel} onChange={e => setNivel(e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, padding: '8px 12px', fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: 'none', cursor: 'pointer' }}>
          {NIVEIS.map(n => <option key={n}>{n}</option>)}
        </select>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: 12, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
        {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {filtered.map(curso => {
          const enrolled = !!matriculas.find(m => m.cursoId === curso.id);
          const mat = matriculas.find(m => m.cursoId === curso.id);
          return (
            <ClipCard key={curso.id} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>{curso.emoji}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
                  <Tag color={C.violet}>{CAT_EMOJI[curso.categoria]} {curso.categoria}</Tag>
                </div>
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{curso.titulo}</h3>
                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{curso.descricao}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
                <span>⏱ {curso.carga}h</span>
                <span>📚 {curso.modulos} módulos</span>
                {curso.cert && <span style={{ color: `${C.accent}80` }}>🏆 Cert.</span>}
              </div>
              {enrolled && mat && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.muted }}>
                    <span>PROGRESSO</span><span>{mat.progresso}%</span>
                  </div>
                  <ProgressBar value={mat.progresso} color={C.accent} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, color: C.accent, letterSpacing: '0.05em' }}>
                  R$ {curso.preco.toFixed(2).replace('.', ',')}
                </span>
                {enrolled
                  ? <NeonBtn small onClick={() => { setActiveCurso(curso.id); setView('myCourses'); }}>CONTINUAR →</NeonBtn>
                  : <NeonBtn small onClick={() => enroll(curso.id)}>MATRICULAR</NeonBtn>
                }
              </div>
            </ClipCard>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ROOT EXPORT ────────────────────────────────────────────────────────── */
interface ExplorePageRootProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
}
export default function ExplorePageRoot({ userName, userEmail, userAvatar }: ExplorePageRootProps) {
  const [view, setView] = useState<NavView>('explore');
  const [collapsed, setCollapsed] = useState(false);
  const [matriculas, setMatriculas] = useState<MatriculaLocal[]>([]);
  const [activeCurso, setActiveCurso] = useState<number | null>(null);
  const [trailCurso, setTrailCurso] = useState<CursoData | null>(null);

  if (activeCurso !== null && !trailCurso) {
    const c = CURSOS_DATA.find(x => x.id === activeCurso);
    if (c) { setTrailCurso(c); setActiveCurso(null); setView('myCourses'); }
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: 'flex', height: '100vh', background: C.bg, fontFamily: "'Outfit',sans-serif", overflow: 'hidden', color: C.text }}>
        <Sidebar view={view} setView={setView} userName={userName} userEmail={userEmail} userAvatar={userAvatar} collapsed={collapsed} setCollapsed={setCollapsed} />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {view === 'explore' && (
            <ExplorePageContent
              matriculas={matriculas} setMatriculas={setMatriculas}
              setView={setView} setActiveCurso={setActiveCurso}
            />
          )}
          {view === 'myCourses' && trailCurso && (() => {
            const mat = matriculas.find(m => m.cursoId === trailCurso.id)!;
            return (
              <TrailPage curso={trailCurso} mat={mat}
                onUpdateMat={nm => setMatriculas(p => p.map(m => m.cursoId === nm.cursoId ? nm : m))}
                onBack={() => setTrailCurso(null)}
              />
            );
          })()}
        </main>
      </div>
    </>
  );
}