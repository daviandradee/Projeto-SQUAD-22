import "../../assets/css/index.css"
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { getAccessToken} from "../../utils/auth.js";
import Swal from "sweetalert2";
import { useResponsive } from '../../utils/useResponsive.js';
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/userInfo.js";


function DropdownPortal({ anchorEl, isOpen, onClose, className, children }) {
  const menuRef = useRef(null);
  const [stylePos, setStylePos] = useState({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    zIndex: 1000,
  });

  // Posiciona o menu após renderar (medir tamanho do menu)
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!anchorEl || !menuRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    // tenta alinhar à direita do botão (como dropdown-menu-right)
    let left = anchorRect.right + scrollX - menuRect.width;
    let top = anchorRect.bottom + scrollY;

    // evita sair da esquerda da tela
    if (left < 0) left = scrollX + 4;
    // se extrapolar bottom, abre para cima
    if (top + menuRect.height > window.innerHeight + scrollY) {
      top = anchorRect.top + scrollY - menuRect.height;
    }
    setStylePos({
      position: "absolute",
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      visibility: "visible",
      zIndex: 1000,
    });
  }, [isOpen, anchorEl, children]);

  // fecha ao clicar fora / ao rolar
  useEffect(() => {
    if (!isOpen) return;
    function handleDocClick(e) {
      const menu = menuRef.current;
      if (menu && !menu.contains(e.target) && anchorEl && !anchorEl.contains(e.target)) {
        onClose();
      }
    }
    function handleScroll() {
      onClose();
    }
    document.addEventListener("mousedown", handleDocClick);
    // captura scroll em qualquer elemento (true)
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;
  return createPortal(
    <div
      ref={menuRef}
      className={className} // mantém as classes que você já usa no CSS
      style={stylePos}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

function ConsultaList() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const [consulta, setConsultas] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const tokenUsuario = getAccessToken()
  const [pacientesMap, setPacientesMap] = useState({});
  const [medicosMap, setMedicosMap] = useState({});
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuanqfswhberkoevtmfr.supabase.co";
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  const headers = {
    apikey: supabaseAK,
    Authorization: `Bearer ${tokenUsuario}`,
    "Content-Type": "application/json",
  };

  var myHeaders = new Headers();
  myHeaders.append("apikey", supabaseAK);
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  useEffect(() => {
    fetch(`${supabaseUrl}/rest/v1/appointments`, requestOptions)
      .then(response => response.json())
      .then(result => setConsultas(Array.isArray(result) ? result : []))
      .catch(error => console.log('error', error));
  }, [])

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Tem certeza?",
      text: "Deseja realmente excluir esta consulta? Essa ação não poderá ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Excluir!",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/appointments?id=eq.${id}`,
        {
          method: "DELETE",
          headers: myHeaders,
        }
      );
      console.log("Resposta do delete:", response);
      if (response.ok) {
        setConsultas((prev) => prev.filter((c) => c.id !== id));
        setOpenDropdown(null);

        Swal.fire({
          title: "Excluída!",
          text: "A consulta foi removida com sucesso.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Erro", "Falha ao excluir a consulta. Tente novamente.", "error");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      Swal.fire("Erro", "Não foi possível conectar ao servidor.", "error");
    }
  };

  const filteredConsultas = consulta.filter(p => {
    if (!p) return false;
    const nome = (pacientesMap[p.patient_id] || "").toLowerCase();
    const médicoNome = (medicosMap[p.doctor_id] || "").toLowerCase();
    const cpf = (p.cpf || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const q = search.toLowerCase();
    
    
    // Filtro por texto (nome, cpf, email)
    const matchesText = nome.includes(q) || cpf.includes(q) || email.includes(q) || médicoNome.includes(q);
    
    // Filtro por status
    const matchesStatus = !statusFilter || p.status === statusFilter;
    
    // Filtro por tipo de consulta
    const matchesType = !typeFilter || p.appointment_type === typeFilter;
    
    
    let dateMatch = true;
    if (p.scheduled_at) {
      const consultaDate = new Date(p.scheduled_at);
      const today = new Date();
      
      // Filtros por período rápido
      if (period === "today") {
        const todayStr = today.toDateString();
        dateMatch = consultaDate.toDateString() === todayStr;
      } else if (period === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        dateMatch = consultaDate >= startOfWeek && consultaDate <= endOfWeek;
      } else if (period === "month") {
        dateMatch = consultaDate.getMonth() === today.getMonth() && 
                   consultaDate.getFullYear() === today.getFullYear();
      }

      // Filtros por data específica
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Inclui o dia inteiro
        dateMatch = dateMatch && consultaDate >= start && consultaDate <= end;
      } else if (startDate) {
        const start = new Date(startDate);
        dateMatch = dateMatch && consultaDate >= start;
      } else if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && consultaDate <= end;
      }
    }

    return matchesText && matchesStatus && matchesType && dateMatch;
  }).sort((a, b) => {
    // Priorizar consultas "requested" (solicitadas) primeiro
    if (a.status === 'requested' && b.status !== 'requested') {
      return -1; // 'a' vem antes de 'b'
    }
    if (b.status === 'requested' && a.status !== 'requested') {
      return 1; // 'b' vem antes de 'a'
    }
    
    // Se ambos têm o mesmo status de prioridade, ordena por data (mais recente primeiro)
    const dateA = new Date(a.scheduled_at || 0);
    const dateB = new Date(b.scheduled_at || 0);
    return dateB - dateA;
  });
  const [itemsPerPage1] = useState(15);
  const [currentPage1, setCurrentPage1] = useState(1);
  const indexOfLastPatient = currentPage1 * itemsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
  const currentConsultas = filteredConsultas.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages1 = Math.ceil(filteredConsultas.length / itemsPerPage1);
  useEffect(() => {
    setCurrentPage1(1);
  }, [search, statusFilter, typeFilter, period, startDate, endDate]);

  // Função para definir períodos e limpar datas
  const handlePeriodChange = (newPeriod) => {
    // Se clicar no mesmo período, limpa o filtro
    if (period === newPeriod) {
      setPeriod("");
    } else {
      setPeriod(newPeriod);
    }
    
    // Sempre limpa as datas específicas
    setStartDate("");
    setEndDate("");
  };
useEffect(() => {
    if (!consulta || consulta.length === 0) return;

    const buscarPacientes = async () => {
      try {
        // Pega IDs únicos de pacientes
        const idsUnicos = [...new Set(consulta.map((c) => c.patient_id))];

        // Faz apenas 1 fetch por paciente
        const promises = idsUnicos.map(async (id) => {
          try {
            const res = await fetch(
              `${supabaseUrl}/rest/v1/patients?id=eq.${id}`,
              {
                method: "GET",
                headers: {
                  apikey:
                  supabaseAK,
                  Authorization: `Bearer ${tokenUsuario}`,
                },
              }
            );
            const data = await res.json();
            return { id, full_name: data[0]?.full_name || "Nome não encontrado" };
          } catch (err) {
            return { id, full_name: "Nome não encontrado" };
          }
        });

        const results = await Promise.all(promises);

        const map = {};
        results.forEach((r) => (map[r.id] = r.full_name));
        setPacientesMap(map);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    };

    buscarPacientes();
  }, [consulta]);
  useEffect(() => {
    if (!Array.isArray(consulta) || consulta.length === 0) return;

    const buscarMedicos = async () => {
      try {
        const idsUnicos = [...new Set(consulta.map((c) => c.doctor_id).filter(Boolean))];
        if (idsUnicos.length === 0) return;

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
          apikey: supabaseAK,
        };

        const promises = idsUnicos.map(async (id) => {
          try {
            const res = await fetch(`${supabaseUrl}/rest/v1/doctors?id=eq.${id}`, {
              method: "GET",
              headers,
            });
            if (!res.ok) return { id, full_name: "Nome não encontrado" };
            const data = await res.json();
            return { id, full_name: data?.[0]?.full_name || "Nome não encontrado" };
          } catch {
            return { id, full_name: "Nome não encontrado" };
          }
        });

        const results = await Promise.all(promises);
        const map = {};
        results.forEach((r) => (map[r.id] = r.full_name));
        setMedicosMap(map);
      } catch (err) {
        console.error("Erro ao buscar nomes dos médicos:", err);
      }
    };

    buscarMedicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consulta]);
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Extrai data e hora diretamente da string ISO sem conversão de timezone
      const [datePart, timePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      
      return `${day}/${month}/${year} ${hour}:${minute}`;
    } catch {
      return dateString;
    }
  };
  const handleConfirm = async (id) => {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/appointments?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ status: "confirmed" })
      }
    );

    if (response.ok) {
      // Atualiza o estado local
      setConsultas((prev) => 
        prev.map((c) => 
          c.id === id ? { ...c, status: "confirmed" } : c
        )
      );
      
      Swal.fire({
        title: "Confirmado!",
        text: "Consulta confirmada com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      throw new Error('Falha na confirmação');
    }
  } catch (error) {
    console.error("Erro ao confirmar:", error);
    Swal.fire("Erro", "Não foi possível confirmar a consulta.", "error");
  }
};

const handleCancel = async (id) => {
  const confirm = await Swal.fire({
    title: "Cancelar consulta?",
    text: "Esta ação irá cancelar a consulta.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e63946",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Cancelar consulta",
    cancelButtonText: "Voltar",
  });

  if (!confirm.isConfirmed) return;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/appointments?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
        },
        body: JSON.stringify({ status: "cancelled" })
      }
    );

    if (response.ok) {
      setConsultas((prev) => 
        prev.map((c) => 
          c.id === id ? { ...c, status: "cancelled" } : c
        )
      );
      
      Swal.fire({
        title: "Cancelado!",
        text: "Consulta cancelada com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      throw new Error('Falha no cancelamento');
    }
  } catch (error) {
    console.error("Erro ao cancelar:", error);
    Swal.fire("Erro", "Não foi possível cancelar a consulta.", "error");
  }
};

  const navigate = useNavigate();
  const role = getUserRole();
  const permissoes = {
  admin: ['editconsulta', 'deletarconsulta', 'consultaform', 'viewactionconsultas'],
  medico: ['editconsulta', 'deletarconsulta', 'consultaform', 'viewactionconsultas'],
  secretaria: ['editconsulta', 'deletarconsulta', 'consultaform', 'viewactionconsultas'],
  paciente: ['']
};
  const pode = (acao) => permissoes[role]?.includes(acao);
  return (
    <div className="main-wrapper">
    <div className="page-wrapper">
    <div className="content">
      <div className="row">
        <div className="col-12">
          {pode('consultaform') &&  (
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h4 className="page-title mb-0">Lista de consultas</h4>
            <Link to={`/${role}/consultaform`} className="btn btn-primary btn-rounded" >
              <i className="fa fa-plus"></i> Adicionar consulta
            </Link>
          </div>
          )}
          
          {/* Todos os filtros em uma única linha */}
          <div className="d-flex align-items-center mb-3" style={{ gap: "0.30rem", flexWrap: "nowrap", overflowX: "auto", height: "40px" }}>
            {/* Campo de busca */}
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍  Buscar consulta"
              style={{ minWidth: "300px", maxWidth: "450px", }}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            {/* Filtro de status */}
            <select
              className="form-control form-control-sm"
              style={{ minWidth: "80px", maxWidth: "125px", }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="requested">Solicitado</option>
              <option value="confirmed">Confirmado</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>

            {/* Filtro De */}
            <div className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
              <label className="mb-0" style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>De:</label>
              <input 
                type="date" 
                className="form-control form-control-sm"
                style={{ minWidth: "130px", }}
                value={startDate} 
                onChange={e => {
                  setStartDate(e.target.value);
                  if (e.target.value) setPeriod("");
                }} 
              />
            </div>
            
            {/* Filtro Até */}
            <div className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
              <label className="mb-0" style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>Até:</label>
              <input 
                type="date" 
                className="form-control form-control-sm"
                style={{ minWidth: "130px", }}
                value={endDate} 
                onChange={e => {
                  setEndDate(e.target.value);
                  if (e.target.value) setPeriod("");
                }} 
              />
            </div>

            {/* Botões rápidos */}
            <button 
              className={`btn btn-sm ${period === "today" ? "btn-primary" : "btn-outline-primary"}`} 
              style={{ minWidth: "60px",  padding: "4px 8px", fontSize: "0.8rem" }}
              onClick={() => handlePeriodChange("today")}
            >
              Hoje
            </button>
            <button 
              className={`btn btn-sm ${period === "week" ? "btn-primary" : "btn-outline-primary"}`} 
              style={{ minWidth: "70px",  padding: "4px 8px", fontSize: "0.8rem" }}
              onClick={() => handlePeriodChange("week")}
            >
              Semana
            </button>
            <button 
              className={`btn btn-sm ${period === "month" ? "btn-primary" : "btn-outline-primary"}`} 
              style={{ minWidth: "60px",  padding: "4px 8px", fontSize: "0.8rem" }}
              onClick={() => handlePeriodChange("month")}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-striped custom-table">
              <thead>
                <tr>
                   <th className="text-center">Pedido</th>
                  <th className="text-center">Nome do Paciente</th>
                  <th className="text-center">Nome do Médico</th>
                  <th className="text-center">Agendado</th>
                  <th className="text-center">Duração</th>
                  <th className="text-center">Modo</th>
                  <th className="text-center">Status</th>
                    <th className="text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {currentConsultas.length > 0 ? (
                  currentConsultas.map((c) => (
                    <tr key={c.id}>
                      <td className="text-center">{c.order_number}</td>
                      <td className="text-center">{pacientesMap[c.patient_id] || "Carregando..."}</td>
                      <td className="text-center">{medicosMap[c.doctor_id] || "Carregando..."}</td>
                      <td className="text-center">{formatDate(c.scheduled_at)}</td>
                      <td className="text-center">{c.duration_minutes} min</td>
                      <td className="text-center">
                        <span 
                          className={`custom-badge ${
                            c.appointment_type === 'presencial' ? 'status-green' :
                            c.appointment_type === 'telemedicina' ? 'status-blue' :
                            'status-gray'
                          }`}
                          style={{ minWidth: '110px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {c.appointment_type === 'presencial' ? (
                            <>
                              <i className="fa fa-hospital-o" style={{ marginRight: '6px' }}></i>
                              Presencial
                            </>
                          ) : c.appointment_type === 'telemedicina' ? (
                            <>
                              <i className="fa fa-video-camera" style={{ marginRight: '6px' }}></i>
                              Telemedicina
                            </>
                          ) : (
                            c.appointment_type
                          )}
                        </span>
                      </td>
                      <td className="text-center">
                        
                        <span
                          className={`custom-badge ${
                            c.status === 'requested' ? 'status-orange' :
                            c.status === 'confirmed' ? 'status-blue' :
                            c.status === 'completed' ? 'status-green' :
                            c.status === 'cancelled' ? 'status-red' :
                            'status-gray'
                          }`}
                          style={{ minWidth: '120px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {c.status === 'requested' ? (
                            <>
                              <i className="fa fa-clock-o" style={{ marginRight: '6px' }}></i>
                              Solicitado
                            </>
                          ) : c.status === 'confirmed' ? (
                            <>
                              <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>
                              Confirmado
                            </>
                          ) : c.status === 'completed' ? (
                            <>
                              <i className="fa fa-check" style={{ marginRight: '6px' }}></i>
                              Concluído
                            </>
                          ) : c.status === 'cancelled' ? (
                            <>
                              <i className="fa fa-times-circle" style={{ marginRight: '6px' }}></i>
                              Cancelado
                            </>
                          ) : (
                            <>
                              <i className="fa fa-question-circle" style={{ marginRight: '6px' }}></i>
                              {c.status}
                            </>
                          )}
                        </span>
                      </td>
                        <td className="text-right">
                        <div className="action-buttons-container">
                          {pode('editconsulta') &&  (
                              <button
                                type="button"
                                className="action-btn action-btn-edit"
                                onClick={() => navigate(`/${role}/editconsulta/${c.id}`)}
                                title="Editar consulta"
                              >
                                <span className="fa fa-pencil m-r-5"></span>
                              </button>
                            )}
                              {c.appointment_type === 'telemedicina' && (
                               <button
                                 type="button"
                                 className="action-btn action-btn-video"
                                 onClick={() => navigate(`/call/${c.id}`)}
                                 title="Entrar na sala de vídeo"
                               >
                                 <span className="fa fa-video-camera m-r-5"></span>
                               </button>
                              )}
                              {c.status === 'requested' && pode('viewactionconsultas') &&  (
                                <>
                                  <button
                                    type="button"
                                    className="action-btn action-btn-edit"
                                    onClick={() => handleConfirm(c.id)}
                                    title="Confirmar consulta"
                                    
                                  >
                                    <span className="fa fa-check"></span>
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn action-btn-delete"
                                    onClick={() => handleCancel(c.id)}
                                    title="Cancelar consulta"
                                    
                                  >
                                    <span className="fa fa-times"></span>
                                  </button>
                                </>
                                )}
                              
                            </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      Nenhuma consulta encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {/* Ir para a primeira página */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(1)}>
                  {"<<"} {/* ou "Início" */}
                </button>
              </li>

              {/* Botão de página anterior */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => currentPage1 > 1 && setCurrentPage1(currentPage1 - 1)}
                >
                  &lt;
                </button>
              </li>

              {/* Números de página */}

              <li className="page-item active">
                <span className="page-link">{currentPage1}</span>
              </li>
              {/* Botão de próxima página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage1 < totalPages1 && setCurrentPage1(currentPage1 + 1)
                  }
                >
                  &gt;
                </button>
              </li>


              {/* Ir para a última página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>
                  {">>"} {/* ou "Fim" */}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div> 
</div>
  );
}

export default ConsultaList;