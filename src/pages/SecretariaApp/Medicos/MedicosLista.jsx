import "../../../assets/css/index.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../utils/auth"; 
import AvatarForm from "../../../../public/img/AvatarForm.jpg"// importa o token do usuário
import { useResponsive } from '../../../utils/useResponsive';

function MedicosLista() {
  const [doctors, setDoctors] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const tokenUsuario = getAccessToken(); // pega o token do usuário logado

  // monta os headers
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

  // deletar médico
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Tem certeza que deseja excluir este médico?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Excluir!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteOptions = {
            method: "DELETE",
            headers: myHeaders,
          };

          const response = await fetch(
            `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`,
            deleteOptions
          );

          if (!response.ok) {
            Swal.fire("Erro!", "Não foi possível excluir o registro.", "error");
          } else {
            setDoctors(doctors.filter((doc) => doc.id !== id));
            Swal.fire("Excluído!", "O registro foi removido com sucesso.", "success");
          }
        } catch (error) {
          Swal.fire("Erro inesperado!", "", "error");
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="content">
      <div className="row">
        <div className="col-sm-4 col-3">
          <h4 className="page-title">Médicos</h4>
        </div>
      </div>

      <div className="row doctor-grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="col-md-4 col-sm-4 col-lg-3">
            <div className="profile-widget">
              <div className="doctor-img">
                <div className="avatar">
                  <img alt="" src={AvatarForm}/>
                </div>
              </div>

              {/* Dropdown */}
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
                    <Link
                      className="dropdown-item-custom"
                      to={`/secretaria/medicosprofile/${doctor.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa fa-eye"></i> Ver Detalhes
                    </Link>
                    <Link
                      className="dropdown-item-custom"
                      to={`/secretaria/medicoseditar/${doctor.id}`}
                    >
                      <i className="fa fa-pencil m-r-5"></i> Editar
                    </Link>
                    <button
                      className="dropdown-item-custom dropdown-item-delete"
                      onClick={() => handleDelete(doctor.id)}
                    >
                      <i className="fa fa-trash-o m-r-5"></i> Excluir
                    </button>
                  </div>
                )}
              </div>

              <h4 className="doctor-name text-ellipsis">
                <Link to={`/secretaria/medicosprofile/${doctor.id}`}>
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
  );
}

export default MedicosLista;