// src/pages/users/UserAreaPage.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { User, CursoCard, MatriculaLocal } from '../../types';

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,204,0.2); border-radius: 2px; }
  @keyframes gf-spin    { to { transform: rotate(360deg); } }
  @keyframes gf-fadeup  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gf-pulse   { 0%,100%{opacity:1;} 50%{opacity:.35;} }
  @keyframes gf-toast   { 0%{opacity:0;transform:translateY(-8px);} 15%,85%{opacity:1;transform:translateY(0);} 100%{opacity:0;} }
  input:-webkit-autofill, input:-webkit-autofill:focus {
    -webkit-text-fill-color: #e8eaf0 !important;
    -webkit-box-shadow: 0 0 0 1000px #0d1117 inset !important;
  }
`;

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

const CURSOS: CursoCard[] = [
  { id:1,  titulo:'Python do Zero ao Avançado',            cat:'Programação',    nivel:'Iniciante',     carga:60,  preco:97.90,  modulos:5, emoji:'🐍', desc:'Aprenda Python desde a sintaxe básica até projetos com automação, web scraping e APIs REST.' },
  { id:2,  titulo:'Dev Web com JavaScript e React',        cat:'Programação',    nivel:'Intermediário', carga:80,  preco:127.90, modulos:5, emoji:'⚛️', desc:'Domine HTML, CSS, JavaScript moderno e construa interfaces com React e TypeScript.' },
  { id:3,  titulo:'Node.js e APIs REST',                   cat:'Programação',    nivel:'Intermediário', carga:50,  preco:97.90,  modulos:5, emoji:'🟢', desc:'Construa back-ends robustos com Node.js, Express, JWT e boas práticas de arquitetura.' },
  { id:4,  titulo:'Banco de Dados SQL e MySQL',            cat:'Programação',    nivel:'Iniciante',     carga:40,  preco:67.90,  modulos:4, emoji:'🗄️', desc:'Modelagem relacional, consultas avançadas, procedures e otimização de queries.' },
  { id:5,  titulo:'Intro à Eletromecânica Industrial',     cat:'Eletromecânica', nivel:'Iniciante',     carga:45,  preco:87.90,  modulos:4, emoji:'⚙️', desc:'Mecânica aplicada, acionamentos elétricos, motores e manutenção preventiva.' },
  { id:6,  titulo:'Manutenção de Motores Elétricos',       cat:'Eletromecânica', nivel:'Intermediário', carga:35,  preco:97.90,  modulos:4, emoji:'🔧', desc:'Diagnóstico, desmontagem, rebobinamento e manutenção de motores trifásicos.' },
  { id:7,  titulo:'Automação Industrial com CLP',          cat:'Eletromecânica', nivel:'Avançado',      carga:55,  preco:147.90, modulos:5, emoji:'🏭', desc:'Programação de CLPs Siemens, linguagem Ladder, SCADA e integração com sensores.' },
  { id:8,  titulo:'Hidráulica e Pneumática',               cat:'Eletromecânica', nivel:'Intermediário', carga:40,  preco:87.90,  modulos:4, emoji:'💧', desc:'Circuitos hidráulicos, válvulas, atuadores pneumáticos e dimensionamento.' },
  { id:9,  titulo:'Eletrônica Básica',                     cat:'Eletrônica',     nivel:'Iniciante',     carga:30,  preco:57.90,  modulos:4, emoji:'⚡', desc:'Componentes eletrônicos, lei de Ohm, circuitos RC e RL e uso do multímetro.' },
  { id:10, titulo:'Arduino e IoT na Prática',              cat:'Eletrônica',     nivel:'Iniciante',     carga:40,  preco:77.90,  modulos:4, emoji:'🤖', desc:'Programe o Arduino, sensores, relés e módulos WiFi para projetos IoT.' },
  { id:11, titulo:'Eletrônica de Potência',                cat:'Eletrônica',     nivel:'Avançado',      carga:50,  preco:127.90, modulos:4, emoji:'🔋', desc:'Retificadores, inversores, conversores DC-DC e projetos com IGBTs e MOSFETs.' },
  { id:12, titulo:'Redes de Computadores — CCNA',          cat:'Redes',          nivel:'Iniciante',     carga:60,  preco:107.90, modulos:5, emoji:'🌐', desc:'TCP/IP, roteamento, switching, VLANs, subnetting e configuração Cisco.' },
  { id:13, titulo:'Cibersegurança e Ethical Hacking',      cat:'Redes',          nivel:'Avançado',      carga:70,  preco:147.90, modulos:5, emoji:'🛡️', desc:'Pentest, análise de vulnerabilidades, Kali Linux e defesa de redes.' },
  { id:14, titulo:'UI/UX Design com Figma',                cat:'Design',         nivel:'Iniciante',     carga:35,  preco:77.90,  modulos:4, emoji:'🎨', desc:'Prototipagem, design de interfaces, sistemas de design e testes de usabilidade.' },
  { id:15, titulo:'Gestão de Projetos com Scrum e Kanban', cat:'Gestão',         nivel:'Iniciante',     carga:20,  preco:47.90,  modulos:3, emoji:'📋', desc:'Metodologias ágeis, sprints, cerimônias Scrum e ferramentas como Jira e Trello.' },
];

const CATS   = ['Todos', 'Programação', 'Eletromecânica', 'Eletrônica', 'Redes', 'Design', 'Gestão'];
const NIVEIS = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
const NIVEL_COLOR: Record<string, string> = { Iniciante: C.accent, Intermediário: '#f59e0b', Avançado: C.pink };
const MOD_TITLES = ['Fundamentos e Introdução', 'Conceitos Intermediários', 'Aplicações Práticas', 'Projeto Hands-on', 'Avaliação Final'];

interface QuizQuestion {
  id: number;
  pergunta: string;
  opcoes: string[];
  correta: number;
  exp: string;
}

const makeQuestions = (titulo: string, modIdx: number): QuizQuestion[] => [
  { id: 1, pergunta: `Sobre ${titulo} — Módulo ${modIdx + 1}: qual afirmação está CORRETA?`,
    opcoes: ['É uma tecnologia obsoleta', 'Tem ampla aplicação no mercado', 'Só funciona em sistemas antigos', 'Não possui documentação'], correta: 1,
    exp: 'A alternativa B está correta. Esta tecnologia tem ampla aplicação no mercado atual.' },
  { id: 2, pergunta: 'Qual é a principal vantagem estudada neste módulo?',
    opcoes: ['Alto custo', 'Complexidade sem benefícios', 'Produtividade e eficiência', 'Limitação de uso'], correta: 2,
    exp: 'Correto! O módulo foca em produtividade e eficiência.' },
  { id: 3, pergunta: `Qual ferramenta é essencial para trabalhar com ${titulo}?`,
    opcoes: ['Bloco de notas', 'IDE ou editor especializado', 'Calculadora científica', 'Processador de texto'], correta: 1,
    exp: 'Um IDE ou editor especializado é fundamental para produtividade.' },
];

/* ─── ATOMS ──────────────────────────────────────────────────────────────── */
interface TagProps { children: React.ReactNode; color?: string; }
function Tag({ children, color = C.accent }: TagProps) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', fontFamily: "'Space Mono',monospace",
      fontSize: 9, letterSpacing: '0.08em', color, border: `1px solid ${color}30`,
      background: `${color}0f`, textTransform: 'uppercase', lineHeight: 1.9, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

interface ClipCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  glow?: boolean;
}
function ClipCard({ children, style = {}, onClick, glow = false }: ClipCardProps) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov && onClick ? '#13181f' : C.card,
        border: `1px solid ${hov && onClick ? C.accent + '50' : glow ? C.accent + '30' : C.border}`,
        clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
        transition: 'all 0.2s', cursor: onClick ? 'pointer' : 'default',
        boxShadow: glow ? `0 0 20px ${C.accent}10` : 'none', ...style }}>
      {children}
    </div>
  );
}

type NeonBtnVariant = 'primary' | 'danger' | 'ghost' | 'violet';
interface NeonBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  variant?: NeonBtnVariant;
  type?: 'button' | 'submit' | 'reset';
}
function NeonBtn({ children, onClick, disabled, small, variant = 'primary', type = 'button' }: NeonBtnProps) {
  const [hov, setHov] = useState(false);
  const color = variant === 'danger' ? C.pink : variant === 'ghost' ? 'rgba(255,255,255,0.3)' : variant === 'violet' ? C.violet : C.accent;
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov && !disabled ? color : 'transparent',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.1)' : color}`,
        color: hov && !disabled ? (variant === 'primary' ? C.bg : '#fff') : disabled ? 'rgba(255,255,255,0.2)' : color,
        padding: small ? '5px 14px' : '10px 22px', fontFamily: "'Space Mono',monospace",
        fontSize: small ? 10 : 12, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
        boxShadow: hov && !disabled ? `0 0 18px ${color}40` : 'none',
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

