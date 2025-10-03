import { useEffect, useState } from "react"; 
import { getAccessToken } from "../../utils/auth";
import Swal from 'sweetalert2';

function Roles() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
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

            const resProfiles = await fetch(
                "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/profiles",
                { method: "GET", headers }
            );
            if (!resProfiles.ok) throw new Error("Erro ao buscar perfis");
            const profiles = await resProfiles.json();

            const resRoles = await fetch(
                "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/user_roles",
                { method: "GET", headers }
            );
            if (!resRoles.ok) throw new Error("Erro ao buscar roles");
            const roles = await resRoles.json();

            const merged = profiles.map((profile) => {
                const roleObj = roles.find((r) => r.user_id === profile.id);
                return {
                    ...profile,
                    role: roleObj ? roleObj.role : "Sem cargo",
                };
            });

            setUsers(merged);
        } catch (err) {
            console.error("Erro ao carregar usuários e roles:", err);
            Swal.fire({
                title: "Erro!",
                text: "Erro ao carregar usuários",
                icon: "error",
                draggable: true
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
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${getAccessToken()}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                phone: formData.phone,
                role: formData.role
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch(
                "https://yuanqfswhberkoevtmfr.supabase.co/functions/v1/create-user",
                requestOptions
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Erro ao criar usuário");
            }

            const result = await res.json();
            console.log("Usuário criado:", result);

            Swal.fire({
                title: "Sucesso!",
                html: `
                    <div class="text-start">
                        <p><strong>Usuário criado com sucesso!</strong></p>
                        <p><strong>Nome:</strong> ${formData.full_name}</p>
                        <p><strong>Email:</strong> ${formData.email}</p>
                        <p><strong>Cargo:</strong> ${formData.role}</p>
                        <p><strong>Telefone:</strong> ${formData.phone || 'Não informado'}</p>
                    </div>
                `,
                icon: "success",
                draggable: true
            });

            setShowModal(false);
            setFormData({
                full_name: "",
                email: "",
                phone: "",
                role: "secretaria",
                password: ""
            });

            await fetchUsersAndRoles();

        } catch (err) {
            console.error("Erro ao criar usuário:", err);
            Swal.fire({
                title: "Erro!",
                text: err.message,
                icon: "error",
                draggable: true
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
            role: "secretaria",
            password: ""
        });
    };

    if (loading) return <p>Carregando usuários...</p>;

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-lg-8">
                        <h2 className="page-title">Usuários do Sistema</h2>
                    </div>
                    <div className="col-lg-4 text-right">
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={openCreateModal}
                        >
                            <i className="fa fa-plus"></i> Criar Usuário
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div style={{ overflowX: "auto" }}>
                            <table className="table table-striped table-bordered" style={{ width: "100%", tableLayout: "fixed" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "15%" }}>Nome</th>
                                        <th style={{ width: "20%" }}>Email</th>
                                        <th style={{ width: "15%" }}>Telefone</th>
                                        <th style={{ width: "12%"}}>Cargo</th>
                                        <th style={{ width: "23%", wordBreak: "break-word" }}>User ID</th>
                                        <th style={{ width: "15%" }}>Criado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
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
                                        <label>Cargo *</label>
                                        <select
                                            className="form-control"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="secretaria">Secretaria</option>
                                            <option value="admin">Administrador</option>
                                            
                                            
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
