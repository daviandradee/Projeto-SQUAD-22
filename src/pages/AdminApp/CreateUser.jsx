import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/auth";
import Swal from 'sweetalert2';


function CreateUser() {
  const tokenUsuario = getAccessToken()
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
 const [period, setPeriod] = useState("");
 const [startDate, setStartDate] = useState("");
 const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cpf: "",
    role: "secretaria",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuanqfswhberkoevtmfr.supabase.co";
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

  const getHeaders = () => {
    const token = getAccessToken();
    return {
      "apikey": supabaseAK,
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
        `${supabaseUrl}/rest/v1/profiles`,
        { method: "GET", headers }
      );
      if (!resProfiles.ok) throw new Error("Erro ao buscar perfis");
      const profiles = await resProfiles.json();

      // Buscar roles dos usuários
      const resRoles = await fetch(
        `${supabaseUrl}/rest/v1/user_roles`,
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
      myHeaders.append("apikey", supabaseAK);
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
      if (!formData.role || formData.role.trim() === "") {
        Swal.fire("Cargo obrigatório", "Selecione um cargo para o usuário.", "warning");
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
        role: role,
        ...(role === "paciente" && { 
          create_patient_record: true,
          phone_mobile: formData.phone || ""
        })
      };

      console.log("Tentando criar usuário (payload1):", payload1);

      let response = await fetch(
        `${supabaseUrl}/functions/v1/create-user-with-password`,
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
          roles: [role], // tentativa alternativa
          ...(role === "paciente" && { 
            create_patient_record: true,
            phone_mobile: formData.phone || ""
          })
        };

        console.log("Servidor rejeitou role. Tentando payload2 (roles array):", payload2);

        const response2 = await fetch(
          `${supabaseUrl}/functions/v1/create-user-with-password`,
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
  
   // Filtro por texto (nome, cpf, email)
   const matchesText = nome.includes(q) || cpf.includes(q) || email.includes(q);
  
   // Filtro por cargo
   const matchesRole = !roleFilter || (p.role || "").toLowerCase().includes(roleFilter.toLowerCase());
  
   let dateMatch = true;
   if (p.created_at) {
     const userDate = new Date(p.created_at);
     const now = new Date();

     // Filtros por período
     if (period === "today") {
       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
       const tomorrow = new Date(today);
       tomorrow.setDate(tomorrow.getDate() + 1);
       dateMatch = userDate >= today && userDate < tomorrow;
     } else if (period === "week") {
       const weekStart = new Date(now);
       weekStart.setDate(now.getDate() - now.getDay());
       weekStart.setHours(0, 0, 0, 0);
       dateMatch = userDate >= weekStart;
     } else if (period === "month") {
       const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
       dateMatch = userDate >= monthStart;
     }

     // Filtros por data específica
     if (startDate && endDate) {
       const start = new Date(startDate);
       const end = new Date(endDate);
       end.setHours(23, 59, 59, 999); // Inclui o dia inteiro
       dateMatch = dateMatch && userDate >= start && userDate <= end;
     } else if (startDate) {
       const start = new Date(startDate);
       dateMatch = dateMatch && userDate >= start;
     } else if (endDate) {
       const end = new Date(endDate);
       end.setHours(23, 59, 59, 999);
       dateMatch = dateMatch && userDate <= end;
     }
   }


   return matchesText && matchesRole && dateMatch;
 });

  const [itemsPerPage1] = useState(15);
  const [currentPage1, setCurrentPage1] = useState(1);
  const indexOfLastPatient = currentPage1 * itemsPerPage1;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage1;
  const currentUsers = filteredUsers.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages1 = Math.ceil(filteredUsers.length / itemsPerPage1);
  

  useEffect(() => {
    setCurrentPage1(1);
  }, [search, roleFilter, period, startDate, endDate]);

  if (loading) return <p>Carregando usuários...</p>;
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h4 className="page-title mb-0">Lista de Usuários</h4>
          <button
            className="btn btn-primary btn-rounded"
            onClick={openCreateModal}
         >
           <i className="fa fa-plus"></i> Criar Usuário
         </button>
       </div>
        {/* Todos os filtros em uma única linha */}
        <div className="d-flex align-items-center mb-3" style={{ gap: "0.5rem", flexWrap: "nowrap", overflowX: "auto",  height: "40px" }}>
          {/* Campo de busca */}
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="🔍 Buscar usuários"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: "300px", maxWidth: "450px", }}
          />
          
          {/* Filtro por cargo */}
          <select
            className="form-control form-control-sm"
            style={{ minWidth: "120px", maxWidth: "140px" }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Todos os cargos</option>
            <option value="admin">Administrador</option>
            <option value="secretaria">Secretaria</option>
            <option value="paciente">Paciente</option>
            <option value="gestor">Gestor</option>
            <option value="medico">Médico</option>
            <option value="user">Usuário</option>
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
            style={{ minWidth: "50px", fontSize: "0.8rem", padding: "4px 8px" }}
            onClick={() => handlePeriodChange("today")}
          >
            Hoje
          </button>
          <button 
            className={`btn btn-sm ${period === "week" ? "btn-primary" : "btn-outline-primary"}`} 
            style={{ minWidth: "55px", fontSize: "0.8rem", padding: "4px 8px" }}
            onClick={() => handlePeriodChange("week")}
          >
            Semana
          </button>
          <button 
            className={`btn btn-sm ${period === "month" ? "btn-primary" : "btn-outline-primary"}`} 
            style={{ minWidth: "45px", fontSize: "0.8rem", padding: "4px 8px" }}
            onClick={() => handlePeriodChange("month")}
          >
            Mês
          </button>
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
                        <td>
                          {(() => {
                            if (!user.role || user.role === "Sem cargo") {
                              return (
                                <span className="custom-badge status-gray" style={{ minWidth: '110px', display: 'inline-block', textAlign: 'left' }}>
                                  <i className="fa fa-question-circle" style={{ marginRight: '6px' }}></i>
                                  Sem cargo
                                </span>
                              );
                            }
                            
                            const rolesArray = user.role.split(', ').map(r => r.trim());
                            const roleMap = {
                              'admin': { icon: 'fa fa-shield', label: 'Admin', color: 'status-red' },
                              'medico': { icon: 'fa fa-stethoscope', label: 'Médico', color: 'status-purple' },
                              'gestor': { icon: 'fa fa-briefcase', label: 'Gestor', color: 'status-blue' },
                              'secretaria': { icon: 'fa fa-phone', label: 'Secretaria', color: 'status-orange' },
                              'paciente': { icon: 'fa fa-user', label: 'Paciente', color: 'status-green' },
                              'user': { icon: 'fa fa-user-circle', label: 'User', color: 'status-pink' }
                            };
                            
                            return (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {rolesArray.map((role, index) => {
                                  const roleInfo = roleMap[role.toLowerCase()] || { icon: 'fa-question-circle', label: role, color: 'status-gray' };
                                  return (
                                    <span 
                                      key={index}
                                      className={`custom-badge ${roleInfo.color}`} 
                                      style={{ 
                                        minWidth: '80px',
                                        width: '80px',
                                        display: 'inline-flex', 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        padding: '3px 6px',
                                        marginBottom: '2px',
                                        textAlign: 'center'
                                      }}
                                    >
                                      <i className={roleInfo.icon} style={{ marginRight: '4px' }}></i>
                                      {roleInfo.label}
                                    </span>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </td>
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
                      <option value="">Selecione um cargo</option>
                      <option value="secretaria">Secretária</option>
                      <option value="admin">Administrador</option>
                      <option value="gestor">Gestor</option>
                      <option value="medico">Médico</option>
                      <option value="paciente">Paciente</option>
                      <option value="user">Usuário</option>
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

export default CreateUser;
