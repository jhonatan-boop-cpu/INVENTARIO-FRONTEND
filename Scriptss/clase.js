import { api } from "../Scriptss/api.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const inputNombreClase = document.querySelector('input[placeholder= "Nombre de la Clase"]');
const contTipos = document.querySelector(".btnborrar");
const btnAddTipo = $$(".btnag button")[0];
const btnGuardar = $$(".btnag button")[1];

function btnAddTipoInput() {
    const wrap = document.createElement("div");
    wrap.className = "btnborrar";
    wrap.innerHTML = `<input type="text" placeholder="Tipo"><button type="button">🗑️</button>`;
    wrap.querySelector("button").onclick = () => wrap.remove();
    contTipos.parentElement.insertBefore(wrap, document.querySelector(".btnag"));
}

btnAddTipo.addEventListener("click", btnAddTipoInput);

async function renderListas() {
    const clases = await api.listarClases().catch(() => []);
    const tipos = await api.listarTipos().catch(() => []);

    console.log("trae=>", clases);

    const listarClases = Array.isArray(clases) ? clases : [];
    const listarTipos = Array.isArray(tipos) ? tipos : [];

    const h4 = document.querySelector("h4");
    h4.outerHTML = `<h4>Clase y Tipo Registrados</h4>
    <div class ="grid-listas">
    <div><h5>Clases</h5><ul>${listarClases.map(c => `<li>${c.nombre}</li>`).join("")}</ul></div>
    <div><h5>Tipos</h5><ul>${listarTipos.map(t => `<li>${t.nombre}</li>`).join("")}</ul></div></div>`
}

btnGuardar.addEventListener("click", async () => {
    try {
        const nombreClase = (inputNombreClase.value || "").trim();
        if (!nombreClase) return alert("Escriba el nombre de la clase");
        await api.crearClase(nombreClase);

        const tipos = $$('input[placeholder="Tipo"], input[placeholder="Tipo 1"]')
            .map(el => (el.value || "").trim()).filter(Boolean);

        for (const nombre of tipos) await api.crearTipo(nombre);

        alert("Clase y Tipos guardados");
        inputNombreClase.value = "";
        $$('input[placeholder="Tipo"], input[placeholder="Tipo 1"]').forEach((el, i) => {
            if (i === 0) el.value = ""; else el.closest(".btnborrar")?.remove();
        });

        renderListas();

    } catch (e) {
        alert("Error: " + e.message);
    }
});

renderListas();