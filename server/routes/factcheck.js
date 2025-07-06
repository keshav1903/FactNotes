const express = require('express');
const router  = express.Router();

router.post('/', (req, res) => {
  const { sentence } = req.body;

  if (/earth\s+is\s+flat/i.test(sentence)) {
    return res.json({
      corrections: [{
        suggestion:  'The Earth is an oblate spheroid.',
        explanation: 'Satellite imagery and gravity measurements confirm it.'
      }]
    });
  }
  return res.json({ corrections: [] });
});

module.exports = router;
