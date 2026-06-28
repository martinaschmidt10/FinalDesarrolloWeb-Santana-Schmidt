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

  // Esta página puede no tener header de sitio (ej. Login/Registro),
  // así que solo escuchamos el scroll si el header existe.
  if (header) {
    function actualizarHeader() {
      if (window.scrollY > 40) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    }
    window.addEventListener('scroll', actualizarHeader);
  }


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


  /* -----------------------------------------------------------
     4. MOSTRAR / OCULTAR CONTRASEÑA (página de Login)
     Cambiamos el atributo "type" del input entre "password" y
     "text", y el ícono del ojito para que el usuario sepa en
     qué estado está.
  ----------------------------------------------------------- */
  var botonOjo = document.getElementById('togglePassword');
  var inputClave = document.getElementById('accessKey');

  if (botonOjo && inputClave) {
    botonOjo.addEventListener('click', function () {
      var visible = inputClave.type === 'text';
      inputClave.type = visible ? 'password' : 'text';
      botonOjo.textContent = visible ? '👁' : '🙈';
    });
  }


  /* -----------------------------------------------------------
     5. VALIDACIÓN DEL FORMULARIO DE LOGIN
  ----------------------------------------------------------- */
  var formLogin = document.getElementById('formLogin');

  if (formLogin) {
    formLogin.addEventListener('submit', function (evento) {
      evento.preventDefault(); // evitamos que la página recargue

      var idInput = document.getElementById('playerId');
      var claveInput = document.getElementById('accessKey');
      var feedback = document.getElementById('loginFeedback');
      var formValido = true;

      // Player ID no puede estar vacío
      if (idInput.value.trim() === '') {
        marcarError(idInput, 'playerIdError');
        formValido = false;
      } else {
        marcarValido(idInput, 'playerIdError');
      }

      // Access Key no puede estar vacía
      if (claveInput.value.trim() === '') {
        marcarError(claveInput, 'accessKeyError');
        formValido = false;
      } else {
        marcarValido(claveInput, 'accessKeyError');
      }

      if (formValido) {
        mostrarFeedback(feedback, 'success', '✓ Credenciales válidas. Bienvenido de nuevo, comandante.');
        // Esperamos un toque para que se llegue a leer el mensaje,
        // y recién ahí redirigimos al Dashboard.
        setTimeout(function () {
          window.location.href = 'dashboard.html';
        }, 1200);
      } else {
        mostrarFeedback(feedback, 'error', 'Revisá los campos marcados antes de continuar.');
      }
    });
  }


  /* -----------------------------------------------------------
     6. VALIDACIÓN DEL FORMULARIO DE REGISTRO
     Esta es la página que cumple el requisito de "formulario
     validado con feedback visual" que pide la consigna.
  ----------------------------------------------------------- */
  var formRegistro = document.getElementById('formRegistro');

  if (formRegistro) {

    var campoId = document.getElementById('regPlayerId');
    var campoEmail = document.getElementById('regEmail');
    var campoPass = document.getElementById('regPassword');
    var campoConfirm = document.getElementById('regConfirm');
    var campoTerms = document.getElementById('regTerms');
    var feedbackRegistro = document.getElementById('registroFeedback');

    // Validación en vivo: en cuanto el usuario sale de "Confirm",
    // ya le avisamos si no coincide con "Password" (no hace falta
    // esperar a que toque "Sign Up").
    campoConfirm.addEventListener('input', function () {
      if (campoConfirm.value === '') return;
      if (campoConfirm.value === campoPass.value) {
        marcarValido(campoConfirm, 'regConfirmError');
      } else {
        marcarError(campoConfirm, 'regConfirmError');
      }
    });

    formRegistro.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var formValido = true;

      // Player ID: mínimo 3 caracteres, solo letras/números/guion bajo
      var regexId = /^[a-zA-Z0-9_]{3,}$/;
      if (!regexId.test(campoId.value.trim())) {
        marcarError(campoId, 'regPlayerIdError');
        formValido = false;
      } else {
        marcarValido(campoId, 'regPlayerIdError');
      }

      // Email: usamos una validación simple de formato
      var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(campoEmail.value.trim())) {
        marcarError(campoEmail, 'regEmailError');
        formValido = false;
      } else {
        marcarValido(campoEmail, 'regEmailError');
      }

      // Password: mínimo 8 caracteres
      if (campoPass.value.length < 8) {
        marcarError(campoPass, 'regPasswordError');
        formValido = false;
      } else {
        marcarValido(campoPass, 'regPasswordError');
      }

      // Confirm: tiene que ser igual a Password
      if (campoConfirm.value !== campoPass.value || campoConfirm.value === '') {
        marcarError(campoConfirm, 'regConfirmError');
        formValido = false;
      } else {
        marcarValido(campoConfirm, 'regConfirmError');
      }

      // Términos: el checkbox tiene que estar tildado
      var errorTerms = document.getElementById('regTermsError');
      if (!campoTerms.checked) {
        errorTerms.classList.add('show');
        formValido = false;
      } else {
        errorTerms.classList.remove('show');
      }

      if (formValido) {
        mostrarFeedback(feedbackRegistro, 'success',
          '✓ ¡Cuenta creada con éxito! Ahora podés completar tu perfil gamer.');
        // Nota: como TeamUP es un proyecto frontend-only, acá no hay
        // un servidor real. En un caso real, este "if" es donde se
        // mandaría la info al backend con fetch().
      } else {
        mostrarFeedback(feedbackRegistro, 'error',
          'Hay datos sin completar correctamente. Revisá los campos en rojo.');
      }
    });
  }


  /* -----------------------------------------------------------
     FUNCIONES AUXILIARES DE VALIDACIÓN
     Las separamos para no repetir el mismo código en cada campo.
  ----------------------------------------------------------- */
  function marcarError(input, idMensaje) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    var mensaje = document.getElementById(idMensaje);
    if (mensaje) mensaje.classList.add('show');
  }

  function marcarValido(input, idMensaje) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
    var mensaje = document.getElementById(idMensaje);
    if (mensaje) mensaje.classList.remove('show');
  }

  function mostrarFeedback(elemento, tipo, texto) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.classList.remove('feedback-success', 'feedback-error');
    elemento.classList.add(tipo === 'success' ? 'feedback-success' : 'feedback-error');
    elemento.classList.add('show');
  }


  /* -----------------------------------------------------------
     7. GRUPO DE BOTONES TIPO "TOGGLE" (tamaño de squad, página Squads)
     Son botones comunes, no checkboxes ni radios — así que el
     "está seleccionado" lo manejamos a mano con una clase.
  ----------------------------------------------------------- */
  document.querySelectorAll('.toggle-group').forEach(function (grupo) {
    var botones = grupo.querySelectorAll('.toggle-btn');
    botones.forEach(function (boton) {
      boton.addEventListener('click', function () {
        // Le sacamos "active" a todos los hermanos y se lo ponemos
        // solo al que tocaste — por eso es "exclusivo" (uno a la vez).
        botones.forEach(function (b) { b.classList.remove('active'); });
        boton.classList.add('active');
      });
    });
  });


  /* -----------------------------------------------------------
     8. FORMULARIO DE FILTROS (página Squads)
     Frenamos el envío real del formulario (que recargaría la
     página) porque TeamUP es frontend-only y no hay backend
     que reciba estos filtros todavía.
  ----------------------------------------------------------- */
  var formFiltros = document.getElementById('formFiltrosSquads');
  if (formFiltros) {
    formFiltros.addEventListener('submit', function (evento) {
      evento.preventDefault();
      // En una versión con backend, acá se armaría la consulta
      // con los valores de #selectGame, #selectRank y el toggle
      // de tamaño activo, y se le pediría la lista filtrada al servidor.
    });
  }


  /* -----------------------------------------------------------
     9. LISTA DE CONVERSACIONES (página Messages)
     Mismo patrón "exclusivo" que el toggle de Squad Size.
  ----------------------------------------------------------- */
  var conversaciones = document.querySelectorAll('.conv-item');
  if (conversaciones.length) {
    conversaciones.forEach(function (item) {
      item.addEventListener('click', function () {
        conversaciones.forEach(function (c) { c.classList.remove('active'); });
        item.classList.add('active');
        // Nota: esto solo cambia visualmente cuál está seleccionada.
        // Para que también cambien los mensajes mostrados, habría que
        // tener guardada la conversación de cada contacto y volver a
        // dibujar #chatMessages con esos datos — lo dejamos afuera
        // a propósito para no inventar contenido que no estaba en el diseño.
      });
    });
  }


  /* -----------------------------------------------------------
     10. ENVIAR MENSAJE (página Messages)
     Manipulación del DOM real: creamos un mensaje nuevo y lo
     insertamos en la conversación, en vez de solo simular el envío.
  ----------------------------------------------------------- */
  var formMensaje = document.getElementById('formMensaje');
  var inputMensaje = document.getElementById('inputMensaje');
  var contenedorChat = document.getElementById('chatMessages');

  if (formMensaje && inputMensaje && contenedorChat) {
    formMensaje.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var texto = inputMensaje.value.trim();
      if (texto === '') return; // no mandamos mensajes vacíos

      // Armamos la hora actual en formato HH:MM
      var ahora = new Date();
      var hora = ahora.getHours().toString().padStart(2, '0') + ':' +
                 ahora.getMinutes().toString().padStart(2, '0');

      // Creamos el HTML del mensaje nuevo (igual estructura que los que
      // ya están escritos a mano en el HTML)
      var fila = document.createElement('div');
      fila.className = 'msg-row msg-out';
      fila.innerHTML =
        '<div class="msg-bubble">' +
          '<div class="msg-meta">' + hora + ' · Pro_Gamer</div>' +
          '<p></p>' +
        '</div>';
      // El texto lo metemos con textContent (no innerHTML) para que,
      // si alguien escribe algo con < o >, no se interprete como HTML.
      fila.querySelector('p').textContent = texto;

      contenedorChat.appendChild(fila);
      inputMensaje.value = '';

      // Bajamos el scroll del chat para que el mensaje nuevo quede visible
      contenedorChat.scrollTop = contenedorChat.scrollHeight;
    });
  }


  /* -----------------------------------------------------------
     9. MENÚ DESPLEGABLE DEL AVATAR (My Profile / Log Out)
  ----------------------------------------------------------- */
  var toggleMenuPerfil = document.getElementById('profileMenuToggle');
  var menuPerfil = document.getElementById('profileDropdown');

  if (toggleMenuPerfil && menuPerfil) {
    toggleMenuPerfil.addEventListener('click', function (evento) {
      // Frenamos la propagación para que el listener de "click afuera"
      // de acá abajo no se dispare en el mismo click que lo abre.
      evento.stopPropagation();
      var abierto = menuPerfil.classList.toggle('show');
      toggleMenuPerfil.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });

    document.addEventListener('click', function (evento) {
      if (!menuPerfil.contains(evento.target) && evento.target !== toggleMenuPerfil) {
        menuPerfil.classList.remove('show');
        toggleMenuPerfil.setAttribute('aria-expanded', 'false');
      }
    });

    var botonLogout = document.getElementById('logoutBtn');
    if (botonLogout) {
      botonLogout.addEventListener('click', function () {
        window.location.href = 'login.html';
      });
    }
  }


  /* -----------------------------------------------------------
     10. NOTIFICACIÓN "INVITATION SENT" al tocar Invite to Squad
     Buscamos por texto en vez de por clase, así no tuvimos que
     agregarle un atributo nuevo a cada botón de cada página.
  ----------------------------------------------------------- */
  document.querySelectorAll('button, a').forEach(function (el) {
    if (el.textContent.trim() === 'Invite to Squad') {
      el.addEventListener('click', function () {
        mostrarToast('Invitation Sent');
      });
    }
  });

  function mostrarToast(texto) {
    var contenedor = document.getElementById('toastContainer');
    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.id = 'toastContainer';
      contenedor.className = 'toast-container';
      document.body.appendChild(contenedor);
    }

    var toast = document.createElement('div');
    toast.className = 'toast-notif';

    var icono = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icono.setAttribute('viewBox', '0 0 24 24');
    icono.setAttribute('fill', 'none');
    icono.setAttribute('stroke', 'currentColor');
    icono.setAttribute('stroke-width', '2');
    icono.innerHTML = '<path d="M4 4h16v12H7l-3 3z"/>';

    var span = document.createElement('span');
    span.textContent = texto; // textContent, no innerHTML: así no corremos riesgo
                               // de inyectar HTML si este texto cambiara a algo dinámico

    toast.appendChild(icono);
    toast.appendChild(span);
    contenedor.appendChild(toast);

    // Frame extra antes de agregar "show" para que la transición de
    // entrada (opacity + translateY) se note y no aparezca de golpe.
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }


  /* -----------------------------------------------------------
     11. TOGGLES MULTI-SELECCIÓN (Playstyle, página Edit Profile)
     A diferencia del toggle-group de Squads, acá cada botón se
     prende/apaga de forma independiente (no es "uno a la vez").
  ----------------------------------------------------------- */
  document.querySelectorAll('.toggle-group-multi .toggle-btn').forEach(function (boton) {
    boton.addEventListener('click', function () {
      boton.classList.toggle('active');
    });
  });


  /* -----------------------------------------------------------
     12. GUARDAR / CANCELAR CAMBIOS (página Edit Profile)
     Hay dos botones que guardan (el de arriba del todo y el de
     abajo del formulario), así que separamos la acción en su
     propia función para no repetir código.
  ----------------------------------------------------------- */
  var formPerfil = document.getElementById('formPerfil');
  var feedbackPerfil = document.getElementById('perfilFeedback');
  var btnGuardarArriba = document.getElementById('btnGuardarPerfil');
  var btnCancelarPerfil = document.getElementById('btnCancelarCambios');

  function guardarPerfil() {
    mostrarFeedback(feedbackPerfil, 'success', '✓ Profile updated successfully.');
  }

  if (formPerfil) {
    formPerfil.addEventListener('submit', function (evento) {
      evento.preventDefault(); // frontend-only: no hay backend que reciba esto todavía
      guardarPerfil();
    });
  }
  if (btnGuardarArriba) {
    btnGuardarArriba.addEventListener('click', guardarPerfil);
  }
  if (btnCancelarPerfil && formPerfil) {
    btnCancelarPerfil.addEventListener('click', function () {
      formPerfil.reset();
      // form.reset() no toca los .toggle-btn porque no son inputs
      // reales, así que los volvemos a mano a como arrancaron
      // (los primeros 3 activos, "Leader" no).
      document.querySelectorAll('.toggle-group-multi .toggle-btn').forEach(function (b, i) {
        b.classList.toggle('active', i < 3);
      });
      if (feedbackPerfil) feedbackPerfil.classList.remove('show');
    });
  }

});