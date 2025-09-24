const pathBase = "";

export const API = "http://localhost:3000/api" + pathBase;

async function req(path, opt = {}) {
    const r = await fetch(API + path, {
        headers: {'Content-Type': 'application/json', ...(opt.headers || {})}, ...opt,
    });
    if(!r.ok){
        const msg = await r.text().catch(() => "");
        throw new Error(msg || `HTTP ${r.status}`);
    }
    const data = await r.json;
    return data;
}

export const api = {
    //Clases
    listarClases: () => req("/clase"),
    crearClase: ( nombre ) => req("/clase", { method: "POST", body: JSON.stringify({ nombre }) }),
    editarClase: (id, nombre) => req(`/clase/${id}`, { method: "PUT", body: JSON.stringify({ nombre }) }),
    eliminarClase: (id) => req(`/clase/${id}`, { method: "DELETE"}),

    //Tipos
    listarTipos: () => req("/tipo"),
    crearTipo: (nombre) => req("/tipo", {method: "POST", body: JSON.stringify({ nombre }) }),
    editarTipo: (id, nombre) => req(`/tipo/${id}`, { mothod: "PUT", body: JSON.stringify({ nombre}) }),
    eliminarTipo: (id) => req(`/tipo/${id}`, {method: "DELETE"}),

    //Componentes
    listarComponentes: () => req("/componentes"),
    crearComponente: (nombre, descripcion, modelo, marca, cantidad, codigo, claseId, tipoId) => req("/componente", {method: "POST", body: JSON.stringify({nombre, descripcion, modelo, marca, cantidad, codigo, claseId, tipoId}) }),
    editarComponente: (id, nombre, descripcion, modelo, marca, cantidad, codigo, claseId, tipoId) => req(`/componente/${id}`, { method: "PUT", body: JSON.stringify({ nombre, descripcion, modelo, marca, cantidad, codigo, claseId, tipoId }) }),
    eliminarComponente: (id) => req(`/componente/${id}`, {method: "DELETE"}), 
};

