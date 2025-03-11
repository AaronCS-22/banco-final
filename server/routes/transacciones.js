const express = require("express");
const router = express.Router();
const cuentasModule = require("./cuentas");

// Ruta para realizar transferencias
router.post("/transacciones", (req, res) => {
  try {
    const { usernameEmisor, usernameReceptor, pin, cantidad } = req.body;

    // Comprobar si usernameEmisor y usernameReceptor es el mismo
    if (usernameEmisor === usernameReceptor) {
      return res
        .status(400)
        .json({ error: "No puedes enviarte dinero a ti mismo" });
    }

    // Buscar la cuenta del emisor
    const accountEmisor = cuentasModule.findAccountByUsername(usernameEmisor);
    if (!accountEmisor) {
      return res.status(404).json({ error: "Cuenta del emisor no encontrada" });
    }

    // Validar PIN
    if (accountEmisor.pin !== pin) {
      return res.status(401).json({ error: "PIN incorrecto" });
    }

    // Buscar la cuenta del receptor
    const accountReceptor =
      cuentasModule.findAccountByUsername(usernameReceptor);
    if (!accountReceptor) {
      return res
        .status(404)
        .json({ error: "Cuenta del receptor no encontrada" });
    }

    // Verificar que la cantidad sea positiva
    if (cantidad <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad debe ser mayor que cero" });
    }

    // Verificar si el emisor tiene suficiente saldo
    const saldoEmisor = accountEmisor.movements.reduce(
      (total, mov) => total + mov.amount,
      0
    );
    if (saldoEmisor < cantidad) {
      return res
        .status(400)
        .json({ error: "Saldo insuficiente para realizar la transferencia" });
    }

    // Fecha actual para el registro de la transacción
    const currentDate = new Date();

    // Registrar movimiento negativo en la cuenta del emisor
    accountEmisor.movements.push({
      amount: -cantidad,
      date: currentDate,
    });

    // Registrar movimiento positivo en la cuenta del receptor
    accountReceptor.movements.push({
      amount: cantidad,
      date: currentDate,
    });

    // Devolver respuesta exitosa
    res.json({
      message: "Transferencia realizada exitosamente",
      movements: accountEmisor.movements, // Devolvemos los movements actualizados del emisor
    });
  } catch (error) {
    console.error("Error al realizar transferencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
