const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./config/database');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use(/(.*)/, (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

db.init().then(() => {
  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app;