const express = require("express");
const router = express.Router();
const cuentasModule = require("./cuentas");

// Ruta para cerrar/eliminar una cuenta
router.post("/cerrar", (req, res) => {
  try {
    const { username, pin } = req.body;
    
    // Buscar la cuenta por username
    const accountIndex = cuentasModule.cuentasGeneradas.findIndex(
      account => account.username === username
    );
    
    if (accountIndex === -1) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }
    
    const account = cuentasModule.cuentasGeneradas[accountIndex];
    
    // Validar PIN
    if (account.pin !== Number(pin)) {
      return res.status(401).json({ error: "PIN incorrecto" });
    }
    
    // Eliminar la cuenta del array de cuentas
    cuentasModule.cuentasGeneradas.splice(accountIndex, 1);
    
    res.json({ message: "Cuenta cerrada con éxito" });
  } catch (error) {
    console.error("Error al cerrar la cuenta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;