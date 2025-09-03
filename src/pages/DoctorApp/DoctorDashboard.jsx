import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const consultsData = [
  { name: "Consultas", value: 45 },
  { name: "Exames", value: 20 },
  { name: "Laudos", value: 15 },
  { name: "Receitas", value: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function DoctorDashboard() {
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <h2 className="mb-4">📊 Dashboard do Médico</h2>

          <div className="row">
            {/* Gráfico de Pizza */}
            <div className="col-md-6">
              <h5>Distribuição de Atividades</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={consultsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {consultsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Barras */}
            <div className="col-md-6">
              <h5>Consultas por Semana</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { semana: "Semana 1", consultas: 12 },
                  { semana: "Semana 2", consultas: 18 },
                  { semana: "Semana 3", consultas: 9 },
                  { semana: "Semana 4", consultas: 15 },
                ]}>
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consultas" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
