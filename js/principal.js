
"use strict";

const botonAgregar = document.getElementById("agregar-atomo");
const botonEliminar = document.getElementById("eliminar");
const botonEnlace = document.getElementById("crear-enlace");

const boton2D = document.getElementById("modo-2d");
const boton3D = document.getElementById("modo-3d");

const visor = document.getElementById("visor");
const contenedor2D = document.getElementById("contenedor-plano2D");
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

    herramientaActiva = nombre;

    if (nombre === "agregar") {
        activarHerramientaAgregar();
    }

    if (nombre === "enlaces") {
        activarHerramientaEnlaces();
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
});

botonEliminar.addEventListener("click", () => {
    cambiarHerramienta("eliminar");

    estado.textContent =
        "La herramienta Eliminar todavía no está implementada.";
});

function cambiarVista(modo) {

    if (modo === "2D") {

        vistaActiva = "2D";

        contenedor2D.hidden = false;
        boton2D.classList.add("activo");
        boton3D.classList.remove("activo");

        vistaActual.textContent = "Vista 2D";

        actualizarVista2D();

    } else {

        vistaActiva = "3D";

        contenedor2D.hidden = true;
        boton3D.classList.add("activo");
        boton2D.classList.remove("activo");

        vistaActual.textContent = "Vista 3D";
        estado.textContent =
            "El módulo de visualización 3D está pendiente.";
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

    return {
        x: evento.clientX - rectangulo.left,
        y: evento.clientY - rectangulo.top
    };
}

dibujo2D.addEventListener("click", (evento) => {

    if (vistaActiva !== "2D") return;

    const atomoSeleccionado = evento.target.closest("[data-atomo-id]");

    if (atomoSeleccionado) {

        const id = Number(atomoSeleccionado.dataset.atomoId);

        if (herramientaActiva === "enlaces") {
            seleccionarAtomoParaEnlace(id);
            actualizarInterfaz();
            actualizarVista2D();
        }

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

function actualizarVista2D() {

    const ancho = dibujo2D.clientWidth;
    const alto = dibujo2D.clientHeight;

    dibujo2D.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);

    dibujo2D.innerHTML = "";
    
    enlaces.forEach(enlace => {

    const atomoA = atomos.find(a => a.id === enlace.atomoA);
    const atomoB = atomos.find(a => a.id === enlace.atomoB);

    if (!atomoA || !atomoB) return;

    const dx = atomoB.x - atomoA.x;
    const dy = atomoB.y - atomoA.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia === 0) return;

    const ux = dx / distancia;
    const uy = dy / distancia;

    const radio = 9;
    const inicioX = atomoA.x + ux * radio;
    const inicioY = atomoA.y + uy * radio;
    const finalX = atomoB.x - ux * radio;
    const finalY = atomoB.y - uy * radio;

    const linea = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    linea.setAttribute("x1", inicioX);
    linea.setAttribute("y1", inicioY);
    linea.setAttribute("x2", finalX);
    linea.setAttribute("y2", finalY);
    linea.setAttribute("stroke", "#ffffff");
    linea.setAttribute("stroke-width", "2");

    dibujo2D.appendChild(linea);
});
    
    atomos.forEach(atomo => {

    const datos = elementos[atomo.elemento];
    if (!datos) return;

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

    dibujo2D.appendChild(texto);
});
    
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

function iniciarBioBuilder() {

    cambiarVista("2D");

    actualizarInterfaz();
    actualizarVista2D();

    estado.textContent = "Sistema preparado";

    console.log("BioBuilder WEB 2.1 iniciado.");
}

iniciarBioBuilder();
          
