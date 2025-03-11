# Aplicación de Gestión de Movimientos Bancarios
Esta aplicación permite visualizar y gestionar movimientos bancarios, mostrando el historial de transacciones y permitiendo ordenarlas por fecha.


## ⚙️ Instalación

1. Para la instalación, es necesario copiar este repositorio de GitHub a través del siguiente comando en una terminal:
```shell
git clone https://github.com/AaronCS-22/banco-final.git
```
2. Accedemos desde la terminal a la carpeta ```client``` e instalamos los paquetes necesarios con el siguiente comando:
```shell
npm install
```
3. A continuación, en la misma terminal anterior y en la carpeta ```client```, ejecutamos el siguiente código:
```shell
npm run dev
```

4. A través de otra terminal, accedemos a la carpeta ```server``` y, como se ha realizado en el paso 2, instalamos los paquetes necesarios:
```shell
npm install
```
5. Para arrancar el servidor, debemos poner el siguiente comando junto con el número de puerto donde la aplicación cliente se encuentra en funcionamiento:
```shell
node server.js
```
6. Si aparece un mensaje por consola que pone que el servidor se encuentra funcionando en el puerto 5000, se habrá realizado con éxito el despliegue de la API.

7. Entramos a ```http://localhost:5173``` y, en caso de que al acceder a la consola aparezcan varios arrays con las cuentas de usuario, la conexión habrá funcionado.

## ✅ Requisitos cumplidos
1. **Visualización de movimientos con fechas:** La aplicación permite ver un historial de transacciones realizadas mostrando la fecha y la cantidad en cada movimiento.

2. **Transferir dinero entre cuentas:** Los usuarios pueden transferir dinero entre cuentas siempre que el emisor tenga suficiente saldo disponible para la transacción.

3. **Pedir préstamos al banco:** Los usuarios pueden solicitar préstamos si la cuenta tiene fondos y el préstamo no supera el 200% del dinero actual en la cuenta. El sistema valida esta condición antes de permitir la operación.

4. **Ordenación de movimientos:** Los movimientos pueden ser ordenados de forma ascendente o descendente por fecha, mediante un botón interactivo en la interfaz de usuario.

5. **Eliminación de cuentas:** Los usuarios tienen la opción de eliminar su cuenta desde la aplicación, lo que elimina su información de la base de datos.

6. **Interfaz intuitiva y adaptable:** La aplicación está diseñada para ser intuitiva y funcional ordenadores como en dispositivos móviles, brindando una experiencia amigable y fácil de usar.

## 🗒️ Notas
- **Puerto del servidor:** El servidor debe ejecutarse siempre en el puerto 5000 para que el cliente pueda realizar las solicitudes correctamente. Si el servidor se ejecuta en otro puerto (cambiando su parámetro en la variable ```PORT``` en el archvio ```server/server.js```), será necesario cambiar la variable ```PORT``` manualmente en el archivo ```client/src/main.js``` (primeras líneas del código) para que apunte al puerto correcto.

- **Persistencia de datos:** Todas las acciones del usuario se gestionan y almacenan en el servidor a través de ```GET``` y ```USE```. Los datos permanecen intactos en el servidor, incluso si se recarga la página en el cliente. Recargar la página solo reinicia la visualización de la interfaz, pero no afecta a los datos guardados.

- **Mensajes por consola:** Durante las pruebas y el desarrollo, se muestra información en la consola para facilitar el seguimiento de las operaciones, como las cuentas de usuario y sus contraseñas. Sin embargo, en un entorno de producción esta información no debe mostrarse por razones de seguridad y privacidad. En caso de acceder a la lista completa de las cuentas, se deberá acceder a ```http://localhost:5000/cuentas```.

- **Reinicio del servidor:** Al reiniciar el servidor, el paquete ```faker``` generará nuevas cuentas bancarias y eliminará las antiguas. Esto es útil para el desarrollo y las pruebas, pero en un entorno real, los datos deberían almacenarse de forma persistente en una base de datos y no deberían ser eliminados al reiniciar el servidor.