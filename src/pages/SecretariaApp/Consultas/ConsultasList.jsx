import "../../../assets/css/index.css"
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { getAccessToken } from "../../../utils/auth";
import Swal from "sweetalert2";
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

function SecretariaConsultaList() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const [consulta, setConsultas] = useState([]);
  const [search, setSearch] = useState("");
  const tokenUsuario = getAccessToken()
  const [pacientesMap, setPacientesMap] = useState({});
  const [medicosMap, setMedicosMap] = useState({});
  const consultaid = consulta.id;
  const headers = {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
    Authorization: `Bearer ${tokenUsuario}`,
    "Content-Type": "application/json",
  };

  var myHeaders = new Headers();
  myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  useEffect(() => {
    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments`, requestOptions)
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
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/appointments?id=eq.${id}`,
        {
          method: "DELETE",
          headers: myHeaders,
        }
      );
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
    const cpf = (p.cpf || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const q = search.toLowerCase();
    return nome.includes(q) || cpf.includes(q) || email.includes(q);
  });
  const [itemsPerPage1] = useState(15);
  const [currentPage1, setCurrentPage1] = useState(1);
  const indexOfLastPatient = currentPage1 * itemsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
  const currentConsultas = filteredConsultas.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages1 = Math.ceil(filteredConsultas.length / itemsPerPage1);
  useEffect(() => {
    setCurrentPage1(1);
  }, [search]);
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
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
        };

        const promises = idsUnicos.map(async (id) => {
          try {
            const res = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`, {
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
          <h4 className="page-title">Lista de consultas</h4>
          <input
            type="text"
            className="form-control"
            placeholder="🔍  Buscar consulta"
            style={{ minWidth: "200px" }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <br />
        </div>
        <div className="col-sm-8 col-9 text-right m-b-20">
          <Link to="/secretaria/adicionarconsulta" className="btn btn-primary btn-rounded">
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
                  <th>Pedido</th>
                  <th>Nome do Paciente</th>
                  <th>Nome do Médico</th>
                  <th>Agendado</th>
                  <th>
Duração</th>
                  <th>Modo</th>
                  <th>Status</th>
                  <th className="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {currentConsultas.length > 0 ? (
                  currentConsultas.map((c) => (
                    <tr key={c.id}>
                      <td>{c.order_number}</td>
                      <td>{pacientesMap[c.patient_id] || "Carregando..."}</td>
                      <td>{medicosMap[c.doctor_id] || "Carregando..."}</td>
                      <td>{formatDate(c.scheduled_at)}</td>
                      <td>{c.duration_minutes} min</td>
                      <td>{c.appointment_type}</td>
                      <td>
                       {c.status}
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
                            {/*<Link
                                                        className="dropdown-item-custom"
                                                        to={`/profilepatient/${p.id}`}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setOpenDropdown(null);
                                                        }}
                                                      >
                                                        <i className="fa fa-eye"></i> Ver Detalhes
                                                      </Link>*/}

                            <Link
                              className="dropdown-item-custom"
                              to={`/secretaria/editarconsulta/${c.id}`}
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
                      Nenhum paciente encontrado
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
  );
}

export default SecretariaConsultaList;