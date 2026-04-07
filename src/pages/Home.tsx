import { useState } from 'react'
import bgVideo from "../assets/fundo.mp4";
import reactLogo from "../assets/react.svg";
import Navbar from "../components/Navbar";
import Marquee from "../components/Marquee";
import Card from "../components/Card";
import viteLogo from '/vite.svg'
import '../App.css'


const Home = () => {
  return (
    <>
      
 
 <div className="app">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-bg"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        <Navbar />

        <div className="content">
          <section className="hero">
            <div className="hero-grid-bg"></div>
            <div className="hero-glow"></div>
            <div className="hero-glow2"></div>

            <div
              className="glow-line"
              style={{ width: "60%", top: "30%", left: "20%" }}
            ></div>

            <div
              className="glow-line"
              style={{
                width: "40%",
                top: "70%",
                left: "40%",
                animationDelay: "1.5s",
              }}
            ></div>

            <div className="hero-content">
              <div className="hero-tag">★ PLATAFORMA EDUCACIONAL DO FUTURO</div>

              <h1>
                <span className="line1">SEJA</span>
                <span className="line2">MELHOR</span>
                <span className="line3">Em tudo</span>
              </h1>

              <p>
                Cursos intensivos com instrutores de elite. Aprenda na velocidade do
                mercado. Construa o portfólio que vai mudar sua carreira.
              </p>

              <div className="hero-btns">
                <button className="btn-primary">EXPLORAR CURSOS</button>

                <button className="btn-ghost">
                  <div className="play-icon">▶</div>
                  <span>Ver Demo</span>
                </button>
              </div>
            </div>
          </section>

        </div>
        <Marquee />
        <h1 className='texto'>
          <span className="line1">TRILHAS</span>
          <span className="line2">SIMPLES</span>
          <span className="line3">FACIL DE ENTENDER</span>
        </h1>
      </div>

      <div style={{ display: "flex", gap: "20px", padding: "40px" }}>
        <Card
          titulo="Plano Básico"
          descricao="Ideal para iniciantes."
          imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ix8AhdmZs_qszA01AY15A144G5A-In4CUA&s"
          botaoTexto="Comprar"
          onClick={() => alert("Plano Básico")}
        />
        <Card
          titulo="Plano Básico"
          descricao="Ideal para iniciantes."
          imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ix8AhdmZs_qszA01AY15A144G5A-In4CUA&s"
          botaoTexto="Comprar"
          onClick={() => alert("Plano Básico")}
        />
        <Card
          titulo="Plano Básico"
          descricao="Ideal para iniciantes."
          imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ix8AhdmZs_qszA01AY15A144G5A-In4CUA&s"
          botaoTexto="Comprar"
          onClick={() => alert("Plano Básico")}
        />
        <Card
          titulo="Plano Básico"
          descricao="Ideal para iniciantes."
          imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ix8AhdmZs_qszA01AY15A144G5A-In4CUA&s"
          botaoTexto="Comprar"
          onClick={() => alert("Plano Básico")}
        />
        <Card
          titulo="Plano Básico"
          descricao="Ideal para iniciantes."
          imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ix8AhdmZs_qszA01AY15A144G5A-In4CUA&s"
          botaoTexto="Comprar"
          onClick={() => alert("Plano Básico")}
        />
        <Card
          titulo="Plano Básico"
          descricao="Ideal para iniciantes."
          imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ix8AhdmZs_qszA01AY15A144G5A-In4CUA&s"
          botaoTexto="Comprar"
          onClick={() => alert("Plano Básico")}
        />


      </div>

<section className="orbs-section">
  <div className="orbs-visual reveal">
    <div className="orb orb-1">AI</div>
    <div className="orb orb-2">CODE</div>
    <div className="orb orb-3">DESIGN</div>
    <div className="orb orb-4">DATA</div>
    <div className="orb orb-5">DEV</div>

    {/* SVG connections */}
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      opacity="0.15"
    >
      <line x1="150" y1="140" x2="270" y2="100" stroke="#00ffcc" strokeWidth="1" />
      <line x1="150" y1="140" x2="130" y2="300" stroke="#00ffcc" strokeWidth="1" />
      <line x1="270" y1="100" x2="360" y2="200" stroke="#7b5ef8" strokeWidth="1" />
      <line x1="130" y1="300" x2="360" y2="200" stroke="#ff3d6e" strokeWidth="1" />
      <line x1="360" y1="200" x2="270" y2="380" stroke="#00ffcc" strokeWidth="1" />
    </svg>
  </div>

  <div className="reveal">
     <h1 className='texto'>
          <span className="line1">PORQUE</span>
          <span className="line2">A</span>
          <span className="line3">GEARFORM</span>
        </h1>

    <ul className="features-list">
      <li className="feature-item">
        <div className="feature-icon">⚡</div>
        <div>
          <div className="feature-title">Aprenda 3x mais rápido</div>
          <div className="feature-text">
            Metodologia baseada em projetos reais. Sem teoria desnecessária, direto ao ponto que o mercado exige.
          </div>
        </div>
      </li>

      <li className="feature-item">
        <div className="feature-icon">🎯</div>
        <div>
          <div className="feature-title">Mentoria 1:1 com especialistas</div>
          <div className="feature-text">
            Sessões ao vivo com profissionais que trabalham nas maiores empresas de tech do mundo.
          </div>
        </div>
      </li>

      <li className="feature-item">
        <div className="feature-icon">🏆</div>
        <div>
          <div className="feature-title">Certificados reconhecidos</div>
          <div className="feature-text">
            Parceria com mais de 200 empresas que contratam diretamente da nossa plataforma.
          </div>
        </div>
      </li>
    </ul>
  </div>
</section>



<section className="cta-section">
  <h2 className="reveal">
    <span className="outline">COMECE</span>
    <br />
    <span className="filled">HOJE</span>
  </h2>

  <p className="reveal">
    Junte-se a 47 mil profissionais que já transformaram suas carreiras com a NEXUS.
  </p>

  <div className="email-form reveal">
    <input
      type="email"
      className="email-input"
      placeholder="seu@email.com"
    />
    <button className="email-btn">
      COMEÇAR →
    </button>
  </div>

  <p
    className="reveal"
    style={{
      fontSize: "11px",
      color: "var(--muted)",
      marginTop: "16px",
      fontFamily: "'Space Mono', monospace",
      letterSpacing: "1px",
    }}
  >
    7 dias grátis · Sem cartão · Cancele quando quiser
  </p>
</section>

{/* FOOTER */}
<footer>
  <div className="footer-logo">GEARFORM </div>
  <div className="footer-copy">
    © 2026 GEARFORM · Todos os direitos reservados
  </div>
</footer>
    </>
  );
}
    
  


export default Home;
 
 
 
 
 
 
 
 
 
 