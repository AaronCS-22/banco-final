const express = require('express');
const { faker } = require('@faker-js/faker');
const router = express.Router();

// ------------------------------------------ Variables globales ------------------------------------------
const cuentasTotales = 8;

// ------------------------------------------ Generación de cuentas bancarias ------------------------------------------
function generarCuentaBancaria() {
  const numeroDeMovimientos = faker.number.int({ min: 5, max: 10 });

  const movimientos = Array.from({ length: numeroDeMovimientos }, () => {
    const amount = faker.number.int({ min: -500, max: 500 });
    const date = faker.date.past(1);
    return {
      amount,
      date,
    };
  });

  return {
    owner: faker.person.fullName(),
    movements: movimientos,
    interestRate: faker.number.float({ min: 0.5, max: 2.5, precision: 0.1 }),
    pin: faker.number.int({ min: 1000, max: 9999 }),
  };
}

function generarCuentasBancarias(cant) {
  const cuentas = [];

  for (let i = 0; i < cant; i++) {
    cuentas.push(generarCuentaBancaria());
  }

  return cuentas;
}

// Genera las cuentas
const cuentasGeneradas = generarCuentasBancarias(cuentasTotales);

// Función para crear usernames
function createUsernames(accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}
createUsernames(cuentasGeneradas);

// ------------------------------------------ Ruta GET ------------------------------------------
router.get('/cuentas', (req, res) => {
  res.json(cuentasGeneradas);
});

module.exports = router;