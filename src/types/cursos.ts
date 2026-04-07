// src/types/cursos.ts
// Tipos compartilhados entre ExplorePage, MyCoursesPage e UserAreaPage

export interface CursoData {
  id: number;
  titulo: string;
  categoria: string;
  nivel: string;
  carga: number;
  preco: number;
  cert: boolean;
  modulos: number;
  emoji: string;
  descricao: string;
}

export interface MatriculaLocal {
  cursoId: number;
  progresso: number;
  status: 'ativo' | 'concluido';
  modulos_feitos: number[];
}

export const CURSOS_DATA: CursoData[] = [
  { id:1,  titulo:'Python do Zero ao Avançado',            categoria:'Programação',    nivel:'Iniciante',     carga:60,  preco:97.90,  cert:true, modulos:5, emoji:'🐍', descricao:'Aprenda Python desde a sintaxe básica até projetos com automação, web scraping e APIs REST.' },
  { id:2,  titulo:'Dev Web com JavaScript e React',        categoria:'Programação',    nivel:'Intermediário', carga:80,  preco:127.90, cert:true, modulos:5, emoji:'⚛️', descricao:'Domine HTML, CSS, JavaScript moderno e construa interfaces com React e TypeScript.' },
  { id:3,  titulo:'Node.js e APIs REST',                   categoria:'Programação',    nivel:'Intermediário', carga:50,  preco:97.90,  cert:true, modulos:5, emoji:'🟢', descricao:'Construa back-ends robustos com Node.js, Express, JWT e boas práticas de arquitetura.' },
  { id:4,  titulo:'Banco de Dados SQL e MySQL',            categoria:'Programação',    nivel:'Iniciante',     carga:40,  preco:67.90,  cert:true, modulos:4, emoji:'🗄️', descricao:'Modelagem relacional, consultas avançadas, procedures e otimização de queries.' },
  { id:5,  titulo:'Intro à Eletromecânica Industrial',     categoria:'Eletromecânica', nivel:'Iniciante',     carga:45,  preco:87.90,  cert:true, modulos:4, emoji:'⚙️', descricao:'Mecânica aplicada, acionamentos elétricos, motores e manutenção preventiva.' },
  { id:6,  titulo:'Manutenção de Motores Elétricos',       categoria:'Eletromecânica', nivel:'Intermediário', carga:35,  preco:97.90,  cert:true, modulos:4, emoji:'🔧', descricao:'Diagnóstico, desmontagem, rebobinamento e manutenção de motores trifásicos.' },
  { id:7,  titulo:'Automação Industrial com CLP',          categoria:'Eletromecânica', nivel:'Avançado',      carga:55,  preco:147.90, cert:true, modulos:5, emoji:'🏭', descricao:'Programação de CLPs Siemens, linguagem Ladder, SCADA e integração com sensores.' },
  { id:8,  titulo:'Hidráulica e Pneumática',               categoria:'Eletromecânica', nivel:'Intermediário', carga:40,  preco:87.90,  cert:true, modulos:4, emoji:'💧', descricao:'Circuitos hidráulicos, válvulas, atuadores pneumáticos e dimensionamento.' },
  { id:9,  titulo:'Eletrônica Básica',                     categoria:'Eletrônica',     nivel:'Iniciante',     carga:30,  preco:57.90,  cert:true, modulos:4, emoji:'⚡', descricao:'Componentes eletrônicos, lei de Ohm, circuitos RC e RL e uso do multímetro.' },
  { id:10, titulo:'Arduino e IoT na Prática',              categoria:'Eletrônica',     nivel:'Iniciante',     carga:40,  preco:77.90,  cert:true, modulos:4, emoji:'🤖', descricao:'Programe o Arduino, sensores, relés e módulos WiFi para projetos IoT.' },
  { id:11, titulo:'Eletrônica de Potência',                categoria:'Eletrônica',     nivel:'Avançado',      carga:50,  preco:127.90, cert:true, modulos:4, emoji:'🔋', descricao:'Retificadores, inversores, conversores DC-DC e projetos com IGBTs e MOSFETs.' },
  { id:12, titulo:'Redes de Computadores — CCNA',          categoria:'Redes',          nivel:'Iniciante',     carga:60,  preco:107.90, cert:true, modulos:5, emoji:'🌐', descricao:'TCP/IP, roteamento, switching, VLANs, subnetting e configuração Cisco.' },
  { id:13, titulo:'Cibersegurança e Ethical Hacking',      categoria:'Redes',          nivel:'Avançado',      carga:70,  preco:147.90, cert:true, modulos:5, emoji:'🛡️', descricao:'Pentest, análise de vulnerabilidades, Kali Linux e defesa de redes.' },
  { id:14, titulo:'UI/UX Design com Figma',                categoria:'Design',         nivel:'Iniciante',     carga:35,  preco:77.90,  cert:true, modulos:4, emoji:'🎨', descricao:'Prototipagem, design de interfaces, sistemas de design e testes de usabilidade.' },
  { id:15, titulo:'Gestão de Projetos com Scrum e Kanban', categoria:'Gestão',         nivel:'Iniciante',     carga:20,  preco:47.90,  cert:true, modulos:3, emoji:'📋', descricao:'Metodologias ágeis, sprints, cerimônias Scrum e ferramentas como Jira e Trello.' },
];

export const CATEGORIAS = ['Todos', 'Programação', 'Eletromecânica', 'Eletrônica', 'Redes', 'Design', 'Gestão'];
export const NIVEIS      = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
export const NIVEL_COLOR: Record<string, string> = {
  Iniciante: '#00ffcc', Intermediário: '#f59e0b', Avançado: '#ff3d6e',
};
export const CAT_EMOJI: Record<string, string> = {
  Programação: '💻', Eletromecânica: '⚙️', Eletrônica: '⚡', Redes: '🌐', Design: '🎨', Gestão: '📋',
};
export const MOD_TITLES = [
  'Fundamentos e Introdução',
  'Conceitos Intermediários',
  'Aplicações Práticas',
  'Projeto Hands-on',
  'Avaliação Final',
];

export interface QuizQuestion {
  id: number;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

export const makeQuestions = (cursoTitulo: string, moduloIdx: number): QuizQuestion[] => [
  {
    id: 1,
    pergunta: `Sobre ${cursoTitulo} — Módulo ${moduloIdx + 1}: qual afirmação está CORRETA?`,
    opcoes: ['É uma tecnologia obsoleta', 'Tem ampla aplicação no mercado', 'Só funciona em sistemas antigos', 'Não possui documentação'],
    correta: 1,
    explicacao: 'A alternativa B está correta. Esta tecnologia tem ampla aplicação e é muito demandada no mercado atual.',
  },
  {
    id: 2,
    pergunta: `Qual é a principal vantagem estudada neste módulo de ${cursoTitulo}?`,
    opcoes: ['Alto custo de implementação', 'Complexidade sem benefícios', 'Produtividade e eficiência', 'Limitação de uso'],
    correta: 2,
    explicacao: 'Correto! O módulo foca na produtividade e eficiência que a tecnologia proporciona.',
  },
  {
    id: 3,
    pergunta: `Qual ferramenta é essencial para trabalhar com ${cursoTitulo}?`,
    opcoes: ['Bloco de notas simples', 'IDE ou editor especializado', 'Calculadora científica', 'Processador de texto'],
    correta: 1,
    explicacao: 'Um IDE ou editor especializado é fundamental para ter produtividade no desenvolvimento.',
  },
];