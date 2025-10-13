import { Link } from "react-router-dom";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAccessToken } from "../../utils/auth";
import Swal from 'sweetalert2';

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
  const [laudos, setLaudos] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const tokenUsuario = getAccessToken()

  var myHeaders = new Headers();
  myHeaders.append(
    "apikey",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
  );
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  useEffect(() => {
    fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/reports", requestOptions)
      .then(response => response.json())
      .then(result => setLaudos(Array.isArray(result) ? result : []))
      .catch(error => console.log('error', error));
  }, [])



  const handleVerDetalhes = (laudo) => {
    Swal.fire({
      title: "Detalhes do Laudo",
      html: `
        <div class="text-start" style="text-align: left; max-height: 400px; overflow-y: auto;">
          <div class="mb-3">
            <h6 class="text-primary">Informações do Pedido</h6>
            <p><strong>Nº Pedido:</strong> ${laudo.order_number || 'N/A'}</p>
            <p><strong>Paciente ID:</strong> ${laudo.patient_id || 'N/A'}</p>
            <p><strong>Tipo:</strong> ${laudo.tipo || 'N/A'}</p>         
          </div>
          
          <div class="mb-3">
            <h6 class="text-primary">Detalhes do Exame</h6>
            <p><strong>Exame:</strong> ${laudo.exam || 'N/A'}</p>
            <p><strong>Diagnóstico:</strong> ${laudo.diagnosis || 'Nenhum diagnóstico'}</p>
            <p><strong>Conclusão:</strong> ${laudo.conclusion || 'Nenhuma conclusão'}</p>
          </div>
          
          <div class="mb-3">
            <h6 class="text-primary">Responsáveis</h6>
            <p><strong>Executante:</strong> ${laudo.requested_by || 'N/A'}</p>
          </div>
          
          <div class="mb-3">
            <h6 class="text-primary">Datas</h6>
            <p><strong>Criado em:</strong> ${formatDate(laudo.created_at) || 'N/A'}</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Abrir Laudo",
      cancelButtonText: "Fechar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      icon: "info",
      width: "600px",
      draggable: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Abrir o form de laudo
        abrirFormLaudo(laudo.id);
      }
    });
  };

  const abrirFormLaudo = (laudoId) => {
    // Navega para o form de laudo com o ID
    window.location.href = `/doctor/laudoform?id=${laudoId}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'concluído':
      case 'finalizado':
        return 'bg-success';
      case 'pendente':
        return 'bg-warning';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Excluir Laudo?",
      text: "Tem certeza que deseja excluir este laudo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, Excluir",
      cancelButtonText: "Cancelar",
      draggable: true
    }).then((result) => {
      if (result.isConfirmed) {
        setLaudos(prev => prev.filter(l => l.id !== id));
        setOpenDropdown(null);
        Swal.fire({
          title: "Excluído!",
          text: "Laudo excluído com sucesso.",
          icon: "success",
          draggable: true
        });
      }
    });
  };

  const mascararCPF = (cpf = "") => {
    if (cpf.length < 5) return cpf;
    return `${cpf.slice(0, 3)}.***.***-${cpf.slice(-2)}`;
  };
  const [pacientesMap, setPacientesMap] = useState({});
// useEffect para atualizar todos os nomes
 useEffect(() => {
    if (!laudos || laudos.length === 0) return;

    const buscarPacientes = async () => {
      try {
        // Pega IDs únicos de pacientes
        const idsUnicos = [...new Set(laudos.map((l) => l.patient_id))];

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
  }, [laudos]);
  const filteredLaudos = laudos.filter(l => {
    const q = search.toLowerCase();
    const textMatch =
      (pacientesMap[l.patient_id]?.toLowerCase() || "").includes(q) ||
      (l.status || "").toLowerCase().includes(q) ||
      (l.pedido || "").toString().toLowerCase().includes(q) ||
      (l.exam || "").toLowerCase().includes(q) ||
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

  const [itemsPerPage1] = useState(10);
  const [currentPage1, setCurrentPage1] = useState(1);
  const indexOfLastLaudos = currentPage1 * itemsPerPage1;
  const indexOfFirstLaudos = indexOfLastLaudos - itemsPerPage1;
  const currentLaudos = filteredLaudos.slice(indexOfFirstLaudos, indexOfLastLaudos);
  const totalPages1 = Math.ceil(filteredLaudos.length / itemsPerPage1);

  useEffect(() => {
    setCurrentPage1(1);
  }, [search]);
  return (
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
            <button className={`btn-filter ${period === "today" ? "active" : ""}`} onClick={() => setPeriod("today")}>Hoje</button>
            <button className={`btn-filter ${period === "week" ? "active" : ""}`} onClick={() => setPeriod("week")}>Semana</button>
            <button className={`btn-filter ${period === "month" ? "active" : ""}`} onClick={() => setPeriod("month")}>Mês</button>
          </div>
        </div>
        <Link
          to="/admin/laudo"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(null);


          }} className="btn btn-primary btn-rounded">
          <i className="fa fa-plus"></i> Adicionar Laudo
        </Link>
      </div>

      {/* Tabela */}
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-border table-striped custom-table datatable mb-0">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Pacient ID</th>
                  <th>Exame</th>
                  <th>Diasgnostico</th>
                  <th>Conclusão</th>
                  <th>Status</th>
                  <th>Executante</th>
                  <th>Criado em</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentLaudos.length > 0 ? currentLaudos.map(l => (
                  <tr key={l.id}>
                    <td className="nowrap">{l.order_number}</td>
                    <td>{pacientesMap[l.patient_id] || "Carregando..."}</td>
                    <td>{l.exam}</td>
                    <td>{l.diagnosis}</td>
                    <td>{l.conclusion}</td>
                    <td>{l.status}</td>
                    <td> {l.requested_by}</td>
                    <td>{formatDate(l.created_at)}</td>
                    <td className="text-right">
                      <div className="dropdown dropdown-action">
                        <button type="button" ref={el => anchorRefs.current[l.id] = el} className="action-icon"
                          onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === l.id ? null : l.id); }}>
                          <i className="fa fa-ellipsis-v"></i>
                        </button>
                        <DropdownPortal anchorEl={anchorRefs.current[l.id]} isOpen={openDropdown === l.id}
                          onClose={() => setOpenDropdown(null)} className="dropdown-menu dropdown-menu-right show">
                          {/* BOTÃO VER DETALHES - SUBSTITUIU O BOTÃO LAUDO */}
                          {/*<Link
                            className="dropdown-item-custom"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(null);
                              handleVerDetalhes(l);
                            }}
                          >
                            <i className="fa fa-eye m-r-5"></i> Ver Detalhes
                          </Link>*/}
                          <Link
                            to={`/admin/laudoedit/${l.id}`}
                            className="dropdown-item-custom"

                          >
                            <i className="fa fa-pencil m-r-5"></i> Editar
                          </Link>

                          <button className="dropdown-item-custom dropdown-item-delete" onClick={() => handleDelete(l.id)}>
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
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(1)}>
                  {"<<"}
                </button>
              </li>
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => currentPage1 > 1 && setCurrentPage1(currentPage1 - 1)}
                >
                  &lt;
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">{currentPage1}</span>
              </li>
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
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>
                  {">>"}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LaudoList;