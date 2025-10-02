import { api } from "../Scriptss/api.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const inputNombreClase = $("#inpNombreClase");   //input nombre de la clase
const contTipos = $("#tiposContainer");          //input nombre del tipo
const btnAddTipo = $("#btnAddTipo");             //btn añanir tipo
const btnGuardar = $("#btnGuardarClaseTipo");    //btn guardar clase 
const clasesContainer = $("#clasesContainer"); //nuevo

function btnAddTipoInput() {                    //funcion añadir tipo
    const wrap = document.createElement("div"); // <div> crea un elemento nuevo
    wrap.className = "tipo-row";                //(class="tipo-row") le asigna el estilo de esa clase al (crear un elemento)
    wrap.innerHTML = `<input class="inpTipo" type="text" placeholder="Tipo"><button type="button">🗑️</button>`;
    wrap.querySelector("button").onclick = () => wrap.remove(); //borrar
    contTipos.appendChild(wrap); 
}
btnAddTipo.addEventListener("click", btnAddTipoInput); //ejecuta la funcion

//LLAMAR CLASE CON TIPOS A LA TABLA 
async function renderListas() {
    const clases = await api.listarClases().catch(() => []);

    clasesContainer.innerHTML = "";
    
    clases.forEach(clase => {
        const div = document.createElement("div");
        div.className = "clase-box";
        div.dataset.id = clase.id; //nuevo

        div.innerHTML = `
        <div class = "clase-header">
            <span class = "clase-nombre">${clase.nombre}</span>
            <button class = "btn-toggle">▼</button>
        </div>

        <button class = "btn-eliminar-clase" data-id = "${clase.id}">🗑️</button>

        <div class = "tipos-lista hidden">
            ${(clase.tipo || []).map(t =>`
                <div class="tipo-row">
                    <span>${t.nombre}</span>
                    <button class = "btn-eliminar-tipo" data-id = "${t.id}">🗑️</button>
                </div>
            `).join("")}

        <div class ="tipo-row">
            <input  class="inpNuevoTipo" type="text" placeholder="Nuevo Tipo">
            <button class="btnaddTipo" data-id="${clase.id}">➕</button>
        </div>
        </div> `;
        clasesContainer.appendChild(div);      
    });
}    

//GUARDAR EN LA BASE DATOS
btnGuardar.addEventListener("click", async () => {
    try {
        const nombreClase = inputNombreClase.value.trim();
        if (!nombreClase) 
            return alert("Escriba el nombre de la clase");

        const nuevaClase = await api.crearClase(nombreClase);
        
        //relacionar tipos con la clase

        const tipos = $$(".inpTipo").map(el => el.value.trim()).filter(Boolean);
        for (const nombre of tipos) {
            await api.crearTipo(nombre, nuevaClase.id);
        }
        alert("Clase y Tipos guardados");

        inputNombreClase.value = "";
        $$(".inpTipo").forEach((el, i) => {
            if (i === 0) el.value = ""; else el.closest(".tipo-row")?.remove();          
        });

        renderListas();
    } catch (e) {
        alert("Error: " + e.message);
    }
});

// Delegación de eventos: eliminar y añadir tipo dentro de la lista
clasesContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-eliminar-clase")) {
        const id = e.target.dataset.id;
        if (confirm("¿Eliminar clase?")) {
        await api.eliminarClase(id);
        renderListas();
        }
    }
    if (e.target.classList.contains("btn-eliminar-tipo")) {
        const id = e.target.dataset.id;
        console.log("eliminando tipo con id:",id);
        if (confirm("¿Eliminar tipo?")) {
        await api.eliminarTipo(id);
        renderListas();
        }
    }
    if (e.target.classList.contains("btnaddTipo")) {
        const claseId = e.target.dataset.id;
        const input = e.target.previousElementSibling;
        const nombre = input.value.trim();
        if (!nombre) return;
        await api.crearTipo(nombre, claseId);
        renderListas();
    }
    if (e.target.classList.contains("btn-toggle") || e.target.classList.contains("clase-nombre")){
        const claseBox = e.target.closest(".clase-box");
        const lista = claseBox.querySelector(".tipos-lista");
        const btn = claseBox.querySelector(".btn-toggle");

        lista.classList.toggle("hidden");
        btn.textContent = lista.classList.contains("hidden") ? "▼" : "▲";
    }
});
renderListas();









/*
async function renderListas() {  //llama al backend para obtener todas las clases y tipos de la bd.
    const clases = await api.listarClases().catch(() => []);   //(catch(() => []) si hay un error devulve array vacio
    const tipos = await api.listarTipos().catch(() => []);

    const listaClases = Array.isArray(clases) ? clases : [];  
    const listaTipos = Array.isArray(tipos) ? tipos : [];


    const h4 = document.querySelector("h4");  //(h4.innerHTML) ==> como se vera en la tabla
    h4.innerHTML = ` 
        <h4>Clase y Tipo Registrados</h4> 
        <div class="grid-listas">
            <div><h5>Clases</h5><ul>${listaClases.map(c => `<li>${c.nombre}</li>`).join("")}</ul></div>
            <div><h5>Tipos</h5><ul>${listaTipos.map(t => `<li>${t.nombre}</li>`).join("")}</ul></div>
        </div>`;
}

btnGuardar.addEventListener("click", async () => {
    try {
        const nombreClase = (inputNombreClase.value || "").trim();
        if (!nombreClase) 
            return alert("Escriba el nombre de la clase");
        await api.crearClase(nombreClase);

        const tipos = $$(".inpTipo").map(el => (el.value || "").trim()).filter(Boolean);
        for (const nombre of tipos) 
            await api.crearTipo(nombre);

        alert("Clase y Tipos guardados");
        inputNombreClase.value = "";
        $$(".inpTipo").forEach((el, i) => {
            if (i === 0) el.value = ""; else el.closest(".tipo-row")?.remove();
        });

        renderListas();
    } catch (e) {
        alert("Error: " + e.message);
    }
});

renderListas();*/
