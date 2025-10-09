// PatientList.jsx
import { Link } from "react-router-dom";
import "../../../assets/css/index.css"
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { getAccessToken } from "../../../utils/auth"
import Swal from 'sweetalert2';
import '../../../assets/css/modal-details.css';


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

function PacienteLista() {
  const [search, setSearch] = useState("");
  const tokenUsuario = getAccessToken()
  const [patients, setPatients] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const anchorRefs = useRef({});
  const [selectedPatient, setSelectedPatient] = useState(null);
 const [showModal, setShowModal] = useState(false);

 const handleViewDetails = (patient) => {
  setSelectedPatient(patient);
  setShowModal(true);
};

const filteredPatients = patients.filter(p => {
  if (!p) return false;
  const nome = (p.full_name || "").toLowerCase();
  const cpf = (p.cpf || "").toLowerCase();
  const email = (p.email || "").toLowerCase();
  const q = search.toLowerCase();
  return nome.includes(q) || cpf.includes(q) || email.includes(q);
});
const [itemsPerPage1] = useState(15);
const [currentPage1, setCurrentPage1] = useState(1);
const indexOfLastPatient = currentPage1 * itemsPerPage1;
const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
const totalPages1 = Math.ceil(filteredPatients.length / itemsPerPage1);
useEffect(() => {
  setCurrentPage1(1);
}, [search]);

  



  // guarda referência do botão de cada linha


  var myHeaders = new Headers();
  myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  useEffect(() => {
    fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients`, requestOptions)
      .then(response => response.json())
      .then(result => setPatients(Array.isArray(result) ? result : []))
      .catch(error => console.log('error', error));
  }, [])


  const handleDelete = async (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Tem certeza que deseja excluir este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          var myHeaders = new Headers();
          myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
          myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

          var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
          };

          const response = await fetch(`https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/patients?id=eq.${id}`, requestOptions)

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

    // Se quiser apagar no supabase, faça a chamada aqui.
    // const { error } = await supabase.from("Patient").delete().eq("id", id);
    // if (error) { console.error(error); return; }
  };

  

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
          <Link to="/secretaria/pacienteform" className="btn btn-primary btn-rounded">
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
                  <th>Sexo</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.length > 0 ? (
                  currentPatients.map((p) => (
                    <tr key={p.id}>
                      <td>{p.full_name}</td>
                      <td>{mascararCPF(p.cpf)}</td>
                      <td>{p.birth_date}</td>
                      <td>{p.phone_mobile}</td>
                      <td>{p.email}</td>
                      <td>{p.sex}</td>
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

                           <button
                               className="dropdown-item-custom"
                               onClick={(e) => {
                               e.stopPropagation();
                               setOpenDropdown(null);
                               handleViewDetails(p);
                            }}
                           >   
                              <i className="fa fa-eye m-r-5"></i> Ver Detalhes
                             </button>
                             <Link
                                 className="dropdown-item-custom"
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
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {/* Ir para a primeira página */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(1)}>
                  {"<<"} {/* ou "Início" */}
                </button>
              </li>

              {/* Botão de página anterior */}
              <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => currentPage1 > 1 && setCurrentPage1(currentPage1 - 1)}
                >
                  &lt;
                </button>
              </li>

              {/* Números de página */}

              <li className="page-item active">
                <span className="page-link">{currentPage1}</span>
              </li>
              {/* Botão de próxima página */}
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


              {/* Ir para a última página */}
              <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>
                  {">>"} {/* ou "Fim" */}
                </button>
              </li>
              
            </ul>
          </nav>
          {/* 🟢 ADICIONADO — modal de detalhes do paciente */}
        {showModal && selectedPatient && (
  <div
    className="modal fade show"
    style={{
      display: "block",
      backgroundColor: "rgba(0,0,0,0.5)",
    }}
  >
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Detalhes do Paciente</h5>
          <button
            type="button"
            className="close"
            onClick={() => setShowModal(false)}
          >
            <span>&times;</span>
          </button>
        </div>

        <div className="modal-body">
          <p className="text-muted">
            Informações detalhadas sobre o paciente.
          </p>

          <div className="row">
            <div className="col-md-6">
              <p><strong>Nome Completo:</strong> {selectedPatient.full_name}</p>
              <p><strong>Telefone:</strong> {selectedPatient.phone_mobile}</p>
              <p><strong>CPF:</strong> {mascararCPF(selectedPatient.cpf)}</p>
              <p><strong>Peso (kg):</strong> {selectedPatient.weight || "—"}</p>
              <p><strong>Endereço:</strong> {selectedPatient.address || "—"}</p>
            </div>

            <div className="col-md-6">
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Data de Nascimento:</strong> {selectedPatient.birth_date}</p>
              <p><strong>Tipo Sanguíneo:</strong> {selectedPatient.blood_type || "—"}</p>
              <p><strong>Altura (m):</strong> {selectedPatient.height || "—"}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
      )}

        </div>
      </div>
    </div>
  );
}

export default PacienteLista;
;