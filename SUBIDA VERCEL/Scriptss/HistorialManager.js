import { api } from "../Scriptss/api.js";

class HistotrialManager {
    constructor() {
        this.historial = [];
        this.esAdmin = true;
        this.init(); 
    }
    async init() {
        console.log("HistorialManager inicializado");
        await this.cargarHistorial();
        this.mostrarEnUI();
        this.configurarEventListeners();
        console.log("Historial del sistema listo");
    }

    async cargarHistorial() {
        try {
            const historialGuardado = localStorage.getItem('historal_admin');
            this.historial = historialGuardado ? JSON.parse(historialGuardado) : [];
            console.log("Historial cargado:");

            await this.actualizarHistorialDesdeAPI();
        }catch (error) {
            console.error("Error al cargar el historial:", error);
        }
    }   

    async actualizarHistorialDesdeAPI() {
        try {
            console.log("Actualizando historial desde API...");

            const [componentes, entradas, salidas, clases, tipos, tecnicos, unidades] = await Promise.all([
                api.listarComponentes().catch(() => []),
                api.listarEntradas().catch(() => []),
                api.listarSalidas().catch(() => []),
                api.listarClases().catch(() => []),
                api.listarTipos().catch(() => []),
                api.listarTecnicos().catch(() => []),
                api.listarUnidades().catch(() => [])
            ]);
            this.procesarDatosRecientes(componentes, entradas, salidas, clases, tipos, tecnicos, unidades);
        }
        catch (error) {
            console.error("Error al actualizar el historial desde API:", error);
        }
    }

    procesarDatosRecientes(componentes, entradas, salidas, clases, tipos, tecnicos, unidades) {

        const nuevosEventos = [];
        
        componentes.slice(-10).forEach(componente => {
            if (!this.eventoExiste(`componente_${componente.id}`)) {
                nuevosEventos.push({
                    id: `componente_${componente.id}`,
                    tipo: 'nuevo_componente',
                    componente: componente.nombre,
                    cantidad: 1,
                    fecha: componente.createdAt || new Date().toISOString(),
                    descripcion: `Nuevo componente "${componente.nombre}" agregado`,
                    usuario: 'Sistema'
                });
            }
        });

        entradas.slice(-15).forEach(entrada => {
            if (!this.eventoExiste(`entrada_${entrada.id}`)) {
                nuevosEventos.push({
                    id: `entrada_${entrada.id}`,
                    tipo: 'entrada',
                    componente: entrada.componente?.nombre || 'Componente',
                    cantidad: entrada.cantidad,
                    fecha: entrada.createdAt || entrada.fecha || new Date().toISOString(),
                    descripcion: `Entrada de ${entrada.cantidad} ${entrada.componente?.nombre || 'Componente'} registrada`,
                    usuario: entrada.nombre || 'Usuario' 
                });
            }
        });

        salidas.slice(-15).forEach(salida => {
            if (!this.eventoExiste(`salida_${salida.id}`)); {
                nuevosEventos.push({
                    id: `salida_${salida.id}`,
                    tipo: 'salida',
                    componente: salida.componente?.nombre || 'Componente',
                    cantidad: salida.cantidad,
                    fecha: salida.createdAt || salida.fecha || new Date().toISOString(),
                    descripcion: `Salida de ${salida.cantidad} ${salida.componente?.nombre || 'Componente'} procesada`,
                    usuario: 'Sistema' 
                });
            }
        });

        clases.slice(-5).forEach(clase => {
            if (!this.eventoExiste(`clase_${clase.id}`)) {
                nuevosEventos.push({
                    id: `clase_${clase.id}`,
                    tipo: 'nueva_clase',
                    componente: clase.nombre,
                    cantidad: 1,
                    fecha: clase.createdAt || new Date().toISOString(),
                    descripcion: `Nueva clase "${clase.nombre}" agregado`,
                    usuario: 'Sistema'
                });
            }
        });

        tecnicos.slice(-5).forEach(tecnico => {
            if (!this.eventoExiste(`tecnico_${tecnico.id}`)) {
                nuevosEventos.push({
                    id: `tecnico_${tecnico.id}`,
                    tipo: 'nuevo_tecnico',
                    componente: tecnico.nombre,
                    cantidad: 1,
                    fecha: tecnico.createdAt || new Date().toISOString(),
                    descripcion: `Nuevo técnico "${tecnico.nombre}" agregado`,
                    usuario: 'Sistema'
                });
            }
        });

        unidades.slice(-5).forEach(unidad => {
            if (!this.eventoExiste(`unidad_${unidad.id}`)) {
                nuevosEventos.push({
                    id: `unidad_${unidad.id}`,
                    tipo: 'nueva_unidad',
                    componente: unidad.nombre,
                    cantidad: 1,
                    fecha: unidad.createdAt || new Date().toISOString(),
                    descripcion: `Nueva unidad "${unidad.nombre}" agregada`,
                    usuario: 'Sistema'
                });
            }
        });
        
        console.log(`${nuevosEventos.length} nuevos eventos encontrados`);

        this.historial = [...nuevosEventos, ...this.historial]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 100);

        this.guardarLocalStorage();
}
    eventoExiste(id) {
        return this.historial.some(evento => evento.id === id);
    }

    registrarEvento(tipo, datos) {

        const evento = {
            id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            tipo: tipo,
            componente: datos.componente || 'Sistema',
            cantidad: datos.cantidad || 1,
            fecha: new Date().toISOString(),
            descripcion: datos.descripcion,
            usuario: datos.usuario || 'Administrador'
        };
    }    
}
