import "../../../assets/css/index.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../../Supabase";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../utils/auth";
import AvatarForm from "../../../../public/img/AvatarForm.jpg"


function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const tokenUsuario = getAccessToken()
  var myHeaders = new Headers();
  myHeaders.append(
    "apikey",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"
  );
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // buscar médicos
  useEffect(() => {
    fetch("https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors", requestOptions)
      .then((response) => response.json())
      .then((result) => setDoctors(Array.isArray(result) ? result : []))
      .catch((error) => console.log("error", error));
  }, []);


  const handleDelete = async (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Tem certeza que deseja excluir este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const tokenUsuario = getAccessToken(); // pega o token do usuário (mesmo que usa no form)

          var myHeaders = new Headers();
          myHeaders.append("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ");
          myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);
          myHeaders.append("Content-Type", "application/json");

          const response = await fetch(
            `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`,
            {
              method: "DELETE",
              headers: myHeaders,
            }
          );

          if (!response.ok) {
            const err = await response.json();
            console.error("Erro ao deletar médico:", err);
            Swal.fire("Erro!", err.message || "Não foi possível excluir o registro.", "error");
            return;
          }

          // Atualiza a lista local
          setDoctors((prev) => prev.filter((doc) => doc.id !== id));

          Swal.fire("Excluído!", "O registro foi removido com sucesso.", "success");
        } catch (error) {
          console.error("Erro inesperado:", error);
          Swal.fire("Erro!", "Algo deu errado ao excluir.", "error");
        }
      }
    });
  };

  const handleViewDetails = async (id) => {
    try {
      const tokenUsuario = getAccessToken();

      const response = await fetch(
        `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
            Authorization: `Bearer ${tokenUsuario}`,
          },
        }
      );

      const data = await response.json();
      const doctor = data[0];

      if (!doctor) {
        Swal.fire("Erro", "Não foi possível carregar os detalhes do médico.", "error");
        return;
      }

      Swal.fire({
        width: "800px",
        showConfirmButton: true,
        confirmButtonText: "Fechar",
        confirmButtonColor: "#4dabf7",
        background: document.body.classList.contains("dark-mode") ? "#1e1e2f" : "#fff",
        color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#000",
        html: `
        <div style="text-align:left;">
          <div style="
            display:flex; 
            justify-content:space-between; 
            align-items:center; 
            border-bottom:1px solid rgba(0,0,0,0.1);
            margin-bottom:15px;
            padding-bottom:5px;
          ">
            <h5 style="margin:0;">Perfil Médico</h5>
          </div>

          <div style="text-align:center; margin-bottom:20px;">
            <img 
              src="${doctor.foto || AvatarForm}" 
              alt="${doctor.full_name}"
              style="
                width:120px;
                height:120px;
                border-radius:50%;
                object-fit:cover;
                border:3px solid #4dabf7;
                box-shadow:0 4px 8px rgba(0,0,0,0.1);
              "
              onerror="this.src='${AvatarForm}'"
            />
            <h5 style="margin-top:10px;">${doctor.full_name}</h5>
            <p class="text-muted">${doctor.specialty || "Especialidade não informada"}</p>
          </div>

          <div style="display:flex; justify-content:space-between; gap:20px;">
            <div style="width:48%;">
              <p><strong>Telefone:</strong> ${doctor.phone_mobile || "—"}</p>
              <p><strong>Email:</strong> ${doctor.email || "—"}</p>
              <p><strong>Data de nascimento:</strong> ${doctor.birth_date || "—"}</p>
              <p><strong>Sexo:</strong> ${doctor.gender || "—"}</p>
            </div>
            <div style="width:48%;">
              <p><strong>Região:</strong> ${doctor.city || "—"}, ${doctor.state || "—"}, Brasil</p>
              <p><strong>CRM:</strong> ${doctor.crm || "—"}</p>
              <p><strong>Especialidade:</strong> ${doctor.specialty || "—"}</p>
              <p><strong>Experiência:</strong> ${doctor.experience_years || "—"} anos</p>
            </div>
          </div>

          <div style="margin-top:25px;">
            <h5>Biografia</h5>
            <p style="text-align:justify;">
              ${doctor.biografia || "Este médico ainda não possui biografia cadastrada."}
            </p>
          </div>
        </div>
      `,
      });
    } catch (err) {
      console.error("Erro ao buscar médico:", err);
      Swal.fire("Erro!", err.message || "Erro ao buscar médico.", "error");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-sm-4 col-3">
            <h4 className="page-title">Médicos</h4>
          </div>
          <div className="col-sm-8 col-9 text-right m-b-20">
            <Link
              to="/admin/doctorform"
              className="btn btn-primary btn-rounded float-right"
            >
              <i className="fa fa-plus"></i> Adicionar Médico
            </Link>
          </div>
        </div>

        <div className="row doctor-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="col-md-4 col-sm-4 col-lg-3">
              <div className="profile-widget">
                <div className="doctor-img">
                  <div className="avatar">
                    <img alt="" src={AvatarForm} />
                  </div>
                </div>

                {/* Dropdown estilizado */}
                <div className="dropdown profile-action">
                  <button
                    type="button"
                    className="action-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === doctor.id ? null : doctor.id);
                    }}
                  >
                    <i className="fa fa-ellipsis-v"></i>
                  </button>

                  {openDropdown === doctor.id && (
                    <div
                      className="dropdown-menu dropdown-menu-right show"
                      style={{ position: "absolute", zIndex: 1000 }}
                    >
                      {/* Ver Detalhes */}
                      <button
                        className="dropdown-item-custom"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(null);
                          handleViewDetails(doctor.id);
                        }}
                      >
                        <i className="fa fa-eye"></i> Ver Detalhes
                      </button>

                      {/* Edit */}
                      <Link
                        className="dropdown-item-custom"
                        to={`/admin/editdoctor/${doctor.id}`}
                      >
                        <i className="fa fa-pencil m-r-5"></i> Editar
                      </Link>

                      {/* Delete */}
                      <button
                        className="dropdown-item-custom dropdown-item-delete"
                        onClick={() => handleDelete(doctor.id)}
                      >
                        <i className="fa fa-trash-o m-r-5"></i> Delete
                      </button>
                    </div>
                  )}
                </div>

                <h4 className="doctor-name text-ellipsis">
                  <Link to={`/admin/profiledoctor/${doctor.id}`}>
                    {doctor.full_name}
                  </Link>
                </h4>
                <div className="doc-prof">{doctor.specialty}</div>
                <div className="user-country">
                  <i className="fa fa-map-marker"></i> {doctor.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal delete (não alterado) */}
      <div id="delete_doctor" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Are you sure want to delete this Doctor?</h3>
              <div className="m-t-20">
                <a href="#" className="btn btn-white" data-dismiss="modal">
                  Close
                </a>
                <button type="submit" className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Doctors;
