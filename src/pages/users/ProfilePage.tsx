// src/pages/users/ProfilePage.tsx
import { useState, useRef } from 'react';
import type { User } from '../../types';

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

interface ClipCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function ClipCard({ children, style = {} }: ClipCardProps) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
      ...style,
    }}>{children}</div>
  );
}

interface NeonBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
}

function NeonBtn({ children, onClick, small }: NeonBtnProps) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.accent : 'transparent',
        border: `1px solid ${C.accent}`,
        color: hov ? C.bg : C.accent,
        padding: small ? '6px 14px' : '10px 22px',
        fontFamily: "'Space Mono',monospace", fontSize: small ? 10 : 12,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.18s',
        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
        boxShadow: hov ? `0 0 16px ${C.accent}40` : 'none',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
    >{children}</button>
  );
}

interface NeonInputProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

function NeonInput({ label, value, onChange, type = 'text', error, hint, disabled }: NeonInputProps) {
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

interface ProfilePageProps {
  user: User;
  onUpdateUser: (u: User) => void;
}

export default function ProfilePage({ user, onUpdateUser }: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<string>(user.avatar || '');

  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Foto máxima: 2 MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())             e.name    = 'Nome é obrigatório';
    else if (name.trim().length < 3) e.name = 'Mínimo 3 caracteres';
    if (newPwd) {
      if (!oldPwd)                e.oldPwd  = 'Informe a senha atual';
      if (newPwd.length < 8)      e.newPwd  = 'Mínimo 8 caracteres';
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
    ? [newPwd.length >= 8, /[A-Z]/.test(newPwd), /[0-9]/.test(newPwd), /[^A-Za-z0-9]/.test(newPwd)]
        .filter(Boolean).length
    : 0;
  const pwdColors = ['', '#ff3d6e', '#f59e0b', C.violet, C.accent];
  const pwdLabels = ['', 'Fraca', 'Média', 'Boa', 'Forte'];

  return (
    <div style={{ padding: 28, animation: 'gf-fadeup 0.35s ease', maxWidth: 600 }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: '0 0 4px', fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
          // CONFIGURAÇÕES
        </p>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',cursive", fontSize: 36,
          color: C.text, letterSpacing: '0.05em' }}>
          MEU PERFIL
        </h1>
      </div>

      {/* Avatar */}
      <ClipCard style={{ padding: 20, marginBottom: 20 }}>
        <p style={{ margin: '0 0 14px', fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase' }}>
          FOTO DE PERFIL
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
              border: `2px solid ${C.accent}40`, overflow: 'hidden', position: 'relative',
              background: `linear-gradient(135deg,${C.violet},${C.accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {preview
              ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, color: '#fff' }}>
                  {user.name[0]?.toUpperCase()}
                </span>
            }
            <div
              style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s', fontSize: 18,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
            >📷</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
          <div>
            <NeonBtn small onClick={() => fileRef.current?.click()}>ALTERAR FOTO</NeonBtn>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: C.muted, fontFamily: "'Space Mono',monospace" }}>
              JPG, PNG • Máx. 2 MB
            </p>
          </div>
        </div>
      </ClipCard>

      {/* Informações pessoais */}
      <ClipCard style={{ padding: 20, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase' }}>
          INFORMAÇÕES PESSOAIS
        </p>
        <NeonInput
          label="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <NeonInput
          label="E-mail (não editável)"
          value={user.email}
          disabled
          hint="O e-mail não pode ser alterado pelo usuário."
        />
        <NeonInput
          label="CPF"
          value={user.cpf}
          disabled
          hint="Para alterar o CPF, entre em contato com o suporte."
        />
      </ClipCard>

      {/* Alterar senha */}
      <ClipCard style={{ padding: 20, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase' }}>
          ALTERAR SENHA
        </p>
        <NeonInput label="Senha Atual" type="password" value={oldPwd}
          onChange={(e) => setOldPwd(e.target.value)} error={errors.oldPwd} />
        <NeonInput label="Nova Senha" type="password" value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)} error={errors.newPwd}
          hint="Mínimo 8 caracteres, letra maiúscula e número" />
        {newPwd && (
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 2,
                  background: i <= pwdScore ? pwdColors[pwdScore] : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                }} />
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <NeonBtn onClick={save}>SALVAR ALTERAÇÕES</NeonBtn>
        {saved && (
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: 11,
            color: C.accent, letterSpacing: '0.08em', animation: 'gf-fadeup 0.3s ease',
          }}>
            ✓ SALVO COM SUCESSO
          </span>
        )}
      </div>
    </div>
  );
}