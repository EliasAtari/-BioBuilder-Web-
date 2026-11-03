
"use strict";

const motor3D = (() => {

    let escena = null;
    let camara = null;
    let renderizador = null;
    let animacionActiva = false;
    let observador = null;

    let contenedor = null;

function iniciar() {

  contenedor = document.getElementById("contenedor-3D");

  if (!contenedor) {
    throw new Error("No se encontro el contenedor del espacio 3D");
  }

  if (typeof THREE === "undefined") {
    throw new Error("Three.js no esta disponible");
  }

  if (renderizador)
    return;

        escena = new THREE.Scene();
        escena.background = new THREE.Color("#0c1c2b");
  
        camara = new THREE.PerspectiveCamera(
           60,
           1,
           0.1,
           1000
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

        const luzAmbiente = new THREE.AmbientLight(
            0xffffff,
            1.5
        );

        escena.add(luzAmbiente);

        const luzPrincipal = new THREE.DirectionalLight(
            0xffffff,
            2
        );

        luzPrincipal.position.set(5, 8, 5);
        escena.add(luzPrincipal);

        const cuadricula = new THREE.GridHelper(
            20,
            20,
            0x00c8f0,
            0x29435a
        );

        escena.add(cuadricula);

        observador = new sizeObserver(ajustarTamaño);
        observador.observe(contenedor);

        ajustarTamaño();

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

    function renderizar() {

        if (!renderizador || !escena || !camara) return;

        renderizador.render(escena, camara);
    }

    function iniciarAnimacion() {

        if (animacionActiva) return;

        animacionActiva = true;

        function actualizar() {

            if (!animacionActiva) return;

            renderizar();

            requestAnimationFrame(actualizar);
        }

        actualizar();
    }

    function detenerAnimacion() {
        animacionActiva = false;
        renderizar();
    }

    return {
        iniciar,
        renderizar,
        ajustarTamaño,
        iniciarAnimacion,
        detenerAnimacion
    };

})();

window.motor3D = motor3D;

window.iniciarMotor3D = function () {
    motor3D.iniciar();
};

window.actualizarVista3D = function () {
    motor3D.renderizar();
};
