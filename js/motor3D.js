
"use strict";

const motor3D = (() => {

    let escena = null;
    let camara = null;
    let renderizador = null;
    let observador = null;
    let contenedor = null;

    const esferasAtomos = new Map();

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

        escena.add(new THREE.AmbientLight(0xffffff, 1.5));

        const luzPrincipal = new THREE.DirectionalLight(
            0xffffff, 2
        );

        luzPrincipal.position.set(5, 8, 5);
        escena.add(luzPrincipal);

        escena.add(cuadricula);

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

        const dibujo = document.getElementById(
            "dibujo-plano2D"
        );

        const ancho = dibujo
            ? dibujo.viewBox.baseVal.width
            : 0;

        const alto = dibujo
            ? dibujo.viewBox.baseVal.height
            : 0;

        esfera.position.set(
            (atomo.x - ancho / 2) * escala,
            (alto / 2 - atomo.y) * escala,
            (atomo.z || 0) * escala
        );
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

        renderizar();
    }

    function renderizar() {

        if (!renderizador || !escena || !camara) return;

        renderizador.render(escena, camara);
    }

    return {
        iniciar,
        renderizar,
        ajustarTamaño,
        sincronizarAtomos
    };

})();

window.motor3D = motor3D;

window.iniciarMotor3D = function () {
    motor3D.iniciar();
};

window.actualizarVista3D = function () {
    motor3D.sincronizarAtomos();
};
