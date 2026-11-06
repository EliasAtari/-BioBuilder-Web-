
"use strict";

const ajustesBioBuilder = (() => {

    const botonAjustes = document.getElementById("ajustes");
    const botonVolver = document.getElementById("volver-constructor");

    const barraLateral = document.querySelector(".barra-lateral");
    const areaConstruccion = document.querySelector(".area-construccion");
    const panelAjustes = document.getElementById("panel-ajustes");

    const botonesCategorias = document.querySelectorAll(".categoria-ajustes");
    const secciones = document.querySelectorAll(".seccion-ajustes");

    const selectorHidrogenos = document.getElementById("hidrogenos-pequenos");
    const selectorGraficos = document.getElementById("calidad-grafica");
    const botonBienvenida = document.getElementById("ver-bienvenida");

    function abrirAjustes() {

        barraLateral.hidden = true;
        areaConstruccion.hidden = true;
        panelAjustes.hidden = false;

    }

    function cerrarAjustes() {

        panelAjustes.hidden = true;
        barraLateral.hidden = false;
        areaConstruccion.hidden = false;

    }

    function cambiarCategoria(categoria) {

        botonesCategorias.forEach(boton => {

            const activa =
                boton.dataset.categoria === categoria;

            boton.classList.toggle("activo", activa);

        });

        secciones.forEach(seccion => {

            const activa =
                seccion.dataset.seccion === categoria;

            seccion.hidden = !activa;
            seccion.classList.toggle("activa", activa);

        });

    }

    function cargarPreferencias() {

        const hidrogenos =
            localStorage.getItem("bb_hidrogenos") || "si";

        const graficos =
            localStorage.getItem("bb_graficos") || "estandar";

        selectorHidrogenos.value = hidrogenos;
        selectorGraficos.value = graficos;

    }

    function guardarHidrogenos() {

        localStorage.setItem(
            "bb_hidrogenos",
            selectorHidrogenos.value
        );

        window.dispatchEvent(
            new CustomEvent("biobuilder:ajuste-visual", {
                detail: {
                    ajuste: "hidrogenos",
                    valor: selectorHidrogenos.value
                }
            })
        );

    }

    function guardarGraficos() {

        localStorage.setItem(
            "bb_graficos",
            selectorGraficos.value
        );

        window.dispatchEvent(
            new CustomEvent("biobuilder:ajuste-visual", {
                detail: {
                    ajuste: "graficos",
                    valor: selectorGraficos.value
                }
            })
        );

    }

    function mostrarBienvenida() {

        window.dispatchEvent(
            new CustomEvent("biobuilder:mostrar-bienvenida")
        );

    }

    function iniciar() {

        botonAjustes.addEventListener("click", abrirAjustes);

        botonVolver.addEventListener("click", cerrarAjustes);

        botonesCategorias.forEach(boton => {

            boton.addEventListener("click", () => {
                cambiarCategoria(boton.dataset.categoria);
            });

        });

        selectorHidrogenos.addEventListener(
            "change",
            guardarHidrogenos
        );

        selectorGraficos.addEventListener(
            "change",
            guardarGraficos
        );

        botonBienvenida.addEventListener(
            "click",
            mostrarBienvenida
        );

        cargarPreferencias();

    }

    iniciar();

    return {
        abrirAjustes,
        cerrarAjustes,
        cambiarCategoria
    };

})();
      
