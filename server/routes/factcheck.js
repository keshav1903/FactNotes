// server/routes/factcheck.js
const express = require('express');
const { factCheck } = require('../services/gemini');

const router = express.Router();

router.post('/', async (req, res) => {
  const { sentence } = req.body;
  if (!sentence) return res.json({ corrections: [] });

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  );

  try {
    const result = await Promise.race([timeout, factCheck(sentence)]);
    if (result.status === 'ok') {
      return res.json({ corrections: [] });
    }
    return res.json({
      corrections: [{
        suggestion: result.suggestion,
        explanation: result.explanation
      }]
    });
  } catch {
    return res.json({ corrections: [] });  // Graceful fallback
  }
});

module.exports = router;
