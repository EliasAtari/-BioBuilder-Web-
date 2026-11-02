
"use strict";

import {
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const botonCuenta = document.getElementById("cuenta");
const panelCuenta = document.getElementById("panel-cuenta");
const cerrarPanel = document.getElementById("cerrar-panel-cuenta");
const cerrarSesion = document.getElementById("cerrar-sesion");

const fotoUsuario = document.getElementById("foto-usuario");
const nombreUsuario = document.getElementById("nombre-usuario");
const correoUsuario = document.getElementById("correo-usuario");

let usuarioActual = null;

onAuthStateChanged(window.firebaseAuth, (usuario) => {

    usuarioActual = usuario;

    if (usuario) {
        botonCuenta.textContent = "Mi Cuenta";

        console.log("Sesión iniciada:", usuario.email);

        fotoUsuario.src = usuario.photoURL || "";
        nombreUsuario.textContent = usuario.displayName || "Usuario";
        correoUsuario.textContent = usuario.email || "";

    } else {
        botonCuenta.textContent = "Iniciar sesión";

        panelCuenta.hidden = true;

        console.log("No hay ninguna sesión iniciada.");
    }
});

botonCuenta.addEventListener("click", async () => {

    if (usuarioActual) {
        panelCuenta.hidden = false;
        return;
    }

    try {
        const resultado = await signInWithPopup(
            window.firebaseAuth,
            window.proveedorGoogle
        );

        console.log(
            "Inicio de sesión correcto:",
            resultado.user.email
        );

    } catch (error) {
        console.error("Error al iniciar sesión:", error.code);
        console.error(error.message);
    }
});

cerrarPanel.addEventListener("click", () => {
    panelCuenta.hidden = true;
});

cerrarSesion.addEventListener("click", async () => {

    try {
        await signOut(window.firebaseAuth);

        panelCuenta.hidden = true;

        console.log("Sesión cerrada correctamente.");

    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});
