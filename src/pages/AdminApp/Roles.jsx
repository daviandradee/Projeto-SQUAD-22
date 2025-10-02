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
        const fetchUsersAndRoles = async () => {
          try {
            const token = getAccessToken();
    
            const headers = {
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            };
    
            // 1. Buscar perfis
            const resProfiles = await fetch(
              "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/profiles",
              { method: "GET", headers }
            );
            if (!resProfiles.ok) throw new Error("Erro ao buscar perfis");
            const profiles = await resProfiles.json();
    
            // 2. Buscar roles
            const resRoles = await fetch(
              "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/user_roles",
              { method: "GET", headers }
            );
            if (!resRoles.ok) throw new Error("Erro ao buscar roles");
            const roles = await resRoles.json();
    
            // 3. Juntar os dois arrays
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
          } finally {
            setLoading(false);
          }
        };
    
        fetchUsersAndRoles();
      }, []);
    
      if (loading) return <p>Carregando usuários...</p>;
    

    return (
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-lg-12">
                <h2 className="page-title">Usuários do Sistema</h2>
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
                        
                        <th style={{ width: "10%" }}>Nome</th>
                        <th style={{ width: "20%" }}>Email</th>
                        <th style={{ width: "15%" }}>Telefone</th>
                        <th style={{ width: "10%"}}>Cargo</th>
                        <th style={{ width: "25%", wordBreak: "break-word" }}>
                          User ID
                        </th>
                        <th style={{ width: "20%" }}>Criado em</th>
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
                            <td style={{ wordBreak: "break-word" }}>
                              {user.id}
                            </td>
                            <td>{formatDate(user.created_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
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