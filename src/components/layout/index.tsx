// src/components/layout/index.tsx
import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',  icon: '🏠' },
  { href: '/users',      label: 'Usuários',   icon: '👥' },
  { href: '/products',   label: 'Produtos',   icon: '📦' },
  { href: '/categories', label: 'Categorias', icon: '🏷️' },
  { href: '/profile',    label: 'Meu Perfil', icon: '👤' },
];

function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`
      fixed top-0 left-0 h-full bg-gray-900 text-white z-40 transition-all duration-300
      ${isOpen ? 'w-64' : 'w-16'}
    `}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
          G
        </div>
        {isOpen && <span className="font-semibold text-sm">GearForm</span>}
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
                ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        {isOpen && (
          <div className="mb-3">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors w-full"
        >
          <span>🚪</span>
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ onMenuClick, isSidebarOpen }: { onMenuClick: () => void; isSidebarOpen: boolean }) {
  const location = useLocation();
  const { user } = useAuth();

  const pageTitle =
    navItems.find((n) => location.pathname.startsWith(n.href))?.label || 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <h1 className="font-semibold text-gray-800">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Topbar onMenuClick={() => setSidebarOpen(p => !p)} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
            G
          </div>
          <p className="text-gray-500 text-sm">GearForm</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-500 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}