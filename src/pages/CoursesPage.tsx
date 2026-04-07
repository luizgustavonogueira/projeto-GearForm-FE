import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/* ─── FONTS & KEYFRAMES ──────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,204,0.2); border-radius: 3px; }
  @keyframes gf-fadeup  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gf-fadein  { from { opacity:0; } to { opacity:1; } }
  @keyframes gf-slidein { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
  @keyframes gf-gridmove { 0% { transform:translateY(0); } 100% { transform:translateY(60px); } }
  @keyframes gf-pulse   { 0%,100%{opacity:0.7;transform:scale(1);} 50%{opacity:1;transform:scale(1.12);} }
  @keyframes gf-scan    { 0%{top:-20%;} 100%{top:110%;} }
  @keyframes gf-blink   { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes gf-spin    { to{transform:rotate(360deg);} }
`;

/* ─── PALETTE ─────────────────────────────────────────────────────────────── */
const C = {
  bg:      "#080a0f",
  surface: "#0d1117",
  card:    "#10141c",
  border:  "rgba(255,255,255,0.06)",
  accent:  "#00ffcc",
  pink:    "#ff3d6e",
  violet:  "#7b5ef8",
  text:    "#e8eaf0",
  muted:   "#5a6070",
};

/* ─── DADOS DOS CURSOS ───────────────────────────────────────────────────── */
const CURSOS = [
  {
    id: 1, emoji: "🐍", titulo: "Python do Zero ao Avançado",
    cat: "Programação", nivel: "Iniciante", carga: 60, preco: 97.90, modulos: 5,
    rating: 4.9, alunos: 3840,
    resumo: "Domine Python do absoluto zero até projetos reais de mercado. Você aprenderá a sintaxe da linguagem, estruturas de dados, funções, programação orientada a objetos, manipulação de arquivos e criação de scripts de automação. O curso avança para tópicos como web scraping com BeautifulSoup e Selenium, consumo de APIs REST, além de introdução a bibliotecas de dados como Pandas e NumPy. Ao final, você será capaz de automatizar tarefas repetitivas, construir ferramentas de linha de comando e desenvolver sistemas back-end básicos.",
    topicos: ["Sintaxe e fundamentos","Orientação a objetos","Web Scraping","APIs REST","Pandas & NumPy","Automação de tarefas","Projetos práticos"],
    requisitos: ["Nenhum — curso para iniciantes","Computador com acesso à internet"],
    cert: true,
  },
  {
    id: 2, emoji: "⚛️", titulo: "Dev Web com JavaScript e React",
    cat: "Programação", nivel: "Intermediário", carga: 80, preco: 127.90, modulos: 5,
    rating: 4.8, alunos: 5210,
    resumo: "A trilha mais completa de desenvolvimento web front-end disponível na plataforma. Você começa pelo HTML semântico e CSS avançado (Flexbox, Grid, animações), evolui para JavaScript moderno (ES6+, async/await, Fetch API) e mergulha no React com hooks, gerenciamento de estado, roteamento com React Router e comunicação com back-end via Axios. O módulo final cobre TypeScript aplicado ao React, boas práticas de componentização e deploy em produção com Vercel/Netlify.",
    topicos: ["HTML5 semântico","CSS avançado & animações","JavaScript ES6+","React com Hooks","React Router","TypeScript no React","Deploy em produção"],
    requisitos: ["Lógica de programação básica","Vontade de criar interfaces modernas"],
    cert: true,
  },
  {
    id: 3, emoji: "🟢", titulo: "Node.js e APIs REST",
    cat: "Programação", nivel: "Intermediário", carga: 50, preco: 97.90, modulos: 5,
    rating: 4.7, alunos: 2970,
    resumo: "Construa back-ends robustos e escaláveis com Node.js e o framework Express. O curso cobre o ciclo completo de criação de uma API REST: rotas, middlewares, validação de dados com Joi/Zod, autenticação com JWT e controle de permissões. Você aprenderá a integrar com banco de dados relacional (MySQL) e não-relacional (MongoDB), implementar paginação, upload de arquivos e tratamento de erros. O curso finaliza com testes automatizados (Jest/Supertest) e deploy no Railway ou Render.",
    topicos: ["Node.js & Express","Arquitetura REST","JWT & autenticação","MySQL & MongoDB","Upload de arquivos","Testes com Jest","Deploy em nuvem"],
    requisitos: ["JavaScript intermediário","Noções básicas de HTTP"],
    cert: true,
  },
  {
    id: 4, emoji: "🗄️", titulo: "Banco de Dados SQL e MySQL",
    cat: "Programação", nivel: "Iniciante", carga: 40, preco: 67.90, modulos: 4,
    rating: 4.6, alunos: 1820,
    resumo: "Aprenda a projetar, consultar e administrar bancos de dados relacionais com MySQL. O curso cobre modelagem entidade-relacionamento, criação de tabelas com tipos de dados corretos, chaves primárias e estrangeiras, e todas as cláusulas SQL (SELECT, JOIN, GROUP BY, HAVING, subqueries). Você também aprenderá sobre índices, views, stored procedures, triggers e estratégias de otimização de queries lentas usando EXPLAIN. Ideal para desenvolvedores e analistas de dados.",
    topicos: ["Modelagem relacional","SQL do básico ao avançado","JOINs e subqueries","Índices e performance","Views e procedures","Triggers","Backup e restauração"],
    requisitos: ["Lógica de programação básica","Nenhum conhecimento de banco de dados necessário"],
    cert: true,
  },
  {
    id: 5, emoji: "⚙️", titulo: "Intro à Eletromecânica Industrial",
    cat: "Eletromecânica", nivel: "Iniciante", carga: 45, preco: 87.90, modulos: 4,
    rating: 4.8, alunos: 1340,
    resumo: "Introdução completa à eletromecânica aplicada ao ambiente industrial. Você estudará os fundamentos da mecânica (forças, torques, transmissões por correia e engrenagem), fundamentos elétricos (tensão, corrente, potência) e a integração entre os dois campos. O curso aborda acionamentos elétricos de motores, instalação e manutenção de sistemas eletromecânicos, leitura de diagramas elétricos e noções de segurança do trabalho em ambientes industriais com alta tensão.",
    topicos: ["Fundamentos de mecânica","Fundamentos elétricos","Transmissões mecânicas","Motores elétricos básicos","Leitura de diagramas","Acionamentos","NR-10 e segurança"],
    requisitos: ["Matemática básica (ensino médio)","Interesse em área industrial"],
    cert: true,
  },
  {
    id: 6, emoji: "🔧", titulo: "Manutenção de Motores Elétricos",
    cat: "Eletromecânica", nivel: "Intermediário", carga: 35, preco: 97.90, modulos: 4,
    rating: 4.9, alunos: 980,
    resumo: "Curso especializado em diagnóstico e manutenção de motores elétricos de indução trifásicos e monofásicos. Você aprenderá a identificar defeitos por análise de corrente, temperatura e vibração, realizar desmontagem e montagem correta com ferramentas adequadas, executar o rebobinamento de estator, substituir rolamentos e vedações, além de configurar o motor corretamente após a manutenção. Inclui procedimentos de teste elétrico com megôhmetro e ponte de Wheatstone.",
    topicos: ["Diagnóstico de falhas","Desmontagem e montagem","Rebobinamento de estator","Troca de rolamentos","Testes elétricos","Análise de vibração","Documentação técnica"],
    requisitos: ["Eletromecânica básica ou curso introdutório","Noções de segurança elétrica"],
    cert: true,
  },
  {
    id: 7, emoji: "🏭", titulo: "Automação Industrial com CLP",
    cat: "Eletromecânica", nivel: "Avançado", carga: 55, preco: 147.90, modulos: 5,
    rating: 4.9, alunos: 1150,
    resumo: "Domine a programação de Controladores Lógicos Programáveis (CLPs) Siemens S7-1200/1500 com o software TIA Portal. O curso aborda as cinco linguagens IEC 61131-3 com foco em Ladder (LD) e Blocos de Função (FBD), criação de HMI com WinCC, comunicação entre CLPs via PROFIBUS e PROFINET, integração com sensores e atuadores industriais, e conceitos de SCADA. Você desenvolverá projetos reais de automação de linhas de produção simuladas.",
    topicos: ["Linguagem Ladder & FBD","TIA Portal","HMI com WinCC","PROFIBUS & PROFINET","Sensores industriais","SCADA","Projetos de automação"],
    requisitos: ["Eletromecânica intermediária","Noções de lógica digital"],
    cert: true,
  },
  {
    id: 8, emoji: "💧", titulo: "Hidráulica e Pneumática",
    cat: "Eletromecânica", nivel: "Intermediário", carga: 40, preco: 87.90, modulos: 4,
    rating: 4.7, alunos: 760,
    resumo: "Fundamentos e aplicações de circuitos hidráulicos e pneumáticos em sistemas industriais. Você aprenderá a identificar e selecionar componentes como bombas, cilindros, válvulas direcionais, de pressão e de fluxo. O curso cobre dimensionamento de circuitos, leitura e elaboração de diagramas ISO, além de manutenção preventiva e corretiva de sistemas. A parte prática inclui simulação de circuitos no software FluidSIM e resolução de estudos de caso industriais reais.",
    topicos: ["Princípios físicos (Pascal/Bernoulli)","Componentes hidráulicos","Componentes pneumáticos","Válvulas e atuadores","Dimensionamento de circuitos","FluidSIM","Manutenção de sistemas"],
    requisitos: ["Física básica","Noções de mecânica industrial"],
    cert: true,
  },
  {
    id: 9, emoji: "⚡", titulo: "Eletrônica Básica",
    cat: "Eletrônica", nivel: "Iniciante", carga: 30, preco: 57.90, modulos: 4,
    rating: 4.6, alunos: 4120,
    resumo: "O ponto de partida ideal para quem quer entender eletrônica do zero. O curso cobre os fundamentos teóricos e práticos: lei de Ohm, associação de resistores, leis de Kirchhoff, capacitores, indutores e diodos. Você aprenderá a usar o multímetro e o osciloscópio, montar circuitos em protoboard e analisar circuitos de corrente alternada e contínua. Ao final, você construirá projetos simples como fonte de alimentação regulada e alarmes com transistor.",
    topicos: ["Lei de Ohm","Resistores em série/paralelo","Capacitores e indutores","Diodos e transistores","Uso do multímetro","Circuitos AC/DC","Projetos práticos"],
    requisitos: ["Matemática básica","Nenhum conhecimento de eletrônica"],
    cert: true,
  },
  {
    id: 10, emoji: "🤖", titulo: "Arduino e IoT na Prática",
    cat: "Eletrônica", nivel: "Iniciante", carga: 40, preco: 77.90, modulos: 4,
    rating: 4.8, alunos: 3560,
    resumo: "Aprenda a criar projetos de Internet das Coisas (IoT) do zero usando Arduino e módulos de conectividade. O curso cobre a IDE Arduino, programação em C/C++ simplificada, uso de sensores (temperatura, umidade, ultrassônico, PIR), atuadores (servo, motor DC, relé), display LCD e comunicação serial. Você integrará o Arduino com módulos WiFi (ESP8266/ESP32) para enviar dados para dashboards na nuvem (Blynk, ThingSpeak) e criar automação residencial básica.",
    topicos: ["IDE Arduino e C básico","Sensores analógicos e digitais","Servo e motores","Comunicação I2C/SPI","ESP8266 & ESP32","MQTT e IoT","Automação residencial"],
    requisitos: ["Eletrônica básica (recomendado)","Lógica de programação básica"],
    cert: true,
  },
  {
    id: 11, emoji: "🔋", titulo: "Eletrônica de Potência",
    cat: "Eletrônica", nivel: "Avançado", carga: 50, preco: 127.90, modulos: 4,
    rating: 4.8, alunos: 640,
    resumo: "Curso avançado sobre conversão e controle de energia elétrica com dispositivos semicondutores de potência. Você estudará retificadores controlados (SCR, TRIAC), inversores monofásicos e trifásicos, conversores DC-DC (Buck, Boost, Buck-Boost), drivers para IGBTs e MOSFETs, e técnicas de modulação por largura de pulso (PWM). O curso cobre ainda projeto de filtros, análise térmica e proteção de circuitos de potência, com simulações no PSIM e LTspice.",
    topicos: ["Semicondutores de potência","Retificadores controlados","Inversores DC/AC","Conversores DC-DC","PWM e controle","Simulação PSIM/LTspice","Projeto de drivers"],
    requisitos: ["Eletrônica intermediária","Cálculo e equações diferenciais básicas"],
    cert: true,
  },
  {
    id: 12, emoji: "🌐", titulo: "Redes de Computadores — CCNA",
    cat: "Redes", nivel: "Iniciante", carga: 60, preco: 107.90, modulos: 5,
    rating: 4.7, alunos: 2890,
    resumo: "Preparação completa para a certificação Cisco CCNA e para atuar como administrador de redes. O curso cobre o modelo OSI e TCP/IP na prática, endereçamento IPv4/IPv6 e subnetting, configuração de roteadores e switches Cisco via CLI, protocolos de roteamento dinâmico (OSPF, EIGRP), VLANs, STP, NAT e listas de controle de acesso (ACLs). Todas as configurações são praticadas no simulador Cisco Packet Tracer com topologias realistas.",
    topicos: ["Modelo OSI e TCP/IP","IPv4/IPv6 e subnetting","Cisco IOS CLI","OSPF & EIGRP","VLANs e STP","NAT e ACLs","Packet Tracer"],
    requisitos: ["Conhecimento básico de informática","Nenhuma certificação prévia necessária"],
    cert: true,
  },
  {
    id: 13, emoji: "🛡️", titulo: "Cibersegurança e Ethical Hacking",
    cat: "Redes", nivel: "Avançado", carga: 70, preco: 147.90, modulos: 5,
    rating: 4.9, alunos: 1980,
    resumo: "Torne-se um profissional de segurança ofensiva e defensiva. O curso abrange metodologia de pentest (reconhecimento, varredura, exploração, pós-exploração, relatório), uso de ferramentas como Nmap, Metasploit, Burp Suite, Hydra, Wireshark e John the Ripper. Você aprenderá a explorar vulnerabilidades web (OWASP Top 10: SQLi, XSS, CSRF, LFI, RFI), realizar ataques de rede (ARP Poisoning, MITM), além de hardening de sistemas Linux e Windows e gestão de vulnerabilidades.",
    topicos: ["Metodologia de pentest","Kali Linux","OWASP Top 10","Metasploit & Burp Suite","Ataques de rede","Análise de malware","Relatórios de segurança"],
    requisitos: ["Redes intermediárias","Linux básico","Ética e responsabilidade profissional"],
    cert: true,
  },
  {
    id: 14, emoji: "🎨", titulo: "UI/UX Design com Figma",
    cat: "Design", nivel: "Iniciante", carga: 35, preco: 77.90, modulos: 4,
    rating: 4.8, alunos: 5640,
    resumo: "Aprenda a projetar interfaces digitais bonitas e funcionais do zero com Figma, a ferramenta padrão da indústria. O curso cobre fundamentos de UI (tipografia, cor, espaçamento, hierarquia visual), princípios de UX (pesquisa com usuário, personas, jornada do usuário, wireframes), prototipagem interativa e criação de design systems com componentes reutilizáveis e variáveis. Você construirá um portfólio com três projetos completos: app mobile, dashboard web e landing page.",
    topicos: ["Fundamentos de UI","Tipografia e cores","Pesquisa UX","Wireframes e fluxos","Prototipagem interativa","Design System","Portfólio com 3 projetos"],
    requisitos: ["Nenhum — voltado para iniciantes","Criatividade e atenção a detalhes"],
    cert: true,
  },
  {
    id: 15, emoji: "📋", titulo: "Gestão de Projetos com Scrum e Kanban",
    cat: "Gestão", nivel: "Iniciante", carga: 20, preco: 47.90, modulos: 3,
    rating: 4.7, alunos: 2310,
    resumo: "Domine as metodologias ágeis mais utilizadas no mercado de tecnologia e negócios. O curso explica os valores e princípios do Manifesto Ágil, os papéis e cerimônias do Scrum (Product Owner, Scrum Master, Sprint Planning, Daily, Review, Retrospectiva), gestão de backlog e estimativas com Planning Poker. Você também aprenderá Kanban com WIP limits, métricas de fluxo (throughput, lead time, cycle time) e usará ferramentas como Jira, Trello e Notion para gerenciar projetos reais.",
    topicos: ["Manifesto Ágil","Papéis do Scrum","Cerimônias Scrum","Product Backlog","Kanban e WIP","Métricas ágeis","Jira e Trello"],
    requisitos: ["Nenhum pré-requisito","Qualquer área de atuação"],
    cert: true,
  },
];

