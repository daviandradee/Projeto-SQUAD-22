import { Link } from "react-router-dom";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAccessToken } from "../../utils/auth.js";
import Swal from 'sweetalert2';
import { useResponsive } from '../../utils/useResponsive';
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/userInfo.js";


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
  const [statusFilter, setStatusFilter] = useState("");
  const [laudos, setLaudos] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const tokenUsuario = getAccessToken()
  const role = getUserRole();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuanqfswhberkoevtmfr.supabase.co";
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  var myHeaders = new Headers();
  myHeaders.append(
    "apikey",
    supabaseAK
  );
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  useEffect(() => {
    fetch(`${supabaseUrl}/rest/v1/reports`, requestOptions)
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
    window.location.href = `/${role}/laudoform?id=${laudoId}`;
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
      }).replace(',', ' às');
    } catch {
      return dateString;
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Tem certeza que deseja excluir este laudo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${supabaseUrl}/rest/v1/reports?id=eq.${id}`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
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
              `${supabaseUrl}/rest/v1/patients?id=eq.${id}`,
              {
                method: "GET",
                headers: {
                  apikey:
                    supabaseAK,
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
      (l.order_number || "").toString().toLowerCase().includes(q) ||
      (l.exam || "").toLowerCase().includes(q) ||
      (l.diagnosis || "").toLowerCase().includes(q) ||
      (l.conclusion || "").toLowerCase().includes(q);

    // Filtro por status
    const matchesStatus = !statusFilter || l.status === statusFilter;

    let dateMatch = true;
    if (l.created_at) {
      const laudoDate = new Date(l.created_at);
      const today = new Date();

      // Filtros por período rápido
      if (period === "today") {
        const todayStr = today.toDateString();
        dateMatch = laudoDate.toDateString() === todayStr;
      } else if (period === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        dateMatch = laudoDate >= startOfWeek && laudoDate <= endOfWeek;
      } else if (period === "month") {
        dateMatch = laudoDate.getMonth() === today.getMonth() && 
                   laudoDate.getFullYear() === today.getFullYear();
      }

      // Filtros por data específica
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Inclui o dia inteiro
        dateMatch = dateMatch && laudoDate >= start && laudoDate <= end;
      } else if (startDate) {
        const start = new Date(startDate);
        dateMatch = dateMatch && laudoDate >= start;
      } else if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && laudoDate <= end;
      }
    }

    return textMatch && matchesStatus && dateMatch;
  });

  const [itemsPerPage1, setItemsPerPage1] = useState(15);
  const [currentPage1, setCurrentPage1] = useState(1);
  const indexOfLastLaudos = currentPage1 * itemsPerPage1;
  const indexOfFirstLaudos = indexOfLastLaudos - itemsPerPage1;
  const currentLaudos = filteredLaudos.slice(indexOfFirstLaudos, indexOfLastLaudos);
  const totalPages1 = Math.ceil(filteredLaudos.length / itemsPerPage1);
  const navigate = useNavigate();
  const [medicosMap, setMedicosMap] = useState({});
  // Função para definir períodos e limpar datas
  const handlePeriodChange = (newPeriod) => {
    // Se clicar no mesmo período, limpa o filtro
    if (period === newPeriod) {
      setPeriod("");
    } else {
      setPeriod(newPeriod);
    }
    
    // Sempre limpa as datas específicas
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    setCurrentPage1(1);
  }, [search, statusFilter, period, startDate, endDate]);

  useEffect(() => {
    if (!Array.isArray(laudos) || laudos.length === 0) return;

    const buscarMedicos = async () => {
      try {
        const idsUnicos = [...new Set(laudos.map((c) => c.requested_by).filter(Boolean))];
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
  }, [laudos]);
  const permissoes = {
  admin: ['editlaudo', 'deletarlaudo', 'viewlaudo', 'viewpatientlaudos', 'createlaudo', 'executantelaudo'],
  medico: ['editlaudo', 'deletarlaudo', 'viewlaudo', 'viewpatientlaudos', 'createlaudo'],
  paciente: ['viewlaudo']
};
  const pode = (acao) => permissoes[role]?.includes(acao);
  // Função para imprimir o laudo (content_html)
  const handlePrint = async (laudoId) => {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/reports?id=eq.${laudoId}`, {
        method: 'GET',
        headers: myHeaders,
      });
      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Erro de autenticação',
          text: 'Não foi possível acessar o laudo. Faça login novamente.'
        });
        return;
      }
      const data = await res.json();
      const contentHtml = data[0]?.content_html;
      if (!contentHtml) {
        Swal.fire({
          icon: 'warning',
          title: 'Sem conteúdo',
          text: 'Este laudo não possui conteúdo para impressão.'
        });
        return;
      }
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      printWindow.document.write(`<!DOCTYPE html><html><head><title>Laudo de ${pacientesMap[data[0]?.patient_id]}</title></head><body>${contentHtml}</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao imprimir',
        text: 'Não foi possível imprimir o laudo.'
      });
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header com título e botão */}
        <div className="col-12">
       <div className="d-flex justify-content-between align-items-start mb-3">
          <h4 className="page-title mb-0">Laudos</h4>
           {pode('createlaudo') && (
            <Link
            to={`/${role}/laudoform`}
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(null);
            }} 
            className="btn btn-primary btn-rounded"
          >
            <i className="fa fa-plus"></i> Adicionar Laudo
          </Link>
            )}
        </div>
        </div>

        {/* Todos os filtros em uma única linha */}
        <div className="d-flex align-items-center mb-3" style={{ gap: "0.5rem", flexWrap: "nowrap", overflowX: "auto", height: "40px" }}>
          {/* Campo de busca */}
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="🔍 Buscar laudo"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: "300px", maxWidth: "450px", }}
          />
          
          {/* Filtro de status */}
          <select
            className="form-control form-control-sm"
            style={{ minWidth: "80px", maxWidth: "125px", }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="draft">Rascunho</option>
            <option value="completed">Concluído</option>
          </select>

          {/* Filtro De */}
          <div className="d-flex align-items-center" style={{ gap: "0.2rem" }}>
            <label className="mb-0" style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>De:</label>
            <input 
              type="date" 
              className="form-control form-control-sm"
              style={{ minWidth: "130px", }}
              value={startDate} 
              onChange={e => {
                setStartDate(e.target.value);
                if (e.target.value) setPeriod("");
              }} 
            />
          </div>
          
          {/* Filtro Até */}
          <div className="d-flex align-items-center" style={{ gap: "0.2rem" }}>
            <label className="mb-0" style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>Até:</label>
            <input 
              type="date" 
              className="form-control form-control-sm"
              style={{ minWidth: "130px", }}
              value={endDate} 
              onChange={e => {
                setEndDate(e.target.value);
                if (e.target.value) setPeriod("");
              }} 
            />
          </div>

          {/* Botões rápidos */}
          <button 
            className={`btn btn-sm ${period === "today" ? "btn-primary" : "btn-outline-primary"}`} 
            style={{ minWidth: "60px", fontSize: "0.8rem",  padding: "4px 8px" }}
            onClick={() => handlePeriodChange("today")}
          >
            Hoje
          </button>
          <button 
            className={`btn btn-sm ${period === "week" ? "btn-primary" : "btn-outline-primary"}`} 
            style={{ minWidth: "70px", fontSize: "0.8rem",  padding: "4px 8px" }}
            onClick={() => handlePeriodChange("week")}
          >
            Semana
          </button>
          <button 
            className={`btn btn-sm ${period === "month" ? "btn-primary" : "btn-outline-primary"}`} 
            style={{ minWidth: "60px", fontSize: "0.8rem",  padding: "4px 8px" }}
            onClick={() => handlePeriodChange("month")}
          >
            Mês
          </button>
        </div>

        {/* Tabela */}
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-border table-striped custom-table datatable mb-0">
                <thead>
                  <tr>
                    <th className="text-center">Pedido</th>
                     {pode('viewpatientlaudos') && (
                      <th className="text-center">Paciente</th>
                    )}
                    <th className="text-center">Procedimento</th>
                    <th className="text-center">Diagnóstico</th>
                    <th className="text-center">Conclusão</th>
                    <th className="text-center">Status</th>
                    {pode('executantelaudo') && (
                    <th className="text-center">Executante</th>
                    )}
                    <th className="text-center">Criado em</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLaudos.length > 0 ? currentLaudos.map(l => (
                    <tr key={l.id}>
                      <td className="nowrap">{l.order_number}</td>
                       {pode('viewpatientlaudos') && (
                        <td className="text-center">{pacientesMap[l.patient_id] || "Carregando..."}</td>
                      )}
                      <td className="text-center">{l.exam}</td>
                      <td className="text-center">{l.diagnosis}</td>
                      <td className="text-center">{l.conclusion}</td>
                      <td className="text-center">
                        <span
                          className={`custom-badge ${
                            l.status === 'draft' ? 'status-orange' :
                            l.status === 'completed' ? 'status-green' :
                            'status-gray'
                          }`}
                          style={{ minWidth: '110px', display: 'inline-block', textAlign: 'center' }}
                        >
                          {l.status === 'draft' ? (
                            <>
                              <i className="fa fa-edit" style={{ marginRight: '6px' }}></i>
                              Rascunho
                            </>
                          ) : l.status === 'completed' ? (
                            <>
                              <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>
                              Concluído
                            </>
                          ) : (
                            l.status
                          )}
                        </span>
                      </td>
                      {pode('executantelaudo') && (
                        <td className="text-center"> {medicosMap[l.requested_by] || l.requested_by}</td>
                      )}
                      <td className="text-center">{formatDate(l.created_at)}</td>
                      <td className="text-center">
                        <div className="action-buttons-container">
                           {pode('editlaudo') &&  (<button
                            type="button"
                            className="action-btn action-btn-edit"
                            onClick={() => navigate(`/${role}/editlaudo/${l.id}`)}
                            title="Ver detalhes do paciente"
                          >
                            <span className="fa fa-pencil m-r-5"></span>
                          </button>
                          )}
                          <button
                            type="button"
                            className="action-btn action-btn-view"
                            onClick={() => navigate(`/${role}/verlaudo/${l.id}`)}
                            title="Ver detalhes do paciente"
                          >
                            <span className="fa fa-eye"></span>
                          </button>
                          {/* Botão de imprimir */}
                          <button
                            type="button"
                            className="action-btn action-btn-print"
                            onClick={() => handlePrint(l.id)}
                            title="Imprimir laudo"
                          >
                            <span className="fa fa-print"></span>
                          </button>
                          {pode('deletarlaudo') && (
                          <button
                            type="button"
                            className="action-btn action-btn-delete"
                            onClick={() => handleDelete(l.id)}
                            title="Excluir paciente"
                          >
                            <span className="fa fa-trash-o"></span>
                          </button>
                          )}
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
                                   <div className="d-flex flex-wrap align-items-center mt-3">
                <div className="me-3 text-muted" style={{ minWidth: '140px', fontSize: '0.98em', paddingRight: '3%' }}>
                  Total encontrados: <b>{filteredLaudos.length}</b>
                </div>
                <div style={{ minWidth: '140px' }}>
                  <select
                    className="form-control form-control-sm"
                    style={{ minWidth: "110px", maxWidth: "140px", display: 'inline-block' }}
                    value={itemsPerPage1}
                    onChange={e => {
                      setItemsPerPage1(Number(e.target.value));
                      setCurrentPage1(1);
                    }}
                    title="Itens por página"
                  >
                    <option value={10}>10 por página</option>
                    <option value={15}>15 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={30}>30 por página</option>
                  </select>
                </div>
              </div>
              <div className="w-100 d-flex justify-content-center mt-2">
                <nav>
                  <ul className="pagination mb-0 justify-content-center">
                    {/* Primeira página */}
                    <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage1(1)}>
                        {"<<"}
                      </button>
                    </li>
                    {/* Página anterior */}
                    <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage1(prev => Math.max(prev - 1, 1))}>
                        &lt;
                      </button>
                    </li>
                    {/* Número da página atual */}
                    <li className="page-item active">
                      <span className="page-link">{currentPage1}</span>
                    </li>
                    {/* Próxima página */}
                    <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage1(prev => Math.min(prev + 1, totalPages1))}>
                        &gt;
                      </button>
                    </li>
                    {/* Última página */}
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
    </div>
  );
}

export default LaudoList;