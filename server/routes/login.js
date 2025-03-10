const express = require("express");
const router = express.Router();
const cuentasModule = require("./cuentas");

// Ruta para el login
router.post("/login", (req, res) => {
  const { username, pin } = req.body;

  // Buscar la cuenta por el nombre de usuario
  const account = cuentasModule.findAccountByUsername(username);

  if (!account) {
    return res.status(404).json({ message: "Cuenta no encontrada" });
  }

  // Verificar el PIN
  if (account.pin !== Number(pin)) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  // Devolvemos el resultado
  res.json({
    account: {
      ...account
    }
  });
});

module.exports = router;
