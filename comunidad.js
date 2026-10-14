
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-opinion");
    const estrellas = document.querySelectorAll(".estrella");
    const textoCalificacion = document.getElementById("texto-calificacion");
    const campoOpinion = document.getElementById("opinion-texto");
    const contador = document.getElementById("contador-opinion");
    const confirmarAnonimato = document.getElementById("confirmar-anonimato");
    const listaOpiniones = document.getElementById("lista-opiniones");
    const opinionesVacias = document.getElementById("opiniones-vacias");
    const mensaje = document.getElementById("mensaje-opinion");

    const totalOpiniones = document.getElementById("total-opiniones");
    const promedioEstrellas = document.getElementById("promedio-estrellas");

    let calificacionSeleccionada = 0;
    const opiniones = [];

    const mensajesEstrellas = {
        0: "Sin estrellas: puedes dejar tu opinión sin calificación ♡",
        1: "Gracias por tu sinceridad. Queremos seguir mejorando ♡",
        2: "Gracias por compartir tu experiencia con nosotras ♡",
        3: "¡Gracias por ayudarnos a crecer! 🌷",
        4: "¡Qué alegría! Gracias por compartir tu experiencia 💗",
        5: "¡Cinco estrellas de ternura! Gracias por tu cariño 🎀"
    };

    function actualizarEstrellas(valor) {
        calificacionSeleccionada = valor;

        estrellas.forEach((estrella) => {
            const numero = Number(estrella.dataset.valor);
            const seleccionada = numero === valor;

            estrella.classList.toggle("seleccionada", seleccionada);
            estrella.setAttribute(
                "aria-pressed",
                seleccionada ? "true" : "false"
            );

            if (numero > 0) {
                estrella.textContent = numero <= valor ? "★" : "☆";
            }
        });

        textoCalificacion.textContent = mensajesEstrellas[valor];
    }

    estrellas.forEach((estrella) => {
        estrella.addEventListener("click", () => {
            actualizarEstrellas(Number(estrella.dataset.valor));
        });
    });

    campoOpinion.addEventListener("input", () => {
        contador.textContent = `${campoOpinion.value.length}/500`;
    });

    function actualizarResumen() {
        totalOpiniones.textContent = opiniones.length;

        if (opiniones.length === 0) {
            promedioEstrellas.textContent = "—";
            return;
        }

        const suma = opiniones.reduce(
            (total, opinion) => total + opinion.calificacion,
            0
        );

        const promedio = suma / opiniones.length;
        promedioEstrellas.textContent = promedio.toFixed(1);
    }

    function crearTarjetaOpinion(opinion) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-opinion";

        const encabezado = document.createElement("div");
        encabezado.className = "opinion-anonima";

        const gatito = document.createElement("span");
        gatito.textContent = "🐱";

        const nombre = document.createElement("span");
        nombre.textContent = "Estudiante anónimo";

        encabezado.append(gatito, nombre);

        const calificacion = document.createElement("div");
        calificacion.className = "opinion-estrellas";

        if (opinion.calificacion === 0) {
            calificacion.classList.add("opinion-sin-estrellas");
            calificacion.textContent = "Sin calificación ★";
        } else {
            calificacion.textContent =
                "★".repeat(opinion.calificacion) +
                "☆".repeat(5 - opinion.calificacion);

            calificacion.setAttribute(
                "aria-label",
                `${opinion.calificacion} de 5 estrellas`
            );
        }

        const contenido = document.createElement("p");
        contenido.className = "opinion-contenido";

        // textContent evita interpretar la opinión como código HTML.
        contenido.textContent = opinion.texto;

        tarjeta.append(encabezado, calificacion, contenido);

        return tarjeta;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const texto = campoOpinion.value.trim();

        if (!texto) {
            mensaje.textContent = "Escribe tu opinión antes de publicarla ♡";
            return;
        }

        if (!confirmarAnonimato.checked) {
            mensaje.textContent =
                "Confirma que tu opinión no contiene datos personales 🎀";
            return;
        }

        if (texto.length > 500) {
            mensaje.textContent = "Tu opinión debe tener hasta 500 caracteres.";
            return;
        }

        const opinion = {
            texto,
            calificacion: calificacionSeleccionada
        };

        opiniones.unshift(opinion);

        opinionesVacias.hidden = true;
        listaOpiniones.prepend(crearTarjetaOpinion(opinion));

        actualizarResumen();

        formulario.reset();
        contador.textContent = "0/500";
        actualizarEstrellas(0);

        mensaje.textContent =
            "¡Tu opinión se agregó al mural de esta sesión! Gracias por participar ♡";
    });

    actualizarEstrellas(0);
    actualizarResumen();
});
