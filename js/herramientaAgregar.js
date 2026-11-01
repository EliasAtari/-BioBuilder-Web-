
"use strict";

let herramientaAgregarActiva = false;
let elementoSeleccionado = null;

function activarHerramientaAgregar() {
  herramientaAgregarActiva = true;
  elementoSeleccionado = null;
}

function desactivarHerramientaAgregar() {
  herramientaAgregarActiva = false;
  elementoSeleccionado = null;
}

function seleccionarElemento(simbolo) {
  if (elementos[simbolo]) {
    console.error("Elemento quimico no válido:", simbolo);
    return;
  }

elementoSeleccionado = simbolo;
}

function colocarAtomo(x, y) {
  if (!herramientaAgregarActiva) return;

    if (!elementoSeleccionado) {
        console.warn("Primero debes seleccionar un elemento.");
        return;
    }

    const nuevoAtomo = {
        id: siguienteId++,
        elemento: elementoSeleccionado,
        x: x,
        y: y
    };

    atomos.push(nuevoAtomo);

    console.log("Átomo agregado:", nuevoAtomo);
}
