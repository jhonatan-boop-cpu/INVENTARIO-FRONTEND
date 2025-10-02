//CREAR COMPONENTE
//Abrir modal
window.abrirModal = function(){
    document.getElementById('mimodal').style.display = 'flex';
}
//Cerrar modal
window.cerrarModal = function(){
    document.getElementById('mimodal').style.display = 'none'; 
}
window.abrirModalE = function(){
    document.getElementById('mimodalE').style.display = 'flex';
};
//Cerrar modal
window.cerrarModalE = function(){
    document.getElementById('mimodalE').style.display = 'none'; 
};

import { api } from "../Scriptss/api.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const inputNombre = $("#nombre");
const inputDescripcion = $("#descripcion");
const inputModelo = $("#modelo");
const inputMarca = $("#marca");
const inputCantidad = $("#cantidad");
const selectClase = $("#clase");
const selectTipo = $("#tipo");
const btnGuardar = $("#guardarComponente");
const datosTabla = $("#datostabla");

const inputNombreE = $("#nombreE");
const inputDescripcionE = $("#descripcionE");
const inputModeloE = $("#modeloE");
const inputMarcaE = $("#marcaE");
const inputCantidadE = $("#cantidadE");
const btnGuardarE = $("#guardarCambiosE");

let componentesId = null;
    
//LLAMAR CLASES Y TIPOS
async function cargarClasesTipos() {
        const clases = await api.listarClases().catch(() => []);

        selectClase.innerHTML = `<option disabled selected>seleccione una clase</option>`+
        clases.map(c => `<option value = "${c.id}">${c.nombre}</option>`).join("");   //value = "${c.id} ==> envia por id a la bd tal como lo pide el backend

        selectTipo.innerHTML = `<option disabled selected>seleccione un tipo</option>`;
    }
selectClase?.addEventListener("change", async () => {
    const claseId = selectClase.value;
    if (!claseId) return;

    const tipos = await api.listarTipos(claseId).catch(() => []);
    selectTipo.innerHTML = `<option disabled selected>seleccione un tipo</option>`+
    tipos.map(t => `<option value = "${t.id}">${t.nombre}</option>`).join("");
});

//tabla componentes    
async function cargarTabla() {
    const componentes = await api.listarComponentes().catch(() => []);
    datosTabla.innerHTML = componentes.map(c => `
        <tr onclick = "window.location.href='detalleComponente.html?id=${c.id}'" style="cursor: pointer;">
            <td>${c.nombre}</td>
            <td>${c.codigo}</td>
            <td>${c.cantidad}</td>
            <td>${c.modelo}</td>
            <td>
                <button onclick= "event.stopPropagation(); editarComponente(${c.id})">✏️</button>  
                <button onclick= "event.stopPropagation(); eliminarComponente(${c.id})">🗑️</button>
            </td>
        </tr>
    `).join("");
    }

//crear componente     
btnGuardar?.addEventListener("click", async () => {
    try {
        const nombre = (inputNombre.value || "").trim();
        const descripcion = (inputDescripcion.value || "").trim();
        const modelo = (inputModelo.value || "").trim();
        const marca = (inputMarca.value || "").trim();
        const cantidad = (inputCantidad.value || "").trim();
        const claseId = selectClase.value;
        const tipoId = selectTipo.value;

        if (!nombre || !descripcion || !modelo || !marca || !cantidad || !claseId || !tipoId){
            return alert("Todos los campos son obligatorios");
        }

        await api.crearComponente(nombre, descripcion, modelo, marca, cantidad, claseId, tipoId);
        alert("Componente guardado");

        //limpiar modal
        inputNombre.value = "";
        inputDescripcion.value = "";
        inputModelo.value = "";
        inputMarca.value = "";
        inputCantidad.value = "";
        selectClase.value = 0;
        selectTipo.value = 0;
        
        cerrarModal();
        cargarTabla();
    } catch (e) {
        alert("Error: " + e.message);
    }
});
cargarTabla();
cargarClasesTipos();


//ELIMINAR COMPONENTE
window.eliminarComponente = async function(id){
    if (!confirm("Seguro que desea eliminar el componente?")) return;
    await api.eliminarComponente(id);
    alert("Componente eliminado");
    cargarTabla();
};

//EDITAR COMPONENTE
window.editarComponente = async function(id){
    componentesId = id;
    const componente = await api.listarComponentes();
    const comp = componente.find((c) => c.id === id);

    inputNombreE.value = comp.nombre;
    inputDescripcionE.value = comp.descripcion; 
    inputModeloE.value = comp.modelo;
    inputMarcaE.value = comp.marca;
    inputCantidadE.value = comp.cantidad;

    abrirModalE();
};

