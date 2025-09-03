import supabase from "../../Supabase";
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
              <h4 className="page-title">My Profile</h4>
            </div>
            <div className="col-sm-5 col-6 text-right m-b-30">
              <a  className="btn btn-primary btn-rounded">
                <i className="fa fa-plus"></i> Edit Profile
              </a>
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
                        <img className="avatar" src="assets/img/doctor-03.jpg"  />
                      </a>
                    </div>
                  </div>
                  <div className="profile-basic">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="profile-info-left"> 
                          <h3 className="user-name m-t-0 mb-0">{doctorData.nome} {doctorData.sobrenome}</h3>
                          <small className="text-muted">{doctorData.especialidade}</small>
                          <div className="staff-id"></div>
                          <div className="staff-msg">
                            <a href="chat.html" className="btn btn-primary">Send Message</a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <ul className="personal-info">
                          <li>
                            <span className="title">Phone:</span>
                            <span className="text"><a href="#">{doctorData.telefone}</a></span>
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
                <a className="nav-link active" href="#about-cont" data-toggle="tab">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#bottom-tab2" data-toggle="tab">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#bottom-tab3" data-toggle="tab">Messages</a>
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

                    <div className="card-box mb-0">
                      <h3 className="card-title">Experience</h3>
                      <div className="experience-box">
                        <ul className="experience-list">
                          <li>
                            <div className="experience-user"><div className="before-circle"></div></div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                <a href="#/" className="name">Consultant Gynecologist</a>
                                <span className="time">Jan 2014 - Present</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="tab-pane" id="bottom-tab2">Tab content 2</div>
              <div className="tab-pane" id="bottom-tab3">Tab content 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DoctorProfile