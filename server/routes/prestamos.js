const express = require("express");
const router = express.Router();
const cuentasModule = require("./cuentas");

// Ruta para realizar transferencias
router.post("/prestamos", (req, res) => {
  try {
    const { username, pin, cantidad } = req.body;

    // Buscar la cuenta
    const account = cuentasModule.findAccountByUsername(username);
    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    // Validar PIN
    if (account.pin !== pin) {
      return res.status(401).json({ error: "PIN incorrecto" });
    }

    // Verificar si tiene suficiente saldo
    const saldo = account.movements.reduce(
        (total, mov) => total + mov.amount,
        0
    );

    if (saldo < 0){
        return res
        .status(400)
        .json({ error: "Su cuenta no tiene fondo" });
    }

    // Verificar que la cantidad sea positiva
    if (cantidad <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad debe ser mayor que cero" });
    }

    //Verificar que la cantidad no sea mayor al 200% del saldo
    if (cantidad > (saldo * 2)){
        return res
        .status(400)
        .json({ error: "El préstamo no puede superar el 200% del saldo de la cuenta" });
    }

    // Fecha actual para el registro de la transacción
    const currentDate = new Date();

    // Registrar movimiento negativo en la cuenta
    account.movements.push({
      amount: cantidad,
      date: currentDate,
    });

    // Devolver respuesta exitosa
    res.json({
      message: "Préstamo realizado exitosamente",
      movements: account.movements, // Devolvemos los movements actualizados del emisor
    });
  } catch (error) {
    console.error("Error al realizar préstamo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
