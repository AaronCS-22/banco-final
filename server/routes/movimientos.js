const express = require("express");
const router = express.Router();
const cuentasModule = require("./cuentas");

// Ruta para obtener movimientos
router.post("/movimientos", (req, res) => {
  try {
    const { username, pin } = req.body;
    
    // Buscar la cuenta por username
    const account = cuentasModule.findAccountByUsername(username);
    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    // Validar PIN
    if (account.pin !== pin) {
      return res.status(401).json({ error: "PIN incorrecto" });
    }

    // Formatear los movimientos con fecha legible
    const formattedMovements = account.movements.map(({amount, date}) => ({
      amount,
      date
    }));

    // Responder con los movimientos formateados
    res.json({ movements: formattedMovements });
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
