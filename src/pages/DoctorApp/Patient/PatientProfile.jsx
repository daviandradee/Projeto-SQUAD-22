import "../../../assets/css/index.css"
import supabase from "../../../Supabase";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useResponsive from '../../../utils/useResponsive';
function PatientProfile() {
    const [patient, setPatient] = useState([]);
    // carregando a lista e adicionando no usestate
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    useEffect(() => {
        fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log("API result:", result);
                setPatient(result.data || []);
            })
            .catch((error) => console.log("error", error));
    }, []);

    return (

        <div className="content">
            <div className="row">
                <div className="col-sm-7 col-6">
                    <h4 className="page-title">Perfil Médico</h4>
                </div>
            </div>
            <div className="card-box profile-header">
                <div className="row">
                    <div className="col-md-12">
                        <div className="profile-view">
                            <div className="profile-img-left">
                                <a>
                                    <img src="/img/doctor-thumb-03.jpg" />
                                </a>
                            </div>
                            <div className="profile-basic">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="profile-info-left">
                                            <h3 className="user-name m-t-0 mb-0">{patient.nome}</h3>
                                            <a className="text">{patient.especialidade}</a>
                                            <div className="staff-id"></div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <ul className="personal-info">
                                            <li>
                                                <span className="title">Phone:</span>
                                                <span className="text"><a href="#">{patient.nome}</a></span>
                                            </li>
                                            <li>
                                                <span className="title">Email:</span>
                                                <span className="text"><a href="#">{patient.email}</a></span>
                                            </li>
                                            <li>
                                                <span className="title">Data de nascimento:</span>
                                                <span className="text">{patient.data_nascimento}</span>
                                            </li>
                                            {/*<li>
                            <span className="title">Região</span>
                            <span className="text">{patient.cidade}, {patient.estado}, Brasil</span>
                          </li>}*/}
                                            <li>
                                                <span className="title">Sexo</span>
                                                <span className="text">{patient.sexo}</span>
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

                                            <p>{patient.biografia}</p>

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
export default PatientProfile