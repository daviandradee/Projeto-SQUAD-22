import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/auth";
import Swal from 'sweetalert2';


function Roles() {
  const tokenUsuario = getAccessToken()
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cpf: "",
    role: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const getHeaders = () => {
    const token = getAccessToken();
    return {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchUsersAndRoles = async () => {
    try {
      const headers = getHeaders();

      // Buscar perfis
      const resProfiles = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/profiles",
        { method: "GET", headers }
      );
      if (!resProfiles.ok) throw new Error("Erro ao buscar perfis");
      const profiles = await resProfiles.json();

      // Buscar roles dos usuários
      const resRoles = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/user_roles",
        { method: "GET", headers }
      );
      if (!resRoles.ok) throw new Error("Erro ao buscar roles");
      const roles = await resRoles.json();

      // Merge profiles com roles
      const merged = profiles.map((profile) => {
        const userRoles = roles.filter((r) => r.user_id === profile.id);
        const cargos = userRoles.length > 0 ? userRoles.map(r => r.role).join(", ") : "Sem cargo";

        return {
          ...profile,
          role: cargos,
        };
      });

      setUsers(merged);
    } catch (err) {
      console.error("Erro ao carregar usuários e roles:", err);
      Swal.fire({
        title: "Erro!",
        text: "Erro ao carregar usuários",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // headers
      const myHeaders = new Headers();
      myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
      myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
      myHeaders.append("Content-Type", "application/json");

      // validações básicas
      if (!formData.email || !formData.password || !formData.full_name) {
        Swal.fire("Campos obrigatórios", "Preencha nome, e-mail e senha.", "warning");
        setSubmitting(false);
        return;
      }
      if (formData.password.length < 6) {
        Swal.fire("Senha inválida", "A senha deve ter pelo menos 6 caracteres.", "warning");
        setSubmitting(false);
        return;
      }

      const role = (formData.role || "").toString().trim(); // garante string exata

      // payload 1: role como string (conforme docs)
      const payload1 = {
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        phone: formData.phone || "",
        cpf: formData.cpf || "",
        role: role
      };

      console.log("Tentando criar usuário (payload1):", payload1);

      let response = await fetch(
        "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user-with-password",
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(payload1)
        }
      );

      // tenta ler resposta (json se possível, senão texto)
      let result;
      try {
        result = await response.json();
      } catch (err) {
        result = await response.text();
      }
      console.log("Resposta (payload1):", response.status, result);

      // Se OK, finaliza
      if (response.ok) {
        Swal.fire({
          title: "Sucesso!",
          html: `
          <div class="text-start">
            <p><strong>Usuário criado com sucesso!</strong></p>
            <p><strong>Nome:</strong> ${result.user?.full_name || formData.full_name}</p>
            <p><strong>Email:</strong> ${result.user?.email || formData.email}</p>
            <p><strong>Cargo:</strong> ${role}</p>
            <p><strong>Telefone:</strong> ${formData.phone || "Não informado"}</p>
          </div>
        `,
          icon: "success",
        });

        setShowModal(false);
        setFormData({ full_name: "", email: "", phone: "", role: "secretaria", password: "" });
        await fetchUsersAndRoles();
        return;
      }

      // Se 400 e menciona role ou resposta indicar role inválida, tenta reenviar usando roles: [role]
      const errMsg = typeof result === "string" ? result : JSON.stringify(result);
      const mentionsRole = /role|roles|invalid role|role inválida|role not allowed/i.test(errMsg);

      if ((response.status === 400 || response.status === 422) && mentionsRole) {
        const payload2 = {
          email: formData.email.trim(),
          password: formData.password,
          full_name: formData.full_name.trim(),
          phone: formData.phone || "",
          cpf: formData.cpf || "",
          roles: [role] // tentativa alternativa
        };

        console.log("Servidor rejeitou role. Tentando payload2 (roles array):", payload2);

        const response2 = await fetch(
          "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user-with-password",
          {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(payload2)
          }
        );

        let result2;
        try {
          result2 = await response2.json();
        } catch (err) {
          result2 = await response2.text();
        }
        console.log("Resposta (payload2):", response2.status, result2);

        if (response2.ok) {
          Swal.fire("Sucesso!", result2.message || "Usuário criado com sucesso!", "success");
          setShowModal(false);
          setFormData({ full_name: "", email: "", phone: "", role: "secretaria", password: "" });
          await fetchUsersAndRoles();
          return;
        } else {
          // falha na segunda tentativa — mostra detalhe
          const detail = typeof result2 === "string" ? result2 : JSON.stringify(result2);
          throw new Error(detail || "Erro ao criar usuário (tentativa com roles array falhou)");
        }
      }

      // Se não é erro de role ou tentativas falharam, lança o erro original
      throw new Error(errMsg || "Erro ao criar usuário");
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      Swal.fire({
        title: "Erro!",
        text: err.message || "Falha ao criar usuário",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };


  const openCreateModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      cpf: "",
      role: "secretaria",
      password: ""
    });
  };

  const filteredUsers = users.filter(p => {
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
  const currentUsers = filteredUsers.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages1 = Math.ceil(filteredUsers.length / itemsPerPage1);

  useEffect(() => {
    setCurrentPage1(1);
  }, [search]);

  if (loading) return <p>Carregando usuários...</p>;
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-sm-4 col-3">
            <h4 className="page-title">Lista de Usuários</h4>
            <input
              type="text"
              className="form-control"
              placeholder="🔍  Buscar usuários"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <br />
          </div>
          <div className="col-sm-8 col-9 text-right m-b-20">
            <button
              className="btn btn-primary btn-rounded"
              onClick={openCreateModal}
            >
              <i className="fa fa-plus"></i> Criar Usuário
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-border table-striped custom-table datatable mb-0">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Cargos</th>
                    <th>User ID</th>
                    <th>Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.full_name || "-"}</td>
                        <td style={{ wordBreak: "break-word" }}>{user.email || "-"}</td>
                        <td>{user.phone || "-"}</td>
                        <td>{user.role || "-"}</td>
                        <td style={{ wordBreak: "break-word", fontSize: '12px' }}>{user.id}</td>
                        <td>{formatDate(user.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">Nenhum usuário encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage1(1)}>{"<<"}</button>
                </li>
                <li className={`page-item ${currentPage1 === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage1(prev => Math.max(prev - 1, 1))}>&lt;</button>
                </li>
                <li className="page-item active">
                  <span className="page-link">{currentPage1}</span>
                </li>
                <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage1(prev => Math.min(prev + 1, totalPages1))}>&gt;</button>
                </li>
                <li className={`page-item ${currentPage1 === totalPages1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage1(totalPages1)}>{">>"}</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Criar Novo Usuário</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="digite@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="form-group">
                    <label>Senha *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite a senha"
                    />
                  </div>
                  <div className="form-group">
                    <label>CPF *</label>
                    <input
                      type="text"
                      name="cpf"
                      className="form-control"
                      value={formData.cpf || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cargo *</label>
                    <select
                      className="form-control"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="secretaria">Secretária</option>
                      <option value="admin">Administrador</option>
                      <option value="gestor">Gestor</option>
                      <option value="medico">Médico</option>
                      <option value="paciente">Paciente</option>
                    </select>
                  </div>

                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                        Criando...
                      </>
                    ) : (
                      'Criar Usuário'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;
