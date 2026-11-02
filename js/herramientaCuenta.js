
"use strict";

import {
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const botonCuenta = document.getElementById("cuenta");

let usuarioActual = null;

onAuthStateChanged(window.firebaseAuth, (usuario) => {
    usuarioActual = usuario;

    if (usuario) {
        botonCuenta.textContent = "Mi Cuenta";
        console.log("Sesión iniciada:", usuario.email);
    } else {
        botonCuenta.textContent = "Iniciar sesión";
        console.log("No hay ninguna sesión iniciada.");
    }
});

botonCuenta.addEventListener("click", async () => {

    if (usuarioActual) {
        console.log("Usuario actual:", usuarioActual);
        return;
    }

    try {
        const resultado = await signInWithPopup(
            window.firebaseAuth,
            window.proveedorGoogle
        );

        console.log("Inicio de sesión correcto:", resultado.user.email);

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
});

