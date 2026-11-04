
"use strict";

const controlesNavegacion = {

    dispositivo: "automatico",

    movil: {
        zoom: true,
        desplazamiento: true,
        gestos: true
    },

    computadora: {
        zoom: true,
        desplazamiento: true,
        rotacion: true
    },

    detectarDispositivo() {
        return window.matchMedia(
            "(pointer: coarse)"
            ).matches ? "movil" : "computadora";

    },

    obtenerConfiguracion() {

    if(this.dispositivo === "automatico") {
        return
        this[this.detectarDispositivo()];
    }

    return
        this[this.dispositivo];
    }
};

console.log("Controles de navegación:",

            controlesNavegacion.detectarDispositivo()
            );
