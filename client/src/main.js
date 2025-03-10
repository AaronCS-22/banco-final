import "./style.css";

document.querySelector("#app").innerHTML = `
    <nav>
      <p class="welcome">Log in to get started</p>
      <img src="logo.png" alt="Logo" class="logo" />
      <form class="login" >
        <input
          type="text"
          placeholder="user"
          class="login__input login__input--user"
        />
        <!-- In practice, use type="password" -->
        <input
          type="text"
          placeholder="PIN"
          maxlength="4"
          class="login__input login__input--pin"
        />
        <button class="login__btn">&rarr;</button>
      </form>
    </nav>
    <main class="app">
      <!-- BALANCE -->
      <div class="balance">
        <div>
          <p class="balance__label">Current balance</p>
          <p class="balance__date">
            As of <span class="date">05/03/2037</span>
          </p>
        </div>
        <p class="balance__value">0000€</p>
      </div>
      <!-- MOVEMENTS -->
      <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--deposit">2 deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">4 000€</div>
        </div>
        <div class="movements__row">
          <div class="movements__type movements__type--withdrawal">
            1 withdrawal
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">-378€</div>
        </div>
      </div>
      <!-- SUMMARY -->
      <div class="summary">
        <p class="summary__label">In</p>
        <p class="summary__value summary__value--in">0000€</p>
        <p class="summary__label">Out</p>
        <p class="summary__value summary__value--out">0000€</p>
        <p class="summary__label">Interest</p>
        <p class="summary__value summary__value--interest">0000€</p>
        <button class="btn--sort">&downarrow; SORT</button>
      </div>
      <!-- OPERATION: TRANSFERS -->
      <div class="operation operation--transfer">
        <h2>Transfer money</h2>
        <form class="form form--transfer">
          <input type="text" class="form__input form__input--to" />
          <input type="number" class="form__input form__input--amount" />
          <button class="form__btn form__btn--transfer">&rarr;</button>
          <label class="form__label">Transfer to</label>
          <label class="form__label">Amount</label>
        </form>
      </div>
      <!-- OPERATION: LOAN -->
      <div class="operation operation--loan">
        <h2>Request loan</h2>
        <form class="form form--loan">
          <input type="number" class="form__input form__input--loan-amount" />
          <button class="form__btn form__btn--loan">&rarr;</button>
          <label class="form__label form__label--loan">Amount</label>
        </form>
      </div>
      <!-- OPERATION: CLOSE -->
      <div class="operation operation--close">
        <h2>Close account</h2>
        <form class="form form--close">
          <input type="text" class="form__input form__input--user" />
          <input
            type="password"
            maxlength="6"
            class="form__input form__input--pin"
          />
          <button class="form__btn form__btn--close">&rarr;</button>
          <label class="form__label">Confirm user</label>
          <label class="form__label">Confirm PIN</label>
        </form>
      </div>
      <!-- LOGOUT TIMER -->
      <p class="logout-timer">
        You will be logged out in <span class="timer">05:00</span>
      </p>
    </main>
`;
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Variables
let currentAccount;
let isSortedAsc = true;
let movements;

// ----------------------------------------------- createUsernames -----------------------------------------------
// Creamos el campo username para todas las cuentas de usuarios
// Usamos forEach para modificar el array original, en otro caso map
const cargarCuentas = async () => {
  try {
    const response = await fetch("http://localhost:5000/cuentas"); // Petición al backend
    if (!response.ok) throw new Error("Error al cargar las cuentas");
    const cuentas = await response.json(); // Convertimos la respuesta a JSON
    console.log(cuentas); // Mostramos las cuentas en consola
  } catch (error) {
    console.error("Error:", error.message);
  }
};

cargarCuentas(); // Ejecutamos la función para obtener las cuentas

