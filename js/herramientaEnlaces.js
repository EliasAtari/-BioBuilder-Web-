
"use strict";

let herramientaEnlacesActiva = false;
let primerAtomoSeleccionado = null;

function activarHerramientaEnlaces() {
    herramientaEnlacesActiva = true;
    primerAtomoSeleccionado = null;
}

function desactivarHerramientaEnlaces() {
    herramientaEnlacesActiva = false;
    primerAtomoSeleccionado = null;
}

function seleccionarAtomoParaEnlace(id) {

    if (!herramientaEnlacesActiva) return;

    const atomo = atomos.find(a => a.id === id);

    if (!atomo) return;

    if (primerAtomoSeleccionado === null) {
        primerAtomoSeleccionado = atomo;
        console.log("Primer átomo seleccionado:", atomo);
        return;
    }

    if (primerAtomoSeleccionado.id === atomo.id) {
        console.warn("Selecciona un átomo diferente.");
        return;
    }

    crearEnlaceCovalente(primerAtomoSeleccionado, atomo);

    primerAtomoSeleccionado = null;
}

function crearEnlaceCovalente(atomoA, atomoB) {

    const enlaceExistente = enlaces.find(enlace =>
        (enlace.atomoA === atomoA.id && enlace.atomoB === atomoB.id) ||
        (enlace.atomoA === atomoB.id && enlace.atomoB === atomoA.id)
    );

    if (enlaceExistente) {
        console.warn("Ya existe un enlace entre estos átomos.");
        return;
    }

    const datosA = elementos[atomoA.elemento];
    const datosB = elementos[atomoB.elemento];

    if (!datosA || !datosB) return;

    const valenciaA = obtenerValenciaUsada(atomoA.id);
    const valenciaB = obtenerValenciaUsada(atomoB.id);

    if (valenciaA >= datosA.valenciaMaxima ||
        valenciaB >= datosB.valenciaMaxima) {

        console.warn("Uno de los átomos alcanzó su límite de valencia.");
        return;
    }

    enlaces.push({
        atomoA: atomoA.id,
        atomoB: atomoB.id,
        orden: 1
    });

    console.log("Enlace covalente creado.");
}

function obtenerValenciaUsada(idAtomo) {

    return enlaces.reduce((total, enlace) => {

        if (enlace.atomoA === idAtomo ||
            enlace.atomoB === idAtomo) {
            return total + enlace.orden;
        }

        return total;

    }, 0);
}
