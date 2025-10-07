import { useEffect, useState } from "react";
import "../assets/css/darkmode.css";

const LS_KEY = "pref_dark_mode";

export default function AccessibilityWidget() {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);

  // Carrega a preferência salva
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) === "true";
    setDarkMode(saved);
    document.body.classList.toggle("dark-mode", saved);
  }, []);

  // Alterna modo escuro
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(LS_KEY, String(next));
    document.body.classList.toggle("dark-mode", next);
  };

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
            <label className="acc-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span>Modo escuro</span>
            </label>
          </div>

          <div className="acc-footer">
            <small>Atalho: Ctrl + Alt + A</small>
          </div>
        </div>
      )}
    </>
  );
}