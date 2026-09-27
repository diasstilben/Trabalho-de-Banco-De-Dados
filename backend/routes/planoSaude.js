const express = require('express');
const router = express.Router();
const db = require('../db');

// SELECT
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM plano_saude ORDER BY nome_plano');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// INSERT
router.post('/', async (req, res) => {
  try {
    const { cod_plano, nome_plano, abrangencia } = req.body;
    if (!cod_plano || !nome_plano) {
      return res.status(400).json({ erro: 'cod_plano e nome_plano são obrigatórios' });
    }
    await db.query(
      'INSERT INTO plano_saude (cod_plano, nome_plano, abrangencia) VALUES (?, ?, ?)',
      [cod_plano, nome_plano, abrangencia]
    );
    res.status(201).json({ mensagem: 'Plano de saúde cadastrado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE
router.put('/:cod_plano', async (req, res) => {
  try {
    const { cod_plano } = req.params;
    const { nome_plano, abrangencia } = req.body;
    const [result] = await db.query(
      'UPDATE plano_saude SET nome_plano = ?, abrangencia = ? WHERE cod_plano = ?',
      [nome_plano, abrangencia, cod_plano]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Plano de saúde não encontrado' });
    }
    res.json({ mensagem: 'Plano de saúde atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
