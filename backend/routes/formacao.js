const express = require('express');
const router = express.Router();
const db = require('../db');

// SELECT
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM formacao ORDER BY grau_formacao');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// INSERT
router.post('/', async (req, res) => {
  try {
    const { cod_form, grau_formacao } = req.body;
    if (!cod_form || !grau_formacao) {
      return res.status(400).json({ erro: 'cod_form e grau_formacao são obrigatórios' });
    }
    await db.query('INSERT INTO formacao (cod_form, grau_formacao) VALUES (?, ?)', [cod_form, grau_formacao]);
    res.status(201).json({ mensagem: 'Formação cadastrada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE
router.put('/:cod_form', async (req, res) => {
  try {
    const { cod_form } = req.params;
    const { grau_formacao } = req.body;
    const [result] = await db.query(
      'UPDATE formacao SET grau_formacao = ? WHERE cod_form = ?',
      [grau_formacao, cod_form]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Formação não encontrada' });
    }
    res.json({ mensagem: 'Formação atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
