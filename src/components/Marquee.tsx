import React from "react";
import "./Marquee.css";
const items: string[] = [
  "DESENVOLVIMENTO WEB",
  "INTELIGÊNCIA ARTIFICIAL",
  "DESIGN DE PRODUTO",
  "CLOUD COMPUTING",
  "CYBERSEGURANÇA",
  "DATA SCIENCE",
  "BLOCKCHAIN",
  "MOBILE DEV",
];

const Marquee: React.FC = () => {
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="marquee-item">
            {item} <span>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;