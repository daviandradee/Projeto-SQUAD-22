// PatientList.jsx
import { Link } from "react-router-dom";
import "../../../assets/css/index.css";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
// se for usar supabase para delete, senão pode remover

// Componente que renderiza o menu em um portal (document.body) e posiciona em relação ao botão
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

function DoctorPatientList() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({}); // guarda referência do botão de cada linha

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  useEffect(() => {
    fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("API result:", result);
        setPatients(result.data || []);
      })
      .catch((error) => console.log("error", error));
  }, []);

  // Exemplo simples de delete local (confirmação + remove do state)
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

    setPatients((prev) => prev.filter((p) => p.id !== id));
    setOpenDropdown(null);
  };

  const filteredPatients = patients.filter((p) => {
    if (!p) return false;
    const nome = (p.nome || "").toLowerCase();
    const cpf = (p.cpf || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const q = search.toLowerCase();
    return nome.includes(q) || cpf.includes(q) || email.includes(q);
  });

  const mascararCPF = (cpf = "") => {
    if (cpf.length < 5) return cpf;
    const inicio = cpf.slice(0, 3);
    const fim = cpf.slice(-2);
    return `${inicio}.***.***-${fim}`;
  };

  return (
        <div className="content">
          <div className="row ">
            <div className="col-sm-4 col-3">
                <h4 className="page-title">Lista de Pacientes</h4>
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍  Buscar pacientes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <br />
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link to="/patient" className="btn btn-primary btn-rounded">
                <i className="fa fa-plus"></i> Adicionar Paciente
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Cpf</th>
                      <th>Data de Nascimento</th>
                      <th>Telefone</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((p) => (
                        <tr key={p.id}>
                          <td>{p.nome}</td>
                          <td>{mascararCPF(p.cpf)}</td>
                          <td>{p.data_nascimento}</td>
                          <td>{p.telefone}</td>
                          <td>{p.email}</td>
                          <td>{p.status}</td>
                          <td className="text-right">
                            <div className="dropdown dropdown-action" style={{ display: "inline-block" }}>
                              <button
                                type="button"
                                ref={(el) => (anchorRefs.current[p.id] = el)}
                                className="action-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(openDropdown === p.id ? null : p.id);
                                }}

                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </button>

                              <DropdownPortal
                                anchorEl={anchorRefs.current[p.id]}
                                isOpen={openDropdown === p.id}
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
                                  to={`/editpatient/${p.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <i className="fa fa-pencil m-r-5"></i> Editar
                                </Link>

                                <button
                                  className="dropdown-item-custom dropdown-item-delete"
                                  onClick={() => handleDelete(p.id)}
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
            </div>
          </div>
        </div>
  );
}

export default DoctorPatientList;
;