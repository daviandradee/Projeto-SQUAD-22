import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip,
  Avatar,
  Box,
  Rating,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Divider,
  Alert
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  MedicalServices, 
  Search,
  FilterList 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MedicosDisponiveis = () => {
  const [medicos, setMedicos] = useState([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [especialidadeFilter, setEspecialidadeFilter] = useState('');
  const [avaliacaoFilter, setAvaliacaoFilter] = useState('');
  const [valorFilter, setValorFilter] = useState('');
  const navigate = useNavigate();

  const especialidades = [
    'Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 
    'Ginecologia', 'Neurologia', 'Oftalmologia', 'Psiquiatria'
  ];

  // DADOS MOCK PARA TESTE - REMOVA QUANDO CONECTAR COM API REAL
  const medicosMock = [
    {
      id: 1,
      nome: 'Dr. João Silva',
      especialidade: 'Cardiologia',
      avaliacao: 4.8,
      totalAvaliacoes: 127,
      valorConsulta: 250,
      biografia: 'Especialista em cardiologia com 10 anos de experiência, mestre pela USP.',
      foto: ''
    },
    {
      id: 2,
      nome: 'Dra. Maria Santos',
      especialidade: 'Dermatologia',
      avaliacao: 4.9,
      totalAvaliacoes: 89,
      valorConsulta: 200,
      biografia: 'Dermatologista renomada com foco em tratamentos estéticos e dermatologia clínica.',
      foto: ''
    },
    {
      id: 3,
      nome: 'Dr. Pedro Oliveira',
      especialidade: 'Pediatria',
      avaliacao: 4.7,
      totalAvaliacoes: 156,
      valorConsulta: 150,
      biografia: 'Pediatra dedicado ao cuidado infantil há 15 anos, especialista em alergias.',
      foto: ''
    },
    {
      id: 4,
      nome: 'Dra. Ana Costa',
      especialidade: 'Ginecologia',
      avaliacao: 4.6,
      totalAvaliacoes: 94,
      valorConsulta: 180,
      biografia: 'Ginecologista e obstetra, atendimento humanizado e acolhedor.',
      foto: ''
    },
    {
      id: 5,
      nome: 'Dr. Carlos Lima',
      especialidade: 'Ortopedia',
      avaliacao: 4.5,
      totalAvaliacoes: 112,
      valorConsulta: 300,
      biografia: 'Ortopedista especializado em cirurgia do joelho e traumatologia esportiva.',
      foto: ''
    },
    {
      id: 6,
      nome: 'Dra. Fernanda Rocha',
      especialidade: 'Neurologia',
      avaliacao: 4.9,
      totalAvaliacoes: 67,
      valorConsulta: 350,
      biografia: 'Neurologista com doutorado em doenças cerebrovasculares.',
      foto: ''
    }
  ];

  useEffect(() => {
    carregarMedicos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [medicos, searchTerm, especialidadeFilter, avaliacaoFilter, valorFilter]);

  const carregarMedicos = async () => {
    setLoading(true);
    try {
      // TODO: Substituir pela API real quando estiver disponível
      // const response = await fetch('/api/medicos/disponiveis');
      // const data = await response.json();
      
      // Simulando delay de API
      setTimeout(() => {
        setMedicos(medicosMock);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao carregar médicos:', error);
      // Fallback para dados mock em caso de erro
      setMedicos(medicosMock);
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...medicos];

    if (searchTerm) {
      filtrados = filtrados.filter(medico =>
        medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medico.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (especialidadeFilter) {
      filtrados = filtrados.filter(medico => 
        medico.especialidade === especialidadeFilter
      );
    }

    if (avaliacaoFilter) {
      filtrados = filtrados.filter(medico => 
        medico.avaliacao >= parseFloat(avaliacaoFilter)
      );
    }

    if (valorFilter) {
      filtrados = filtrados.filter(medico => {
        const valor = parseFloat(medico.valorConsulta);
        switch (valorFilter) {
          case 'ate100': return valor <= 100;
          case '100a200': return valor > 100 && valor <= 200;
          case '200a300': return valor > 200 && valor <= 300;
          case 'acima300': return valor > 300;
          default: return true;
        }
      });
    }

    setMedicosFiltrados(filtrados);
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setEspecialidadeFilter('');
    setAvaliacaoFilter('');
    setValorFilter('');
  };

  const verHorariosDisponiveis = (medicoId) => {
    navigate(`/patientapp/agendarconsulta/${medicoId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando médicos...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Médicos Disponíveis
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Encontre o médico perfeito para sua necessidade - {medicosFiltrados.length} médico(s) encontrado(s)
      </Typography>

      {/* Filtros e Busca */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Filtros e Busca</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar médico ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Especialidade</InputLabel>
              <Select
                value={especialidadeFilter}
                label="Especialidade"
                onChange={(e) => setEspecialidadeFilter(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {especialidades.map(esp => (
                  <MenuItem key={esp} value={esp}>{esp}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Avaliação</InputLabel>
              <Select
                value={avaliacaoFilter}
                label="Avaliação"
                onChange={(e) => setAvaliacaoFilter(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="4.5">4.5+ estrelas</MenuItem>
                <MenuItem value="4.0">4.0+ estrelas</MenuItem>
                <MenuItem value="3.5">3.5+ estrelas</MenuItem>
                <MenuItem value="3.0">3.0+ estrelas</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Valor Consulta</InputLabel>
              <Select
                value={valorFilter}
                label="Valor Consulta"
                onChange={(e) => setValorFilter(e.target.value)}
              >
                <MenuItem value="">Qualquer valor</MenuItem>
                <MenuItem value="ate100">Até R$ 100</MenuItem>
                <MenuItem value="100a200">R$ 100 - R$ 200</MenuItem>
                <MenuItem value="200a300">R$ 200 - R$ 300</MenuItem>
                <MenuItem value="acima300">Acima de R$ 300</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={limparFiltros}
              sx={{ height: '56px' }}
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Médicos */}
      <Grid container spacing={3}>
        {medicosFiltrados.map((medico) => (
          <Grid item xs={12} md={6} key={medico.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 3,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {medico.nome.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {medico.nome}
                    </Typography>
                    <Chip 
                      icon={<MedicalServices />} 
                      label={medico.especialidade} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Rating value={medico.avaliacao} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary">
                    ({medico.totalAvaliacoes} avaliações)
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {medico.biografia}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                      Consulta: <strong>R$ {medico.valorConsulta}</strong>
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    startIcon={<CalendarToday />}
                    onClick={() => verHorariosDisponiveis(medico.id)}
                  >
                    Ver Horários
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {medicosFiltrados.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum médico encontrado com os filtros selecionados
          </Typography>
          <Button onClick={limparFiltros} sx={{ mt: 2 }}>
            Limpar filtros
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default MedicosDisponiveis;