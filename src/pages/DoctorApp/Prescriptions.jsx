import { useState } from "react";
// import { supabase } from "../../services/supabaseClient"; // criaremos depois

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");

  const handleAddPrescription = () => {
    if (medication.trim() !== "" && dosage.trim() !== "") {
      const newPrescription = {
        id: Date.now(),
        medication,
        dosage,
      };
      setPrescriptions([...prescriptions, newPrescription]);
      setMedication("");
      setDosage("");

      // aqui entraria supabase.insert
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Receitas Médicas</h3>

      <div className="row">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Medicamento"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Dosagem"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" onClick={handleAddPrescription}>
            Adicionar
          </button>
        </div>
      </div>

      <ul className="list-group mt-3">
        {prescriptions.map((p) => (
          <li key={p.id} className="list-group-item">
            <strong>{p.medication}</strong> - {p.dosage}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Prescriptions;