const CATS  = ["Todos","Programação","Eletromecânica","Eletrônica","Redes","Design","Gestão"];
const NIVEIS = ["Todos","Iniciante","Intermediário","Avançado"];
const NIVEL_COLOR: Record<string,string> = { Iniciante:C.accent, Intermediário:"#f59e0b", Avançado:C.pink };
const CAT_COLOR: Record<string,string>   = {
  Programação:C.violet, Eletromecânica:"#f59e0b", Eletrônica:C.accent,
  Redes:C.pink, Design:"#e879f9", Gestão:"#34d399",
};

/* ─── CANVAS GRID ────────────────────────────────────────────────────────── */
function GridCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number; let off = 0;
    const draw = () => {
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0,0,w,h);
      const sz = 60; off = (off + 0.12) % sz;
      ctx.strokeStyle = "rgba(0,255,204,0.025)"; ctx.lineWidth = 1;
      for(let x=-sz+(off%sz);x<w+sz;x+=sz){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=-sz+(off%sz);y<h+sz;y+=sz){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      raf = requestAnimationFrame(draw);
    };
    draw(); return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{ position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0 }}/>;
}

/* ─── ATOMS ──────────────────────────────────────────────────────────────── */
function Tag({ children, color=C.accent }: { children:React.ReactNode; color?:string }) {
  return <span style={{ display:"inline-block", padding:"2px 10px",
    fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.1em",
    color, border:`1px solid ${color}35`, background:`${color}0e`,
    textTransform:"uppercase", lineHeight:1.9, whiteSpace:"nowrap",
    clipPath:"polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,0 100%)" }}>
    {children}
  </span>;
}

