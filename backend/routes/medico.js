const express = require('express');
const router = express.Router();
const db = require('../db');

// SELECT - lista médicos com nome da formação e da especialidade (JOIN)
router.get('/', async (req, res) => {
  try {
    const { matr } = req.query;
    let sql = `
      SELECT m.matr, m.nome, m.telefone, m.CPF, m.cod_form, m.cod_esp,
             f.grau_formacao, e.especializacao
      FROM medico m
      LEFT JOIN formacao f ON m.cod_form = f.cod_form
      LEFT JOIN especialidade e ON m.cod_esp = e.cod_esp`;
    const params = [];
    if (matr) {
      sql += ' WHERE m.matr = ?';
      params.push(matr);
    }
    sql += ' ORDER BY m.nome';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// INSERT - cadastra um novo médico
router.post('/', async (req, res) => {
  try {
    const { matr, nome, telefone, CPF, cod_form, cod_esp } = req.body;
    if (!matr || !nome) {
      return res.status(400).json({ erro: 'matr e nome são obrigatórios' });
    }
    const sql = `INSERT INTO medico (matr, nome, telefone, CPF, cod_form, cod_esp)
      VALUES (?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [matr, nome, telefone, CPF, cod_form || null, cod_esp || null]);
    res.status(201).json({ mensagem: 'Médico cadastrado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE - atualiza os dados de um médico existente
router.put('/:matr', async (req, res) => {
  try {
    const { matr } = req.params;
    const { nome, telefone, CPF, cod_form, cod_esp } = req.body;
    const sql = `UPDATE medico SET
      nome = ?, telefone = ?, CPF = ?, cod_form = ?, cod_esp = ?
      WHERE matr = ?`;
    const [result] = await db.query(sql, [nome, telefone, CPF, cod_form || null, cod_esp || null, matr]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Médico não encontrado' });
    }
    res.json({ mensagem: 'Médico atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
