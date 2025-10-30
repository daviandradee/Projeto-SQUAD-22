import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const Transações = () => {
  // Estados separados para cada pesquisa
  const [searchReceitas, setSearchReceitas] = useState("");
  const [searchDespesas, setSearchDespesas] = useState("");

  //Dados mockados
  const financeiroPositivoMock = {
  consultas: [
    {
      id: 1,
      data: "2025-10-10",
      paciente: "João Silva",
      tipo: "SUS",
      procedimento: "Consulta Clínica",
      valor: 125.50,
      status: "Pago",
      convênio: "SUS",
    },
    {
      id: 2,
      data: "2025-10-11",
      paciente: "Ana Costa",
      tipo: "Particular",
      procedimento: "Dermatologia",
      valor: 180.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 3,
      data: "2025-10-12",
      paciente: "Carlos Oliveira",
      tipo: "Convênio",
      procedimento: "Cardiologia",
      valor: 89.90,
      status: "Pago",
      convênio: "Unimed",
    },
    {
      id: 4,
      data: "2025-10-13",
      paciente: "Maria Santos",
      tipo: "SUS",
      procedimento: "Pediatria",
      valor: 45.00,
      status: "Pendente",
      convênio: "SUS",
    },
    {
      id: 5,
      data: "2025-10-14",
      paciente: "Pedro Almeida",
      tipo: "Particular",
      procedimento: "Ortopedia",
      valor: 220.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 6,
      data: "2025-10-15",
      paciente: "Fernanda Lima",
      tipo: "Convênio",
      procedimento: "Ginecologia",
      valor: 95.00,
      status: "Pendente",
      convênio: "Amil",
    },
    {
      id: 7,
      data: "2025-10-16",
      paciente: "Ricardo Souza",
      tipo: "SUS",
      procedimento: "Clínica Geral",
      valor: 35.00,
      status: "Pago",
      convênio: "SUS",
    },
    {
      id: 8,
      data: "2025-10-17",
      paciente: "Juliana Costa",
      tipo: "Particular",
      procedimento: "Psicologia",
      valor: 150.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 9,
      data: "2025-10-18",
      paciente: "Roberto Ferreira",
      tipo: "Convênio",
      procedimento: "Neurologia",
      valor: 120.00,
      status: "Pendente",
      convênio: "Bradesco Saúde",
    },
    {
      id: 10,
      data: "2025-10-19",
      paciente: "Amanda Rodrigues",
      tipo: "SUS",
      procedimento: "Odontologia",
      valor: 28.50,
      status: "Pago",
      convênio: "SUS",
    },
    {
      id: 11,
      data: "2025-10-20",
      paciente: "Lucas Mendes",
      tipo: "Particular",
      procedimento: "Dermatologia",
      valor: 195.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 12,
      data: "2025-10-21",
      paciente: "Patrícia Nunes",
      tipo: "Convênio",
      procedimento: "Oftalmologia",
      valor: 78.00,
      status: "Pendente",
      convênio: "SulAmérica",
    }
  ]
};

const financeiroNegativoMock = {
  consultas: [
    {
      id: 101,
      data: "2025-10-01",
      paciente: "Aluguel Consultório",
      tipo: "Despesa Fixa",
      procedimento: "Aluguel Mensal",
      valor: 1500.00,
      status: "Pendente",
      convênio: "-",
    },
    {
      id: 102,
      data: "2025-10-05",
      paciente: "Material de Escritório",
      tipo: "Despesa Variável",
      procedimento: "Suprimentos",
      valor: 250.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 103,
      data: "2025-10-07",
      paciente: "Energia Elétrica",
      tipo: "Despesa Fixa",
      procedimento: "Conta de Luz",
      valor: 180.30,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 104,
      data: "2025-10-08",
      paciente: "Água e Esgoto",
      tipo: "Despesa Fixa",
      procedimento: "Conta de Água",
      valor: 85.20,
      status: "Pendente",
      convênio: "-",
    },
    {
      id: 105,
      data: "2025-10-10",
      paciente: "Internet e Telefone",
      tipo: "Despesa Fixa",
      procedimento: "Banda Larga",
      valor: 129.90,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 106,
      data: "2025-10-12",
      paciente: "Salário Recepcionista",
      tipo: "Despesa Fixa",
      procedimento: "Folha de Pagamento",
      valor: 2200.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 107,
      data: "2025-10-15",
      paciente: "Material Médico",
      tipo: "Despesa Variável",
      procedimento: "Luvas e Máscaras",
      valor: 340.00,
      status: "Pendente",
      convênio: "-",
    },
    {
      id: 108,
      data: "2025-10-18",
      paciente: "Limpeza e Conservação",
      tipo: "Despesa Fixa",
      procedimento: "Serviço de Limpeza",
      valor: 320.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 109,
      data: "2025-10-20",
      paciente: "Software Médico",
      tipo: "Despesa Variável",
      procedimento: "Licença Anual",
      valor: 890.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 110,
      data: "2025-10-22",
      paciente: "Seguro do Consultório",
      tipo: "Despesa Fixa",
      procedimento: "Prêmio Anual",
      valor: 450.00,
      status: "Pendente",
      convênio: "-",
    },
    {
      id: 111,
      data: "2025-10-25",
      paciente: "Combustível",
      tipo: "Despesa Variável",
      procedimento: "Abastecimento",
      valor: 180.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 112,
      data: "2025-10-28",
      paciente: "Manutenção Equipamentos",
      tipo: "Despesa Variável",
      procedimento: "Manutenção Preventiva",
      valor: 520.00,
      status: "Pendente",
      convênio: "-",
    },
    {
      id: 113,
      data: "2025-10-30",
      paciente: "Marketing Digital",
      tipo: "Despesa Variável",
      procedimento: "Anúncios Online",
      valor: 300.00,
      status: "Pago",
      convênio: "-",
    },
    {
      id: 114,
      data: "2025-10-31",
      paciente: "IPTU",
      tipo: "Despesa Fixa",
      procedimento: "Imposto Predial",
      valor: 420.00,
      status: "Pendente",
      convênio: "-",
    }
  ]
};

  // Filtrar receitas baseado na pesquisa
  const filteredReceitas = financeiroPositivoMock.consultas.filter(item => 
    item.paciente.toLowerCase().includes(searchReceitas.toLowerCase()) ||
    item.id.toString().includes(searchReceitas) ||
    item.procedimento.toLowerCase().includes(searchReceitas.toLowerCase()) ||
    item.tipo.toLowerCase().includes(searchReceitas.toLowerCase())
  );

  // Filtrar despesas baseado na pesquisa
  const filteredDespesas = financeiroNegativoMock.consultas.filter(item =>
    item.paciente.toLowerCase().includes(searchDespesas.toLowerCase()) ||
    item.id.toString().includes(searchDespesas) ||
    item.procedimento.toLowerCase().includes(searchDespesas.toLowerCase()) ||
    item.tipo.toLowerCase().includes(searchDespesas.toLowerCase())
  );

  const BarChart = () => {
    const options = {
      chart: {
        id: "receitas-bar",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
        },
      },
      dataLabels: {
        enabled: true,
        style: { colors: ["#fff"] },
        offsetY: -2,
      },
      xaxis: {
        categories: ["07/25", "08/25", "09/25", "10/25", "11/25", "12/25"],
        labels: { style: { colors: "#666" } },
      },
      yaxis: {
        labels: { style: { colors: "#666" } },
      },
      grid: {
        borderColor: "#e0e0e0",
        strokeDashArray: 3,
      },
      colors: ["#3e9c35", "red"],
    };

    const series = [
      {
        name: "Receitas (R$)",
        data: [100, 80, 140, 130, 200, 50],
      },
      {
        name: "Despesas (R$)",
        data: [20, 30, 100, 20, 20, 10],
      },
    ];

    return (
      <div
        className="p-3 bg-white rounded shadow-sm"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h5 className="text-center text-success mb-3">Saldo</h5>
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
    );
  };

  return (
    <div className="content">
      <BarChart />
      <div className="row">
        <div className="col-md-12">
          {/* SEÇÃO RECEITAS */}
          <h4 className="page-title" style={{color: "#3e9c35"}}>Receitas</h4>
          <div style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: "#fff",
            border: "2px solid #3e9c35",
            width: "100%"
          }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Buscar por paciente, código ou procedimento..."
              value={searchReceitas}
              onChange={(e) => setSearchReceitas(e.target.value)}
              style={{minWidth: "200px"}}
            />
            <br />
            <div className="table-responsive" style={{
              maxHeight: "400px",
              overflowY: "auto",
              borderTop: "1px solid #ddd"
            }}>
              <table className="table table-border table-striped custom-table datatable mb-0">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Valor (R$)</th>
                    <th>Status</th>
                    <th>Data de vencimento</th>
                    <th>Tipo</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceitas.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id || "-"}</td>
                      <td>{item.paciente || "-"}</td>
                      <td style={{
                        color: "#3e9c35",
                        fontWeight: "bold"
                      }}>+ {item.valor.toFixed(2) || "-"}</td>
                      <td>
                        <span
                          className={`custom-badge ${
                            item.status === "Pago" ? "status-green" : "status-red"
                          }`}
                        >
                          {item.status || "—"}
                        </span>
                      </td>
                      <td>{item.data || "-"}</td>
                      <td>{item.tipo || "-"}</td>
                      <td className="text-right">
                        {/* Botões de ação */}
                        <button className="btn btn-sm btn-outline-primary me-1">
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mensagem quando não há resultados */}
              {filteredReceitas.length === 0 && (
                <div className="text-center p-3 text-muted">
                  <p>
                    {searchReceitas 
                      ? `Nenhuma receita encontrada para "${searchReceitas}"`
                      : "Nenhuma receita cadastrada"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEÇÃO DESPESAS */}
          <h4 className="page-title" style={{
            color: "red",
            marginTop: "20px",
          }}>Despesas</h4>
          <div style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: "#fff",
            border: "2px solid red",
            width: "100%"
          }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Buscar por despesa, código ou tipo..."
              value={searchDespesas}
              onChange={(e) => setSearchDespesas(e.target.value)}
              style={{minWidth: "200px"}}
            />
            <br />
            <div className="table-responsive" style={{
              maxHeight: "400px",
              overflowY: "auto",
              borderTop: "1px solid #ddd"
            }}>
              <table className="table table-border table-striped custom-table datatable mb-0">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Valor (R$)</th>
                    <th>Status</th>
                    <th>Data de vencimento</th>
                    <th>Tipo</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDespesas.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id || "-"}</td>
                      <td>{item.paciente || "-"}</td>
                      <td style={{
                        color: "red",
                        fontWeight: "bold"
                      }}>- {item.valor.toFixed(2) || "-"}</td>
                      <td>
                        <span
                          className={`custom-badge ${
                            item.status === "Pago" ? "status-green" : "status-red"
                          }`}
                        >
                          {item.status || "—"}
                        </span>
                      </td>
                      <td>{item.data || "-"}</td>
                      <td>{item.tipo || "-"}</td>
                      <td className="text-right">
                        {/* Botões de ação */}
                        <button className="btn btn-sm btn-outline-primary me-1">
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mensagem quando não há resultados */}
              {filteredDespesas.length === 0 && (
                <div className="text-center p-3 text-muted">
                  <p>
                    {searchDespesas 
                      ? `Nenhuma despesa encontrada para "${searchDespesas}"`
                      : "Nenhuma despesa cadastrada"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transações;