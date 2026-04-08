# MediConnect

Sistema de gestão clínica desenvolvido durante a **Residência de Software** em parceria com a **Popcode**, com foco na redução do absenteísmo em clínicas médicas através de automação, comunicação inteligente e experiência digital unificada para todos os atores do ecossistema de saúde.

> Projeto desenvolvido em squad com  minha liderança técnica
> 
> Fizemos o frontend

---

## Contexto

O absenteísmo (pacientes que faltam a consultas sem aviso) é um problema crítico na saúde brasileira — o SUS registra taxas próximas a 25%, com estudos regionais apontando até 38,6% em consultas especializadas. O MediConnect foi concebido para atacar esse problema de forma sistêmica, integrando gestão clínica completa com um sistema anti-absenteísmo avançado.

---

## Funcionalidades

### Por perfil de usuario

| Perfil | Acesso |
|---|---|
| **Paciente** | Consultas, prontuário, resultados de exames, laudos, chat com médico |
| **Médico** | Agenda, prontuário completo, emissão de laudos, videoconsulta, chat |
| **Secretaria** | Cadastro de pacientes, agendamentos, gestão de agenda dos médicos |
| **Administrador** | Todos os módulos, analytics, relatórios, gestão de usuários |

### Modulos principais

- **Agendamentos** — Calendário visual com slots, confirmação automática por e-mail, lembretes 48h e 4h antes da consulta, fila de espera e estatísticas de absenteísmo
- **Prontuário** — Histórico médico completo, anamnese, diagnósticos CID-10, prescrições e evolução do quadro
- **Laudos** — Editor de texto rico, biblioteca de modelos, upload de imagens/exames, exportação em PDF com branding
- **Videoconsulta** — Chamadas de vídeo/áudio integradas com transcrição automática disponível para o médico
- **Chat** — Mensagens em tempo real entre médico e paciente
- **Chatbot** — Assistente virtual com informações da clínica
- **Analytics** — Dashboards por perfil com métricas de atendimento, taxa de no-show e performance

---

## Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Material UI + Bootstrap + Tailwind CSS
- FullCalendar — visualização de agendas
- Tiptap — editor de laudos
- Recharts + Chart.js — dashboards e analytics
- ZegoCloud UIKit — videoconsulta
- EmailJS — notificações por e-mail

**Deploy**
- Vercel — [mediconnect-neon.vercel.app](https://mediconnect-neon.vercel.app)

---



## Estrutura do projeto

```
src/
├── pages/
│   ├── AdminApp/         # Dashboard e gestao administrativa
│   ├── DoctorApp/        # Portal do medico (agenda, prontuario, laudos)
│   ├── PatientApp/       # Portal do paciente (consultas, exames)
│   ├── SecretariaApp/    # Interface da secretaria
│   ├── Login/            # Autenticacao
│   └── LandingPage/      # Pagina publica
├── components/
│   ├── forms/            # Formularios de cadastro e edicao
│   ├── lists/            # Listagens e tabelas
│   ├── call/             # Videoconsulta e transcript
│   ├── chat/             # Chat em tempo real e chatbot
│   └── layouts/          # Navbar e sidebar
├── routes/               # Configuracao de rotas por perfil
├── utils/                # Auth, permissoes, PDF, SMS, helpers
└── Supabase.js           # Cliente Supabase
```

---



