const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------ Middleware ------------------------------------------
app.use(cors());
app.use(express.json());

// ------------------------------------------ Rutas ------------------------------------------
// Página principal
app.get("/", (req, res) => {
  res.send("¡La API está funcionando!");
});

// Importación de ficheros
app.use("/", require("./routes/cuentas"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/movimientos"));
app.use("/", require("./routes/transacciones"));

// ------------------------------------------ Inicialización ------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});