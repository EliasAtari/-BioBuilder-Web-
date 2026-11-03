
"use strict";

let herramientaEliminarActiva = false;

function activarHerramientaEliminar() {
    herramientaEliminarActiva = true;
}

function desactivarHerramientaEliminar() {
    herramientaEliminarActiva = false;
}

function seleccionarAtomoParaEliminar(id) {

    if (!herramientaEliminarActiva) return;

    const indiceAtomo = atomos.findIndex(
        atomo => atomo.id === id
    );

    if (indiceAtomo === -1) return;

    for (let i = enlaces.length - 1; i >= 0; i--) {

        if (
            enlaces[i].atomoA === id ||
            enlaces[i].atomoB === id
        ) {
            enlaces.splice(i, 1);
        }
    }

    atomos.splice(indiceAtomo, 1);

    console.log("Átomo eliminado:", id);

if (typeof actualizarVista3D === "function")
    actualizarVista3D()
}
