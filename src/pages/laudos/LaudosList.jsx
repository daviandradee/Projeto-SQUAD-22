import { Link } from "react-router-dom"; 
import "../../assets/css/index.css";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
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

    const handleDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          anchorEl && !anchorEl.contains(e.target)) {
        onClose();
      }
    };
    const handleScroll = () => onClose();

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

function LaudoList() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState(""); // "", "today", "week", "month"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laudos, setLaudos] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este laudo?")) return;
    setLaudos(prev => prev.filter(l => l.id !== id));
    setOpenDropdown(null);
  };

  const filteredLaudos = laudos.filter(l => {
    const q = search.toLowerCase();
    const textMatch =
      (l.paciente || "").toLowerCase().includes(q) ||
      (l.cpf || "").toLowerCase().includes(q) ||
      (l.tipo || "").toLowerCase().includes(q) ||
      (l.status || "").toLowerCase().includes(q) ||
      (l.pedido || "").toString().toLowerCase().includes(q) ||
      (l.prazo || "").toLowerCase().includes(q) ||
      (l.executante || "").toLowerCase().includes(q) ||
      (l.exame || "").toLowerCase().includes(q) ||
      (l.data || "").toLowerCase().includes(q);

    let dateMatch = true;
    const today = new Date();
    const laudoDate = new Date(l.data);

    if (period === "today") {
      dateMatch = laudoDate.toDateString() === today.toDateString();
    } else if (period === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      dateMatch = laudoDate >= startOfWeek && laudoDate <= endOfWeek;
    } else if (period === "month") {
      dateMatch = laudoDate.getMonth() === today.getMonth() && laudoDate.getFullYear() === today.getFullYear();
    }

    if (startDate && endDate) {
      dateMatch = dateMatch && l.data >= startDate && l.data <= endDate;
    } else if (startDate) {
      dateMatch = dateMatch && l.data >= startDate;
    } else if (endDate) {
      dateMatch = dateMatch && l.data <= endDate;
    }

    return textMatch && dateMatch;
  });

  const mascararCPF = (cpf = "") => {
    if (cpf.length < 5) return cpf;
    return `${cpf.slice(0,3)}.***.***-${cpf.slice(-2)}`;
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <h4 className="page-title">Laudos</h4>

          {/* Linha de pesquisa e filtros */}
          <div className="row align-items-center mb-2">
            {/* Esquerda: pesquisa */}
            <div className="col d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="🔍  Buscar laudo"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ minWidth: "200px" }}
              />
            </div>

            {/* Direita: filtros de data + botões */}
            <div className="col-auto d-flex align-items-center" style={{ gap: "0.5rem", justifyContent: "flex-end" }}>
              
              {/* Filtros de data primeiro */}
              <div className="date-filter">
                <label>De:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <label>Até:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>

              {/* Botões rápidos */}
              <div className="quick-filter">
                <button className={`btn-filter ${period==="today"?"active":""}`} onClick={()=>setPeriod("today")}>Hoje</button>
                <button className={`btn-filter ${period==="week"?"active":""}`} onClick={()=>setPeriod("week")}>Semana</button>
                <button className={`btn-filter ${period==="month"?"active":""}`} onClick={()=>setPeriod("month")}>Mês</button>
              </div>

              {/* Botão Adicionar Laudo */}
              <Link to="/laudo" className="btn btn-primary btn-sm">
                <i className="fa fa-plus"></i> Adicionar Laudo
              </Link>
            </div>
          </div>

          {/* Tabela */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Data</th>
                      <th>Prazo</th>
                      <th>Paciente</th>
                      <th>CPF</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Executante</th>
                      <th>Exame</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLaudos.length>0 ? filteredLaudos.map(l=>(
                      <tr key={l.id}>
                        <td className="nowrap">{l.pedido}</td>
                        <td className="nowrap">{l.data}</td>
                        <td className="nowrap">{l.prazo}</td>
                        <td>{l.paciente}</td>
                        <td className="nowrap">{mascararCPF(l.cpf)}</td>
                        <td>{l.tipo}</td>
                        <td>{l.status}</td>
                        <td>{l.executante}</td>
                        <td className="ellipsis">{l.exame}</td>
                        <td className="text-right">
                          <div className="dropdown dropdown-action">
                            <button type="button" ref={el=>anchorRefs.current[l.id]=el} className="action-icon"
                              onClick={e=>{e.stopPropagation(); setOpenDropdown(openDropdown===l.id?null:l.id);}}>
                              <i className="fa fa-ellipsis-v"></i>
                            </button>
                            <DropdownPortal anchorEl={anchorRefs.current[l.id]} isOpen={openDropdown===l.id}
                              onClose={()=>setOpenDropdown(null)} className="dropdown-menu dropdown-menu-right show">
                              <Link className="dropdown-item-custom" to={`/profilelaudo/${l.id}`} onClick={e=>{e.stopPropagation(); setOpenDropdown(null);}}>
                                <i className="fa fa-eye"></i> Ver Detalhes
                              </Link>
                              <Link className="dropdown-item-custom" to={`/editlaudo/${l.id}`} onClick={e=>{e.stopPropagation(); setOpenDropdown(null);}}>
                                <i className="fa fa-pencil m-r-5"></i> Editar
                              </Link>
                              <button className="dropdown-item-custom dropdown-item-delete" onClick={()=>handleDelete(l.id)}>
                                <i className="fa fa-trash-o m-r-5"></i> Excluir
                              </button>
                            </DropdownPortal>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="10" className="text-center text-muted">Nenhum laudo encontrado</td>
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

