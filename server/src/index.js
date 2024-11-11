const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://api-recruitment.sparti.dev/');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: '⛔ Error getting products from external API' });
  }
});

app.post('/', async (req, res) => {
  try {
    const response = await axios.post('http://api-recruitment.sparti.dev/', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: '⛔ Error getting products from external API' });
  }
});

app.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`http://api-recruitment.sparti.dev/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: '⛔ Error getting products from external API' });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🔥Server started on port http://localhost:${PORT}`);
});
