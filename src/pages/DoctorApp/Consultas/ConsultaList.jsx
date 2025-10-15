import "../../../assets/css/index.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2"; // 🧁 importando SweetAlert2
import { getAccessToken } from "../../../utils/auth";

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

function ConsultaList() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const [consultas, setConsultas] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const tokenUsuario = getAccessToken();
  const navigate = useNavigate();

  const ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  const medicoId = localStorage.getItem("user_id");

  // 🔹 Listar consultas do médico logado
  useEffect(() => {
    if (!medicoId) return;
    const headers = new Headers({
      apikey: ANON_KEY,
      Authorization: `Bearer ${tokenUsuario}`,
      "Content-Type": "application/json",
    });

    fetch(
      `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?doctor_id=eq.${medicoId}&select=*`,
      { method: "GET", headers }
    )
      .then((res) => res.json())
      .then((result) => setConsultas(Array.isArray(result) ? result : []))
      .catch((err) => console.error("Erro ao buscar consultas:", err));
  }, [medicoId, tokenUsuario]);

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
          <b>Paciente:</b> ${consulta.patient_name || "—"}<br/>
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

  return (
    <div className="content">
      <div className="row">
        <div className="col-sm-4 col-3">
          <h4 className="page-title">Consultas</h4>
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
                  <th>Médico</th>
                  <th>Especialidade</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {current.length > 0 ? (
                  current.map((c) => (
                    <tr key={c.id}>
                      <td>{c.patient_name || "—"}</td>
                      <td>{c.doctor_name || "—"}</td>
                      <td>{c.specialty || "—"}</td>
                      <td>{c.date || "—"}</td>
                      <td>{c.time || "—"}</td>
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

export default ConsultaList;
