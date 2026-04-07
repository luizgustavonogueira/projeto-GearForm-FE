import React from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Links da navbar com seus respectivos caminhos de rota
  const links: { label: string; to: string }[] = [
    { label: "Home",        to: "/"        },
    { label: "Cursos",      to: "/cursos"  },
    { label: "Trilhas",     to: "/trilhas"        },
    
   
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" style={{ textDecoration: "none" }}>
        GEAR<span>FORM</span>
      </Link>

      {/* Links */}
      <ul className="nav-links">
        {links.map(({ label, to }) => {
          // Marca o link ativo baseado na rota atual
          const isActive = to !== "#" && location.pathname === to;

          return (
            <li key={label}>
              {to === "#" ? (
                // Links ainda sem página: mantém como âncora desabilitada
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ opacity: 0.5, cursor: "default" }}
                >
                  {label}
                </a>
              ) : (
                // Links com rota: usa Link do React Router
                <Link
                  to={to}
                  style={{
                    color: isActive ? "#00ffcc" : undefined,
                    textShadow: isActive
                      ? "0 0 8px #00ffcc, 0 0 16px #00ffcc60"
                      : undefined,
                  }}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Botão entrar */}
      <button className="nav-btn" onClick={() => navigate("/login")}>
        ENTRAR
      </button>
    </nav>
  );
};

export default Navbar;