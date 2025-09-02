import "../../assets/css/index.css"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import supabase from "../../Supabase"


function Doctors() {
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
    const fetchDoctors = async () => {
      const {data, error} = await supabase
        .from('Doctor')
        .select('*');
      if(error){
        console.error("Erro ao buscar pacientes:", error);
      }else{
        setDoctors(data);
      }
    };
    fetchDoctors();
  } , []);
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-sm-4 col-3">
                        <h4 className="page-title">Doutores</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                        <Link to= "/doctorform" className="btn btn-primary btn-rounded float-right"
                        onClick={console.log(doctors)}>
                            <i className="fa fa-plus">
                                </i> Adicionar Doutor
                        </Link>
                    </div>
                </div>

                <div className="row doctor-grid">
                    {/* Exemplo de um card de doutor */}
                    {doctors.map((doctors) => (
                    <div key={doctors.id} className="col-md-4 col-sm-4 col-lg-3">
                        <div className="profile-widget">
                            <div className="doctor-img">
                                <a className="avatar" href="profile.html">
                                    <img alt="" src="public/img/doctor-thumb-03.jpg" />
                                </a>
                            </div>
                            <div className="dropdown profile-action">
                                <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-ellipsis-v"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="edit-doctor.html">
                                        <i className="fa fa-pencil m-r-5"></i> Edit
                                    </a>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        data-toggle="modal"
                                        data-target="#delete_doctor"
                                    >
                                        <i className="fa fa-trash-o m-r-5"></i> Delete
                                    </a>
                                </div>
                            </div>
                            <h4 className="doctor-name text-ellipsis">
                                <a href="profile.html">{doctors.nome} {doctors.sobrenome}</a>
                            </h4>
                            <div className="doc-prof">{doctors.especialidade}</div>
                            <div className="user-country">
                                <i className="fa fa-map-marker"></i> {doctors.cidade}
                            </div>
                        </div>
                    </div>
                 ))}
                    {/* ... repete os outros cards dos doutores ... */}
                </div>
            </div>
            {/* Modal delete */}
            <div id="delete_doctor" className="modal fade delete-modal" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <img src="assets/img/sent.png" alt="" width="50" height="46" />
                            <h3>Are you sure want to delete this Doctor?</h3>
                            <div className="m-t-20">
                                {" "}
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
export default Doctors
