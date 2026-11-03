
"use strict";

const botonAgregar = document.getElementById("agregar-atomo");
const botonEliminar = document.getElementById("eliminar");
const botonEnlace = document.getElementById("crear-enlace");

const boton2D = document.getElementById("modo-2d");
const boton3D = document.getElementById("modo-3d");

const visor = document.getElementById("visor");
const contenedor2D = document.getElementById("contenedor-plano2D");
const contenedor3D = document.getElementById("contenedor-3D");
const dibujo2D = document.getElementById("dibujo-plano2D");

const mensajeInicial = document.getElementById("mensaje-inicial");

const estado = document.getElementById("estado");
const cantidadAtomos = document.getElementById("cantidad-atomos");
const cantidadEnlaces = document.getElementById("cantidad-enlaces");
const formula = document.getElementById("formula");
const vistaActual = document.getElementById("vista-actual");

let herramientaActiva = null;
let vistaActiva = "2D";

function cambiarHerramienta(nombre) {
    
    if (herramientaActiva === "agregar") {
        desactivarHerramientaAgregar();
    }

    if (herramientaActiva === "enlaces") {
        desactivarHerramientaEnlaces();
    }

    if (herramientaActiva === "eliminar") {
        desactivarHerramientaEliminar();
    }

    herramientaActiva = nombre;

    if (nombre === "agregar") {
        activarHerramientaAgregar();
    }

    if (nombre === "enlaces") {
        activarHerramientaEnlaces();
    }

    if (nombre === "eliminar") {
        activarHerramientaEliminar();
    }

    actualizarBotonesHerramientas();
}

function actualizarBotonesHerramientas() {

    botonAgregar.classList.toggle(
        "activo",
        herramientaActiva === "agregar"
    );

    botonEnlace.classList.toggle(
        "activo",
        herramientaActiva === "enlaces"
    );

    botonEliminar.classList.toggle(
        "activo",
        herramientaActiva === "eliminar"
    );
}

botonAgregar.addEventListener("click", () => {
    cambiarHerramienta("agregar");
});

botonEnlace.addEventListener("click", () => {
    cambiarHerramienta("enlaces");

    estado.textContent =
        "Crea un enlace simple, doble y triple, selecciona 2 atomos"
});

botonEliminar.addEventListener("click", () => {
    cambiarHerramienta("eliminar");

    estado.textContent =
        "Selecciona un atomo para eliminarlo.";
});

function cambiarVista(modo) {
    
    if (modo === "2D") {

        vistaActiva = "2D";

        contenedor2D.hidden = false;
        contenedor3D.hidden = true;

        boton2D.classList.add("activo");
        boton3D.classList.remove("activo");

        vistaActual.textContent = "Vista 2D";

        actualizarVista2D();

        estado.textContent = "Vista 2D preparada";

    } else if (modo === "3D") {

        vistaActiva = "3D";

        contenedor2D.hidden = true;
        contenedor3D.hidden = false;

        boton3D.classList.add("activo");
        boton2D.classList.remove("activo");

        vistaActual.textContent = "Vista 3D";

        try {

            motor3D.iniciar();
            motor3D.ajustarTamaño();
            motor3D.renderizar();

            estado.textContent = "Vista 3D preparada";

        } catch (error) {

            estado.textContent = "Error al iniciar la vista 3D.";

            alert(
                "No se pudo iniciar el motor 3D:\n" +
                error.message
            );

        }
    }
}

boton2D.addEventListener("click", () => {
    cambiarVista("2D");
});

boton3D.addEventListener("click", () => {
    cambiarVista("3D");
});

function obtenerCoordenadas(evento) {

    const rectangulo = dibujo2D.getBoundingClientRect();

    const ancho = dibujo2D.viewBox.baseVal.width;
    const alto = dibujo2D.viewBox.baseVal.height;

    return {
        x: (evento.clientX - rectangulo.left) * (ancho / rectangulo.width),
        y: (evento.clientY - rectangulo.top) * (alto / rectangulo.height)
    };
}

dibujo2D.addEventListener("click", (evento) => {
    
    if (vistaActiva !== "2D") return;

    const atomoSeleccionado =
        evento.target.closest("[data-atomo-id]");

    if (atomoSeleccionado) {

        const id = Number(
            atomoSeleccionado.dataset.atomoId
        );

        if (herramientaActiva === "enlaces") {
            seleccionarAtomoParaEnlace(id);
        }

        else if (herramientaActiva === "eliminar") {
            seleccionarAtomoParaEliminar(id);
        }

        actualizarInterfaz();
        actualizarVista2D();

        return;
    }

    if (herramientaActiva === "agregar") {

        const coordenadas = obtenerCoordenadas(evento);

        colocarAtomo(
            coordenadas.x,
            coordenadas.y
        );

        actualizarInterfaz();
        actualizarVista2D();
    }
});

