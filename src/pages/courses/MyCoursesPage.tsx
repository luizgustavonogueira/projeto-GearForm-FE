// src/pages/courses/MyCoursesPage.tsx
import { useState } from 'react';
import type { Matricula } from '../../types';
import { CURSOS_DATA, NIVEL_COLOR, MOD_TITLES, type CursoData, type MatriculaLocal } from '../../types/cursos';

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

function ProgressBar({ value, color = C.accent }: { value: number; color?: string }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, transition: 'width 0.6s ease', boxShadow: `0 0 8px ${color}80` }} />
    </div>
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
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
        boxShadow: hov && !disabled ? `0 0 16px ${color}40` : 'none',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
    >{children}</button>
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
  const modulos = Array.from({ length: curso.modulos }, (_, i) => ({
    idx: i,
    titulo: MOD_TITLES[i] || `Módulo ${i + 1}`,
  }));

  const toggleModulo = (idx: number) => {
    const feitos: number[] = mat.modulos_feitos || [];
    const novoFeitos = feitos.includes(idx)
      ? feitos.filter(f => f !== idx)
      : [...feitos, idx];
    const progresso = Math.round((novoFeitos.length / curso.modulos) * 100);
    onUpdateMat({ ...mat, modulos_feitos: novoFeitos, progresso, status: progresso === 100 ? 'concluido' : 'ativo' });
  };

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease', maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', color: C.muted,
            fontFamily: "'Space Mono',monospace", fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            cursor: 'pointer', padding: 0, marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← VOLTAR
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>{curso.emoji}</span>
          <div>
            <p style={{ margin: '0 0 4px', fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
              // TRILHA DO CURSO
            </p>
            <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',cursive", fontSize: 28, color: C.text, letterSpacing: '0.05em' }}>
              {curso.titulo}
            </h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
          <Tag color={C.muted}>{curso.carga}h</Tag>
          {mat.progresso === 100 && <Tag color={C.accent}>✓ Concluído</Tag>}
        </div>
        <ProgressBar value={mat.progresso} color={mat.progresso === 100 ? C.accent : C.violet} />
        <p style={{ margin: '6px 0 0', fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {mat.progresso}% concluído · {(mat.modulos_feitos || []).length}/{curso.modulos} módulos
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {modulos.map(({ idx, titulo }) => {
          const feito = (mat.modulos_feitos || []).includes(idx);
          return (
            <ClipCard key={idx} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  onClick={() => toggleModulo(idx)}
                  style={{
                    width: 22, height: 22, borderRadius: 2, flexShrink: 0,
                    border: `1px solid ${feito ? C.accent : 'rgba(255,255,255,0.15)'}`,
                    background: feito ? `${C.accent}20` : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', color: C.accent, fontSize: 12,
                  }}
                >
                  {feito && '✓'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0, fontSize: 13, fontWeight: 600,
                    color: feito ? C.muted : C.text,
                    textDecoration: feito ? 'line-through' : 'none',
                    transition: 'color 0.2s',
                  }}>
                    {titulo}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.muted }}>
                    Módulo {idx + 1} de {curso.modulos}
                  </p>
                </div>
                {feito && <Tag color={C.accent}>✓ feito</Tag>}
              </div>
            </ClipCard>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MY COURSES PAGE ────────────────────────────────────────────────────── */
interface MyCoursesPageProps {
  matriculas: Matricula[];
  setMatriculas: React.Dispatch<React.SetStateAction<Matricula[]>>;
  activeCurso: number | null;
  setActiveCurso: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function MyCoursesPage({ matriculas, setMatriculas, activeCurso, setActiveCurso }: MyCoursesPageProps) {
  const [trailCurso, setTrailCurso] = useState<CursoData | null>(null);

  // Abre trilha se vier do Explorar
  if (activeCurso !== null && !trailCurso) {
    const c = CURSOS_DATA.find(x => x.id === activeCurso);
    if (c) { setTrailCurso(c); setActiveCurso(null); }
  }

  const updateMat = (newMat: MatriculaLocal) => {
    setMatriculas(prev => prev.map(m =>
      m.cursoId === newMat.cursoId ? { ...m, ...newMat } : m
    ));
  };

  if (trailCurso) {
    const mat = matriculas.find(m => m.cursoId === trailCurso.id)!;
    const localMat: MatriculaLocal = {
      cursoId: mat.cursoId,
      progresso: mat.progresso,
      status: mat.status === 'concluido' ? 'concluido' : 'ativo',
      modulos_feitos: mat.modulos_feitos,
    };
    return <TrailPage curso={trailCurso} mat={localMat} onUpdateMat={updateMat} onBack={() => setTrailCurso(null)} />;
  }

  const stats = [
    { label: 'Matrículas',    val: matriculas.length,                                                      color: C.accent  },
    { label: 'Em andamento',  val: matriculas.filter(m => m.status === 'ativo' && m.progresso < 100).length, color: C.violet  },
    { label: 'Concluídos',    val: matriculas.filter(m => m.progresso === 100).length,                     color: '#f59e0b' },
  ];

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
          // MINHA JORNADA
        </p>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',cursive", fontSize: 36, color: C.text, letterSpacing: '0.05em' }}>
          MEUS CURSOS
        </h1>
      </div>

      {matriculas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ color: C.muted, fontSize: 14 }}>Você ainda não está matriculado em nenhum curso.</p>
          <p style={{ color: `${C.accent}80`, fontSize: 13, fontFamily: "'Space Mono',monospace" }}>
            Vá para Explorar e encontre seu próximo aprendizado.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 28 }}>
            {stats.map(s => (
              <ClipCard key={s.label} style={{ padding: '14px 16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontFamily: "'Bebas Neue',cursive", fontSize: 32, color: s.color, letterSpacing: '0.05em', lineHeight: 1 }}>{s.val}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
              </ClipCard>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {matriculas.map(mat => {
              const curso = CURSOS_DATA.find(c => c.id === mat.cursoId);
              if (!curso) return null;
              const done = mat.progresso === 100;
              return (
                <ClipCard key={mat.cursoId} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }} onClick={() => setTrailCurso(curso)}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 24, lineHeight: 1 }}>{curso.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {curso.titulo}
                      </h3>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
                        {done && <Tag color={C.accent}>✓ Concluído</Tag>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 10, fontFamily: "'Space Mono',monospace", color: C.muted }}>
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