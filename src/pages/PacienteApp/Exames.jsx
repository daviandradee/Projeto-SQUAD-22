export default function MeusExames() {
  // mock de exames
  const exames = [
    { id: 1, nome: "Hemograma Completo", data: "10/09/2025", status: "Concluído" },
    { id: 2, nome: "Raio-X Tórax", data: "05/09/2025", status: "Em andamento" },
    { id: 3, nome: "Ressonância Magnética", data: "20/08/2025", status: "Concluído" },
  ];

  return (
    <div className="container mt-4">
      <h2>Meus Exames</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Nome do Exame</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {exames.map((exame) => (
            <tr key={exame.id}>
              <td>{exame.nome}</td>
              <td>{exame.data}</td>
              <td>{exame.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