// ----------------------------------------------- login -----------------------------------------------
btnLogin.addEventListener("click", async function (e) {
  e.preventDefault();

  // Obtenemos los valores del usuario y el PIN desde los campos del formulario
  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);

  try {
    // Enviar al servidor para verificar el usuario y el PIN
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: inputUsername,
        pin: inputPin,
      }),
    });

    // Si la respuesta no es ok, lanzamos un error
    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    // Recibimos los datos de la cuenta si la autenticación es exitosa
    const accountData = await response.json(); // La respuesta ahora es un objeto con la cuenta

    // Si la cuenta es válida, mostramos la UI
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${accountData.account.owner.split(" ")[0]}`;
    labelDate.textContent = new Date().toLocaleDateString("es-ES");

    // Limpiar el formulario de login
    inputLoginUsername.value = inputLoginPin.value = "";

    // Guardar el username y el pin del servidor en currentAccount
    currentAccount = {
      username: accountData.account.username,
      pin: accountData.account.pin,
    };

    // Actualizamos la UI con los datos de la cuenta
    updateUI(currentAccount);

    console.log(currentAccount);
  } catch (error) {
    alert(error.message); // Si hay algún error, mostramos un mensaje
    console.log(error);
  }
});

// ----------------------------------------------- updateUI -----------------------------------------------
const updateUI = function (account) {
  // Mostrar los movimientos de la cuenta con username y pin
  displayMovements(account.username, account.pin);
  // Mostrar el balance de la cuenta
  //displayBalance(account.movements);
  // Mostrar el resumen de la cuenta
  //displaySummary(account.movements);
};

const displayMovements = async function (username, pin) {
  // Vaciamos el HTML
  containerMovements.innerHTML = "";

  try {
    // Enviar la solicitud al backend con username y pin
    const response = await fetch("http://localhost:5000/movimientos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        pin: pin,
      }),
    });

    if (!response.ok) throw new Error("Error al obtener los movimientos");

    const accountData = await response.json(); // La respuesta ahora es un objeto con los movimientos

    // Guardamos los datos de movimientos en una variable
    movements = accountData.movements;

    // Recorremos el array de movimientos de la API
    movements.forEach((mov, i) => {
      // Creamos el tipo de movimiento (depósito o retiro)
      const type = mov.amount > 0 ? "deposit" : "withdrawal";
      // Formateamos la fecha en formato DD/MM/YYYY
      const date = new Date(mov.date);
      const formattedDate = formatRelativeDate(date);
      // Creamos el HTML
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${
            type === "withdrawal" ? "withdrawal" : "deposit"
          }</div>
          <div class="movements__date">${formattedDate}</div>
          <div class="movements__value">${mov.amount.toFixed(2)}€</div>
        </div>
      `;
      // Insertamos el HTML en el DOM
      containerMovements.insertAdjacentHTML("afterbegin", html);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const displayBalance = function (movements) {
  // Calculamos suma de ingresos y retiradas de efectivo
  const balance = movements.reduce((total, mov) => total + mov.amount, 0);
  // Actualizamos el DOM:
  labelBalance.textContent = `${balance.toFixed(2)} €`;
};

const displaySummary = function (movements) {
  // Calculamos los ingresos
  const incomes = movements
    .filter((mov) => mov.amount > 0)
    .reduce((sum, mov) => sum + mov.amount, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  // Calculamos los gastos
  const outflows = movements
    .filter((mov) => mov.amount < 0)
    .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);
  labelSumOut.textContent = `${outflows.toFixed(2)}€`;
  // Calculamos los intereses (suponiendo que se apliquen solo a depósitos y con una tasa media del 1.5%)
  const interestRate = 1.5 / 100;
  const interest = movements
    .filter((mov) => mov.amount > 0)
    .map((dep) => dep.amount * interestRate)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

function formatRelativeDate(date) {
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  // Si la fecha es de hoy
  if (diffDays === 0) {
    return "Hoy";
  }
  // Si la fecha es de ayer
  if (diffDays === 1) {
    return "Ayer";
  }
  // Si la fecha es de hace menos de una semana
  if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  }
  // Si la fecha es de hace menos de un mes (aproximadamente)
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }
  // Si la fecha es de hace menos de un año
  if (diffDays < 365) {
    // Calculamos la diferencia en meses
    const monthsDiff =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    return `Hace ${monthsDiff} ${monthsDiff === 1 ? "mes" : "meses"}`;
  }
  // Si es más de un año
  const yearsDiff = now.getFullYear() - date.getFullYear();
  if (yearsDiff < 5) {
    return `Hace ${yearsDiff} ${yearsDiff === 1 ? "año" : "años"}`;
  }
  // Si es más de 5 años, mostramos la fecha formateada
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
}

// ----------------------------------------------- transfer -----------------------------------------------

