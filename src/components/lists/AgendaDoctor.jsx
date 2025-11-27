import "../../assets/css/index.css"
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { getAccessToken } from "../../utils/auth.js";
import { getUserRole } from "../../utils/userInfo.js";
import { getDoctorId } from "../../utils/userInfo.js";

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Componente para o dropdown portal
function DropdownPortal({ anchorEl, isOpen, onClose, className, children }) {
  const menuRef = useRef(null);
  const [stylePos, setStylePos] = useState({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    zIndex: 1000,
  });

  useLayoutEffect(() => {
    if (!isOpen || !anchorEl || !menuRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    let left = anchorRect.right + scrollX - menuRect.width;
    let top = anchorRect.bottom + scrollY;

    if (left < 0) left = scrollX + 4;
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

  useEffect(() => {
    if (!isOpen) return;

    function handleDocClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        anchorEl &&
        !anchorEl.contains(e.target)
      ) {
        onClose();
      }
    }

    function handleScroll() {
      onClose();
    }

    document.addEventListener("mousedown", handleDocClick);
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
      className={className}
      style={stylePos}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

function AgendaDoctor() {
  const [agenda, setAgenda] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [search, setSearch] = useState("");
    const [dayFilter, setDayFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
      doctor_id: "",
      weekday: "",
      start_time: "",
      end_time: "",
      slot_minutes: 30,
      appointment_type: "",
      active: true,
    });
    const anchorRefs = useRef({});
    const role = getUserRole();
    const tokenUsuario = getAccessToken();
  
    const requestOptions = {
      method: "GET",
      headers: {
        apikey:
          supabaseAK,
        Authorization: `Bearer ${tokenUsuario}`,
      },
      redirect: "follow",
    };
  
    // Fetch agenda
    useEffect(() => {
      if (getUserRole() === 'medico') {
        fetch(
          `${supabaseUrl}/rest/v1/doctor_availability?doctor_id=eq.${getDoctorId()}`,
          requestOptions
        )
        .then((res) => res.json())
        .then((result) => setAgenda(Array.isArray(result) ? result : []))
        .catch((err) => console.log(err));
      } else {
        fetch(
          `${supabaseUrl}/rest/v1/doctor_availability`,
          requestOptions
        )
        .then((res) => res.json())
        .then((result) => setAgenda(Array.isArray(result) ? result : []))
        .catch((err) => console.log(err));
      }
    }, []);
  
    // Fetch médicos
    useEffect(() => {
      fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", requestOptions)
        .then((res) => res.json())
        .then((result) => setMedicos(Array.isArray(result) ? result : []))
        .catch((err) => console.log(err));
    }, []);
  
    const getDoctorName = (id) => {
      if (!id) return "";
      const medico = medicos.find((m) => m.id === id);
      return medico ? medico.full_name || medico.name || "" : id;
    };
  
    // DELETE
    const handleDelete = (id) => setDeleteId(id);
  
    const confirmDelete = () => {
      if (!deleteId) return;
  
      fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability?id=eq.${deleteId}`,
        {
          method: "DELETE",
          headers: {
            apikey:
              supabaseAK,
            Authorization: `Bearer ${tokenUsuario}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao deletar a agenda");
          setAgenda((prev) => prev.filter((a) => a.id !== deleteId));
          setDeleteId(null);
        })
        .catch((err) => console.log(err));
    };
  
    // EDIT
    const handleEditClick = (id) => {
      const agendaItem = agenda.find((a) => a.id === id);
      if (!agendaItem) return;
  
      setEditData({
        doctor_id: agendaItem.doctor_id || "",
        weekday: agendaItem.weekday || "",
        start_time: agendaItem.start_time || "",
        end_time: agendaItem.end_time || "",
        slot_minutes: agendaItem.slot_minutes || 30,
        appointment_type: agendaItem.appointment_type || "",
        active: agendaItem.active ?? true,
      });
      setEditId(id);
      setOpenDropdown(null);
    };
  
    const handleEditChange = (e) => {
      const { name, value, type, checked } = e.target;
      setEditData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    const submitEdit = () => {
      if (!editId) return;
  
      if (!editData.doctor_id) {
        alert("Selecione um médico válido.");
        return;
      }
      if (!editData.weekday || !editData.start_time || !editData.end_time || !editData.appointment_type) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }
  
      fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability?id=eq.${editId}`,
        {
          method: "PATCH",
          headers: {
            apikey:
              supabaseAK,
            Authorization: `Bearer ${tokenUsuario}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation", // ESSENCIAL
          },
          body: JSON.stringify(editData),
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao salvar alterações");
          return res.json();
        })
        .then((updated) => {
          setAgenda((prev) =>
            prev.map((a) => (a.id === editId ? { ...a, ...updated[0] } : a))
          );
          setEditId(null);
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao salvar alterações. Verifique os campos e tente novamente.");
        });
    };
  
    const filteredAgenda = agenda.filter((a) => {
      if (!a) return false;
      const q = search.toLowerCase();
      
      // Filtro por texto (nome do médico, dia, tipo)
      const matchesText = (
        (getDoctorName(a.doctor_id) || "").toLowerCase().includes(q) ||
        (a.weekday || "").toLowerCase().includes(q) ||
        (a.appointment_type || "").toLowerCase().includes(q)
      );
      
      // Filtro por dia da semana
      const matchesDay = !dayFilter || a.weekday === dayFilter;
      
      // Filtro por tipo de consulta
      const matchesType = !typeFilter || a.appointment_type === typeFilter;
      
      return matchesText && matchesDay && matchesType;
    });

    // Paginação
    const [itemsPerPage1, setItemsPerPage1] = useState(15);
    const [currentPage1, setCurrentPage1] = useState(1);
    const indexOfLastAgenda = currentPage1 * itemsPerPage1;
    const indexOfFirstAgenda = indexOfLastAgenda - itemsPerPage1;
    const currentAgenda = filteredAgenda.slice(indexOfFirstAgenda, indexOfLastAgenda);
    const totalPages1 = Math.ceil(filteredAgenda.length / itemsPerPage1);

    // Reset da paginação quando filtros mudam
    useEffect(() => {
      setCurrentPage1(1);
    }, [search, dayFilter, typeFilter]);
    const permissoes = {
    admin: ['nome'],
    secretaria: ['nome'],
    medico: ['']
  };
  const pode = (acao) => permissoes[role]?.includes(acao);
    return (
      <div className="page-wrapper">
      <div className="content">
        {/* Header com título e botão */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h4 className="page-title mb-0">Agenda Médica</h4>
          <Link to={`/${role}/agendaform`} className="btn btn-primary btn-rounded">
            <i className="fa fa-plus"></i> Adicionar agenda
          </Link>
        </div>

        {/* Todos os filtros em uma única linha */}
        <div className="d-flex align-items-center mb-3" style={{ gap: "0.5rem", flexWrap: "nowrap", overflowX: "auto", height: "40px" }}>
          {/* Campo de busca */}
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="🔍 Buscar agenda"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: "300px", maxWidth: "450px", }}
          />
          
          {/* Filtro por dia da semana */}
          <select
            className="form-control form-control-sm"
            style={{ minWidth: "100px", maxWidth: "140px" }}
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
          >
            <option value="">Todos os dias</option>
            <option value="monday">Segunda-feira</option>
            <option value="tuesday">Terça-feira</option>
            <option value="wednesday">Quarta-feira</option>
            <option value="thursday">Quinta-feira</option>
            <option value="friday">Sexta-feira</option>
            <option value="saturday">Sábado</option>
            <option value="sunday">Domingo</option>
          </select>
          
          {/* Filtro por tipo de consulta */}
          <select
            className="form-control form-control-sm"
            style={{ minWidth: "100px", maxWidth: "140px" }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="presencial">Presencial</option>
            <option value="telemedicina">Telemedicina</option>
          </select>
        </div>
  
        {/* Tabela */}
        <div className="table-responsive">
          <table className="table table-border table-striped custom-table datatable mb-0">
            <thead>
              <tr>
                {pode('nome') && <th>Nome</th>}
                <th>Dias disponíveis</th>
                <th>Horário disponível</th>
                <th>Duração (min)</th>
                <th>Tipo</th>
                <th>Status</th>
                <th className="text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {currentAgenda.length > 0 ? (
                currentAgenda.map((a) => (
                  <tr key={a.id}>
                    {pode('nome') && <td>{getDoctorName(a.doctor_id)}</td>}
                    <td>
                      <span className="custom-badge status-blue" style={{ minWidth: '90px', display: 'inline-block', textAlign: 'center' }}>
                        <i className="fa fa-calendar" style={{ marginRight: '6px' }}></i>
                        {a.weekday === 'monday' ? 'Segunda' :
                         a.weekday === 'tuesday' ? 'Terça' :
                         a.weekday === 'wednesday' ? 'Quarta' :
                         a.weekday === 'thursday' ? 'Quinta' :
                         a.weekday === 'friday' ? 'Sexta' :
                         a.weekday === 'saturday' ? 'Sábado' :
                         a.weekday === 'sunday' ? 'Domingo' :
                         a.weekday}
                      </span>
                    </td>
                    <td>
                      {a.start_time || ""} ás {a.end_time || ""}
                    </td>
                    <td>{a.slot_minutes || 30}</td>
                    <td>
                      <span 
                        className={`custom-badge ${
                          a.appointment_type === 'presencial' ? 'status-green' :
                          a.appointment_type === 'telemedicina' ? 'status-blue' :
                          'status-gray'
                        }`}
                        style={{ width: '120px', minWidth: '120px', maxWidth: '120px', display: 'inline-block', textAlign: 'center' }}
                      >
                        {a.appointment_type === 'presencial' ? (
                          <>
                            <i className="fa fa-hospital-o" style={{ marginRight: '6px' }}></i>
                            Presencial
                          </>
                        ) : a.appointment_type === 'telemedicina' ? (
                          <>
                            <i className="fa fa-video-camera" style={{ marginRight: '6px' }}></i>
                            Telemedicina
                          </>
                        ) : (
                          a.appointment_type
                        )}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`custom-badge ${
                          a.active ? "status-green" : "status-red"
                        }`}
                        style={{ minWidth: '80px', display: 'inline-block', textAlign: 'center' }}
                      >
                        {a.active ? (
                          <>
                            <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>
                            Ativo
                          </>
                        ) : (
                          <>
                            <i className="fa fa-times-circle" style={{ marginRight: '6px' }}></i>
                            Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="text-center">
                        <div className="action-buttons-container">
                          <button
                            type="button"
                            className="action-btn action-btn-edit"
                            onClick={() => handleEditClick(a.id)}
                            title="Editar agenda"
                          >
                            <span className="fa fa-pencil m-r-5"></span>
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn-delete"
                            onClick={() => handleDelete(a.id)}
                            title="Excluir agenda"
                          >
                            <span className="fa fa-trash-o"></span>
                          </button>
                        </div>
                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Nenhuma agenda encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
                                          <div className="d-flex flex-wrap align-items-center mt-3">
                <div className="me-3 text-muted" style={{ minWidth: '140px', fontSize: '0.98em', paddingRight: '3%' }}>
                  Total encontrados: <b>{filteredAgenda.length}</b>
                </div>
                <div style={{ minWidth: '140px' }}>
                  <select
                    className="form-control form-control-sm"
                    style={{ minWidth: "110px", maxWidth: "140px", display: 'inline-block' }}
                    value={itemsPerPage1}
                    onChange={e => {
                      setItemsPerPage1(Number(e.target.value));
                      setCurrentPage1(1);
                    }}
                    title="Itens por página"
                  >
                    <option value={10}>10 por página</option>
                    <option value={15}>15 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={30}>30 por página</option>
                  </select>
                </div>
              </div>
              <div className="w-100 d-flex justify-content-center mt-2">
                <nav>
                  <ul className="pagination mb-0 justify-content-center">
                    {/* Primeira página */}
                    <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage1(1)}>
                        {"<<"}
                      </button>
                    </li>
                    {/* Página anterior */}
                    <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage1(prev => Math.max(prev - 1, 1))}>
                        &lt;
                      </button>
                    </li>
                    {/* Número da página atual */}
                    <li className="page-item active">
                      <span className="page-link">{currentPage1}</span>
                    </li>
                    {/* Próxima página */}
                    <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage1(prev => Math.min(prev + 1, totalPages1))}>
                        &gt;
                      </button>
                    </li>
                    {/* Última página */}
                    <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>
                        {">>"}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
  
        {/* Modal de Delete */}
        {deleteId && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <img src="/img/sent.png" alt="" width="50" height="46" />
                  <h3>Tem certeza que deseja deletar esta agenda?</h3>
                  <div className="mt-3">
                    <button
                      className="btn btn-white me-2"
                      onClick={() => setDeleteId(null)}
                    >
                      Fechar
                    </button>
                    <button className="btn btn-danger" onClick={confirmDelete}>
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Modal de Edit */}
        {editId && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Disponibilidade</h5>
                  <button className="btn-close" onClick={() => setEditId(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label>Médico</label>
                    <select
                      className="form-control"
                      name="doctor_id"
                      value={editData.doctor_id}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Selecione o médico</option>
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.full_name || m.name}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  <div className="mb-2">
                    <label>Dia da semana</label>
                    <select
                      className="form-control"
                      name="weekday"
                      value={editData.weekday}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Selecione o dia</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
  
                  <div className="mb-2">
                    <label>Início</label>
                    <input
                      type="time"
                      className="form-control"
                      name="start_time"
                      value={editData.start_time}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
  
                  <div className="mb-2">
                    <label>Fim</label>
                    <input
                      type="time"
                      className="form-control"
                      name="end_time"
                      value={editData.end_time}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
  
                  <div className="mb-2">
                    <label>Duração (min)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="slot_minutes"
                      value={editData.slot_minutes}
                      onChange={handleEditChange}
                      min={1}
                      required
                    />
                  </div>
  
                  <div className="mb-2">
                    <label>Tipo de consulta</label>
                    <select
                      className="form-control"
                      name="appointment_type"
                      value={editData.appointment_type}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="presencial">Presencial</option>
                      <option value="telemedicina">Telemedicina</option>
                    </select>
                  </div>
  
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="active"
                      checked={editData.active}
                      onChange={handleEditChange}
                    />
                    <label className="form-check-label">Ativo</label>
                  </div>
                </div>
  
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditId(null)}>
                    Fechar
                  </button>
                  <button className="btn btn-primary" onClick={submitEdit}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    );
  }
export default AgendaDoctor;
