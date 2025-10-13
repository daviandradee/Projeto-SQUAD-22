import { useEffect, useState } from "react";
import "../assets/css/darkmode.css";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [leituraAtiva, setLeituraAtiva] = useState(false);

  const lerTextoSelecionado = () => {
    const texto = window.getSelection().toString().trim();
    if (!texto) return;
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;
    window.speechSynthesis.speak(fala);
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!leituraAtiva) return;
      const texto = window.getSelection().toString().trim();
      if (texto.length > 1) {
        lerTextoSelecionado();
      }
    };

    if (leituraAtiva) {
      document.addEventListener("selectionchange", handleSelectionChange);
    } else {
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.speechSynthesis.cancel();
    }

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [leituraAtiva]);

  return (
    <>
      {/* Botão flutuante ♿ */}
      <button
        className={`acc-btn ${open ? "active" : ""}`}
        aria-label="Abrir painel de acessibilidade"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "♿"}
      </button>

      {/* Painel lateral */}
      {open && (
        <div className="acc-panel">
          <div className="acc-header">
            <strong>Acessibilidade</strong>
            <button className="acc-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

        

          <div className="acc-row">
            <button
              className={`acc-btn-read ${leituraAtiva ? "active" : ""}`}
              onClick={() => setLeituraAtiva(!leituraAtiva)}
            >
              {leituraAtiva
                ? "🟢 Leitura automática ativada"
                : "🔊 Ativar leitura automática"}
            </button>
          </div>

          <div className="acc-footer">
            <small>Atalho: Ctrl + Alt + A</small>
          </div>
        </div>
      )}
    </>
  );
}