btnTransfer.addEventListener("click", function (e) {
  // Evitamos que el formulario se envíe
  e.preventDefault();
  // Se obtiene la cantidad y el nombre de usuario al que se quiere hacer la transferencia
  const amount = Number(inputTransferAmount.value);
  const transferUsername = inputTransferTo.value.trim();
  // Buscar la cuenta del receptor usando el username (iniciales)
  const transferAccount = cuentasGeneradas.find(
    (account) => account.username === transferUsername
  );
  // Obtener la cuenta actual del usuario autenticado
  const transferCurrentAccount = cuentasGeneradas.find(
    (account) => account.username === currentAccount.username
  );
  // Verificar si la cuenta del receptor existe
  if (!transferAccount) {
    // Mostrar un mensaje de error
    alert("El nombre de usuario del receptor no es válido.");
    return;
  }
  // Verificar si la cuenta actual existe
  if (!transferCurrentAccount) {
    // Mostrar un mensaje de error
    alert("Hubo un problema con tu cuenta.");
    return;
  }
  // Calcular el saldo del remitente (sumando los movimientos)
  const currentBalance = transferCurrentAccount.movements.reduce(
    (acc, mov) => acc + mov.amount,
    0
  );
  // Verificar las condiciones para la transferencia
  if (
    amount > 0 &&
    currentBalance >= amount &&
    transferAccount.username !== transferCurrentAccount.username
  ) {
    // Crear los objetos de movimiento para ambas cuentas
    const currentDate = new Date();
    const movementSender = {
      amount: -amount,
      date: currentDate,
    };
    const movementReceiver = {
      amount: amount,
      date: currentDate,
    };
    // Realizar la transferencia
    transferCurrentAccount.movements.push(movementSender); // Mov. de la cuenta del remitente
    transferAccount.movements.push(movementReceiver); // Mov. de la cuenta del receptor
    // Actualizar la interfaz de usuario
    updateUI(transferCurrentAccount);
    // Limpiar los campos del formulario
    inputTransferAmount.value = inputTransferTo.value = "";
  }
  // En caso de que no se verifiquen las condiciones
  else {
    // Mostramos una alerta por pantalla
    alert("No se pudo realizar la transferencia. Verifica los datos.");
  }
});

// ----------------------------------------------- loan -----------------------------------------------

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // Obtenemos el monto del préstamo
  const loanAmount = Math.floor(inputLoanAmount.value);
  // Comprobamos si el monto es positivo y no supera el 200% del balance actual
  const currentBalance = currentAccount.movements.reduce(
    (acc, mov) => acc + mov.amount,
    0
  );
  const maxLoanAmount = currentBalance * 2;
  if (loanAmount > 0 && loanAmount <= maxLoanAmount) {
    // Si el préstamo es válido, se agrega el préstamo como un movimiento positivo
    const currentDate = new Date();
    const loanMovement = {
      amount: loanAmount,
      date: currentDate,
    };
    // Agregar el préstamo a la cuenta del usuario
    currentAccount.movements.push(loanMovement);
    // Actualizamos la interfaz de usuario
    updateUI(currentAccount);
    // Limpiamos el campo de entrada del préstamo
    inputLoanAmount.value = "";
  } else {
    // Si el préstamo no es válido, mostramos un mensaje de error
    alert(
      `El préstamo no puede superar el 200% del saldo actual o su cuenta no tiene fondo.`
    );
  }
});

// ----------------------------------------------- close -----------------------------------------------

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  // Obtenemos los datos del formulario de cierre de cuenta
  const closeUsername = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  // Verificamos si el nombre de usuario y el PIN coinciden con los datos de la cuenta actual
  if (
    currentAccount.username === closeUsername &&
    currentAccount.pin === closePin
  ) {
    // Eliminamos la cuenta de la lista de cuentas disponibles
    const accountIndex = cuentasGeneradas.findIndex(
      (account) => account.username === currentAccount.username
    );
    if (accountIndex !== -1) {
      cuentasGeneradas.splice(accountIndex, 1); // Elimina la cuenta de cuentasGeneradas
    }
    // Confirmamos el cierre de cuenta
    alert("Tu cuenta ha sido cerrada con éxito.");
    // Ocultamos la aplicación y mostramos el formulario de login
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
    // Limpiamos los campos de entrada de login y close
    inputLoginUsername.value = inputLoginPin.value = "";
    inputCloseUsername.value = inputClosePin.value = "";
    // Reseteamos la variable de cuenta actual
    currentAccount = null;
  } else {
    // Si el nombre de usuario o PIN son incorrectos, mostramos un mensaje de error
    alert("Datos incorrectos. No se pudo cerrar la cuenta.");
  }
});

// ----------------------------------------------- sort -----------------------------------------------

btnSort.addEventListener("click", function () {
  // Cambia el estado de ordenación
  isSortedAsc = !isSortedAsc;
  if (currentAccount) {
    // Crea una copia ordenada de los movimientos
    const sortedMovements = [...currentAccount.movements];
    // Ordena los movimientos por fecha
    if (isSortedAsc) {
      // Orden ascendente (de más antiguo a más reciente)
      sortedMovements.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      // Orden descendente (de más reciente a más antiguo)
      sortedMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    // Usa la función displayMovements con los movimientos ordenados
    displayMovements(sortedMovements);
  }
});
