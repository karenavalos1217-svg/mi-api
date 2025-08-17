const express = require('express');
const app = express();
const PORT = 3000;

// Para aceptar JSON en POST
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('mi rpimer servidor:)');
});

// Ruta /status
app.get('/status', (req, res) => {
  res.json({ mensaje: "Servidor funcionando:)" });
});

// Encender servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
