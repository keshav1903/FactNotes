const express = require('express');
const Note    = require('../models/Note');
const auth    = require('../middleware/auth');

const router = express.Router();
router.use(auth);

/* list (search / sort / pagination) */
router.get('/', async (req, res) => {
  const search   = req.query.search || '';
  const sortBy   = req.query.sortBy || 'updatedAt';
  const sortDir  = req.query.sortOrder === 'asc' ? 1 : -1;
  const page     = +req.query.page  || 1;
  const limit    = +req.query.limit || 12;

  const query = {
    user: req.user.id,
    ...(search && {
      $or: [
        { title  : { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    })
  };

  const [total, notes] = await Promise.all([
    Note.countDocuments(query),
    Note.find(query)
        .sort({ [sortBy]: sortDir })
        .skip((page - 1) * limit)
        .limit(limit)
  ]);

  res.json({ data: notes, total, page, pages: Math.ceil(total / limit) });
});

/* create */
router.post('/', async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user.id });
  res.status(201).json(note);
});

/* read */
router.get('/:id', async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json(note);
});

/* update */
router.put('/:id', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json(note);
});

/* delete */
router.delete('/:id', async (req, res) => {
  const deleted = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
