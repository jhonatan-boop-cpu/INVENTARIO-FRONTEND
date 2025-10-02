/*FUNCION BOTON HAMBURGUESA*/ 
const btn = document.getElementById("menuBtn");
  const menu = document.querySelector(".fondo_menu");

  btn.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
  