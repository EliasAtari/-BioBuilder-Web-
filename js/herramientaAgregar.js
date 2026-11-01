
"use strict";

let herramientaAgregarActiva = false;
let elementoSeleccionado = null;

function activarHerramientaAgregar() {

    const respuesta = prompt(
        "Escribe el símbolo del elemento químico que deseas agregar:"
    );

    if (respuesta === null) return;

    const simbolo = respuesta.trim();

    if (!elementos[simbolo]) {
        alert("El elemento químico no existe o no está disponible.");
        return;
    }

    elementoSeleccionado = simbolo;
    herramientaAgregarActiva = true;

    console.log("Herramienta Agregar activada:", simbolo);
}

function desactivarHerramientaAgregar() {
    herramientaAgregarActiva = false;
    elementoSeleccionado = null;
}

function colocarAtomo(x, y) {

    if (!herramientaAgregarActiva) return;

    const nuevoAtomo = {
        id: siguienteId++,
        elemento: elementoSeleccionado,
        x: x,
        y: y
    };

    atomos.push(nuevoAtomo);

    console.log("Átomo agregado:", nuevoAtomo);
}
