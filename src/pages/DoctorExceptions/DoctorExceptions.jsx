import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import Swal from "sweetalert2";
import { getAccessToken } from "../../utils/auth";


const API_ROOT = "https://yuanqfswhberkoevtmfr.supabase.co/rest/v1";
const API_URL = `${API_ROOT}/doctor_exceptions`;
const API_DOCTORS = `${API_ROOT}/doctors?select=id,full_name`;
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

export default function DoctorExceptions() {
  const token = getAccessToken();

  const [exceptions, setExceptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ---------- CONFIGURAÇÕES COMUNS ----------
  const commonHeaders = {
    apikey: API_KEY,
    Authorization: `Bearer ${token}`,
  };

  // ---------- CARREGAR DADOS ----------
  const loadExceptions = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch(`${API_URL}?select=*`, { headers: commonHeaders });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setExceptions(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Erro ao carregar exceções");
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const res = await fetch(API_DOCTORS, { headers: commonHeaders });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch {
      setDoctors([]);
    }
  };

  useEffect(() => {
    loadDoctors();
    loadExceptions();
  }, [token]);

  // ---------- CRIAR EXCEÇÃO ----------
  const createException = async (payload) => {
    try {
      const body = {
        ...payload,
        created_by: payload.created_by || payload.doctor_id,
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
      console.log("Criar exceção - resposta da API:", body); // DEBUG
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      await loadExceptions();
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
      await loadExceptions();
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
    if (!doctors.length) {
      Swal.fire("Sem médicos", "Cadastre médicos antes de criar exceções.", "info");
      return;
    }

    // 1️⃣ Selecionar médico
    const doctorOptions = doctors.reduce((acc, d) => {
      acc[d.id] = d.full_name || d.id;
      return acc;
    }, {});
    const s1 = await Swal.fire({
      title: `Nova exceção — ${info.dateStr}`,
      input: "select",
      inputOptions: doctorOptions,
      inputPlaceholder: "Selecione o médico",
      showCancelButton: true,
      confirmButtonText: "Continuar",
    });
    if (!s1.isConfirmed || !s1.value) return;
    const doctor_id = s1.value;

    // 2️⃣ Tipo da exceção
    const s2 = await Swal.fire({
      title: "Tipo de exceção",
      input: "select",
      inputOptions: {
        bloqueio: "Bloqueio (remover horários)",
        liberacao: "Liberação (adicionar horários extras)",
      },
      inputPlaceholder: "Selecione o tipo",
      showCancelButton: true,
      confirmButtonText: "Continuar",
    });
    if (!s2.isConfirmed || !s2.value) return;
    const kind = s2.value;

    // 3️⃣ Motivo
    const form = await Swal.fire({
      title: "Motivo (opcional)",
      input: "text",
      inputPlaceholder: "Ex: Congresso, folga, manutenção...",
      showCancelButton: true,
      confirmButtonText: "Criar exceção",
    });
    if (!form.isConfirmed) return;

    const payload = {
      doctor_id,
      created_by: doctor_id,
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
      html: `<b>Médico:</b> ${
        doctors.find((d) => d.id === e.doctor_id)?.full_name || e.doctor_id
      }<br>
             <b>Data:</b> ${e.date}<br>
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
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h4 className="page-title">Exceções (Bloqueios / Liberações)</h4>
                <span className="text-muted">
                  Clique numa data para adicionar exceções por médico
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
                  <p className="text-muted m-0">Carregando calendário…</p>
                ) : err ? (
                  <p className="text-danger m-0">Erro: {err}</p>
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
                  <h5 className="card-title m-0">Lista de Exceções</h5>
                  <small className="text-muted">{exceptions.length} registro(s)</small>
                </div>

                <div className="card-body" style={{ paddingTop: 8 }}>
                  {loading ? (
                    <p className="text-muted m-0">Carregando lista…</p>
                  ) : err ? (
                    <p className="text-danger m-0">Erro: {err}</p>
                  ) : exceptions.length === 0 ? (
                    <p className="text-muted m-0">Nenhuma exceção encontrada.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-border table-striped custom-table mb-0">
                        <thead>
                          <tr>
                            <th>Médico</th>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Motivo</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exceptions.map((ex) => (
                            <tr key={ex.id}>
                              <td>
                                {doctors.find((d) => d.id === ex.doctor_id)?.full_name ||
                                  ex.doctor_id}
                              </td>
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
              <p className="text-muted" style={{ fontSize: 12 }}>
                * <b style={{ color: "#ef4444" }}>Vermelho</b> = Bloqueio,&nbsp;
                <b style={{ color: "#22c55e" }}>Verde</b> = Liberação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}