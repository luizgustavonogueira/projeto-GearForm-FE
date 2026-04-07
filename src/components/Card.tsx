import React from "react";

type CardProps = {
  titulo: string;
  descricao: string;
  imagem?: string; // opcional
  botaoTexto?: string; // opcional
  onClick?: () => void; // opcional
};

const Card: React.FC<CardProps> = ({
  titulo,
  descricao,
  imagem,
  botaoTexto,
  onClick,
}) => {
  return (
    <div style={styles.card}>
      {imagem && <img src={imagem} alt={titulo} style={styles.img} />}

      <h2 style={styles.titulo}>{titulo}</h2>

      <p style={styles.descricao}>{descricao}</p>

      {botaoTexto && (
        <button style={styles.botao} onClick={onClick}>
          {botaoTexto}
        </button>
      )}
    </div>
  );
};

export default Card;

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "300px",
    background: "#0d1117",
    color: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
    textAlign: "center",
    transition: "0.3s",
   clipPath: "polygon(0 0, 90% 0, 100% 20%, 100% 100%, 0% 100%)",
  },
  img: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "15px",
  },
  titulo: {
    margin: "10px 0",
  },
  descricao: {
    fontSize: "14px",
    opacity: 0.8,
  },
  botao: {
    marginTop: "15px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#00ffcc",
    cursor: "pointer",
    fontWeight: "bold",
  },
};