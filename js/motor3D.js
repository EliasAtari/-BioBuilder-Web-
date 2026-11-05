
"use strict";

const motor3D = (() => {

    let escena = null;
    let camara = null;
    let renderizador = null;
    let observador = null;
    let contenedor = null;
    let raycaster = null;
    let puntero = null;

    const esferasAtomos = new Map();
    const gruposEnlaces = new Map();
    
    const escala = 0.01;
    const radioAtomo = 0.35;

    function iniciar() {

        contenedor = document.getElementById("contenedor-3D");

        if (!contenedor) {
            throw new Error("No se encontro el contenedor 3D.");
        }

        if (typeof THREE === "undefined") {
            throw new Error("Three.js no esta disponible.");
        }

        raycaster = new THREE.Raycaster();
        puntero = new THREE.Vector2();
        
        if (renderizador) {
            ajustarTamaño();
            return;
        }

        escena = new THREE.Scene();
        escena.background = new THREE.Color("#0c1c2b");

        camara = new THREE.PerspectiveCamera(
            60, 1, 0.1, 1000
        );

        camara.position.set(5, 5, 8);
        camara.lookAt(0, 0, 0);

        renderizador = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });

        renderizador.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 1.5)
        );

        renderizador.domElement.style.width = "100%";
        renderizador.domElement.style.height = "100%";
        renderizador.domElement.style.display = "block";

        contenedor.appendChild(renderizador.domElement);
        renderizador.domElement.addEventListener(
            "pointerdown",
            seleccionarAtomo3D
            );

        escena.add(new THREE.AmbientLight(0xffffff, 1.5));

        const luzPrincipal = new THREE.DirectionalLight(
            0xffffff, 2
        );

        luzPrincipal.position.set(5, 8, 5);
        escena.add(luzPrincipal);

        observador = new ResizeObserver(ajustarTamaño);
        observador.observe(contenedor);

        ajustarTamaño();

        sincronizarAtomos();

        console.log("Motor 3D iniciado.");
    }

    function ajustarTamaño() {

        if (!renderizador || !camara || !contenedor) return;

        const ancho = contenedor.clientWidth;
        const alto = contenedor.clientHeight;

        if (ancho <= 0 || alto <= 0) return;

        camara.aspect = ancho / alto;
        camara.updateProjectionMatrix();

        renderizador.setSize(ancho, alto, false);

        renderizar();
    }

    function crearEsfera(atomo) {

        const datos = elementos[atomo.elemento];

        if (!datos) return null;

        const geometria = new THREE.SphereGeometry(
            radioAtomo, 32, 24
        );

        const material = new THREE.MeshStandardMaterial({
            color: datos.color,
            roughness: 0.35,
            metalness: 0.05
        });

        const esfera = new THREE.Mesh(
            geometria,
            material
        );

        esfera.userData.atomoId = atomo.id;

        escena.add(esfera);

        return esfera;
    }

    function posicionarEsfera(esfera, atomo) {
        
    if (typeof camara2D === "undefined" ||
        !camara2D.anchoBase ||
        !camara2D.altoBase) {
        throw new Error(
            "No se han inicializado las dimensiones del mundo molecular."
        );
    }

    const ancho = camara2D.anchoBase;
    const alto = camara2D.altoBase;

    esfera.position.set(
        (atomo.x - ancho / 2) * escala,
        (alto / 2 - atomo.y) * escala,
        (atomo.z || 0) * escala
      );
    }
    
    function limpiarEnlaces3D() {
    for (const grupo of gruposEnlaces.values()) {
        escena.remove(grupo);

        grupo.traverse(objeto => {
            if (objeto.isMesh) {
                objeto.geometry.dispose();
                objeto.material.dispose();
            }
        });
    }

    gruposEnlaces.clear();
}

function crearCilindroEnlace(posicionA, posicionB, desplazamiento) {

    const direccion = new THREE.Vector3()
        .subVectors(posicionB, posicionA);

    const longitud = direccion.length();

    if (longitud === 0) return null;

    direccion.normalize();

    const geometria = new THREE.CylinderGeometry(
        0.055, 0.055, 1, 12
    );

    const material = new THREE.MeshStandardMaterial({
        color: "#b9d5e8",
        roughness: 0.4
    });

    const cilindro = new THREE.Mesh(geometria, material);

    const centro = new THREE.Vector3()
        .addVectors(posicionA, posicionB)
        .multiplyScalar(0.5);

    centro.add(desplazamiento);

    cilindro.position.copy(centro);
    cilindro.scale.y = longitud;

    cilindro.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direccion
    );

    return cilindro;
}

