export const STUDENT_SECTIONS = [
  {
    icon: '🚀',
    title: '¿Cómo empezar?',
    content: [
      '1. Al abrir la app verás la pantalla principal con un gran botón verde de PLAY ▶️.',
      '2. Si ya tienes un nombre guardado, puedes presionar PLAY directamente para jugar.',
      '3. Si quieres cambiar de nombre o avatar, presiona "Configurar Niño" o "¿No eres tú? Cambiar perfil".',
      '4. Si tu profesor registró tu nombre, verás tu perfil en la lista. ¡Solo tócalo para comenzar!',
    ],
  },
  {
    icon: '🔤',
    title: 'Actividad 1: Reconocimiento de Letras',
    content: [
      '🎯 Objetivo: Escuchar el sonido de una letra y seleccionar la correcta.',
      '• Presiona el botón "🔊 Escuchar" para oír la letra.',
      '• Elige la letra correcta entre las opciones de colores.',
      '• Si aciertas, ¡ganas energía y puntos! ⚡',
      '• Si te equivocas, puedes intentarlo de nuevo. ¡No te rindas! 💪',
      '• Completa 8 preguntas para terminar la ronda.',
      '• Cada 4 respuestas correctas subes de nivel (más letras difíciles).',
    ],
  },
  {
    icon: '🎵',
    title: 'Actividad 2: Reconocimiento de Sonidos',
    content: [
      '🎯 Objetivo: Escuchar una sílaba y formar la combinación correcta.',
      '• Presiona "🔊 Escuchar" para oír la sílaba.',
      '• Arrastra la CONSONANTE correcta (azul) a su casilla.',
      '• Arrastra la VOCAL correcta (rosa) a su casilla.',
      '• Si la combinación es correcta, ¡verás el resultado en verde! ✅',
      '• Completa 8 sílabas para terminar.',
    ],
  },
  {
    icon: '✏️',
    title: 'Actividad 3: Reconocimiento de Palabras',
    content: [
      '🎯 Objetivo: Escuchar una palabra y escribirla correctamente.',
      '• Presiona "🔊 Escuchar palabra" para oír la palabra.',
      '• Escríbela en el campo de texto y presiona "Comprobar".',
      '• Si te equivocas 2 veces, aparecerá una pista con la cantidad de letras. 💡',
      '• Si te equivocas 3 veces, se muestran las letras como ayuda.',
      '• Las palabras empiezan fáciles y se hacen más difíciles.',
    ],
  },
  {
    icon: '🖼️',
    title: 'Actividad 4: Escribo el Nombre',
    content: [
      '🎯 Objetivo: Ver imágenes (emojis) y escribir su nombre.',
      '• Observa las 4 imágenes que aparecen en pantalla.',
      '• Escribe el nombre de cada imagen en su casilla.',
      '• Puedes verificar de a una o presionar "¡Verificar todo!" al final.',
      '• Las correctas se marcan en verde ✅ y las incorrectas en rojo con una pista.',
    ],
  },
  {
    icon: '⚡',
    title: 'Barra de Energía y Estrellas',
    content: [
      '• Cada respuesta correcta te da +20% de energía.',
      '• Cuando la barra llega a 100%, ¡ganas una ⭐ estrella!',
      '• Las estrellas sirven para desbloquear nuevas actividades. 🔓',
      '• Necesitas al menos 2 estrellas en cada actividad para desbloquear la siguiente.',
      '• Los errores restan energía, ¡así que piensa bien antes de responder!',
    ],
  },
];

export const TEACHER_SECTIONS = [
  {
    icon: '🔐',
    title: 'Acceso a la Zona de Profesores',
    content: [
      '1. Desde la pantalla principal, presiona el ícono 👨‍🏫 "Zona Profesores" (esquina superior derecha).',
      '2. Si ya tienes una sesión activa, deberás introducir tu PIN de 4 dígitos (predeterminado: 1234).',
      '3. Si es tu primera vez, serás redirigido a la pantalla de inicio de sesión.',
      '4. Puedes registrarte con correo/contraseña o con Google.',
    ],
  },
  {
    icon: '👦',
    title: 'Registrar Alumnos',
    content: [
      '1. En el Panel de Control, presiona el botón "+" junto a "Mis Alumnos".',
      '2. Ingresa el nombre del alumno y selecciona un avatar.',
      '3. Presiona "Guardar Alumno".',
      '4. Los alumnos registrados guardan su progreso en la nube automáticamente. ☁️',
      '5. Los alumnos que juegan sin estar registrados entran como "Invitado" y su progreso NO se guarda.',
    ],
  },
  {
    icon: '📊',
    title: 'Ver Reportes de Progreso',
    content: [
      '• Selecciona un alumno de la barra lateral izquierda.',
      '• Verás su reporte con estrellas ⭐, puntuación 🎯, aciertos ✅ y errores ❌.',
      '• La gráfica semanal muestra la actividad de los últimos 7 días.',
      '• Puedes ver hasta 14 días de historial de métricas.',
    ],
  },
  {
    icon: '📄',
    title: 'Descargar Informe PDF',
    content: [
      '• Dentro del reporte de un alumno, presiona "📄 Descargar Informe PDF".',
      '• Se generará un documento PDF con el resumen completo del progreso.',
      '• El PDF incluye: datos del alumno, estrellas, puntajes, aciertos/errores y actividad reciente.',
      '• Útil para reuniones con padres o informes escolares.',
    ],
  },
  {
    icon: '🔑',
    title: 'PIN de Seguridad',
    content: [
      '• El PIN predeterminado es 1234.',
      '• Este PIN evita que los alumnos accedan al Panel de Control sin autorización.',
      '• El PIN protege el acceso al panel cuando ya hay una sesión activa.',
      '• El profesor puede cambiar el PIN desde el panel de control (próximamente).',
    ],
  },
  {
    icon: '🎮',
    title: 'Ir al Juego desde el Panel',
    content: [
      '• Desde el Panel de Control, presiona "🕹️ Ir al Juego".',
      '• Si tienes un alumno seleccionado, el juego se cargará con su perfil y progreso.',
      '• Esto es útil para supervisar cómo funciona el juego con los datos de un alumno.',
    ],
  },
  {
    icon: '🔊',
    title: 'Sobre el Audio y Sonido',
    content: [
      '• El botón 🎵 en la esquina superior izquierda activa/desactiva la música de fondo.',
      '• La música se pausa automáticamente durante las actividades.',
      '• Cada actividad tiene audio de instrucciones que se reproduce al iniciar.',
      '• Asegúrese de que los dispositivos tengan el volumen activado para la mejor experiencia.',
    ],
  },
];
