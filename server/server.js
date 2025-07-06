const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

/* ───────── MIDDLEWARE ───────── */
app.use(cors());
app.use(express.json());

/* ───────── DB ───────── */
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/factcheck-notepad')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/* ───────── ROUTES ───────── */
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/notes',     require('./routes/notes'));
app.use('/api/factcheck', require('./routes/factcheck'));

/* ───────── START ───────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
