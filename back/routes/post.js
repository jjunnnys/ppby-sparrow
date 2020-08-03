const { Router } = require('express');

const router = Router();
router.post('/', (req, res) => {
  // POST /post
  res.json({ id: 1, content: 'hell04' });
});

router.delete('/', (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
