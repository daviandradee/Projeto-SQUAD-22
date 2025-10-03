import { useEffect, useState, useRef } from "react";

const LS_KEYS = {
  dark: "pref_dark_mode",
  contrast: "pref_high_contrast",
  font: "pref_font_scale",
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(100); // %
  const speakingRef = useRef(false);

  // Aplica preferências salvas
  useEffect(() => {
    const savedDark = localStorage.getItem(LS_KEYS.dark) === "true";
    const savedContrast = localStorage.getItem(LS_KEYS.contrast) === "true";
    const savedFont = parseInt(localStorage.getItem(LS_KEYS.font) || "100", 10);

    setDarkMode(savedDark);
    setHighContrast(savedContrast);
    setFontScale(savedFont);

    if (savedDark) document.body.classList.add("dark-mode");
    if (savedContrast) document.body.classList.add("high-contrast");
    document.documentElement.style.fontSize = `${savedFont}%`;
  }, []);

  // Atalho de teclado para abrir o painel
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl + Alt + A para abrir/fechar o painel
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        event.preventDefault();
        setOpen(prev => !prev);
      }
      // Escape para fechar o painel
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Alterna Dark Mode
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(LS_KEYS.dark, String(next));
    document.body.classList.toggle("dark-mode", next);
  };

  // Alterna Alto Contraste
  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem(LS_KEYS.contrast, String(next));
    document.body.classList.toggle("high-contrast", next);
  };

  // Escala da fonte
  const applyFontScale = (next) => {
    const clamped = Math.max(80, Math.min(180, next));
    setFontScale(clamped);
    localStorage.setItem(LS_KEYS.font, String(clamped));
    document.documentElement.style.fontSize = `${clamped}%`;
  };
  const incFont = () => applyFontScale(fontScale + 10);
  const decFont = () => applyFontScale(fontScale - 10);
  const resetFont = () => applyFontScale(100);

  // Leitura de texto (página inteira ou seleção)
  const readPage = () => {
    try {
      if (!("speechSynthesis" in window)) {
        alert("Seu navegador não suporta leitura de texto.");
        return;
      }

      // Pega o texto selecionado ou a página inteira
      const selection = window.getSelection()?.toString().trim();
      let text = selection?.length ? selection : document.body.innerText;

      // Remove caracteres especiais e quebras de linha excessivas
      text = text.replace(/\s+/g, ' ').trim();

      if (!text || text.length < 3) {
        alert("Nenhum texto encontrado para ler. Selecione um texto ou verifique se há conteúdo na página.");
        return;
      }

      console.log("Texto a ser lido:", text.substring(0, 100) + "...");

      // Cancela qualquer leitura anterior
      window.speechSynthesis.cancel();
      
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "pt-BR";
      utter.rate = 0.8; // Velocidade mais lenta para melhor compreensão
      utter.pitch = 1; // Tom normal
      utter.volume = 1; // Volume máximo

      speakingRef.current = true;

      // Configura a voz com múltiplas tentativas
      const setupVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("Vozes disponíveis:", voices.map(v => `${v.name} (${v.lang}) - Local: ${v.localService}`));
        
        // Tenta diferentes estratégias para encontrar a melhor voz
        let brVoice = null;
        
        // Estratégia 1: Busca pela Luciana especificamente
        const lucianaVoice = voices.find((v) => v.name.toLowerCase().includes("luciana"));
        if (lucianaVoice) {
          brVoice = lucianaVoice;
          console.log("✅ Voz Luciana encontrada:", lucianaVoice.name);
        }
        
        // Estratégia 2: Se não encontrou Luciana, busca outras vozes PT-BR
        if (!brVoice) {
          brVoice = voices.find((v) => v.lang === "pt-BR" && v.localService !== false) ||
                   voices.find((v) => v.lang.startsWith("pt") && v.localService !== false) ||
                   voices.find((v) => v.name.toLowerCase().includes("brasil"));
          if (brVoice) {
            console.log("✅ Voz PT-BR alternativa encontrada:", brVoice.name);
          }
        }
        
        // Estratégia 3: Se ainda não encontrou, usa qualquer voz PT
        if (!brVoice) {
          brVoice = voices.find((v) => v.lang.includes("pt"));
          if (brVoice) {
            console.log("✅ Voz PT genérica encontrada:", brVoice.name);
          }
        }
        
        // Estratégia 4: Se ainda não encontrou, usa voz padrão do sistema
        if (!brVoice) {
          brVoice = voices.find((v) => v.default);
          if (brVoice) {
            console.log("⚠️ Usando voz padrão do sistema:", brVoice.name);
          }
        }

        if (brVoice) {
          utter.voice = brVoice;
          console.log("🎤 Voz selecionada:", {
            name: brVoice.name,
            lang: brVoice.lang,
            localService: brVoice.localService,
            default: brVoice.default
          });
        } else {
          console.log("⚠️ Nenhuma voz encontrada, usando configurações padrão");
        }
      };

      // Tenta configurar a voz imediatamente
      setupVoice();
      
      // Se as vozes ainda não carregaram, aguarda
      if (window.speechSynthesis.getVoices().length === 0) {
        console.log("Aguardando carregamento das vozes...");
        window.speechSynthesis.onvoiceschanged = () => {
          setupVoice();
          window.speechSynthesis.speak(utter);
        };
        return;
      }

      // Callbacks de eventos
      utter.onstart = () => {
        console.log("✅ Leitura iniciada");
      };

      utter.onend = () => {
        speakingRef.current = false;
        console.log("✅ Leitura finalizada");
      };

      utter.onerror = (event) => {
        console.error("❌ Erro na leitura:", {
          error: event.error,
          type: event.type,
          voice: utter.voice?.name,
          lang: utter.voice?.lang
        });
        speakingRef.current = false;
        
        // Tenta uma abordagem alternativa se a voz Luciana falhar
        if (event.error === 'synthesis-failed' && utter.voice?.name.toLowerCase().includes('luciana')) {
          console.log("🔄 Tentando com voz alternativa devido ao erro da Luciana...");
          setTimeout(() => {
            const voices = window.speechSynthesis.getVoices();
            const alternativeVoice = voices.find(v => v.lang === 'pt-BR' && !v.name.toLowerCase().includes('luciana')) ||
                                   voices.find(v => v.lang.startsWith('pt') && !v.name.toLowerCase().includes('luciana'));
            
            if (alternativeVoice) {
              console.log("🔄 Tentando novamente com voz alternativa:", alternativeVoice.name);
              const newUtter = new SpeechSynthesisUtterance(text);
              newUtter.lang = "pt-BR";
              newUtter.rate = 0.8;
              newUtter.pitch = 1;
              newUtter.volume = 1;
              newUtter.voice = alternativeVoice;
              
              newUtter.onstart = () => console.log("✅ Leitura alternativa iniciada");
              newUtter.onend = () => {
                speakingRef.current = false;
                console.log("✅ Leitura alternativa finalizada");
              };
              newUtter.onerror = (err) => {
                console.error("❌ Erro também na voz alternativa:", err.error);
                speakingRef.current = false;
                alert(`Erro na leitura: ${err.error}. Tente selecionar uma voz diferente no sistema.`);
              };
              
              speakingRef.current = true;
              window.speechSynthesis.speak(newUtter);
            } else {
              alert(`Erro ao ler o texto: ${event.error}. Tente verificar as configurações de voz do sistema.`);
            }
          }, 100);
        } else {
          alert(`Erro ao ler o texto: ${event.error}. Verifique se o volume está ligado e as configurações de voz.`);
        }
      };

      utter.onpause = () => {
        console.log("⏸️ Leitura pausada");
      };

      utter.onresume = () => {
        console.log("▶️ Leitura retomada");
      };

      console.log("Iniciando leitura...");
      window.speechSynthesis.speak(utter);

    } catch (error) {
      console.error("Erro geral na função de leitura:", error);
      speakingRef.current = false;
      alert("Erro inesperado ao tentar ler o texto. Tente novamente.");
    }
  };

  const stopReading = () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        speakingRef.current = false;
        console.log("🛑 Leitura interrompida");
      }
    } catch (error) {
      console.error("Erro ao parar a leitura:", error);
      speakingRef.current = false;
    }
  };

  // Função de teste para verificar se a API está funcionando
  const testSpeech = () => {
    try {
      if (!("speechSynthesis" in window)) {
        alert("❌ API SpeechSynthesis não está disponível neste navegador.");
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      console.log("🔍 Testando API SpeechSynthesis...");
      console.log("📊 Total de vozes:", voices.length);
      console.log("🌍 Vozes disponíveis:", voices.map(v => `${v.name} (${v.lang}) - Local: ${v.localService}`));

      // Testa especificamente a voz Luciana
      const lucianaVoice = voices.find(v => v.name.toLowerCase().includes("luciana"));
      if (lucianaVoice) {
        console.log("🎤 Testando voz Luciana especificamente:", {
          name: lucianaVoice.name,
          lang: lucianaVoice.lang,
          localService: lucianaVoice.localService,
          default: lucianaVoice.default
        });
      }

      const testText = "Teste de leitura de texto. Se você está ouvindo isso, a função está funcionando corretamente.";
      
      window.speechSynthesis.cancel();
      
      const utter = new SpeechSynthesisUtterance(testText);
      utter.lang = "pt-BR";
      utter.rate = 0.8;
      utter.volume = 1;

      // Tenta usar a voz Luciana se disponível
      if (lucianaVoice) {
        utter.voice = lucianaVoice;
        console.log("🎤 Usando voz Luciana para o teste");
      }

      utter.onstart = () => {
        console.log("✅ Teste iniciado com voz:", utter.voice?.name || "padrão");
        alert("🎤 Teste de leitura iniciado! Verifique se você consegue ouvir o áudio.");
      };

      utter.onend = () => {
        console.log("✅ Teste finalizado");
        alert("✅ Teste de leitura finalizado!");
      };

      utter.onerror = (event) => {
        console.error("❌ Erro no teste:", {
          error: event.error,
          type: event.type,
          voice: utter.voice?.name,
          lang: utter.voice?.lang
        });
        alert(`❌ Erro no teste: ${event.error}. Voz: ${utter.voice?.name || 'padrão'}`);
      };

      window.speechSynthesis.speak(utter);

    } catch (error) {
      console.error("Erro no teste:", error);
      alert(`❌ Erro no teste: ${error.message}`);
    }
  };

  // Função para listar todas as vozes disponíveis
  const listVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log("🔍 Lista completa de vozes:");
    voices.forEach((voice, index) => {
      console.log(`${index + 1}. ${voice.name}`, {
        lang: voice.lang,
        localService: voice.localService,
        default: voice.default,
        voiceURI: voice.voiceURI
      });
    });
    
    const voiceInfo = voices.map((v, i) => 
      `${i + 1}. ${v.name} (${v.lang}) - Local: ${v.localService} - Padrão: ${v.default}`
    ).join('\n');
    
    alert(`Vozes disponíveis:\n${voiceInfo}`);
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="acc-btn"
        aria-label="Abrir painel de acessibilidade"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ♿
      </button>

      {/* Painel */}
      {open && (
        <div className="acc-panel">
          <div className="acc-header">
            <strong>Acessibilidade</strong>
            <button className="acc-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Dark Mode */}
          <div className="acc-row">
            <label className="acc-switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span>Modo escuro</span>
            </label>
          </div>

          {/* Alto Contraste */}
          <div className="acc-row">
            <label className="acc-switch">
              <input type="checkbox" checked={highContrast} onChange={toggleHighContrast} />
              <span>Alto contraste</span>
            </label>
          </div>

          {/* Fonte */}
          <div className="acc-row">
            <span>Tamanho da fonte</span>
            <div className="acc-font-controls">
              <button onClick={decFont}>A-</button>
              <span className="acc-font-badge">{fontScale}%</span>
              <button onClick={incFont}>A+</button>
              <button onClick={resetFont}>Reset</button>
            </div>
          </div>

          {/* Leitura */}
          <div className="acc-row">
            <span>Leitor de texto</span>
            <div className="acc-tts-controls">
              <button 
                onClick={readPage}
                disabled={speakingRef.current}
                title="Ler toda a página ou texto selecionado"
              >
                📖 {speakingRef.current ? "Lendo..." : "Ler"}
              </button>
              <button 
                onClick={stopReading}
                disabled={!speakingRef.current}
                title="Parar a leitura"
              >
                ⏹️ Parar
              </button>
              <button 
                onClick={testSpeech}
                title="Testar se a leitura está funcionando"
                style={{ fontSize: '12px' }}
              >
                🧪 Teste
              </button>
              <button 
                onClick={listVoices}
                title="Listar todas as vozes disponíveis"
                style={{ fontSize: '12px' }}
              >
                📋 Vozes
              </button>
            </div>
          </div>

          <div className="acc-footer">
            <small>Atalho: Ctrl + Alt + A</small>
          </div>
        </div>
      )}
    </>
  );
}