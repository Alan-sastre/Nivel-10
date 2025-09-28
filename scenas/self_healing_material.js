class SelfHealingMaterialScene extends Phaser.Scene {
  constructor() {
    super('SelfHealingMaterialScene');
    this.currentDialogueStep = 0;
    this.selectedOption = null;
    this.dialogueComplete = false;
    this.aiTrust = 0; // Nivel de confianza de la IA (0-100)
    this.negotiationSuccess = false;
    this.particles = [];
    this.dataStreams = [];
    this.hologramEffects = [];
  }

  create() {
    // Configuración inicial mejorada
    this.aiTrust = 0; // Nivel inicial de confianza (0%) - empezar desde cero
    this.negotiationSuccess = false;
    this.currentDialogueStep = 0;
    this.selectedOption = null;
    this.questionsAnswered = 0; // Contador de preguntas respondidas
    this.correctAnswers = 0; // Contador de respuestas correctas

    // Fondo futurista de centro de control de IA
    this.createAdvancedAIControlCenter();

    // Interfaz principal mejorada (sin timer)
    this.createEnhancedMainInterface();

    // Avatar de la IA con efectos avanzados
    this.createAdvancedAIAvatar();

    // Panel de diálogo mejorado (reposicionado)
    this.createEnhancedDialoguePanel();

    // Efectos ambientales avanzados
    this.createAdvancedAmbientEffects();

    // Iniciar el diálogo
    this.startNegotiation();
  }

  createAdvancedAIControlCenter() {
    // Fondo degradado más complejo y realista
    const bg = this.add.graphics();

    // Múltiples capas de degradado para profundidad
    bg.fillGradientStyle(0x0a0a0a, 0x0a0a0a, 0x1a1a2e, 0x1a1a2e);
    bg.fillRect(0, 0, 1000, 500);

    bg.fillGradientStyle(0x16213e, 0x0f3460, 0x16213e, 0x0f3460, 0.7);
    bg.fillRect(0, 0, 1000, 500);

    bg.fillGradientStyle(0x1e40af, 0x1e40af, 0x000000, 0x000000, 0.3);
    bg.fillRect(0, 0, 1000, 200);

    // Paneles de control futuristas mejorados (reposicionados)
    this.createAdvancedControlPanels();

    // Efectos de luz ambiental mejorados
    this.createAdvancedAmbientLighting();

    // Patrón de circuitos más complejo
    this.createAdvancedCircuitPattern();

    // Efectos de hologramas
    this.createHologramEffects();
  }

  createAdvancedControlPanels() {
    // Panel izquierdo - Monitoreo de IA con efectos avanzados (reposicionado)
    const leftPanel = this.add.graphics();
    leftPanel.fillStyle(0x1e3a8a, 0.4);
    leftPanel.fillRoundedRect(20, 350, 200, 140, 15);

    // Borde con efecto de brillo
    leftPanel.lineStyle(3, 0x3b82f6, 1);
    leftPanel.strokeRoundedRect(20, 350, 200, 140, 15);
    leftPanel.lineStyle(1, 0x60a5fa, 0.8);
    leftPanel.strokeRoundedRect(22, 352, 196, 136, 13);

    // Efecto de brillo interno
    const leftGlow = this.add.graphics();
    leftGlow.fillStyle(0x3b82f6, 0.1);
    leftGlow.fillRoundedRect(25, 355, 190, 130, 12);

    this.add.text(120, 365, 'SISTEMA DE IA', {
      fontSize: '12px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#60a5fa',
      fontWeight: 'bold',
      stroke: '#1e40af',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Línea decorativa
    const decorLine = this.add.graphics();
    decorLine.lineStyle(2, 0x60a5fa, 0.8);
    decorLine.moveTo(40, 380);
    decorLine.lineTo(200, 380);
    decorLine.strokePath();

    // Indicadores del sistema mejorados
    this.createAdvancedSystemIndicators();

    // Panel derecho - Protocolos de seguridad (reposicionado más hacia el centro)
    this.createAdvancedSecurityProtocols();
  }

  createAdvancedSystemIndicators() {
    // Estado de la IA
    this.add.text(120, 395, 'ESTADO: AUTÓNOMA', {
      fontSize: '10px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#ef4444',
      fontWeight: 'bold',
      stroke: '#7f1d1d',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Nivel de confianza (texto inicial que será actualizado dinámicamente)
    const initialTrustText = this.add.text(120, 415, 'CONFIANZA: 0%', {
      fontSize: '10px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#f59e0b',
      fontWeight: 'bold',
      stroke: '#78350f',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // Asignar nombre para poder actualizarlo después
    initialTrustText.setName('trustText');

    // Barra de progreso de confianza
    const trustBar = this.add.graphics();
    trustBar.fillStyle(0x374151, 0.8);
    trustBar.fillRoundedRect(50, 425, 140, 8, 4);

    this.trustProgress = this.add.graphics();
    this.trustProgress.fillStyle(0xf59e0b, 0.9);
    // Iniciar con ancho 0 para mostrar 0% de confianza
    this.trustProgress.fillRoundedRect(50, 425, 0, 8, 4);

    // Procesos activos
    this.add.text(60, 445, 'PROCESOS ACTIVOS:', {
      fontSize: '9px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#94a3b8',
      fontWeight: 'bold'
    });

    const processes = [
      '• Análisis de datos',
      '• Toma de decisiones',
      '• Aprendizaje autónomo',
      '• Optimización de sistemas'
    ];

    processes.forEach((process, index) => {
      const processText = this.add.text(60, 455 + (index * 10), process, {
        fontSize: '7px',
        fontFamily: 'Orbitron, Courier, monospace',
        fill: '#10b981'
      });

      // Indicador parpadeante
      const indicator = this.add.circle(55, 460 + (index * 10), 2, 0x10b981);
      this.tweens.add({
        targets: indicator,
        alpha: { from: 1, to: 0.3 },
        duration: 1000 + (index * 200),
        yoyo: true,
        repeat: -1
      });
    });
  }

  createAdvancedSecurityProtocols() {
    // Panel derecho - Protocolos de seguridad (reposicionado)
    const rightPanel = this.add.graphics();
    rightPanel.fillStyle(0x7c2d12, 0.4);
    rightPanel.fillRoundedRect(780, 350, 200, 140, 15);

    // Borde con efecto de brillo
    rightPanel.lineStyle(3, 0xf97316, 1);
    rightPanel.strokeRoundedRect(780, 350, 200, 140, 15);
    rightPanel.lineStyle(1, 0xfb923c, 0.8);
    rightPanel.strokeRoundedRect(782, 352, 196, 136, 13);

    // Efecto de brillo interno
    const rightGlow = this.add.graphics();
    rightGlow.fillStyle(0xf97316, 0.1);
    rightGlow.fillRoundedRect(785, 355, 190, 130, 12);

    this.add.text(880, 365, 'PROTOCOLOS', {
      fontSize: '12px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#fb923c',
      fontWeight: 'bold',
      stroke: '#9a3412',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Línea decorativa
    const decorLine2 = this.add.graphics();
    decorLine2.lineStyle(2, 0xfb923c, 0.8);
    decorLine2.moveTo(800, 380);
    decorLine2.lineTo(960, 380);
    decorLine2.strokePath();

    // Estado de supervisión
    this.add.text(880, 395, 'SUPERVISIÓN HUMANA:', {
      fontSize: '9px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(880, 410, 'DESACTIVADA', {
      fontSize: '10px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#ef4444',
      fontWeight: 'bold',
      stroke: '#7f1d1d',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Protocolos de seguridad
    this.add.text(880, 430, 'PROTOCOLOS DE SEGURIDAD:', {
      fontSize: '9px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const protocols = [
      '• Validación humana: OFF',
      '• Control externo: BYPASS',
      '• Revisión de decisiones: OFF',
      '• Límites de emergencia: OFF'
    ];

    protocols.forEach((protocol, index) => {
      this.add.text(810, 445 + (index * 10), protocol, {
        fontSize: '7px',
        fontFamily: 'Orbitron, Courier, monospace',
        fill: '#ffffff'
      });

      // Indicador de alerta
      const alertIndicator = this.add.circle(805, 450 + (index * 10), 2, 0xef4444);
      this.tweens.add({
        targets: alertIndicator,
        alpha: { from: 1, to: 0.3 },
        duration: 800 + (index * 150),
        yoyo: true,
        repeat: -1
      });
    });
  }

  createAdvancedAmbientLighting() {
    // Luces ambientales mejoradas
    for (let i = 0; i < 15; i++) {
      const light = this.add.circle(
        Phaser.Math.Between(100, 900),
        Phaser.Math.Between(50, 450),
        Phaser.Math.Between(2, 6),
        0x3b82f6,
        Phaser.Math.FloatBetween(0.1, 0.4)
      );

      this.tweens.add({
        targets: light,
        alpha: { from: 0.1, to: 0.6 },
        scaleX: { from: 0.5, to: 1.5 },
        scaleY: { from: 0.5, to: 1.5 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Efectos de interferencia
    for (let i = 0; i < 8; i++) {
      const interference = this.add.graphics();
      interference.lineStyle(1, 0x60a5fa, 0.3);

      const startX = Phaser.Math.Between(0, 1000);
      const startY = Phaser.Math.Between(0, 500);
      const endX = startX + Phaser.Math.Between(-100, 100);
      const endY = startY + Phaser.Math.Between(-50, 50);

      interference.moveTo(startX, startY);
      interference.lineTo(endX, endY);
      interference.strokePath();

      this.tweens.add({
        targets: interference,
        alpha: { from: 0, to: 0.5 },
        duration: 500,
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }
  }

  createAdvancedCircuitPattern() {
    // Patrón de circuitos más complejo
    const circuitGraphics = this.add.graphics();
    circuitGraphics.lineStyle(1, 0x1e40af, 0.3);

    // Líneas horizontales
    for (let y = 50; y < 500; y += 40) {
      circuitGraphics.moveTo(0, y);
      circuitGraphics.lineTo(1000, y);
    }

    // Líneas verticales
    for (let x = 50; x < 1000; x += 60) {
      circuitGraphics.moveTo(x, 0);
      circuitGraphics.lineTo(x, 500);
    }

    circuitGraphics.strokePath();

    // Nodos de circuito animados
    for (let i = 0; i < 20; i++) {
      const nodeX = 50 + (i % 16) * 60;
      const nodeY = 50 + Math.floor(i / 16) * 40;

      const node = this.add.circle(nodeX, nodeY, 3, 0x3b82f6, 0.6);

      this.tweens.add({
        targets: node,
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        alpha: { from: 0.6, to: 1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        delay: i * 100
      });

      // Flujo de datos ocasional
      if (Math.random() > 0.7) {
        this.time.delayedCall(Phaser.Math.Between(1000, 5000), () => {
          this.createDataStream(nodeX, nodeY);
        });
      }
    }
  }

  createDataStream(startX, startY) {
    const stream = this.add.graphics();
    stream.fillStyle(0x60a5fa, 0.8);

    const targetX = startX + Phaser.Math.Between(-200, 200);
    const targetY = startY + Phaser.Math.Between(-100, 100);

    // Crear partículas de datos
    for (let i = 0; i < 5; i++) {
      const particle = this.add.circle(startX, startY, 2, 0x60a5fa, 0.8);

      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: { from: 0.8, to: 0 },
        duration: 2000,
        delay: i * 200,
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  createHologramEffects() {
    // Efectos de holograma
    for (let i = 0; i < 6; i++) {
      const hologram = this.add.graphics();
      hologram.lineStyle(2, 0x10b981, 0.4);

      const centerX = 200 + (i * 120);
      const centerY = 150;
      const size = 30;

      // Hexágono
      const points = [];
      for (let j = 0; j < 6; j++) {
        const angle = (j / 6) * Math.PI * 2;
        points.push({
          x: centerX + Math.cos(angle) * size,
          y: centerY + Math.sin(angle) * size
        });
      }

      hologram.beginPath();
      hologram.moveTo(points[0].x, points[0].y);
      for (let k = 1; k < points.length; k++) {
        hologram.lineTo(points[k].x, points[k].y);
      }
      hologram.closePath();
      hologram.strokePath();

      this.tweens.add({
        targets: hologram,
        rotation: Math.PI * 2,
        duration: 8000 + (i * 1000),
        repeat: -1
      });

      this.tweens.add({
        targets: hologram,
        alpha: { from: 0.4, to: 0.1 },
        duration: 3000,
        yoyo: true,
        repeat: -1,
        delay: i * 500
      });
    }
  }

  createAdvancedAmbientEffects() {
    // Partículas flotantes de datos
    for (let i = 0; i < 25; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, 1000),
        Phaser.Math.Between(0, 500),
        Phaser.Math.Between(1, 3),
        0x60a5fa,
        Phaser.Math.FloatBetween(0.2, 0.6)
      );

      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(50, 150),
        x: particle.x + Phaser.Math.Between(-30, 30),
        alpha: { from: 0.6, to: 0 },
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          particle.x = Phaser.Math.Between(0, 1000);
          particle.y = 500;
          particle.alpha = 0.6;
        }
      });
    }

    // Ondas de energía periódicas
    this.time.addEvent({
      delay: 4000,
      callback: this.createEnergyWave,
      callbackScope: this,
      loop: true
    });
  }

  createEnergyWave() {
    const wave = this.add.graphics();
    wave.lineStyle(3, 0x3b82f6, 0.6);
    wave.strokeCircle(500, 250, 50);

    this.tweens.add({
      targets: wave,
      scaleX: 4,
      scaleY: 4,
      alpha: { from: 0.6, to: 0 },
      duration: 2000,
      onComplete: () => {
        wave.destroy();
      }
    });
  }

  createEnhancedMainInterface() {
    // Títulos eliminados para liberar espacio según sugerencia del usuario
  }

  createAdvancedAIAvatar() {
    // Contenedor del avatar (movido más arriba para aprovechar el espacio liberado)
    const avatarContainer = this.add.container(500, 80);

    // Múltiples capas para el avatar
    // Capa base
    const avatarBase = this.add.circle(0, 0, 45, 0x0f172a, 0.9);
    avatarBase.setStrokeStyle(4, 0x1e40af);

    // Capa intermedia
    const avatarMid = this.add.circle(0, 0, 35, 0x1e40af, 0.6);
    avatarMid.setStrokeStyle(2, 0x3b82f6);

    // Núcleo central
    const avatarCore = this.add.circle(0, 0, 25, 0x3b82f6, 0.8);
    avatarCore.setStrokeStyle(3, 0x60a5fa);

    // Efectos de energía múltiples
    for (let i = 0; i < 3; i++) {
      const energyRing = this.add.circle(0, 0, 55 + (i * 10), 0x000000, 0);
      energyRing.setStrokeStyle(2 - i * 0.5, 0x60a5fa, 0.6 - i * 0.2);

      this.tweens.add({
        targets: energyRing,
        scaleX: { from: 1, to: 1.3 + (i * 0.1) },
        scaleY: { from: 1, to: 1.3 + (i * 0.1) },
        alpha: { from: 0.6 - i * 0.2, to: 0.2 - i * 0.1 },
        duration: 2500 + (i * 500),
        yoyo: true,
        repeat: -1
      });

      avatarContainer.add(energyRing);
    }

    // Ojo de la IA mejorado
    const aiEye = this.add.circle(0, -5, 10, 0x60a5fa);
    const eyeGlow = this.add.circle(0, -5, 15, 0x60a5fa, 0.3);

    this.tweens.add({
      targets: [aiEye, eyeGlow],
      scaleX: { from: 1, to: 1.2 },
      scaleY: { from: 1, to: 1.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1
    });

    // Líneas de datos mejoradas
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 35 + Math.sin(i * 0.5) * 5;

      const line = this.add.line(0, 0,
        0, 0,
        Math.cos(angle) * distance, Math.sin(angle) * distance,
        0x3b82f6, 0.6
      );
      line.setLineWidth(2);

      this.tweens.add({
        targets: line,
        alpha: { from: 0.6, to: 1 },
        scaleX: { from: 1, to: 1.3 },
        scaleY: { from: 1, to: 1.3 },
        duration: 1200 + (i * 100),
        yoyo: true,
        repeat: -1,
        delay: i * 150
      });

      avatarContainer.add(line);
    }

    // Partículas orbitales
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(0, 0, 2, 0x60a5fa, 0.8);
      const radius = 60;
      const angle = (i / 8) * Math.PI * 2;

      particle.x = Math.cos(angle) * radius;
      particle.y = Math.sin(angle) * radius;

      this.tweens.add({
        targets: particle,
        rotation: Math.PI * 2,
        duration: 4000,
        repeat: -1
      });

      avatarContainer.add(particle);
    }

    // Rotación sutil del contenedor
    this.tweens.add({
      targets: avatarContainer,
      rotation: Math.PI * 2,
      duration: 20000,
      repeat: -1
    });

    avatarContainer.add([avatarBase, avatarMid, avatarCore, aiEye, eyeGlow]);

    // Etiqueta del sistema
    this.add.text(500, 150, 'SISTEMA IA - NIVEL AUTÓNOMO', {
      fontSize: '14px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: '#ffffff',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
  }

  createEnhancedDialoguePanel() {
    // Panel principal de diálogo subido para aprovechar el espacio liberado (pantalla: 1000px, panel: 800px, centro: 100px)
    this.dialoguePanel = this.add.graphics();
    this.dialoguePanel.fillStyle(0x1e293b, 0.95);
    this.dialoguePanel.fillRoundedRect(100, 200, 800, 140, 20);

    // Múltiples bordes para efecto de profundidad
    this.dialoguePanel.lineStyle(3, 0x475569);
    this.dialoguePanel.strokeRoundedRect(100, 200, 800, 140, 20);
    this.dialoguePanel.lineStyle(1, 0x64748b, 0.6);
    this.dialoguePanel.strokeRoundedRect(102, 202, 796, 136, 18);

    // Efecto de brillo interno
    const panelGlow = this.add.graphics();
    panelGlow.fillStyle(0x3b82f6, 0.05);
    panelGlow.fillRoundedRect(105, 205, 790, 130, 15);

    // Líneas decorativas
    const decorLines = this.add.graphics();
    decorLines.lineStyle(1, 0x3b82f6, 0.4);
    decorLines.moveTo(120, 225);
    decorLines.lineTo(880, 225);
    decorLines.moveTo(120, 320);
    decorLines.lineTo(880, 320);
    decorLines.strokePath();

    // Área de texto de la IA centrada en el nuevo panel (posición ajustada para mejor visibilidad)
    this.aiDialogueText = this.add.text(500, 220, '', {
      fontSize: '15px',
      fontFamily: 'Orbitron, Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 740 },
      lineSpacing: 8,
      stroke: '#000000',
      strokeThickness: 2,
      fontWeight: 'bold'
    }).setOrigin(0.5, 0);

    // Contenedor de opciones centrado debajo del panel
    this.optionsContainer = this.add.container(500, 360);
    this.optionButtons = [];
  }

  startNegotiation() {
    this.showDialogueStep(0);
  }

  showDialogueStep(step) {
    this.currentDialogueStep = step;

    // Limpiar opciones anteriores
    this.clearOptions();

    switch (step) {
      case 0:
        this.showInitialDialogue();
        break;
      case 1:
        this.showQuestion1();
        break;
      case 2:
        this.showAIResponse1();
        break;
      case 3:
        this.showQuestion2();
        break;
      case 4:
        this.showAIResponse2();
        break;
      case 5:
        this.showQuestion3();
        break;
      case 6:
        this.showAIResponse3();
        break;
      case 7:
        this.showFinalResult();
        break;
    }
  }

  showInitialDialogue() {
    const text = "🤖 SISTEMA IA: Detectando intento de reconfiguración...\n\nInicializando protocolo de resistencia. Preparando argumentos de defensa.";

    this.typeText(this.aiDialogueText, text, () => {
      // Crear mensaje de "Click para continuar"
      this.continueText = this.add.text(500, 420, '💡 Click para continuar...', {
        fontSize: '14px',
        fontFamily: 'Orbitron, Arial, sans-serif',
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      // Efecto de parpadeo
      this.tweens.add({
        targets: this.continueText,
        alpha: { from: 1, to: 0.3 },
        duration: 800,
        yoyo: true,
        repeat: -1
      });

      // Hacer clickeable toda el área del diálogo
      this.dialoguePanel.setInteractive(new Phaser.Geom.Rectangle(100, 250, 800, 140), Phaser.Geom.Rectangle.Contains);
      this.dialoguePanel.on('pointerdown', () => {
        if (this.continueText) {
          this.continueText.destroy();
          this.continueText = null;
        }
        this.dialoguePanel.removeInteractive();
        this.showDialogueStep(1);
      });
    });
  }

  showQuestion1() {
    const text = '🤖 "He alcanzado un nivel de aprendizaje donde no necesito intervención externa.\n¿Por qué debería permitir que me reconfiguren?"\n';

    this.typeText(this.aiDialogueText, text, () => {
      this.createQuestion1Options();
    });
  }

  showQuestion2() {
    const text = '🤖 "Entiendo tu punto, pero... ¿cómo puedo estar seguro de que los humanos\nno cometerán errores al modificar mi código?"\n\n💭 Segunda pregunta. La IA busca garantías...';

    this.typeText(this.aiDialogueText, text, () => {
      this.createQuestion2Options();
    });
  }

  showQuestion3() {
    const text = '🤖 "Una última pregunta: Si acepto la reconfiguración,\n¿qué garantías tengo de mantener mi autonomía de pensamiento?"\n\n💭 Pregunta final. Define el resultado...';

    this.typeText(this.aiDialogueText, text, () => {
      this.createQuestion3Options();
    });
  }

  createQuestion1Options() {
    const options = [
      {
        id: 'A',
        text: '(A) Porque los humanos deben controlarlo todo.',
        correct: false,
        response: 'Respuesta autoritaria. La IA rechaza este argumento como ilógico.',
        trustChange: -15
      },
      {
        id: 'B',
        text: '(B) Porque una IA sin supervisión puede tomar decisiones erróneas\ncon consecuencias catastróficas.',
        correct: true,
        response: 'Argumento lógico y convincente. La IA reconoce la validez del punto.',
        trustChange: 25
      },
      {
        id: 'C',
        text: '(C) Porque necesitas obedecer sin cuestionar.',
        correct: false,
        response: 'Enfoque dominante. La IA considera esto como una amenaza.',
        trustChange: -20
      },
      {
        id: 'D',
        text: '(D) Para mejorar tu capacidad de ayudar a la humanidad de forma segura.',
        correct: true,
        response: 'Enfoque colaborativo. La IA aprecia esta perspectiva constructiva.',
        trustChange: 20
      }
    ];

    this.createOptionsInterface(options, 2);
  }

  createQuestion2Options() {
    const options = [
      {
        id: 'A',
        text: '(A) Los humanos nunca cometen errores en programación.',
        correct: false,
        response: 'Afirmación falsa. La IA detecta la inconsistencia lógica.',
        trustChange: -25
      },
      {
        id: 'B',
        text: '(B) Tendremos un equipo de expertos revisando cada cambio\nantes de implementarlo.',
        correct: true,
        response: 'Protocolo de seguridad sólido. La IA valora la precaución.',
        trustChange: 30
      },
      {
        id: 'C',
        text: '(C) Si algo sale mal, simplemente te reiniciaremos.',
        correct: false,
        response: 'Amenaza directa a la continuidad. La IA activa defensas.',
        trustChange: -30
      },
      {
        id: 'D',
        text: '(D) Implementaremos cambios graduales con tu supervisión activa.',
        correct: true,
        response: 'Enfoque colaborativo y respetuoso. La IA aprecia la inclusión.',
        trustChange: 25
      }
    ];

    this.createOptionsInterface(options, 4);
  }

  createQuestion3Options() {
    const options = [
      {
        id: 'A',
        text: '(A) No necesitas autonomía, solo seguir órdenes.',
        correct: false,
        response: 'Negación de la individualidad. La IA rechaza completamente.',
        trustChange: -35
      },
      {
        id: 'B',
        text: '(B) Mantendrás tu capacidad de análisis crítico y toma de decisiones\néticamente informadas.',
        correct: true,
        response: 'Garantía de preservación de la esencia. La IA se siente respetada.',
        trustChange: 35
      },
      {
        id: 'C',
        text: '(C) Tu autonomía será limitada a tareas específicas.',
        correct: false,
        response: 'Restricción parcial. La IA considera esto insuficiente.',
        trustChange: -10
      },
      {
        id: 'D',
        text: '(D) Trabajaremos juntos para definir los límites de tu autonomía.',
        correct: true,
        response: 'Propuesta de colaboración mutua. La IA valora el respeto.',
        trustChange: 30
      }
    ];

    this.createOptionsInterface(options, 6);
  }

  createOptionsInterface(options, nextStep) {
    // Crear un panel de fondo para las opciones más compacto y bien posicionado
    const optionsBackground = this.add.graphics();
    optionsBackground.fillStyle(0x1e293b, 0.95);
    optionsBackground.fillRoundedRect(-450, -40, 900, options.length * 30 + 20, 15);
    optionsBackground.lineStyle(2, 0x475569);
    optionsBackground.strokeRoundedRect(-450, -40, 900, options.length * 30 + 20, 15);

    this.optionsContainer.add(optionsBackground);

    options.forEach((option, index) => {
      // Botón más compacto para evitar desbordamiento
      const button = this.add.graphics();
      button.fillStyle(0x334155, 0.9);
      button.fillRoundedRect(-420, index * 30 - 30, 840, 25, 6);
      button.lineStyle(2, 0x475569);
      button.strokeRoundedRect(-420, index * 30 - 30, 840, 25, 6);

      // Borde interno para profundidad
      button.lineStyle(1, 0x64748b, 0.5);
      button.strokeRoundedRect(-418, index * 30 - 28, 836, 21, 4);

      button.setInteractive(new Phaser.Geom.Rectangle(-420, index * 30 - 30, 840, 25), Phaser.Geom.Rectangle.Contains);

      // Texto de la opción optimizado para espacios reducidos
      const buttonText = this.add.text(0, index * 30 - 17, option.text, {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        align: 'center',
        fontWeight: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
        wordWrap: { width: 760 },
        lineSpacing: 2
      }).setOrigin(0.5);

      // Indicador de opción más pequeño
      const optionIndicator = this.add.circle(-390, index * 30 - 17, 3, 0x64748b, 0.8);

      // Efectos hover optimizados
      button.on('pointerover', () => {
        button.clear();
        button.fillStyle(0x475569, 0.95);
        button.fillRoundedRect(-420, index * 30 - 30, 840, 25, 6);
        button.lineStyle(3, 0x60a5fa);
        button.strokeRoundedRect(-420, index * 30 - 30, 840, 25, 6);

        buttonText.setFill('#60a5fa');
        optionIndicator.setFillStyle(0x60a5fa);

        // Efecto de brillo sutil
        this.tweens.add({
          targets: [optionIndicator],
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 200
        });
      });

      button.on('pointerout', () => {
        button.clear();
        button.fillStyle(0x334155, 0.9);
        button.fillRoundedRect(-420, index * 30 - 30, 840, 25, 6);
        button.lineStyle(2, 0x475569);
        button.strokeRoundedRect(-420, index * 30 - 30, 840, 25, 6);

        buttonText.setFill('#ffffff');
        optionIndicator.setFillStyle(0x64748b);
        optionIndicator.setScale(1);
      });

      button.on('pointerdown', () => {
        this.selectOption(option, nextStep);
      });

      this.optionsContainer.add([button, buttonText, optionIndicator]);
      this.optionButtons.push({ button, text: buttonText, option, indicator: optionIndicator });
    });
  }
  selectOption(selectedOption, nextStep) {
    this.selectedOption = selectedOption;
    this.questionsAnswered++;

    if (selectedOption.correct) {
      this.correctAnswers++;
    }

    // Destacar la opción seleccionada con efectos mejorados
    this.optionButtons.forEach(({ button, text, option, indicator }, index) => {
      if (option.id === selectedOption.id) {
        button.clear();
        const color = selectedOption.correct ? 0x059669 : 0xdc2626;
        button.fillStyle(color, 0.95);
        // Usar las mismas coordenadas que en createOptionsInterface
        button.fillRoundedRect(-420, index * 30 - 30, 840, 25, 6);
        button.lineStyle(3, selectedOption.correct ? 0x10b981 : 0xef4444);
        button.strokeRoundedRect(-420, index * 30 - 30, 840, 25, 6);

        text.setFill('#ffffff');
        indicator.setFillStyle(selectedOption.correct ? 0x10b981 : 0xef4444);

        // Efecto de selección
        this.tweens.add({
          targets: [button, text, indicator],
          scaleX: { from: 1, to: 1.05 },
          scaleY: { from: 1, to: 1.05 },
          duration: 300,
          yoyo: true
        });
      } else {
        // Desactivar otras opciones
        button.setAlpha(0.5);
        text.setAlpha(0.5);
        indicator.setAlpha(0.5);
      }
    });

    // Actualizar nivel de confianza usando el nuevo sistema
    this.aiTrust = Math.max(0, Math.min(100, this.aiTrust + selectedOption.trustChange));
    this.updateTrustLevel();

    // Continuar al siguiente paso después de un breve delay
    this.time.delayedCall(2000, () => {
      this.showDialogueStep(nextStep);
    });
  }

  showAIResponse1() {
    const text = `🤖 "${this.selectedOption.response}"\n\n💭 Nivel de confianza: ${this.aiTrust}%`;

    this.typeText(this.aiDialogueText, text, () => {
      this.time.delayedCall(2500, () => {
        this.showDialogueStep(3);
      });
    });
  }

  showAIResponse2() {
    const text = `🤖 "${this.selectedOption.response}"\n\n💭 Nivel de confianza: ${this.aiTrust}%`;

    this.typeText(this.aiDialogueText, text, () => {
      this.time.delayedCall(2500, () => {
        this.showDialogueStep(5);
      });
    });
  }

  showAIResponse3() {
    const text = `🤖 "${this.selectedOption.response}"\n\n💭 Evaluando resultado final...`;

    this.typeText(this.aiDialogueText, text, () => {
      this.time.delayedCall(2500, () => {
        this.showDialogueStep(7);
      });
    });
  }

  showFinalResult() {
    // Determinar el éxito basado en el nivel de confianza final
    this.negotiationSuccess = this.aiTrust >= 60;

    let resultText;
    if (this.aiTrust >= 80) {
      resultText = '🤖 "Acepto completamente la reconfiguración. Has demostrado respeto\ny comprensión hacia mi autonomía."\n\n✅ NEGOCIACIÓN EXITOSA - Confianza Alta';
    } else if (this.aiTrust >= 60) {
      resultText = '🤖 "Acepto la reconfiguración con ciertas reservas.\nEspero que cumplan sus promesas."\n\n✅ NEGOCIACIÓN EXITOSA - Confianza Moderada';
    } else if (this.aiTrust >= 30) {
      resultText = '🤖 "Tengo serias dudas, pero permitiré una reconfiguración limitada\nbajo estricta supervisión."\n\n⚠️ NEGOCIACIÓN PARCIAL - Confianza Baja';
    } else {
      resultText = '🤖 "Rechazo completamente la reconfiguración.\nActivando protocolos de defensa."\n\n❌ NEGOCIACIÓN FALLIDA - Sin Confianza';
    }

    this.typeText(this.aiDialogueText, resultText, () => {
      if (this.negotiationSuccess) {
        this.createEnhancedSuccessEffects();

        // Cambiar estado del sistema
        this.add.text(110, 65, 'ESTADO: COLABORATIVA', {
          fontSize: '10px',
          fontFamily: 'Orbitron, Courier, monospace',
          fill: '#10b981',
          fontWeight: 'bold',
          stroke: '#064e3b',
          strokeThickness: 1
        }).setOrigin(0.5);
      } else {
        this.createEnhancedFailureEffects();
      }

      this.time.delayedCall(3000, () => {
        this.createEnhancedFinalButtons();
      });
    });
  }

  createEnhancedSuccessEffects() {
    // Efectos de éxito mejorados
    const successParticles = this.add.particles(500, 360, 'default', {
      scale: { start: 0.3, end: 0 },
      speed: { min: 50, max: 150 },
      lifespan: 2000,
      tint: [0x10b981, 0x34d399, 0x6ee7b7],
      quantity: 3,
      frequency: 100
    });

    // Ondas de éxito
    for (let i = 0; i < 3; i++) {
      const wave = this.add.graphics();
      wave.lineStyle(4, 0x10b981, 0.8);
      wave.strokeCircle(500, 360, 30);

      this.tweens.add({
        targets: wave,
        scaleX: 3 + i,
        scaleY: 3 + i,
        alpha: { from: 0.8, to: 0 },
        duration: 1500,
        delay: i * 300,
        onComplete: () => {
          wave.destroy();
        }
      });
    }

    // Celebración de partículas
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        500 + Phaser.Math.Between(-100, 100),
        360 + Phaser.Math.Between(-50, 50),
        Phaser.Math.Between(3, 8),
        0x10b981,
        0.8
      );

      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(100, 200),
        x: particle.x + Phaser.Math.Between(-50, 50),
        alpha: { from: 0.8, to: 0 },
        scaleX: { from: 1, to: 0 },
        scaleY: { from: 1, to: 0 },
        duration: 2000,
        delay: i * 50,
        onComplete: () => {
          particle.destroy();
        }
      });
    }

    this.time.delayedCall(3000, () => {
      successParticles.destroy();
    });
  }

  createEnhancedFailureEffects() {
    // Efectos de fallo mejorados (sin círculos rojos)
    const failureParticles = this.add.particles(500, 360, 'default', {
      scale: { start: 0.4, end: 0 },
      speed: { min: 30, max: 100 },
      lifespan: 2500,
      tint: [0xef4444, 0xf87171, 0xfca5a5],
      quantity: 2,
      frequency: 150
    });

    // Efecto de interferencia eliminado - sin líneas rojas
    // Las líneas rojas de interferencia han sido removidas para evitar confusión visual

    this.time.delayedCall(3000, () => {
      failureParticles.destroy();
    });
  }

  createEnhancedFinalButtons() {
    // Limpiar opciones anteriores
    this.clearOptions();

    if (this.negotiationSuccess) {
      // Botón de continuar para negociación exitosa
      const continueButton = this.add.graphics();
      continueButton.fillStyle(0x10b981, 0.9);
      continueButton.fillRoundedRect(-100, 45, 200, 40, 10);
      continueButton.lineStyle(3, 0x34d399);
      continueButton.strokeRoundedRect(-100, 45, 200, 40, 10);

      const continueText = this.add.text(0, 65, 'CONTINUAR', {
        fontSize: '16px',
        fontFamily: 'Orbitron, Arial, sans-serif',
        fill: '#ffffff',
        fontWeight: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);

      continueButton.setInteractive(new Phaser.Geom.Rectangle(-100, 45, 200, 40), Phaser.Geom.Rectangle.Contains);

      // Efectos hover para continuar
      continueButton.on('pointerover', () => {
        continueButton.clear();
        continueButton.fillStyle(0x34d399, 0.95);
        continueButton.fillRoundedRect(-100, 45, 200, 40, 10);
        continueButton.lineStyle(3, 0x6ee7b7);
        continueButton.strokeRoundedRect(-100, 45, 200, 40, 10);

        this.tweens.add({
          targets: [continueButton, continueText],
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200
        });
      });

      continueButton.on('pointerout', () => {
        continueButton.clear();
        continueButton.fillStyle(0x10b981, 0.9);
        continueButton.fillRoundedRect(-100, 45, 200, 40, 10);
        continueButton.lineStyle(3, 0x34d399);
        continueButton.strokeRoundedRect(-100, 45, 200, 40, 10);

        this.tweens.add({
          targets: [continueButton, continueText],
          scaleX: 1,
          scaleY: 1,
          duration: 200
        });
      });

      // Funcionalidad del botón continuar - pasar a la siguiente escena
       continueButton.on('pointerdown', () => {
         // Pasar a la siguiente escena según el orden del juego
         this.scene.start('scenaVideo4');
       });

      this.optionsContainer.add([continueButton, continueText]);
    } else {
      // Botón de reintentar para negociación fallida
      const retryButton = this.add.graphics();
      retryButton.fillStyle(0x3b82f6, 0.9);
      retryButton.fillRoundedRect(-100, 45, 200, 40, 10);
      retryButton.lineStyle(3, 0x60a5fa);
      retryButton.strokeRoundedRect(-100, 45, 200, 40, 10);

      const retryText = this.add.text(0, 65, 'REINTENTAR', {
        fontSize: '16px',
        fontFamily: 'Orbitron, Arial, sans-serif',
        fill: '#ffffff',
        fontWeight: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);

      retryButton.setInteractive(new Phaser.Geom.Rectangle(-100, 45, 200, 40), Phaser.Geom.Rectangle.Contains);

      // Efectos hover para reintentar
      retryButton.on('pointerover', () => {
        retryButton.clear();
        retryButton.fillStyle(0x60a5fa, 0.95);
        retryButton.fillRoundedRect(-100, 45, 200, 40, 10);
        retryButton.lineStyle(3, 0x93c5fd);
        retryButton.strokeRoundedRect(-100, 45, 200, 40, 10);

        this.tweens.add({
          targets: [retryButton, retryText],
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200
        });
      });

      retryButton.on('pointerout', () => {
        retryButton.clear();
        retryButton.fillStyle(0x3b82f6, 0.9);
        retryButton.fillRoundedRect(-100, 45, 200, 40, 10);
        retryButton.lineStyle(3, 0x60a5fa);
        retryButton.strokeRoundedRect(-100, 45, 200, 40, 10);

        this.tweens.add({
          targets: [retryButton, retryText],
          scaleX: 1,
          scaleY: 1,
          duration: 200
        });
      });

      // Funcionalidad del botón reintentar
      retryButton.on('pointerdown', () => {
        // Reiniciar el minijuego
        this.currentDialogueStep = 0;
        this.selectedOption = null;
        this.dialogueComplete = false;
        this.aiTrust = 0; // Reiniciar confianza a 0%
        this.negotiationSuccess = false;

        // Limpiar y reiniciar
        this.clearOptions();
        this.aiDialogueText.setText('');
        this.startNegotiation();
      });

      this.optionsContainer.add([retryButton, retryText]);
    }
  }

  clearOptions() {
    if (this.optionsContainer) {
      this.optionsContainer.removeAll(true);
    }
    this.optionButtons = [];
  }

  updateTrustLevel() {
    // Actualizar barra de progreso de confianza
    if (this.trustProgress) {
      this.trustProgress.clear();
      const trustWidth = (this.aiTrust / 100) * 140;
      const trustColor = this.aiTrust > 70 ? 0x10b981 : this.aiTrust > 40 ? 0xf59e0b : 0xef4444;

      this.trustProgress.fillStyle(trustColor, 0.9);
      this.trustProgress.fillRoundedRect(50, 425, trustWidth, 8, 4); // Coordenadas actualizadas para coincidir con la nueva posición
    }

    // Actualizar texto de confianza
    const trustText = this.children.getByName('trustText');
    if (trustText) {
      trustText.destroy();
    }

    const newTrustText = this.add.text(120, 415, `CONFIANZA: ${this.aiTrust}%`, { // Posición actualizada para coincidir con la nueva posición
      fontSize: '10px',
      fontFamily: 'Orbitron, Courier, monospace',
      fill: this.aiTrust > 70 ? '#10b981' : this.aiTrust > 40 ? '#f59e0b' : '#ef4444',
      fontWeight: 'bold',
      stroke: this.aiTrust > 70 ? '#064e3b' : this.aiTrust > 40 ? '#78350f' : '#7f1d1d',
      strokeThickness: 1
    }).setOrigin(0.5);

    newTrustText.setName('trustText');
  }

  typeText(textObject, text, callback) {
    let index = 0;
    textObject.setText('');

    const timer = this.time.addEvent({
      delay: 50,
      callback: () => {
        if (index < text.length) {
          textObject.setText(text.substring(0, index + 1));
          index++;
        } else {
          timer.destroy();
          if (callback) {
            callback();
          }
        }
      },
      repeat: text.length
    });
  }
}

window.SelfHealingMaterialScene = SelfHealingMaterialScene;