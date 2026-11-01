
"use strict";

let herramientaAgregarActiva = false;
let elementoSeleccionado = null;

function activarHerramientaAgregar() {

    const respuesta = prompt(
        "¿Qué elemento químico deseas agregar?\n\n" +
        "C = Carbono\n" +
        "H = Hidrógeno\n" +
        "O = Oxígeno\n" +
        "N = Nitrógeno\n" +
        "Cl = Cloro\n" +
        "S = Azufre\n" +
        "P = Fósforo\n" +
        "F = Flúor"
    );

    if (respuesta === null) {
        herramientaAgregarActiva = false;
        elementoSeleccionado = null;
        return;
    }

    const simbolo = respuesta.trim();

    const clave = Object.keys(elementos).find(
        elemento => elemento.toLowerCase() === simbolo.toLowerCase()
    );

    if (!clave) {
        alert("Elemento químico no válido.");
        return;
    }

    elementoSeleccionado = clave;
    herramientaAgregarActiva = true;

    console.log(
        "Herramienta Agregar activada:",
        elementos[clave].nombre
    );
}

function desactivarHerramientaAgregar() {

    herramientaAgregarActiva = false;
    elementoSeleccionado = null;

}

function colocarAtomo(x, y) {

    if (!herramientaAgregarActiva) return;

    if (!elementoSeleccionado) return;

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        console.error("Coordenadas del átomo no válidas.");
        return;
    }

    const nuevoAtomo = {

        id: siguienteId++,

        elemento: elementoSeleccionado,

        x: x,
        y: y

    };

    atomos.push(nuevoAtomo);

    console.log("Átomo colocado:", nuevoAtomo);

    if (typeof actualizarVista2D === "function") {
        actualizarVista2D();
    }

    if (typeof actualizarVista3D === "function") {
        actualizarVista3D();
    }

    if (typeof actualizarInterfaz === "function") {
        actualizarInterfaz();
    }

    return nuevoAtomo;
}
