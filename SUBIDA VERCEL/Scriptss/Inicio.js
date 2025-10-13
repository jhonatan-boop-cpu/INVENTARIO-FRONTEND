import { api } from "../Scriptss/api.js";

class DashboardData {
    constructor() {
        this.init();
    }

    init() {
        this.loadRealTimeData();
        // Actualizar datos cada 5 segundos
        setInterval(() => this.loadRealTimeData(), 5000);
    }

    async loadRealTimeData() {
        try {
            await Promise.all([
                this.loadTotalComponentes(),
                this.loadTotalMovimientos(),
                this.loadEntradasHoy(),
                this.loadSalidasHoy()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
            this.showFallbackData();
        }
    }

    // 1. Total de Componentes
    async loadTotalComponentes() {
        try {
            const componentes = await api.listarComponentes();
            const totalComponentes = componentes.length;
            
            this.updateStatCard('total-componentes', totalComponentes);
            this.updateTrendText('.stat-card:nth-child(1) .stat-trend', 'Total de componentes en inventario');
        } catch (error) {
            console.error('Error cargando total componentes:', error);
            this.showError('total-componentes', 'Error');
        }
    }

    // 2. Total de Movimientos 
    async loadTotalMovimientos() {
        try {
            const [entradas, salidas] = await Promise.all([
                api.listarEntradas(),
                api.listarSalidas()
            ]);
            
            const totalMovimientos = entradas.length + salidas.length;
            
            this.updateStatCard('total-movimientos', totalMovimientos);
            this.updateTrendText('.stat-card:nth-child(2) .stat-trend', 'Total historial de movimientos');
        } catch (error) {
            console.error('Error cargando movimientos:', error);
            this.showError('total-movimientos', 'Error');
        }
    }

    // 3. Entradas de hoy
    async loadEntradasHoy() {
        try {
            const entradas = await api.listarEntradas();
            const hoy = new Date().toISOString().split('T')[0];
            
            const entradasHoy = entradas.filter(entrada => {
                const fechaEntrada = new Date(entrada.createdAt || entrada.fecha).toISOString().split('T')[0];
                return fechaEntrada === hoy;
            }).length;
            
            this.updateStatCard('entradas-hoy', entradasHoy);
            this.updateTrendText('.stat-card:nth-child(3) .stat-trend', 'Entradas registradas hoy');
        } catch (error) {
            console.error('Error cargando entradas hoy:', error);
            this.showError('entradas-hoy', 'Error');
        }
    }

    // 4. Salidas de hoy
    async loadSalidasHoy() {
        try {
            const salidas = await api.listarSalidas();
            const hoy = new Date().toISOString().split('T')[0];
            
            const salidasHoy = salidas.filter(salida => {
                const fechaSalida = new Date(salida.createdAt || salida.fecha).toISOString().split('T')[0];
                return fechaSalida === hoy;
            }).length;
            
            this.updateStatCard('salidas-hoy', salidasHoy);
            this.updateTrendText('.stat-card:nth-child(4) .stat-trend', 'Salidas registradas hoy');
        } catch (error) {
            console.error('Error cargando salidas hoy:', error);
            this.showError('salidas-hoy', 'Error');
        }
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
            if (currentValue !== value) {
                this.animateValue(element, currentValue, value, 1000);
            }
        }
    }

    updateTrendText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
            // Remover clases de tendencia si existen
            element.classList.remove('up', 'down');
        }
    }

    animateValue(element, start, end, duration) {
        if (start === end) return;
        
        const range = end - start;
        const startTime = performance.now();
        
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para animación suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(start + (range * easeOutQuart));
            
            element.textContent = this.formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = this.formatNumber(end);
            }
        };
        
        requestAnimationFrame(updateValue);
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.color = '#e74c3c';
        }
    }

    showFallbackData() {
        console.log('Mostrando datos de respaldo...');
        // Puedes mostrar datos por defecto aquí si es necesario
    }

    // Método para forzar actualización manual
    refreshData() {
        this.loadRealTimeData();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new DashboardData();
    
    // Exponer globalmente para poder llamar desde la consola
    window.dashboard = dashboard;
    
    console.log('Dashboard de Inventario ABD inicializado');
});

// También puedes agregar eventos para actualizaciones manuales
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        if (window.dashboard) {
            window.dashboard.refreshData();
            console.log('Datos actualizados manualmente');
        }
    }
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});