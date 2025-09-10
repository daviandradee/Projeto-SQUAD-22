import { Link } from "react-router-dom";
import "../../assets/css/index.css";
import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import supabase from "../../Supabase"; 


function DropdownPortal({ anchorEl, isOpen, onClose, className, children }) {
  const menuRef = useRef(null);
  const [stylePos, setStylePos] = React.useState({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    zIndex: 1000,
  });

  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!anchorEl || !menuRef.current) return;

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

  React.useEffect(() => {
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


function LaudoList() {
  const [search, setSearch] = useState("");
  const [laudos, setLaudos] = useState([]); 
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});

  
  const handleDelete = (id) => {
    const confirmDel = window.confirm("Tem certeza que deseja excluir este laudo?");
    if (!confirmDel) return;

    setLaudos((prev) => prev.filter((l) => l.id !== id));
    setOpenDropdown(null);
  };

  
  const filteredLaudos = laudos.filter((l) => {
    if (!l) return false;
    const paciente = (l.paciente || "").toLowerCase();
    const cpf = (l.cpf || "").toLowerCase();
    const tipo = (l.tipo || "").toLowerCase();
    const status = (l.status || "").toLowerCase();
    const q = search.toLowerCase();
    return paciente.includes(q) || cpf.includes(q) || tipo.includes(q) || status.includes(q);
  });

  
  const mascararCPF = (cpf = "") => {
    if (cpf.length < 5) return cpf;
    const inicio = cpf.slice(0, 3);
    const fim = cpf.slice(-2);
    return `${inicio}.***.***-${fim}`;
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="row ">
            <div className="col-sm-4 col-3">
              <div className="col-sm4 input-group m-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquisar laudo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <h4 className="page-title">Lista de Laudos</h4>
            </div>
            <div className="col-sm-8 col-9 text-right m-b-20">
              <Link to="/laudo" className="btn btn-primary btn-rounded">
                <i className="fa fa-plus"></i> Adicionar Laudo
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>CPF</th>
                      <th>Tipo</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLaudos.length > 0 ? (
                      filteredLaudos.map((l) => (
                        <tr key={l.id}>
                          <td>{l.paciente}</td>
                          <td>{mascararCPF(l.cpf)}</td>
                          <td>{l.tipo}</td>
                          <td>{l.data}</td>
                          <td>{l.status}</td>
                          <td className="text-right">
                            <div className="dropdown dropdown-action" style={{ display: "inline-block" }}>
                              <button
                                type="button"
                                ref={(el) => (anchorRefs.current[l.id] = el)}
                                className="action-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(openDropdown === l.id ? null : l.id);
                                }}
                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </button>

                              <DropdownPortal
                                anchorEl={anchorRefs.current[l.id]}
                                isOpen={openDropdown === l.id}
                                onClose={() => setOpenDropdown(null)}
                                className="dropdown-menu dropdown-menu-right show"
                              >
                                <Link
                                  className="dropdown-item-custom"
                                  to={`/profilelaudo/${l.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <i className="fa fa-eye"></i> Ver Detalhes
                                </Link>

                                <Link
                                  className="dropdown-item-custom"
                                  to={`/editlaudo/${l.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <i className="fa fa-pencil m-r-5"></i> Editar
                                </Link>

                                <button
                                  className="dropdown-item-custom dropdown-item-delete"
                                  onClick={() => handleDelete(l.id)}
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
                        <td colSpan="6" className="text-center text-muted">
                          Nenhum laudo encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaudoList;

