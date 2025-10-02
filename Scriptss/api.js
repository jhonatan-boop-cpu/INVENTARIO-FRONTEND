const pathBase = "";

export const API = "https://inventario-backend-oif2.onrender.com/api" + pathBase;

async function req(path, opt = {}) {
    const r = await fetch(API + path, {
        headers: {'Content-Type': 'application/json', ...(opt.headers || {})}, ...opt,
    });
    if(!r.ok){
        const msg = await r.text().catch(() => "");
        throw new Error(msg || `HTTP ${r.status}`);
    }
    const data = await r.json();
    return data;
}

export const api = {
    //Clases
    listarClases: () => req("/clase"),
    crearClase: ( nombre ) => req("/clase", { method: "POST", body: JSON.stringify({ nombre }) }),
    editarClase: (id, nombre) => req(`/clase/${id}`, { method: "PUT", body: JSON.stringify({ nombre }) }),
    eliminarClase: (id) => req(`/clase/${id}`, { method: "DELETE"}),

    //Tipos
    listarTipos: (claseId) => {
    if (claseId) {return req(`/tipo?claseId=${claseId}`);}return req("/tipo");},
    crearTipo: (nombre, claseId) => req("/tipo", {method: "POST", body: JSON.stringify({ nombre, claseId }) }),
    editarTipo: (id, nombre) => req(`/tipo/${id}`, { method: "PUT", body: JSON.stringify({ nombre}) }),
    eliminarTipo: (id) => req(`/tipo/${id}`, {method: "DELETE"}),

    //Componentes
    listarComponentes: () => req("/componentes"),
    crearComponente: (nombre, descripcion, modelo, marca, cantidad, claseId, tipoId) => req("/componente", {method: "POST", body: JSON.stringify({nombre, descripcion, modelo, marca, cantidad, claseId, tipoId}) }),
    editarComponente: (id, datos) => req(`/componente/${id}`, { method: "PUT", body: JSON.stringify(datos) }),
    eliminarComponente: (id) => req(`/componente/${id}`, {method: "DELETE"}), 
    obtenerComponente: (id) => req(`/componente/${id}`),

    //registrar Entrada
    listarEntradas: () => req("/entrada"),
    registrarEntrada: (componenteId, nombre, cantidad, motivo) => req("/entrada", {method: "POST", body: JSON.stringify({componenteId, nombre, cantidad, motivo}) }),
    editarEntrada: (id, datos) => req(`/entrada/${id}`, { method: "PUT", body: JSON.stringify(datos) }),
    eliminarEntrada: (id) => req(`/entrada/${id}`, {method: "DELETE"}), 
    obtenerEntrada: (id) => req(`/entrada/${id}`),


    //registrar Salida
    listarSalidas: () => req("/salida"),
    registrarSalida: (componenteId, cantidad, codigo, motivo, tipodeorden, responsableId, unidadId) => req
    ("/salida", {method: "POST", body: JSON.stringify({componenteId, cantidad, codigo, motivo, tipodeorden, responsableId, unidadId}) }),
    editarSalida: (id, datos) => req(`/salida/${id}`, { method: "PUT", body: JSON.stringify(datos) }),
    eliminarSalida: (id) => req(`/salida/${id}`, {method: "DELETE"}), 
    obtenerSalida: (id) => req(`/salida/${id}`),
        
    //Tecnicos
    listarTecnicos: () => req("/responsable"),
    crearTecnico: (nombre) => req("/responsable", {method: "POST", body: JSON.stringify({nombre}) }),
    editarTecnico: (id, nombre) => req(`/responsable/${id}`, { method: "PUT", body: JSON.stringify({nombre}) }),
    eliminarTecnico: (id) => req(`/responsable/${id}`, {method: "DELETE"}),

    //Unidades
    listarUnidades: () => req("/unidad"),
    crearUnidad: (nombre) => req("/unidad", {method: "POST", body: JSON.stringify({nombre}) }),
    editarUnidad: (id, nombre) => req(`/unidad/${id}`, { method: "PUT", body: JSON.stringify({nombre}) }),
    eliminarUnidad: (id) => req(`/unidad/${id}`, {method: "DELETE"}),

    //Movimientos
    listarMovimientos: () => req("/movimiento"),
    
};