function NeonBtn({ children, onClick, small, variant="primary" }: any) {
  const [hov, setHov] = useState(false);
  const color = variant==="ghost" ? "rgba(255,255,255,0.35)" : variant==="violet" ? C.violet : C.accent;
  return <button onClick={onClick}
    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{ background:hov?color:"transparent", border:`1px solid ${color}`,
      color:hov?(variant==="primary"?C.bg:"#fff"):color,
      padding:small?"7px 18px":"12px 30px",
      fontFamily:"'Space Mono',monospace", fontSize:small?10:12,
      letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer",
      transition:"all 0.2s", display:"flex", alignItems:"center", gap:7,
      clipPath:"polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px))",
      boxShadow:hov?`0 0 22px ${color}45`:"none", whiteSpace:"nowrap" }}>
    {children}
  </button>;
}

/* ─── STARS ──────────────────────────────────────────────────────────────── */
function Stars({ val }: { val:number }) {
  return <span style={{ fontSize:11, letterSpacing:1 }}>
    {[1,2,3,4,5].map(i=>(
      <span key={i} style={{ color:i<=Math.round(val)?C.accent:"rgba(255,255,255,0.15)" }}>★</span>
    ))}
  </span>;
}

/* ─── COURSE CARD ────────────────────────────────────────────────────────── */
function CourseCard({ curso, onClick }: { curso:typeof CURSOS[0]; onClick:()=>void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?"#131820":C.card,
        border:`1px solid ${hov?C.accent+"45":C.border}`,
        clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
        transition:"all 0.22s", cursor:"pointer", display:"flex", flexDirection:"column",
        boxShadow:hov?`0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${C.accent}20`:"0 4px 20px rgba(0,0,0,0.25)",
        transform:hov?"translateY(-3px)":"translateY(0)",
        animation:"gf-fadeup 0.45s ease both" }}>

      {/* Topo colorido */}
      <div style={{ height:3, background:hov
        ?`linear-gradient(90deg,${CAT_COLOR[curso.cat]||C.accent},${C.violet})`
        :"transparent", transition:"background 0.3s" }}/>

      <div style={{ padding:"22px 22px 20px", display:"flex", flexDirection:"column", gap:14, flex:1 }}>
        {/* Emoji + tags */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ width:52, height:52, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, background:`${CAT_COLOR[curso.cat]||C.accent}10`,
            border:`1px solid ${CAT_COLOR[curso.cat]||C.accent}25`,
            clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)" }}>
            {curso.emoji}
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
            <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
            <Tag color={CAT_COLOR[curso.cat]||C.accent}>{curso.cat}</Tag>
          </div>
        </div>

        {/* Título */}
        <h3 style={{ margin:0, fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:700,
          color:hov?C.text:"rgba(232,234,240,0.9)", lineHeight:1.3, transition:"color 0.2s" }}>
          {curso.titulo}
        </h3>

        {/* Resumo curto */}
        <p style={{ margin:0, fontSize:12, color:C.muted, lineHeight:1.65,
          display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {curso.resumo.slice(0,140)}...
        </p>

        {/* Meta */}
        <div style={{ display:"flex", gap:14, fontSize:11, color:C.muted, fontFamily:"'Space Mono',monospace" }}>
          <span>⏱ {curso.carga}h</span>
          <span>📚 {curso.modulos} módulos</span>
          <span style={{ color:`${C.accent}80` }}>🏆 Cert.</span>
        </div>

        {/* Rating */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Stars val={curso.rating}/>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:C.accent }}>{curso.rating}</span>
          <span style={{ fontSize:11, color:C.muted }}>({curso.alunos.toLocaleString("pt-BR")} alunos)</span>
        </div>

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"auto", paddingTop:4,
          borderTop:`1px solid ${C.border}` }}>
          <span style={{ fontFamily:"'Bebas Neue',cursive", fontSize:26, color:C.accent, letterSpacing:"0.04em",
            textShadow:hov?`0 0 16px ${C.accent}60`:"none", transition:"text-shadow 0.3s" }}>
            R$ {curso.preco.toFixed(2).replace(".",",")}
          </span>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:hov?C.accent:C.muted,
            letterSpacing:"0.08em", transition:"color 0.2s" }}>
            VER DETALHES →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── DETAIL DRAWER ──────────────────────────────────────────────────────── */