function sincronizarEnlaces() {

    if (!escena || typeof enlaces === "undefined") return;

    limpiarEnlaces3D();

    enlaces.forEach(enlace => {

        const esferaA = esferasAtomos.get(enlace.atomoA);
        const esferaB = esferasAtomos.get(enlace.atomoB);

        if (!esferaA || !esferaB) return;

        const posicionA = esferaA.position.clone();
        const posicionB = esferaB.position.clone();

        const direccion = new THREE.Vector3()
            .subVectors(posicionB, posicionA)
            .normalize();
        
        const referencia = Math.abs(direccion.y) < 0.9
            ? new THREE.Vector3(0, 1, 0)
            : new THREE.Vector3(1, 0, 0);

        const perpendicular = new THREE.Vector3()
            .crossVectors(direccion, referencia)
            .normalize();

        const grupo = new THREE.Group();

        const separacion = 0.13;
        const orden = Math.max(1, Math.min(3, enlace.orden));

        for (let i = 0; i < orden; i++) {

            const desplazamiento =
                (i - (orden - 1) / 2) * separacion;

            const offset = perpendicular.clone()
                .multiplyScalar(desplazamiento);

            const cilindro = crearCilindroEnlace(
                posicionA,
                posicionB,
                offset
            );

            if (cilindro) grupo.add(cilindro);
        }

        escena.add(grupo);

        const clave = [
            Math.min(enlace.atomoA, enlace.atomoB),
            Math.max(enlace.atomoA, enlace.atomoB)
        ].join("-");

        gruposEnlaces.set(clave, grupo);
    });
}
    
    function sincronizarAtomos() {

        if (!escena || typeof atomos === "undefined") return;

        const idsActuales = new Set(
            atomos.map(atomo => atomo.id)
        );

        for (const [id, esfera] of esferasAtomos) {

            if (!idsActuales.has(id)) {

                escena.remove(esfera);

                esfera.geometry.dispose();
                esfera.material.dispose();

                esferasAtomos.delete(id);
            }
        }

        atomos.forEach(atomo => {

            let esfera = esferasAtomos.get(atomo.id);

            if (!esfera) {

                esfera = crearEsfera(atomo);

                if (!esfera) return;

                esferasAtomos.set(atomo.id, esfera);
            }

            posicionarEsfera(esfera, atomo);
        });
        
        sincronizarEnlaces();
        renderizar();
    }

    function renderizar() {

        if (!renderizador || !escena || !camara) return;

        renderizador.render(escena, camara);
    }

    function seleccionarAtomo3D(evento) {

    if (typeof vistaActiva !== "undefined" &&
        vistaActiva !== "3D") return;

    if (!renderizador || !camara) return;

    const rect = renderizador.domElement.getBoundingClientRect();

    puntero.x = (
        (evento.clientX - rect.left) / rect.width
    ) * 2 - 1;

    puntero.y = -(
        (evento.clientY - rect.top) / rect.height
    ) * 2 + 1;

    raycaster.setFromCamera(puntero, camara);

    const intersecciones = raycaster.intersectObjects(
        Array.from(esferasAtomos.values()),
        false
    );

    if (intersecciones.length === 0) return;

    const esferaSeleccionada = intersecciones[0].object;
    const idAtomo = esferaSeleccionada.userData.atomoId;

    if (typeof herramientaActiva === "undefined") return;

    if (herramientaActiva === "enlaces") {
        seleccionarAtomoParaEnlace(idAtomo);
    }

    else if (herramientaActiva === "eliminar") {
        seleccionarAtomoParaEliminar(idAtomo);
    }

    if (typeof actualizarInterfaz === "function") {
        actualizarInterfaz();
    }

    sincronizarAtomos();
    }
    
    return {
        iniciar,
        renderizar,
        ajustarTamaño,
        sincronizarAtomos,
        sincronizarEnlaces,
        seleccionarAtomo3D
    };

})();

window.motor3D = motor3D;

window.iniciarMotor3D = function () {
    motor3D.iniciar();
};

window.actualizarVista3D = function () {
    motor3D.sincronizarAtomos();
};
            
