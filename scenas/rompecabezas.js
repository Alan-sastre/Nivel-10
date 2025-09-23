class Rompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "Rompecabezas" });
    this.nanorrobotsControlados = 0;
    this.nanorrobotsTotal = 0;
    this.nivelActual = 1;
    this.nivelesMax = 2;
    this.juegoActivo = false;
    this.puntos = 0;
    this.puntosParaBonus = 500;
    this.bonusActivado = false;
    this.nivelContencionPorcentaje = 0; // Porcentaje de contención (0-100)
    this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  }

  createSounds() {
    // Crear sonidos sintéticos específicos para el juego de rompecabezas
    this.sounds = {
      // Sonidos de captura y contención
      captura: this.createAdvancedSound([440, 550, 660], 0.3, 'triangle', 'capture'),
      capturaExitosa: this.createAdvancedSound([660, 880, 1100], 0.4, 'sine', 'success'),

      // Sonidos de replicación y peligro
      replicacion: this.createAdvancedSound([220, 165, 110], 0.5, 'sawtooth', 'danger'),
      replicacionRapida: this.createAdvancedSound([330, 220, 165], 0.3, 'square', 'warning'),

      // Sonidos de nivel y progreso
      nivelCompletado: this.createAdvancedSound([523.25, 659.25, 783.99, 1046.50], 1.5, 'triangle', 'victory'),
      puntoGanado: this.createAdvancedSound([880, 1100], 0.2, 'sine', 'point'),

      // Sonidos de interfaz
      botonClick: this.createAdvancedSound([660, 880], 0.15, 'square', 'click'),
      contencionCritica: this.createAdvancedSound([110, 220, 110], 0.8, 'sawtooth', 'alarm'),

      // Sonidos ambientales
      ambienteContencion: this.createAdvancedSound([165, 220, 275], 2.0, 'sine', 'ambient'),
      energiaContenedor: this.createAdvancedSound([440, 550, 660], 0.6, 'triangle', 'energy'),

      // Sonidos de transición
      inicioMision: this.createAdvancedSound([261.63, 329.63, 392.00, 523.25], 1.0, 'triangle', 'mission_start'),
      transicionNivel: this.createAdvancedSound([440, 554.37, 659.25], 0.8, 'sine', 'transition')
    };
  }

  createAdvancedSound(frequencies, duration, waveType = 'sine', soundType = 'default') {
    return {
      play: () => {
        if (this.sound.context) {
          const now = this.sound.context.currentTime;

          // Crear múltiples osciladores para armonías
          frequencies.forEach((frequency, index) => {
            const oscillator = this.sound.context.createOscillator();
            const gainNode = this.sound.context.createGain();
            const filterNode = this.sound.context.createBiquadFilter();

            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.sound.context.destination);

            oscillator.frequency.setValueAtTime(frequency, now);
            oscillator.type = waveType;

            // Configurar filtro según el tipo de sonido
            switch(soundType) {
              case 'capture':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(1200, now);
                break;
              case 'success':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(300, now);
                break;
              case 'danger':
              case 'warning':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(600, now);
                break;
              case 'victory':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(400, now);
                break;
              case 'point':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(2000, now);
                break;
              case 'click':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(1000, now);
                break;
              case 'alarm':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(200, now);
                break;
              case 'ambient':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(800, now);
                break;
              case 'energy':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(1500, now);
                break;
              case 'mission_start':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(350, now);
                break;
              case 'transition':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(1800, now);
                break;
            }

            // Configurar ganancia con envelope
            const baseGain = 0.06 / frequencies.length;
            const delay = index * 0.02;

            gainNode.gain.setValueAtTime(0, now + delay);
            gainNode.gain.linearRampToValueAtTime(baseGain, now + delay + 0.01);

            // Envelope específico por tipo de sonido
            switch(soundType) {
              case 'capture':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.2, now + delay + duration * 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'success':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.5, now + delay + duration * 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'danger':
              case 'warning':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.3, now + delay + duration * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'victory':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.4, now + delay + duration * 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'point':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.8, now + delay + duration * 0.5);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'click':
                gainNode.gain.linearRampToValueAtTime(0, now + delay + duration * 0.2);
                break;
              case 'alarm':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.1, now + delay + duration * 0.5);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'ambient':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.4, now + delay + duration * 0.7);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'energy':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.9, now + delay + duration * 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'mission_start':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.3, now + delay + duration * 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'transition':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.8, now + delay + duration * 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              default:
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
            }

            // Modulación de frecuencia para efectos especiales
            if (soundType === 'danger' || soundType === 'alarm') {
              oscillator.frequency.linearRampToValueAtTime(frequency * 0.7, now + delay + duration * 0.5);
              oscillator.frequency.linearRampToValueAtTime(frequency * 1.3, now + delay + duration);
            }

            if (soundType === 'success' || soundType === 'victory') {
              oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + delay + duration * 0.3);
              oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, now + delay + duration);
            }

            if (soundType === 'energy') {
              oscillator.frequency.linearRampToValueAtTime(frequency * 1.1, now + delay + duration * 0.5);
              oscillator.frequency.linearRampToValueAtTime(frequency * 0.9, now + delay + duration);
            }

            oscillator.start(now + delay);
            oscillator.stop(now + delay + duration);
          });
        }
      }
    };
  }

  preload() {
    // Cargar elementos visuales - SIN imagen de fondo, usamos fondo generado por código
    // this.load.image('fondo', 'assets/scenaPrincipal/1.jpg'); // ELIMINADO - usamos fondo generado
    this.load.image('nanorrobot', 'assets/rompecabezas/Taller.png'); // Usaremos esta imagen temporalmente
    this.load.image('contenedor', 'assets/rompecabezas/Taller.png'); // Usaremos esta imagen temporalmente
    this.load.image('particula', 'assets/rompecabezas/Taller.png'); // Usaremos esta imagen temporalmente

    // Crear textura de pixel para partículas
    this.add.graphics().fillStyle(0xffffff).fillRect(0, 0, 1, 1).generateTexture('pixel', 1, 1);

    // Crear sonidos sintéticos
    this.createSounds();
  }

  create() {
    // Obtener dimensiones de la pantalla
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // CREAR FONDO FUTURISTA GENERADO POR CÓDIGO (no imagen)
    this.crearFondoFuturista();

    // Variables para el sistema de puntos (sin barra de progreso visual)
    this.progressBarWidth = 0;
    this.targetProgressWidth = 0;
    this.progressBarMaxWidth = Math.min(420, screenWidth * 0.75);

    // Añadir título - ajustado para pantalla completa
    const fontSize = this.isMobile ? '32px' : Math.min(28, screenWidth * 0.035) + 'px';
    this.add.text(screenWidth / 2, Math.min(50, screenHeight * 0.08), 'NANORROBOTS: PROTOCOLO DE CONTENCIÓN', {
      font: `${fontSize} Orbitron`,
      fill: '#00ffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 2,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    // Añadir instrucciones con estilo futurista mejorado
    const instruccionesFontSize = this.isMobile ? '24px' : Math.min(20, screenWidth * 0.028) + 'px';
    const instruccionesY = Math.min(120, screenHeight * 0.2);

    this.instruccionesTexto = this.add.text(screenWidth / 2, instruccionesY, '⚡ CONTÉN LOS NANOBOTS EN EL REACTOR ⚡', {
      font: `${instruccionesFontSize} Orbitron`,
      fill: '#00ffaa',
      align: 'center'
    }).setOrigin(0.5);

    // Crear área de juego
    this.crearAreaJuego();

    // Configurar eventos de interacción
    this.configurarEventos();

    // Añadir contador de nanorrobots - posición adaptativa
    this.contadorTexto = this.add.text(screenWidth / 2, screenHeight - Math.min(50, screenHeight * 0.1), `Nanorrobots contenidos: ${this.nanorrobotsControlados}/${this.nanorrobotsTotal}`, {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#00ffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Añadir indicador de contención (reposicionado en esquina inferior izquierda) - posición adaptativa
    const contencionY = screenHeight - Math.min(60, screenHeight * 0.12); // Posición cerca del borde inferior
    this.contencionTexto = this.add.text(Math.min(20, screenWidth * 0.02), contencionY - 25, 'CONTENCIÓN: 0%', {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#00ff00',
      align: 'left',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0, 0.5);

    // Añadir contador de puntos (más abajo para mejor visibilidad) - posición adaptativa
    this.puntosTexto = this.add.text(screenWidth - Math.min(80, screenWidth * 0.08), Math.min(110, screenHeight * 0.22), `Puntos: ${this.puntos}`, {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#ffff00',
      align: 'right',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0.5);

    // Crear mensaje de advertencia de contención crítica (inicialmente oculto)
    this.advertenciaContencion = this.add.text(screenWidth / 2, screenHeight / 2 + 50, '¡CONTENCIÓN CRÍTICA!', {
      font: Math.min(32, screenWidth * 0.04) + 'px Orbitron',
      fill: '#ff0000',
      align: 'center',
      stroke: '#ffffff',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setVisible(false).setDepth(50);

    // Añadir título del juego
    const tituloJuego = this.add.text(screenWidth / 2, screenHeight * 0.15, '', {
      font: `${Math.floor(fontSize * 1.5)} Orbitron`,
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(50);

    // Añadir instrucciones con diseño minimalista y elegante
    const instruccionesTexto = this.add
      .text(
        screenWidth / 2,
        screenHeight * 0.35,
        "\n\n" +
          "Arrastra los nanobots hacia las zonas de contención\n" +
          "Completa todos los niveles para salvar el planeta\n\n" +
          "Presiona INICIAR MISIÓN cuando estés listo",
        {
          font: `${Math.floor(fontSize * 5)} Orbitron`,
          fill: "#ffffff",
          stroke: "#001133",
          strokeThickness: 1,
          align: "center",
          lineSpacing: 12,
          wordWrap: { width: screenWidth * 0.8 },
        }
      )
      .setOrigin(0.5)
      .setDepth(50);

    // Efecto de parpadeo sutil para el texto
    this.tweens.add({
      targets: instruccionesTexto,
      alpha: 0.7,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Añadir botón de inicio - centrado en pantalla
    const iniciarBoton = this.add.text(screenWidth / 2, screenHeight * 0.75, 'INICIAR MISIÓN', {
      font: `${fontSize} Orbitron`,
      fill: '#ffffff',
      backgroundColor: '#00aa00',
      padding: {
        x: 20,
        y: 10
      }
    }).setOrigin(0.5).setInteractive();

    iniciarBoton.on('pointerdown', () => {
      // Sonido de clic del botón
      if (this.sounds && this.sounds.inicioMision) {
        this.sounds.inicioMision.play();
      }
      // Destruir elementos de la pantalla de inicio
      tituloJuego.destroy();
      instruccionesTexto.destroy();
      iniciarBoton.destroy();
      this.iniciarJuego();
    });

    // Los sonidos sintéticos ya están creados en createSounds()
    // Se acceden a través de this.sounds.nombreDelSonido.play()

    // Agregar estilos CSS para móviles
    this.agregarEstilosMoviles();
  }

  crearFondoFuturista() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // FONDO BASE MÁS OPACO - Gradiente radial estático
    const fondoBase = this.add.graphics();
    fondoBase.fillGradientStyle(0x000814, 0x001d3d, 0x003566, 0x0077b6, 1);
    fondoBase.fillRect(0, 0, screenWidth, screenHeight);
    fondoBase.setDepth(-15);

    // CAPA DE OPACIDAD ADICIONAL
    const capaOpacidad = this.add.graphics();
    capaOpacidad.fillStyle(0x000000, 0.4); // Negro semi-transparente para mayor opacidad
    capaOpacidad.fillRect(0, 0, screenWidth, screenHeight);
    capaOpacidad.setDepth(-14.5);

    // NEBULOSA CÓSMICA DE FONDO - ESTÁTICA Y MÁS OPACA
    for (let i = 0; i < 3; i++) {
      const nebulosa = this.add.graphics();
      nebulosa.fillGradientStyle(
        0x001122 + i * 0x001111,
        0x002244 + i * 0x001111,
        0x003566 + i * 0x001111,
        0x004488 + i * 0x001111,
        0.6 - i * 0.1  // Opacidad aumentada
      );

      const nebulaRadius = Phaser.Math.Between(200, 400);
      nebulosa.fillCircle(
        Phaser.Math.Between(nebulaRadius, screenWidth - nebulaRadius),
        Phaser.Math.Between(nebulaRadius, screenHeight - nebulaRadius),
        nebulaRadius
      );
      nebulosa.setDepth(-14);
      // Sin animación de rotación para mantenerlo tranquilo
    }

    // GRID CUÁNTICO SIMPLE - SIN ANIMACIONES
    const grid = this.add.graphics();
    grid.setDepth(-12);

    const gridSpacing = 40;
    const gridColors = [0x00ffff, 0x00ff88, 0xff00ff, 0xffff00];

    // Líneas verticales con colores alternados
    for (let x = 0; x <= screenWidth; x += gridSpacing) {
      const colorIndex = Math.floor(x / gridSpacing) % gridColors.length;
      grid.lineStyle(1, gridColors[colorIndex], 0.2); // Opacidad reducida
      grid.lineBetween(x, 0, x, screenHeight);
    }

    // Líneas horizontales con colores alternados
    for (let y = 0; y <= screenHeight; y += gridSpacing) {
      const colorIndex = Math.floor(y / gridSpacing) % gridColors.length;
      grid.lineStyle(1, gridColors[colorIndex], 0.2); // Opacidad reducida
      grid.lineBetween(0, y, screenWidth, y);
    }
    // Sin animación de pulso para mantenerlo tranquilo

    // PARTÍCULAS ESTÁTICAS SIMPLES
    for (let i = 0; i < 15; i++) { // Reducido de 25 a 15
      const particula = this.add.circle(
        Phaser.Math.Between(0, screenWidth),
        Phaser.Math.Between(0, screenHeight),
        Phaser.Math.Between(2, 4), // Tamaño más pequeño
        gridColors[i % gridColors.length],
        0.3 // Opacidad reducida
      );
      particula.setDepth(-11);
      // Sin animaciones de movimiento para mantenerlo tranquilo
    }

    // ALGUNOS ELEMENTOS DECORATIVOS ESTÁTICOS
    for (let i = 0; i < 4; i++) { // Reducido de 8 a 4
      const elemento = this.add.graphics();
      elemento.setDepth(-10);

      const centerX = Phaser.Math.Between(100, screenWidth - 100);
      const centerY = Phaser.Math.Between(100, screenHeight - 100);
      const radius = Phaser.Math.Between(20, 40);

      // Crear círculos decorativos simples
      elemento.lineStyle(1, gridColors[i % gridColors.length], 0.2);
      elemento.strokeCircle(centerX, centerY, radius);
      elemento.strokeCircle(centerX, centerY, radius + 10);
      // Sin animaciones para mantenerlo tranquilo
    }
  }

  agregarEstilosMoviles() {
    // Crear elemento de estilo para SweetAlert2 móvil
    const style = document.createElement('style');
    style.textContent = `
      /* Estilos para SweetAlert2 en móviles */
      .mobile-container {
        padding: 0 !important;
      }

      .mobile-popup {
        width: 90% !important;
        max-width: 400px !important;
        margin: 0 auto !important;
        padding: 1rem !important;
        font-size: 14px !important;
      }

      .mobile-title {
        font-size: 18px !important;
        line-height: 1.2 !important;
        margin-bottom: 0.5rem !important;
      }

      .mobile-content {
        font-size: 14px !important;
        line-height: 1.3 !important;
        padding: 0.5rem 0 !important;
      }

      .mobile-button {
        font-size: 14px !important;
        padding: 0.5rem 1rem !important;
        margin-top: 1rem !important;
        background: linear-gradient(45deg, #00aa00, #00ff00) !important;
        border: none !important;
        border-radius: 8px !important;
        color: white !important;
        font-weight: bold !important;
        box-shadow: 0 2px 8px rgba(0, 170, 0, 0.3) !important;
        transition: all 0.3s ease !important;
      }

      .mobile-button:hover {
        background: linear-gradient(45deg, #00cc00, #00ff44) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0, 170, 0, 0.4) !important;
      }

      /* Estilos para mensaje final */
      .mobile-final-container {
        padding: 0 !important;
      }

      .mobile-final-popup {
        width: 95% !important;
        max-width: 450px !important;
        margin: 0 auto !important;
        padding: 1rem !important;
        border-radius: 15px !important;
      }

      .mobile-final-title {
        font-size: 16px !important;
        line-height: 1.2 !important;
        margin-bottom: 0.5rem !important;
      }

      .mobile-final-content {
        font-size: 13px !important;
        line-height: 1.3 !important;
        padding: 0.5rem 0 !important;
      }

      .mobile-final-button {
        font-size: 14px !important;
        padding: 0.6rem 1.2rem !important;
        margin-top: 1rem !important;
        background: linear-gradient(45deg, #ff6600, #ff9900) !important;
        border: none !important;
        border-radius: 10px !important;
        color: white !important;
        font-weight: bold !important;
        box-shadow: 0 3px 10px rgba(255, 102, 0, 0.4) !important;
        transition: all 0.3s ease !important;
      }

      .mobile-final-button:hover {
        background: linear-gradient(45deg, #ff7700, #ffaa00) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 15px rgba(255, 102, 0, 0.5) !important;
      }

      /* Ajustes para pantallas muy pequeñas */
      @media (max-width: 480px) {
        .mobile-popup, .mobile-final-popup {
          width: 95% !important;
          padding: 0.8rem !important;
        }

        .mobile-title, .mobile-final-title {
          font-size: 16px !important;
        }

        .mobile-content, .mobile-final-content {
          font-size: 12px !important;
        }

        .mobile-button, .mobile-final-button {
          font-size: 13px !important;
          padding: 0.5rem 1rem !important;
        }
      }

      /* Ajustes para pantallas extra pequeñas */
      @media (max-width: 360px) {
        .mobile-popup, .mobile-final-popup {
          width: 98% !important;
          padding: 0.6rem !important;
        }

        .mobile-title, .mobile-final-title {
          font-size: 15px !important;
        }

        .mobile-content, .mobile-final-content {
          font-size: 11px !important;
        }

        .mobile-button, .mobile-final-button {
          font-size: 12px !important;
          padding: 0.4rem 0.8rem !important;
        }
      }
    `;

    // Agregar el estilo al head del documento
    document.head.appendChild(style);
  }

  crearAreaJuego() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Crear recuadro principal donde se moverán los nanobots
    const areaJuegoX = screenWidth / 2;
    const areaJuegoY = screenHeight / 2 + 20;
    const areaJuegoWidth = Math.min(600, screenWidth * 0.75);
    const areaJuegoHeight = Math.min(350, screenHeight * 0.6);

    // Crear el fondo del área de juego
    this.areaJuegoFondo = this.add.graphics();
    this.areaJuegoFondo.fillStyle(0x001122, 0.3); // Fondo azul oscuro semi-transparente
    this.areaJuegoFondo.fillRoundedRect(
      areaJuegoX - areaJuegoWidth/2,
      areaJuegoY - areaJuegoHeight/2,
      areaJuegoWidth,
      areaJuegoHeight,
      15
    );

    // Crear el borde del área de juego con efecto brillante
    this.areaJuegoBorde = this.add.graphics();
    this.areaJuegoBorde.lineStyle(3, 0x00ffaa, 1);
    this.areaJuegoBorde.strokeRoundedRect(
      areaJuegoX - areaJuegoWidth/2,
      areaJuegoY - areaJuegoHeight/2,
      areaJuegoWidth,
      areaJuegoHeight,
      15
    );

    // Añadir líneas decorativas en las esquinas
    this.areaJuegoDetalles = this.add.graphics();
    this.areaJuegoDetalles.lineStyle(2, 0x00ffaa, 0.7);

    // Esquinas decorativas
    const cornerSize = 20;
    const corners = [
      { x: areaJuegoX - areaJuegoWidth/2, y: areaJuegoY - areaJuegoHeight/2 }, // Superior izquierda
      { x: areaJuegoX + areaJuegoWidth/2, y: areaJuegoY - areaJuegoHeight/2 }, // Superior derecha
      { x: areaJuegoX - areaJuegoWidth/2, y: areaJuegoY + areaJuegoHeight/2 }, // Inferior izquierda
      { x: areaJuegoX + areaJuegoWidth/2, y: areaJuegoY + areaJuegoHeight/2 }  // Inferior derecha
    ];

    corners.forEach((corner, index) => {
      const offsetX = index % 2 === 0 ? cornerSize : -cornerSize;
      const offsetY = index < 2 ? cornerSize : -cornerSize;

      // Línea horizontal
      this.areaJuegoDetalles.lineBetween(corner.x, corner.y, corner.x + offsetX, corner.y);
      // Línea vertical
      this.areaJuegoDetalles.lineBetween(corner.x, corner.y, corner.x, corner.y + offsetY);
    });

    // Texto eliminado - ya no se muestra "ZONA DE NANOBOTS"

    // Efecto de pulso para el borde
    this.tweens.add({
      targets: this.areaJuegoBorde,
      alpha: { from: 1, to: 0.6 },
      yoyo: true,
      repeat: -1,
      duration: 2000,
      ease: 'Sine.easeInOut'
    });

    // Crear un contenedor más elaborado para los nanorrobots
    // Primero, crear un grupo para contener todos los elementos del contenedor
    this.contenedorGroup = this.add.group();

    // Posición del contenedor - adaptativa para pantalla completa
    const contenedorX = screenWidth - Math.min(150, screenWidth * 0.15);
    const contenedorY = screenHeight / 2;
    const contenedorWidth = Math.min(100, screenWidth * 0.1);
    const contenedorHeight = Math.min(200, screenHeight * 0.4);

    // Crear el fondo del contenedor (cilindro)
    this.contenedor = this.add.graphics();
    this.contenedor.fillStyle(0x000033, 1); // Fondo azul oscuro
    this.contenedor.fillRoundedRect(contenedorX - contenedorWidth/2, contenedorY - contenedorHeight/2, contenedorWidth, contenedorHeight, 20); // Rectángulo redondeado
    this.contenedor.lineStyle(3, 0x00ffff, 1); // Borde cian brillante
    this.contenedor.strokeRoundedRect(contenedorX - contenedorWidth/2, contenedorY - contenedorHeight/2, contenedorWidth, contenedorHeight, 20);

    // Añadir detalles al contenedor
    // Líneas horizontales decorativas
    const numLineas = Math.max(3, Math.floor(contenedorHeight / 50));
    for (let i = 0; i < numLineas; i++) {
      const lineY = contenedorY - (contenedorHeight/2 - 20) + (i * (contenedorHeight - 40) / (numLineas - 1));
      this.contenedor.lineStyle(1, 0x00ffff, 0.5);
      this.contenedor.lineBetween(contenedorX - (contenedorWidth/2 - 5), lineY, contenedorX + (contenedorWidth/2 - 5), lineY);
    }

    // Añadir texto al contenedor - tamaño adaptativo
    const textoSize = Math.min(16, screenWidth * 0.02);
    const textoContenedor = this.add.text(contenedorX, contenedorY - (contenedorHeight/2 - 10), 'CONTENCIÓN', {
      font: `${textoSize}px Orbitron`,
      fill: '#00ffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Añadir un indicador de nivel de contención (barra vertical)
    this.nivelContencion = this.add.graphics();
    this.nivelContencion.fillStyle(0x00ff88, 0.7);
    this.nivelContencion.fillRect(contenedorX - (contenedorWidth * 0.4), contenedorY + (contenedorHeight/2 - 20), contenedorWidth * 0.8, 0); // Inicialmente vacío

    // Añadir texto de porcentaje en el contenedor - tamaño adaptativo
    const porcentajeSize = Math.min(12, screenWidth * 0.015);
    this.contenedorPorcentajeTexto = this.add.text(contenedorX, contenedorY + (contenedorHeight/2 - 10), '0%', {
      font: `${porcentajeSize}px Orbitron`,
      fill: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Crear efecto de alerta para contención alta
    this.alertaContencion = this.add.graphics();
    this.alertaContencion.setVisible(false);
    this.alertaContencion.setDepth(5);

    // Añadir efecto de brillo/partículas al contenedor
    const particulas = this.add.particles('particula');
    this.emisorContenedor = particulas.createEmitter({
      x: contenedorX,
      y: contenedorY,
      speed: { min: 10, max: 30 },
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      tint: 0x00ffff,
      frequency: 500, // Emisión lenta en estado normal
      quantity: 1,
      lifespan: 1000,
      gravityY: -20
    });

    // Crear zona de detección para el contenedor - tamaño adaptativo
    this.zonaContenedor = this.add.zone(contenedorX, contenedorY, contenedorWidth, contenedorHeight);
    this.physics.world.enable(this.zonaContenedor);
    this.zonaContenedor.body.setAllowGravity(false);
    this.zonaContenedor.body.moves = false;

    // Grupo para los nanorrobots
    this.nanorrobotsGroup = this.physics.add.group();

    // Añadir un efecto de pulso al contenedor
    this.tweens.add({
      targets: this.contenedor,
      alpha: { from: 1, to: 0.8 },
      yoyo: true,
      repeat: -1,
      duration: 2000,
      ease: 'Sine.easeInOut'
    });

    // Añadir un efecto de rotación al texto
    this.tweens.add({
      targets: textoContenedor,
      angle: { from: -2, to: 2 },
      yoyo: true,
      repeat: -1,
      duration: 1500,
      ease: 'Sine.easeInOut'
    });
  }

  // Método para verificar si se han alcanzado los puntos necesarios para completar el nivel
  verificarCompletarNivel() {
    if (this.juegoActivo) {
      // Verificar si TODOS los nanobots están contenidos
      if (this.nanorrobotsControlados >= this.nanorrobotsTotal && this.nanorrobotsTotal > 0) {
        // Mostrar mensaje de nanobots contenidos
        const screenWidth = this.sys.game.config.width;
        const screenHeight = this.sys.game.config.height;

        // Crear texto de nanobots contenidos
        const mensajeNanobots = this.add.text(screenWidth / 2, screenHeight / 2 - 100, '¡TODOS LOS NANOBOTS CONTENIDOS!', {
          font: '30px Orbitron',
          fill: '#00ff00',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5).setDepth(101);

        // Efecto de desvanecimiento
        this.tweens.add({
          targets: mensajeNanobots,
          alpha: 0,
          y: screenHeight / 2 - 150,
          duration: 1500,
          onComplete: () => mensajeNanobots.destroy()
        });

        // Completar el nivel
        this.nivelCompletado();
      }
    }
  }

  // Método para actualizar el nivel de contención visual
  actualizarNivelContencion() {
    if (!this.nanorrobotsTotal) return;

    // Usar el porcentaje de contención calculado en actualizarContadores
    const porcentajeContención = this.nivelContencionPorcentaje / 100;
    const altura = Math.min(porcentajeContención * 160, 160); // Máximo 160px de altura

    // Verificar si se ha completado la contención (100%)
    // Solo verificar después de un tiempo para dar oportunidad de jugar
    if (porcentajeContención >= 1 && this.juegoActivo && this.tiempoInicio && (this.time.now - this.tiempoInicio > 5000)) {
      this.perderNivel();
      return;
    }

    this.nivelContencion.clear();

    // Cambiar color según el nivel de contención
    let color;
    let colorTexto;
    if (porcentajeContención < 0.3) {
      color = 0x00ff88; // Verde para contención baja (bueno)
      colorTexto = '#00ff00';
    } else if (porcentajeContención < 0.7) {
      color = 0xffff00; // Amarillo para contención media (precaución)
      colorTexto = '#ffff00';
    } else {
      color = 0xff0000; // Rojo para contención alta (peligro)
      colorTexto = '#ff0000';
    }

    this.nivelContencion.fillStyle(color, 0.7);
    this.nivelContencion.fillRect(
      this.zonaContenedor.x - 40,
      this.zonaContenedor.y + 80 - altura,
      80,
      altura
    );

    // Actualizar el indicador de contención más visible
    if (this.contencionTexto) {
      this.contencionTexto.setText(`CONTENCIÓN: ${this.nivelContencionPorcentaje}%`);
      this.contencionTexto.setFill(colorTexto);

      // Añadir efecto de parpadeo cuando la contención es alta
      if (porcentajeContención >= 0.8) {
        if (!this.contencionParpadeo) {
          this.contencionParpadeo = this.tweens.add({
            targets: this.contencionTexto,
            alpha: { from: 1, to: 0.3 },
            yoyo: true,
            repeat: -1,
            duration: 300
          });
        }
      } else {
        if (this.contencionParpadeo) {
          this.contencionParpadeo.remove();
          this.contencionParpadeo = null;
          this.contencionTexto.alpha = 1;
        }
      }
    }

    // Actualizar el texto de porcentaje en el contenedor
    if (this.contenedorPorcentajeTexto) {
      this.contenedorPorcentajeTexto.setText(`${this.nivelContencionPorcentaje}%`);
      this.contenedorPorcentajeTexto.setFill(colorTexto);
    }

    // Mostrar alerta visual cuando la contención es crítica (>= 80%)
    if (porcentajeContención >= 0.8) {
      if (!this.alertaContencion.visible) {
        this.alertaContencion.setVisible(true);

        // Crear efecto de alerta parpadeante en toda la pantalla
        const screenWidth = this.sys.game.config.width;
        const screenHeight = this.sys.game.config.height;

        this.alertaContencion.clear();
        this.alertaContencion.fillStyle(0xff0000, 0.1);
        this.alertaContencion.fillRect(0, 0, screenWidth, screenHeight);

        // Añadir borde rojo parpadeante
        this.alertaContencion.lineStyle(5, 0xff0000, 0.8);
        this.alertaContencion.strokeRect(5, 5, screenWidth - 10, screenHeight - 10);

        // Efecto de parpadeo para la alerta
         if (!this.alertaParpadeo) {
           this.alertaParpadeo = this.tweens.add({
             targets: this.alertaContencion,
             alpha: { from: 0.3, to: 0.8 },
             yoyo: true,
             repeat: -1,
             duration: 500
           });
         }

         // Mostrar mensaje de advertencia crítica
         if (this.advertenciaContencion && !this.advertenciaContencion.visible) {
           this.advertenciaContencion.setVisible(true);

           // Sonido de alarma de contención crítica
           if (this.sounds && this.sounds.contencionCritica) {
             this.sounds.contencionCritica.play();
           }

           // Efecto de parpadeo para el mensaje de advertencia
           if (!this.advertenciaParpadeo) {
             this.advertenciaParpadeo = this.tweens.add({
               targets: this.advertenciaContencion,
               alpha: { from: 1, to: 0.2 },
               scale: { from: 1, to: 1.1 },
               yoyo: true,
               repeat: -1,
               duration: 400
             });
           }
         }
       }
     } else {
       if (this.alertaContencion.visible) {
         this.alertaContencion.setVisible(false);
         if (this.alertaParpadeo) {
           this.alertaParpadeo.remove();
           this.alertaParpadeo = null;
         }
       }

       // Ocultar mensaje de advertencia crítica
       if (this.advertenciaContencion && this.advertenciaContencion.visible) {
         this.advertenciaContencion.setVisible(false);
         if (this.advertenciaParpadeo) {
           this.advertenciaParpadeo.remove();
           this.advertenciaParpadeo = null;
         }
       }
     }
  }

  // Método para manejar la derrota del nivel
  perderNivel() {
    // Detener el juego
    this.juegoActivo = false;
    if (this.replicacionTimer) this.replicacionTimer.remove();

    // Limpiar el emisor de brillo si existe
    if (this.emisorBrillo) {
      this.emisorBrillo.remove();
      this.emisorBrillo = null;
    }

    // Obtener dimensiones de la pantalla
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Crear fondo semitransparente
    const overlay = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.7)
      .setOrigin(0)
      .setDepth(100);

    // Crear texto de nivel perdido
    const mensajePerdido = this.add.text(screenWidth / 2, screenHeight / 2 - 50, '¡CONTENCIÓN FALLIDA!', {
      font: '40px Orbitron',
      fill: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setDepth(101);

    // Crear texto de puntuación final
    const puntuacionTexto = this.add.text(screenWidth / 2, screenHeight / 2 + 20, `Puntuación final: ${this.puntos}`, {
      font: '30px Orbitron',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(101);

    // Crear botón de reintentar
    const reintentarBoton = this.add.text(screenWidth / 2, screenHeight / 2 + 100, 'REINTENTAR', {
      font: '24px Orbitron',
      fill: '#ffffff',
      backgroundColor: '#ff0000',
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10
      }
    }).setOrigin(0.5).setDepth(101)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => reintentarBoton.setStyle({ fill: '#ffff00' }))
      .on('pointerout', () => reintentarBoton.setStyle({ fill: '#ffffff' }))
      .on('pointerdown', () => {
        // Reiniciar el nivel actual
        this.scene.restart();
      });

    // Efecto de partículas de error
    const particulas = this.add.particles('particula');

    // Emisor de partículas rojas
    const emisorError = particulas.createEmitter({
      x: screenWidth / 2,
      y: screenHeight / 2,
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      tint: 0xff0000,
      lifespan: 2000,
      quantity: 3,
      frequency: 100
    });

    // Efecto de vibración en la pantalla
    this.cameras.main.shake(1000, 0.01);

    // Sonido de error (si existe)
    if (this.sounds && this.sounds.replicacion) {
          this.sounds.replicacion.play();
    }
  }

  iniciarJuego() {
    this.juegoActivo = true;
    this.nanorrobotsControlados = 0;
    this.nanorrobotsTotal = 0;
    this.puntos = 0; // Reiniciar puntos
    this.puntosParaCompletarNivel = 0; // Inicializar puntos necesarios para completar nivel
    this.brilloActivado = false; // Inicializar estado del efecto de brillo

    // Iniciar sonido ambiental de fondo
    if (this.sounds && this.sounds.ambientalFondo) {
      this.sounds.ambientalFondo.play();
    }

    // Ajustar puntos según el nivel (reducido para facilitar avance)
    switch(this.nivelActual) {
      case 1:
        this.puntosParaCompletarNivel = 250; // Puntos necesarios para nivel 1 (reducidos)
        break;
      case 2:
      default:
        this.puntosParaCompletarNivel = 400; // Puntos necesarios para nivel 2 (reducidos)
        break;
    }

    // Inicializar la barra de progreso
    if (this.progressBar) {
      this.progressBar.width = 0;
      this.progressBar.fillColor = 0xff3333; // Rojo brillante al inicio
      this.progressBarGlow.width = 0;

      // Inicializar variables de animación
      this.progressBarWidth = 0;
      this.targetProgressWidth = 0;
      this.lastProgressWidth = 0;
    }

    // Actualizar el texto de puntos necesarios
    if (this.puntosNecesariosTexto) {
      this.puntosNecesariosTexto.setText(`Puntos para completar: 0/${this.puntosParaCompletarNivel}`);
    }

    this.nivelContencionPorcentaje = 0;
    this.tiempoInicio = this.time.now; // Registrar el tiempo de inicio del juego

    // DESACTIVADO: No establecer temporizador de replicación automática
    // const replicacionDelay = Math.max(1000, 4000 - (this.nivelActual * 500));

    // Iniciar la generación de nanorrobots según el nivel
    this.iniciarNivel(this.nivelActual);

    // Mostrar mensaje de inicio de nivel
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    const nivelMensaje = this.add.text(screenWidth / 2, screenHeight / 2 - 50, `NIVEL ${this.nivelActual}`, {
      font: '40px Orbitron',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100);

    // Animación de mensaje de nivel
    this.tweens.add({
      targets: nivelMensaje,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 1, to: 0 },
      duration: 1500,
      onComplete: () => {
        nivelMensaje.destroy();
      }
    });
  }

  iniciarNivel(nivel) {
    // Limpiar nanorrobots existentes
    this.nanorrobotsGroup.clear(true, true);

    // Configurar dificultad según el nivel (reducida para facilitar avance)
    let cantidadInicial;
    let velocidadReplicacion;
    let velocidadMovimiento;

    // Ajustar parámetros según el nivel
    switch(nivel) {
      case 1:
        cantidadInicial = 8; // Más nanorrobots en nivel 1 para mayor desafío
        velocidadReplicacion = 4000; // Replicación más lenta
        velocidadMovimiento = 40; // Movimiento más lento
        break;
      case 2:
        cantidadInicial = 5; // Cantidad moderada en nivel 2
        velocidadReplicacion = 3000; // Replicación moderada
        velocidadMovimiento = 60; // Movimiento moderado
        break;
      case 2:
      default:
        cantidadInicial = 6; // Más nanorrobots en nivel 2
        velocidadReplicacion = 2500; // Replicación más rápida
        velocidadMovimiento = 70; // Movimiento más rápido
        break;
    }

    // Inicializar con algunos nanorrobots ya controlados para evitar 100% de contención al inicio
    this.nanorrobotsTotal = 0; // Empezar en 0
    this.nanorrobotsControlados = 0; // Empezar en 0
    this.nivelContencionPorcentaje = 0; // 0% de contención inicial

    // Crear nanorrobots iniciales
    const nanorrobotsCreados = [];
    for (let i = 0; i < cantidadInicial; i++) {
      const nanorrobot = this.crearNanorrobot();
      nanorrobotsCreados.push(nanorrobot);
      this.nanorrobotsTotal++; // Incrementar contador correctamente
    }

    // Ya no marcamos nanobots como controlados al inicio - empezar en 0

    // Replicación automática COMPLETAMENTE DESACTIVADA
    if (this.replicacionTimer) {
      this.replicacionTimer.remove();
      this.replicacionTimer = null;
    }

    // Actualizar textos
    this.actualizarContadores();
  }

  crearNanorrobot() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Posición dentro del recuadro de nanobots
    const recuadroWidth = Math.min(600, screenWidth * 0.7);
    const recuadroHeight = Math.min(350, screenHeight * 0.4);
    const recuadroX = screenWidth / 2;
    const recuadroY = screenHeight / 2;

    // Generar posición aleatoria dentro del recuadro con margen interno
    const margenInterno = 30;
    let x = Phaser.Math.Between(
      recuadroX - (recuadroWidth/2 - margenInterno),
      recuadroX + (recuadroWidth/2 - margenInterno)
    );
    let y = Phaser.Math.Between(
      recuadroY - (recuadroHeight/2 - margenInterno),
      recuadroY + (recuadroHeight/2 - margenInterno)
    );

    // Crear el nanorrobot con tamaño más grande y visible
    const nanorrobot = this.nanorrobotsGroup.create(x, y, 'nanorrobot');
    const nanoSize = Math.min(35, Math.max(30, screenWidth * 0.03)); // Tamaño aún más grande entre 30 y 35 píxeles
    nanorrobot.setDisplaySize(nanoSize, nanoSize);
    nanorrobot.setTint(0xff0000); // Color rojo para los nanorrobots no contenidos

    // Hacer que el nanorrobot sea interactivo
    nanorrobot.setInteractive();
    this.input.setDraggable(nanorrobot);

    // Movimiento aleatorio - velocidad adaptativa
    const velocidadBase = Math.min(50, screenWidth * 0.05);
    nanorrobot.velocidadX = Phaser.Math.Between(-velocidadBase, velocidadBase);
    nanorrobot.velocidadY = Phaser.Math.Between(-velocidadBase, velocidadBase);

    // SOLO incrementar durante la inicialización del nivel, NO durante replicación
    // No incrementamos this.nanorrobotsTotal aquí para evitar conteo duplicado

    return nanorrobot;
  }

  replicarNanorrobots() {
    // FUNCIÓN DESACTIVADA - No se replican nanobots automáticamente
    // El juego ahora funciona solo con los nanobots iniciales creados
    return;
  }

  actualizarContadores() {
    this.contadorTexto.setText(`Nanorrobots contenidos: ${this.nanorrobotsControlados}/${this.nanorrobotsTotal}`);

    // Calcular porcentaje de contención (inverso al porcentaje de control)
    // 0% = todos controlados, 100% = ninguno controlado
    if (this.nanorrobotsTotal > 0) {
      const controlados = this.nanorrobotsControlados / this.nanorrobotsTotal;
      this.nivelContencionPorcentaje = Math.min(100, Math.floor((1 - controlados) * 100));
    } else {
      this.nivelContencionPorcentaje = 0;
    }

    // Actualizar el nivel de contención visual
    this.actualizarNivelContencion();

    // Verificar si se completó el nivel (todos los nanobots contenidos)
    this.verificarCompletarNivel();

    // Verificar si se ha perdido el nivel (100% de contención)
    // Solo verificar después de un tiempo para dar oportunidad de jugar
    if (this.nivelContencionPorcentaje >= 100 && this.juegoActivo && this.tiempoInicio && (this.time.now - this.tiempoInicio > 5000)) {
      this.perderNivel();
    }
  }

  nivelCompletado() {
    // Detener el juego
    this.juegoActivo = false;
    // this.replicacionTimer.remove(); // Desactivado - el timer ya no existe

    // Limpiar el emisor de brillo si existe
    if (this.emisorBrillo) {
      this.emisorBrillo.remove();
      this.emisorBrillo = null;
    }

    // Sonido de nivel completado
    if (this.sounds && this.sounds.nivelCompletado) {
      this.sounds.nivelCompletado.play();
    }

    // Efecto de partículas para celebración
    const particles = this.add.particles('particula');
    const emitter = particles.createEmitter({
      x: this.sys.game.config.width / 2,
      y: this.sys.game.config.height / 2,
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      gravityY: 100
    });

    // Emitir partículas
    emitter.explode(50);

    // Mensaje de nivel completado
    const mensaje = this.nivelActual < this.nivelesMax ?
      '¡Nivel completado! Preparando siguiente fase de contención...' :
      '¡Protocolo de contención completado! La estabilidad ha sido restaurada en NanoTerra.';

    // Mostrar mensaje con diseño educativo mejorado
    Swal.fire({
      title: null,
      html: `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Roboto:wght@300;400;500;600&display=swap');

          .swal2-popup {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
            font-family: 'Roboto', sans-serif !important;
            overflow: hidden !important;
          }

          .level-victory-container {
            padding: 0 !important;
            text-align: center !important;
            position: relative !important;
          }

          .level-header-section {
            background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3) !important;
            background-size: 400% 400% !important;
            animation: gradientShift 3s ease infinite !important;
            padding: 25px 20px !important;
            position: relative !important;
            overflow: hidden !important;
          }

          .level-header-section::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.3"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/></circle><circle cx="80" cy="30" r="1.5" fill="white" opacity="0.4"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="60" cy="70" r="1" fill="white" opacity="0.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/></circle></svg>') !important;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .level-victory-title {
            font-family: 'Orbitron', monospace !important;
            font-size: 24px !important;
            font-weight: 900 !important;
            color: #ffffff !important;
            margin: 0 !important;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3) !important;
            letter-spacing: 2px !important;
            position: relative !important;
            z-index: 2 !important;
          }

          .level-victory-subtitle {
            font-family: 'Roboto', sans-serif !important;
            font-size: 12px !important;
            font-weight: 300 !important;
            color: rgba(255, 255, 255, 0.9) !important;
            margin-top: 5px !important;
            letter-spacing: 1px !important;
            position: relative !important;
            z-index: 2 !important;
          }

          .level-content-section {
            background: #ffffff !important;
            padding: 30px 25px !important;
            position: relative !important;
          }

          .level-achievement-badge {
            width: 60px !important;
            height: 60px !important;
            background: linear-gradient(45deg, #ffd700, #ffed4e) !important;
            border-radius: 50% !important;
            margin: -30px auto 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3) !important;
            position: relative !important;
            animation: pulse 2s ease-in-out infinite !important;
          }

          .level-achievement-badge::before {
            content: '⭐' !important;
            font-size: 30px !important;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .level-message {
            font-size: 16px !important;
            color: #333 !important;
            line-height: 1.5 !important;
            margin: 20px 0 !important;
            padding: 20px !important;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
            border-radius: 15px !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3) !important;
          }

          .level-progress-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 15px !important;
            padding: 20px !important;
            margin: 20px 0 !important;
            color: white !important;
            position: relative !important;
            overflow: hidden !important;
          }

          .level-progress-section::before {
            content: '🚀' !important;
            position: absolute !important;
            top: 10px !important;
            right: 15px !important;
            font-size: 20px !important;
            opacity: 0.7 !important;
          }

          .level-progress-title {
            font-family: 'Orbitron', monospace !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            margin-bottom: 10px !important;
            color: #ffd700 !important;
          }

          .level-progress-text {
            font-size: 13px !important;
            line-height: 1.5 !important;
            font-weight: 300 !important;
          }

          .swal2-confirm {
            background: linear-gradient(45deg, #667eea, #764ba2) !important;
            border: none !important;
            border-radius: 25px !important;
            font-family: 'Orbitron', monospace !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            color: #ffffff !important;
            padding: 12px 25px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
          }

          .swal2-confirm:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
          }
        </style>

        <div class="level-victory-container">
          <div class="level-header-section">
            <div class="level-victory-title">${this.nivelActual < this.nivelesMax ? '¡NIVEL SUPERADO!' : '¡MISIÓN COMPLETADA!'}</div>
            <div class="level-victory-subtitle">Fase ${this.nivelActual} - Protocolo NanoTerra</div>
          </div>

          <div class="level-content-section">
            <div class="level-achievement-badge"></div>

            <div class="level-message">
              ${mensaje}
            </div>

            <div class="level-progress-section">
              <div class="level-progress-title">Progreso de Misión</div>
              <div class="level-progress-text">
                Has completado ${this.nivelActual} de ${this.nivelesMax} fases de contención.
                ${this.nivelActual < this.nivelesMax ? '¡Continúa con la siguiente fase!' : '¡Protocolo completado exitosamente!'}
              </div>
            </div>
          </div>
        </div>
      `,
      icon: null,
      confirmButtonText: this.nivelActual < this.nivelesMax ? 'Siguiente Fase' : 'Finalizar',
      width: '450px',
      padding: '0',
      customClass: {
        popup: 'level-victory-popup'
      },
      buttonsStyling: false,
      allowOutsideClick: false
    }).then(() => {
      if (this.nivelActual < this.nivelesMax) {
        // Pasar al siguiente nivel
        this.nivelActual++;
        this.iniciarJuego();
      } else {
        // Juego completado, pasar a la siguiente escena
        if (this.sounds && this.sounds.transicionNivel) {
          this.sounds.transicionNivel.play();
        }
        // Pequeña pausa antes de la transición para que se escuche el sonido
        this.time.delayedCall(500, () => {
          this.scene.start("DroneRepairScene");
        });
      }
    });
  }

  gameOver() {
    // Detener el juego
    this.juegoActivo = false;
    this.replicacionTimer.remove();

    // Mostrar mensaje de game over
    Swal.fire({
      title: '¡Alerta de Replicación!',
      text: 'Los nanorrobots han superado la capacidad de contención. La estabilidad de NanoTerra está en riesgo.',
      icon: 'error',
      confirmButtonText: 'Reintentar',
      customClass: {
        container: 'custom-container-class',
        popup: 'custom-popup-class'
      }
    }).then(() => {
      // Reiniciar el nivel actual
      this.iniciarJuego();
    });
  }

  update() {
    if (!this.juegoActivo) return;

    // Mover los nanorrobots
    const nanorrobots = this.nanorrobotsGroup.getChildren();
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Límites del recuadro de nanobots para evitar que se salgan
    const recuadroWidth = Math.min(600, screenWidth * 0.7);
    const recuadroHeight = Math.min(350, screenHeight * 0.4);
    const recuadroX = screenWidth / 2;
    const recuadroY = screenHeight / 2;

    const margenInterno = 30;
    const limiteIzquierdo = recuadroX - (recuadroWidth/2 - margenInterno);
    const limiteDerecho = recuadroX + (recuadroWidth/2 - margenInterno);
    const limiteSuperior = recuadroY - (recuadroHeight/2 - margenInterno);
    const limiteInferior = recuadroY + (recuadroHeight/2 - margenInterno);

    for (let i = 0; i < nanorrobots.length; i++) {
      const nanorrobot = nanorrobots[i];

      // Solo mover si no está siendo arrastrado
      if (nanorrobot.input.dragState === 0) {
        nanorrobot.x += nanorrobot.velocidadX * 0.01;
        nanorrobot.y += nanorrobot.velocidadY * 0.01;

        // Rebotar en los bordes del recuadro
        if (nanorrobot.x < limiteIzquierdo || nanorrobot.x > limiteDerecho) {
          nanorrobot.velocidadX *= -1;
          // Asegurar que esté dentro del límite
          nanorrobot.x = Math.max(limiteIzquierdo, Math.min(limiteDerecho, nanorrobot.x));
        }
        if (nanorrobot.y < limiteSuperior || nanorrobot.y > limiteInferior) {
          nanorrobot.velocidadY *= -1;
          // Asegurar que esté dentro del límite
          nanorrobot.y = Math.max(limiteSuperior, Math.min(limiteInferior, nanorrobot.y));
        }
      }
    }
  }

  // Configurar eventos de interacción
  configurarEventos() {
    // Evento de inicio de arrastre
    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setTint(0xffff00); // Amarillo mientras se arrastra
      gameObject.setScale(1.1); // Aumentar tamaño moderadamente (reducido de 1.2 a 1.1)

      // Efecto de estela al arrastrar
      gameObject.estela = this.add.particles('particula').createEmitter({
        follow: gameObject,
        scale: { start: 0.2, end: 0 },
        speed: 20,
        lifespan: 200,
        blendMode: 'ADD',
        tint: 0xffff00,
        frequency: 50
      });
    });

    // Evento durante el arrastre
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    // Evento de fin de arrastre
    this.input.on('dragend', (pointer, gameObject) => {
      // Detener la estela
      if (gameObject.estela) {
        gameObject.estela.remove();
      }

      // Verificar si el nanorrobot está sobre el contenedor
      const bounds = this.zonaContenedor.getBounds();
      if (Phaser.Geom.Rectangle.Contains(bounds, gameObject.x, gameObject.y)) {
        // Nanorrobot contenido
        this.nanorrobotsControlados++;
        this.actualizarContadores();

        // Añadir puntos flotantes
        this.mostrarPuntos(gameObject.x, gameObject.y);

        // Efecto visual mejorado
        this.tweens.add({
          targets: gameObject,
          alpha: 0,
          scaleX: 0.1,
          scaleY: 0.1,
          duration: 300,
          onComplete: () => {
            // Explosión de partículas al ser contenido
            const particulas = this.add.particles('particula');
            const emisor = particulas.createEmitter({
              x: gameObject.x,
              y: gameObject.y,
              speed: { min: 50, max: 100 },
              angle: { min: 0, max: 360 },
              scale: { start: 0.4, end: 0 },
              blendMode: 'ADD',
              tint: [0x00ffff, 0x0088ff, 0x00ff88],
              lifespan: 500
            });

            // Emitir partículas y luego destruirlas
            emisor.explode(20);
            this.time.delayedCall(500, () => {
              particulas.destroy();
            });

            gameObject.destroy();
          }
        });

        // Intensificar el emisor del contenedor temporalmente
        this.emisorContenedor.setQuantity(10);
        this.emisorContenedor.setFrequency(50);
        this.time.delayedCall(500, () => {
          this.emisorContenedor.setQuantity(1);
          this.emisorContenedor.setFrequency(500);
        });

        // Sonido de captura
        if (this.sounds && this.sounds.capturaExitosa) {
        this.sounds.capturaExitosa.play();
      }

        // Verificar si se han contenido todos los nanorrobots
        if (this.nanorrobotsControlados >= this.nanorrobotsTotal) {
          this.nivelCompletado();
        }
      } else {
        // Volver a color normal y tamaño normal
        gameObject.setTint(0xff0000);
        gameObject.setScale(1);
      }
    });
  }

  // Método para mostrar puntos flotantes
  mostrarPuntos(x, y) {
    // Calcular puntos basados en el nivel actual (reducidos)
    const puntosGanados = 50 * this.nivelActual;

    // Incrementar contador global de puntos
    this.puntos += puntosGanados;

    // Sonido de puntos ganados
    if (this.sounds && this.sounds.puntosGanados) {
      this.sounds.puntosGanados.play();
    }

    // Actualizar texto de puntos con animación
    this.puntosTexto.setText(`Puntos: ${this.puntos}`);

    // Animación del contador de puntos
    this.tweens.add({
      targets: this.puntosTexto,
      scaleX: { from: 1, to: 1.3 },
      scaleY: { from: 1, to: 1.3 },
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });

    // Efecto de brillo en el contador
    this.tweens.add({
      targets: this.puntosTexto,
      alpha: { from: 1, to: 0.7 },
      duration: 150,
      yoyo: true,
      repeat: 1,
      ease: 'Power1'
    });

    // Cambio temporal de color para resaltar
    const colorOriginal = this.puntosTexto.style.fill;
    this.puntosTexto.setFill('#00ff88'); // Verde brillante

    this.time.delayedCall(400, () => {
      this.puntosTexto.setFill(colorOriginal); // Volver al color original
    });

    // Verificar si se alcanzó el bonus
    if (!this.bonusActivado && this.puntos >= this.puntosParaBonus) {
      this.activarBonus();
    }

    // Los puntos ya no determinan el completado del nivel
    // El nivel se completa cuando todos los nanobots están contenidos

    // Crear texto de puntos flotantes
    const puntosTexto = this.add.text(x, y, `+${puntosGanados}`, {
      font: '20px Orbitron',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Animación de puntos flotantes
    this.tweens.add({
      targets: puntosTexto,
      y: y - 50,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 1.5 },
      duration: 1000,
      onComplete: () => {
        puntosTexto.destroy();
      }
    });
  }

  // Método para activar el bonus al llegar a 500 puntos
  activarBonus() {
    this.bonusActivado = true;

    // Sonido de bonus activado
    if (this.sounds && this.sounds.bonusActivado) {
      this.sounds.bonusActivado.play();
    }

    // Mostrar mensaje de bonus
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Crear texto de bonus
    const bonusTexto = this.add.text(screenWidth / 2, screenHeight / 2, '¡BONUS ACTIVADO!', {
      font: '40px Orbitron',
      fill: '#ffff00',
      stroke: '#ff0000',
      strokeThickness: 6,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setDepth(100);

    // Efecto de partículas especiales
    const particulas = this.add.particles('particula');

    // Emisor circular
    const emisorCircular = particulas.createEmitter({
      x: screenWidth / 2,
      y: screenHeight / 2,
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      tint: [0xffff00, 0xff00ff, 0x00ffff, 0xff8800],
      lifespan: 2000,
      quantity: 5,
      frequency: 50
    });

    // Emisor radial
    const emisorRadial = particulas.createEmitter({
      x: screenWidth / 2,
      y: screenHeight / 2,
      speed: 150,
      angle: { min: 0, max: 360 },
      scale: { start: 0.4, end: 0 },
      blendMode: 'ADD',
      tint: 0xffff00,
      lifespan: 1000
    });

    // Emitir explosión radial
    emisorRadial.explode(50);

    // Animación de texto de bonus
    this.tweens.add({
      targets: bonusTexto,
      scale: { from: 0.5, to: 1.5 },
      yoyo: true,
      repeat: 2,
      duration: 500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Desaparecer texto
        this.tweens.add({
          targets: bonusTexto,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            bonusTexto.destroy();
          }
        });
      }
    });

    // Detener emisores después de un tiempo
    this.time.delayedCall(3000, () => {
      particulas.destroy();
    });

    // Aplicar efectos de bonus (por ejemplo, puntos extra)
    this.puntos += 100; // Añadir puntos extra como bonus
    this.actualizarContadores();

    // Efecto visual en el contador de puntos
    this.tweens.add({
      targets: this.contadorTexto,
      scale: { from: 1, to: 1.5 },
      yoyo: true,
      repeat: 3,
      duration: 200,
      ease: 'Sine.easeInOut'
    });
  }
}