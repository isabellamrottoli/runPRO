# Runpro

Aplicativo mobile B2B para assessorias e consultorias de corrida. A plataforma conecta **coaches** (professores) e **atletas** (corredores), centralizando planilhas de treino, metas com progresso visual e gerenciamento de alunos.

> Projeto da disciplina de Laboratório de Engenharia de Software.

---

## Visão geral

- **Coach** cadastra a assessoria, aprova/rejeita solicitações de entrada, gerencia atletas, cria planilhas e metas.
- **Atleta** entra na assessoria via código, visualiza a semana de treinos, acompanha metas e marca treinos como feitos ou perdidos.
- Multi-tenant: cada assessoria é isolada — dados de uma nunca vazam para outra.

---

## Stack

| Camada | Tecnologias |
|---|---|
| **Mobile** | React Native · Expo (SDK 54) · TypeScript · React Navigation · Zustand · Axios · Phosphor Icons |
| **Backend** | Java 21 · Spring Boot 4 · Spring Data JPA · Spring Security · Bean Validation · Maven |
| **Autenticação** | JWT (HS256 via JDK) · BCrypt |
| **Banco** | H2 (dev, em memória) · PostgreSQL (produção) · Flyway (migrations em produção) |

---

## Estrutura do projeto

```
app/
├── backend/runpro/           Spring Boot
│   └── src/main/java/com/runpro/runpro/
│       ├── auth/             JWT, SecurityConfig, AuthService
│       ├── coach/            Endpoints do coach
│       ├── runner/           Endpoints do atleta
│       ├── domain/           Entidades JPA + repositórios
│       └── seed/             Dados de demonstração
│
└── mobile/                   Expo / React Native
    └── src/
        ├── api/              Axios client + interceptor JWT
        ├── store/            Zustand (auth)
        ├── navigation/       React Navigation
        ├── screens/          Splash, Login, Signup, Coach/Runner Home
        ├── components/       Componentes reutilizáveis
        └── theme/            Design tokens
```

---

## Pré-requisitos

- **Java 21** (recomendado: [Microsoft OpenJDK 21](https://learn.microsoft.com/java/openjdk/download))
- **Node.js 20+** e npm
- **Expo Go** no celular (iOS ou Android) ou emulador
- PC e celular na **mesma rede WiFi**
- Porta **8080** liberada no firewall do Windows

---

## Como rodar

### Backend

```bash
cd backend/runpro
./mvnw spring-boot:run
```

A API sobe em `http://<seu-ip>:8080`. Valida com:

```bash
curl http://localhost:8080/actuator/health
```

> O banco H2 é recriado a cada reinício. O `DevDataSeeder` popula uma assessoria demo, 1 coach, 3 atletas, planilhas da semana, metas e uma solicitação pendente.

### Mobile

```bash
cd mobile
npm install
npm start
```

Abra o QR code no Expo Go. O app detecta o IP do PC automaticamente (via Metro) — não precisa configurar endereço manualmente.

---

## Contas de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Coach | `isa@runpro.dev` | `s3nha123` |
| Atleta | `ana@runpro.dev` | `s3nha123` |
| Atleta | `bruno@runpro.dev` | `s3nha123` |
| Atleta (solicitação pendente) | `carla@runpro.dev` | `s3nha123` |

**Código da assessoria** (para cadastrar um novo atleta): `DEMO01`

---

## Endpoints principais

### Auth (públicos)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login — retorna JWT |
| POST | `/api/auth/signup/coach` | Cria assessoria + coach |
| POST | `/api/auth/signup/athlete` | Atleta entra via código da assessoria |

### Coach
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/coach/advisory` | Dados da assessoria + código |
| GET | `/api/coach/join-requests` | Solicitações pendentes |
| POST | `/api/coach/join-requests/{id}/approve` | Aprova |
| POST | `/api/coach/join-requests/{id}/reject` | Rejeita |
| GET | `/api/coach/athletes` | Lista com próxima corrida e último treino |

### Atleta
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/runner/week?date=YYYY-MM-DD` | Semana de treinos (dom–sáb) |
| GET | `/api/runner/workouts/{id}` | Detalhe do treino |
| GET | `/api/runner/weekly-goal` | Meta da semana (progresso) |
| POST | `/api/workouts/{id}/complete` | Marca como feito |
| POST | `/api/workouts/{id}/miss` | Marca como perdido |

Todas as rotas exceto `/api/auth/**` exigem header `Authorization: Bearer <token>`.

---

## Arquitetura

### Fluxo de autenticação

1. Mobile faz `POST /api/auth/login` com e-mail e senha.
2. Backend valida senha (BCrypt), gera JWT com `{ sub, role, adv, exp }`.
3. Mobile guarda o token no Zustand.
4. Axios injeta o token em toda requisição subsequente via interceptor.
5. `JwtAuthFilter` valida o token e popula o `SecurityContext` em cada request.

### Modelo de domínio

```
Advisory (1) ──── (N) User
                   │
                   ├── Spreadsheet (1) ── (N) Workout
                   ├── Goal
                   └── JoinRequest
```

Enums: `UserRole`, `SpreadsheetType`, `WorkoutStatus`, `GoalStatus`, `GoalType`, `GoalOrigin`, `JoinRequestStatus`.

---

## Roadmap (fora do MVP)

- [ ] Feedback de treino por parte do coach
- [ ] Criação de planilhas e metas pelo coach no app
- [ ] Notificações push
- [ ] Gamificação: streak e conquistas
- [ ] Integração com wearables

---

## Documentação adicional

Na raiz do projeto acadêmico (fora deste repositório):

- `projeto.md` — visão geral e modelagem
- `diagrama_classes.md` / `diagrama_classes.puml` — diagrama de classes
- `der.puml` / `schema.sql` — modelo relacional
- `arquitetura.md` — decisões arquiteturais
- `plano_de_implementacao.md` — plano de implementação

---

## Licença

Projeto acadêmico. Todos os direitos reservados à autora.
