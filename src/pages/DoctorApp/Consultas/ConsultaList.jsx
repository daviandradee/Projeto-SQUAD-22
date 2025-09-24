import "../../../assets/css/index.css"
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
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

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  useEffect(() => {
    fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("API result:", result);
        setConsultas(result.data || []);
      })
      .catch((error) => console.log("error", error));
  }, []);
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

  const filteredConsultas = consulta.filter((c) => {
    if (!c) return false;
    const nome = (c.nome || "").toLowerCase();
    const cpf = (c.cpf || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    const q = search.toLowerCase();
    return nome.includes(q) || cpf.includes(q) || email.includes(q);
  });

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
          <Link to="/agendaform" className="btn btn-primary btn-rounded">
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
                {filteredConsultas.length > 0 ? (
                  filteredConsultas.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nome}</td>
                      <td>{c.data_nascimento}</td>
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
                              to={`/editpatient/${c.id}`}
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
        </div>
      </div>
    </div>
  );
}

export default ConsultaList;