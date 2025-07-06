const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:   { type: String, default: '' },
    content: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);
