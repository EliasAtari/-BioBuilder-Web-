
"use strict";

let herramientaEnlacesActiva = false;
let primerAtomoSeleccionado = null;

function actualizarVistasEnlaces() {

    if (typeof actualizarVista2D === "function") {
        actualizarVista2D();
    }

    if (typeof actualizarVista3D === "function") {
        actualizarVista3D();
    }
}

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

    const indiceEnlace = enlaces.findIndex(enlace =>
        (enlace.atomoA === atomoA.id && enlace.atomoB === atomoB.id) ||
        (enlace.atomoA === atomoB.id && enlace.atomoB === atomoA.id)
    );

    if (indiceEnlace !== -1) {

        const enlace = enlaces[indiceEnlace];

        if (enlace.orden === 3) {

            enlaces.splice(indiceEnlace, 1);
            
            actualizarVistasEnlaces();

            console.log("Enlace eliminado.");
            return;
        }

        const valenciaA = obtenerValenciaUsada(atomoA.id);
        const valenciaB = obtenerValenciaUsada(atomoB.id);

        if (
            valenciaA + 1 > datosA.valenciaMaxima ||
            valenciaB + 1 > datosB.valenciaMaxima
        ) {
            console.warn("Se alcanzó el límite de valencia.");
            return;
        }

        enlace.orden++;
        
        actualizarVistasEnlaces();

        console.log("Orden del enlace:", enlace.orden);
        return;
    }

    const valenciaA = obtenerValenciaUsada(atomoA.id);
    const valenciaB = obtenerValenciaUsada(atomoB.id);

    if (
        valenciaA + 1 > datosA.valenciaMaxima ||
        valenciaB + 1 > datosB.valenciaMaxima
    ) {
        console.warn("No se puede crear el enlace: límite de valencia alcanzado.");
        return;
    }

    enlaces.push({
        atomoA: atomoA.id,
        atomoB: atomoB.id,
        orden: 1
    });

    actualizarVistasEnlaces();

    console.log("Enlace simple creado.");
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
    
