const express = require('express');
const router = express.Router();
const db = require('../db');

// SELECT
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM especialidade ORDER BY especializacao');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// INSERT
router.post('/', async (req, res) => {
  try {
    const { cod_esp, especializacao } = req.body;
    if (!cod_esp || !especializacao) {
      return res.status(400).json({ erro: 'cod_esp e especializacao são obrigatórios' });
    }
    await db.query('INSERT INTO especialidade (cod_esp, especializacao) VALUES (?, ?)', [cod_esp, especializacao]);
    res.status(201).json({ mensagem: 'Especialidade cadastrada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE
router.put('/:cod_esp', async (req, res) => {
  try {
    const { cod_esp } = req.params;
    const { especializacao } = req.body;
    const [result] = await db.query(
      'UPDATE especialidade SET especializacao = ? WHERE cod_esp = ?',
      [especializacao, cod_esp]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Especialidade não encontrada' });
    }
    res.json({ mensagem: 'Especialidade atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
