
"use strict";

const elementos = {

    C: {
        nombre: "Carbono",
        simbolo: "C",
        numeroAtomico: 6,
        color: "#50545c",
        colorTexto: "#ffffff",
        valenciaMaxima: 4
    },

    H: {
        nombre: "Hidrógeno",
        simbolo: "H",
        numeroAtomico: 1,
        color: "#f2f2f2",
        colorTexto: "#202020",
        valenciaMaxima: 1
    },

    O: {
        nombre: "Oxígeno",
        simbolo: "O",
        numeroAtomico: 8,
        color: "#ed4141",
        colorTexto: "#ffffff",
        valenciaMaxima: 2
    },

    N: {
        nombre: "Nitrógeno",
        simbolo: "N",
        numeroAtomico: 7,
        color: "#4169e1",
        colorTexto: "#ffffff",
        valenciaMaxima: 3
    },

    Cl: {
        nombre: "Cloro",
        simbolo: "Cl",
        numeroAtomico: 17,
        color: "#39b54a",
        colorTexto: "#ffffff",
        valenciaMaxima: 1
    },

    S: {
        nombre: "Azufre",
        simbolo: "S",
        numeroAtomico: 16,
        color: "#e6ce35",
        colorTexto: "#202020",
        valenciaMaxima: 2
    },

    P: {
        nombre: "Fósforo",
        simbolo: "P",
        numeroAtomico: 15,
        color: "#e88a36",
        colorTexto: "#202020",
        valenciaMaxima: 3
    },

    F: {
        nombre: "Flúor",
        simbolo: "F",
        numeroAtomico: 9,
        color: "#80d65b",
        colorTexto: "#202020",
        valenciaMaxima: 1
    }

};

const atomos = [];
const enlaces = [];

let siguienteId = 1;

const configuracionMolecular = {
    enlaceMaximo: 3,
    radioAtomo2D: 15,

    mundo: {
        tamañoSector: 32,
        coordenadaInicialX: 0,
        coordenadaInicialY: 0,
        coordenadaInicialZ: 0
},
    zoom: {
        minimo: 0.25,
        maximo: 4,
        inicial: 1,
        velocidad: 0.1
    }

const mundoMolecular = {

    obtenerSector(x, y, z = 0) {

    const tamaño = configuracionMolecular.mundo.tamañoSector;

    return {
        x: Math.floor(x / tamaño),
        y: Math.floor(y / tamaño),
        z: Math.floor(z / tamaño)
    };

  }
    
};
