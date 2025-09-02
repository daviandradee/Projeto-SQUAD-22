import "../../assets/css/index.css";
import { useState, useEffect } from "react";

function PatientList() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formType, setFormType] = useState(""); // "laudo" ou "receita"
  const [formData, setFormData] = useState({ titulo: "", descricao: "" });

  useEffect(() => {
    fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes")
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result.data)) {
          setPatients(result.data);
        } else if (result.data) {
          setPatients([result.data]);
        } else {
          setPatients([]);
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  // Filtrar pacientes
  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  // Abrir formulário
  const openForm = (patient, type) => {
    setSelectedPatient(patient);
    setFormType(type);
    setFormData({ titulo: "", descricao: "" });
  };

  // Enviar formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      pacienteId: selectedPatient.id,
      tipo: formType,
      ...formData,
    };

    console.log("Enviando:", payload);

    // Aqui você faria o fetch POST para salvar no backend
    alert(`${formType.toUpperCase()} enviado para ${selectedPatient.nome}`);

    setSelectedPatient(null);
    setFormType("");
  };

  return (
    <div className="main-wrapper d-flex justify-content-center align-items-center">
      <div className="page-wrapper w-75">
        <div className="content">
          {/* Campo de pesquisa */}
          <div className="row mb-3">
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar por nome, CPF ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <h4 className="page-title text-center mb-4">Lista de Pacientes</h4>

          {/* Lista de pacientes */}
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.cpf}</td>
                      <td>{p.telefone}</td>
                      <td>{p.email}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info mr-2"
                          onClick={() => openForm(p, "laudo")}
                        >
                          📑 Laudo
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => openForm(p, "receita")}
                        >
                          💊 Receita
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      Nenhum paciente encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal simples para formulário */}
          {selectedPatient && (
            <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-3">
                  <h5 className="mb-3 text-center">
                    {formType === "laudo" ? "📑 Novo Laudo" : "💊 Nova Receita"} -{" "}
                    {selectedPatient.nome}
                  </h5>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-2">
                      <label>Título</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.titulo}
                        onChange={(e) =>
                          setFormData({ ...formData, titulo: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Descrição</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={formData.descricao}
                        onChange={(e) =>
                          setFormData({ ...formData, descricao: e.target.value })
                        }
                        required
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-secondary mr-2"
                        onClick={() => setSelectedPatient(null)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientList;
