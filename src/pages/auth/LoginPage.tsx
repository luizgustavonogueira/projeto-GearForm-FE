import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, getApiErrorMessage } from '../../utils';

// ─── Canvas de grid animado ────────────────────────────────────────────────
function GridCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let offset = 0;

    const draw = () => {
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, w, h);
      const size = 44;
      offset = (offset + 0.15) % size;
      ctx.strokeStyle = 'rgba(0,255,204,0.04)';
      ctx.lineWidth = 1;
      for (let x = -size + (offset % size); x < w + size; x += size) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = -size + (offset % size); y < h + size; y += size) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      const scanY = ((Date.now() / 18) % (h + 200)) - 100;
      const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      grad.addColorStop(0, 'rgba(0,255,204,0)');
      grad.addColorStop(0.5, 'rgba(0,255,204,0.03)');
      grad.addColorStop(1, 'rgba(0,255,204,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 60, w, 120);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

// ─── Input neon com cantos cortados ────────────────────────────────────────
interface NeonInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}

function NeonInput({ label, type = 'text', value, onChange, error, autoComplete, required }: NeonInputProps) {

  
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === 'password';
  const inputType = isPwd ? (showPwd ? 'text' : 'password') : type;
  const accent = error ? '#ff3d6e' : focused ? '#00ffcc' : 'rgba(255,255,255,0.12)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10, letterSpacing: '0.18em',
        color: error ? '#ff3d6e' : focused ? '#00ffcc' : 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase', transition: 'color 0.2s',
      }}>
        {label}{required && ' *'}
      </label>
      <div style={{ position: 'relative' }}>
        {/* Corner clips */}
        {(['tl','tr','bl','br'] as const).map(pos => (
          <div key={pos} style={{
            position: 'absolute', width: 8, height: 8,
            ...(pos === 'tl' ? { top: 0, left: 0, borderTop: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` } : {}),
            ...(pos === 'tr' ? { top: 0, right: 0, borderTop: `1px solid ${accent}`, borderRight: `1px solid ${accent}` } : {}),
            ...(pos === 'bl' ? { bottom: 0, left: 0, borderBottom: `1px solid ${accent}`, borderLeft: `1px solid ${accent}` } : {}),
            ...(pos === 'br' ? { bottom: 0, right: 0, borderBottom: `1px solid ${accent}`, borderRight: `1px solid ${accent}` } : {}),
            transition: 'border-color 0.2s', zIndex: 2,
          }} />
        ))}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          style={{
            display: 'block', width: '100%',
            background: focused ? 'rgba(0,255,204,0.03)' : 'rgba(255,255,255,0.02)',
            border: 'none',
            borderLeft: `1px solid ${accent}`,
            borderRight: `1px solid ${accent}`,
            outline: 'none',
            padding: '11px 14px',
            paddingRight: isPwd ? 42 : 14,
            color: '#e8eaf0',
            fontSize: 14,
            fontFamily: "'Outfit', sans-serif",
            boxSizing: 'border-box',
            transition: 'background 0.2s',
          }}
        />
        {focused && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            boxShadow: error ? '0 0 8px rgba(255,61,110,0.5)' : '0 0 12px rgba(0,255,204,0.4)',
          }} />
        )}
        {isPwd && (
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: showPwd ? '#00ffcc' : 'rgba(255,255,255,0.3)',
              padding: 0, lineHeight: 0, display: 'flex',
            }}
          >
            {showPwd ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p style={{
          margin: 0, fontSize: 11,
          fontFamily: "'Space Mono', monospace",
          color: '#ff3d6e', letterSpacing: '0.04em',
        }}>
          ▸ {error}
        </p>
      )}
    </div>
  );
}

// ─── Botão neon ────────────────────────────────────────────────────────────
function NeonButton({
  children, type = 'button', isLoading, onClick,
}: {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  isLoading?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '13px 0',
        background: hov && !isLoading ? '#00ffcc' : 'transparent',
        border: '1px solid #00ffcc',
        color: hov && !isLoading ? '#080a0f' : '#00ffcc',
        fontSize: 13,
        fontFamily: "'Space Mono', monospace",
        letterSpacing: '0.15em', textTransform: 'uppercase',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', opacity: isLoading ? 0.6 : 1,
        boxShadow: hov && !isLoading
          ? '0 0 20px rgba(0,255,204,0.35), inset 0 0 20px rgba(0,255,204,0.1)'
          : 'none',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      {isLoading ? (
        <>
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ animation: 'gf-spin 0.7s linear infinite' }}
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          PROCESSANDO...
        </>
      ) : children}
    </button>
  );
}

// ─── Alerta ────────────────────────────────────────────────────────────────
function Alert({ type, message, onClose }: { type: 'error' | 'success'; message: string; onClose: () => void }) {
  const isError = type === 'error';
  return (
    <div style={{
      padding: '10px 14px',
      background: isError ? 'rgba(255,61,110,0.08)' : 'rgba(0,255,204,0.07)',
      border: `1px solid ${isError ? 'rgba(255,61,110,0.35)' : 'rgba(0,255,204,0.3)'}`,
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 20,
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
    }}>
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: 11,
        color: isError ? '#ff3d6e' : '#00ffcc', flexShrink: 0, letterSpacing: '0.05em',
      }}>
        {isError ? 'ERR' : ' OK'}
      </span>
      <p style={{
        flex: 1, margin: 0,
        fontFamily: "'Outfit', sans-serif", fontSize: 13,
        color: isError ? '#ffaabb' : '#a0ffe0',
      }}>
        {message}
      </p>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.3)', fontSize: 16, padding: 0,
      }}>×</button>
    </div>
  );
}

// ─── Página de Login ───────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mensagem de sucesso vinda do cadastro
  useEffect(() => {
    const state = location.state as { successMessage?: string } | null;
    if (state?.successMessage) {
      setSuccessMsg(state.successMessage);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Formato inválido';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&family=Space+Mono:wght@400;700&display=swap');
        @keyframes gf-spin { to { transform: rotate(360deg); } }
        @keyframes gf-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #00ffcc; }
          50% { opacity: 0.5; box-shadow: 0 0 3px #00ffcc; }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #e8eaf0 !important;
          -webkit-box-shadow: 0 0 0 1000px #0d1117 inset !important;
          transition: background-color 9999s;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#080a0f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, position: 'relative', overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif",
      }}>
        <GridCanvas />

        {/* Orbs de luz de fundo */}
        <div style={{ position: 'fixed', top: '15%', left: '8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,204,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '10%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,94,248,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Card principal */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 460,
          background: 'rgba(13,17,23,0.95)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          padding: '40px 36px',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        }}>

          {/* Linhas de borda decorativas */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, #00ffcc, transparent 50%)', zIndex: 2 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 50%, rgba(123,94,248,0.5))', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 1, background: 'linear-gradient(180deg, #00ffcc, transparent 50%)', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 1, background: 'linear-gradient(180deg, transparent 50%, rgba(123,94,248,0.5))', zIndex: 2 }} />

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, marginBottom: 12, position: 'relative',
            }}>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <polygon points="26,2 48,14 48,38 26,50 4,38 4,14" stroke="#00ffcc" strokeWidth="1.5" fill="rgba(0,255,204,0.06)" />
                <polygon points="26,10 40,18 40,34 26,42 12,34 12,18" stroke="rgba(0,255,204,0.25)" strokeWidth="1" fill="none" />
                <text x="26" y="31" textAnchor="middle" fill="#00ffcc" fontSize="14" fontFamily="'Bebas Neue', cursive" letterSpacing="1">GF</text>
              </svg>
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 28, letterSpacing: '0.08em',
              color: '#00ffcc',
              textShadow: '0 0 20px rgba(0,255,204,0.5), 2px 0 0 rgba(255,61,110,0.25), -2px 0 0 rgba(123,94,248,0.25)',
              lineHeight: 1,
            }}>
              GearForm
            </div>
            <p style={{
              margin: '4px 0 0',
              fontFamily: "'Space Mono', monospace",
              fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
            }}>
              Sistema de Gestão
            </p>
          </div>

          {/* Título */}
          <div style={{ marginBottom: 24 }}>
            <p style={{
              margin: '0 0 6px',
              fontFamily: "'Space Mono', monospace",
              fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
            }}>
              // AUTH_MODULE
            </p>
            <h2 style={{
              margin: 0,
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 30, letterSpacing: '0.06em',
              color: '#e8eaf0',
            }}>
              BEM-VINDO DE VOLTA
            </h2>
            <p style={{
              margin: '4px 0 0', fontSize: 13,
              color: 'rgba(255,255,255,0.3)', lineHeight: 1.5,
            }}>
              Insira suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Alertas */}
          {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
          {apiError && <Alert type="error" message={apiError} onClose={() => setApiError('')} />}

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <NeonInput
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />
            <NeonInput
              label="Senha"
              type="password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6 }}>
              <button
                type="button"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10, letterSpacing: '0.1em',
                  color: 'rgba(0,255,204,0.45)', textTransform: 'uppercase', padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00ffcc')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,255,204,0.45)')}
              >
                RECUPERAR SENHA
              </button>
            </div>

            <NeonButton type="submit" isLoading={isLoading}>
              ACESSAR SISTEMA
            </NeonButton>
          </form>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Link cadastro */}
          <p style={{
            textAlign: 'center', fontSize: 13,
            color: 'rgba(255,255,255,0.3)', margin: 0,
          }}>
            Sem conta?{' '}
            <Link
              to="/register"
              style={{
                color: '#00ffcc',
                fontFamily: "'Space Mono', monospace",
                fontSize: 12, fontWeight: 700,
                textDecoration: 'none',
                textShadow: '0 0 10px rgba(0,255,204,0.4)',
              }}
              onMouseEnter={e => ((e.target as HTMLElement).style.textShadow = '0 0 18px rgba(0,255,204,0.8)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.textShadow = '0 0 10px rgba(0,255,204,0.4)')}
            >
              REGISTRAR →
            </Link>
          </p>
        </div>

        {/* Rodapé */}
        <div style={{
          position: 'fixed', bottom: 14, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Space Mono', monospace",
          fontSize: 9, letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase', zIndex: 1,
          whiteSpace: 'nowrap',
        }}>
          GEARFORM SYSTEM — ALL RIGHTS RESERVED
        </div>
      </div>
    </>
  );
}