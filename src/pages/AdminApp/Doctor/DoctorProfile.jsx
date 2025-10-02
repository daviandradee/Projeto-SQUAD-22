import "../../../assets/css/index.css"
import supabase from "../../../Supabase";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
function DoctorProfile() { 
    const [doctorData, setdoctorData] = useState([]);
    const {id} = useParams()
    useEffect(() => {
    const fetchDoctors = async () => {
      const {data, error} = await supabase
        .from('Doctor')
        .select('*')
        .eq ('id', id)
        .single()
      if(error){
        console.error("Erro ao buscar pacientes:", error);
      }else{
        setdoctorData(data);
      }
    };
    fetchDoctors();
  } , []);
    
  return (
    <div className="main-wrapper">
      {/* Page Content */}
      <div className="page-wrapper">
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
                     
                        <img  src="/img/doctor-thumb-03.jpg" />
                      </a>
                    </div>
                  </div>
                  <div className="profile-basic">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="profile-info-left"> 
                          <h3 className="user-name m-t-0 mb-0">{doctorData.nome} {doctorData.sobrenome}</h3>
                          <a className="specialty">{doctorData.specialty}</a> 
                          <div className="staff-id"></div>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <ul className="personal-info">
                          <li>
                            <span className="title">Phone:</span>
                            <span className="phone_mobile"><a href="#">{doctorData.phone_mobile}</a></span>
                          </li>
                          <li>
                            <span className="title">Email:</span>
                            <span className="text"><a href="#">{doctorData.email}</a></span>
                          </li>
                          <li>
                            <span className="title">Data de nascimento:</span>
                            <span className="text">{doctorData.data_nascimento}</span>
                          </li>
                          <li>
                            <span className="title">Região</span>
                            <span className="text">{doctorData.cidade}, {doctorData.estado}, Brasil</span>
                          </li>
                          <li>
                            <span className="title">Sexo</span>
                            <span className="text">{doctorData.sexo}</span>
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
                <a className="nav-link active" href="#about-cont" data-toggle="tab">Sobre</a>
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
            
                                <p>{doctorData.biografia}</p>
                              
                            </div>
                        
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DoctorProfile