
"use strict";

const gestorLogros = (() => {

    let catalogoLogros = [];

    async function cargarArchivo(ruta) {

        try {
            const respuesta = await fetch(ruta);

            if (!respuesta.ok) {
                throw new Error(
                    `No se pudo cargar ${ruta}: ${respuesta.status}`
                );
            }

            const datos = await respuesta.json();

            if (!datos || !Array.isArray(datos.logros)) {
                throw new Error(
                    `El archivo ${ruta} no contiene una lista válida de logros.`
                );
            }

            return datos.logros;

        } catch (error) {
            console.error("Error cargando logros:", error);
            throw error;
        }
    }

    function validarLogro(logro) {

        const propiedades = [
            "nombre",
            "condicion",
            "nivel",
            "experiencia"
        ];

        for (const propiedad of propiedades) {
            if (!(propiedad in logro)) {
                return false;
            }
        }

        if (
            typeof logro.nombre !== "string" ||
            typeof logro.condicion !== "object" ||
            !["bronce", "plata", "oro", "platino"].includes(logro.nivel) ||
            !Number.isFinite(logro.experiencia) ||
            logro.experiencia < 0
        ) {
            return false;
        }

        if (
            logro.texto !== undefined &&
            typeof logro.texto !== "string"
        ) {
            return false;
        }

        return true;
    }

    async function cargarCategoria(ruta) {

        const logros = await cargarArchivo(ruta);

        for (const logro of logros) {

            if (!validarLogro(logro)) {
                throw new Error(
                    `El logro "${logro.nombre || "sin nombre"}" tiene datos incorrectos.`
                );
            }
        }

        catalogoLogros.push(...logros);

        return logros.length;
    }

    function obtenerLogros() {
        return [...catalogoLogros];
    }

    async function iniciar() {

        catalogoLogros = [];

        await cargarCategoria("./datos/logros/quimica.json");

        console.log(
            "Gestor de logros iniciado:",
            catalogoLogros.length,
            "logros cargados."
        );

        return obtenerLogros();
    }

    return {
        iniciar,
        obtenerLogros,
        cargarCategoria
    };

})();

window.gestorLogros = gestorLogros;
