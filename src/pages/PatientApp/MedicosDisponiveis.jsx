import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../../utils/auth';
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
  ArrowBack,
  CalendarToday, 
  AccessTime, 
  MedicalServices, 
  Search,
  FilterList 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const AvatarForm = "/img/AvatarForm.jpg";
import { getUserRole } from '../../utils/userInfo';

const MedicosDisponiveis = () => {
  const [medicos, setMedicos] = useState([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [avaliacaoFilter, setAvaliacaoFilter] = useState('');
  const [valorFilter, setValorFilter] = useState('');
  const navigate = useNavigate();
  const role = getUserRole();

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAK = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const tokenUsuario = getAccessToken()
      var myHeaders = new Headers();
  myHeaders.append(
    "apikey",
    supabaseAK
  );
  myHeaders.append("Authorization", `Bearer ${tokenUsuario}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // buscar médicos
  useEffect(() => {
    fetch(`${supabaseUrl}/rest/v1/doctors`, requestOptions)
      .then((response) => response.json())
      .then((result) => setMedicos(Array.isArray(result) ? result : []))
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    carregarMedicos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [medicos, searchTerm, specialtyFilter, avaliacaoFilter, valorFilter]);

  const carregarMedicos = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao carregar médicos:', error);
      // Fallback para dados mock em caso de erro
      setLoading(false);
    }
  };

  const specialty = Array.from(new Set(medicos.map(m => m.specialty).filter(Boolean)));


  const aplicarFiltros = () => {
    let filtrados = [...medicos];

    if (searchTerm) {
      filtrados = filtrados.filter(medico => {
    const nome = medico.full_name ? medico.full_name.toLowerCase() : "";
    const especialidade = medico.specialty ? medico.specialty.toLowerCase() : "";
    return (
      nome.includes(searchTerm.toLowerCase()) ||
      especialidade.includes(searchTerm.toLowerCase())
    );
    });
    }

    if (specialtyFilter) {
      filtrados = filtrados.filter(medico => 
        medico.specialty === specialtyFilter
      );
    }

    setMedicosFiltrados(filtrados);
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setSpecialtyFilter('');
    setAvaliacaoFilter('');
    setValorFilter('');
  };

  const verHorariosDisponiveis = (medicoId) => {
    navigate(`/${role}/agendarconsulta/${medicoId}`);
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
    <div className='page-wrapper'>
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
                value={specialtyFilter}
                label="Especialidade"
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {specialty.map(esp => (
                  <MenuItem key={esp} value={esp}>{esp}</MenuItem>
                ))}
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
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
  {medicosFiltrados.map((medico) => (
    <Grid item key={medico.id}>
      <Card
        sx={{
          width: 250,
          height: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: 2,
          transition: '0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 5,
          },
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Parte superior: avatar + texto */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              <img 
              alt={medico.full_name.split(' ').map((n) => n[0]).join('')}
              src={AvatarForm}
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}>
              </img>
            </Avatar>

            <Typography variant="h6" fontWeight="bold">
              {medico.full_name}
            </Typography>

            <Chip
              icon={<MedicalServices />}
              label={medico.specialty}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Botão na parte inferior */}
          <Button
            variant="contained"
            onClick={() => verHorariosDisponiveis(medico.id)}
            sx={{
              borderRadius: 2,
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <CalendarToday sx={{ fontSize: 22 }}/>
            Marcar Consulta
          </Button>
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
    </div>
  );
};

export default MedicosDisponiveis;