import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { isValidEmail, isValidCPF, formatCPF, getApiErrorMessage } from '../../utils';

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
  hint?: string;
  maxLength?: number;
  autoComplete?: string;
  required?: boolean;
}

function NeonInput({ label, type = 'text', value, onChange, error, hint, maxLength, autoComplete, required }: NeonInputProps) {
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
        {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
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
          maxLength={maxLength}
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
        <p style={{ margin: 0, fontSize: 11, fontFamily: "'Space Mono', monospace", color: '#ff3d6e', letterSpacing: '0.04em' }}>
          ▸ {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ margin: 0, fontSize: 11, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
          {hint}
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
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
    }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: isError ? '#ff3d6e' : '#00ffcc', flexShrink: 0 }}>
        {isError ? 'ERR' : ' OK'}
      </span>
      <p style={{ flex: 1, margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: isError ? '#ffaabb' : '#a0ffe0' }}>
        {message}
      </p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 16, padding: 0 }}>×</button>
    </div>
  );
}

// ─── Indicador de força de senha ───────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['', 'Fraca', 'Média', 'Boa', 'Forte'];
  const colors = ['', '#ff3d6e', '#f59e0b', '#7b5ef8', '#00ffcc'];

  return (
    <div style={{ marginTop: -10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 2,
            background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
            boxShadow: i <= score ? `0 0 6px ${colors[score]}60` : 'none',
          }} />
        ))}
      </div>
      <p style={{
        margin: 0, fontSize: 10,
        fontFamily: "'Space Mono', monospace",
        color: colors[score] || 'rgba(255,255,255,0.2)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        Força: {labels[score] || '—'}
      </p>
    </div>
  );
}

// ─── Página de Cadastro ────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    const formatted = field === 'cpf' ? formatCPF(value) : value;
    setFormData(prev => ({ ...prev, [field]: formatted }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    else if (formData.name.trim().length < 3) newErrors.name = 'Mínimo 3 caracteres';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Formato inválido';
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    else if (!isValidCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirme a senha';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''), // envia só números
        password: formData.password,
      });
      navigate('/login', {
        state: { successMessage: 'Cadastro realizado! Faça login para continuar.' },
      });
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
        padding: '24px 16px', position: 'relative', overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif",
      }}>
        <GridCanvas />

        {/* Orbs de luz */}
        <div style={{ position: 'fixed', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,94,248,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,204,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Card principal */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 500,
          background: 'rgba(13,17,23,0.95)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          padding: '36px 36px 40px',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        }}>
          {/* Linhas decorativas */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, rgba(123,94,248,0.6), transparent 50%)', zIndex: 2 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 50%, rgba(0,255,204,0.4))', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 1, background: 'linear-gradient(180deg, rgba(123,94,248,0.6), transparent 50%)', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 1, background: 'linear-gradient(180deg, transparent 50%, rgba(0,255,204,0.4))', zIndex: 2 }} />

          {/* Voltar */}
          <Link
            to="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: 24, textDecoration: 'none',
              fontFamily: "'Space Mono', monospace",
              fontSize: 10, letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#00ffcc')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)')}
          >
            ← VOLTAR AO LOGIN
          </Link>

          {/* Título */}
          <div style={{ marginBottom: 26 }}>
            <p style={{
              margin: '0 0 6px',
              fontFamily: "'Space Mono', monospace",
              fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
            }}>
              // REGISTER_MODULE
            </p>
            <h2 style={{
              margin: 0,
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 30, letterSpacing: '0.06em', color: '#e8eaf0',
            }}>
              CRIAR CONTA
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
              Preencha os dados abaixo para se registrar no sistema
            </p>
          </div>

          {apiError && <Alert type="error" message={apiError} onClose={() => setApiError('')} />}

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <NeonInput
              label="Nome Completo"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />
            <NeonInput
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <NeonInput
              label="CPF"
              value={formData.cpf}
              onChange={e => handleChange('cpf', e.target.value)}
              error={errors.cpf}
              maxLength={14}
              required
            />

            {/* Senha e confirmar lado a lado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <NeonInput
                label="Senha"
                type="password"
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                error={errors.password}
                hint="Mínimo 8 caracteres"
                required
              />
              <NeonInput
                label="Confirmar Senha"
                type="password"
                value={formData.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Força da senha */}
            <PasswordStrength password={formData.password} />

            <NeonButton type="submit" isLoading={isLoading}>
              CRIAR CONTA
            </NeonButton>
          </form>

          {/* Termos */}
          <p style={{
            textAlign: 'center', fontSize: 11,
            color: 'rgba(255,255,255,0.18)', margin: '16px 0 0',
            fontFamily: "'Outfit', sans-serif",
          }}>
            Ao criar uma conta você concorda com os{' '}
            <span style={{ color: 'rgba(123,94,248,0.6)', cursor: 'pointer' }}>
              Termos de Uso
            </span>
          </p>
        </div>

        {/* Rodapé */}
        <div style={{
          position: 'fixed', bottom: 14, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Space Mono', monospace",
          fontSize: 9, letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase',
          zIndex: 1, whiteSpace: 'nowrap',
        }}>
          GEARFORM SYSTEM — ALL RIGHTS RESERVED
        </div>
      </div>
    </>
  );
}