interface NeonInputProps {
  label?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
}
function NeonInput({ label, value, onChange, type = 'text', error, hint, disabled, maxLength, placeholder }: NeonInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === 'password';
  const accent = error ? C.pink : focused ? C.accent : 'rgba(255,255,255,0.12)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.2em',
          color: error ? C.pink : focused ? C.accent : 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', transition: 'color 0.2s' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {(['tl', 'tr', 'bl', 'br'] as const).map(p => (
          <div key={p} style={{ position: 'absolute', width: 7, height: 7,
            ...(p === 'tl' ? { top: 0, left: 0, borderTop: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` } : {}),
            ...(p === 'tr' ? { top: 0, right: 0, borderTop: `1px solid ${accent}`, borderRight: `1px solid ${accent}` } : {}),
            ...(p === 'bl' ? { bottom: 0, left: 0, borderBottom: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` } : {}),
            ...(p === 'br' ? { bottom: 0, right: 0, borderBottom: `1px solid ${accent}`, borderRight: `1px solid ${accent}` } : {}),
            transition: 'border-color 0.2s', zIndex: 2 }} />
        ))}
        <input type={isPwd ? (showPwd ? 'text' : 'password') : type} value={value} onChange={onChange}
          disabled={disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          maxLength={maxLength} placeholder={placeholder}
          style={{ display: 'block', width: '100%',
            background: disabled ? 'rgba(255,255,255,0.02)' : focused ? 'rgba(0,255,204,0.03)' : 'rgba(255,255,255,0.02)',
            border: 'none', borderLeft: `1px solid ${accent}`, borderRight: `1px solid ${accent}`,
            outline: 'none', padding: `10px ${isPwd ? 42 : 12}px 10px 12px`,
            color: disabled ? 'rgba(255,255,255,0.3)' : C.text, fontSize: 13,
            fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s', cursor: disabled ? 'not-allowed' : 'text' }} />
        {focused && !disabled && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg,transparent,${accent},transparent)`, boxShadow: `0 0 8px ${accent}60` }} />
        )}
        {isPwd && (
          <button type="button" onClick={() => setShowPwd(v => !v)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: showPwd ? C.accent : 'rgba(255,255,255,0.3)', padding: 0, display: 'flex' }}>
            {showPwd
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        )}
      </div>
      {error && <p style={{ margin: 0, fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.pink }}>▸ {error}</p>}
      {hint && !error && <p style={{ margin: 0, fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(255,255,255,0.2)' }}>{hint}</p>}
    </div>
  );
}

interface ProgressBarProps { value: number; color?: string; }
function ProgressBar({ value, color = C.accent }: ProgressBarProps) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, transition: 'width 0.8s ease', boxShadow: `0 0 8px ${color}80` }} />
    </div>
  );
}

interface ToastProps { msg: string; onDone: () => void; }
function Toast({ msg, onDone }: ToastProps) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000,
      background: `${C.accent}15`, border: `1px solid ${C.accent}50`,
      padding: '10px 18px', fontFamily: "'Space Mono',monospace", fontSize: 11,
      color: C.accent, letterSpacing: '0.06em',
      clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
      animation: 'gf-toast 2.8s ease forwards' }}>{msg}</div>
  );
}

/* ─── QUIZ MODAL ─────────────────────────────────────────────────────────── */
interface QuizModalProps {
  curso: CursoCard;
  modIdx: number;
  onClose: () => void;
  onComplete: () => void;
}
function QuizModal({ curso, modIdx, onClose, onComplete }: QuizModalProps) {
  const qs = makeQuestions(curso.titulo, modIdx);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [ans, setAns] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = qs[qi];

  const confirm = () => { if (sel === null) return; setAns(true); if (sel === q.correta) setScore(s => s + 1); };
  const next = () => {
    if (qi < qs.length - 1) { setQi(i => i + 1); setSel(null); setAns(false); }
    else setDone(true);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(8,10,15,0.9)',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 520, background: C.card,
        border: `1px solid ${C.border}`, padding: 28, position: 'relative',
        clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))',
        animation: 'gf-fadeup 0.3s ease' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg,${C.violet},transparent)` }} />

        {done ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>{score >= 2 ? '🏆' : '💡'}</div>
            <h2 style={{ margin: '0 0 8px', fontFamily: "'Bebas Neue',cursive", fontSize: 32,
              color: score >= 2 ? C.accent : C.pink, letterSpacing: '0.06em' }}>
              {score >= 2 ? 'APROVADO!' : 'TENTE NOVAMENTE'}
            </h2>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
              Você acertou <strong style={{ color: C.text }}>{score}/{qs.length}</strong> questões.
            </p>
            {score >= 2
              ? <NeonBtn onClick={() => { onComplete(); onClose(); }}>CONCLUIR MÓDULO ✓</NeonBtn>
              : <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <NeonBtn variant="ghost" onClick={onClose}>FECHAR</NeonBtn>
                  <NeonBtn onClick={() => { setQi(0); setSel(null); setAns(false); setScore(0); setDone(false); }}>TENTAR DE NOVO</NeonBtn>
                </div>
            }
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14,
              fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.muted }}>
              <span>// QUESTÃO {qi + 1}/{qs.length}</span>
              <span style={{ color: C.accent }}>Módulo {modIdx + 1}</span>
            </div>
            <ProgressBar value={(qi / qs.length) * 100} color={C.violet} />
            <h3 style={{ margin: '18px 0 14px', fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.45 }}>{q.pergunta}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
              {q.opcoes.map((op, i) => {
                let bg = 'rgba(255,255,255,0.02)', bord = C.border, col = C.text;
                if (ans) {
                  if (i === q.correta) { bg = `${C.accent}15`; bord = C.accent; col = C.accent; }
                  else if (i === sel) { bg = `${C.pink}15`; bord = C.pink; col = C.pink; }
                } else if (i === sel) { bg = `${C.violet}15`; bord = C.violet; }
                return (
                  <button key={i} onClick={() => !ans && setSel(i)}
                    style={{ background: bg, border: `1px solid ${bord}`, color: col,
                      padding: '10px 14px', fontSize: 13, fontFamily: "'Outfit',sans-serif", textAlign: 'left',
                      cursor: ans ? 'default' : 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 10,
                      clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10,
                      color: i === sel ? col : C.muted, flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
                    {op}
                  </button>
                );
              })}
            </div>
            {ans && (
              <div style={{ padding: '10px 14px', background: `${C.violet}0f`,
                border: `1px solid ${C.violet}30`, marginBottom: 16, fontSize: 13,
                color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>💡 {q.exp}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <NeonBtn variant="ghost" small onClick={onClose}>SAIR</NeonBtn>
              {!ans
                ? <NeonBtn small onClick={confirm} disabled={sel === null}>CONFIRMAR</NeonBtn>
                : <NeonBtn small onClick={next}>{qi < qs.length - 1 ? 'PRÓXIMA →' : 'VER RESULTADO'}</NeonBtn>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── TRAIL VIEW ─────────────────────────────────────────────────────────── */
interface TrailViewProps {
  curso: CursoCard;
  mat: MatriculaLocal;
  onUpdate: (mat: MatriculaLocal) => void;
  onBack: () => void;
}
function TrailView({ curso, mat, onUpdate, onBack }: TrailViewProps) {
  const [quiz, setQuiz] = useState<number | null>(null);
  const feitos: number[] = mat.modulos_feitos || [];

  const complete = (idx: number) => {
    if (feitos.includes(idx)) return;
    const nf = [...feitos, idx];
    onUpdate({ ...mat, modulos_feitos: nf, progresso: Math.round((nf.length / curso.modulos) * 100),
      status: nf.length === curso.modulos ? 'concluido' : 'ativo' });
  };

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease', maxWidth: 720 }}>
      {quiz !== null && (
        <QuizModal curso={curso} modIdx={quiz} onClose={() => setQuiz(null)} onComplete={() => complete(quiz)} />
      )}
      <button onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: 6, marginBottom: 22, fontFamily: "'Space Mono',monospace",
          fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', padding: 0 }}
        onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
        ← VOLTAR
      </button>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 22 }}>
        <span style={{ fontSize: 42, lineHeight: 1, flexShrink: 0 }}>{curso.emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 3px', fontFamily: "'Space Mono',monospace", fontSize: 9,
            letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
            // TRILHA DE APRENDIZADO
          </p>
          <h1 style={{ margin: '0 0 8px', fontFamily: "'Bebas Neue',cursive", fontSize: 28,
            color: C.text, letterSpacing: '0.04em', lineHeight: 1 }}>{curso.titulo}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
            <Tag color={C.violet}>{curso.carga}h</Tag>
            <Tag color={feitos.length === curso.modulos ? C.accent : C.muted}>
              {feitos.length}/{curso.modulos} módulos
            </Tag>
          </div>
        </div>
      </div>
      <ClipCard style={{ padding: 16, marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8,
          fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.muted }}>
          <span>PROGRESSO GERAL</span>
          <span style={{ color: C.accent }}>{mat.progresso}%</span>
        </div>
        <ProgressBar value={mat.progresso} color={mat.progresso === 100 ? C.accent : C.violet} />
        {mat.progresso === 100 && (
          <p style={{ margin: '10px 0 0', fontSize: 11, color: C.accent,
            fontFamily: "'Space Mono',monospace", letterSpacing: '0.06em' }}>
            🏆 CURSO CONCLUÍDO! Certificado disponível.
          </p>
        )}
      </ClipCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOD_TITLES.slice(0, curso.modulos).map((titulo, idx) => {
          const done = feitos.includes(idx);
          const locked = idx > 0 && !feitos.includes(idx - 1);
          return (
            <ClipCard key={idx} style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', border: `1px solid ${done ? C.accent : locked ? 'rgba(255,255,255,0.08)' : C.violet}`,
                  fontFamily: "'Bebas Neue',cursive", fontSize: 15,
                  color: done ? C.accent : locked ? 'rgba(255,255,255,0.2)' : C.violet,
                  background: done ? `${C.accent}0f` : locked ? 'transparent' : `${C.violet}0f` }}>
                  {done ? '✓' : locked ? '🔒' : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600,
                    color: locked ? 'rgba(255,255,255,0.3)' : C.text }}>
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

/* ─── EXPLORE VIEW ───────────────────────────────────────────────────────── */
interface ExploreViewProps {
  mats: MatriculaLocal[];
  setMats: React.Dispatch<React.SetStateAction<MatriculaLocal[]>>;
  goTrail: (id: number) => void;
}
function ExploreView({ mats, setMats, goTrail }: ExploreViewProps) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todos');
  const [nivel, setNivel] = useState('Todos');
  const [toast, setToast] = useState('');

  const filtered = CURSOS.filter(c => {
    const ms = c.titulo.toLowerCase().includes(search.toLowerCase()) || c.cat.toLowerCase().includes(search.toLowerCase());
    return ms && (cat === 'Todos' || c.cat === cat) && (nivel === 'Todos' || c.nivel === nivel);
  });

  const enroll = (id: number) => {
    if (mats.find(m => m.cursoId === id)) return;
    setMats(p => [...p, { cursoId: id, progresso: 0, status: 'ativo', modulos_feitos: [] }]);
    const c = CURSOS.find(x => x.id === id)!;
    setToast(`✓ Matriculado em "${c.titulo}"`);
  };

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease' }}>
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
      <div style={{ marginBottom: 22 }}>
        <p style={{ margin: '0 0 3px', fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>// CATÁLOGO</p>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',cursive", fontSize: 34,
          color: C.text, letterSpacing: '0.04em', lineHeight: 1 }}>EXPLORAR CURSOS</h1>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: C.muted, pointerEvents: 'none' }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cursos..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${C.border}`, outline: 'none', padding: '9px 12px 9px 34px',
              color: C.text, fontSize: 13, fontFamily: "'Outfit',sans-serif",
              clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }} />
        </div>
        {([{ v: cat, set: setCat, opts: CATS }, { v: nivel, set: setNivel, opts: NIVEIS }] as const).map((s, i) => (
          <select key={i} value={s.v} onChange={e => s.set(e.target.value)}
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text,
              padding: '8px 12px', fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: 'none', cursor: 'pointer' }}>
            {s.opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 11, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
        {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {filtered.map(curso => {
          const mat = mats.find(m => m.cursoId === curso.id);
          const enrolled = !!mat;
          return (
            <ClipCard key={curso.id} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 30, lineHeight: 1 }}>{curso.emoji}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
                  <Tag color={C.violet}>{curso.cat}</Tag>
                </div>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px', fontFamily: "'Outfit',sans-serif", fontSize: 15,
                  fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{curso.titulo}</h3>
                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{curso.desc}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
                <span>⏱ {curso.carga}h</span>
                <span>📚 {curso.modulos} módulos</span>
                <span style={{ color: `${C.accent}70` }}>🏆 Cert.</span>
              </div>
              {enrolled && mat && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5,
                    fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.muted }}>
                    <span>PROGRESSO</span><span>{mat.progresso}%</span>
                  </div>
                  <ProgressBar value={mat.progresso} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, color: C.accent, letterSpacing: '0.04em' }}>
                  R$ {curso.preco.toFixed(2).replace('.', ',')}
                </span>
                {enrolled
                  ? <NeonBtn small onClick={() => goTrail(curso.id)}>CONTINUAR →</NeonBtn>
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

/* ─── MY COURSES VIEW ────────────────────────────────────────────────────── */
interface MyCoursesViewProps {
  mats: MatriculaLocal[];
  setMats: React.Dispatch<React.SetStateAction<MatriculaLocal[]>>;
  openTrailId: number | null;
  setOpenTrailId: React.Dispatch<React.SetStateAction<number | null>>;
}
function MyCoursesView({ mats, setMats, openTrailId, setOpenTrailId }: MyCoursesViewProps) {
  const [trailCurso, setTrailCurso] = useState<CursoCard | null>(null);

  useEffect(() => {
    if (openTrailId != null) {
      const c = CURSOS.find(x => x.id === openTrailId);
      if (c) { setTrailCurso(c); setOpenTrailId(null); }
    }
  }, [openTrailId, setOpenTrailId]);

  const updMat = (nm: MatriculaLocal) => setMats(p => p.map(m => m.cursoId === nm.cursoId ? nm : m));

  if (trailCurso) {
    const mat = mats.find(m => m.cursoId === trailCurso.id)!;
    return <TrailView curso={trailCurso} mat={mat} onUpdate={updMat} onBack={() => setTrailCurso(null)} />;
  }

  const stats = [
    { label: 'Matrículas',    val: mats.length,                                             color: C.accent },
    { label: 'Em andamento',  val: mats.filter(m => m.progresso < 100 && m.progresso > 0).length, color: C.violet },
    { label: 'Concluídos',    val: mats.filter(m => m.progresso === 100).length,            color: '#f59e0b' },
  ];

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 3px', fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>// MINHA JORNADA</p>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',cursive", fontSize: 34,
          color: C.text, letterSpacing: '0.04em', lineHeight: 1 }}>MEUS CURSOS</h1>
      </div>
      {mats.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>📭</div>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 6 }}>Você ainda não está matriculado em nenhum curso.</p>
          <p style={{ color: `${C.accent}80`, fontSize: 12, fontFamily: "'Space Mono',monospace" }}>
            Vá em Explorar para encontrar seu próximo aprendizado.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 26 }}>
            {stats.map(s => (
              <ClipCard key={s.label} style={{ padding: '14px 16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontFamily: "'Bebas Neue',cursive", fontSize: 34,
                  color: s.color, letterSpacing: '0.04em', lineHeight: 1 }}>{s.val}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted, fontFamily: "'Space Mono',monospace",
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
              </ClipCard>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 14 }}>
            {mats.map(mat => {
              const curso = CURSOS.find(c => c.id === mat.cursoId);
              if (!curso) return null;
              const done = mat.progresso === 100;
              return (
                <ClipCard key={mat.cursoId} onClick={() => setTrailCurso(curso)}
                  style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{curso.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 5px', fontSize: 14, fontWeight: 700, color: C.text,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curso.titulo}</h3>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
                        {done && <Tag color={C.accent}>✓ Concluído</Tag>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5,
                      fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.muted }}>
                      <span>PROGRESSO</span>
                      <span style={{ color: done ? C.accent : C.violet }}>{mat.progresso}%</span>
                    </div>
                    <ProgressBar value={mat.progresso} color={done ? C.accent : C.violet} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
                      {(mat.modulos_feitos || []).length}/{curso.modulos} módulos
                    </span>
                    <span style={{ fontSize: 11, color: C.accent, fontFamily: "'Space Mono',monospace" }}>VER TRILHA →</span>
                  </div>
                </ClipCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── PROFILE VIEW ───────────────────────────────────────────────────────── */
interface ProfileViewProps { user: User; onUpdateUser: (u: User) => void; }
function ProfileView({ user, onUpdateUser }: ProfileViewProps) {
  const [name, setName] = useState(user.name || '');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(user.avatar || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { alert('Foto máxima: 2 MB'); return; }
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())             e.name   = 'Nome é obrigatório';
    else if (name.trim().length < 3) e.name = 'Mínimo 3 caracteres';
    if (newPwd) {
      if (!oldPwd)                e.oldPwd = 'Informe a senha atual';
      if (newPwd.length < 8)      e.newPwd = 'Mínimo 8 caracteres';
      if (newPwd !== confPwd)     e.confPwd = 'Senhas não coincidem';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    onUpdateUser({ ...user, name: name.trim(), avatar: preview });
    setSaved(true);
    setOldPwd(''); setNewPwd(''); setConfPwd('');
    setTimeout(() => setSaved(false), 2500);
  };

  const pwdScore = newPwd
    ? [newPwd.length >= 8, /[A-Z]/.test(newPwd), /[0-9]/.test(newPwd), /[^A-Za-z0-9]/.test(newPwd)].filter(Boolean).length
    : 0;
  const pwdColors = ['', '#ff3d6e', '#f59e0b', C.violet, C.accent];
  const pwdLabels = ['', 'Fraca', 'Média', 'Boa', 'Forte'];

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease', maxWidth: 560 }}>
      {saved && <Toast msg="✓ PERFIL ATUALIZADO COM SUCESSO" onDone={() => setSaved(false)} />}
      <div style={{ marginBottom: 26 }}>
        <p style={{ margin: '0 0 3px', fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>// CONFIGURAÇÕES</p>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',cursive", fontSize: 34, color: C.text, letterSpacing: '0.04em', lineHeight: 1 }}>MEU PERFIL</h1>
      </div>
      <ClipCard style={{ padding: 20, marginBottom: 16 }}>
        <p style={{ margin: '0 0 14px', fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase' }}>FOTO DE PERFIL</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div onClick={() => fileRef.current?.click()}
            style={{ width: 74, height: 74, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
              border: `2px solid ${C.accent}40`, overflow: 'hidden', position: 'relative',
              background: `linear-gradient(135deg,${C.violet},${C.accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {preview
              ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 30, color: '#fff' }}>
                  {(user.name || 'U')[0].toUpperCase()}
                </span>
            }
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0,
              transition: 'opacity 0.2s', fontSize: 20 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>📷</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
          <div>
            <NeonBtn small onClick={() => fileRef.current?.click()}>ALTERAR FOTO</NeonBtn>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: C.muted, fontFamily: "'Space Mono',monospace" }}>JPG, PNG • Máx. 2 MB</p>
          </div>
        </div>
      </ClipCard>
      <ClipCard style={{ padding: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: 0, fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase' }}>INFORMAÇÕES PESSOAIS</p>
        <NeonInput label="Nome Completo" value={name}
          onChange={(e) => setName(e.target.value)} error={errors.name} />
        <NeonInput label="E-mail (não editável)" value={user.email} disabled
          hint="O e-mail não pode ser alterado pelo usuário." />
        <NeonInput label="CPF" value={user.cpf || ''} disabled
          hint="Para alterar o CPF, entre em contato com o suporte." />
      </ClipCard>
      <ClipCard style={{ padding: 20, marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: 0, fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase' }}>ALTERAR SENHA</p>
        <NeonInput label="Senha Atual" type="password" value={oldPwd}
          onChange={(e) => setOldPwd(e.target.value)} error={errors.oldPwd} />
        <NeonInput label="Nova Senha" type="password" value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)} error={errors.newPwd}
          hint="Mínimo 8 caracteres, letra maiúscula e número" />
        {newPwd && (
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ flex: 1, height: 2, borderRadius: 1,
                  background: i <= pwdScore ? pwdColors[pwdScore] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 10, fontFamily: "'Space Mono',monospace",
              color: pwdColors[pwdScore] || C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Força: {pwdLabels[pwdScore]}
            </p>
          </div>
        )}
        <NeonInput label="Confirmar Nova Senha" type="password" value={confPwd}
          onChange={(e) => setConfPwd(e.target.value)} error={errors.confPwd} />
      </ClipCard>
      <NeonBtn onClick={save}>SALVAR ALTERAÇÕES</NeonBtn>
    </div>
  );
}

/* ─── SIDEBAR ─────────────────────────────────────────────────────────────── */
type View = 'explore' | 'myCourses' | 'profile';
const NAV: { id: View; icon: string; label: string }[] = [
  { id: 'explore',   icon: '◈', label: 'Explorar' },
  { id: 'myCourses', icon: '◉', label: 'Meus Cursos' },
  { id: 'profile',   icon: '◆', label: 'Perfil' },
];

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  user: User;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
  matsCount: number;
}
function Sidebar({ view, setView, user, collapsed, setCollapsed, onLogout, matsCount }: SidebarProps) {
  return (
    <aside style={{ width: collapsed ? 56 : 220, flexShrink: 0, background: C.surface,
      borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease', position: 'relative', overflow: 'hidden', zIndex: 10 }}>
      <div style={{ height: 2, background: `linear-gradient(90deg,${C.accent},${C.violet})`, flexShrink: 0 }} />
      <div style={{ padding: collapsed ? '14px 0' : '18px 18px 14px', display: 'flex', alignItems: 'center',
        gap: 10, borderBottom: `1px solid ${C.border}`, justifyContent: collapsed ? 'center' : 'flex-start', flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 52 52" fill="none">
          <polygon points="26,2 48,14 48,38 26,50 4,38 4,14" stroke={C.accent} strokeWidth="1.5" fill={`${C.accent}12`} />
          <text x="26" y="31" textAnchor="middle" fill={C.accent} fontSize="13" fontFamily="'Bebas Neue',cursive">GF</text>
        </svg>
        {!collapsed && (
          <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, letterSpacing: '0.08em',
            color: C.accent, textShadow: `0 0 14px ${C.accent}50`, lineHeight: 1 }}>GearForm</span>
        )}
      </div>
      <nav style={{ flex: 1, padding: '10px 0' }}>
        {NAV.map(n => {
          const active = view === n.id;
          return (
            <button key={n.id} onClick={() => setView(n.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: collapsed ? '12px 0' : '10px 18px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? `${C.accent}12` : 'transparent',
                border: 'none', borderLeft: active ? `2px solid ${C.accent}` : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.18s', position: 'relative' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = `${C.accent}07`; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <span style={{ fontSize: 14, color: active ? C.accent : C.muted, transition: 'color 0.18s' }}>{n.icon}</span>
              {!collapsed && (
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
                  color: active ? C.text : 'rgba(255,255,255,0.4)', transition: 'color 0.18s' }}>{n.label}</span>
              )}
              {n.id === 'myCourses' && matsCount > 0 && collapsed && (
                <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6,
                  borderRadius: '50%', background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />
              )}
            </button>
          );
        })}
      </nav>
      <div style={{ borderTop: `1px solid ${C.border}`, padding: collapsed ? '12px 0' : '14px 18px',
        flexShrink: 0, display: 'flex', flexDirection: 'column', gap: collapsed ? 0 : 10 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
              background: `linear-gradient(135deg,${C.violet},${C.accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {user.avatar
                ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : (user.name || 'U')[0].toUpperCase()
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
            cursor: 'pointer', width: '100%', padding: collapsed ? '8px 0' : '4px 0',
            justifyContent: collapsed ? 'center' : 'flex-start', fontFamily: "'Space Mono',monospace",
            fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase', transition: 'color 0.18s' }}
          onMouseEnter={e => (e.currentTarget.style.color = C.pink)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
          <span>⏻</span>{!collapsed && <span>SAIR</span>}
        </button>
      </div>
      <button onClick={() => setCollapsed(v => !v)}
        style={{ position: 'absolute', top: 24, right: -10, width: 20, height: 20, borderRadius: '50%',
          background: C.card, border: `1px solid ${C.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, color: C.muted, zIndex: 20 }}>
        {collapsed ? '›' : '‹'}
      </button>
    </aside>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────────────────────────── */
interface TopbarProps { view: View; user: User; onMenuClick: () => void; sidebarOpen: boolean; }
function Topbar({ view, user, onMenuClick, sidebarOpen }: TopbarProps) {
  const labels: Record<View, string> = { explore: 'Explorar Cursos', myCourses: 'Meus Cursos', profile: 'Meu Perfil' };
  return (
    <header style={{ height: 56, background: C.surface, borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onMenuClick}
          style={{ background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer',
            color: C.muted, padding: '5px 8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14,
            clipPath: 'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,0 100%)' }}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <p style={{ margin: 0, fontFamily: "'Space Mono',monospace", fontSize: 10,
          letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase' }}>
          // {labels[view]}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden',
          background: `linear-gradient(135deg,${C.violet},${C.accent})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {user.avatar
            ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : (user.name || 'U')[0].toUpperCase()
          }
        </div>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
          {user.name}
        </span>
      </div>
    </header>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────── */
export default function UserAreaPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<View>('explore');
  const [collapsed, setCollapsed] = useState(false);
  const [mats, setMats] = useState<MatriculaLocal[]>([]);
  const [openTrailId, setOpenTrailId] = useState<number | null>(null);

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleUpdateUser = (u: User) => updateUser(u);
  const goTrail = (id: number) => { setOpenTrailId(id); setView('myCourses'); };

  if (!user) return null;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: 'flex', height: '100vh', background: C.bg,
        fontFamily: "'Outfit',sans-serif", overflow: 'hidden', color: C.text }}>
        <Sidebar view={view} setView={setView} user={user}
          collapsed={collapsed} setCollapsed={setCollapsed}
          onLogout={handleLogout} matsCount={mats.length} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar view={view} user={user} onMenuClick={() => setCollapsed(v => !v)} sidebarOpen={!collapsed} />
          <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {view === 'explore'    && <ExploreView mats={mats} setMats={setMats} goTrail={goTrail} />}
            {view === 'myCourses'  && <MyCoursesView mats={mats} setMats={setMats} openTrailId={openTrailId} setOpenTrailId={setOpenTrailId} />}
            {view === 'profile'    && <ProfileView user={user} onUpdateUser={handleUpdateUser} />}
          </main>
        </div>
      </div>
    </>
  );
}