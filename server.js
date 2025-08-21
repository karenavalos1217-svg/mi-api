const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let registros = [];

app.get("/", (req, res) => {
  res.send(`
    <h2>Registro de usuarios</h2>
    <form action="/registrar" method="POST">
      <label>Nombre:</label><br>
      <input type="text" name="nombre" required /><br><br>

      <label>Edad:</label><br>
      <input type="number" name="edad" required /><br><br>

      <button type="submit">Enviar</button>
    </form>

    <h3>Registros guardados:</h3>
    <ul>
      ${registros.map(r => `<li>${r.nombre} - ${r.edad} años</li>`).join("")}
    </ul>
  `);
});

app.post("/registrar", (req, res) => {
  const { nombre, edad } = req.body;
  
  if (!nombre || !edad) {
    return res.status(400).send("Nombre y edad son requeridos");
  }

  registros.push({ nombre, edad: parseInt(edad) });
  res.redirect("/");
});

app.get("/usuarios", (req, res) => {
  res.json(registros);
});

app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  if (id >= 0 && id < registros.length) {
    const { nombre, edad } = req.body;
    
    if (nombre) registros[id].nombre = nombre;
    if (edad) registros[id].edad = parseInt(edad);
    
    res.json({ mensaje: "Usuario actualizado", usuario: registros[id] });
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  if (id >= 0 && id < registros.length) {
    const eliminado = registros.splice(id, 1);
    res.json({ mensaje: "Usuario eliminado", eliminado });
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

app.get("/status", (req, res) => {
  res.json({ 
    mensaje: "Servidor funcionando",
    totalRegistros: registros.length,
    fecha: new Date().toISOString()
  });
});

app.get("/error", (req, res) => {
  res.status(500).send("Error interno del servidor (500)");
});

app.use((req, res) => {
  res.status(404).send("Error 404: Página no encontrada");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error 500: Algo salió mal en el servidor");
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});