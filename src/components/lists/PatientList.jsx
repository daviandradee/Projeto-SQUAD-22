import { Link } from "react-router-dom";
import "../../assets/css/index.css";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import supabase from "../../Supabase.js";
import { getAccessToken } from "../../utils/auth.js";
import Swal from "sweetalert2";
import '../../assets/css/modal-details.css';
const AvatarForm = "/img/AvatarForm.jpg";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/userInfo.js";
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

function PatientList() {
  const [search, setSearch] = useState("");
  const [sexFilter, setSexFilter] = useState(""); // Filtro por sexo
  const [patients, setPatients] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({}); // guarda referência do botão de cada linha
  // 🟢 ADICIONADO — controla o modal e o paciente selecionado
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  // Função para alternar ordenação alfabética
  function handleSort() {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  const role = getUserRole();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleViewDetails = (patient) => {
    const mascararCPF = (cpf = "") => {
      if (cpf.length < 5) return cpf;
      const inicio = cpf.slice(0, 3);
      const fim = cpf.slice(-2);
      return `${inicio}.***.***-${fim}`;
    };

    Swal.fire({
      title: `<h4 style="margin-bottom:10px;">Detalhes do Paciente</h4>`,
      html: `
      <div style="text-align:center;">
        <img 
          src="${patient.profile_photo_url || AvatarForm}" 
          alt="${patient.full_name}"
          style="
            width:120px;
            height:120px;
            border-radius:50%;
            object-fit:cover;
            border:3px solid #4dabf7;
            box-shadow:0 4px 8px rgba(0,0,0,0.1);
          "
          onerror="this.src='${AvatarForm}'"
        />
        <h5 style="margin-top:10px;">${patient.full_name}</h5>
        <p class="text-muted">Informações detalhadas sobre o paciente.</p>
      </div>

      <div style="text-align:left; margin-top:20px;">
        <div style="display:flex; justify-content:space-between;">
          <div style="width:48%;">
            <p><strong>Nome Completo:</strong> ${patient.full_name}</p>
            <p><strong>Telefone:</strong> ${patient.phone_mobile}</p>
            <p><strong>CPF:</strong> ${mascararCPF(patient.cpf)}</p>
            <p><strong>Peso (kg):</strong> ${patient.weight || "—"}</p>
            <p><strong>Endereço:</strong> ${patient.address || "—"}</p>
          </div>
          <div style="width:48%;">
            <p><strong>Email:</strong> ${patient.email}</p>
            <p><strong>Data de Nascimento:</strong> ${patient.birth_date}</p>
            <p><strong>Tipo Sanguíneo:</strong> ${patient.blood_type || "—"}</p>
            <p><strong>Altura (m):</strong> ${patient.height || "—"}</p>
          </div>
        </div>
      </div>
    `,
      width: "800px",
      showConfirmButton: true,
      confirmButtonText: "Fechar",
      confirmButtonColor: "#4dabf7",
      background: document.body.classList.contains("dark-mode")
        ? "#1e1e2f"
        : "#fff",
      color: document.body.classList.contains("dark-mode")
        ? "#f5f5f5"
        : "#000",
      customClass: {
        popup: 'swal2-modal-patient'
      }
    });
  };


  const tokenUsuario = getAccessToken()
  var myHeaders = new Headers();
  myHeaders.append("apikey", supabaseAK);
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  useEffect(() => {
    fetch(`${supabaseUrl}/rest/v1/patients`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setPatients(Array.isArray(result) ? result : [])
        console.log(result);
      })
      .catch(error => console.log('error', error));
  }, [])

  const handleDelete = async (id) => {
    if (getUserRole() === 'paciente' || getUserRole() === 'medico') {
      Swal.fire("Ação não permitida", "Pacientes e médicos não podem excluir pacientes. Por favor, entre em contato com a secretaria.", "warning");
      return;
    }
    Swal.fire({
      title: "Tem certeza?",
      text: "Tem certeza que deseja excluir este paciente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Excluir!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          var myHeaders = new Headers();
          myHeaders.append("apikey", supabaseAK);
          myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

          var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
          };

          const response = await fetch(`${supabaseUrl}/rest/v1/patients?id=eq.${id}`, requestOptions)

          if (response.ok) {
            setPatients(prev => prev.filter(l => l.id !== id));
            setOpenDropdown(null);
            Swal.fire({
              title: "Registro Excluído",
              text: "Registro excluído com sucesso",
              icon: "success"
            })

          } else {
            Swal.fire("Error saving changes", "", "error");
          }
        }
        catch (error) {
          Swal.fire("Something went wrong", "", "error");
          console.error(error);
        }
      }
    });
  };


  const [birthDateStart, setBirthDateStart] = useState("");
  const [birthDateEnd, setBirthDateEnd] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [bloodType, setBloodType] = useState("");

  const filteredPatients = patients.filter(p => {
    if (!p) return false;

    // Filtro por texto (nome, cpf, email)
    const nome = (p.full_name || "").toLowerCase();
    const cpf = (p.cpf || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const data = (p.birth_date || "").toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = nome.includes(q) || cpf.includes(q) || email.includes(q) || data.includes(q);

    // Filtro por sexo (flexível - aceita diferentes variações)
    let matchesSex = true;
    if (sexFilter) {
      const patientSex = (p.sex || "").toLowerCase().trim();

      if (sexFilter === "masculino") {
        matchesSex = patientSex === "masculino" || patientSex === "m" || patientSex === "male";
      } else if (sexFilter === "feminino") {
        matchesSex = patientSex === "feminino" || patientSex === "f" || patientSex === "female";
      } else if (sexFilter === "outros") {
        matchesSex = !["masculino", "m", "male", "feminino", "f", "female", ""].includes(patientSex);
      }
    }

    // Filtro por data de nascimento
    let matchesBirthDate = true;
    if (birthDateStart) {
      matchesBirthDate = p.birth_date >= birthDateStart;
    }
    if (matchesBirthDate && birthDateEnd) {
      matchesBirthDate = p.birth_date <= birthDateEnd;
    }

    // Filtro por faixa etária
    let matchesAge = true;
    if (ageRange && p.birth_date) {
      const today = new Date();
      const birth = new Date(p.birth_date);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (ageRange === "0-18") matchesAge = age >= 0 && age <= 18;
      else if (ageRange === "19-40") matchesAge = age >= 19 && age <= 40;
      else if (ageRange === "41-60") matchesAge = age >= 41 && age <= 60;
      else if (ageRange === "60+") matchesAge = age > 60;
    }

    // Filtro por tipo sanguíneo
    let matchesBlood = true;
    if (bloodType) {
      matchesBlood = (p.blood_type || "").toUpperCase() === bloodType;
    }
    return matchesSearch && matchesSex && matchesBirthDate && matchesAge && matchesBlood;
  });
  const [itemsPerPage1, setItemsPerPage1] = useState(15);
  const [currentPage1, setCurrentPage1] = useState(1);
  const indexOfLastPatient = currentPage1 * itemsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
  // Aplica ordenação alfabética após filtrar
  let sortedPatients = [...filteredPatients];
  sortedPatients.sort((a, b) => {
    const nomeA = (a.full_name || "").toLowerCase();
    const nomeB = (b.full_name || "").toLowerCase();
    if (nomeA < nomeB) return sortOrder === "asc" ? -1 : 1;
    if (nomeA > nomeB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages1 = Math.ceil(sortedPatients.length / itemsPerPage1);
  useEffect(() => {
    setCurrentPage1(1);
  }, [search, sexFilter]);

  const mascararCPF = (cpf = "") => {
    if (cpf.length < 5) return cpf;
    const inicio = cpf.slice(0, 3);
    const fim = cpf.slice(-2);
    return `${inicio}.***.***-${fim}`;
  };

  const renderSexBadge = (sex) => {
    const sexo = (sex || "").toLowerCase().trim();

    if (sexo === "masculino" || sexo === "m" || sexo === "male") {
      return (
        <span
          className="custom-badge status-blue"
          style={{ minWidth: '90px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="fa fa-mars" style={{ marginRight: '6px' }}></i>
          Masculino
        </span>
      );
    } else if (sexo === "feminino" || sexo === "f" || sexo === "female") {
      return (
        <span
          className="custom-badge status-pink"
          style={{ minWidth: '90px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="fa fa-venus" style={{ marginRight: '6px' }}></i>
          Feminino
        </span>
      );
    } else if (sexo === "") {
      return (
        <span
          className="custom-badge status-red"
          style={{ minWidth: '90px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="fa fa-question" style={{ marginRight: '6px' }}></i>
          Em branco
        </span>
      );
    } else {
      return (
        <span
          className="custom-badge status-purple"
          style={{ minWidth: '90px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="fa fa-genderless" style={{ marginRight: '6px' }}></i>
          {sexo || "Outros"}
        </span>
      );
    }
  };

  const navigate = useNavigate();
  const permissoes = {
    admin: ['editpatient', 'deletepatient'],
    medico: [''],
    secretaria: ['editpatient', 'deletepatient'],
  };
  const pode = (acao) => permissoes[role]?.includes(acao);
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4 className="page-title mb-0">Lista de Pacientes</h4>
                <Link to={`/${role}/patientform`} className="btn btn-primary btn-rounded">
                  <i className="fa fa-plus"></i> Adicionar Paciente
                </Link>
              </div>

              {/* Todos os filtros em uma única linha */}
              <div className="d-flex align-items-center mb-3" style={{ gap: "0.5rem", flexWrap: "nowrap", overflowX: "auto", height: "40px" }}>
                {/* Campo de busca */}
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="🔍 Buscar pacientes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: "300px", maxWidth: "450px" }}
                />
                {/* Filtro por data de nascimento (de) */}
                <span style={{ fontSize: '0.95em', marginLeft: '8px', marginRight: '2px' }}>De:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={birthDateStart}
                  onChange={e => setBirthDateStart(e.target.value)}
                  style={{ minWidth: "150px", maxWidth: "180px" }}
                  placeholder="Nascimento de"
                  title="Nascimento de"
                />
                {/* Filtro por data de nascimento (até) */}
                <span style={{ fontSize: '0.95em', marginLeft: '8px', marginRight: '2px' }}>Até:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={birthDateEnd}
                  onChange={e => setBirthDateEnd(e.target.value)}
                  style={{ minWidth: "150px", maxWidth: "180px" }}
                  placeholder="Nascimento até"
                  title="Nascimento até"
                />
                <select
                  className="form-control form-control-sm"
                  style={{ minWidth: "100px", maxWidth: "140px" }}
                  value={sexFilter}
                  onChange={(e) => setSexFilter(e.target.value)}
                >
                  <option value="">Todos os sexos</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outros">Outros</option>
                </select>
                {/* Filtro por faixa etária */}
                <select
                  className="form-control form-control-sm"
                  style={{ minWidth: "120px", maxWidth: "160px" }}
                  value={ageRange}
                  onChange={e => setAgeRange(e.target.value)}
                >
                  <option value="">Todas as idades</option>
                  <option value="0-18">0-18 anos</option>
                  <option value="19-40">19-40 anos</option>
                  <option value="41-60">41-60 anos</option>
                  <option value="60+">60+ anos</option>
                </select>
                {/* Filtro por tipo sanguíneo */}
                <select
                  className="form-control form-control-sm"
                  style={{ minWidth: "110px", maxWidth: "140px" }}
                  value={bloodType}
                  onChange={e => setBloodType(e.target.value)}
                >
                  <option value="">Tipo Sanguíneo</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table datatable mb-0">
                  <thead>
                    <tr>
                    <th style={{ cursor: "pointer" }} onClick={handleSort}>
                        Nome {sortOrder === "asc" ? "▲" : "▼"}
                      </th>
                      
                      <th>Cpf</th>
                      <th>Data de Nascimento</th>
                      <th>Telefone</th>
                      <th>Email</th>
                      <th className="text-center">Sexo</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.length > 0 ? (
                      currentPatients.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="table-avatar">
                              <div className="upload-img">
                                <img
                                  alt={p.full_name}
                                  src={p.profile_photo_url || AvatarForm}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                  }}
                                  onError={(e) => {
                                    e.target.src = AvatarForm; // Fallback se a imagem não carregar
                                  }}
                                />
                                <span style={{ marginLeft: "4px" }}>{p.full_name}</span>
                              </div>
                            </div>
                          </td>
                          <td>{mascararCPF(p.cpf)}</td>
                          <td>{p.birth_date}</td>
                          <td>{p.phone_mobile}</td>
                          <td>{p.email}</td>
                          <td className="text-center">{renderSexBadge(p.sex)}</td>
                          <td className="text-center">
                            <div className="action-buttons-container">
                              <button
                                type="button"
                                className="action-btn action-btn-view"
                                onClick={() => handleViewDetails(p)}
                                title="Ver detalhes do paciente"

                              >
                                <span className="fa fa-eye"></span>
                              </button>

                              {pode('editpatient') && (
                                <button
                                  type="button"
                                  className="action-btn action-btn-edit"
                                  onClick={() => navigate(`/${role}/editpatient/${p.id}`)}
                                  title="Ver detalhes do paciente"
                                >
                                  <span className="fa fa-pencil m-r-5"></span>
                                </button>
                              )}
                              {pode('deletepatient') && (
                                <button
                                  type="button"
                                  className="action-btn action-btn-delete"
                                  onClick={() => handleDelete(p.id)}
                                  title="Excluir paciente"
                                >
                                  <span className="fa fa-trash-o"></span>
                                </button>
                              )}
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
              {/* Linha de controles abaixo da tabela */}
              <div className="d-flex flex-wrap align-items-center mt-3">
                <div className="me-3 text-muted" style={{ minWidth: '140px', fontSize: '0.98em', paddingRight: '3%' }}>
                  Total encontrados: <b>{filteredPatients.length}</b>
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
    </div>
  );
}

export default PatientList;