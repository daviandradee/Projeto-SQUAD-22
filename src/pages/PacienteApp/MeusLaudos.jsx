import { Link } from "react-router-dom"; 
import "../../assets/css/index.css";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [laudos, setLaudos] = useState([
    {
      id: 1,
      pedido: "REP-2025-00001",
      pacienteId: "abd2d250-bedb-4feb-9c73-6df15f8a7ad",
      exame: "1",
      diagnostico: "1",
      conclusao: "aaaaa",
      status: "draft",
      executante: "RiseUp Popcode",
      criadoEm: "2025-10-03T14:31:23.914774+00:00"
    },
    {
      id: 2,
      pedido: "REP-2025-00002",
      pacienteId: "abd2d250-bedb-4feb-9c73-6df15f8a7ad",
      exame: "Radiografia",
      diagnostico: "Lindo e cheiroso",
      conclusao: "findo",
      status: "draft",
      executante: "RiseUp Popcode",
      criadoEm: "2025-10-06T23:11:52.278889+00:00"
    },
    {
      id: 3,
      pedido: "REP-2025-00003",
      pacienteId: "47902ada-7d04-480a-a759-bae8a71973a",
      exame: "exame de sangue",
      diagnostico: "",
      conclusao: "Só precisa se atentar com a alimentação",
      status: "draft",
      executante: "fulano",
      criadoEm: "2025-10-08T15:04:08.909372+00:00"
    },
    {
      id: 4,
      pedido: "REP-2025-00040",
      pacienteId: "ab039e66-7271-4187-a719-e2769c6d15b3",
      exame: "falta de potassio",
      diagnostico: "",
      conclusao: "",
      status: "draft",
      executante: "Dr. Smith",
      criadoEm: "2025-10-11T15:33:21.368022+00:00"
    },
    {
      id: 5,
      pedido: "REP-2025-00043",
      pacienteId: "abb0de4d-9dfa-4fb5-ac30-cdcb82c4974e",
      exame: "teste3",
      diagnostico: "teste3",
      conclusao: "",
      status: "draft",
      executante: "4d17554a-7804-4cf9-a075-db42c99974e",
      criadoEm: "2025-10-12T04:21:32.283131+00:00"
    },
    {
      id: 6,
      pedido: "REP-2025-00046",
      pacienteId: "abb0de4d-9dfa-4fb5-ac30-cdcb82c4974e",
      exame: "teste6",
      diagnostico: "teste6",
      conclusao: "",
      status: "draft",
      executante: "4d17554a-7804-4cf9-a075-db42c99974e",
      criadoEm: "2025-10-12T04:30:04.181972+00:00"
    },
    {
      id: 7,
      pedido: "REP-2025-00049",
      pacienteId: "ab039e66-7271-4187-a719-e2769c6d15b3",
      exame: "exame de sangue",
      diagnostico: "Fala de ferro",
      conclusao: "Precisa obter pela alimentação",
      status: "draft",
      executante: "Dr.Davi",
      criadoEm: "2025-10-13T05:31:22.398291+00:00"
    },
    {
      id: 8,
      pedido: "REP-2025-00052",
      pacienteId: "ab039e66-7271-4187-a719-e2769c6d15b3",
      exame: "rabo x",
      diagnostico: "Quebrou o radio",
      conclusao: "fratura distal do radio",
      status: "draft",
      executante: "Dr.Davi",
      criadoEm: "2025-10-13T18:10:23.056779+00:00"
    }
  ]);                        
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});

  // FUNÇÃO AUXILIAR PARA CORES DO STATUS
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'concluído': return '#28a745';
      case 'finalized': return '#28a745';
      case 'pendente': return '#ffc107';
      case 'pending': return '#ffc107';
      case 'em andamento': return '#17a2b8';
      case 'draft': return '#6c757d';
      case 'rascunho': return '#6c757d';
      case 'cancelado': return '#dc3545';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const traduzirStatus = (status) => {
    const statusMap = {
      'draft': 'Rascunho',
      'pending': 'Pendente',
      'finalized': 'Concluído',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  // FUNÇÃO PARA ABRIR O FORM DE LAUDO
  const handleVerLaudo = (laudo) => {
    // Redireciona para o form de laudo com o ID
    window.location.href = `/admin/laudo?id=${laudo.id}`;
  };

  const filteredLaudos = laudos.filter(l => {
    const q = search.toLowerCase();
    const textMatch =
      (l.pedido || "").toLowerCase().includes(q) ||
      (l.pacienteId || "").toLowerCase().includes(q) ||
      (l.exame || "").toLowerCase().includes(q) ||
      (l.diagnostico || "").toLowerCase().includes(q) ||
      (l.conclusao || "").toLowerCase().includes(q) ||
      (l.status || "").toLowerCase().includes(q) ||
      (l.executante || "").toLowerCase().includes(q);

    let dateMatch = true;
    if (startDate && endDate) {
      dateMatch = l.criadoEm >= startDate && l.criadoEm <= endDate;
    } else if (startDate) {
      dateMatch = l.criadoEm >= startDate;
    } else if (endDate) {
      dateMatch = l.criadoEm <= endDate;
    }

    return textMatch && dateMatch;
  });

  return (
    <div className="main-wrapper" style={styles.mainWrapper}>
      <div className="page-wrapper" style={styles.pageWrapper}>
        <div className="content" style={styles.content}>
          
          {/* CABEÇALHO FIXO */}
          <div style={styles.headerFixed}>
            <h4 className="page-title" style={styles.pageTitle}>Laudos</h4>

            {/* Linha de pesquisa e filtros FIXOS */}
            <div className="row align-items-center mb-2" style={styles.filtersRow}>
              {/* Buscar laudo */}
              <div className="col d-flex align-items-center">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar laudo"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              {/* Filtros de data e botões rápidos */}
              <div className="col-auto d-flex align-items-center" style={styles.filtersContainer}>
                
                {/* Filtros de data */}
                <div style={styles.dateFilter}>
                  <label style={styles.filterLabel}>De:</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    style={styles.dateInput}
                  />
                  <label style={styles.filterLabel}>Até:</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    style={styles.dateInput}
                  />
                </div>

                {/* Botões rápidos */}
                <div style={styles.quickFilter}>
                  <button 
                    style={period === "today" ? styles.btnFilterActive : styles.btnFilter}
                    onClick={()=>setPeriod("today")}
                  >
                    Hoje
                  </button>
                  <button 
                    style={period === "week" ? styles.btnFilterActive : styles.btnFilter}
                    onClick={()=>setPeriod("week")}
                  >
                    Semana
                  </button>
                  <button 
                    style={period === "month" ? styles.btnFilterActive : styles.btnFilter}
                    onClick={()=>setPeriod("month")}
                  >
                    Mês
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ÁREA ROLÁVEL APENAS DA TABELA */}
          <div style={styles.scrollableArea}>
            <div className="table-responsive" style={styles.tableResponsive}>
              <table className="table table-border table-striped custom-table datatable mb-0" style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Pedido</th>
                    <th style={styles.tableHeader}>Pacient ID</th>
                    <th style={styles.tableHeader}>Exame</th>
                    <th style={styles.tableHeader}>Diagnostico</th>
                    <th style={styles.tableHeader}>Conclusão</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Executante</th>
                    <th style={styles.tableHeader}>Criado em</th>
                    <th style={styles.tableHeader}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaudos.length>0 ? filteredLaudos.map(l=>(
                    <tr key={l.id}>
                      <td style={styles.tableCell}>{l.pedido}</td>
                      <td style={{...styles.tableCell, ...styles.patientId}}>{l.pacienteId}</td>
                      <td style={styles.tableCell}>{l.exame}</td>
                      <td style={styles.tableCell}>{l.diagnostico || '-'}</td>
                      <td style={styles.tableCell}>{l.conclusao || '-'}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          background: getStatusColor(l.status)
                        }}>
                          {traduzirStatus(l.status)}
                        </span>
                      </td>
                      <td style={styles.tableCell}>{l.executante}</td>
                      <td style={styles.tableCell}>{formatarData(l.criadoEm)}</td>
                      <td style={styles.tableCell}>
                        <button 
                          style={styles.detailsButton}
                          onClick={() => handleVerLaudo(l)}
                          title="Abrir formulário do laudo"
                        >
                          Ver Laudo
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="9" style={styles.noResults}>Nenhum laudo encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Estilos CSS para cabeçalho fixo e área rolável
const styles = {
  mainWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    margin: 0,
    padding: 0,
    width: '100%'
  },
  pageWrapper: {
    width: '100%',
    margin: 0,
    padding: '20px',
    marginLeft: '0',
    maxWidth: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    margin: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  // CABEÇALHO FIXO
  headerFixed: {
    padding: '25px 25px 0 25px',
    backgroundColor: 'white',
    borderBottom: '1px solid #eaeaea',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexShrink: 0
  },
  pageTitle: {
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: '20px',
    fontSize: '24px'
  },
  filtersRow: {
    marginBottom: '20px',
    width: '100%'
  },
  searchInput: {
    minWidth: '200px',
    width: '100%'
  },
  filtersContainer: {
    gap: '0.5rem',
    justifyContent: 'flex-end'
  },
  dateFilter: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center'
  },
  filterLabel: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '500'
  },
  dateInput: {
    padding: '3px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    fontSize: '14px'
  },
  quickFilter: {
    display: 'flex',
    gap: '5px'
  },
  btnFilter: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  btnFilterActive: {
    padding: '5px 10px',
    border: '1px solid #007bff',
    borderRadius: '3px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer'
  },
  // ÁREA ROLÁVEL
  scrollableArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 25px 25px 25px'
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    margin: 0,
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#2c3e50',
    padding: '12px 8px',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  tableCell: {
    padding: '10px 8px',
    borderBottom: '1px solid #dee2e6',
    textAlign: 'left',
    verticalAlign: 'middle'
  },
  patientId: {
    fontSize: '12px',
    fontFamily: 'monospace'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
    minWidth: '80px',
    textAlign: 'center'
  },
  // BOTÃO DE VER LAUDO
  detailsButton: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: '90px',
    justifyContent: 'center'
  },
  noResults: {
    padding: '20px',
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic'
  }
};

export default LaudoList;