function obtenerHidrogenosImplicitos(atomo) {

    const valenciasPermitidas = {
        C: 4,
        N: 3,
        O: 2
    };

    const valenciaObjetivo =
        valenciasPermitidas[atomo.elemento];

    if (valenciaObjetivo === undefined) return 0;

    const valenciaUsada = obtenerValenciaUsada(atomo.id);

    return Math.max(
        0,
        valenciaObjetivo - valenciaUsada
    );
}

function crearEtiquetaAtomo(atomo, datos) {

    const texto = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    texto.dataset.atomoId = atomo.id;

    texto.setAttribute("x", atomo.x);
    texto.setAttribute("y", atomo.y);
    texto.setAttribute("fill", datos.color);
    texto.setAttribute("font-size", "20");
    texto.setAttribute("font-weight", "bold");
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("dominant-baseline", "central");

    texto.textContent = datos.simbolo;

    const hidrogenos = obtenerHidrogenosImplicitos(atomo);

    if (hidrogenos > 0) {

        const etiquetaH = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan"
        );

        etiquetaH.textContent = "H";
        etiquetaH.setAttribute("fill", elementos.H.color);

        texto.appendChild(etiquetaH);

        if (hidrogenos > 1) {

            const subindice = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "tspan"
            );

            subindice.textContent = String(hidrogenos);
            subindice.setAttribute("font-size", "12");
            subindice.setAttribute("baseline-shift", "sub");
            subindice.setAttribute("fill", elementos.H.color);

            texto.appendChild(subindice);
        }
    }

    return texto;
}

function actualizarVista2D() {

    const ancho = dibujo2D.clientWidth;
    const alto = dibujo2D.clientHeight;

    if (ancho === 0 || alto === 0) return;

    dibujo2D.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);

    dibujo2D.innerHTML = "";

    enlaces.forEach(enlace => {

        const atomoA = atomos.find(
            a => a.id === enlace.atomoA
        );

        const atomoB = atomos.find(
            a => a.id === enlace.atomoB
        );

        if (!atomoA || !atomoB) return;

        const dx = atomoB.x - atomoA.x;
        const dy = atomoB.y - atomoA.y;

        const distancia = Math.hypot(dx, dy);

        if (distancia === 0) return;

        const ux = dx / distancia;
        const uy = dy / distancia;

        const px = -uy;
        const py = ux;

        const radio = 9;
        const separacion = 4;

        const inicioX = atomoA.x + ux * radio;
        const inicioY = atomoA.y + uy * radio;

        const finalX = atomoB.x - ux * radio;
        const finalY = atomoB.y - uy * radio;

        const orden = Math.min(
            3,
            Math.max(1, Number(enlace.orden) || 1)
        );

        const desplazamientos = [];

        if (orden === 1) {
            desplazamientos.push(0);
        }

        if (orden === 2) {
            desplazamientos.push(
                -separacion / 2,
                separacion / 2
            );
        }

        if (orden === 3) {
            desplazamientos.push(
                -separacion,
                0,
                separacion
            );
        }

        desplazamientos.forEach(desplazamiento => {

            const linea = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );

            linea.setAttribute(
                "x1",
                inicioX + px * desplazamiento
            );

            linea.setAttribute(
                "y1",
                inicioY + py * desplazamiento
            );

            linea.setAttribute(
                "x2",
                finalX + px * desplazamiento
            );

            linea.setAttribute(
                "y2",
                finalY + py * desplazamiento
            );

            linea.setAttribute("stroke", "#ffffff");
            linea.setAttribute("stroke-width", "2");
            linea.setAttribute("stroke-linecap", "round");

            dibujo2D.appendChild(linea);
        });
    });

    atomos.forEach(atomo => {

        const datos = elementos[atomo.elemento];

        if (!datos) return;

        const etiqueta = crearEtiquetaAtomo(atomo, datos);

        dibujo2D.appendChild(etiqueta);
    });
}

function actualizarInterfaz() {

    cantidadAtomos.textContent = atomos.length;
    cantidadEnlaces.textContent = enlaces.length;

    mensajeInicial.hidden = atomos.length > 0;

    const conteo = {};

    atomos.forEach(atomo => {

        conteo[atomo.elemento] =
            (conteo[atomo.elemento] || 0) + 1;
    });

    const orden = ["C", "H", "O", "N", "Cl", "S", "P", "F"];

    formula.textContent = orden
        .filter(simbolo => conteo[simbolo])
        .map(simbolo =>
            simbolo + (conteo[simbolo] > 1 ? conteo[simbolo] : "")
        )
        .join("") || "—";
}

async function iniciarBioBuilder() {
    
    cambiarVista("2D");

    actualizarInterfaz();
    actualizarVista2D();

    estado.textContent = "Sistema preparado";

    try {
        await gestorLogros.iniciar();

        estado.textContent = "Sistema preparado";
        console.log("Catálogo de logros cargado correctamente.");

    } catch (error) {
        estado.textContent = "Error al cargar los logros.";

        alert(
            "No se pudo iniciar el sistema de logros:\n" +
            error.message
        );
    }

    console.log("BioBuilder WEB 2.1 iniciado.");
}

iniciarBioBuilder();
    
