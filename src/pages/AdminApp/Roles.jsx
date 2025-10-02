import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/auth"; // ajuste o caminho se for diferente

function Roles() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = getAccessToken();

                var myHeaders = new Headers();
                myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
                myHeaders.append("Authorization", `Bearer ${token}`,);
                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };
                const response = await fetch(
                    "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/user_roles",
                    requestOptions
                );

                if (!response.ok) throw new Error("Erro ao buscar usuários");

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    if (loading) return <p>Carregando usuários...</p>;

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className="page-title">Usuários e Cargos</h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div style={{ overflowX: "auto" }}>
                            <table 
                                className="table table-striped table-bordered"
                                style={{ width: "100%", tableLayout: "fixed" }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: "50%" }}>User ID</th>
                                        <th style={{ width: "30%" }}>Cargo</th>
                                        <th style={{ width: "20%" }}>Criado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td style={{ wordBreak: "break-word" }}>{user.user_id}</td>
                                                <td>{user.role}</td>
                                                <td>{formatDate(user.created_at)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                Nenhum usuário encontrado
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
    );
}

export default Roles;