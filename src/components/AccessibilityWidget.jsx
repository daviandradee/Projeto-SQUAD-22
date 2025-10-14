import { useEffect, useState } from "react";
import "../assets/css/darkmode.css";

const LS_KEYS = {
  dark: "pref_dark_mode",
  daltonism: "pref_daltonism",
  font: "pref_font_scale",
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [daltonismMode, setDaltonismMode] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [leituraAtiva, setLeituraAtiva] = useState(false);

  // ---------- LEITURA AUTOMÁTICA ----------
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
      if (texto.length > 1) lerTextoSelecionado();
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

  // ---------- CARREGAR PREFERÊNCIAS ----------
  useEffect(() => {
    const savedDark = localStorage.getItem(LS_KEYS.dark) === "true";
    const savedDaltonism = localStorage.getItem(LS_KEYS.daltonism) === "true";
    const savedFont = parseInt(localStorage.getItem(LS_KEYS.font) || "100", 10);

    setDarkMode(savedDark);
    setDaltonismMode(savedDaltonism);
    setFontScale(savedFont);

    document.body.classList.toggle("dark-mode", savedDark);
    document.body.classList.toggle("daltonism-mode", savedDaltonism);
    document.documentElement.style.fontSize = `${savedFont}%`;
  }, []);

  // ---------- FUNÇÕES DE MODO ----------
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(LS_KEYS.dark, String(next));
    document.body.classList.toggle("dark-mode", next);
  };

  const toggleDaltonismMode = () => {
    const next = !daltonismMode;
    setDaltonismMode(next);
    localStorage.setItem(LS_KEYS.daltonism, String(next));
    document.body.classList.toggle("daltonism-mode", next);
  };

  // ---------- CONTROLE DE FONTE ----------
  const applyFontScale = (next) => {
    const clamped = Math.max(80, Math.min(180, next));
    setFontScale(clamped);
    localStorage.setItem(LS_KEYS.font, String(clamped));
    document.documentElement.style.fontSize = `${clamped}%`;
  };
  const incFont = () => applyFontScale(fontScale + 10);
  const decFont = () => applyFontScale(fontScale - 10);
  const resetFont = () => applyFontScale(100);

  // ---------- JSX ----------
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

      {/* Painel */}
      {open && (
        <div className="acc-panel">
          <div className="acc-header">
            <strong>Acessibilidade</strong>
            <button className="acc-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          {/* Modo escuro */}
          <div className="acc-row">
            <label className="acc-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="acc-slider"></span>
              <span className="acc-label">Modo escuro</span>
            </label>
          </div>

          {/* Modo daltônico */}
          <div className="acc-row">
            <label className="acc-switch">
              <input
                type="checkbox"
                checked={daltonismMode}
                onChange={toggleDaltonismMode}
              />
              <span className="acc-slider"></span>
              <span className="acc-label">Modo daltônico</span>
            </label>
          </div>

          {/* Controle de fonte */}
          <div className="acc-row">
            <span className="acc-label">Tamanho da fonte</span>
            <div className="acc-font-controls">
              <button onClick={decFont} title="Diminuir fonte">A−</button>
              <button onClick={resetFont} title="Resetar tamanho">A</button>
              <button onClick={incFont} title="Aumentar fonte">A+</button>
            </div>
          </div>

          {/* Leitura automática */}
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