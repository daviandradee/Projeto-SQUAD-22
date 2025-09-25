// src/pages/DoctorApp/DoctorProntuario.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function DoctorProntuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Receber paciente via state da navegação ou buscar por ID
  const [paciente, setPaciente] = useState(location.state?.paciente || null);
  const [prontuario, setProntuario] = useState("");
  const [historico, setHistorico] = useState([]);
  const [retorno, setRetorno] = useState("3 meses");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState("");
  const [pressaoArterial, setPressaoArterial] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estados para anexos
  const [anexos, setAnexos] = useState([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  // Estados para o cronômetro
  const [atendimentoIniciado, setAtendimentoIniciado] = useState(false);
  const [atendimentoPausado, setAtendimentoPausado] = useState(false);
  const [atendimentoFinalizado, setAtendimentoFinalizado] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  // Dados mockados dos pacientes (igual ao da lista)
  const pacientesMock = [
    {
      id: 1,
      nome: "João Silva Santos",
      cpf: "123.456.789-00",
      data_nascimento: "15/03/1985",
      telefone: "(11) 99999-9999",
      email: "joao.silva@email.com",
      status: "ativo",
      endereco: "Rua das Flores, 123 - São Paulo/SP",
      idade: "39 anos",
      primeiraConsulta: "15/01/2024",
      convenio: "Unimed",
      atendimentos: 3,
      faltas: 0
    },
    {
      id: 2,
      nome: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      data_nascimento: "22/07/1990",
      telefone: "(11) 88888-8888",
      email: "maria.oliveira@email.com",
      status: "ativo",
      endereco: "Av. Paulista, 1000 - São Paulo/SP",
      idade: "33 anos",
      primeiraConsulta: "20/02/2024",
      convenio: "Amil",
      atendimentos: 2,
      faltas: 1
    },
    {
      id: 3,
      nome: "Pedro Almeida Souza",
      cpf: "456.789.123-00",
      data_nascimento: "10/12/1978",
      telefone: "(11) 77777-7777",
      email: "pedro.almeida@email.com",
      status: "inativo",
      endereco: "Rua Augusta, 500 - São Paulo/SP",
      idade: "45 anos",
      primeiraConsulta: "05/03/2024",
      convenio: "Bradesco Saúde",
      atendimentos: 1,
      faltas: 0
    },
    {
      id: 4,
      nome: "Ana Pereira Lima",
      cpf: "789.123.456-00",
      data_nascimento: "05/09/1995",
      telefone: "(11) 66666-6666",
      email: "ana.pereira@email.com",
      status: "ativo",
      endereco: "Rua Consolação, 200 - São Paulo/SP",
      idade: "28 anos",
      primeiraConsulta: "10/04/2024",
      convenio: "SulAmérica",
      atendimentos: 4,
      faltas: 0
    },
    {
      id: 5,
      nome: "Carlos Rodrigues Ferreira",
      cpf: "321.654.987-00",
      data_nascimento: "30/01/1982",
      telefone: "(11) 55555-5555",
      email: "carlos.rodrigues@email.com",
      status: "arquivado",
      endereco: "Alameda Santos, 800 - São Paulo/SP",
      idade: "42 anos",
      primeiraConsulta: "25/05/2024",
      convenio: "NotreDame Intermédica",
      atendimentos: 2,
      faltas: 1
    }
  ];

  // Histórico médico mockado específico para cada paciente
  const historicoPorPaciente = {
    1: [
      {
        id: 1,
        data: "15/01/2024",
        tipo: "Consulta Inicial",
        diagnostico: "Paciente em bom estado geral. Realizado check-up preventivo.",
        medico: "Dr. José Rodrigues",
        duracao: "45 minutos",
        retorno: "6 meses",
        dadosAntropometricos: {
          peso: "78.5 kg",
          altura: "175 cm",
          imc: "25.6",
          pressaoArterial: "120/80 mmHg",
          temperatura: "36.5°C"
        },
        observacoes: "Paciente sem queixas. Exames dentro da normalidade.",
        anexos: [{ id: 1, nome: "raio-x-torax.pdf", tipo: "pdf", tamanho: "2.4 MB" }]
      }
    ],
    2: [
      {
        id: 1,
        data: "20/02/2024",
        tipo: "Consulta de Rotina",
        diagnostico: "Controle de pressão arterial.",
        medico: "Dr. José Rodrigues",
        duracao: "30 minutos",
        retorno: "3 meses",
        dadosAntropometricos: {
          peso: "65.2 kg",
          altura: "165 cm",
          imc: "23.9",
          pressaoArterial: "118/78 mmHg",
          temperatura: "36.7°C"
        },
        observacoes: "Paciente com pressão controlada.",
        anexos: []
      }
    ]
    // Adicione históricos para os outros IDs se quiser
  };

  // Função utilitária: calcula idade a partir de data no formato "dd/mm/yyyy"
  const calcularIdadeFromDDMMYYYY = (dataStr) => {
    if (!dataStr) return null;
    // aceita "dd/mm/yyyy" ou "dd-mm-yyyy"
    const parts = dataStr.split(/[/\-]/);
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // zero-based
    const year = parseInt(parts[2], 10);
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
    const hoje = new Date();
    const nasc = new Date(year, month, day);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade >= 0 ? idade : null;
  };

  useEffect(() => {
    // Se o paciente foi passado via state, usa ele
    if (location.state?.paciente) {
      setPaciente(location.state.paciente);
      const historicoPaciente = historicoPorPaciente[location.state.paciente.id] || [];
      setHistorico(historicoPaciente);
    }
    // Se não, busca pelo ID na URL
    else if (id) {
      const pacienteEncontrado = pacientesMock.find((p) => p.id === parseInt(id));
      setPaciente(pacienteEncontrado || null);
      const historicoPaciente = historicoPorPaciente[parseInt(id)] || [];
      setHistorico(historicoPaciente);
    }
    // se nenhum dos dois, paciente permanece como estava (null)
  }, [id, location.state]);

  // Resto do código do cronômetro permanece igual...
  useEffect(() => {
    let intervalo = null;

    if (cronometroAtivo && !atendimentoPausado && !atendimentoFinalizado) {
      intervalo = setInterval(() => {
        setTempoDecorrido((tempo) => tempo + 1);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo);
  }, [cronometroAtivo, atendimentoPausado, atendimentoFinalizado]);

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  const formatarTempoExtenso = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}m ${segs}s`;
    }
    return `${minutos}m ${segs}s`;
  };

  const iniciarAtendimento = () => {
    setAtendimentoIniciado(true);
    setAtendimentoPausado(false);
    setAtendimentoFinalizado(false);
    setCronometroAtivo(true);
    setTempoDecorrido(0);
  };

  const pausarAtendimento = () => {
    setAtendimentoPausado(true);
    setCronometroAtivo(false);
  };

  const retomarAtendimento = () => {
    setAtendimentoPausado(false);
    setCronometroAtivo(true);
  };

  const finalizarAtendimento = () => {
    if (!paciente) {
      alert("Paciente não encontrado — não é possível finalizar.");
      return;
    }
    const confirmacao = window.confirm(
      `Tem certeza que deseja finalizar o atendimento?\n\n` +
        `Paciente: ${paciente.nome}\n` +
        `Duração: ${formatarTempoExtenso(tempoDecorrido)}\n\n` +
        `Após finalizar, o tempo será salvo e não poderá ser alterado.`
    );

    if (confirmacao) {
      setAtendimentoFinalizado(true);
      setCronometroAtivo(false);
      setAtendimentoIniciado(false);
      setAtendimentoPausado(false);
    }
  };

  const calcularIMC = () => {
    if (peso && altura) {
      const alturaMetros = parseInt(altura, 10) / 100;
      if (alturaMetros > 0) {
        const imcCalculado = (parseFloat(peso) / (alturaMetros * alturaMetros)).toFixed(1);
        setImc(imcCalculado);
      }
    }
  };

  useEffect(() => {
    calcularIMC();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peso, altura]);

  const handleArquivoSelecionado = (event) => {
    const file = event.target.files[0];
    if (file) {
      setArquivoSelecionado(file);
    }
  };

  const adicionarAnexo = () => {
    if (arquivoSelecionado) {
      const novoAnexo = {
        id: anexos.length + 1,
        nome: arquivoSelecionado.name,
        tipo: arquivoSelecionado.type,
        tamanho: (arquivoSelecionado.size / 1024 / 1024).toFixed(1) + " MB",
        arquivo: arquivoSelecionado,
        data: new Date().toLocaleString("pt-BR")
      };

      setAnexos([...anexos, novoAnexo]);
      setArquivoSelecionado(null);
      const input = document.getElementById("fileInput");
      if (input) input.value = "";
    }
  };

  const removerAnexo = (id) => {
    setAnexos(anexos.filter((anexo) => anexo.id !== id));
  };

  const handleSalvarProntuario = () => {
    if (!prontuario.trim()) return;

    const duracaoFormatada = atendimentoFinalizado ? formatarTempoExtenso(tempoDecorrido) : "Não registrado";

    const dadosAntropometricosText = `
DADOS ANTROPOMÉTRICOS:
- Peso: ${peso || "Não informado"}
- Altura: ${altura || "Não informado"}
- IMC: ${imc || "Não calculado"}
- Pressão Arterial: ${pressaoArterial || "Não informada"}
- Temperatura: ${temperatura || "Não informada"}
`;

    const observacoesText = observacoes ? `\nOBSERVAÇÕES:\n${observacoes}` : "";

    const textoCompleto = `${dadosAntropometricosText}${observacoesText}\n\nDIAGNÓSTICO E CONDUTA:\n${prontuario}`;

    const novoRegistro = {
      id: historico.length + 1,
      data: new Date().toLocaleDateString("pt-BR"),
      tipo: "Consulta de Rotina",
      diagnostico: textoCompleto,
      medico: "Dr. Médico Atual",
      duracao: duracaoFormatada,
      retorno: retorno,
      dadosAntropometricos: {
        peso: peso || "Não informado",
        altura: altura || "Não informado",
        imc: imc || "Não calculado",
        pressaoArterial: pressaoArterial || "Não informada",
        temperatura: temperatura || "Não informada"
      },
      observacoes: observacoes,
      anexos: [...anexos]
    };

    setHistorico([novoRegistro, ...historico]);

    // Limpar formulário
    setProntuario("");
    setPeso("");
    setAltura("");
    setImc("");
    setPressaoArterial("");
    setTemperatura("");
    setObservacoes("");
    setAnexos([]);
    setAtendimentoIniciado(false);
    setAtendimentoPausado(false);
    setAtendimentoFinalizado(false);
    setCronometroAtivo(false);
    setTempoDecorrido(0);

    alert(`Prontuário salvo com sucesso! Duração da consulta: ${duracaoFormatada}`);
  };

  const visualizarCadastro = () => {
    if (paciente) {
      alert(
        `Cadastro Completo de ${paciente.nome}\n\nCPF: ${paciente.cpf}\nTelefone: ${paciente.telefone}\nEmail: ${paciente.email}\nEndereço: ${paciente.endereco}\nData Nasc.: ${paciente.data_nascimento || "N/A"}\nConvênio: ${paciente.convenio || "Não informado"}\nStatus: ${paciente.status || "N/A"}`
      );
    }
  };

  const getIconePorTipo = (tipo) => {
    if (!tipo) return "📎";
    if (tipo.includes("image")) return "🖼️";
    if (tipo.includes("pdf")) return "📄";
    if (tipo.includes("word") || tipo.includes("officedocument")) return "📝";
    return "📎";
  };

  // se paciente não foi carregado, mostrar mensagem e botão de voltar
  if (!paciente) {
    return (
      <div className="main-content">
        <h2>Paciente não encontrado</h2>
        <button
          onClick={() => navigate(location.state?.from || "/doctor/prontuariolist")}
          className="btn btn-secondary"
        >
          Voltar para lista de pacientes
        </button>
      </div>
    );
  }

  // Preparar valores de exibição (idade calculada quando necessário)
  const idadeDisplay = paciente.idade || (() => {
    const calc = calcularIdadeFromDDMMYYYY(paciente.data_nascimento);
    return calc !== null ? `${calc} anos` : "N/A";
  })();

  const primeiraConsultaDisplay = paciente.primeiraConsulta || "N/A";
  const convenioDisplay = paciente.convenio || "N/A";
  const atendimentosDisplay = paciente.atendimentos ?? 0;
  const faltasDisplay = paciente.faltas ?? 0;

  return (
    <div className="main-content">
      {/* Header com informações do paciente específico */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button
            onClick={() => navigate(location.state?.from || "/doctor/prontuariolist")}
            className="btn btn-primary me-3"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "bold"
            }}
            title="Voltar"
          >
            &lt;
          </button>
          <div>
            <h2 className="text-primary mb-0">Prontuário Médico</h2>
            <small className="text-muted">
              Paciente ID: {paciente.id} • {paciente.nome}
            </small>
          </div>
        </div>

        <div>
          <button onClick={visualizarCadastro} className="btn btn-outline-primary me-2">
            Visualizar Cadastro
          </button>

          {/* Controle do atendimento */}
          {!atendimentoIniciado && !atendimentoFinalizado ? (
            <button onClick={iniciarAtendimento} className="btn btn-success">
              Iniciar Atendimento
            </button>
          ) : atendimentoPausado ? (
            <button onClick={retomarAtendimento} className="btn btn-warning me-2">
              Retomar
            </button>
          ) : atendimentoIniciado ? (
            <button onClick={pausarAtendimento} className="btn btn-secondary me-2">
              Pausar
            </button>
          ) : null}

          {(atendimentoIniciado || atendimentoPausado) && (
            <button onClick={finalizarAtendimento} className="btn btn-danger">
              Finalizar
            </button>
          )}
        </div>
      </div>

      {/* Cronômetro */}
      {(atendimentoIniciado || atendimentoPausado || atendimentoFinalizado) && (
        <div
          className={`alert d-flex justify-content-between align-items-center mb-4 ${
            atendimentoFinalizado ? "alert-success" : atendimentoPausado ? "alert-warning" : "alert-info"
          }`}
        >
          <div>
            <strong>
              {atendimentoFinalizado ? "✅ Atendimento Finalizado" : atendimentoPausado ? "⏸️ Atendimento Pausado" : "▶️ Atendimento em Andamento"}
            </strong>
            {atendimentoPausado && <small className="ms-2 text-muted">(Tempo pausado)</small>}
          </div>
          <div className="cronometro">
            <span
              className={`badge fs-6 ${
                atendimentoFinalizado ? "bg-success" : atendimentoPausado ? "bg-warning" : "bg-primary"
              }`}
            >
              ⏱️ {formatarTempo(tempoDecorrido)}
              {atendimentoFinalizado && ` (${formatarTempoExtenso(tempoDecorrido)})`}
            </span>
          </div>
        </div>
      )}

      {/* Resumo do Paciente ESPECÍFICO */}
      <div className="card mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Resumo do Paciente</h5>
          <span
            className={`badge ${
              paciente.status === "ativo" ? "bg-success" : paciente.status === "inativo" ? "bg-secondary" : "bg-warning"
            }`}
          >
            {paciente.status || "N/A"}
          </span>
        </div>
        <div className="card-body">
          <div className="text-center mb-4">
            <h4 className="text-primary mb-2">{paciente.nome}</h4>
            <div className="d-flex justify-content-center gap-4">
              <span className="text-muted">ID: {paciente.id}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 text-center border-end">
              <div className="mb-3">
                <div className="text-muted small">IDADE</div>
                <div className="h5 text-primary">{idadeDisplay}</div>
                <div className="text-muted small">Nasc: {paciente.data_nascimento || "N/A"}</div>
              </div>
            </div>

            <div className="col-md-3 text-center border-end">
              <div className="mb-3">
                <div className="text-muted small">PRIMEIRA CONSULTA</div>
                <div className="h5 text-primary">{primeiraConsultaDisplay}</div>
                <div className="text-muted small">Convênio: {convenioDisplay}</div>
              </div>
            </div>

            <div className="col-md-3 text-center border-end">
              <div className="mb-3">
                <div className="text-muted small">ATENDIMENTOS</div>
                <div className="h5 text-success">{atendimentosDisplay}</div>
                <div className="text-muted small">realizados</div>
              </div>
            </div>

            <div className="col-md-3 text-center">
              <div className="mb-3">
                <div className="text-muted small">FALTAS</div>
                <div className="h5 text-danger">{faltasDisplay}</div>
                <div className="text-muted small">registradas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resto do código do prontuário permanece igual... */}
      <div className="row">
        {/* Coluna 1: Dados da Consulta */}
        <div className="col-lg-4 col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">⏱️ Duração da Consulta</h6>
            </div>
            <div className="card-body text-center">
              {atendimentoFinalizado ? (
                <div>
                  <div className="display-6 text-success mb-2">{formatarTempo(tempoDecorrido)}</div>
                  <small className="text-muted">Tempo final: {formatarTempoExtenso(tempoDecorrido)}</small>
                </div>
              ) : atendimentoIniciado ? (
                <div>
                  <div className={`display-6 mb-2 ${atendimentoPausado ? "text-warning" : "text-primary"}`}>{formatarTempo(tempoDecorrido)}</div>
                  <small className="text-muted">{atendimentoPausado ? "Tempo pausado" : "Tempo decorrido"}</small>
                </div>
              ) : (
                <div>
                  <div className="display-6 text-muted mb-2">00:00</div>
                  <small className="text-muted">Inicie o atendimento</small>
                </div>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">📊 Dados Antropométricos</h6>
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small">Peso (kg)</label>
                  <input
                    type="text"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="form-control form-control-sm"
                    placeholder="70.5"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Altura (cm)</label>
                  <input
                    type="text"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    className="form-control form-control-sm"
                    placeholder="175"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small">IMC</label>
                  <input type="text" value={imc} readOnly className="form-control form-control-sm bg-light" placeholder="Calculado automaticamente" />
                </div>
                <div className="col-6">
                  <label className="form-label small">Pressão Arterial</label>
                  <input
                    type="text"
                    value={pressaoArterial}
                    onChange={(e) => setPressaoArterial(e.target.value)}
                    className="form-control form-control-sm"
                    placeholder="120/80 mmHg"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Temperatura</label>
                  <input
                    type="text"
                    value={temperatura}
                    onChange={(e) => setTemperatura(e.target.value)}
                    className="form-control form-control-sm"
                    placeholder="36.5°C"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small">Observações</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="form-control form-control-sm"
                    placeholder="Observações adicionais..."
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Prontuário Principal */}
        <div className="col-lg-4 col-md-6">
          <div className="card mb-4 h-100">
            <div className="card-header bg-light">
              <h6 className="mb-0">📝 Prontuário</h6>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Dados incluídos automaticamente:</strong>
                  <br />
                  • Peso: {peso || "Não informado"}
                  <br />
                  • Altura: {altura || "Não informado"}
                  <br />
                  • IMC: {imc || "Não calculado"}
                  <br />
                  • Pressão: {pressaoArterial || "Não informada"}
                  <br />
                  • Temperatura: {temperatura || "Não informada"}
                  <br />
                  {observacoes && `• Observações: ${observacoes}`}
                </small>
              </div>

              <textarea
                value={prontuario}
                onChange={(e) => setProntuario(e.target.value)}
                placeholder="Digite o diagnóstico, conduta e prescrição médica..."
                rows="8"
                className="form-control flex-grow-1"
                style={{ minHeight: "200px" }}
              />

              <div className="mt-3">
                <button onClick={handleSalvarProntuario} className="btn btn-primary w-100" disabled={!prontuario.trim()}>
                  💾 Salvar Prontuário
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Anexos e Retorno */}
        <div className="col-lg-4 col-md-12">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">📎 Anexos</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input type="file" id="fileInput" onChange={handleArquivoSelecionado} className="form-control form-control-sm" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" />
                <small className="text-muted">PDF, imagens, documentos (máx. 10MB)</small>
              </div>

              {arquivoSelecionado && (
                <div className="alert alert-info py-2 mb-3">
                  <small>
                    <strong>Arquivo selecionado:</strong> {arquivoSelecionado.name} ({(arquivoSelecionado.size / 1024 / 1024).toFixed(1)} MB)
                  </small>
                  <button onClick={adicionarAnexo} className="btn btn-sm btn-success ms-2">
                    Adicionar
                  </button>
                </div>
              )}

              {anexos.length > 0 && (
                <div className="anexos-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {anexos.map((anexo) => (
                    <div key={anexo.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center">
                          <span className="me-2">{getIconePorTipo(anexo.tipo)}</span>
                          <small className="text-truncate">{anexo.nome}</small>
                        </div>
                        <small className="text-muted">
                          {anexo.tamanho} • {anexo.data}
                        </small>
                      </div>
                      <button onClick={() => removerAnexo(anexo.id)} className="btn btn-sm btn-outline-danger" title="Remover anexo">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">📅 Retorno</h6>
            </div>
            <div className="card-body">
              <select value={retorno} onChange={(e) => setRetorno(e.target.value)} className="form-select">
                <option>1 mês</option>
                <option>3 meses</option>
                <option>6 meses</option>
                <option>1 ano</option>
                <option>Sem retorno</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">📋 Histórico Recente</h6>
                <span className="badge bg-primary">{historico.length}</span>
              </div>
            </div>
            <div className="card-body p-0">
              {historico.length === 0 ? (
                <div className="p-3 text-center text-muted">Nenhum registro</div>
              ) : (
                <div className="historico-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {historico.slice(0, 5).map((registro) => (
                    <div key={registro.id} className="border-bottom p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <small className="text-primary">{registro.data}</small>
                        <span className="badge bg-light text-dark small">{registro.duracao}</span>
                      </div>
                      <p className="small mb-2 text-truncate">{(registro.diagnostico || "").split("\n")[0]}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{registro.tipo}</small>
                        <small className="text-muted">Ret: {registro.retorno}</small>
                      </div>
                      {registro.anexos && registro.anexos.length > 0 && (
                        <div className="mt-1">
                          <small className="text-muted">📎 {registro.anexos.length} anexo(s)</small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProntuario;
