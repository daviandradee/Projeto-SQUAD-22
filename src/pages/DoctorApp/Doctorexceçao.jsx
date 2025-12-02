import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import Swal from "sweetalert2";
import { getAccessToken } from "../../utils/auth.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

const API_ROOT = `${supabaseUrl}/rest/v1`;
const AUTH_URL = `${supabaseUrl}/auth/v1/user`; // Endpoint para pegar dados do user logado
const API_URL = `${API_ROOT}/doctor_exceptions`;
const API_DOCTORS = `${API_ROOT}/doctors`;
const API_KEY = supabaseAK;

export default function Doctorexceçao() {
  const token = getAccessToken();

  const [exceptions, setExceptions] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(null); // Estado para o médico logado
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ---------- CONFIGURAÇÕES COMUNS ----------
  const commonHeaders = {
    apikey: API_KEY,
    Authorization: `Bearer ${token}`,
  };

  // ---------- 1. IDENTIFICAR USUÁRIO LOGADO ----------
  const loadCurrentUser = async () => {
    try {
      setLoading(true);

      // 1. Pega os dados da autenticação (Auth User)
      const resAuth = await fetch(AUTH_URL, { headers: commonHeaders });
      if (!resAuth.ok) throw new Error("Falha ao autenticar usuário");
      const user = await resAuth.json();

      // 2. Busca o perfil do médico correspondente na tabela 'doctors'
      // Assumindo que o ID do médico na tabela é igual ao ID do Auth (UUID)
      const resDoc = await fetch(`${API_DOCTORS}?user_id=eq.${user.id}`, { headers: commonHeaders });
      if (!resDoc.ok) throw new Error("Perfil de médico não encontrado");

      const docsData = await resDoc.json();

      if (docsData.length > 0) {
        const doc = docsData[0];
        setCurrentDoctor(doc);
        // Só carrega as exceções depois de saber quem é o médico
        loadExceptions(doc.id);
      } else {
        setErr("Seu usuário não está cadastrado como médico.");
      }
    } catch (e) {
      setErr(e.message || "Erro ao carregar perfil do usuário");
    } finally {
      setLoading(false);
    }
  };

  // ---------- 2. CARREGAR DADOS FILTRADOS ----------
  // Agora recebe o doctorId como argumento para filtrar na API
  const loadExceptions = async (doctorId) => {
    try {
      // Filtra onde doctor_id é igual ao ID do médico logado
      const url = `${API_URL}?select=*&doctor_id=eq.${doctorId}`;

      const res = await fetch(url, { headers: commonHeaders });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setExceptions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      // Não sobrescreve o erro principal se for apenas refresh
    }
  };

  useEffect(() => {
    if (token) {
      loadCurrentUser();
    }
  }, [token]);

  // ---------- CRIAR EXCEÇÃO ----------
  const createException = async (payload) => {
    try {
      const body = {
        ...payload,
        // Garante que quem cria é o próprio médico
        created_by: currentDoctor.id,
        doctor_id: currentDoctor.id
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          ...commonHeaders,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());
      await res.json();
      // Recarrega usando o ID do médico logado
      await loadExceptions(currentDoctor.id);
      Swal.fire("Sucesso!", "Exceção criada com sucesso.", "success");
    } catch (e) {
      Swal.fire("Erro ao criar", e.message || "Falha ao criar exceção", "error");
    }
  };

  // ---------- DELETAR EXCEÇÃO ----------
  const deleteException = async (id) => {
    const confirm = await Swal.fire({
      title: "Excluir exceção?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}?id=eq.${id}`, {
        method: "DELETE",
        headers: commonHeaders,
      });
      if (!res.ok) throw new Error(await res.text());

      // Recarrega usando o ID do médico logado
      await loadExceptions(currentDoctor.id);
      Swal.fire("Removida!", "Exceção excluída com sucesso.", "success");
    } catch (e) {
      Swal.fire("Erro ao excluir", e.message || "Falha ao excluir", "error");
    }
  };

  // ---------- EVENTOS DO CALENDÁRIO ----------
  const events = useMemo(() => {
    return exceptions.map((ex) => {
      const isBlock = ex.kind === "bloqueio";
      return {
        id: ex.id,
        title: isBlock ? "Bloqueio" : "Liberação",
        start: ex.date,
        allDay: true,
        backgroundColor: isBlock ? "#ef4444" : "#22c55e",
        borderColor: isBlock ? "#b91c1c" : "#15803d",
        textColor: "#fff",
      };
    });
  }, [exceptions]);

  // ---------- HANDLERS ----------
  const handleDateClick = async (info) => {
    if (!currentDoctor) {
      Swal.fire("Erro", "Perfil de médico não identificado.", "error");
      return;
    }

    // REMOVIDA A ETAPA 1 (Seleção de médico)
    // Agora vai direto para a seleção do tipo de exceção

    // 1️⃣ Tipo da exceção
    const s2 = await Swal.fire({
      title: `Nova exceção — ${info.dateStr}`,
      text: "O que deseja fazer nesta data?",
      input: "select",
      inputOptions: {
        bloqueio: "Bloqueio (Não atender)",
        liberacao: "Liberação (Atender extra)",
      },
      inputPlaceholder: "Selecione o tipo",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      didOpen: (popup) => {
        popup.style.position = "fixed";
        popup.style.top = "230px";
      }
    });
    if (!s2.isConfirmed || !s2.value) return;
    const kind = s2.value;

    // 2️⃣ Motivo
    const form = await Swal.fire({
      title: "Motivo (opcional)",
      input: "text",
      inputPlaceholder: "Ex: Congresso, folga, manutenção...",
      showCancelButton: true,
      confirmButtonText: "Criar exceção",
      didOpen: (popup) => {
        popup.style.position = "fixed";
        popup.style.top = "230px";
      }
    });
    if (!form.isConfirmed) return;

    const payload = {
      // O ID vem do estado global do componente
      doctor_id: currentDoctor.id,
      date: info.dateStr,
      kind,
      reason: form.value || null,
    };

    await createException(payload);
  };

  const handleEventClick = async (info) => {
    const e = exceptions.find((x) => x.id === info.event.id);
    if (!e) return;

    await Swal.fire({
      title: e.kind === "bloqueio" ? "Bloqueio" : "Liberação",
      html: `<b>Data:</b> ${e.date}<br>
             <b>Motivo:</b> ${e.reason || "-"}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Fechar",
    }).then((r) => {
      if (r.isConfirmed) deleteException(e.id);
    });
  };

  // ---------- UI ----------
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="page-title">
                Minhas Exceções {currentDoctor ? `(${currentDoctor.full_name})` : ""}
              </h4>
              <span className="text-muted">
                Clique numa data para bloquear ou liberar sua agenda
              </span>
            </div>
          </div>
        </div>

        {/* Calendário */}
        <div className="row">
          <div className="col-12">
            <div
              className="card"
              style={{
                borderRadius: 10,
                padding: 16,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {loading ? (
                <p className="text-muted m-0">Identificando médico e carregando agenda...</p>
              ) : err ? (
                <div className="alert alert-danger">{err}</div>
              ) : (
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  height="auto"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek,dayGridDay",
                  }}
                  events={events}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                />
              )}
            </div>
          </div>
        </div>

        {/* Lista de exceções */}
        <div className="row" style={{ marginTop: 16 }}>
          <div className="col-12">
            <div className="card" style={{ borderRadius: 10 }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title m-0">Minhas Exceções Registradas</h5>
                <small className="text-muted">{exceptions.length} registro(s)</small>
              </div>

              <div className="card-body" style={{ paddingTop: 8 }}>
                {loading ? (
                  <p className="text-muted m-0">Carregando...</p>
                ) : !err && exceptions.length === 0 ? (
                  <p className="text-muted m-0">Nenhuma exceção encontrada para você.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-border table-striped custom-table mb-0">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Tipo</th>
                          <th>Motivo</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exceptions.map((ex) => (
                          <tr key={ex.id}>
                            <td>{ex.date}</td>
                            <td>
                              {ex.kind === "bloqueio" ? (
                                <span className="custom-badge status-red">Bloqueio</span>
                              ) : (
                                <span className="custom-badge status-green">Liberação</span>
                              )}
                            </td>
                            <td>{ex.reason || "-"}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteException(ex.id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}