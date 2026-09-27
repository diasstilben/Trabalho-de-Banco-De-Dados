const express = require('express');
const router = express.Router();
const db = require('../db');

// SELECT - lista consultas com nome do paciente, nome do médico e descrição do estado (JOIN)
router.get('/', async (req, res) => {
  try {
    const { cod_consulta } = req.query;
    let sql = `
      SELECT c.cod_consulta, c.cod_pac, p.nome AS nome_paciente,
             c.cod_med, m.nome AS nome_medico,
             c.data_consulta, c.cod_es, es.descr AS estado
      FROM consulta c
      LEFT JOIN paciente p ON c.cod_pac = p.cod_pac
      LEFT JOIN medico m ON c.cod_med = m.matr
      LEFT JOIN estado es ON c.cod_es = es.cod_es`;
    const params = [];
    if (cod_consulta) {
      sql += ' WHERE c.cod_consulta = ?';
      params.push(cod_consulta);
    }
    sql += ' ORDER BY c.data_consulta DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// INSERT - agenda uma nova consulta
router.post('/', async (req, res) => {
  try {
    const { cod_consulta, cod_pac, cod_med, data_consulta, cod_es } = req.body;
    if (!cod_consulta || !cod_pac || !cod_med || !data_consulta) {
      return res.status(400).json({ erro: 'cod_consulta, cod_pac, cod_med e data_consulta são obrigatórios' });
    }
    const sql = `INSERT INTO consulta (cod_consulta, cod_pac, cod_med, data_consulta, cod_es)
      VALUES (?, ?, ?, ?, ?)`;
    await db.query(sql, [cod_consulta, cod_pac, cod_med, data_consulta, cod_es || 1]);
    res.status(201).json({ mensagem: 'Consulta agendada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE - atualiza uma consulta existente (ex.: mudar data, médico ou estado)
router.put('/:cod_consulta', async (req, res) => {
  try {
    const { cod_consulta } = req.params;
    const { cod_pac, cod_med, data_consulta, cod_es } = req.body;
    const sql = `UPDATE consulta SET
      cod_pac = ?, cod_med = ?, data_consulta = ?, cod_es = ?
      WHERE cod_consulta = ?`;
    const [result] = await db.query(sql, [cod_pac, cod_med, data_consulta, cod_es, cod_consulta]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Consulta não encontrada' });
    }
    res.json({ mensagem: 'Consulta atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
