const express = require('express');
const router = express.Router();
const db = require('../db');

// SELECT - lista todos os pacientes (ou busca por cod_pac com ?cod_pac=)
router.get('/', async (req, res) => {
  try {
    const { cod_pac } = req.query;
    let sql = 'SELECT * FROM paciente';
    const params = [];
    if (cod_pac) {
      sql += ' WHERE cod_pac = ?';
      params.push(cod_pac);
    }
    sql += ' ORDER BY nome';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// INSERT - cadastra um novo paciente
router.post('/', async (req, res) => {
  try {
    const { cod_pac, nome, telefone, CPF, data_nascimento, sexo, endereco, email } = req.body;
    if (!cod_pac || !nome) {
      return res.status(400).json({ erro: 'cod_pac e nome são obrigatórios' });
    }
    const sql = `INSERT INTO paciente
      (cod_pac, nome, telefone, CPF, data_nascimento, sexo, endereco, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [cod_pac, nome, telefone, CPF, data_nascimento, sexo, endereco, email]);
    res.status(201).json({ mensagem: 'Paciente cadastrado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE - atualiza os dados de um paciente existente
router.put('/:cod_pac', async (req, res) => {
  try {
    const { cod_pac } = req.params;
    const { nome, telefone, CPF, data_nascimento, sexo, endereco, email } = req.body;
    const sql = `UPDATE paciente SET
      nome = ?, telefone = ?, CPF = ?, data_nascimento = ?, sexo = ?, endereco = ?, email = ?
      WHERE cod_pac = ?`;
    const [result] = await db.query(sql, [nome, telefone, CPF, data_nascimento, sexo, endereco, email, cod_pac]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }
    res.json({ mensagem: 'Paciente atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
