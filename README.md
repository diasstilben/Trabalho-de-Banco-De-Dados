# Sistema Hospital — Frontend + Backend

Aplicação simples para o banco `HOSPITAL` (Hospital.sql), com CRUD (SELECT, INSERT, UPDATE) para:
paciente, médico, consulta, plano_saude, especialidade e formação.

## Estrutura
```
hospital-app/
├── backend/          # API em Node.js + Express + MySQL
│   ├── server.js
│   ├── db.js
│   └── routes/
└── frontend/         # HTML + CSS + JS puro (SPA simples)
    ├── index.html
    ├── style.css
    └── script.js
```

## 1. Banco de dados
Crie o banco executando o script `Hospital.sql` no MySQL:
```
mysql -u root -p < Hospital.sql
```

## 2. Backend
```
cd backend
npm install
```
Ajuste as credenciais do banco em `db.js` (ou defina as variáveis de ambiente
`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`).

Inicie o servidor:
```
npm start
```
A API sobe em `http://localhost:3000`. Endpoints disponíveis:

| Método | Rota                        | Ação   |
|--------|------------------------------|--------|
| GET    | /api/pacientes               | SELECT |
| POST   | /api/pacientes                | INSERT |
| PUT    | /api/pacientes/:cod_pac       | UPDATE |
| GET    | /api/medicos                  | SELECT |
| POST   | /api/medicos                  | INSERT |
| PUT    | /api/medicos/:matr             | UPDATE |
| GET    | /api/consultas                | SELECT |
| POST   | /api/consultas                | INSERT |
| PUT    | /api/consultas/:cod_consulta   | UPDATE |
| GET/POST/PUT | /api/planos, /api/especialidades, /api/formacoes | idem |
| GET    | /api/estados                  | SELECT (tabela fixa) |

## 3. Frontend
Basta abrir `frontend/index.html` no navegador (ou servir a pasta com
`npx serve frontend`, por exemplo). Ele já aponta para `http://localhost:3000/api`
(constante `API` no topo de `script.js` — ajuste se o backend rodar em outra porta/host).

## Observações
- Os formulários fazem **INSERT** por padrão; clicar em "Editar" numa linha da
  tabela troca o formulário para modo **UPDATE** (a chave primária fica travada).
- As buscas listadas usam **SELECT** com `JOIN` em médicos e consultas, trazendo
  nome do paciente, nome do médico, formação, especialidade e descrição do estado
  em vez de apenas os códigos.
- CORS está liberado no backend (`cors()`) para simplificar o teste local.
