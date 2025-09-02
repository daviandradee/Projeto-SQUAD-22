import { Link } from "react-router-dom";
import "../../assets/css/index.css";
import { useState, useEffect } from "react";
import supabase from "../../Supabase";

function PatientList() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // Controla qual dropdown está aberto

  // Busca pacientes do Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase.from("Patient").select("*");
      if (error) {
        console.error("Erro ao buscar pacientes:", error);
      } else {
        setPatients(data);
      }
    };
    fetchPatients();
  }, []);

  // Função para deletar paciente
  const handleDelete = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja deletar este paciente?");
    if (!confirm) return;

    const { error } = await supabase.from("Patient").delete().eq("id", id);
    if (error) {
      alert("Erro ao deletar paciente: " + error.message);
    } else {
      setPatients(patients.filter((p) => p.id !== id));
    }
  };

  // Filtra pacientes de acordo com a busca
  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

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
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <h4 className="page-title">Lista de Pacientes</h4>
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
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((p) => (
                        <tr key={p.id}>
                          <td>{p.nome}</td>
                          <td>{p.cpf}</td>
                          <td>{p.data_nascimento}</td>
                          <td>{p.celular}</td>
                          <td>{p.email}</td>
                          <td className="text-right">
                            <div className="dropdown dropdown-action" style={{ position: "relative" }}>
                              <button
                                className="action-icon"
                                onClick={() => setOpenDropdown(openDropdown === p.id ? null : p.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "18px",
                                }}
                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </button>

                              {openDropdown === p.id && (
                                <div
                                  className="dropdown-menu dropdown-menu-right show"
                                  style={{
                                    minWidth: "120px",
                                    padding: "5px 0",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    backgroundColor: "#fff",
                                    border: "1px solid #ddd",
                                    position: "absolute",
                                    right: 0,
                                    zIndex: 100,
                                  }}
                                >
                                  {/* Edit */}
                                  <Link
                                    className="dropdown-item"
                                    to={`/editpatient/${p.id}`}
                                    onClick={(e) => e.stopPropagation()} // evita scroll/pulo
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "8px 12px",
                                      color: "#007bff",
                                      fontWeight: 500,
                                      textDecoration: "none",
                                      transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.background = "#f0f0f0")}
                                    onMouseLeave={(e) => (e.target.style.background = "transparent")}
                                  >
                                    <i className="fa fa-pencil m-r-5"></i> Editar
                                  </Link>

                                  {/* Delete */}
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleDelete(p.id)}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "8px 12px",
                                      color: "#dc3545",
                                      fontWeight: 500,
                                      width: "100%",
                                      border: "none",
                                      background: "none",
                                      cursor: "pointer",
                                      transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.background = "#f8d7da")}
                                    onMouseLeave={(e) => (e.target.style.background = "transparent")}
                                  >
                                    <i className="fa fa-trash-o m-r-5"></i> Excluir
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
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
      </div>
    </div>
  );
}

export default PatientList;