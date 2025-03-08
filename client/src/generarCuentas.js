import { faker } from "@faker-js/faker";

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

const cuentasGeneradas = generarCuentasBancarias(4);
console.log(cuentasGeneradas);
export default cuentasGeneradas;
