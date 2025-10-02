import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/auth"; // ajuste o caminho se for diferente

function Roles() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className="content">
            <h2>Usuários e Cargos</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Cargo</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.full_name}</td>
                                <td>{user.user_id}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Nenhum usuário encontrado</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Roles;