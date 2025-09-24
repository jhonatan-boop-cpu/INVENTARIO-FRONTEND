//ABRIRMODAL
function abrirModal(){
    document.getElementById('mimodal').style.display = 'flex';
}

//CERRARMODAL
function cerrarModal(){
    document.getElementById('mimodal').style.display = 'none'; 
}

//CARGAR DATOS EN LA TABLA
const datostabla = document.getElementById('datostabla');
const btnguardar = document.getElementById('Guardarmodal');

btnguardar.addEventListener('click', () => {
    
    const nombre = document.getElementById('nombre').value;
    const cantidad = document.getElementById('cantidad').value;
    const modelo = document.getElementById('modelo').value;
    
if  (!nombre ||  !cantidad || !modelo){
    return
}    
const row = document.createElement('tr');
row.innerHTML = `
    <td></td>
    <td>${nombre}</td>
    <td></td>
    <td>${cantidad}</td>
    <td>${modelo}</td>
    <td></td>
`;

datostabla.appendChild(row);
cerrarModal();
clearForm();
})
    // Limpiar formulario
    function clearForm() {
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('clase').selectedIndex = 0;
    document.getElementById('tipo').selectedIndex = 0;
    document.getElementById('modelo').value = '';
    document.getElementById('marca').value = '';
    document.getElementById('cantidad').value = '';
    }
