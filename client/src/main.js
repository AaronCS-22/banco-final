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
    cargarDatos(currentAccount.username, currentAccount.pin);

    console.log(currentAccount);
  } catch (error) {
    alert(error.message); // Si hay algún error, mostramos un mensaje
    console.log(error);
  }
});

async function cargarDatos(username, pin) {
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

  const data = await response.json();

  const movementsArray = Object.values(data.movements);

  updateUI(movementsArray);
}

// ----------------------------------------------- updateUI -----------------------------------------------
const updateUI = function (movements) {
  // Mostrar los movimientos de la cuenta con username y pin
  displayMovements(movements);
  // Mostrar el balance de la cuenta
  displayBalance(movements);
  // Mostrar el resumen de la cuenta
  displaySummary(movements);
};

const displayMovements = function (movements) {
  // Vaciamos el HTML
  containerMovements.innerHTML = "";

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
};

const displayBalance = function (movements) {
  let balance = 0; // Inicializamos el balance en 0

  // Recorremos los valores de movements y sumamos los montos
  for (const key in movements) {
    if (movements.hasOwnProperty(key)) {
      balance += movements[key].amount;
    }
  }

  // Actualizamos el DOM con el balance calculado
  labelBalance.textContent = `${balance.toFixed(2)} €`;
};

const displaySummary = function (movements) {
  let incomes = 0;
  let outflows = 0;
  let interest = 0;
  const interestRate = 1.5 / 100;

  // Recorremos el objeto movements
  for (const key in movements) {
    if (movements.hasOwnProperty(key)) {
      const amount = movements[key].amount;

      if (amount > 0) {
        incomes += amount;
        interest += amount * interestRate; // Calculamos el interés solo para depósitos
      } else {
        outflows += Math.abs(amount);
      }
    }
  }

  // Actualizamos los valores en la UI
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${outflows.toFixed(2)}€`;
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

btnTransfer.addEventListener("click", async function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferUsername = inputTransferTo.value.trim();

  try {
    // Validaciones básicas
    if (amount <= 0 || !transferUsername) {
      throw new Error("Cantidad inválida o usuario no especificado");
    }

    // Enviar solicitud de transferencia al servidor
    const response = await fetch("http://localhost:5000/transacciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameEmisor: currentAccount.username,
        usernameReceptor: transferUsername,
        pin: currentAccount.pin,
        cantidad: amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al realizar la transferencia");
    }

    // Si la transferencia fue exitosa, recargar los datos
    await cargarDatos(currentAccount.username, currentAccount.pin);
    
    // Limpiar los campos del formulario
    inputTransferTo.value = inputTransferTo.value = "";
    inputTransferAmount.value = inputTransferAmount.value = "";
  } catch (error) {
    alert(error.message);
  }
});

// ----------------------------------------------- loan -----------------------------------------------

btnLoan.addEventListener("click", async function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const transferUsername = inputLoanAmount.value.trim();

  try {
    // Validaciones básicas
    if (amount <= 0 || !transferUsername) {
      throw new Error("Cantidad inválida o usuario no especificado");
    }

    // Enviar solicitud de transferencia al servidor
    const response = await fetch("http://localhost:5000/prestamos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentAccount.username,
        pin: currentAccount.pin,
        cantidad: amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al realizar la transferencia");
    }

    // Si la transferencia fue exitosa, recargar los datos
    await cargarDatos(currentAccount.username, currentAccount.pin);
    
    // Limpiar los campos del formulario
    inputLoanAmount.value = inputLoanAmount.value = "";
    
  } catch (error) {
    alert(error.message);
  }
});

// ----------------------------------------------- close -----------------------------------------------

btnClose.addEventListener("click", async function (e) {
  e.preventDefault();
  
  // Obtenemos los datos del formulario de cierre de cuenta
  const closeUsername = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  
  try {
    // Verificamos que se está intentando cerrar la cuenta actualmente logueada
    if (currentAccount.username !== closeUsername) {
      throw new Error("Solo puedes cerrar tu propia cuenta");
    }
    
    // Enviar solicitud al servidor para cerrar la cuenta
    const response = await fetch("http://localhost:5000/cerrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: closeUsername,
        pin: closePin,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al cerrar la cuenta");
    }
    
    // Si la cuenta se cerró con éxito
    alert("Tu cuenta ha sido cerrada con éxito.");
    
    // Ocultamos la aplicación y mostramos el formulario de login
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
    
    // Limpiamos los campos de entrada
    inputLoginUsername.value = inputLoginPin.value = "";
    inputCloseUsername.value = inputClosePin.value = "";
    
    // Reseteamos la variable de cuenta actual
    currentAccount = null;
  } catch (error) {
    alert(error.message);
  }
});

// ----------------------------------------------- sort -----------------------------------------------

btnSort.addEventListener("click", async function () {
  if (!currentAccount) return;

  try {
    // Obtener movimientos actualizados del servidor
    const response = await fetch("http://localhost:5000/movimientos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentAccount.username,
        pin: currentAccount.pin,
      }),
    });

    if (!response.ok) throw new Error("Error al obtener los movimientos");

    const data = await response.json();
    let movementsArray = Object.values(data.movements);

    // Cambia el estado de ordenación
    isSortedAsc = !isSortedAsc;

    // Ordenar los movimientos según la fecha
    movementsArray.sort((a, b) =>
      isSortedAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

    // Mostrar los movimientos ordenados en la UI
    displayMovements(movementsArray);
  } catch (error) {
    alert(error.message);
  }
});

