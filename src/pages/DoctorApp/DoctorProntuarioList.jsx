// src/pages/DoctorApp/Patient/DoctorPatientList.jsx
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import DoctorProntuario from "./DoctorProntuario";

// Componente DropdownPortal (mantido igual)
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

function DoctorPatientList() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});

  // DADOS MOCKADOS - SEM API
  const pacientesMock = [
    {
      id: 1,
      nome: "João Silva Santos",
      cpf: "123.456.789-00",
      data_nascimento: "15/03/1985",
      telefone: "(11) 99999-9999",
      email: "joao.silva@email.com",
      status: "ativo",
      endereco: "Rua das Flores, 123 - São Paulo/SP"
    },
    {
      id: 2,
      nome: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      data_nascimento: "22/07/1990",
      telefone: "(11) 88888-8888",
      email: "maria.oliveira@email.com",
      status: "ativo",
      endereco: "Av. Paulista, 1000 - São Paulo/SP"
    },
    {
      id: 3,
      nome: "Pedro Almeida Souza",
      cpf: "456.789.123-00",
      data_nascimento: "10/12/1978",
      telefone: "(11) 77777-7777",
      email: "pedro.almeida@email.com",
      status: "inativo",
      endereco: "Rua Augusta, 500 - São Paulo/SP"
    },
    {
      id: 4,
      nome: "Ana Pereira Lima",
      cpf: "789.123.456-00",
      data_nascimento: "05/09/1995",
      telefone: "(11) 66666-6666",
      email: "ana.pereira@email.com",
      status: "ativo",
      endereco: "Rua Consolação, 200 - São Paulo/SP"
    },
    {
      id: 5,
      nome: "Carlos Rodrigues Ferreira",
      cpf: "321.654.987-00",
      data_nascimento: "30/01/1982",
      telefone: "(11) 55555-5555",
      email: "carlos.rodrigues@email.com",
      status: "arquivado",
      endereco: "Alameda Santos, 800 - São Paulo/SP"
    }
  ];

  useEffect(() => {
    // Usando dados mockados em vez de API
    setPatients(pacientesMock);
    console.log("Carregando pacientes mockados:", pacientesMock);
  }, []);

  const handleDelete = async (id) => {
    const confirmDel = window.confirm("Tem certeza que deseja excluir este paciente?");
    if (!confirmDel) return;

    // Remove localmente (sem API)
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
                      <td>
                        <span className={`badge ${
                          p.status === 'ativo' ? 'bg-success' : 
                          p.status === 'inativo' ? 'bg-secondary' : 'bg-warning'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                          
                          {/* BOTÃO DE PRONTUÁRIO - FUNCIONANDO COM DADOS MOCKADOS */}
                          <Link
                            to="/doctor/doctorprontuario/${p.id}"
                            state={{ paciente: p }}
                            className="btn btn-sm btn-info"
                            title="Abrir Prontuário"
                            style={{ 
                              padding: "5px 10px", 
                              fontSize: "12px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            <i className="fa fa-file-medical"></i> Prontuário
                          </Link>

                          {/* Menu de três pontinhos */}
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
                            <Link
                              className="dropdown-item-custom"
                              to={`/edit-patient/${p.id}`}
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