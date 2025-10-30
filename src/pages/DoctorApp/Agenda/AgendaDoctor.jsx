import "../../../assets/css/index.css"
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { getAccessToken } from "../../../utils/auth";
import { Link } from "react-router-dom";

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

function AgendaDoctor() {
  const [agenda, setAgenda] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [search, setSearch] = useState("");
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

  const tokenUsuario = getAccessToken();

  const requestOptions = {
    method: "GET",
    headers: {
      apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
      Authorization: `Bearer ${tokenUsuario}`,
    },
    redirect: "follow",
  };

  // Fetch agenda
  useEffect(() => {
    fetch(
      `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctor_availability`,
      requestOptions
    )
      .then((res) => res.json())
      .then((result) => setAgenda(Array.isArray(result) ? result : []))
      .catch((err) => console.log(err));
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
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
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
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
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
    return (
      (getDoctorName(a.doctor_id) || "").toLowerCase().includes(q) ||
      (a.weekday || "").toLowerCase().includes(q) ||
      (a.appointment_type || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="content">
      {/* Cabeçalho e botão Adicionar */}
      <div className="row mb-3">
        <div className="col-md-6">
          <h4 className="page-title">Agenda Médica</h4>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar agenda"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-sm-6 col-9 text-right m-b-20">
          <Link to="/doctor/doctoragendaadd" className="btn btn-primary btn-rounded">
            <i className="fa fa-plus"></i> Adicionar agenda
          </Link>
        </div>
      </div>

      {/* Tabela */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped custom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Dias disponíveis</th>
              <th>Horário disponível</th>
              <th>Duração (min)</th>
              <th>Tipo</th>
              <th>Status</th>
              <th className="text-end">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgenda.length > 0 ? (
              filteredAgenda.map((a) => (
                <tr key={a.id}>
                  <td>{getDoctorName(a.doctor_id)}</td>
                  <td>{a.weekday || ""}</td>
                  <td>
                    {a.start_time || ""} - {a.end_time || ""}
                  </td>
                  <td>{a.slot_minutes || 30}</td>
                  <td>{a.appointment_type || ""}</td>
                  <td>
                    <span
                      className={`custom-badge ${
                        a.active ? "status-green" : "status-red"
                      }`}
                    >
                      {a.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="text-end">
                    <div style={{ display: "inline-block" }}>
                      <button
                        ref={(el) => (anchorRefs.current[a.id] = el)}
                        className="action-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === a.id ? null : a.id);
                        }}
                      >
                        <i className="fa fa-ellipsis-v"></i>
                      </button>

                      <DropdownPortal
                        anchorEl={anchorRefs.current[a.id]}
                        isOpen={openDropdown === a.id}
                        onClose={() => setOpenDropdown(null)}
                        className="dropdown-menu dropdown-menu-right show"
                      >
                        <Link
                          className="dropdown-item-custom"
                          onClick={() => handleEditClick(a.id)}
                        >
                          <i className="fa fa-pencil m-r-5"></i> Editar
                        </Link>
                        <button
                          className="dropdown-item-custom dropdown-item-delete"
                          onClick={() => handleDelete(a.id)}
                        >
                          <i className="fa fa-trash-o m-r-5"></i> Excluir
                        </button>
                      </DropdownPortal>
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
  );
}
export default AgendaDoctor;