const express = require('express');
const router = express.Router();
const db = require('../db');

// SELECT - a tabela estado já vem populada (agendada / realizada / nao realizada)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estado ORDER BY cod_es');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
