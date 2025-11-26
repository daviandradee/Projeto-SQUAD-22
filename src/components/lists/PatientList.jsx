import { Link } from "react-router-dom";
import "../../assets/css/index.css";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import supabase from "../../Supabase.js";
import { getAccessToken } from "../../utils/auth.js";
import Swal from "sweetalert2";
import '../../assets/css/modal-details.css';
const AvatarForm = "/img/AvatarForm.jpg";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/userInfo.js";

function DropdownPortal({ anchorEl, isOpen, onClose, className, children }) {
  const menuRef = useRef(null);
  const [stylePos, setStylePos] = useState({
    position: "absolute", top: 0, left: 0, visibility: "hidden", zIndex: 1000,
  });

  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!anchorEl || !menuRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    let left = anchorRect.right + scrollX - menuRect.width;
    let top = anchorRect.bottom + scrollY;

    if (left < 0) left = scrollX + 4;
    if (top + menuRect.height > window.innerHeight + scrollY) {
      top = anchorRect.top + scrollY - menuRect.height;
    }

    setStylePos({
      position: "absolute", top: `${Math.round(top)}px`, left: `${Math.round(left)}px`,
      visibility: "visible", zIndex: 1000,
    });
  }, [isOpen, anchorEl, children]);


  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e) {
      const menu = menuRef.current;
      if (menu && !menu.contains(e.target) && anchorEl && !anchorEl.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, anchorEl]);


  if (!isOpen) return null;
  return createPortal(<div ref={menuRef} className={className} style={stylePos} onClick={e => e.stopPropagation()}>{children}</div>, document.body);
}

// ==================================================================================================== //

function PatientList() {

  const [search, setSearch] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [patients, setPatients] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const role = getUserRole();
  const navigate = useNavigate();

  const tokenUsuario = getAccessToken();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    fetch(`${supabaseUrl}/rest/v1/patients`, {
      method: "GET",
      headers: { apikey: supabaseAK, Authorization: `Bearer ${tokenUsuario}` }
    })
      .then(r => r.json())
      .then(r => setPatients(Array.isArray(r) ? r : []))
      .catch(console.log);
  }, []);

  // ==================================================================================================== //
  // 🔥 CORREÇÃO DO FILTRO — agora funciona com De / Até
  // ==================================================================================================== //

  const filteredPatients = patients.filter(p => {
    if (!p) return false;

    const nome = (p.full_name || "").toLowerCase();
    const cpf = (p.cpf || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const data = (p.birth_date || "").toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      nome.includes(q) || cpf.includes(q) || email.includes(q) || data.includes(q);

    let matchesSex = true;
    if (sexFilter) {
      const s = (p.sex || "").toLowerCase().trim();
      if (sexFilter === "masculino") matchesSex = ["masculino", "m", "male"].includes(s);
      if (sexFilter === "feminino") matchesSex = ["feminino", "f", "female"].includes(s);
      if (sexFilter === "outros") matchesSex = !["masculino", "m", "male", "feminino", "f", "female", ""].includes(s);
    }

    let matchesDate = true;
    const birth = new Date(p.birth_date);

    if (startDate) {
      const start = new Date(startDate);
      if (birth < start) matchesDate = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (birth > end) matchesDate = false;
    }

    return matchesSearch && matchesSex && matchesDate;
  });

  // ==================================================================================================== //

  const mascararCPF = cpf => cpf?.length < 5 ? cpf : `${cpf.slice(0, 3)}.***.***-${cpf.slice(-2)}`;

  const renderSexBadge = sex => {
    const s = (sex || "").toLowerCase().trim();
    if (["masculino", "m", "male"].includes(s)) return <span className="custom-badge status-blue"><i className="fa fa-mars" /> Masculino</span>;
    if (["feminino", "f", "female"].includes(s)) return <span className="custom-badge status-pink"><i className="fa fa-venus" /> Feminino</span>;
    if (s === "") return <span className="custom-badge status-red"><i className="fa fa-question" /> Em branco</span>;
    return <span className="custom-badge status-purple"><i className="fa fa-genderless" /> {s}</span>;
  };

  const can = {
    admin: ["editpatient", "deletepatient"],
    secretaria: ["editpatient", "deletepatient"],
    medico: []
  }[role] || [];

  const current = filteredPatients.slice((1 - 1) * 15, 15);

  // ==================================================================================================== //
  // UI FINAL – SEM NENHUMA ALTERAÇÃO VISUAL
  // ==================================================================================================== //

  return (
    <div className="main-wrapper"><div className="page-wrapper"><div className="content">

      <div className="d-flex justify-content-between"><h4>Lista de Pacientes</h4>
        <Link to={`/${role}/patientform`} className="btn btn-primary btn-rounded"><i className="fa fa-plus" /> Adicionar Paciente</Link></div>

      <div className="d-flex gap-1 mt-3">

        <input className="form-control form-control-sm" placeholder="🔍 Buscar"
          value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: "300px", maxWidth: "450px", }} />

        <div className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
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


        <div className="d-flex align-items-center" style={{ gap: "0.25rem" }}>
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


        <select className="form-control form-control-sm" value={sexFilter}
          onChange={e => setSexFilter(e.target.value)} style={{ minWidth: "80px", maxWidth: "125px", }}>
          <option value="">Todos</option><option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option><option value="outros">Outros</option>
        </select>

      </div>

      <table className="table mt-3">
        <thead><tr><th>Nome</th><th>CPF</th><th>Nasc.</th><th>Tel</th><th>Email</th><th className="text-center">Sexo</th></tr></thead>
        <tbody>
          {current.length > 0 ? current.map(p =>
            <tr key={p.id}>
              <td>{p.full_name}</td><td>{mascararCPF(p.cpf)}</td>
              <td>{p.birth_date}</td><td>{p.phone_mobile}</td><td>{p.email}</td>
              <td className="text-center">{renderSexBadge(p.sex)}</td>
            </tr>
          ) : <tr><td colSpan={6} className="text-center">Nenhum paciente encontrado</td></tr>}
        </tbody>
      </table>

    </div></div></div>
  );
}

export default PatientList;
