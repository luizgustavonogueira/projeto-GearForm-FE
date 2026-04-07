// src/pages/users/DashboardPage.tsx
import { useAuth } from "../../contexts/AuthContext";
import { AppLayout, PageHeader } from "../../components/layout";
import { Card } from "../../components/ui";
import { Link } from "react-router-dom";

const menuCards = [
  { title: "Usuários",   description: "Gerencie os usuários do sistema", icon: "👥", href: "/users",      color: "bg-blue-50 border-blue-200"   },
  { title: "Produtos",   description: "Cadastre e edite produtos",       icon: "📦", href: "/products",   color: "bg-green-50 border-green-200"  },
  { title: "Categorias", description: "Organize por categorias",         icon: "🏷️", href: "/categories", color: "bg-purple-50 border-purple-200"},
  { title: "Meu Perfil", description: "Edite suas informações",          icon: "👤", href: "/profile",    color: "bg-orange-50 border-orange-200"},
];

export default function DashboardPage() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <AppLayout>
      <PageHeader
        // ← corrigido: user?.nome em vez de user?.name
        title={`${greeting}, ${user?.nome?.split(" ")[0]}! 👋`}
        subtitle="Bem-vindo ao sistema de gestão. Escolha uma opção abaixo."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuCards.map((card) => (
          <Link key={card.href} to={card.href}>
            <Card className={`p-5 border hover:shadow-md transition-all cursor-pointer ${card.color}`}>
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h3 className="font-semibold text-gray-900 mb-1">Suas informações</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Nome</p>
            {/* ← corrigido: user?.nome em vez de user?.name */}
            <p className="text-sm text-gray-700 mt-0.5">{user?.nome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">E-mail</p>
            <p className="text-sm text-gray-700 mt-0.5">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Perfil</p>
            <p className="text-sm text-gray-700 mt-0.5">{user?.role || "Usuário"}</p>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}