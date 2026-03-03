import React from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        GEAR<span>FORM</span>
      </div>

      <ul className="nav-links">
        <li><a href="#">Cursos</a></li>
        <li><a href="#">Trilhas</a></li>
        <li><a href="#">Instrutores</a></li>
        <li><a href="#">Blog</a></li>
      </ul>

      <button className="nav-btn">ENTRAR</button>
    </nav>
  );
};

export default Navbar;