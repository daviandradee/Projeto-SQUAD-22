import { useState, useEffect } from "react";
// import { supabase } from "../../services/supabaseClient"; // criaremos depois

function Reports() {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState("");

  // exemplo de busca futura no supabase
  // useEffect(() => {
  //   async function loadReports() {
  //     let { data, error } = await supabase.from("reports").select("*");
  //     if (!error) setReports(data);
  //   }
  //   loadReports();
  // }, []);

  const handleAddReport = () => {
    if (newReport.trim() !== "") {
      setReports([...reports, { id: Date.now(), text: newReport }]);
      setNewReport("");
      // aqui entraria a chamada do supabase.insert
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Laudos Médicos</h3>

      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Escreva um laudo..."
          value={newReport}
          onChange={(e) => setNewReport(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddReport}>
          Salvar Laudo
        </button>
      </div>

      <ul className="list-group">
        {reports.map((report) => (
          <li key={report.id} className="list-group-item">
            {report.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;

