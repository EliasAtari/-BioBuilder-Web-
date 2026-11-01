
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

    const datosA = elementos[atomoA.elemento];
    const datosB = elementos[atomoB.elemento];

    if (!datosA || !datosB) return;

    const enlaceExistente = enlaces.find(enlace =>
        (enlace.atomoA === atomoA.id && enlace.atomoB === atomoB.id) ||
        (enlace.atomoA === atomoB.id && enlace.atomoB === atomoA.id)
    );

    const ordenActual = enlaceExistente
        ? enlaceExistente.orden
        : 0;

    const nuevoOrden = ordenActual + 1;

    const valenciaA = obtenerValenciaUsada(atomoA.id);
    const valenciaB = obtenerValenciaUsada(atomoB.id);

    if (
        valenciaA + 1 > datosA.valenciaMaxima ||
        valenciaB + 1 > datosB.valenciaMaxima
    ) {
        console.warn(
            "No se puede aumentar el enlace: un átomo alcanzó su límite de valencia."
        );
        return;
    }

    if (!enlaceExistente) {

        enlaces.push({
            atomoA: atomoA.id,
            atomoB: atomoB.id,
            orden: 1
        });

        console.log("Enlace simple creado.");
        return;
    }

    if (nuevoOrden <= configuracionMolecular.enlaceMaximo) {

        enlaceExistente.orden = nuevoOrden;

        console.log(
            `Enlace actualizado a orden ${nuevoOrden}.`
        );

    } else {

        console.warn("El enlace ya alcanzó su orden máximo.");
    }
}

function obtenerValenciaUsada(idAtomo) {

    return enlaces.reduce((total, enlace) => {

        if (
            enlace.atomoA === idAtomo ||
            enlace.atomoB === idAtomo
        ) {
            return total + enlace.orden;
        }

        return total;

    }, 0);
}
    
