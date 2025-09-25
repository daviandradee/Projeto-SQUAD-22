import "../../../assets/css/index.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../../Supabase";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("Doctor")
        .select("*");
      if (error) {
        console.error("Erro ao buscar pacientes:", error);
      } else {
        setDoctors(data);
      }
    };
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este médico?")) {
      const { error } = await supabase.from("Doctor").delete().eq("id", id);
      if (error) console.error("Erro ao deletar médico:", error);
      else setDoctors(doctors.filter((doc) => doc.id !== id));
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
                    <img alt="" src="/img/doctor-thumb-03.jpg" />
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
                      <Link
                        className="dropdown-item-custom"
                        to={`/admin/profiledoctor/${doctor.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fa fa-eye"></i> Ver Detalhes
                      </Link>
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
                    {doctor.nome} {doctor.sobrenome}
                  </Link>
                </h4>
                <div className="doc-prof">{doctor.especialidade}</div>
                <div className="user-country">
                  <i className="fa fa-map-marker"></i> {doctor.cidade}
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