function CourseDrawer({ curso, onClose, onEnroll }: { curso:typeof CURSOS[0]; onClose:()=>void; onEnroll:()=>void }) {
  const [tab, setTab] = useState<"sobre"|"topicos"|"requisitos">("sobre");

  useEffect(() => {
    const handleKey = (e:KeyboardEvent) => { if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return ()=>document.removeEventListener("keydown", handleKey);
  },[onClose]);

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:400,
        background:"rgba(8,10,15,0.75)",backdropFilter:"blur(6px)",animation:"gf-fadein 0.25s ease" }}/>

      {/* Drawer */}
      <aside style={{ position:"fixed",top:0,right:0,bottom:0,zIndex:500,
        width:"min(600px,100vw)", background:C.surface,
        borderLeft:`1px solid ${C.border}`,overflowY:"auto",
        animation:"gf-slidein 0.32s cubic-bezier(.22,.68,0,1.2)" }}>

        {/* Top accent */}
        <div style={{ height:2,background:`linear-gradient(90deg,${CAT_COLOR[curso.cat]||C.accent},${C.violet})` }}/>

        {/* Header */}
        <div style={{ padding:"28px 32px 22px",
          borderBottom:`1px solid ${C.border}`, position:"relative" }}>

          {/* Close */}
          <button onClick={onClose} style={{ position:"absolute",top:24,right:28,
            background:"none",border:`1px solid ${C.border}`,cursor:"pointer",
            color:C.muted,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,transition:"all 0.2s",
            clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color=C.pink;(e.currentTarget as HTMLElement).style.borderColor=C.pink;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=C.muted;(e.currentTarget as HTMLElement).style.borderColor=C.border;}}>
            ✕
          </button>

          {/* Emoji + cat */}
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
            <div style={{ width:60,height:60,display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:32,background:`${CAT_COLOR[curso.cat]||C.accent}12`,
              border:`1px solid ${CAT_COLOR[curso.cat]||C.accent}30`,
              clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)" }}>
              {curso.emoji}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              <Tag color={NIVEL_COLOR[curso.nivel]}>{curso.nivel}</Tag>
              <Tag color={CAT_COLOR[curso.cat]||C.accent}>{curso.cat}</Tag>
            </div>
          </div>

          {/* Título */}
          <h2 style={{ margin:"0 0 10px",fontFamily:"'Bebas Neue',cursive",fontSize:28,
            color:C.text,letterSpacing:"0.04em",lineHeight:1.1,paddingRight:40 }}>
            {curso.titulo}
          </h2>

          {/* Stats row */}
          <div style={{ display:"flex",gap:20,flexWrap:"wrap",marginBottom:16 }}>
            {[
              {icon:"⏱",label:`${curso.carga}h de conteúdo`},
              {icon:"📚",label:`${curso.modulos} módulos`},
              {icon:"👥",label:`${curso.alunos.toLocaleString("pt-BR")} alunos`},
              {icon:"🏆",label:"Certificado incluso"},
            ].map(s=>(
              <div key={s.label} style={{ display:"flex",alignItems:"center",gap:6,
                fontFamily:"'Space Mono',monospace",fontSize:10,color:C.muted }}>
                <span>{s.icon}</span><span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <Stars val={curso.rating}/>
            <span style={{ fontFamily:"'Space Mono',monospace",fontSize:11,color:C.accent,fontWeight:700 }}>{curso.rating}</span>
            <span style={{ fontSize:12,color:C.muted }}>/ 5.0</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex",borderBottom:`1px solid ${C.border}` }}>
          {(["sobre","topicos","requisitos"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"13px 8px",
              background:tab===t?`${C.accent}0a`:"transparent",
              border:"none",borderBottom:tab===t?`2px solid ${C.accent}`:"2px solid transparent",
              cursor:"pointer",fontFamily:"'Space Mono',monospace",fontSize:10,
              letterSpacing:"0.12em",textTransform:"uppercase",
              color:tab===t?C.accent:C.muted,transition:"all 0.18s" }}>
              {t==="sobre"?"SOBRE":t==="topicos"?"O QUE APRENDE":"PRÉ-REQUISITOS"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding:"28px 32px" }}>
          {tab==="sobre" && (
            <div style={{ animation:"gf-fadeup 0.3s ease" }}>
              <p style={{ margin:"0 0 24px",fontSize:14,color:"rgba(232,234,240,0.75)",
                lineHeight:1.8,fontFamily:"'Outfit',sans-serif",fontWeight:300 }}>
                {curso.resumo}
              </p>
              {/* Destaques numéricos */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:24 }}>
                {[
                  {val:curso.carga+"h",label:"Carga Horária",color:C.accent},
                  {val:curso.modulos,label:"Módulos",color:C.violet},
                  {val:curso.alunos.toLocaleString("pt-BR"),label:"Alunos Matriculados",color:"#f59e0b"},
                  {val:curso.rating+"/5",label:"Avaliação Média",color:C.accent},
                ].map(d=>(
                  <div key={d.label} style={{ background:C.card,border:`1px solid ${C.border}`,
                    padding:"14px 16px",
                    clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)" }}>
                    <p style={{ margin:"0 0 3px",fontFamily:"'Bebas Neue',cursive",
                      fontSize:26,color:d.color,letterSpacing:"0.04em",lineHeight:1 }}>{d.val}</p>
                    <p style={{ margin:0,fontSize:10,color:C.muted,fontFamily:"'Space Mono',monospace",
                      textTransform:"uppercase",letterSpacing:"0.08em" }}>{d.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="topicos" && (
            <div style={{ display:"flex",flexDirection:"column",gap:10,animation:"gf-fadeup 0.3s ease" }}>
              <p style={{ margin:"0 0 16px",fontSize:12,color:C.muted,fontFamily:"'Space Mono',monospace",
                letterSpacing:"0.06em" }}>
                {curso.topicos.length} TÓPICOS COBERTOS NESTE CURSO
              </p>
              {curso.topicos.map((t,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:14,padding:"13px 16px",
                  background:C.card,border:`1px solid ${C.border}`,
                  clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)",
                  animation:`gf-fadeup ${0.2+i*0.06}s ease both` }}>
                  <div style={{ width:24,height:24,flexShrink:0,display:"flex",alignItems:"center",
                    justifyContent:"center",background:`${C.accent}12`,
                    border:`1px solid ${C.accent}30`,fontSize:10,
                    color:C.accent,fontFamily:"'Bebas Neue',cursive" }}>{i+1}</div>
                  <span style={{ fontSize:13,color:C.text,fontFamily:"'Outfit',sans-serif",fontWeight:500 }}>{t}</span>
                </div>
              ))}
            </div>
          )}

          {tab==="requisitos" && (
            <div style={{ animation:"gf-fadeup 0.3s ease" }}>
              <p style={{ margin:"0 0 16px",fontSize:12,color:C.muted,fontFamily:"'Space Mono',monospace",
                letterSpacing:"0.06em" }}>
                PRÉ-REQUISITOS PARA ESTE CURSO
              </p>
              {curso.requisitos.map((r,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",
                  background:C.card,border:`1px solid ${C.border}`,marginBottom:10,
                  clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)",
                  animation:`gf-fadeup ${0.2+i*0.08}s ease both` }}>
                  <span style={{ color:C.accent,fontSize:14,flexShrink:0,marginTop:1 }}>◆</span>
                  <span style={{ fontSize:13,color:"rgba(232,234,240,0.75)",
                    fontFamily:"'Outfit',sans-serif",lineHeight:1.6 }}>{r}</span>
                </div>
              ))}

              {/* Mensagem de boas-vindas se iniciante */}
              {curso.nivel==="Iniciante" && (
                <div style={{ marginTop:20,padding:"14px 18px",
                  background:`${C.accent}0a`,border:`1px solid ${C.accent}30`,
                  clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)" }}>
                  <p style={{ margin:0,fontSize:12,color:C.accent,fontFamily:"'Space Mono',monospace",
                    letterSpacing:"0.04em" }}>
                    ✓ Este curso é adequado para quem nunca teve contato com o assunto.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA fixo no fundo */}
        <div style={{ position:"sticky",bottom:0,
          background:`linear-gradient(to top,${C.surface} 70%,transparent)`,
          padding:"20px 32px 28px",display:"flex",gap:14,alignItems:"center" }}>
          <NeonBtn onClick={onEnroll}>MATRICULAR-SE — R$ {curso.preco.toFixed(2).replace(".",",")}</NeonBtn>
          <NeonBtn variant="ghost" small onClick={onClose}>FECHAR</NeonBtn>
        </div>
      </aside>
    </>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────── */
export default function CoursesPage() {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("Todos");
  const [nivel,    setNivel]    = useState("Todos");
  const [sort,     setSort]     = useState("popular");
  const [selected, setSelected] = useState<typeof CURSOS[0]|null>(null);

  // Filtro + sort
  const filtered = CURSOS
    .filter(c => {
      const ms = c.titulo.toLowerCase().includes(search.toLowerCase()) ||
                 c.cat.toLowerCase().includes(search.toLowerCase()) ||
                 c.resumo.toLowerCase().includes(search.toLowerCase());
      return ms && (cat==="Todos"||c.cat===cat) && (nivel==="Todos"||c.nivel===nivel);
    })
    .sort((a,b) => sort==="preco-asc" ? a.preco-b.preco
                 : sort==="preco-desc"? b.preco-a.preco
                 : sort==="rating"    ? b.rating-a.rating
                 : b.alunos-a.alunos);  // "popular"

  // Contagem por categoria
  const catCount = (c:string) => CURSOS.filter(x=>c==="Todos"?true:x.cat===c).length;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif",
        color:C.text, position:"relative" }}>
        <GridCanvas/>

        {/* Drawer */}
        {selected && (
          <CourseDrawer
            curso={selected}
            onClose={()=>setSelected(null)}
            onEnroll={()=>{ navigate("/login"); }}
          />
        )}

        {/* ── NAVBAR ── */}
        <Navbar />

        {/* ── HERO ── */}
        <section style={{ paddingTop:160,paddingBottom:70,paddingLeft:60,paddingRight:60,
          maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1 }}>

          {/* Glow orbs */}
          <div style={{ position:"absolute",top:-80,right:-80,width:500,height:500,borderRadius:"50%",
            background:`radial-gradient(circle,${C.violet}18 0%,transparent 70%)`,
            pointerEvents:"none",animation:"gf-pulse 8s ease-in-out infinite" }}/>
          <div style={{ position:"absolute",bottom:0,left:-60,width:380,height:380,borderRadius:"50%",
            background:`radial-gradient(circle,${C.accent}0c 0%,transparent 70%)`,
            pointerEvents:"none",animation:"gf-pulse 6s ease-in-out infinite reverse" }}/>

          <div style={{ display:"inline-flex",alignItems:"center",gap:10,
            background:`${C.accent}0c`,border:`1px solid ${C.accent}30`,
            padding:"8px 18px",marginBottom:28,
            fontFamily:"'Space Mono',monospace",fontSize:11,color:C.accent,
            letterSpacing:"0.15em",
            clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
            <span style={{ width:6,height:6,background:C.accent,borderRadius:"50%",
              animation:"gf-blink 1.5s ease-in-out infinite" }}/>
            CATÁLOGO DE CURSOS
          </div>

          <h1 style={{ margin:"0 0 18px",fontFamily:"'Bebas Neue',cursive",
            fontSize:"clamp(52px,7vw,96px)",letterSpacing:"0.04em",lineHeight:0.95 }}>
            <span style={{ display:"block",color:C.text }}>APRENDA</span>
            <span style={{ display:"block",
              background:`linear-gradient(135deg,${C.accent},${C.violet})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              COM OS MELHORES
            </span>
            <span style={{ display:"block",color:"transparent",
              WebkitTextStroke:`1px rgba(255,255,255,0.18)` }}>
              DO MERCADO
            </span>
          </h1>

          <p style={{ margin:"0 0 40px",fontSize:16,color:C.muted,lineHeight:1.75,
            maxWidth:520,fontWeight:300 }}>
            {CURSOS.length} cursos em {CATS.length-1} áreas de atuação. Certificados reconhecidos,
            trilhas estruturadas e projetos práticos do início ao fim.
          </p>

          {/* Stats */}
          <div style={{ display:"flex",gap:32,flexWrap:"wrap" }}>
            {[
              {val:`${CURSOS.length}`,label:"Cursos disponíveis",color:C.accent},
              {val:"47k+",label:"Alunos formados",color:C.violet},
              {val:"4.8★",label:"Avaliação média",color:"#f59e0b"},
              {val:"100%",label:"Certificados válidos",color:C.pink},
            ].map(s=>(
              <div key={s.label} style={{ display:"flex",flexDirection:"column",gap:2 }}>
                <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:32,color:s.color,
                  letterSpacing:"0.04em",lineHeight:1,textShadow:`0 0 16px ${s.color}50` }}>
                  {s.val}
                </span>
                <span style={{ fontFamily:"'Space Mono',monospace",fontSize:9,color:C.muted,
                  textTransform:"uppercase",letterSpacing:"0.1em" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FILTROS ── */}
        <section style={{ position:"sticky",top:80,zIndex:50,
          background:`${C.surface}f0`,backdropFilter:"blur(12px)",
          borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:1200,margin:"0 auto",padding:"14px 60px",
            display:"flex",gap:12,alignItems:"center",flexWrap:"wrap" }}>

            {/* Search */}
            <div style={{ flex:1,minWidth:220,position:"relative" }}>
              <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
                fontSize:15,color:C.muted,pointerEvents:"none" }}>⌕</span>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Buscar por nome, área ou palavra-chave..."
                style={{ width:"100%",background:"rgba(255,255,255,0.03)",
                  border:`1px solid ${C.border}`,outline:"none",
                  padding:"9px 12px 9px 36px",color:C.text,fontSize:13,
                  fontFamily:"'Outfit',sans-serif",transition:"border-color 0.2s",
                  clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)" }}
                onFocus={e=>(e.currentTarget.style.borderColor=C.accent)}
                onBlur={e=>(e.currentTarget.style.borderColor=C.border)}/>
            </div>

            {/* Selects */}
            {[
              {val:cat,set:setCat,opts:CATS,label:"Categoria"},
              {val:nivel,set:setNivel,opts:NIVEIS,label:"Nível"},
              {val:sort,set:setSort,opts:["popular","rating","preco-asc","preco-desc"],
               labels:["Mais populares","Melhor avaliados","Menor preço","Maior preço"],label:"Ordenar"},
            ].map((s,i)=>(
              <select key={i} value={s.val} onChange={e=>s.set(e.target.value)} style={{
                background:C.card,border:`1px solid ${C.border}`,color:C.text,
                padding:"9px 14px",fontSize:12,fontFamily:"'Outfit',sans-serif",
                outline:"none",cursor:"pointer",minWidth:140,
                clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)" }}>
                {"labels" in s
                  ? s.opts.map((o,j)=><option key={o} value={o}>{(s as any).labels[j]}</option>)
                  : s.opts.map(o=><option key={o}>{o}</option>)}
              </select>
            ))}

            {/* Contagem */}
            <span style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:C.muted,
              whiteSpace:"nowrap",letterSpacing:"0.06em" }}>
              {filtered.length} resultado{filtered.length!==1?"s":""}
            </span>
          </div>
        </section>

        {/* ── CATEGORIAS PILLS ── */}
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"22px 60px 0",
          display:"flex",gap:10,flexWrap:"wrap",position:"relative",zIndex:1 }}>
          {CATS.map(c=>{
            const active = cat===c;
            return (
              <button key={c} onClick={()=>setCat(c)} style={{
                background:active?`${CAT_COLOR[c]||C.accent}18`:"rgba(255,255,255,0.03)",
                border:`1px solid ${active?CAT_COLOR[c]||C.accent:C.border}`,
                color:active?CAT_COLOR[c]||C.accent:C.muted,
                padding:"7px 16px",fontFamily:"'Space Mono',monospace",fontSize:10,
                letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",
                transition:"all 0.18s",
                clipPath:"polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)",
                boxShadow:active?`0 0 14px ${CAT_COLOR[c]||C.accent}30`:"none" }}>
                {c} <span style={{ opacity:0.5 }}>({catCount(c)})</span>
              </button>
            );
          })}
        </div>

        {/* ── GRID ── */}
        <main style={{ maxWidth:1200,margin:"0 auto",padding:"28px 60px 80px",
          position:"relative",zIndex:1 }}>
          {filtered.length===0 ? (
            <div style={{ textAlign:"center",padding:"80px 0",animation:"gf-fadeup 0.4s ease" }}>
              <div style={{ fontSize:52,marginBottom:16 }}>🔍</div>
              <h3 style={{ fontFamily:"'Bebas Neue',cursive",fontSize:28,color:C.muted,
                letterSpacing:"0.06em",margin:"0 0 8px" }}>NENHUM CURSO ENCONTRADO</h3>
              <p style={{ fontSize:13,color:C.muted,fontFamily:"'Space Mono',monospace" }}>
                Tente outros filtros ou palavras-chave.
              </p>
              <button onClick={()=>{setSearch("");setCat("Todos");setNivel("Todos");}} style={{
                marginTop:20,background:"none",border:`1px solid ${C.accent}`,color:C.accent,
                padding:"9px 22px",fontFamily:"'Space Mono',monospace",fontSize:11,
                letterSpacing:"0.1em",cursor:"pointer",textTransform:"uppercase",
                clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
                LIMPAR FILTROS
              </button>
            </div>
          ) : (
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18 }}>
              {filtered.map((curso,i)=>(
                <div key={curso.id} style={{ animationDelay:`${i*0.04}s` }}>
                  <CourseCard curso={curso} onClick={()=>setSelected(curso)}/>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:`1px solid ${C.border}`,padding:"40px 60px",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1 }}>
          <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:"0.06em",color:C.text }}>
            GEAR<span style={{ color:C.accent }}>FORM</span>
          </span>
          <span style={{ fontFamily:"'Space Mono',monospace",fontSize:9,color:C.muted,
            letterSpacing:"0.15em",textTransform:"uppercase" }}>
            © 2026 GearForm · Todos os direitos reservados
          </span>
        </footer>
      </div>
    </>
  );
}