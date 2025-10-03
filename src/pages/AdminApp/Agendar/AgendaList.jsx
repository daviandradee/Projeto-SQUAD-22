import "../../../assets/css/index.css"
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
    
    let timeoutId;
    
    function handleOutsideClick(e) {
      // Usa setTimeout para garantir que o evento seja processado após o clique no botão
      timeoutId = setTimeout(() => {
        if (menuRef.current && anchorEl) {
          const isInsideMenu = menuRef.current.contains(e.target);
          const isInsideButton = anchorEl.contains(e.target);
          
          if (!isInsideMenu && !isInsideButton) {
            onClose();
          }
        }
      }, 0);
    }
    
    function handleMouseDown(e) {
      if (menuRef.current && anchorEl) {
        const isInsideMenu = menuRef.current.contains(e.target);
        const isInsideButton = anchorEl.contains(e.target);
        
        if (!isInsideMenu && !isInsideButton) {
          onClose();
        }
      }
    }
    
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    
    function handleScroll() {
      onClose();
    }
    
    // Adiciona múltiplos eventos para máxima compatibilidade
    document.addEventListener("click", handleOutsideClick, true);
    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", handleScroll, true);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("click", handleOutsideClick, true);
      document.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;
  return createPortal(
    <div
      ref={menuRef}
      className={className} // mantém as classes que você já usa no CSS
      style={stylePos}
    >
      {children}
    </div>,
    document.body
  );
}

function AgendaList() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const [consulta, setConsultas] = useState([]);
  const [search, setSearch] = useState("");
  const tokenUsuario = getAccessToken()


  var myHeaders = new Headers();
  myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  useEffect(() => {
    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients`, requestOptions)
      .then(response => response.json())
      .then(result => setConsultas(Array.isArray(result) ? result : []))
      .catch(error => console.log('error', error));
  }, [])

  const handleDelete = async (id) => {
    const confirmDel = window.confirm("Tem certeza que deseja excluir este paciente?");
    if (!confirmDel) return;

    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };

    fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    // Se quiser apagar no supabase, faça a chamada aqui.
    // const { error } = await supabase.from("Patient").delete().eq("id", id);
    // if (error) { console.error(error); return; }

    setConsultas((prev) => prev.filter((c) => c.id !== id));
    setOpenDropdown(null);
  };

  const filteredConsultas = consulta.filter(p => {
    if (!p) return false;
    const nome = (p.full_name || "").toLowerCase();
    const cpf = (p.cpf || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const q = search.toLowerCase();
    return nome.includes(q) || cpf.includes(q) || email.includes(q);
  });
  const [itemsPerPage1] = useState(10);
  const [currentPage1, setCurrentPage1] = useState(1);
  const indexOfLastPatient = currentPage1 * itemsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
  const currentConsultas = filteredConsultas.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages1 = Math.ceil(filteredConsultas.length / itemsPerPage1);
  useEffect(() => {
    setCurrentPage1(1);
  }, [search]);

  return (
    <div className="main-wrapper">
    <div className="page-wrapper">
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
                  <th>Nome do Paciente</th>
                  <th>Data de Nascimento</th>
                  <th>Nome do médico</th>
                  <th>Especialidade</th>
                  <th>Data da consulta</th>
                  <th>Hora da consulta</th>
                  <th>Status</th>
                  <th className="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {currentConsultas.length > 0 ? (
                  currentConsultas.map((c) => (
                    <tr key={c.id}>
                      <td>{c.full_name}</td>
                      <td>{c.birth_date}</td>
                      <td>Davi Andrade</td>
                      <td>Cardiologista</td>
                      <td>{c.created_at}</td>
                      <td>10:00am - 11:00am</td>
                      <td>
                        <span className="custom-badge status-green">
                          Ativo
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
  </div> 
</div>
  );
}

export default AgendaList;