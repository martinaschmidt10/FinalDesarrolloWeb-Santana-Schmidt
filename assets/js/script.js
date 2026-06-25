/* ===========================================================
   TeamUP! — script.js
   JS bien básico para arrancar: cada bloque está comentado
   para que puedas explicar qué hace cada parte.
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------------------
     1. AÑO DINÁMICO EN EL FOOTER
     En vez de escribir "2026" a mano en el HTML (y tener que
     acordarte de cambiarlo el año que viene), lo calculamos
     con JS y lo insertamos en el <span id="anioActual">.
  ----------------------------------------------------------- */
  var spanAnio = document.getElementById('anioActual');
  if (spanAnio) {
    spanAnio.textContent = new Date().getFullYear();
  }


  /* -----------------------------------------------------------
     2. SOMBRA EN EL HEADER AL HACER SCROLL
     Manipulación del DOM + manejo de eventos: escuchamos el
     evento "scroll" de la ventana, y le agregamos/quitamos una
     clase CSS al header según si bajaste más de 40px o no.
  ----------------------------------------------------------- */
  var header = document.querySelector('.site-header');

  function actualizarHeader() {
    if (window.scrollY > 40) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  }

  window.addEventListener('scroll', actualizarHeader);


  /* -----------------------------------------------------------
     3. CERRAR EL MENÚ MOBILE AL TOCAR UN LINK
     Por defecto, el menú hamburguesa de Bootstrap se queda
     abierto después de tocar un link. Esto mejora la experiencia
     en celular: apenas elegís una sección, el menú se cierra solo.
  ----------------------------------------------------------- */
  var menu = document.getElementById('navMenu');
  var linksDelMenu = menu ? menu.querySelectorAll('.nav-link, .btn') : [];

  linksDelMenu.forEach(function (link) {
    link.addEventListener('click', function () {
      // Usamos el componente Collapse de Bootstrap para cerrarlo
      var bsCollapse = bootstrap.Collapse.getOrCreateInstance(menu);
      bsCollapse.hide();
    });
  });

});