btnGuardarE?.addEventListener("click", async () => {    //(?) ==> solo ejecuta si en la pagina lo requiere
    const nombre = (inputNombreE.value || "").trim();
    const descripcion = (inputDescripcionE.value || "").trim();
    const modelo = (inputModeloE.value || "").trim();
    const marca = (inputMarcaE.value || "").trim();
    const cantidad = (inputCantidadE.value || "").trim();

    await api.editarComponente(componentesId, {nombre, descripcion, modelo, marca, cantidad});
    componentesId = null;

    cargarTabla();
    cerrarModalE();
    alert("Componente editado exitosamente");

});

//DETALLE DEL COMPONENTE
const detalleCodigo = $("#detalleCodigo");
const detalleNombre = $("#detalleNombre");
const detalleClase = $("#detalleClase");
const detalleTipo = $("#detalleTipo");
const detalleModelo = $("#detalleModelo");
const detalleMarca = $("#detalleMarca");
const detalleCantidad = $("#detalleCantidad");
const detalleDescripcion = $("#detalleDescripcion");

// Obtener id de la URL (?id=123)
const params = new URLSearchParams(window.location.search);
const componenteId = params.get("id");

// Solo ejecutar si existe el elemento y hay id
if (detalleCodigo && componenteId) {
    cargarDetalle(componenteId);
}

async function cargarDetalle(id) {
    try {
        const componente = await api.obtenerComponente(id);

        if (!componente) return alert("Componente no encontrado");

        const claseNombre = componente.clase?.nombre || "";
        const tipoNombre = componente.tipo?.nombre || "";

        detalleCodigo.textContent = componente.codigo || "";
        detalleNombre.textContent = componente.nombre || "";
        detalleClase.textContent = claseNombre;
        detalleTipo.textContent = tipoNombre;
        detalleModelo.textContent = componente.modelo || "";
        detalleMarca.textContent = componente.marca || "";
        detalleCantidad.textContent = componente.cantidad || "";
        detalleDescripcion.value = componente.descripcion || "";

    } catch (e) {
        alert("Error cargando detalle: " + e.message);
        console.error(e);
    }
    cargarHistorial(id);
}

function Fecha(raw) {
    if (!raw) return "-";
    const d = new Date(raw);
    if (isNaN(d)) return String(raw);
    return d.toLocaleString("es-ES", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

async function cargarHistorial(id) {
    
    const detalleHistorial = $("#detalleHistorial");
    if (!detalleHistorial) 
        return;
    try {
        const entradas = await api.listarEntradas().catch(() => []);
        const salidas = await api.listarSalidas().catch(() => []);

        const entradasComp = entradas.filter(e => e.componenteId == id)
            .map(e => {
                const fechaRaw = e.fecha || e.createdAt || null;
                return {
                fechaRaw,
                fecha: Fecha(fechaRaw),
                tipo: "Entrada",
                cantidad: e.cantidad,
                persona: e.nombre || "-",
                unidadProceso: "-",
                ordenTrabajo: "-",
                motivo: e.motivo || ""
                };
            });
        
        const salidasComp = salidas.filter(s => s.componenteId == id)
            .map(s => {
                const fechaRaw = s.fecha || s.createdAt || null;
                return {
                fechaRaw,
                fecha: Fecha(fechaRaw),
                tipo: "Salida",
                cantidad: s.cantidad,
                persona: s.responsable?.nombre || "-",
                unidadProceso: s.unidad?.nombre || "-",
                ordenTrabajo: s.tipodeorden || "-",
                motivo: s.motivo || ""
                }
            });

        const historial = [...entradasComp, ...salidasComp].sort((a, b) => new Date(b.fechaRaw) - new Date(a.fechaRaw));

        detalleHistorial.innerHTML = historial.map(h => `
            <tr>
                <td>${h.fecha}</td>
                <td>${h.tipo}</td>
                <td>${h.cantidad}</td>
                <td>${h.persona}</td>
                <td>${h.unidadProceso}</td>
                <td>${h.ordenTrabajo}</td>
                <td>${h.motivo}</td>
            </tr>
        `).join("");
    } catch (e) {
        alert("Error cargando historial: " + e.message);
        console.error("Error cargando historial: ", e);
        detalleHistorial.innerHTML = `<tr><td colspan="7">No hay historial</td></tr>`
    }
}