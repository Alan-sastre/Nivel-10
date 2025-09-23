class DroneRepairScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DroneRepairScene' });
    this.score = 0;
    this.quizActive = false;
    this.nanobots = [];
    this.defectiveNanobots = [];
    this.particles = [];
    this.levelCompleted = false;
    this.animationEvents = [];
  }

  preload() {
    // No necesitamos cargar assets externos, usaremos gráficos generados
  }

  create() {
    // Obtener dimensiones dinámicas de la pantalla - mejorado para móviles
    this.screenWidth = this.sys.game.config.width;
    this.screenHeight = this.sys.game.config.height;
    
    // Detectar si es móvil y ajustar dimensiones
    this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    
    // Para móviles, usar las dimensiones reales del viewport si están disponibles
    if (this.isMobile) {
      const actualWidth = this.sys.game.canvas.width;
      const actualHeight = this.sys.game.canvas.height;
      
      // Usar las dimensiones reales si son diferentes a las configuradas
      if (actualWidth > 0 && actualHeight > 0) {
        this.screenWidth = actualWidth;
        this.screenHeight = actualHeight;
      }
    }

    // Fondo espacial con efecto cyberpunk
    this.createBackground();

    // Crear partículas flotantes
    this.createParticles();

    // Grid holográfico
    this.createHolographicGrid();

    // Título del nivel - posicionamiento dinámico mejorado para móviles
    const titleFontSize = this.isMobile ? 
      Math.min(24, this.screenWidth / 25) : 
      Math.min(32, this.screenWidth / 35);
    
    this.add.text(this.screenWidth / 2, this.screenHeight * 0.08, '🌌 LA INESTABILIDAD NANORROBÓTICA', {
      fontSize: titleFontSize + 'px',
      fontFamily: 'Orbitron, monospace',
      fill: '#00ffff',
      stroke: '#0066cc',
      strokeThickness: this.isMobile ? 1 : 2,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: this.isMobile ? 5 : 10, fill: true }
    }).setOrigin(0.5);

    const subtitleFontSize = this.isMobile ? 
      Math.min(18, this.screenWidth / 35) : 
      Math.min(24, this.screenWidth / 50);

    this.add.text(this.screenWidth / 2, this.screenHeight * 0.12, 'EN NANOTERRA', {
      fontSize: subtitleFontSize + 'px',
      fontFamily: 'Orbitron, monospace',
      fill: '#ff6600',
      stroke: '#cc3300',
      strokeThickness: this.isMobile ? 0.5 : 1,
      shadow: { offsetX: 0, offsetY: 0, color: '#ff6600', blur: this.isMobile ? 4 : 8, fill: true }
    }).setOrigin(0.5);

    // Pantalla holográfica de diagnóstico
    this.createDiagnosticScreen();

    // Crear nanobots iniciales
    this.createNanobots();

    // Crear quiz interactivo
    this.createQuiz();
  }

  createBackground() {
    // Fondo degradado espacial con dimensiones dinámicas
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000033, 0x000033, 0x001122, 0x001122, 1);
    bg.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Estrellas de fondo distribuidas dinámicamente
    const starCount = Math.floor((this.screenWidth * this.screenHeight) / 8000); // Densidad proporcional
    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(0, this.screenWidth);
      const y = Phaser.Math.Between(0, this.screenHeight);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff, 0.8);

      // Animación de parpadeo
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createParticles() {
    // Número de partículas proporcional al tamaño de pantalla
    const particleCount = Math.floor((this.screenWidth * this.screenHeight) / 20000);
    for (let i = 0; i < particleCount; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.screenWidth),
        Phaser.Math.Between(0, this.screenHeight),
        Phaser.Math.Between(2, 4),
        0x00ffff,
        0.6
      );

      this.particles.push(particle);

      // Movimiento flotante adaptado al tamaño de pantalla
      const moveRange = Math.min(this.screenWidth, this.screenHeight) * 0.08;
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-moveRange, moveRange),
        y: particle.y + Phaser.Math.Between(-moveRange * 0.6, moveRange * 0.6),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createHolographicGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x00ffff, 0.3);

    // Espaciado del grid proporcional al tamaño de pantalla
    const gridSpacing = Math.min(this.screenWidth, this.screenHeight) * 0.05;

    // Líneas verticales dinámicas
    for (let x = 0; x <= this.screenWidth; x += gridSpacing) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, this.screenHeight);
    }

    // Líneas horizontales dinámicas
    for (let y = 0; y <= this.screenHeight; y += gridSpacing) {
      graphics.moveTo(0, y);
      graphics.lineTo(this.screenWidth, y);
    }

    graphics.strokePath();

    // Efecto de parpadeo del grid
    this.tweens.add({
      targets: graphics,
      alpha: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1
    });
  }

  createDiagnosticScreen() {
    // Dimensiones dinámicas para la pantalla de diagnóstico - mejorado para móviles
    const screenWidth = this.isMobile ? this.screenWidth * 0.9 : this.screenWidth * 0.7;
    const screenHeight = this.isMobile ? this.screenHeight * 0.2 : this.screenHeight * 0.25;
    const screenX = (this.screenWidth - screenWidth) / 2;
    const screenY = this.isMobile ? this.screenHeight * 0.18 : this.screenHeight * 0.15;

    // Marco de la pantalla holográfica
    const screenBg = this.add.graphics();
    screenBg.fillStyle(0x001133, 0.8);
    screenBg.lineStyle(this.isMobile ? 1 : 2, 0x00ffff, 0.8);
    screenBg.fillRoundedRect(screenX, screenY, screenWidth, screenHeight, this.isMobile ? 5 : 10);
    screenBg.strokeRoundedRect(screenX, screenY, screenWidth, screenHeight, this.isMobile ? 5 : 10);

    // Título de diagnóstico con posición dinámica mejorado para móviles
    const diagnosticFontSize = this.isMobile ? 
      Math.min(14, this.screenWidth / 45) : 
      Math.min(18, this.screenWidth / 60);
    
    this.add.text(this.screenWidth / 2, screenY + screenHeight * 0.2, '🔬 SISTEMA DE DIAGNÓSTICO NANORROBÓTICO', {
      fontSize: diagnosticFontSize + 'px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Líneas de escaneo animadas mejoradas con posiciones dinámicas
    const scanLine1 = this.add.graphics();
    scanLine1.lineStyle(3, 0x00ff00, 0.9);
    const lineY1 = screenY + screenHeight * 0.4;
    scanLine1.moveTo(screenX + 10, lineY1);
    scanLine1.lineTo(screenX + screenWidth - 10, lineY1);
    scanLine1.strokePath();

    const scanLine2 = this.add.graphics();
    scanLine2.lineStyle(2, 0x00ffff, 0.6);
    const lineY2 = screenY + screenHeight * 0.55;
    scanLine2.moveTo(screenX + 10, lineY2);
    scanLine2.lineTo(screenX + screenWidth - 10, lineY2);
    scanLine2.strokePath();

    const scanLine3 = this.add.graphics();
    scanLine3.lineStyle(1, 0xffff00, 0.4);
    const lineY3 = screenY + screenHeight * 0.7;
    scanLine3.moveTo(screenX + 10, lineY3);
    scanLine3.lineTo(screenX + screenWidth - 10, lineY3);
    scanLine3.strokePath();

    // Animaciones de escaneo múltiples con rangos dinámicos
    const scanRangeY = screenY + screenHeight * 0.9;
    this.tweens.add({
      targets: scanLine1,
      y: scanRangeY,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: scanLine2,
      y: scanRangeY,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 300
    });

    this.tweens.add({
      targets: scanLine3,
      y: scanRangeY,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 600
    });

    // Efectos de pulso en las líneas
    this.tweens.add({
      targets: [scanLine1, scanLine2, scanLine3],
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Power2'
    });

    // Sonidos de escaneo simulados - continúa incluso después de completar el nivel
    this.scanEvent = this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.showScanMessage('🔍');
      },
      loop: true
    });

    // Estado del sistema con posición dinámica mejorado para móviles
    const statusFontSize = this.isMobile ? 
      Math.min(12, this.screenWidth / 55) : 
      Math.min(14, this.screenWidth / 70);
    
    this.statusText = this.add.text(this.screenWidth / 2, screenY + screenHeight * 0.6, 'ESTADO: ANALIZANDO NANOBOTS...', {
      fontSize: statusFontSize + 'px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ffff00'
    }).setOrigin(0.5);

    // Contador de nanobots con posición dinámica mejorado para móviles
    const countFontSize = this.isMobile ? 
      Math.min(10, this.screenWidth / 65) : 
      Math.min(12, this.screenWidth / 85);
    
    this.nanobotCount = this.add.text(this.screenWidth / 2, screenY + screenHeight * 0.8, 'NANOBOTS DETECTADOS: 0 NORMALES | 0 DEFECTUOSOS', {
      fontSize: countFontSize + 'px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createNanobots() {
    // Crear nanobots normales (azules)
    for (let i = 0; i < 8; i++) {
       const nanobot = this.createNanobotSVG(0x0066ff, false);

      // Distribuir nanobots evitando las áreas de los paneles
      let x, y;
      let validPosition = false;
      let attempts = 0;

      while (!validPosition && attempts < 50) {
        x = Math.random() * this.screenWidth;
        y = Math.random() * this.screenHeight;

        // Evitar área de la pantalla de diagnóstico (15% - 40% vertical)
        const diagnosticTop = this.screenHeight * 0.15;
        const diagnosticBottom = this.screenHeight * 0.40;

        // Evitar área del quiz (65% - 95% vertical)
        const quizTop = this.screenHeight * 0.65;
        const quizBottom = this.screenHeight * 0.95;

        // Verificar si está fuera de las áreas de los paneles
        if ((y < diagnosticTop || y > diagnosticBottom) &&
            (y < quizTop || y > quizBottom)) {
          validPosition = true;
        }

        attempts++;
      }

      // Si no se encuentra posición válida, usar áreas laterales
      if (!validPosition) {
        if (i % 2 === 0) {
          x = Math.random() * (this.screenWidth * 0.15); // Lado izquierdo
        } else {
          x = this.screenWidth * 0.85 + Math.random() * (this.screenWidth * 0.15); // Lado derecho
        }
        y = this.screenHeight * 0.05 + Math.random() * (this.screenHeight * 0.1); // Parte superior
      }

      nanobot.x = x;
      nanobot.y = y;

      this.nanobots.push(nanobot);
      this.animateNanobot(nanobot, false);
    }

    // Crear nanobots defectuosos (rojos)
    for (let i = 0; i < 4; i++) {
      const defectiveBot = this.createNanobotSVG(0xff3300, true);

      // Distribuir nanobots defectuosos también evitando paneles
      let x, y;
      let validPosition = false;
      let attempts = 0;

      while (!validPosition && attempts < 50) {
        x = Math.random() * this.screenWidth;
        y = Math.random() * this.screenHeight;

        // Evitar área de la pantalla de diagnóstico (15% - 40% vertical)
        const diagnosticTop = this.screenHeight * 0.15;
        const diagnosticBottom = this.screenHeight * 0.40;

        // Evitar área del quiz (65% - 95% vertical)
        const quizTop = this.screenHeight * 0.65;
        const quizBottom = this.screenHeight * 0.95;

        // Verificar si está fuera de las áreas de los paneles
        if ((y < diagnosticTop || y > diagnosticBottom) &&
            (y < quizTop || y > quizBottom)) {
          validPosition = true;
        }

        attempts++;
      }

      // Si no se encuentra posición válida, usar áreas laterales
      if (!validPosition) {
        if (i % 2 === 0) {
          x = Math.random() * (this.screenWidth * 0.15); // Lado izquierdo
        } else {
          x = this.screenWidth * 0.85 + Math.random() * (this.screenWidth * 0.15); // Lado derecho
        }
        y = this.screenHeight * 0.45 + Math.random() * (this.screenHeight * 0.15); // Área intermedia
      }

      defectiveBot.x = x;
      defectiveBot.y = y;

      this.defectiveNanobots.push(defectiveBot);
      this.animateNanobot(defectiveBot, true);
    }

    this.updateNanobotCount();
  }

  createNanobotSVG(color, isDefective) {
    const container = this.add.container(0, 0);
    const graphics = this.add.graphics();

    // Cuerpo principal (hexágono mejorado)
    graphics.fillStyle(color, 0.9);
    graphics.lineStyle(2, color, 1);

    const size = isDefective ? 10 : 8;
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      points.push({
        x: Math.cos(angle) * size,
        y: Math.sin(angle) * size
      });
    }

    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // Núcleo central pulsante
    const core = this.add.graphics();
    core.fillStyle(0xffffff, 1);
    core.fillCircle(0, 0, size * 0.4);

    // Anillo de energía
    const energyRing = this.add.graphics();
    energyRing.lineStyle(1, isDefective ? 0xff6600 : 0x00ffff, 0.8);
    energyRing.strokeCircle(0, 0, size * 0.7);

    // Brazos/antenas mejorados
    const arms = this.add.graphics();
    arms.lineStyle(2, color, 0.9);
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const startX = Math.cos(angle) * size;
      const startY = Math.sin(angle) * size;
      const endX = Math.cos(angle) * (size + 6);
      const endY = Math.sin(angle) * (size + 6);

      arms.moveTo(startX, startY);
      arms.lineTo(endX, endY);

      // Puntos de conexión
      arms.fillStyle(color, 1);
      arms.fillCircle(endX, endY, 1.5);
    }
    arms.strokePath();

    // Efecto de campo de energía
    const energyField = this.add.graphics();
    if (!isDefective) {
      energyField.fillStyle(0x00ffff, 0.2);
      energyField.fillCircle(0, 0, size * 2);
    } else {
      energyField.fillStyle(0xff3300, 0.3);
      energyField.fillCircle(0, 0, size * 1.8);
    }

    // Partículas orbitales
    const particles = [];
    for (let i = 0; i < 3; i++) {
      const particle = this.add.circle(0, 0, 1, isDefective ? 0xff6600 : 0x00ffff, 0.8);
      particles.push(particle);
      container.add(particle);

      // Animación orbital
      this.tweens.add({
        targets: particle,
        angle: 360,
        duration: 2000 + (i * 500),
        repeat: -1,
        ease: 'Linear'
      });

      const radius = size + 8 + (i * 3);
      particle.x = Math.cos((i * 120) * Math.PI / 180) * radius;
      particle.y = Math.sin((i * 120) * Math.PI / 180) * radius;
    }

    container.add([energyField, graphics, energyRing, arms, core]);

    // Animación del núcleo pulsante
    this.tweens.add({
      targets: core,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.7,
      duration: isDefective ? 300 : 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Animación del anillo de energía
    this.tweens.add({
      targets: energyRing,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.3,
      duration: isDefective ? 400 : 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Hacer clickeable
    container.setInteractive();
    container.on('pointerdown', () => {
      if (this.quizActive) return;

      // Efecto de escaneo al hacer clic
      this.showScanEffect(container);
      this.showScanMessage('🔍');

      // Pequeño retraso para mostrar el efecto de escaneo
      this.time.delayedCall(800, () => {
        this.selectedNanobot = container;
        this.showQuiz(isDefective);
      });
    });

    return container;
  }

  animateNanobot(nanobot, isDefective) {
    if (isDefective) {
      // Movimiento errático mejorado para nanobots defectuosos
      this.tweens.add({
        targets: nanobot,
        x: nanobot.x + Phaser.Math.Between(-120, 120),
        y: nanobot.y + Phaser.Math.Between(-60, 60),
        rotation: Phaser.Math.Between(-Math.PI * 2, Math.PI * 2),
        scaleX: Phaser.Math.FloatBetween(0.6, 1.6),
        scaleY: Phaser.Math.FloatBetween(0.6, 1.6),
        duration: Phaser.Math.Between(300, 1200),
        yoyo: true,
        repeat: -1,
        ease: 'Power3'
      });

      // Efecto glitch mejorado
      const errorEvent = this.time.addEvent({
        delay: Phaser.Math.Between(800, 2500),
        callback: () => {
          if (nanobot.active && !this.levelCompleted) {
            // Efecto de parpadeo múltiple
            for (let i = 0; i < 3; i++) {
              this.time.delayedCall(i * 80, () => {
                if (nanobot.active && !this.levelCompleted) {
                  nanobot.setAlpha(0.2);
                  this.time.delayedCall(40, () => {
                    if (nanobot.active && !this.levelCompleted) nanobot.setAlpha(1);
                  });
                }
              });
            }

            // Sonido de error simulado
            if (!this.levelCompleted) {
              this.showErrorMessage('⚠️ ERROR DETECTADO');
            }
          }
        },
        loop: true
      });
       this.animationEvents.push(errorEvent);

      // Vibración adicional
      this.tweens.add({
        targets: nanobot,
        x: nanobot.x + 2,
        duration: 50,
        yoyo: true,
        repeat: -1,
        ease: 'Power1'
      });

    } else {
      // Movimiento suave mejorado para nanobots normales
      this.tweens.add({
        targets: nanobot,
        x: nanobot.x + Phaser.Math.Between(-40, 40),
        y: nanobot.y + Phaser.Math.Between(-25, 25),
        rotation: Math.PI * 2,
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Pulso de energía
      this.tweens.add({
        targets: nanobot,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Sonido de funcionamiento normal ocasional
      const normalEvent = this.time.addEvent({
        delay: Phaser.Math.Between(5000, 8000),
        callback: () => {
          if (nanobot.active && !this.levelCompleted) {
            this.showNormalMessage('✅ FUNCIONANDO');
          }
        },
        loop: true
      });
      this.animationEvents.push(normalEvent);
    }
  }

  createQuiz() {
    // Dimensiones dinámicas para el panel del quiz - mejorado para móviles
    const quizWidth = this.isMobile ? this.screenWidth * 0.95 : this.screenWidth * 0.8;
    const quizHeight = this.isMobile ? this.screenHeight * 0.35 : this.screenHeight * 0.3;
    const quizX = (this.screenWidth - quizWidth) / 2;
    const quizY = this.isMobile ? this.screenHeight * 0.45 : this.screenHeight * 0.50;

    // Panel del quiz con dimensiones dinámicas
    const quizBg = this.add.graphics();
    quizBg.fillStyle(0x000066, 0.9);
    quizBg.lineStyle(this.isMobile ? 1 : 2, 0xff6600, 0.8);
    quizBg.fillRoundedRect(quizX, quizY, quizWidth, quizHeight, this.isMobile ? 5 : 10);
    quizBg.strokeRoundedRect(quizX, quizY, quizWidth, quizHeight, this.isMobile ? 5 : 10);

    // Pregunta con posición dinámica mejorada para móviles
    const titleQuizFontSize = this.isMobile ? 
      Math.min(14, this.screenWidth / 50) : 
      Math.min(16, this.screenWidth / 65);
    
    this.add.text(this.screenWidth / 2, quizY + quizHeight * 0.15, '🧬 PROTOCOLO DE EMERGENCIA NANORROBÓTICA', {
      fontSize: titleQuizFontSize + 'px',
      fontFamily: 'Orbitron, monospace',
      fill: '#ff6600',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const questionFontSize = this.isMobile ? 
      Math.min(12, this.screenWidth / 60) : 
      Math.min(14, this.screenWidth / 75);

    this.add.text(this.screenWidth / 2, quizY + quizHeight * 0.35, '¿Cuál es el protocolo correcto para detener la replicación descontrolada?', {
      fontSize: questionFontSize + 'px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ffffff',
      wordWrap: { width: quizWidth * 0.9 }
    }).setOrigin(0.5);

    // Opciones de respuesta
    const options = [
      { text: 'A) Activar protocolo de apoptosis programada', correct: true },
      { text: 'B) Aumentar la temperatura del sistema', correct: false },
      { text: 'C) Desconectar la fuente de energía', correct: false },
      { text: 'D) Introducir más nanobots de control', correct: false }
    ];

    options.forEach((option, index) => {
      const button = this.add.graphics();
      button.fillStyle(0x003366, 0.8);
      button.lineStyle(1, 0x00ffff, 0.6);

      // Dimensiones dinámicas para los botones - mejorado para móviles
      const buttonWidth = this.isMobile ? quizWidth * 0.9 : quizWidth * 0.45;
      const buttonHeight = this.isMobile ? quizHeight * 0.12 : quizHeight * 0.18;
      button.fillRoundedRect(0, 0, buttonWidth, buttonHeight, this.isMobile ? 3 : 5);
      button.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, this.isMobile ? 3 : 5);

      // Posicionamiento dinámico de los botones - mejorado para móviles
      let x, y;
      if (this.isMobile) {
        // En móviles, apilar verticalmente
        x = quizX + (quizWidth - buttonWidth) / 2;
        y = quizY + quizHeight * 0.5 + (index * (buttonHeight + 5));
      } else {
        // En desktop, mantener el layout 2x2
        x = index < 2 ? quizX + quizWidth * 0.05 : quizX + quizWidth * 0.5;
        y = index % 2 === 0 ? quizY + quizHeight * 0.55 : quizY + quizHeight * 0.78;
      }

      button.x = x;
      button.y = y;

      const buttonFontSize = this.isMobile ? 
        Math.min(10, this.screenWidth / 70) : 
        Math.min(12, this.screenWidth / 90);

      const text = this.add.text(x + buttonWidth / 2, y + buttonHeight / 2, option.text, {
        fontSize: buttonFontSize + 'px',
        fontFamily: 'Rajdhani, sans-serif',
        fill: '#ffffff'
      }).setOrigin(0.5);

      // Hacer clickeable
      button.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
      button.on('pointerdown', () => this.selectAnswer(option.correct, button, text));

      // Efecto hover
      button.on('pointerover', () => {
        button.clear();
        button.fillStyle(0x004488, 0.9);
        button.lineStyle(2, 0x00ffff, 0.8);
        button.fillRoundedRect(0, 0, buttonWidth, buttonHeight, this.isMobile ? 3 : 5);
        button.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, this.isMobile ? 3 : 5);
      });

      button.on('pointerout', () => {
        button.clear();
        button.fillStyle(0x003366, 0.8);
        button.lineStyle(1, 0x00ffff, 0.6);
        button.fillRoundedRect(0, 0, buttonWidth, buttonHeight, this.isMobile ? 3 : 5);
        button.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, this.isMobile ? 3 : 5);
      });
    });

    this.quizActive = true;
  }

  selectAnswer(isCorrect, button, text) {
    if (!this.quizActive) return;

    this.quizActive = false;

    if (isCorrect) {
      // Marcar nivel como completado para detener animaciones
      this.levelCompleted = true;

      // Detener todos los eventos de animación
      this.animationEvents.forEach(event => {
        if (event) {
          event.destroy();
        }
      });
      this.animationEvents = [];

      // Detener también el sonido de escaneo
      if (this.scanEvent) {
        this.scanEvent.destroy();
        this.scanEvent = null;
      }

      // Respuesta correcta
      button.clear();
      button.fillStyle(0x006600, 0.9);
      button.lineStyle(2, 0x00ff00, 1);
      button.fillRoundedRect(0, 0, 320, 30, 5);
      button.strokeRoundedRect(0, 0, 320, 30, 5);

      text.setFill('#00ff00');

      this.score += 50;
      this.statusText.setText('ESTADO: ✅ PROTOCOLO ACTIVADO - NANOBOTS NEUTRALIZADOS');

      // Solo reproducir sonido de felicitaciones
      if (this.sounds && this.sounds.success) {
        this.sounds.success();
      }

      // Mostrar mensaje sin sonido adicional
      this.time.delayedCall(300, () => {
        this.showSystemMessage('✅ NANOBOTS NEUTRALIZADOS EXITOSAMENTE');
      });

      // Mostrar retroalimentación positiva detallada
      // this.showPositiveFeedback(); // Eliminado - ahora se incorpora en completeLevel()

      // Efecto de desintegración de nanobots defectuosos sin sonido
      this.defectiveNanobots.forEach((nanobot, index) => {
        this.time.delayedCall(index * 200, () => {
          this.createDisintegrationEffect(nanobot.x, nanobot.y);
          nanobot.destroy();
        });
      });
      this.defectiveNanobots = [];

      this.updateNanobotCount();

      // Completar nivel después de un delay reducido
      this.time.delayedCall(800, () => {
        this.completeLevel();
      });

    } else {
      // Respuesta incorrecta
      button.clear();
      button.fillStyle(0x660000, 0.9);
      button.lineStyle(2, 0xff0000, 1);
      button.fillRoundedRect(0, 0, 320, 30, 5);
      button.strokeRoundedRect(0, 0, 320, 30, 5);

      text.setFill('#ff0000');

      this.statusText.setText('ESTADO: ❌ PROTOCOLO FALLIDO - REPLICACIÓN ACELERADA');

      // Reproducir sonido de error
      if (this.sounds && this.sounds.error) {
        this.sounds.error();
      }

      // Sonido de alerta
      this.time.delayedCall(200, () => {
        this.showSystemMessage('⚠️ ALERTA: REPLICACIÓN DESCONTROLADA DETECTADA');
        if (this.sounds && this.sounds.error) {
          this.sounds.error();
        }
      });

      // Multiplicar nanobots defectuosos
      this.multiplyDefectiveNanobots();

      // Reiniciar quiz después de un delay
      this.time.delayedCall(3000, () => {
        this.quizActive = true;
        this.statusText.setText('ESTADO: ANALIZANDO NANOBOTS...');
        this.showSystemMessage('🔄 SISTEMA REINICIADO - NUEVA OPORTUNIDAD');
      });
    }
  }

  createDisintegrationEffect(x, y) {
    // Crear partículas de desintegración
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(x, y, 2, 0x00ff00, 0.8);

      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-50, 50),
        y: y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        scale: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  multiplyDefectiveNanobots() {
    // Duplicar nanobots defectuosos
    const currentDefective = [...this.defectiveNanobots];
    currentDefective.forEach(nanobot => {
      const newBot = this.createNanobotSVG(0xff3300, true);
      newBot.x = nanobot.x + Phaser.Math.Between(-30, 30);
      newBot.y = nanobot.y + Phaser.Math.Between(-30, 30);
      this.defectiveNanobots.push(newBot);
      this.animateNanobot(newBot, true);

      // Efecto de aparición
      newBot.setScale(0);
      this.tweens.add({
        targets: newBot,
        scale: 1,
        duration: 500,
        ease: 'Back.easeOut'
      });
    });

    this.updateNanobotCount();
  }

  updateNanobotCount() {
    const normalCount = this.nanobots.length;
    const defectiveCount = this.defectiveNanobots.length;
    this.nanobotCount.setText(`NANOBOTS DETECTADOS: ${normalCount} NORMALES | ${defectiveCount} DEFECTUOSOS`);
  }

  createSounds() {
    // Crear contexto de audio
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {};

    // Crear sonidos sintéticos
    this.sounds.scan = this.createScanSound();
    this.sounds.error = this.createErrorSound();
    this.sounds.success = this.createSuccessSound();
    this.sounds.ambient = this.createAmbientSound();
  }

  createScanSound() {
    return () => {
      // Sonido de escaneo con mayor influencia
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator1.type = 'sine';
      oscillator2.type = 'triangle';

      // Acordes más prominentes (Do mayor)
      oscillator1.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // Do
      oscillator1.frequency.exponentialRampToValueAtTime(659.25, this.audioContext.currentTime + 0.6); // Mi

      oscillator2.frequency.setValueAtTime(659.25, this.audioContext.currentTime); // Mi
      oscillator2.frequency.exponentialRampToValueAtTime(783.99, this.audioContext.currentTime + 0.6); // Sol

      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, this.audioContext.currentTime + 0.6);

      oscillator1.start(this.audioContext.currentTime);
      oscillator2.start(this.audioContext.currentTime);
      oscillator1.stop(this.audioContext.currentTime + 0.6);
      oscillator2.stop(this.audioContext.currentTime + 0.6);
    };
  }

  createErrorSound() {
    return () => {
      // Sonido de error muy reducido
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator1.type = 'sine';
      oscillator2.type = 'triangle';

      // Acordes menores muy suaves (La menor)
      oscillator1.frequency.setValueAtTime(440, this.audioContext.currentTime); // La
      oscillator1.frequency.exponentialRampToValueAtTime(329.63, this.audioContext.currentTime + 0.15); // Mi

      oscillator2.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // Do
      oscillator2.frequency.exponentialRampToValueAtTime(392, this.audioContext.currentTime + 0.15); // Sol

      gainNode.gain.setValueAtTime(0.005, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

      oscillator1.start(this.audioContext.currentTime);
      oscillator2.start(this.audioContext.currentTime);
      oscillator1.stop(this.audioContext.currentTime + 0.15);
      oscillator2.stop(this.audioContext.currentTime + 0.15);
    };
  }

  createSuccessSound() {
    return () => {
      // Sonido de éxito épico y satisfactorio
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const oscillator3 = this.audioContext.createOscillator();
      const oscillator4 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator3.connect(gainNode);
      oscillator4.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator1.type = 'sine';
      oscillator2.type = 'triangle';
      oscillator3.type = 'sawtooth';
      oscillator4.type = 'sine';

      // Progresión épica ascendente (Do - Mi - Sol - Do - Mi - Sol - Do octava)
      const currentTime = this.audioContext.currentTime;

      // Melodía principal
      oscillator1.frequency.setValueAtTime(523.25, currentTime); // Do
      oscillator1.frequency.setValueAtTime(659.25, currentTime + 0.1); // Mi
      oscillator1.frequency.setValueAtTime(783.99, currentTime + 0.2); // Sol
      oscillator1.frequency.setValueAtTime(1046.50, currentTime + 0.3); // Do octava
      oscillator1.frequency.setValueAtTime(1318.51, currentTime + 0.4); // Mi octava
      oscillator1.frequency.setValueAtTime(1567.98, currentTime + 0.5); // Sol octava
      oscillator1.frequency.setValueAtTime(2093.00, currentTime + 0.6); // Do doble octava

      // Armonía
      oscillator2.frequency.setValueAtTime(659.25, currentTime); // Mi
      oscillator2.frequency.setValueAtTime(783.99, currentTime + 0.1); // Sol
      oscillator2.frequency.setValueAtTime(1046.50, currentTime + 0.2); // Do octava
      oscillator2.frequency.setValueAtTime(1318.51, currentTime + 0.3); // Mi octava
      oscillator2.frequency.setValueAtTime(1567.98, currentTime + 0.4); // Sol octava
      oscillator2.frequency.setValueAtTime(2093.00, currentTime + 0.5); // Do doble octava
      oscillator2.frequency.setValueAtTime(2637.02, currentTime + 0.6); // Mi doble octava

      // Bajo
      oscillator3.frequency.setValueAtTime(261.63, currentTime); // Do grave
      oscillator3.frequency.setValueAtTime(329.63, currentTime + 0.2); // Mi grave
      oscillator3.frequency.setValueAtTime(392.00, currentTime + 0.4); // Sol grave
      oscillator3.frequency.setValueAtTime(523.25, currentTime + 0.6); // Do

      // Efecto brillante
      oscillator4.frequency.setValueAtTime(1046.50, currentTime); // Do octava
      oscillator4.frequency.setValueAtTime(2093.00, currentTime + 0.3); // Do doble octava
      oscillator4.frequency.setValueAtTime(4186.01, currentTime + 0.6); // Do triple octava

      // Envelope dinámico
      gainNode.gain.setValueAtTime(0.01, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.015, currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.02, currentTime + 0.6);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 1.0);

      oscillator1.start(currentTime);
      oscillator2.start(currentTime);
      oscillator3.start(currentTime);
      oscillator4.start(currentTime);

      oscillator1.stop(currentTime + 1.0);
      oscillator2.stop(currentTime + 1.0);
      oscillator3.stop(currentTime + 1.0);
      oscillator4.stop(currentTime + 1.0);
    };
  }

  createAmbientSound() {
    return () => {
      // Sonido deshabilitado
    };
  }

  createAmbientEffects() {
    // Efectos de sonido ambiente mejorados
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.playAmbientSound();
        this.showAmbientEffect();
      },
      loop: true
    });

    // Sonidos de sistema aleatorios
    this.time.addEvent({
      delay: Phaser.Math.Between(8000, 15000),
      callback: () => {
        this.playSystemSound();
      },
      loop: true
    });
  }

  playStartupSound() {
    // Sonido deshabilitado
  }

  playAmbientSound() {
    if (this.sounds && this.sounds.ambient) {
      this.sounds.ambient();
    }
  }

  playSystemSound() {
    const systemMessages = [
      '💻 SISTEMA OPERATIVO',
      '🔍',
      '📊 MONITOREANDO NANOBOTS',
      '⚙️ ANÁLISIS EN PROGRESO',
      '✅ SISTEMAS ESTABLES'
    ];

    const randomMessage = Phaser.Utils.Array.GetRandom(systemMessages);
    this.showSystemMessage(randomMessage);
  }

  showSystemMessage(message) {
    const systemText = this.add.text(50, 570, message, {
      fontSize: '12px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ffff',
      alpha: 0
    });

    this.tweens.add({
      targets: systemText,
      alpha: 0.8,
      duration: 300,
      ease: 'Power2'
    });

    this.tweens.add({
      targets: systemText,
      alpha: 0,
      duration: 500,
      delay: 2000,
      ease: 'Power2',
      onComplete: () => systemText.destroy()
    });
  }

  showAmbientEffect() {
    // Crear efecto visual ambiente
    const ambientParticle = this.add.circle(
      Phaser.Math.Between(50, 750),
      Phaser.Math.Between(50, 550),
      Phaser.Math.Between(1, 3),
      0x00ffff,
      0.6
    );

    this.tweens.add({
      targets: ambientParticle,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => ambientParticle.destroy()
    });
   }



  completeLevel() {
    // Solo reproducir sonido de felicitaciones
    if (this.sounds && this.sounds.success) {
      this.sounds.success();
    }

    // Mostrar mensaje de completado mejorado centrado
    const completeBg = this.add.graphics();
    completeBg.fillStyle(0x000000, 0.95);
    completeBg.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Efecto de partículas de celebración
    this.createCelebrationParticles();

    // Título principal de felicitaciones
    this.add.text(this.screenWidth / 2, this.screenHeight * 0.15, '🎉 ¡FELICITACIONES! 🎉', {
      fontSize: Math.min(32, this.screenWidth / 25) + 'px',
      fill: '#ffff00',
      fontFamily: 'Orbitron',
      fontWeight: 'bold',
      stroke: '#ff6600',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Subtítulo de misión completada
    this.add.text(this.screenWidth / 2, this.screenHeight * 0.25, '🌟 MISIÓN COMPLETADA CON ÉXITO 🌟', {
      fontSize: Math.min(20, this.screenWidth / 40) + 'px',
      fill: '#00ff00',
      fontFamily: 'Orbitron',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // RETROALIMENTACIÓN INCORPORADA
    const feedbackTitle = this.add.text(this.screenWidth / 2, this.screenHeight * 0.35, '🔍 Retroalimentación Técnica:', {
      fontSize: Math.min(18, this.screenWidth / 45) + 'px',
      fill: '#00ff00',
      fontFamily: 'Orbitron',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const feedbackMessage = this.add.text(this.screenWidth / 2, this.screenHeight * 0.45, '¡Correcto! La apoptosis programada evita que los nanorrobots se\nmultipliquen indefinidamente y garantiza su control seguro.\nEste protocolo es esencial en la nanotecnología médica moderna.', {
      fontSize: Math.min(14, this.screenWidth / 60) + 'px',
      fill: '#ffffff',
      fontFamily: 'Rajdhani, sans-serif',
      align: 'center',
      wordWrap: { width: this.screenWidth * 0.8 }
    }).setOrigin(0.5);

    this.add.text(this.screenWidth / 2, this.screenHeight * 0.58, '🧬 Crisis nanorrobótica neutralizada exitosamente', {
      fontSize: Math.min(16, this.screenWidth / 50) + 'px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ffff'
    }).setOrigin(0.5);

    // Botón de Siguiente Nivel - centrado dinámicamente
    const buttonWidth = this.screenWidth * 0.4;
    const buttonHeight = 50;
    const buttonX = (this.screenWidth - buttonWidth) / 2;
    const buttonY = this.screenHeight * 0.75;

    const nextLevelButton = this.add.graphics();
    nextLevelButton.fillStyle(0x006600, 0.9);
    nextLevelButton.lineStyle(3, 0x00ff00, 1);
    nextLevelButton.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
    nextLevelButton.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

    const nextLevelText = this.add.text(this.screenWidth / 2, buttonY + buttonHeight / 2, '🚀 HAZ CLICK PARA EL SIGUIENTE NIVEL', {
      fontSize: '16px',
      fontFamily: 'Orbitron, monospace',
      fill: '#ffffff',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Hacer el botón interactivo - centrado dinámicamente
    const nextLevelZone = this.add.zone(this.screenWidth / 2, buttonY + buttonHeight / 2, buttonWidth, buttonHeight).setInteractive();

    // Efectos hover del botón
    nextLevelZone.on('pointerover', () => {
      nextLevelButton.clear();
      nextLevelButton.fillStyle(0x00aa00, 1);
      nextLevelButton.lineStyle(3, 0x00ff00, 1);
      nextLevelButton.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
      nextLevelButton.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
      nextLevelText.setScale(1.1);
    });

    nextLevelZone.on('pointerout', () => {
      nextLevelButton.clear();
      nextLevelButton.fillStyle(0x006600, 0.9);
      nextLevelButton.lineStyle(3, 0x00ff00, 1);
      nextLevelButton.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
      nextLevelButton.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
      nextLevelText.setScale(1);
    });

    // Acción del botón
    nextLevelZone.on('pointerdown', () => {
      // Efecto de click
      this.tweens.add({
        targets: [nextLevelButton, nextLevelText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.scene.start('scenaVideo2');
        }
      });
    });

    // Animación de entrada del botón
    nextLevelButton.setAlpha(0);
    nextLevelText.setAlpha(0);

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [nextLevelButton, nextLevelText],
        alpha: 1,
        y: '-=10',
        duration: 500,
        ease: 'Back.easeOut'
      });

      // Animación de escala del texto
      this.tweens.add({
        targets: nextLevelText,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Animación de brillo del botón
      this.tweens.add({
        targets: nextLevelButton,
        alpha: 0.7,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Power2'
      });
    });

    // Sonido de victoria simulado
    this.showVictorySound();
  }

  showScanEffect(nanobot) {
    // Crear efecto de escaneo circular
    const scanRing = this.add.graphics();
    scanRing.lineStyle(3, 0x00ff00, 0.8);
    scanRing.strokeCircle(nanobot.x, nanobot.y, 20);

    // Animación del anillo de escaneo
    this.tweens.add({
      targets: scanRing,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => scanRing.destroy()
    });

    // Pulso del nanobot
    this.tweens.add({
      targets: nanobot,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      repeat: 1,
      ease: 'Power2'
    });
  }

  showScanMessage(message) {
    // Crear texto de mensaje de escaneo
    const messageText = this.add.text(this.cameras.main.centerX, 50, message, {
      fontSize: '18px',
      fill: '#00ff00',
      fontFamily: 'Orbitron',
      stroke: '#ffffff',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Animación del texto con efecto de typing
    this.tweens.add({
      targets: messageText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true,
      repeat: 2,
      ease: 'Power2'
    });

    // Desvanecer después de un tiempo
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: messageText,
        alpha: 0,
        y: messageText.y - 20,
        duration: 500,
        ease: 'Power2',
        onComplete: () => messageText.destroy()
      });
    });

    // Efecto de ondas de escaneo
    for (let i = 0; i < 2; i++) {
      this.time.delayedCall(i * 200, () => {
        const wave = this.add.circle(this.cameras.main.centerX, 50, 5, 0x00ff00, 0.5);
        this.tweens.add({
          targets: wave,
          scaleX: 4,
          scaleY: 4,
          alpha: 0,
          duration: 600,
          ease: 'Power2',
          onComplete: () => wave.destroy()
        });
      });
    }
  }

  showVictorySound() {
    // Efectos visuales de victoria
    const messages = [
      '🏆 ¡VICTORIA ALCANZADA!',
      '🎯 MISIÓN COMPLETADA',
      '⭐ PROTOCOLO DOMINADO'
    ];

    messages.forEach((message, index) => {
      this.time.delayedCall(index * 800, () => {
        const messageText = this.add.text(400, 450 + (index * 20), message, {
          fontSize: '14px',
          fontFamily: 'Rajdhani, sans-serif',
          fill: '#ffff00',
          alpha: 0
        }).setOrigin(0.5);

        this.tweens.add({
          targets: messageText,
          alpha: 1,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 400,
          ease: 'Back.easeOut'
        });

        this.tweens.add({
          targets: messageText,
          alpha: 0,
          duration: 600,
          delay: 1200,
          ease: 'Power2',
          onComplete: () => messageText.destroy()
        });
      });
    });
  }

  showErrorMessage(message) {
    // Crear texto de mensaje de error
    const messageText = this.add.text(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), message, {
      fontSize: '16px',
      fill: '#ff0000',
      fontFamily: 'Orbitron',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Animación del texto con vibración
    this.tweens.add({
      targets: messageText,
      x: messageText.x + Phaser.Math.Between(-10, 10),
      y: messageText.y - 30,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => messageText.destroy()
    });

    // Efecto de chispas de error
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 100, () => {
        const spark = this.add.circle(
          messageText.x + Phaser.Math.Between(-20, 20),
          messageText.y + Phaser.Math.Between(-20, 20),
          2, 0xff0000, 0.8
        );
        this.tweens.add({
          targets: spark,
          x: spark.x + Phaser.Math.Between(-30, 30),
          y: spark.y + Phaser.Math.Between(-30, 30),
          alpha: 0,
          duration: 800,
          ease: 'Power2',
          onComplete: () => spark.destroy()
        });
      });
    }
  }

  showNormalMessage(message) {
    // Crear texto de mensaje normal
    const messageText = this.add.text(Phaser.Math.Between(150, 650), Phaser.Math.Between(150, 450), message, {
      fontSize: '14px',
      fill: '#00ffff',
      fontFamily: 'Orbitron',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Animación suave del texto
    this.tweens.add({
      targets: messageText,
      y: messageText.y - 20,
      alpha: 0,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 2000,
      ease: 'Sine.easeOut',
      onComplete: () => messageText.destroy()
    });

    // Efecto de pulso suave
    const pulse = this.add.circle(messageText.x, messageText.y, 5, 0x00ffff, 0.4);
    this.tweens.add({
      targets: pulse,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 1500,
      ease: 'Sine.easeOut',
      onComplete: () => pulse.destroy()
    });
  }

  showPositiveFeedback() {
    // Panel de retroalimentación
    const feedbackBg = this.add.graphics();
    feedbackBg.fillStyle(0x003300, 0.95);
    feedbackBg.lineStyle(3, 0x00ff00, 0.8);
    feedbackBg.fillRoundedRect(100, 100, 600, 150, 15);
    feedbackBg.strokeRoundedRect(100, 100, 600, 150, 15);

    // Icono de éxito
    const successIcon = this.add.text(150, 140, '✔️', {
      fontSize: '32px'
    }).setOrigin(0.5);

    // Título de retroalimentación
    const feedbackTitle = this.add.text(400, 140, '🔍 Retroalimentación:', {
      fontSize: '18px',
      fill: '#00ff00',
      fontFamily: 'Orbitron',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Mensaje de retroalimentación detallado
    const feedbackMessage = this.add.text(400, 190, '¡Correcto! La apoptosis programada evita que los nanorrobots se\nmultipliquen indefinidamente y garantiza su control seguro.', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Rajdhani, sans-serif',
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5);

    // Mensaje adicional técnico
    const technicalNote = this.add.text(400, 220, 'Este protocolo es esencial en la nanotecnología médica moderna.', {
      fontSize: '12px',
      fill: '#00ffaa',
      fontFamily: 'Rajdhani, sans-serif',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Animación de entrada
    const feedbackElements = [feedbackBg, successIcon, feedbackTitle, feedbackMessage, technicalNote];
    feedbackElements.forEach((element, index) => {
      element.setAlpha(0);
      this.time.delayedCall(index * 200, () => {
        this.tweens.add({
          targets: element,
          alpha: 1,
          scaleX: element === feedbackBg ? 1 : { from: 0.8, to: 1 },
          scaleY: element === feedbackBg ? 1 : { from: 0.8, to: 1 },
          duration: 500,
          ease: 'Back.easeOut'
        });
      });
    });

    // Efecto de partículas de éxito
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 150, () => {
        const particle = this.add.circle(
          Phaser.Math.Between(120, 680),
          Phaser.Math.Between(120, 230),
          3, 0x00ff00, 0.8
        );
        this.tweens.add({
          targets: particle,
          y: particle.y - 30,
          alpha: 0,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => particle.destroy()
        });
      });
    }

    // Desvanecer después de 2.5 segundos
    this.time.delayedCall(2500, () => {
      feedbackElements.forEach(element => {
        this.tweens.add({
          targets: element,
          alpha: 0,
          y: element.y - 20,
          duration: 500,
          ease: 'Power2',
          onComplete: () => element.destroy()
        });
      });
    });
  }

  createCelebrationParticles() {
    // Crear partículas de celebración
    for (let i = 0; i < 50; i++) {
      const colors = [0x00ff00, 0xffff00, 0x00ffff, 0xff6600, 0xff0066];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const particle = this.add.circle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 500),
        Phaser.Math.Between(3, 8),
        color,
        0.8
      );

      // Animación de explosión
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-200, 200),
        y: particle.y + Phaser.Math.Between(-150, 150),
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: Phaser.Math.Between(1000, 2000),
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });

      // Rotación
      this.tweens.add({
        targets: particle,
        rotation: Math.PI * 4,
        duration: Phaser.Math.Between(1000, 2000),
        ease: 'Linear'
      });
    }

    // Estrellas de celebración
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const star = this.add.text(
          Phaser.Math.Between(50, 750),
          Phaser.Math.Between(50, 550),
          '⭐',
          {
            fontSize: Phaser.Math.Between(16, 32) + 'px',
            fill: '#ffff00'
          }
        );

        this.tweens.add({
          targets: star,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          rotation: Math.PI * 2,
          duration: 2000,
          ease: 'Power2',
          onComplete: () => star.destroy()
        });
      });
    }
  }

  update() {
    // Actualizar efectos de partículas
    this.particles.forEach(particle => {
      particle.rotation += 0.01;
    });
  }
}