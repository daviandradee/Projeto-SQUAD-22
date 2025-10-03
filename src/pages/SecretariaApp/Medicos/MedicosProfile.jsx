import "../../../assets/css/index.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAccessToken } from "../../../utils/auth";
import AvatarForm from "../../../../public/img/AvatarForm.jpg"

function MedicosProfile() {
  const [doctorData, setDoctorData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const tokenUsuario = getAccessToken();

        const response = await fetch(
          `https://yuanqfswhberkoevtmfr.supabase.co/rest/v1/doctors?id=eq.${id}`,
          {
            method: "GET",
            headers: {
              apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ",
              Authorization: `Bearer ${tokenUsuario}`,
            },
          }
        );

        const data = await response.json();
        if (data && data.length > 0) {
          setDoctorData(data[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar médico:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  if (loading) {
    return <p className="text-center">Carregando informações do médico...</p>;
  }

  return (
        <div className="content">
          <div className="row">
            <div className="col-sm-7 col-6">
              <h4 className="page-title">Perfil Médico</h4>
            </div>
          </div>

          {/* Profile Header */}
          <div className="card-box profile-header">
            <div className="row">
              <div className="col-md-12">
                <div className="profile-view">
                  <div className="profile-img-wrap">
                    <div className="profile-img">
                      <a href="#">
                        <img
                          src={doctorData.foto || AvatarForm}
                          alt="Foto do médico"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="profile-basic">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="profile-info-left">
                          <h3 className="user-name m-t-0 mb-0">
                            {doctorData.full_name}
                          </h3>
                          <a className="specialty">{doctorData.specialty}</a>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <ul className="personal-info">
                          <li>
                            <span className="title">Phone:</span>
                            <span className="phone_mobile">
                              <a href="#">{doctorData.phone_mobile}</a>
                            </span>
                          </li>
                          <li>
                            <span className="title">Email:</span>
                            <span className="text">
                              <a href="#">{doctorData.email}</a>
                            </span>
                          </li>
                          <li>
                            <span className="title">Data de nascimento:</span>
                            <span className="text">{doctorData.birth_date}</span>
                          </li>
                          <li>
                            <span className="title">Região</span>
                            <span className="text">
                              {doctorData.city}, {doctorData.state}, Brasil
                            </span>
                          </li>
                          <li>
                            <span className="title">Sexo</span>
                            <span className="text">{doctorData.gender}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <ul className="nav nav-tabs nav-tabs-bottom">
              <li className="nav-item">
                <a className="nav-link active" href="#about-cont" data-toggle="tab">
                  Sobre
                </a>
              </li>
            </ul>

            <div className="tab-content">
              <div className="tab-pane show active" id="about-cont">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card-box">
                      <h3 className="card-title">Biografia</h3>
                      <div className="experience-box">
                        <div className="experience-content">
                          <p>
                            {doctorData.biografia ||
                              "Este médico ainda não possui biografia cadastrada."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Tabs */}
        </div>
  );
}

export default MedicosProfile;
