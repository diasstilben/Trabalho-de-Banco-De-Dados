const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/pacientes', require('./routes/paciente'));
app.use('/api/medicos', require('./routes/medico'));
app.use('/api/consultas', require('./routes/consulta'));
app.use('/api/planos', require('./routes/planoSaude'));
app.use('/api/especialidades', require('./routes/especialidade'));
app.use('/api/formacoes', require('./routes/formacao'));
app.use('/api/estados', require('./routes/estado'));

app.get('/', (req, res) => {
  res.send('API do Hospital rodando. Veja /api/pacientes, /api/medicos, /api/consultas, etc.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
