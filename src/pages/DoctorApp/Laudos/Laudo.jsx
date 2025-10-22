import "../../../assets/css/index.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2"; // 🧁 importando SweetAlert2
import { getAccessToken } from "../../../utils/auth";
import { useResponsive } from '../../../utils/useResponsive';

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
      const menu = menuRef.current;
      if (menu && !menu.contains(e.target) && anchorEl && !anchorEl.contains(e.target)) {
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
    <div ref={menuRef} className={className} style={stylePos} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>,
    document.body
  );
}

function LaudoListDoctor() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const [consultas, setConsultas] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const tokenUsuario = getAccessToken();
  const navigate = useNavigate();
  const [pacientesMap, setPacientesMap] = useState({});
  
  const ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  const doctor_id = 	"c7fcd702-9a6e-4b7c-abd3-956b25af407d";

  // 🔹 Listar consultas do médico logado
  useEffect(() => {
  var myHeaders = new Headers();
  myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

    fetch(
      `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports?doctor_id=eq.${doctor_id}`, requestOptions

    )
      .then((res) => res.json())
      .then((result) => setConsultas(Array.isArray(result) ? result : []))
      .catch((err) => console.error("Erro ao buscar consultas:", err));
  }, [doctor_id, tokenUsuario]);
  useEffect(() => {
    if (!consultas || consultas.length === 0) return;

    const buscarPacientes = async () => {
      try {
        // Pega IDs únicos de pacientes
        const idsUnicos = [...new Set(consultas.map((c) => c.patient_id))];

        // Faz apenas 1 fetch por paciente
        const promises = idsUnicos.map(async (id) => {
          try {
            const res = await fetch(
              `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients?id=eq.${id}`,
              {
                method: "GET",
                headers: {
                  apikey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
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
  }, [consultas]);
  // 👁️ Ver detalhes da consulta
  const handleView = async (id) => {
    const headers = new Headers({
      apikey: ANON_KEY,
      Authorization: `Bearer ${tokenUsuario}`,
      "Content-Type": "application/json",
    });

    try {
      const res = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${id}`,
        { method: "GET", headers }
      );
      const data = await res.json();
      const consulta = Array.isArray(data) ? data[0] : data;

      if (!consulta) {
        Swal.fire("Erro", "Consulta não encontrada.", "error");
        return;
      }

      Swal.fire({
        title: "Detalhes da Consulta",
        html: `
          <b>Paciente:</b> ${consulta.patient_id || "—"}<br/>
          <b>Médico:</b> ${consulta.doctor_name || "—"}<br/>
          <b>Especialidade:</b> ${consulta.specialty || "—"}<br/>
          <b>Data:</b> ${consulta.date || "—"}<br/>
          <b>Hora:</b> ${consulta.time || "—"}<br/>
          <b>Status:</b> ${consulta.status || "—"}<br/>
        `,
        icon: "info",
        confirmButtonText: "Fechar",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      Swal.fire("Erro", "Falha ao buscar detalhes da consulta.", "error");
    }

    setOpenDropdown(null);
  };

  // 🗑️ Excluir consulta
  const handleDelete = async (id) => {
    const confirmDel = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta consulta será excluída permanentemente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirmDel.isConfirmed) {
      setOpenDropdown(null);
      return;
    }

    const headers = new Headers({
      apikey: ANON_KEY,
      Authorization: `Bearer ${tokenUsuario}`,
    });

    try {
      const res = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${id}`,
        { method: "DELETE", headers }
      );

      if (!res.ok) throw new Error("Falha ao excluir consulta");

      setConsultas((prev) => prev.filter((c) => String(c.id) !== String(id)));

      Swal.fire("Excluída!", "A consulta foi removida com sucesso.", "success");
    } catch (err) {
      Swal.fire("Erro", "Não foi possível excluir a consulta.", "error");
    }

    setOpenDropdown(null);
  };

  const filtered = consultas.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.patient_name || "").toLowerCase().includes(q) ||
      (c.doctor_name || "").toLowerCase().includes(q) ||
      (c.specialty || "").toLowerCase().includes(q)
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  useEffect(() => setCurrentPage(1), [search]);
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };
  return (
    <div className="content">
      <div className="row">
        <div className="col-sm-4 col-3">
          <h4 className="page-title">Laudos</h4>
          <input
            type="text"
            className="form-control"
            placeholder="🔍  Buscar consulta"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <br />
        </div>

        <div className="col-sm-8 col-9 text-right m-b-20">
          <Link to="/doctor/DoctorConsultaForm" className="btn btn-primary btn-rounded">
            <i className="fa fa-plus"></i> Adicionar consulta
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-striped custom-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Agendado</th>
                  <th>Queixa Principal</th>
                  <th>Duração</th>
                  <th>Modo</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {current.length > 0 ? (
                  current.map((c) => (
                    <tr key={c.id}>
                      <td>{c.patient_id || "—"}</td>
                      <td>{formatDate(c.scheduled_at)|| "—"}</td> 
                      <td>{c.chief_complaint || "—"}</td>
                      <td>{c.duration_minutes} min</td>
                      <td>{c.appointment_type || "—"}</td>
                      <td>
                        <span
                          className={`custom-badge ${
                            c.status === "Ativa" ? "status-green" : "status-grey"
                          }`}
                        >
                          {c.status || "—"}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action" style={{ display: "inline-block" }}>
                          <button
                            type="button"
                            ref={(el) => (anchorRefs.current[c.id] = el)}
                            className="action-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === c.id ? null : c.id);
                            }}
                          >
                            <i className="fa fa-ellipsis-v"></i>
                          </button>

                          <DropdownPortal
                            anchorEl={anchorRefs.current[c.id]}
                            isOpen={openDropdown === c.id}
                            onClose={() => setOpenDropdown(null)}
                            className="dropdown-menu dropdown-menu-right show"
                          >
                            <button
                              className="dropdown-item-custom"
                              onClick={() => handleView(c.id)}
                            >
                              <i className="fa fa-eye m-r-5"></i> Ver
                            </button>

                            <Link
                              className="dropdown-item-custom"
                              to={`/editappointment/${c.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                              }}
                            >
                              <i className="fa fa-pencil m-r-5"></i> Editar
                            </Link>

                            <button
                              className="dropdown-item-custom dropdown-item-delete"
                              onClick={() => handleDelete(c.id)}
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
                      Nenhuma consulta encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(1)}>
                  {"<<"}
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                >
                  &lt;
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">{currentPage}</span>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                >
                  &gt;
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                  {">>"}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default LaudoListDoctor;
