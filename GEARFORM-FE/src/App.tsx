import { useState } from 'react'
import bgVideo from "./assets/fundo.mp4";
import reactLogo from './assets/react.svg'
import Navbar from "./components/Navbar";
import viteLogo from '/vite.svg'
import './App.css'

function App() {
 

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
        <h1>Seu Conteúdo Aqui</h1>
      </div>
    </div>
    </>
  );
}

export default App
