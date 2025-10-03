import { useState } from "react";
import "../../../assets/css/index.css"
import { Link } from "react-router-dom";
import { useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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

function AgendaMedica() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const [Agenda, setAgenda] = useState([])
  const [search, setSearch] = useState("");

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  useEffect(() => {
    fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("API result:", result);
        setAgenda(result.data || []);
      })
      .catch((error) => console.log("error", error));
  }, []);
  const handleDelete = async (id) => {
    const confirmDel = window.confirm("Tem certeza que deseja excluir esta agenda?");
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

    setAgenda((prev) => prev.filter((a) => a.id !== id));
    setOpenDropdown(null);
  };
  const filteredAgenda = Agenda.filter((a) => {
    if (!a) return false;
    const nome = (a.nome || "").toLowerCase();
    const cpf = (a.cpf || "").toLowerCase();
    const email = (a.email || "").toLowerCase();
    const q = search.toLowerCase();
    return nome.includes(q) || cpf.includes(q) || email.includes(q);
  });
  return (
    <div className="content">
      <div className="row">
        <div className="col-sm-4 col-3">
          <h4 className="page-title">Agenda médica</h4>
          <input
            type="text"
            className="form-control"
            placeholder="🔍  Buscar Agenda"
            style={{ minWidth: "200px" }}
            onChange={(a) => setSearch(a.target.value)}
          />
          <br />
        </div>
        <div className="col-sm-8 col-9 text-right m-b-20">
          <Link
            to="/secretaria/adicionaragenda"
            className="btn btn-primary btn-rounded float-right"
          >
            <i className="fa fa-plus"></i> Adicionar agenda
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-border table-striped custom-table mb-0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Departamento</th>
                  <th>Dias disponíveis</th>
                  <th>Horário disponível</th>
                  <th>Status</th>
                  <th className="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgenda.length > 0 ? (
                  filteredAgenda.map((a) => (
                    <tr>
                      <td>
                        <img
                          width="28"
                          height="28"
                          src="/img/user.jpg"
                          className="rounded-circle m-r-5"
                          alt="user"
                        />{" "}
                        {a.nome}
                      </td>
                      <td>{a.email}</td>
                      <td>{a.data_nascimento}</td>
                      <td>{a.created_at}</td>
                      <td>
                        <span className="custom-badge status-green">Ativo</span>
                      </td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action" style={{ display: "inline-block" }}>
                          <button
                            type="button"
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
                              to={`/secretaria/agendamedica`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                              }}
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
        </div>
      </div>


      {/* Modal de exclusão */}
      <div id="delete_schedule" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Você tem certeza que deseja deletar essa agenda?</h3>
              <div className="m-t-20">
                <a href="#" className="btn btn-white">
                  Fechar
                </a>
                <button type="submit" className="btn btn-danger">
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AgendaMedica;
