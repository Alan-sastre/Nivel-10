class scenaFallos extends Phaser.Scene {
  constructor() {
    super({ key: "scenaFallos" });
    this.gameMode = 'menu'; // 'menu', 'containment', 'repair', 'transition'
    this.nanobots = [];
    this.shield = null; // Escudo rotatorio
    this.score = 0;
    // this.lives = 3; // ELIMINADO: Sistema de vidas
    this.puzzlePieces = [];
    this.targetSlots = [];
    this.particles = [];
    this.currentLevel = 1;
    this.maxLevel = 1;
    this.gameCompleted = false;
    this.levelCompleting = false;
    this.gameStartTime = 0; // Tiempo de inicio del juego
  }

  preload() {
  
    // Cargar imagen de nanorobots
    this.load.image('nanorobots', 'assets/Fallos/nanorobots.png');
    
    // Cargar imagen de nave nanorobótica
    this.load.svg('nanorobotic_ship', 'assets/Fallos/nanorobotic_ship.svg');
    
    // Crear textura de pixel para partículas
    this.add.graphics().fillStyle(0xffffff).fillRect(0, 0, 1, 1).generateTexture('pixel', 1, 1);
    
    // Crear sonidos sintéticos
    // LLAMADA A SONIDOS ELIMINADA POR SOLICITUD DEL USUARIO
    // this.createSounds();
  }

  create() {
    // Cerrar cualquier SweetAlert activo al iniciar la escena
    if (typeof Swal !== 'undefined') {
      Swal.close();
    }
    
    // Crear overlay de transición de entrada (fade in)
    const fadeOverlay = this.add.rectangle(
      500, 250, 1000, 500, 0x000000, 1
    ).setDepth(1000);
    
    // Fondo futurista con gradiente
    this.createGradientBackground();
    
    // Crear estrellas animadas de fondo
    this.createAnimatedStars();

    // Animación de encendido (fade in)
    this.tweens.add({
      targets: fadeOverlay,
      alpha: 0,
      duration: 1500,
      ease: 'Power2.easeInOut',
      onComplete: () => {
        fadeOverlay.destroy();
      }
    });

    this.showMainMenu();
  }

  createGradientBackground() {
    const graphics = this.add.graphics();
    graphics.setDepth(-100);
    
    // Fondo base oscuro primero
    graphics.fillStyle(0x001122, 1);
    graphics.fillRect(0, 0, 1000, 500);
    
    // Crear gradiente radial con círculos concéntricos
    for (let i = 0; i < 300; i += 15) {
      const progress = i / 300;
      const alpha = (1 - progress) * 0.6;
      
      // Interpolación manual de colores del centro hacia afuera
      const r = Math.floor(0 + (68 - 0) * progress);
      const g = Math.floor(34 + (102 - 34) * progress);
      const b = Math.floor(68 + (136 - 68) * progress);
      
      const color = (r << 16) | (g << 8) | b;
      
      graphics.fillStyle(color, alpha);
      graphics.fillCircle(500, 250, 500 - i);
    }
  }

  createAnimatedStars() {
    for (let i = 0; i < 150; i++) {
      const x = Phaser.Math.Between(0, 1000);
      const y = Phaser.Math.Between(0, 500);
      const radius = Phaser.Math.Between(1, 4);
      
      const star = this.add.graphics();
      star.fillStyle(0x88ccff);
      star.fillCircle(x, y, radius);
      star.setAlpha(Phaser.Math.FloatBetween(0.2, 0.9));
      
      // Animación de parpadeo
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 1),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }

  createContainmentBackground() {
    // Fondo base oscuro que cubre toda la pantalla
    const bg = this.add.rectangle(500, 250, 1000, 500, 0x001122);
    bg.setAlpha(1);
    bg.setDepth(-10);
    
    // Patrón hexagonal de fondo más denso y centrado
    const hexPositions = [
      {x: 50, y: 50}, {x: 150, y: 50}, {x: 250, y: 50}, {x: 350, y: 50}, {x: 450, y: 50}, {x: 550, y: 50}, {x: 650, y: 50}, {x: 750, y: 50}, {x: 850, y: 50}, {x: 950, y: 50},
      {x: 100, y: 120}, {x: 200, y: 120}, {x: 300, y: 120}, {x: 400, y: 120}, {x: 500, y: 120}, {x: 600, y: 120}, {x: 700, y: 120}, {x: 800, y: 120}, {x: 900, y: 120},
      {x: 50, y: 190}, {x: 150, y: 190}, {x: 250, y: 190}, {x: 350, y: 190}, {x: 450, y: 190}, {x: 550, y: 190}, {x: 650, y: 190}, {x: 750, y: 190}, {x: 850, y: 190}, {x: 950, y: 190},
      {x: 100, y: 260}, {x: 200, y: 260}, {x: 300, y: 260}, {x: 500, y: 260}, {x: 600, y: 260}, {x: 700, y: 260}, {x: 800, y: 260}, {x: 900, y: 260},
      {x: 50, y: 330}, {x: 150, y: 330}, {x: 250, y: 330}, {x: 350, y: 330}, {x: 450, y: 330}, {x: 550, y: 330}, {x: 650, y: 330}, {x: 750, y: 330}, {x: 850, y: 330}, {x: 950, y: 330},
      {x: 100, y: 400}, {x: 200, y: 400}, {x: 300, y: 400}, {x: 500, y: 400}, {x: 600, y: 400}, {x: 700, y: 400}, {x: 800, y: 400}, {x: 900, y: 400},
      {x: 50, y: 470}, {x: 150, y: 470}, {x: 250, y: 470}, {x: 350, y: 470}, {x: 450, y: 470}, {x: 550, y: 470}, {x: 650, y: 470}, {x: 750, y: 470}, {x: 850, y: 470}, {x: 950, y: 470}
    ];
    
    hexPositions.forEach(pos => {
      const hex = this.add.polygon(pos.x, pos.y, [
        [-15, -8], [0, -16], [15, -8], [15, 8], [0, 16], [-15, 8]
      ], 0x000000, 0);
      hex.setStrokeStyle(1, 0x00ffff, 0.2);
      hex.setDepth(-5);
    });
    
    // Anillos de contención animados
    const ring1 = this.add.graphics();
    ring1.lineStyle(2, 0x00ffff, 0.6);
    ring1.strokeCircle(500, 250, 120);
    ring1.setDepth(-3);
    
    const ring2 = this.add.graphics();
    ring2.lineStyle(1, 0x0088ff, 0.4);
    ring2.strokeCircle(500, 250, 160);
    ring2.setDepth(-3);
    
    // Animaciones de los anillos
    this.tweens.add({
      targets: ring1,
      alpha: 0.3,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.tweens.add({
      targets: ring2,
      alpha: 0.2,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Líneas de energía
    const energyLines = [
      {x1: 500, y1: 130, x2: 500, y2: 90},
      {x1: 500, y1: 370, x2: 500, y2: 410},
      {x1: 340, y1: 250, x2: 300, y2: 250},
      {x1: 660, y1: 250, x2: 700, y2: 250}
    ];
    
    energyLines.forEach((line, index) => {
      const energyLine = this.add.line(0, 0, line.x1, line.y1, line.x2, line.y2, 0x00ffff);
      energyLine.setLineWidth(2);
      energyLine.setAlpha(0);
      energyLine.setDepth(-2);
      
      this.tweens.add({
        targets: energyLine,
        alpha: 1,
        duration: 1000 + (index * 200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  // FUNCIÓN DE SONIDOS ELIMINADA POR SOLICITUD DEL USUARIO
  /*
  createSounds() {
    // Crear sonidos sintéticos mejorados usando Web Audio API
    this.sounds = {
      barrier: this.createAdvancedSound([440, 660, 880], 0.15, 'square', 'barrier'),
      barrierHit: this.createAdvancedSound([330, 440], 0.1, 'sawtooth', 'hit'),
      nanobotSpawn: this.createAdvancedSound([220, 330, 440], 0.2, 'triangle', 'spawn'),
      nanobotDestroy: this.createAdvancedSound([880, 660, 440, 220], 0.25, 'sawtooth', 'destroy'),
      energyPulse: this.createAdvancedSound([660, 880, 1100], 0.12, 'sine', 'pulse'),
      coreHit: this.createAdvancedSound([110, 220, 330], 0.3, 'square', 'core'),
      levelComplete: this.createAdvancedSound([440, 550, 660, 880, 1100], 0.4, 'triangle', 'complete'),
      electromagnetic: this.createAdvancedSound([880, 1100, 1320], 0.08, 'sine', 'electromagnetic'),
      // NUEVOS SONIDOS ÉPICOS PARA TRANSICIONES
      missionStart: this.createAdvancedSound([261.63, 329.63, 392.00, 523.25, 659.25], 1.2, 'triangle', 'mission_start'),
      gameTransition: this.createAdvancedSound([440, 554.37, 659.25, 880], 0.8, 'sine', 'transition'),
      ambientHum: this.createAdvancedSound([110, 165, 220], 2.0, 'sine', 'ambient'),
      menuActivate: this.createAdvancedSound([523.25, 659.25, 783.99], 0.6, 'triangle', 'transition'),
      epicVictory: this.createAdvancedSound([523.25, 659.25, 783.99, 1046.50, 1318.51], 2.0, 'triangle', 'complete'),
      powerUp: this.createAdvancedSound([440, 554.37, 659.25, 880, 1108.73], 0.7, 'square', 'mission_start'),
      // NUEVOS SONIDOS ÉPICOS PARA BARRERAS DE ENERGÍA
      barrierCharge: this.createAdvancedSound([220, 330, 440, 550, 660], 0.8, 'sine', 'barrier'),
      barrierActivate: this.createAdvancedSound([880, 1100, 1320, 1760, 2200], 0.6, 'triangle', 'barrier'),
      energyField: this.createAdvancedSound([440, 550, 660, 880], 0.4, 'square', 'barrier'),
      barrierResonance: this.createAdvancedSound([330, 440, 550, 660, 880, 1100], 1.0, 'sine', 'barrier'),
      shieldHum: this.createAdvancedSound([165, 220, 275, 330], 1.5, 'sine', 'barrier'),
      barrierOverload: this.createAdvancedSound([1320, 1100, 880, 660, 440, 220], 0.5, 'sawtooth', 'barrier'),
      energyDischarge: this.createAdvancedSound([1760, 1320, 880, 440], 0.3, 'triangle', 'barrier'),
      shieldStabilize: this.createAdvancedSound([440, 550, 660, 550, 440], 0.7, 'sine', 'barrier')
    };
  }
  */

  // FUNCIÓN DE CREACIÓN DE SONIDOS ELIMINADA POR SOLICITUD DEL USUARIO
  /*
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
              case 'barrier':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(200, now);
                break;
              case 'hit':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(800, now);
                break;
              case 'spawn':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(1000, now);
                break;
              case 'destroy':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(400, now);
                break;
              case 'electromagnetic':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(1200, now);
                break;
              case 'transition':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(2000, now);
                break;
              case 'mission_start':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(300, now);
                break;
              case 'ambient':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(600, now);
                break;
            }
            
            // Configurar ganancia con envelope
            const baseGain = 0.08 / frequencies.length;
            const delay = index * 0.02;
            
            gainNode.gain.setValueAtTime(0, now + delay);
            gainNode.gain.linearRampToValueAtTime(baseGain, now + delay + 0.01);
            
            // Envelope específico por tipo de sonido
            switch(soundType) {
              case 'barrier':
              case 'electromagnetic':
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'hit':
                gainNode.gain.linearRampToValueAtTime(0, now + delay + duration * 0.3);
                break;
              case 'spawn':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.7, now + delay + duration * 0.5);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'destroy':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.5, now + delay + duration * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'complete':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.2, now + delay + duration * 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'transition':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.8, now + delay + duration * 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'mission_start':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.3, now + delay + duration * 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'ambient':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.5, now + delay + duration * 0.6);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              default:
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
            }
            
            // Modulación de frecuencia para algunos efectos
            if (soundType === 'electromagnetic' || soundType === 'pulse') {
              oscillator.frequency.linearRampToValueAtTime(frequency * 1.2, now + delay + duration * 0.5);
              oscillator.frequency.linearRampToValueAtTime(frequency * 0.8, now + delay + duration);
            }
            
            if (soundType === 'transition') {
              oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + delay + duration * 0.3);
              oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, now + delay + duration);
            }
            
            if (soundType === 'mission_start') {
              oscillator.frequency.linearRampToValueAtTime(frequency * 1.8, now + delay + duration * 0.2);
              oscillator.frequency.linearRampToValueAtTime(frequency * 1.2, now + delay + duration * 0.6);
              oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, now + delay + duration);
            }
            
            oscillator.start(now + delay);
            oscillator.stop(now + delay + duration);
          });
        }
      }
    };
  }
  */

  showMainMenu() {
    this.gameMode = 'menu';
    this.children.removeAll();
    
    // Recrear fondo
    this.createGradientBackground();
    this.createAnimatedStars();
    
    // Crear partículas flotantes decorativas mejoradas
    for (let i = 0; i < 25; i++) {
      const x = Phaser.Math.Between(50, 950);
      const y = Phaser.Math.Between(100, 400);
      const radius = Phaser.Math.Between(1, 4);
      const color = Phaser.Utils.Array.GetRandom([0x00ffff, 0x0088ff, 0x00aaff, 0x66ccff]);
      const alpha = Phaser.Math.FloatBetween(0.2, 0.6);
      
      const particle = this.add.graphics();
      particle.fillStyle(color, alpha);
      particle.fillCircle(x, y, radius);
      
      // Movimiento flotante más complejo
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(30, 80),
        x: particle.x + Phaser.Math.Between(-20, 20),
        alpha: { from: particle.alpha, to: 0.05 },
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        duration: Phaser.Math.Between(2500, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Rotación sutil
      this.tweens.add({
        targets: particle,
        rotation: Math.PI * 2,
        duration: Phaser.Math.Between(8000, 12000),
        repeat: -1,
        ease: 'Linear'
      });
    }
    
    // Crear ondas de energía expansivas
    for (let i = 0; i < 3; i++) {
      const wave = this.add.graphics();
      wave.lineStyle(2, 0x00aaff, 0.3 - (i * 0.1));
      wave.strokeCircle(500, 250, 50 + (i * 100));
      
      this.tweens.add({
        targets: wave,
        scaleX: { from: 0.5, to: 2.5 },
        scaleY: { from: 0.5, to: 2.5 },
        alpha: { from: 0.3 - (i * 0.1), to: 0 },
        duration: 4000 + (i * 1000),
        repeat: -1,
        ease: 'Quad.easeOut',
        delay: i * 1500
      });
    }
    
    // Crear rayos de energía desde el centro
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * Math.PI / 180;
      const length = 150;
      const endX = 500 + Math.cos(angle) * length;
      const endY = 250 + Math.sin(angle) * length;
      
      const ray = this.add.line(0, 0, 500, 250, endX, endY, 0x00ffff, 0.4);
      ray.setLineWidth(2);
      
      this.tweens.add({
        targets: ray,
        alpha: { from: 0, to: 0.6 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 200
      });
    }
    
    // Panel principal del menú con diseño moderno
    const mainPanel = this.add.rectangle(500, 250, 600, 400, 0x001133, 0.9);
    mainPanel.setStrokeStyle(3, 0x0088ff);
    
    // Efecto de brillo en el panel
    const panelGlow = this.add.rectangle(500, 250, 590, 390, 0x0066cc, 0.1);
    this.tweens.add({
      targets: panelGlow,
      alpha: { from: 0.1, to: 0.3 },
      duration: 2000,
      yoyo: true,
      repeat: -1
    });
    
    // Título principal con efectos espectaculares
    const title = this.add.text(500, 100, 'NANORROBOTS DE NANOTERRA', {
      fontSize: '36px',
      fill: '#00ffff',
      fontFamily: 'Arial Black',
      stroke: '#004466',
      strokeThickness: 4,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000044',
        blur: 8,
        fill: true
      }
    }).setOrigin(0.5);

    // Animación del título más dinámica
    this.tweens.add({
      targets: title,
      scaleX: { from: 1, to: 1.08 },
      scaleY: { from: 1, to: 1.08 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Crear efecto de líneas de energía alrededor del título
    for (let i = 0; i < 4; i++) {
      const line = this.add.rectangle(500 + (i * 30 - 45), 85, 2, 30, 0x00ffff, 0.6);
      this.tweens.add({
        targets: line,
        alpha: { from: 0.6, to: 0.1 },
        scaleY: { from: 1, to: 1.5 },
        duration: 1000 + (i * 200),
        yoyo: true,
        repeat: -1
      });
    }

    // Subtítulo mejorado
    const subtitle = this.add.text(500, 140, 'Salva el planeta de la replicación descontrolada', {
      fontSize: '18px',
      fill: '#88ccff',
      fontFamily: 'Arial Bold',
      stroke: '#002244',
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#001122',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);

    // Botón principal rediseñado con efectos avanzados
    const btnContainer = this.add.container(500, 250);
    
    // Fondo del botón con gradiente visual
    const btnBg = this.add.rectangle(0, 0, 380, 80, 0x0066cc);
    btnBg.setStrokeStyle(4, 0x00aaff);
    
    // Múltiples capas de brillo
    const btnGlow1 = this.add.rectangle(0, -10, 360, 25, 0x00ddff, 0.4);
    const btnGlow2 = this.add.rectangle(0, 10, 360, 25, 0x0088ff, 0.2);
    
    // Texto del botón mejorado
    const btnText = this.add.text(0, 0, '🚀 INICIAR MISIÓN', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Arial Black',
      stroke: '#003366',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000033',
        blur: 3,
        fill: true
      }
    }).setOrigin(0.5);
    
    btnContainer.add([btnBg, btnGlow1, btnGlow2, btnText]);
    btnContainer.setInteractive(new Phaser.Geom.Rectangle(-190, -40, 380, 80), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        // Reproducir sonido épico de inicio de misión
        if (this.sounds && this.sounds.missionStart) {
          // SONIDO ELIMINADO POR SOLICITUD DEL USUARIO
      // this.sounds.missionStart.play();
        }
        
        // Efecto de clic con sonido
        this.tweens.add({
          targets: btnContainer,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            // Sonido de transición antes de cambiar de estado
            if (this.sounds && this.sounds.gameTransition) {
              // SONIDO ELIMINADO POR SOLICITUD DEL USUARIO
      // this.sounds.gameTransition.play();
            }
            
            // Delay para que se escuche el sonido antes de la transición
            this.time.delayedCall(300, () => {
              this.startContainmentGame();
            });
          }
        });
      })
      .on('pointerover', () => {
        // Sonido sutil de activación del menú
        if (this.sounds && this.sounds.menuActivate) {
          // SONIDO ELIMINADO POR SOLICITUD DEL USUARIO
      // this.sounds.menuActivate.play();
        }
        
        btnBg.setFillStyle(0x0088ff);
        btnGlow1.setAlpha(0.6);
        btnGlow2.setAlpha(0.4);
        this.tweens.add({ targets: btnContainer, scaleX: 1.08, scaleY: 1.08, duration: 200 });
      })
      .on('pointerout', () => {
        btnBg.setFillStyle(0x0066cc);
        btnGlow1.setAlpha(0.4);
        btnGlow2.setAlpha(0.2);
        this.tweens.add({ targets: btnContainer, scaleX: 1, scaleY: 1, duration: 200 });
      });
    
    // Animación constante del botón
    this.tweens.add({
      targets: [btnGlow1, btnGlow2],
      alpha: { from: 0.4, to: 0.1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Instrucciones mejoradas
    const instructionPanel = this.add.rectangle(500, 350, 520, 60, 0x001122, 0.7);
    instructionPanel.setStrokeStyle(2, 0x003366);
    
    const instructionText = this.add.text(500, 340, '🎮 Prepárate para defender NanoTerra', {
      fontSize: '16px',
      fill: '#aaccff',
      fontFamily: 'Arial Bold',
      stroke: '#000033',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    const subInstruction = this.add.text(500, 360, 'Usa barreras de energía para contener los nanorrobots', {
      fontSize: '12px',
      fill: '#88aacc',
      fontFamily: 'Arial',
      stroke: '#000022',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // Animación de las instrucciones
    this.tweens.add({
      targets: [instructionText, subInstruction],
      alpha: { from: 0.8, to: 1 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Crear elementos decorativos adicionales
    this.createMenuDecorations();
  }

  createMenuDecorations() {
    // Crear elementos decorativos hexagonales
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const radius = 200;
      const x = 500 + Math.cos(angle) * radius;
      const y = 250 + Math.sin(angle) * radius;
      
      const hexagon = this.add.polygon(x, y, [
        [-10, -17], [10, -17], [20, 0], [10, 17], [-10, 17], [-20, 0]
      ], 0x0066cc, 0.3);
      hexagon.setStrokeStyle(2, 0x00aaff, 0.6);
      
      this.tweens.add({
        targets: hexagon,
        rotation: Math.PI * 2,
        duration: 8000 + (i * 1000),
        repeat: -1,
        ease: 'Linear'
      });
      
      this.tweens.add({
        targets: hexagon,
        alpha: { from: 0.3, to: 0.1 },
        duration: 2000 + (i * 300),
        yoyo: true,
        repeat: -1
      });
    }
    
    // Crear líneas de conexión entre hexágonos
    for (let i = 0; i < 6; i++) {
      const angle1 = (i * 60) * Math.PI / 180;
      const angle2 = ((i + 1) * 60) * Math.PI / 180;
      const radius = 250;
      
      const x1 = 400 + Math.cos(angle1) * radius;
      const y1 = 300 + Math.sin(angle1) * radius;
      const x2 = 400 + Math.cos(angle2) * radius;
      const y2 = 300 + Math.sin(angle2) * radius;
      
      const line = this.add.line(0, 0, x1, y1, x2, y2, 0x0088ff, 0.2);
      line.setLineWidth(1);
      
      this.tweens.add({
        targets: line,
        alpha: { from: 0.2, to: 0.05 },
        duration: 3000 + (i * 500),
        yoyo: true,
        repeat: -1
      });
    }
    
    // Crear círculos orbitales
    for (let i = 0; i < 3; i++) {
      const orbit = this.add.graphics();
      orbit.lineStyle(1, 0x0066cc, 0.1 + (i * 0.05));
      orbit.strokeCircle(500, 250, 150 + (i * 30));
      
      this.tweens.add({
        targets: orbit,
        rotation: Math.PI * 2,
        duration: 15000 + (i * 5000),
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  startContainmentGame() {
    this.gameMode = 'containment';
    this.children.removeAll();
    
    // Limpiar timers existentes
    if (this.nanobotTimer) {
      this.nanobotTimer.destroy();
      this.nanobotTimer = null;
    }
    
    if (this.waveTimer) {
      this.waveTimer.destroy();
      this.waveTimer = null;
    }
    
    // Reiniciar variables del juego
    this.nanobots = [];
    this.shield = null; // Escudo rotatorio
    this.score = 0;
    // this.lives = 3; // ELIMINADO: Sistema de vidas
    this.particles = [];
    this.currentLevel = 1;
    
    this.gameStartTime = this.time.now;

    // Fondo personalizado basado en contencion_mejorada
    this.createContainmentBackground();
    
    // Núcleo central mejorado
    this.createEnhancedCore();

    // UI del juego mejorada
    this.createGameUI();

    // Crear escudo rotatorio
    this.createRotatingShield();

    // Configurar control del escudo con el mouse
    this.input.on('pointermove', (pointer) => {
      this.updateShieldPosition(pointer.x, pointer.y);
    });

    // Mostrar instrucciones iniciales
    this.showGameInstructions();
    
    // Iniciar spawn de nanobots con dificultad progresiva
    this.startNanobotSpawning();
  }
  
  createRotatingShield() {
    // Crear escudo rotatorio alrededor del núcleo
    const coreX = 480; // Movido más hacia la derecha (50 píxeles adicionales)
    const coreY = 250;
    const shieldRadius = 80; // Radio más cercano al núcleo para mejor protección
    
    // Crear contenedor para el escudo
    this.shield = this.add.container(coreX, coreY);
    
    // Crear el arco principal del escudo (sólido y continuo)
    const shieldGraphics = this.add.graphics();
    
    // Dibujar arco del escudo más amplio (180 grados)
    const startAngle = -Math.PI/2; // -90 grados
    const endAngle = Math.PI/2;    // +90 grados
    
    // Arco principal sólido
    shieldGraphics.lineStyle(8, 0x00ffff, 1.0);
    shieldGraphics.beginPath();
    shieldGraphics.arc(0, 0, shieldRadius, startAngle, endAngle, false);
    shieldGraphics.strokePath();
    
    // Arco de resplandor interno
    const innerGlow = this.add.graphics();
    innerGlow.lineStyle(4, 0x88ffff, 0.8);
    innerGlow.beginPath();
    innerGlow.arc(0, 0, shieldRadius - 3, startAngle, endAngle, false);
    innerGlow.strokePath();
    
    // Arco de resplandor externo
    const outerGlow = this.add.graphics();
    outerGlow.lineStyle(12, 0x44aaff, 0.4);
    outerGlow.beginPath();
    outerGlow.arc(0, 0, shieldRadius + 6, startAngle, endAngle, false);
    outerGlow.strokePath();
    
    // Añadir partículas de energía distribuidas uniformemente
    for (let i = 0; i < 8; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / 7);
      const x = Math.cos(angle) * shieldRadius;
      const y = Math.sin(angle) * shieldRadius;
      
      const particle = this.add.circle(x, y, 3, 0x00ffff, 0.9);
      this.shield.add(particle);
      
      // Animación de partículas suave
      this.tweens.add({
        targets: particle,
        alpha: { from: 0.9, to: 0.3 },
        scaleX: { from: 1, to: 1.4 },
        scaleY: { from: 1, to: 1.4 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
        delay: i * 150
      });
    }
    
    // Añadir efectos de energía en los extremos del arco
    const startParticle = this.add.circle(
      Math.cos(startAngle) * shieldRadius,
      Math.sin(startAngle) * shieldRadius,
      5, 0x00ffff, 1.0
    );
    
    const endParticle = this.add.circle(
      Math.cos(endAngle) * shieldRadius,
      Math.sin(endAngle) * shieldRadius,
      5, 0x00ffff, 1.0
    );
    
    // Animaciones para los extremos
    this.tweens.add({
      targets: [startParticle, endParticle],
      scaleX: { from: 1, to: 2 },
      scaleY: { from: 1, to: 2 },
      alpha: { from: 1, to: 0.4 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });
    
    this.shield.add([outerGlow, innerGlow, shieldGraphics, startParticle, endParticle]);
    this.shield.setDepth(10);
  }

  updateShieldPosition(mouseX, mouseY) {
    if (!this.shield) return;
    
    // Calcular ángulo desde el núcleo hasta el mouse
    const coreX = 400;
    const coreY = 250;
    const angle = Phaser.Math.Angle.Between(coreX, coreY, mouseX, mouseY);
    
    // Rotar el escudo para que apunte hacia el mouse
    this.shield.setRotation(angle);
  }
  
  showGameInstructions() {
    // Crear fondo semitransparente para las instrucciones
    const instructionBg = this.add.graphics();
    instructionBg.fillStyle(0x000000, 0.7);
    instructionBg.fillRoundedRect(300, 100, 400, 100, 10);
    
    const instructionText = this.add.text(500, 150, 'Mueve el mouse para rotar el escudo y proteger el núcleo\nLos nanobots aparecerán en 2 segundos', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);
    
    // Hacer que las instrucciones desaparezcan después de 4 segundos
    this.time.delayedCall(4000, () => {
      instructionBg.destroy();
      instructionText.destroy();
    });
  }

  createEnhancedCore() {
    // Crear contenedor para el núcleo
    this.coreContainer = this.add.container(500, 250);
    
    // Núcleo principal con diseño hexagonal futurista mejorado
    const coreBase = this.add.graphics();
    coreBase.fillStyle(0x001a33, 0.9);
    coreBase.lineStyle(4, 0x00ccff, 1);
    
    // Crear forma hexagonal más grande para el núcleo
    const hexPoints = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * 45;
      const y = Math.sin(angle) * 45;
      hexPoints.push(x, y);
    }
    coreBase.fillPoints(hexPoints, true);
    coreBase.strokePoints(hexPoints, true);
    this.coreContainer.add(coreBase);
    
    // Núcleo interno brillante con gradiente
    const innerCore = this.add.graphics();
    innerCore.fillStyle(0x00ffff, 0.8);
    innerCore.fillCircle(0, 0, 25);
    
    // Añadir un segundo círculo interno para efecto de profundidad
    innerCore.fillStyle(0x66ffff, 0.6);
    innerCore.fillCircle(0, 0, 15);
    
    // Núcleo central más brillante
    innerCore.fillStyle(0xffffff, 0.9);
    innerCore.fillCircle(0, 0, 8);
    
    this.coreContainer.add(innerCore);
    
    // Líneas de energía cruzadas mejoradas
    const energyLines = this.add.graphics();
    energyLines.lineStyle(3, 0x88ffff, 0.9);
    energyLines.moveTo(-35, 0);
    energyLines.lineTo(35, 0);
    energyLines.moveTo(0, -35);
    energyLines.lineTo(0, 35);
    energyLines.moveTo(-25, -25);
    energyLines.lineTo(25, 25);
    energyLines.moveTo(-25, 25);
    energyLines.lineTo(25, -25);
    
    // Añadir líneas adicionales para más complejidad
    energyLines.lineStyle(2, 0xaaffff, 0.7);
    energyLines.moveTo(-30, -15);
    energyLines.lineTo(30, 15);
    energyLines.moveTo(-30, 15);
    energyLines.lineTo(30, -15);
    energyLines.moveTo(-15, -30);
    energyLines.lineTo(15, 30);
    energyLines.moveTo(-15, 30);
    energyLines.lineTo(15, -30);
    
    energyLines.stroke();
    this.coreContainer.add(energyLines);
    
    // Anillos de protección orbitales mejorados
    this.coreRings = [];
    for (let i = 1; i <= 5; i++) {
      const ring = this.add.graphics();
      ring.lineStyle(3, 0x00aaff, 0.5 - (i * 0.08));
      ring.strokeCircle(0, 0, 55 + (i * 18));
      
      // Añadir puntos de energía en los anillos
      for (let j = 0; j < 6; j++) {
        const angle = (j * Math.PI * 2) / 6;
        const radius = 55 + (i * 18);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        ring.fillStyle(0x00ffff, 0.8);
        ring.fillCircle(x, y, 2);
      }
      
      this.coreContainer.add(ring);
      this.coreRings.push(ring);
      
      // Animación de rotación para cada anillo con velocidades diferentes
      this.tweens.add({
        targets: ring,
        rotation: Math.PI * 2,
        duration: 2500 + (i * 800),
        repeat: -1,
        ease: 'Linear'
      });
    }
    
    // Indicadores de estado del núcleo mejorados
    this.coreStatusIndicators = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const x = Math.cos(angle) * 50;
      const y = Math.sin(angle) * 50;
      
      const indicator = this.add.graphics();
      indicator.fillStyle(0x00ff88, 0.9);
      indicator.fillCircle(x, y, 4);
      
      // Añadir un halo alrededor de cada indicador
      indicator.lineStyle(1, 0x88ffaa, 0.6);
      indicator.strokeCircle(x, y, 6);
      
      this.coreContainer.add(indicator);
      this.coreStatusIndicators.push(indicator);
      
      // Animación de pulso para indicadores más dinámica
      this.tweens.add({
        targets: indicator,
        scaleX: 1.8,
        scaleY: 1.8,
        alpha: 0.2,
        duration: 600 + (i * 80),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    
    // Efecto de pulso suave en todo el núcleo más pronunciado
    this.tweens.add({
      targets: this.coreContainer,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Rotación lenta del núcleo completo más fluida
    this.tweens.add({
      targets: this.coreContainer,
      rotation: Math.PI * 2,
      duration: 12000,
      repeat: -1,
      ease: 'Linear'
    });

    // Partículas de energía mejoradas
    this.createEnhancedCoreParticles();
  }

  createEnhancedCoreParticles() {
    // Partículas orbitales alrededor del núcleo
    this.coreParticles = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 90 + (Math.random() * 20);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      const particle = this.add.graphics();
      particle.fillStyle(0x00ffff, 0.7 + (Math.random() * 0.3));
      particle.fillCircle(x, y, 2 + Math.random() * 2);
      this.coreContainer.add(particle);
      this.coreParticles.push(particle);
      
      // Animación orbital
      this.tweens.add({
        targets: particle,
        rotation: Math.PI * 2,
        duration: 4000 + (i * 300),
        repeat: -1,
        ease: 'Linear'
      });
      
      // Efecto de brillo pulsante
      this.tweens.add({
        targets: particle,
        alpha: 0.3,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 1200 + (i * 100),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    
    // Partículas de energía que fluyen hacia el núcleo
    this.time.addEvent({
      delay: 800,
      callback: () => {
        if (this.scene.isActive()) {
          this.createEnergyFlowParticle();
        }
      },
      loop: true
    });
  }
  
  createEnergyFlowParticle() {
    const angle = Math.random() * Math.PI * 2;
    const startDistance = 150;
    const startX = 500 + Math.cos(angle) * startDistance;
    const startY = 250 + Math.sin(angle) * startDistance;
    
    const particle = this.add.graphics();
    particle.fillStyle(0x88ffff, 0.8);
    particle.fillCircle(startX, startY, 3);
    
    // Animación hacia el núcleo
    this.tweens.add({
      targets: particle,
      x: 500,
      y: 250,
      scaleX: 0.2,
      scaleY: 0.2,
      alpha: 0,
      duration: 2000,
      ease: 'Quad.easeIn',
      onComplete: () => {
        particle.destroy();
      }
    });
  }

  createGameUI() {
    // Centrar los elementos de la UI horizontalmente
    this.scoreText = this.add.text(200, 40, 'Puntos: 0', {
      fontSize: '22px',
      fill: '#00ffff',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // this.livesText = this.add.text(200, 55, 'Vidas: 3', {
    //   fontSize: '20px',
    //   fill: '#ff6666',
    //   fontFamily: 'Arial Bold',
    //   stroke: '#330000',
    //   strokeThickness: 1
    // }).setOrigin(0.5); // ELIMINADO: Sistema de vidas

    // Indicador de barreras restantes eliminado por solicitud del usuario
    // this.barriersText = this.add.text(600, 25, `Barreras: ${this.barriersRemaining}/${this.maxBarriersPerLevel}`, {
    //   fontSize: '18px',
    //   fill: '#00ff88',
    //   fontFamily: 'Arial Bold',
    //   stroke: '#004400',
    //   strokeThickness: 1
    // });

    // Botón de regreso eliminado por solicitud del usuario
    // this.backBtn = this.add.rectangle(720, 40, 100, 35, 0x666666)
    //   .setInteractive()
    //   .on('pointerdown', () => this.showMainMenu())
    //   .on('pointerover', () => this.backBtn.setFillStyle(0x888888))
    //   .on('pointerout', () => this.backBtn.setFillStyle(0x666666))
    //   .setVisible(false); // Oculto inicialmente
    
    // this.backBtnText = this.add.text(720, 40, 'MENÚ', {
    //   fontSize: '14px',
    //   fill: '#ffffff',
    //   fontFamily: 'Arial Bold'
    // }).setOrigin(0.5).setVisible(false);
    
    // Mostrar el botón de menú después de 3 segundos - ELIMINADO
    // this.time.delayedCall(3000, () => {
    //   if (this.gameMode === 'containment') {
    //     this.showMenuButton();
    //   }
    // });

    // Instrucciones mejoradas con objetivo del nivel
    const levelObjectives = {
      1: "Destruye 20 nanobots para completar el nivel",
      2: "Destruye 35 nanobots con solo 6 barreras",
      3: "Sobrevive oleadas intensas - 50 nanobots",
      4: "Estrategia avanzada - 65 nanobots con 4 barreras",
      5: "Desafío final - 80 nanobots con 3 barreras"
    };
    
    const currentObjective = levelObjectives[this.currentLevel] || "Haz clic para colocar barreras de energía y detener los nanorrobots";
    
    this.add.text(400, 570, currentObjective, {
      fontSize: '16px',
      fill: '#aaaaaa',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
  }

  // showMenuButton() - Función eliminada por solicitud del usuario
  // showMenuButton() {
  //   // Mostrar el botón de menú con animación suave
  //   if (this.backBtn && this.backBtnText) {
  //     this.backBtn.setVisible(true).setAlpha(0);
  //     this.backBtnText.setVisible(true).setAlpha(0);
  //     
  //     // Animación de aparición
  //     this.tweens.add({
  //       targets: [this.backBtn, this.backBtnText],
  //       alpha: 1,
  //       duration: 500,
  //       ease: 'Power2'
  //     });
  //     
  //     // Efecto de brillo inicial
  //     this.tweens.add({
  //       targets: this.backBtn,
  //       scaleX: { from: 1, to: 1.1 },
  //       scaleY: { from: 1, to: 1.1 },
  //       duration: 300,
  //       yoyo: true,
  //       ease: 'Back.easeOut'
  //     });
  //   }
  // }

  startNanobotSpawning() {
    // Spawn optimizado para mejor rendimiento - reducido para menos nanobots
    const baseDelay = Math.max(1200, 2500 - (this.currentLevel * 150)); // Aumentado de 800 a 1200 y de 2000 a 2500
    this.currentSpawnDelay = baseDelay;
    
    // Delay inicial más largo para mejor rendimiento
    this.time.delayedCall(1500, () => {
      this.nanobotTimer = this.time.addEvent({
        delay: this.currentSpawnDelay,
        callback: this.spawnNanobot,
        callbackScope: this,
        loop: true
      });
    });
    
    // Spawn de oleadas menos frecuente - cada 20 segundos (aumentado de 15)
    this.waveTimer = this.time.addEvent({
      delay: 20000,
      callback: this.spawnWave,
      callbackScope: this,
      loop: true
    });
  }
  
  // Función removida - spawn ahora es constante
  
  showSpawnAccelerationEffect() {
    // Efecto visual para indicar que el spawn se está acelerando
    const warningText = this.add.text(400, 100, '¡AMENAZA INTENSIFICÁNDOSE!', {
      fontSize: '20px',
      fill: '#ff4444',
      fontFamily: 'Arial Bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0);
    
    this.tweens.add({
      targets: warningText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          if (warningText) {
            this.tweens.add({
              targets: warningText,
              alpha: 0,
              duration: 1000,
              onComplete: () => warningText.destroy()
            });
          }
        });
      }
    });
    
    // Efecto de pulso en la pantalla
    const pulseOverlay = this.add.rectangle(500, 250, 1000, 500, 0xff4444, 0.1);
    this.tweens.add({
      targets: pulseOverlay,
      alpha: 0,
      duration: 800,
      onComplete: () => pulseOverlay.destroy()
    });
  }

  spawnNanobot() {
    if (this.gameMode !== 'containment') return;

    // Spawn desde los bordes
    const edge = Phaser.Math.Between(0, 3);
    let x, y;
    
    switch(edge) {
      case 0: x = 0; y = Phaser.Math.Between(100, 400); break;
      case 1: x = 1000; y = Phaser.Math.Between(100, 400); break;
      case 2: x = Phaser.Math.Between(100, 900); y = 80; break;
      case 3: x = Phaser.Math.Between(100, 900); y = 500; break;
    }

    // Menor probabilidad de naves, más robots
    const shipProbability = Math.min(0.35, 0.2 + (this.currentLevel * 0.08));
    const isShip = Math.random() < shipProbability;
    
    let enemy;
    if (isShip) {
      // Crear nave nanorobótica
      enemy = this.createNanoroboticShip(x, y);
    } else {
      // Crear nanobot regular
      enemy = this.createEnhancedNanobot(x, y);
    }
    
    this.nanobots.push(enemy);
    
    // Reproducir sonido de spawn apropiado
    if (isShip && this.sounds && this.sounds.electromagnetic) {
      // SONIDO ELIMINADO POR SOLICITUD DEL USUARIO
      // this.sounds.electromagnetic.play();
    } else if (this.sounds && this.sounds.nanobotSpawn) {
      // SONIDO ELIMINADO POR SOLICITUD DEL USUARIO
      // this.sounds.nanobotSpawn.play();
    }
  }
  
  spawnWave() {
    if (this.gameMode !== 'containment') return;
    
    // Crear oleada más pequeña para mejor rendimiento - reducida aún más
    const waveSize = Phaser.Math.Between(1, 2); // Reducido de 2-3 a 1-2
    
    for (let i = 0; i < waveSize; i++) {
      this.time.delayedCall(i * 200, () => {
        this.spawnNanobot();
      });
    }
    
    // Efecto visual de oleada
    const waveText = this.add.text(500, 80, '¡OLEADA ENTRANTE!', {
      fontSize: '16px',
      fill: '#ff6600',
      fontFamily: 'Arial Bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0);
    
    this.tweens.add({
      targets: waveText,
      alpha: 1,
      y: 60,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: waveText,
            alpha: 0,
            duration: 500,
            onComplete: () => waveText.destroy()
          });
        });
      }
    });
  }

  createEnhancedNanobot(x, y) {
    const container = this.add.container(x, y);
    
    // Usar la imagen de nanorobots con tamaño mucho más pequeño
    const nanobot = this.add.image(0, 0, 'nanorobots');
    nanobot.setScale(0.08); // Robots mucho más pequeños - reducido de 0.15 a 0.08
    
    container.add(nanobot);
    
    // Solo movimiento hacia el centro, sin animaciones adicionales
    const speed = Math.max(8000, 12000 - (this.currentLevel * 800));
    this.tweens.add({
      targets: container,
      x: 500,
      y: 250,
      duration: speed,
      ease: 'Linear',
      onComplete: () => {
        this.nanobotReachedCore(container);
      }
    });

    return container;
  }

  updateNanobotTrail(container) {
    if (!container.trail || !container.trailPoints) return;
    
    // Añadir punto actual al trail
    container.trailPoints.push({ x: container.x, y: container.y });
    
    // Limitar el número de puntos del trail
    if (container.trailPoints.length > 15) {
      container.trailPoints.shift();
    }
    
    // Dibujar el trail
    container.trail.clear();
    if (container.trailPoints.length > 1) {
      for (let i = 1; i < container.trailPoints.length; i++) {
        const alpha = i / container.trailPoints.length;
        const width = alpha * 4;
        
        container.trail.lineStyle(width, 0xff4444, alpha * 0.8);
        container.trail.lineBetween(
          container.trailPoints[i-1].x,
          container.trailPoints[i-1].y,
          container.trailPoints[i].x,
          container.trailPoints[i].y
        );
      }
    }
  }

  createNanoroboticShip(x, y) {
    const container = this.add.container(x, y);
    container.enemyType = 'ship';
    
    // Marcar como nave nanorobótica para el sistema de puntuación
    container.setData('isNanoroboticShip', true);
    
    // Crear la nave usando la imagen SVG cargada con tamaño mucho más pequeño
    const shipSprite = this.add.image(0, 0, 'nanorobotic_ship');
    shipSprite.setScale(0.35); // Ajustar tamaño - reducido de 0.6 a 0.35
    shipSprite.setTint(0x00ffff); // Tinte azul cian
    container.add(shipSprite);

    
    // Efectos de partículas del motor
    const engineParticles = this.add.graphics();
    container.add(engineParticles);
    container.engineParticles = engineParticles;
    
    // Solo movimiento hacia el centro, sin animaciones adicionales
    const baseSpeed = Math.max(7000, 10000 - (this.currentLevel * 600));
    
    // Movimiento principal hacia el centro
    this.tweens.add({
      targets: container,
      x: 400,
      y: 300,
      duration: baseSpeed,
      ease: 'Power1',
      onComplete: () => {
        this.nanobotReachedCore(container);
      },
      onUpdate: () => {
        // Actualizar partículas del motor
        this.updateShipEngineParticles(container);
      }
    });
    
    return container;
  }
  
  updateShipEngineParticles(ship) {
    if (!ship.engineParticles) return;
    
    ship.engineParticles.clear();
    
    // Crear partículas del motor
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * 4;
      const offsetY = 8 + Math.random() * 6;
      const size = 1 + Math.random() * 2;
      const alpha = 0.3 + Math.random() * 0.4;
      
      ship.engineParticles.fillStyle(0x00ffff, alpha);
      ship.engineParticles.fillCircle(offsetX, offsetY, size);
    }
  }

  placeBarrier(x, y) {
    try {
      console.log(`[DEBUG] Colocando barrera en posición (${x}, ${y}). Barreras actuales: ${this.barriers.length}`);
      
      // Verificar delay inicial para evitar colocación temprana de barreras
      const currentTime = this.time.now;
      const timeSinceGameStart = currentTime - (this.gameStartTime || 0);
      
      if (timeSinceGameStart < this.initialBarrierDelay) {
        console.log(`[DEBUG] Delay inicial activo. Tiempo restante: ${Math.ceil((this.initialBarrierDelay - timeSinceGameStart) / 1000)}s`);
        
        // Mostrar mensaje de advertencia
        const warningText = this.add.text(500, 150, `Espera ${Math.ceil((this.initialBarrierDelay - timeSinceGameStart) / 1000)}s antes de colocar barreras`, {
          fontSize: '18px',
          fill: '#ffaa00',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
        
        // Hacer que el mensaje desaparezca después de 1.5 segundos
        this.tweens.add({
          targets: warningText,
          alpha: 0,
          duration: 1500,
          onComplete: () => {
            try {
              warningText.destroy();
            } catch (e) {
              console.error('[ERROR] Error al destruir texto de advertencia:', e);
            }
          }
        });
        
        return;
      }
      
      // Verificar cooldown para evitar spam de barreras
      if (currentTime - this.lastBarrierTime < this.barrierCooldown) {
        console.log('[DEBUG] Cooldown activo, cancelando colocación de barrera');
        return;
      }
      this.lastBarrierTime = currentTime;
      
      // Permitir colocar barreras cerca del núcleo con advertencia
      const distance = Phaser.Math.Distance.Between(x, y, 400, 300);
      if (distance < 80) {
        console.log('[DEBUG] Barrera cerca del núcleo - usando versión optimizada');
        // No cancelar, solo registrar para optimización
      }

      // Verificar límite de barreras por nivel
      if (this.barriersUsed >= this.maxBarriersPerLevel) {
        console.log('[DEBUG] Límite de barreras por nivel alcanzado, mostrando advertencia');
        // Mostrar mensaje de advertencia específico del nivel
        const warningText = this.add.text(400, 100, `¡Solo puedes usar ${this.maxBarriersPerLevel} barreras en este nivel!`, {
          fontSize: '20px',
          fill: '#ff6666',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
        
        // Hacer que el mensaje desaparezca después de 2 segundos
        this.tweens.add({
          targets: warningText,
          alpha: 0,
          duration: 2000,
          onComplete: () => {
            try {
              warningText.destroy();
            } catch (e) {
              console.error('[ERROR] Error al destruir texto de advertencia:', e);
            }
          }
        });
        
        return; // No crear más barreras
      }

      // Límite máximo de barreras para evitar problemas de rendimiento
      const maxBarriers = 25; // Reducido para mejor rendimiento
      if (this.barriers.length >= maxBarriers) {
        console.log('[DEBUG] Límite de barreras alcanzado, mostrando advertencia');
        // Mostrar mensaje de advertencia sin reiniciar el nivel
        const warningText = this.add.text(400, 100, '¡Límite de barreras alcanzado!', {
          fontSize: '24px',
          fill: '#ff6666',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
        
        // Hacer que el mensaje desaparezca después de 2 segundos
        this.tweens.add({
          targets: warningText,
          alpha: 0,
          duration: 2000,
          onComplete: () => {
            try {
              warningText.destroy();
            } catch (e) {
              console.error('[ERROR] Error al destruir texto de advertencia:', e);
            }
          }
        });
        
        return; // No crear más barreras
      }

      // Crear barrera mejorada
      console.log('[DEBUG] Creando barrera mejorada...');
      const barrier = this.createEnhancedBarrier(x, y);
      if (barrier) {
        this.barriers.push(barrier);
        
        // Actualizar contadores de barreras
        this.barriersUsed++;
        this.barriersRemaining = this.maxBarriersPerLevel - this.barriersUsed;
        
        // Actualizar UI - eliminado por solicitud del usuario
        // if (this.barriersText) {
        //   this.barriersText.setText(`Barreras: ${this.barriersRemaining}/${this.maxBarriersPerLevel}`);
        //   
        //   // Cambiar color si quedan pocas barreras
        //   if (this.barriersRemaining <= 2) {
        //     this.barriersText.setFill('#ff6666');
        //   } else if (this.barriersRemaining <= 4) {
        //     this.barriersText.setFill('#ffaa00');
        //   }
        // }
        
        console.log(`[DEBUG] Barrera creada exitosamente. Total de barreras: ${this.barriers.length}, Usadas: ${this.barriersUsed}/${this.maxBarriersPerLevel}`);
        
        // Verificar colisiones inmediatas
        this.checkBarrierCollisions(barrier);
      } else {
        console.error('[ERROR] No se pudo crear la barrera');
        return;
      }
      
      // SECUENCIA DE SONIDOS ÉPICOS PARA BARRERAS
      
      // Sonido inicial de carga de energía
      if (this.sounds && this.sounds.barrierCharge) {
        try {
          // SONIDO ELIMINADO POR SOLICITUD DEL USUARIO
          // this.sounds.barrierCharge.play();
          console.log('[DEBUG] Sonido de carga de barrera reproducido');
        } catch (e) {
          console.error('[ERROR] Error al reproducir sonido de carga:', e);
        }
      }
      
      // Sonido de activación con delay
      this.time.delayedCall(200, () => {
        try {
          if (this.sounds && this.sounds.barrierActivate) {
            this.sounds.barrierActivate.play();
            console.log('[DEBUG] Sonido de activación de barrera reproducido');
          }
        } catch (e) {
          console.error('[ERROR] Error al reproducir sonido de activación:', e);
        }
      });
    } catch (error) {
      console.error('[ERROR] Error crítico en placeBarrier:', error);
      console.error('[ERROR] Stack trace:', error.stack);
      // No reiniciar el nivel, solo registrar el error
    }
    
    // Campo de energía estabilizándose
    this.time.delayedCall(400, () => {
      if (this.sounds && this.sounds.energyField) {
        this.sounds.energyField.play();
      }
    });
    
    // Resonancia electromagnética continua
    this.time.delayedCall(600, () => {
      if (this.sounds && this.sounds.barrierResonance) {
        this.sounds.barrierResonance.play();
      }
    });
    
    // Hum de escudo estabilizado
    this.time.delayedCall(1000, () => {
      if (this.sounds && this.sounds.shieldStabilize) {
        this.sounds.shieldStabilize.play();
      }
    });
  }

  createEnhancedBarrier(x, y) {
    try {
      console.log(`[DEBUG] Iniciando creación de barrera en (${x}, ${y})`);
      
      // Verificar si estamos cerca del núcleo para usar versión ultra-simplificada
      const distanceToCore = Phaser.Math.Distance.Between(x, y, 400, 300);
      const isNearCore = distanceToCore < 120;
      
      if (isNearCore) {
        console.log('[DEBUG] Creando barrera simplificada cerca del núcleo');
        const simplifiedBarrier = this.createSimplifiedBarrier(x, y);
        if (simplifiedBarrier) {
          return simplifiedBarrier;
        } else {
          console.warn('[WARN] Fallo al crear barrera simplificada, usando versión normal');
          // Continuar con la creación normal si falla la simplificada
        }
      }
      
      const container = this.add.container(x, y);
    
    // DISEÑO COMPLETAMENTE NUEVO DE BARRERA - MÁS VISIBLE Y ATRACTIVO
    
    // Campo de energía exterior brillante
    const outerField = this.add.graphics();
    outerField.fillStyle(0x00aaff, 0.2);
    outerField.lineStyle(3, 0x00ddff, 0.8);
    outerField.fillCircle(0, 0, 35);
    outerField.strokeCircle(0, 0, 35);
    
    // Campo de energía medio
    const middleField = this.add.graphics();
    middleField.fillStyle(0x0088ff, 0.3);
    middleField.lineStyle(2, 0x00bbff, 0.9);
    middleField.fillCircle(0, 0, 25);
    middleField.strokeCircle(0, 0, 25);
    
    // Núcleo central brillante y grande
    const core = this.add.graphics();
    core.fillStyle(0xffffff, 0.9);
    core.lineStyle(2, 0x00ffff, 1.0);
    core.fillCircle(0, 0, 12);
    core.strokeCircle(0, 0, 12);
    
    // Anillos electromagnéticos múltiples
    const ring1 = this.add.graphics();
    ring1.lineStyle(3, 0x88ff88, 0.8);
    ring1.strokeCircle(0, 0, 30);
    
    const ring2 = this.add.graphics();
    ring2.lineStyle(2, 0xffff88, 0.7);
    ring2.strokeCircle(0, 0, 20);
    
    // Líneas de energía radiales más prominentes
    const energyLines = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const line = this.add.line(0, 0, 0, 0, 
        Math.cos(angle) * 40, Math.sin(angle) * 40, 0x00ffff);
      line.setLineWidth(3);
      line.setAlpha(0.9);
      energyLines.push(line);
      container.add(line);
    }
    
    // Partículas de energía orbitales más grandes
    const particles = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 28;
      const particleX = Math.cos(angle) * radius;
      const particleY = Math.sin(angle) * radius;
      
      const particle = this.add.graphics();
      particle.fillStyle(0x00ffff, 1.0);
      particle.fillCircle(particleX, particleY, 3);
      particles.push(particle);
      container.add(particle);
    }
    
    // Hexágono decorativo exterior
    const hexOuter = this.add.polygon(0, 0, [
      [-20, -12], [0, -24], [20, -12], [20, 12], [0, 24], [-20, 12]
    ], 0x004488, 0.3);
    hexOuter.setStrokeStyle(2, 0x0088ff, 0.8);
    
    container.add([outerField, middleField, hexOuter, ring1, ring2, core]);
    
    // Efecto de aparición mejorado y más visible
    container.setScale(0);
    container.setAlpha(0);
    
    // Animación de aparición más dramática
    this.tweens.add({
      targets: container,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 1,
      duration: 800,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Pequeño rebote final
        this.tweens.add({
          targets: container,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 200,
          ease: 'Bounce.easeOut'
        });
      }
    });
    
    // Animación continua de pulsación para mayor visibilidad
    this.tweens.add({
      targets: [outerField, middleField],
      alpha: 0.8,
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    
    // Rotación continua de anillos
    this.tweens.add({
      targets: ring1,
      rotation: Math.PI * 2,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });
    
    this.tweens.add({
      targets: ring2,
      rotation: -Math.PI * 2,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Animación de partículas orbitales
    particles.forEach((particle, index) => {
      this.tweens.add({
        targets: particle,
        alpha: 0.5,
        duration: 1000 + (index * 100),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
    });
    
    // Pulsación del núcleo central
    this.tweens.add({
      targets: core,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    
    // Animaciones mejoradas para la barrera
    
    // 1. Rotación continua del hexágono
    this.tweens.add({
      targets: hexBase,
      rotation: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // 2. Pulsación del campo de energía principal
    this.tweens.add({
      targets: mainField,
      scaleX: { from: 1, to: 1.3 },
      scaleY: { from: 1, to: 1.3 },
      alpha: { from: 0.3, to: 0.6 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // 3. Rotación del anillo electromagnético
    this.tweens.add({
      targets: ring,
      rotation: -Math.PI * 2,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Configuración de propiedades físicas y colisión
    container.setSize(70, 70); // Área de colisión más grande
    container.body = { width: 70, height: 70 };
    container.setData('isBarrier', true);
    container.setData('health', 100);
    
    this.barriers.push(container);
    console.log(`[DEBUG] Barrera mejorada creada exitosamente en (${x}, ${y}). Total: ${this.barriers.length}`);
    return container;
    } catch (error) {
      console.error('[ERROR] Error crítico en createEnhancedBarrier:', error);
      console.error('[ERROR] Stack trace:', error.stack);
      // Crear una barrera simple como fallback
      const fallbackBarrier = this.add.circle(x, y, 20, 0x00ff00, 0.5);
      console.log('[DEBUG] Barrera de respaldo creada');
      return fallbackBarrier;
    }
  }
  
  createSimplifiedBarrier(x, y) {
    try {
      console.log(`[DEBUG] Creando barrera ultra-simplificada en (${x}, ${y})`);
      
      // Barrera ultra-simple: solo un círculo con borde
      const barrier = this.add.graphics();
      barrier.x = x;
      barrier.y = y;
      
      // Núcleo simple - ULTRA PEQUEÑO
      barrier.fillStyle(0x00ffaa, 0.6);
      barrier.lineStyle(1, 0x66ffcc, 0.9); // Línea más delgada
      barrier.fillCircle(0, 0, 9); // Reducido de 18 a 9 (50% más pequeño)
      barrier.strokeCircle(0, 0, 9);
      
      // Punto central - ULTRA PEQUEÑO
      barrier.fillStyle(0x88ffff, 0.9);
      barrier.fillCircle(0, 0, 2); // Reducido de 4 a 2 (50% más pequeño)
      
      // Efecto de aparición mejorado con rotación
      barrier.setScale(0);
      barrier.setAlpha(0);
      barrier.setRotation(Math.PI);
      
      this.tweens.add({
        targets: barrier,
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        rotation: 0,
        duration: 400,
        ease: 'Back.easeOut'
      });
      
      // Animaciones continuas para la barrera simplificada
      
      // Pulsación del núcleo
      this.tweens.add({
        targets: barrier,
        scaleX: { from: 1, to: 1.2 },
        scaleY: { from: 1, to: 1.2 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Rotación suave
      this.tweens.add({
        targets: barrier,
        rotation: Math.PI * 2,
        duration: 6000,
        repeat: -1,
        ease: 'Linear'
      });
      
      // Efecto de brillo
      this.tweens.add({
        targets: barrier,
        alpha: { from: 0.6, to: 1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      console.log('[DEBUG] Barrera ultra-simplificada creada exitosamente');
      return barrier;
    } catch (error) {
      console.error('[ERROR] Error en createSimplifiedBarrier:', error);
      // Fallback extremo: solo un círculo básico - ULTRA PEQUEÑO
      const basicBarrier = this.add.circle(x, y, 7, 0x00ff00, 0.5); // Reducido de 15 a 7 (50% más pequeño)
      return basicBarrier;
    }
  }

  createElectromagneticParticles(x, y, container) {
    try {
      console.log('[DEBUG] Creando partículas electromagnéticas optimizadas...');
    // Crear partículas electromagnéticas simples con gráficos
    const particles = [];
    const colors = [0x00ffff, 0x0088ff, 0x44aaff, 0x88ccff];
    
    // Reducir número de partículas según la cantidad de barreras
    const maxParticles = this.barriers.length > 20 ? 2 : (this.barriers.length > 10 ? 4 : 6);
    
    // Crear partículas orbitales simples - ULTRA CERCA DE LA BARRERA
    for (let i = 0; i < maxParticles; i++) {
      const angle = (i / maxParticles) * Math.PI * 2;
      const radius = 12 + (i * 1); // Reducido de 25 + (i * 2) a 12 + (i * 1) - 50% más pequeño
      const particleX = Math.cos(angle) * radius;
      const particleY = Math.sin(angle) * radius;
      
      const particle = this.add.graphics();
      particle.fillStyle(colors[i % colors.length], 0.8);
      particle.fillCircle(particleX, particleY, 1); // Reducido de 1.5 a 1
      particles.push(particle);
      container.add(particle);
      
      // Animación orbital solo si hay pocas barreras
      if (this.barriers.length < 15) {
        this.tweens.add({
          targets: particle,
          x: Math.cos(angle + Math.PI * 2) * radius,
          y: Math.sin(angle + Math.PI * 2) * radius,
          duration: 3000 + (i * 200),
          repeat: -1,
          ease: 'Linear'
        });
        
        // Efecto de parpadeo solo si hay muy pocas barreras
        if (this.barriers.length < 8) {
          this.tweens.add({
            targets: particle,
            alpha: { from: 0.8, to: 0.3 },
            duration: 500 + (i * 100),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }
    }
    
    // Ondas de energía radiales solo si hay muy pocas barreras
    if (this.barriers.length < 10) {
      this.time.addEvent({
        delay: 2000, // Aumentar delay
        callback: () => {
          if (container && container.active) {
            this.createEnergyPulse(x, y);
          }
        },
        repeat: 5 // Limitar repeticiones
      });
    }
    
      console.log('[DEBUG] Partículas electromagnéticas optimizadas creadas exitosamente');
      return particles;
    } catch (error) {
      console.error('[ERROR] Error en createElectromagneticParticles:', error);
      console.error('[ERROR] Stack trace:', error.stack);
      // Retornar array vacío como fallback
      return [];
    }
  }
  
  createEnergyPulse(x, y) {
    // Crear pulso de energía electromagnética
    const pulse = this.add.graphics();
    pulse.fillStyle(0x00ffff, 0.8);
    pulse.lineStyle(2, 0xffffff, 1);
    pulse.fillCircle(x, y, 5);
    pulse.strokeCircle(x, y, 5);
    
    this.tweens.add({
      targets: pulse,
      scaleX: { from: 0.2, to: 3 },
      scaleY: { from: 0.2, to: 3 },
      alpha: { from: 0.8, to: 0 },
      duration: 1200,
      ease: 'Power2.easeOut',
      onComplete: () => pulse.destroy()
    });
    
    // Crear rayos de energía
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const ray = this.add.line(x, y, 0, 0, Math.cos(angle) * 40, Math.sin(angle) * 40, 0x00ffff, 0.8);
      ray.setLineWidth(3);
      
      this.tweens.add({
        targets: ray,
        scaleX: { from: 0.5, to: 2 },
        scaleY: { from: 0.5, to: 2 },
        alpha: { from: 0.8, to: 0 },
        duration: 800,
        ease: 'Power2.easeOut',
        onComplete: () => ray.destroy()
      });
    }
  }

  checkShieldCollisions() {
    try {
      // Validar que existan nanobots y el escudo
      if (!this.nanobots || !this.shield || this.nanobots.length === 0) {
        return;
      }
      
      const coreX = 480; // Actualizado para coincidir con la nueva posición del escudo
      const coreY = 250;
      const shieldRadius = 80; // Radio actualizado para coincidir con el nuevo escudo
      
      // Obtener la rotación actual del escudo
      const shieldRotation = this.shield.rotation;
      
      // Definir el arco del escudo (180 grados)
      const shieldArcStart = shieldRotation - Math.PI/2; // -90 grados desde la rotación
      const shieldArcEnd = shieldRotation + Math.PI/2;   // +90 grados desde la rotación
    
      // Limitar el número de nanobots verificados para mejorar rendimiento
      const maxNanobotsToCheck = Math.min(10, this.nanobots.length);
      
      // Iterar hacia atrás para evitar problemas con splice
      for (let i = this.nanobots.length - 1; i >= Math.max(0, this.nanobots.length - maxNanobotsToCheck); i--) {
        const nanobot = this.nanobots[i];
        if (!nanobot || !nanobot.active) continue;
        
        // Calcular distancia desde el núcleo
        const distance = Phaser.Math.Distance.Between(coreX, coreY, nanobot.x, nanobot.y);
        
        // Verificar si está en el radio del escudo (con margen de seguridad más amplio)
        if (distance >= shieldRadius - 35 && distance <= shieldRadius + 35) {
          // Calcular ángulo del nanobot respecto al núcleo
          const nanobotAngle = Phaser.Math.Angle.Between(coreX, coreY, nanobot.x, nanobot.y);
          
          // Normalizar ángulos para comparación
          let normalizedNanobotAngle = nanobotAngle;
          let normalizedStart = shieldArcStart;
          let normalizedEnd = shieldArcEnd;
          
          // Ajustar para el caso donde el arco cruza el límite -π/π
          if (normalizedEnd < normalizedStart) {
            if (normalizedNanobotAngle < 0) {
              normalizedNanobotAngle += 2 * Math.PI;
            }
            normalizedEnd += 2 * Math.PI;
          }
          
          // Verificar si el nanobot está dentro del arco del escudo
          if (normalizedNanobotAngle >= normalizedStart && normalizedNanobotAngle <= normalizedEnd) {
            // SONIDOS ÉPICOS DE COLISIÓN CON ESCUDO (con verificación de seguridad)
            if (this.sounds && this.sounds.barrierHit) {
              this.sounds.barrierHit.play();
            }
            
            // Descarga de energía al impacto
            this.time.delayedCall(50, () => {
              if (this.sounds && this.sounds.energyDischarge) {
                this.sounds.energyDischarge.play();
              }
            });
            
            // Sobrecarga temporal del escudo
            this.time.delayedCall(150, () => {
              if (this.sounds && this.sounds.barrierOverload) {
                this.sounds.barrierOverload.play();
              }
            });
            
            // Estabilización del escudo después del impacto
            this.time.delayedCall(400, () => {
              if (this.sounds && this.sounds.shieldHum) {
                this.sounds.shieldHum.play();
              }
            });
            
            // Crear efectos espectaculares de colisión
            this.createSpectacularCollisionEffect(nanobot.x, nanobot.y, this.shield);
            
            // Destruir nanobot
            this.destroyNanobot(nanobot, i);
          }
        }
      }
    } catch (error) {
      console.error('[ERROR] Error en checkShieldCollisions:', error);
      console.error('[ERROR] Stack trace:', error.stack);
    }
  }

  destroyNanobot(nanobot, index, checkCompletion = true) {
    // Validar que el nanobot existe y el índice es válido
    if (!nanobot || !this.nanobots || index < 0 || index >= this.nanobots.length) {
      return;
    }
    
    // Determinar si es una nave nanorobótica o nanobot regular
    const isNanoroboticShip = nanobot.getData && nanobot.getData('isNanoroboticShip');
    
    // Reproducir sonido de destrucción apropiado
    if (isNanoroboticShip) {
      if (this.sounds && this.sounds.shieldBreak) {
        this.sounds.shieldBreak.play();
      }
      if (this.sounds && this.sounds.energyPulse) {
        this.time.delayedCall(100, () => {
          if (this.sounds && this.sounds.energyPulse) {
            this.sounds.energyPulse.play();
          }
        });
      }
    } else {
      if (this.sounds && this.sounds.nanobotDestroy) {
        this.sounds.nanobotDestroy.play();
      }
      if (this.sounds && this.sounds.energyPulse) {
        this.time.delayedCall(50, () => {
          if (this.sounds && this.sounds.energyPulse) {
            this.sounds.energyPulse.play();
          }
        });
      }
    }
    
    // Remover de la lista
    this.tweens.killTweensOf(nanobot);
    this.nanobots.splice(index, 1);
    
    // Crear explosión mejorada
    this.createExplosionEffect(nanobot.x, nanobot.y);
    
    // Destruir nanobot
    nanobot.destroy();
    
    // Solo otorgar puntos si no es por tocar el núcleo
    if (checkCompletion) {
      // Calcular puntuación balanceada según el tipo de enemigo
      let pointsEarned;
      if (isNanoroboticShip) {
        // Las naves nanorobóticas otorgan 30 puntos fijos
        pointsEarned = 30;
      } else {
        // Nanobots regulares otorgan puntos base
        pointsEarned = 10 * this.currentLevel;
      }
      
      this.score += pointsEarned;
      if (this.scoreText) {
        this.scoreText.setText('Puntos: ' + this.score);
      }
      
      // Crear animación espectacular de puntos
      this.createSpectacularPointsAnimation(nanobot.x, nanobot.y, pointsEarned);
      
      // Verificar si se completó el nivel solo si no es por tocar el núcleo
      this.checkLevelCompletion();
    }
  }

  createExplosionEffect(x, y) {
    // EXPLOSIÓN PRINCIPAL MEJORADA
    const mainExplosion = this.add.graphics();
    mainExplosion.fillStyle(0xffffff, 1);
    mainExplosion.lineStyle(3, 0xffff00, 0.8);
    mainExplosion.fillCircle(x, y, 8);
    mainExplosion.strokeCircle(x, y, 8);
    
    this.tweens.add({
      targets: mainExplosion,
      scaleX: { from: 0.2, to: 4 },
      scaleY: { from: 0.2, to: 4 },
      alpha: { from: 1, to: 0 },
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => mainExplosion.destroy()
    });
    
    // ONDAS DE CHOQUE MÚLTIPLES
    for (let wave = 0; wave < 3; wave++) {
      this.time.delayedCall(wave * 100, () => {
        const shockWave = this.add.graphics();
        shockWave.fillStyle(0x00ffff, 0.6 - (wave * 0.2));
        shockWave.lineStyle(2, 0x88ffff, 0.8 - (wave * 0.25));
        shockWave.fillCircle(x, y, 5);
        shockWave.strokeCircle(x, y, 5);
        
        this.tweens.add({
          targets: shockWave,
          scaleX: { from: 0.1, to: 5 + wave * 1 },
          scaleY: { from: 0.1, to: 5 + wave * 1 },
          alpha: { from: 0.5 - (wave * 0.15), to: 0 },
          duration: 400 + (wave * 100),
          ease: 'Quad.easeOut',
          onComplete: () => shockWave.destroy()
        });
      });
    }
    
    // NÚCLEO DE ENERGÍA BRILLANTE
    const energyCore = this.add.graphics();
    energyCore.fillStyle(0xff00ff, 0.9);
    energyCore.fillCircle(x, y, 4);
    
    this.tweens.add({
      targets: energyCore,
      scaleX: { from: 1, to: 2.5 },
      scaleY: { from: 1, to: 2.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 250,
      ease: 'Back.easeOut',
      onComplete: () => energyCore.destroy()
    });
    
    // FRAGMENTOS DE NANOBOT DISPERSOS
    const fragmentColors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff];
    
    for (let i = 0; i < 10; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const distance = Phaser.Math.Between(60, 120);
      const fragmentSize = Phaser.Math.Between(2, 4);
      
      const fragment = this.add.graphics();
      fragment.fillStyle(Phaser.Math.RND.pick(fragmentColors), 0.8);
      fragment.fillCircle(x, y, fragmentSize);
      
      // Calcular posición final con dispersión
      const endX = x + Math.cos(angle) * distance + Phaser.Math.Between(-20, 20);
      const endY = y + Math.sin(angle) * distance + Phaser.Math.Between(-20, 20);
      
      this.tweens.add({
        targets: fragment,
        x: endX,
        y: endY + 20, // Efecto de gravedad reducido
        scaleX: { from: 1, to: 0.2 },
        scaleY: { from: 1, to: 0.2 },
        alpha: { from: 0.7, to: 0 },
        rotation: Phaser.Math.Between(0, Math.PI * 2),
        duration: Phaser.Math.Between(300, 500),
        ease: 'Quad.easeOut',
        delay: i * 10,
        onComplete: () => fragment.destroy()
      });
    }
    
    // PARTÍCULAS DE ENERGÍA RADIANTE
    for (let i = 0; i < 16; i++) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.Between(80, 150);
      const particleSize = Phaser.Math.Between(1, 3);
      
      const energyParticle = this.add.graphics();
      energyParticle.fillStyle(0xffffff, 0.9);
      energyParticle.fillCircle(x, y, particleSize);
      
      const endX = x + Math.cos(angle) * speed;
      const endY = y + Math.sin(angle) * speed;
      
      this.tweens.add({
        targets: energyParticle,
        x: endX,
        y: endY,
        scaleX: { from: 1, to: 0.3 },
        scaleY: { from: 1, to: 0.3 },
        alpha: { from: 0.8, to: 0 },
        duration: Phaser.Math.Between(250, 400),
        ease: 'Quad.easeOut',
        delay: i * 5,
        onComplete: () => energyParticle.destroy()
      });
    }
    
    // EFECTO DE DESINTEGRACIÓN DIGITAL
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 25, () => {
        const digitalBit = this.add.rectangle(
          x + Phaser.Math.Between(-30, 30),
          y + Phaser.Math.Between(-30, 30),
          Phaser.Math.Between(2, 6),
          Phaser.Math.Between(2, 6),
          0x00ff88,
          0.7
        );
        
        this.tweens.add({
          targets: digitalBit,
          y: digitalBit.y - 50,
          scaleX: { from: 1, to: 0.1 },
          scaleY: { from: 1, to: 0.1 },
          alpha: { from: 0.7, to: 0 },
          rotation: Phaser.Math.Between(0, Math.PI),
          duration: 600,
          ease: 'Quad.easeOut',
          onComplete: () => digitalBit.destroy()
        });
      });
    }
    
    // RAYOS DE ENERGÍA DESDE EL CENTRO
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const rayLength = 80;
      
      const ray = this.add.line(x, y, 0, 0, 
        Math.cos(angle) * rayLength, 
        Math.sin(angle) * rayLength, 
        0xffff00, 0.8
      );
      ray.setLineWidth(3);
      
      this.tweens.add({
        targets: ray,
        alpha: { from: 0.8, to: 0 },
        scaleX: { from: 0.1, to: 1.5 },
        scaleY: { from: 0.1, to: 1.5 },
        duration: 300,
        ease: 'Quad.easeOut',
        delay: i * 20,
        onComplete: () => ray.destroy()
      });
    }
    
    // FLASH DE LUZ FINAL
    const finalFlash = this.add.circle(x, y, 100, 0xffffff, 0.6);
    
    this.tweens.add({
      targets: finalFlash,
      scaleX: { from: 0.1, to: 2 },
      scaleY: { from: 0.1, to: 2 },
      alpha: { from: 0.6, to: 0 },
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => finalFlash.destroy()
    });
  }

  checkLevelCompletion() {
    // Evitar múltiples ejecuciones simultáneas
    if (this.levelCompleting) {
      return;
    }
    
    // Sistema de progresión por niveles con objetivos específicos
    const levelObjectives = {
      1: { score: 200, description: "Destruye 20 nanobots" },
      2: { score: 350, description: "Destruye 35 nanobots con menos barreras" },
      3: { score: 500, description: "Sobrevive oleadas intensas" },
      4: { score: 650, description: "Domina la estrategia avanzada" },
      5: { score: 800, description: "Completa el desafío final" }
    };
    
    const currentObjective = levelObjectives[this.currentLevel] || levelObjectives[5];
    const requiredScore = currentObjective.score;
    
    console.log(`Verificando nivel ${this.currentLevel} - Score actual: ${this.score}, Requerido: ${requiredScore}`);
    
    if (this.score >= requiredScore) {
      console.log(`¡Nivel ${this.currentLevel} completado! Avanzando...`);
      this.levelCompleting = true;
      this.completeContainmentLevel();
    }
  }

  completeContainmentLevel() {
    // Detener spawn de nanobots
    if (this.nanobotTimer) {
      this.nanobotTimer.destroy();
      this.nanobotTimer = null;
    }
    
    // Detener timer de oleadas
    if (this.waveTimer) {
      this.waveTimer.destroy();
      this.waveTimer = null;
    }
    
    // Detener todos los tweens de nanobots para evitar problemas
    this.tweens.killAll();
    
    // Limpiar nanobots restantes
    if (this.nanobots && this.nanobots.length > 0) {
      this.nanobots.forEach(nanobot => {
        if (nanobot && nanobot.destroy) {
          this.tweens.killTweensOf(nanobot);
          nanobot.destroy();
        }
      });
      this.nanobots = [];
    }
    
    // Mostrar mensaje de felicitaciones al completar puntos - centrado y tamaño ajustado
    const congratsMessage = this.add.text(400, 250, '¡FELICITACIONES!', {
      fontSize: '24px',
      fill: '#00ff00',
      fontFamily: 'Arial Bold',
      stroke: '#003300',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(1000);
    
    const levelMessage = this.add.text(400, 280, `¡Nivel ${this.currentLevel} Completado!`, {
      fontSize: '16px',
      fill: '#ffff00',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5).setDepth(1000);
    
    // Efecto de desvanecimiento para los mensajes
    this.tweens.add({
      targets: [congratsMessage, levelMessage],
      alpha: 0,
      y: '-=50',
      duration: 2000,
      onComplete: () => {
        congratsMessage.destroy();
        levelMessage.destroy();
      }
    });
    
    // Sonido de completado - verificar si existe antes de reproducir
    if (this.sounds && this.sounds.levelComplete) {
      this.sounds.levelComplete.play();
    }
    
    // Verificar si hay más niveles
    if (this.currentLevel < this.maxLevel) {
      // Avanzar al siguiente nivel
      this.currentLevel++;
      console.log(`Avanzando al nivel ${this.currentLevel}`);
      this.showLevelComplete();
    } else {
      // Misión completada
      console.log('¡Misión completada! Mostrando pantalla final');
      this.gameCompleted = true;
      this.showMissionComplete();
    }
  }

  showTransitionToRepair() {
    this.gameMode = 'transition';
    
    // Overlay de transición
    const overlay = this.add.rectangle(500, 250, 1000, 500, 0x000000, 0.8);
    
    // Mensaje de transición
    const message = this.add.text(500, 200, '¡CONTENCIÓN EXITOSA!', {
      fontSize: '28px',
      fill: '#00ff88',
      fontFamily: 'Arial Bold',
      stroke: '#004400',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    const text1 = this.add.text(500, 250, 'Los nanorrobots han sido contenidos.', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    const text2 = this.add.text(500, 280, 'Ahora debemos reparar los materiales dañados...', {
      fontSize: '16px',
      fill: '#ffaa00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Animación del mensaje
    this.tweens.add({
      targets: message,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Transición automática después de 3 segundos
    this.time.delayedCall(3000, () => {
      // Destruir elementos de transición
      overlay.destroy();
      message.destroy();
      text1.destroy();
      text2.destroy();
      this.startRepairGame();
    });
  }

  nanobotReachedCore(nanobot) {
    // Verificar si el nanobot aún existe y está en la lista
    if (!nanobot || !this.nanobots || nanobot.scene !== this) {
      return; // El nanobot ya fue destruido, no procesar
    }
    
    const index = this.nanobots.indexOf(nanobot);
    if (index === -1) {
      return; // El nanobot ya no está en la lista, fue destruido
    }
    
    // Verificar si el juego aún está en modo contención
    if (this.gameMode !== 'containment') {
      return; // El juego ya no está en modo contención
    }
    
    // Determinar si es una nave nanorobótica o nanobot regular
    const isNanoroboticShip = nanobot.getData && nanobot.getData('isNanoroboticShip');
    
    // Usar destroyNanobot sin verificar completación del nivel
    this.destroyNanobot(nanobot, index, false);
    
    // ELIMINADO: Sistema de vidas - ya no se pierden vidas
    // this.lives--;
    // this.livesText.setText('Vidas: ' + this.lives);
    
    // Restar puntos según el tipo de enemigo
    let pointsLost;
    if (isNanoroboticShip) {
      pointsLost = 50; // Las naves restan más puntos
    } else {
      pointsLost = 25; // Nanobots regulares restan menos
    }
    
    this.score = Math.max(0, this.score - pointsLost);
    this.scoreText.setText('Puntuación: ' + this.score);
    
    // Efecto de daño en el núcleo mejorado
    this.cameras.main.shake(200, 0.02);
    
    // Efecto visual de daño al núcleo con ondas de choque
    this.createCoreDamageEffect();
    
    // Efecto de destello rojo
    const damageFlash = this.add.rectangle(500, 250, 1000, 500, 0xff0000, 0.3);
    this.tweens.add({
      targets: damageFlash,
      alpha: 0,
      duration: 200,
      onComplete: () => damageFlash.destroy()
    });
    
    // Hacer que los indicadores de estado del núcleo cambien a rojo temporalmente
    if (this.coreStatusIndicators) {
      this.coreStatusIndicators.forEach((indicator, index) => {
        indicator.clear();
        indicator.fillStyle(0xff0000, 0.8);
        indicator.fillCircle(0, 0, 3);
        
        // Volver al color normal después de un tiempo
        this.time.delayedCall(1000, () => {
          if (indicator && indicator.scene) {
            indicator.clear();
            indicator.fillStyle(0x00ff00, 0.8);
            indicator.fillCircle(0, 0, 3);
          }
        });
      });
    }
    
    // Mostrar puntos perdidos en la posición del núcleo ya que el nanobot fue destruido
    const lostPointsText = this.add.text(500, 250, `-${pointsLost}`, {
      fontSize: '18px',
      fill: '#ff4444',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: lostPointsText,
      y: lostPointsText.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => lostPointsText.destroy()
    });
    
    // ELIMINADO: Game over por vidas - ya no hay sistema de vidas
    // if (this.lives <= 0) {
    //   this.gameOver();
    // }
  }

  createCoreDamageEffect() {
    // Ondas de choque desde el núcleo
    for (let i = 0; i < 3; i++) {
      const shockWave = this.add.graphics();
      shockWave.lineStyle(3, 0xff4444, 0.8);
      shockWave.strokeCircle(500, 250, 50);
      
      this.tweens.add({
        targets: shockWave,
        scaleX: 4,
        scaleY: 4,
        alpha: 0,
        duration: 800 + (i * 200),
        ease: 'Quad.easeOut',
        onComplete: () => shockWave.destroy()
      });
    }
    
    // Partículas de daño que salen del núcleo
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 60;
      const startX = 500 + Math.cos(angle) * distance;
      const startY = 250 + Math.sin(angle) * distance;
      
      const damageParticle = this.add.graphics();
      damageParticle.fillStyle(0xff6666, 0.9);
      damageParticle.fillCircle(startX, startY, 4);
      
      this.tweens.add({
        targets: damageParticle,
        x: startX + Math.cos(angle) * 100,
        y: startY + Math.sin(angle) * 100,
        scaleX: 0.2,
        scaleY: 0.2,
        alpha: 0,
        duration: 1000,
        ease: 'Quad.easeOut',
        onComplete: () => damageParticle.destroy()
      });
    }
    
    // Efecto de distorsión en el núcleo
    if (this.coreContainer) {
      this.tweens.add({
        targets: this.coreContainer,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true,
        repeat: 2,
        ease: 'Back.easeOut'
      });
    }
  }

  gameOver() {
    // Detener spawn
    if (this.nanobotTimer) {
      this.nanobotTimer.destroy();
    }
    
    // Ocultar la barrera cuando aparece el recuadro de game over
    if (this.shield) {
      this.shield.setVisible(false);
    }
    
    // Eliminar todos los nanobots restantes
    if (this.nanobots && this.nanobots.length > 0) {
      this.nanobots.forEach((nanobot, index) => {
        if (nanobot && nanobot.active) {
          // Crear efecto de desintegración para cada nanobot
          this.createExplosionEffect(nanobot.x, nanobot.y);
          nanobot.destroy();
        }
      });
      this.nanobots = []; // Limpiar el array
    }
    
    // Eliminar nanobots de oleadas si existen
    if (this.waveNanobots && this.waveNanobots.length > 0) {
      this.waveNanobots.forEach((nanobot) => {
        if (nanobot && nanobot.active) {
          this.createExplosionEffect(nanobot.x, nanobot.y);
          nanobot.destroy();
        }
      });
      this.waveNanobots = [];
    }
    
    // Centrar el recuadro de misión perdida
    const overlay = this.add.rectangle(400, 250, 500, 300, 0x000000, 0.9);
    overlay.setStrokeStyle(3, 0xff0000);
    
    // Centrar el texto de misión fallida
    this.add.text(400, 200, 'MISIÓN FALLIDA', {
      fontSize: '24px',
      fill: '#ff6666',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);
    
    // Centrar el texto descriptivo
    this.add.text(400, 240, 'Los nanorrobots han alcanzado el núcleo', {
      fontSize: '14px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    // Centrar el texto de puntuación
    this.add.text(400, 270, 'Puntuación final: ' + this.score, {
      fontSize: '16px',
      fill: '#ffaa00'
    }).setOrigin(0.5);
    
    // Centrar el botón de reinicio
    const restartBtn = this.add.rectangle(400, 320, 140, 45, 0x0066cc)
      .setInteractive()
      .on('pointerdown', () => this.startContainmentGame())
      .on('pointerover', () => restartBtn.setFillStyle(0x0088ff))
      .on('pointerout', () => restartBtn.setFillStyle(0x0066cc));
    
    // Centrar el texto del botón
    this.add.text(400, 320, 'REINTENTAR', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);
  }

  startRepairGame() {
    this.gameMode = 'repair';
    
    // Limpiar timers y tweens existentes
    if (this.nanobotTimer) {
      this.nanobotTimer.destroy();
      this.nanobotTimer = null;
    }
    this.tweens.killAll();
    
    // Limpiar arrays de objetos
    this.nanobots = [];
    this.barriers = [];
    this.puzzlePieces = [];
    this.targetSlots = [];
    
    // Limpiar eventos de input
    this.input.off('pointerdown');
    
    // Remover todos los objetos visuales
    this.children.removeAll();
    
    // Resetear puntuación
    this.score = 0;

    // Fondo del juego mejorado
    this.createRepairBackground();

    // UI del juego
    this.createRepairUI();

    this.createEnhancedPuzzle();
  }

  createRepairBackground() {
    // Fondo con gradiente verde
    const graphics = this.add.graphics();
    
    for (let i = 0; i < 600; i += 10) {
      const alpha = 1 - (i / 600);
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        {r: 17, g: 34, b: 0}, // Verde oscuro
        {r: 34, g: 68, b: 17}, // Verde medio
        600, i
      );
      graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), alpha * 0.3);
      graphics.fillCircle(400, 300, i);
    }

    // Partículas de reparación flotantes
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        Phaser.Math.Between(2, 5),
        0x00ff88,
        0.6
      );
      
      this.tweens.add({
        targets: particle,
        y: particle.y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }
  }

  createRepairUI() {
    // Panel de información
    const uiPanel = this.add.rectangle(400, 40, 780, 60, 0x003300, 0.8);
    uiPanel.setStrokeStyle(2, 0x00cc66);
    
    this.scoreText = this.add.text(50, 40, 'Materiales reparados: 0/4', {
      fontSize: '20px',
      fill: '#00ff88',
      fontFamily: 'Arial Bold'
    });

    // Botón de regreso
    const backBtn = this.add.rectangle(720, 40, 100, 35, 0x666666)
      .setInteractive()
      .on('pointerdown', () => this.showMainMenu())
      .on('pointerover', () => backBtn.setFillStyle(0x888888))
      .on('pointerout', () => backBtn.setFillStyle(0x666666));
    
    this.add.text(720, 40, 'MENÚ', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);

    // Instrucciones
    this.add.text(400, 570, 'Arrastra las piezas a sus posiciones correctas para activar la autorreparación', {
      fontSize: '16px',
      fill: '#aaaaaa',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
  }

  createEnhancedPuzzle() {
    const centerX = 400;
    const centerY = 280;
    
    // Crear estructura central dañada
    this.createDamagedStructure(centerX, centerY);
    
    // Crear slots y piezas mejoradas
    const slotPositions = [
      {x: centerX, y: centerY - 80, color: 0x0088ff, shape: 'triangle', name: 'Cristal de Energía'},
      {x: centerX + 80, y: centerY, color: 0x00ff88, shape: 'square', name: 'Núcleo Procesador'},
      {x: centerX, y: centerY + 80, color: 0xff8800, shape: 'circle', name: 'Reactor Cuántico'},
      {x: centerX - 80, y: centerY, color: 0xff0088, shape: 'diamond', name: 'Matriz Neural'}
    ];

    slotPositions.forEach((pos, index) => {
      this.createEnhancedSlot(pos, index);
      this.createEnhancedPiece(pos, index);
    });

    // Configurar arrastrar y soltar mejorado
    this.setupDragAndDrop();
  }

  createDamagedStructure(x, y) {
    // Estructura central dañada
    const structure = this.add.graphics();
    structure.lineStyle(4, 0x666666, 0.8);
    structure.strokeRect(x - 60, y - 60, 120, 120);
    
    // Grietas
    structure.lineStyle(2, 0xff4444, 0.6);
    structure.lineBetween(x - 60, y - 30, x + 60, y + 30);
    structure.lineBetween(x - 30, y - 60, x + 30, y + 60);
    
    // Chispas de daño
    for (let i = 0; i < 5; i++) {
      const spark = this.add.circle(
        x + Phaser.Math.Between(-50, 50),
        y + Phaser.Math.Between(-50, 50),
        2, 0xff6600
      );
      
      this.tweens.add({
        targets: spark,
        alpha: 0,
        duration: Phaser.Math.Between(500, 1500),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createEnhancedSlot(pos, index) {
    const slot = this.add.graphics();
    slot.lineStyle(4, pos.color, 0.7);
    
    // Crear forma del slot con glow
    if (pos.shape === 'triangle') {
      slot.strokeTriangle(pos.x - 25, pos.y + 20, pos.x, pos.y - 20, pos.x + 25, pos.y + 20);
    } else if (pos.shape === 'square') {
      slot.strokeRect(pos.x - 25, pos.y - 25, 50, 50);
    } else if (pos.shape === 'circle') {
      slot.strokeCircle(pos.x, pos.y, 25);
    } else if (pos.shape === 'diamond') {
      slot.strokePoints([{x: pos.x, y: pos.y - 25}, {x: pos.x + 25, y: pos.y}, 
                        {x: pos.x, y: pos.y + 25}, {x: pos.x - 25, y: pos.y}], true);
    }
    
    // Etiqueta del componente
    this.add.text(pos.x, pos.y + 40, pos.name, {
      fontSize: '12px',
      fill: pos.color,
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    this.targetSlots.push({...pos, slot, filled: false});
  }

  createEnhancedPiece(pos, index) {
    const randomX = Phaser.Math.Between(100, 700);
    const randomY = Phaser.Math.Between(450, 520);
    
    const container = this.add.container(randomX, randomY);
    
    // Crear pieza con efectos
    const piece = this.add.graphics();
    piece.fillStyle(pos.color, 0.9);
    piece.lineStyle(2, Phaser.Display.Color.Lighten(pos.color, 30));
    
    if (pos.shape === 'triangle') {
      piece.fillTriangle(-25, 20, 0, -20, 25, 20);
      piece.strokeTriangle(-25, 20, 0, -20, 25, 20);
    } else if (pos.shape === 'square') {
      piece.fillRect(-25, -25, 50, 50);
      piece.strokeRect(-25, -25, 50, 50);
    } else if (pos.shape === 'circle') {
      piece.fillCircle(0, 0, 25);
      piece.strokeCircle(0, 0, 25);
    } else if (pos.shape === 'diamond') {
      const points = [{x: 0, y: -25}, {x: 25, y: 0}, {x: 0, y: 25}, {x: -25, y: 0}];
      piece.fillPoints(points);
      piece.strokePoints(points, true);
    }
    
    container.add(piece);
    
    // Glow effect
    const glow = this.add.circle(0, 0, 30, pos.color, 0.2);
    container.add(glow);
    
    this.tweens.add({
      targets: glow,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.1,
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
    
    container.setSize(60, 60);
    container.setInteractive();
    
    container.targetIndex = index;
    container.originalX = randomX;
    container.originalY = randomY;
    
    this.input.setDraggable(container);
    this.puzzlePieces.push(container);
  }

  setupDragAndDrop() {
    // Limpiar listeners existentes para evitar duplicaciones
    this.input.off('dragstart');
    this.input.off('drag');
    this.input.off('dragend');
    
    this.input.on('dragstart', (pointer, gameObject) => {
      if (gameObject && gameObject.setScale) {
        gameObject.setScale(1.1);
        gameObject.setDepth(1000);
      }
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (gameObject && dragX !== undefined && dragY !== undefined) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    });

    this.input.on('dragend', (pointer, gameObject) => {
      if (gameObject && gameObject.setScale) {
        gameObject.setScale(1);
        gameObject.setDepth(0);
        this.checkEnhancedPiecePlacement(gameObject);
      }
    });
  }

  checkEnhancedPiecePlacement(piece) {
    // Validar que la pieza y los slots existen
    if (!piece || !this.targetSlots || piece.targetIndex === undefined) {
      return;
    }
    
    const targetSlot = this.targetSlots[piece.targetIndex];
    if (!targetSlot) {
      return;
    }
    
    // Optimización: verificar distancia aproximada primero
    const dx = Math.abs(piece.x - targetSlot.x);
    const dy = Math.abs(piece.y - targetSlot.y);
    
    // Si está muy lejos, no calcular distancia exacta
    if (dx > 40 || dy > 40) {
      // Regresar a posición original con animación
      if (piece.originalX !== undefined && piece.originalY !== undefined) {
        this.tweens.add({
          targets: piece,
          x: piece.originalX,
          y: piece.originalY,
          duration: 400,
          ease: 'Back.easeOut'
        });
      }
      return;
    }
    
    const distance = Phaser.Math.Distance.Between(piece.x, piece.y, targetSlot.x, targetSlot.y);
    
    if (distance < 40 && !targetSlot.filled) {
      // Pieza colocada correctamente
      piece.x = targetSlot.x;
      piece.y = targetSlot.y;
      targetSlot.filled = true;
      
      // Reproducir sonido de golpe al núcleo
      if (this.sounds.coreHit) {
        this.sounds.coreHit.play();
      }
      // Efecto de pulso energético del núcleo
      if (this.sounds.energyPulse) {
        this.time.delayedCall(100, () => {
          this.sounds.energyPulse.play();
        });
      }
      
      // Efecto de reparación mejorado
      this.createRepairEffect(targetSlot.x, targetSlot.y, targetSlot.color);
      
      this.score++;
      if (this.scoreText) {
        this.scoreText.setText(`Materiales reparados: ${this.score}/4`);
      }
      
      // Verificar si el puzzle está completo
      if (this.score >= 4) {
        this.puzzleComplete();
      }
    } else {
      // Regresar a posición original con animación
      if (piece.originalX !== undefined && piece.originalY !== undefined) {
        this.tweens.add({
          targets: piece,
          x: piece.originalX,
          y: piece.originalY,
          duration: 400,
          ease: 'Back.easeOut'
        });
      }
    }
  }

  createRepairEffect(x, y, color) {
    // Onda de reparación
    const repairWave = this.add.circle(x, y, 10, color, 0.6);
    
    this.tweens.add({
      targets: repairWave,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => repairWave.destroy()
    });

    // Partículas de energía
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const particle = this.add.circle(x, y, 4, color);
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * 60,
        y: y + Math.sin(angle) * 60,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 600,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }

    // Efecto de brillo
    const flash = this.add.circle(x, y, 35, 0xffffff, 0.8);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });
  }

  puzzleComplete() {
    // Sonido de completado
    this.sounds.complete.play();
    
    // Incrementar nivel
    this.currentLevel++;
    
    // Verificar si se completó toda la misión
    if (this.currentLevel > this.maxLevel) {
      this.gameCompleted = true;
      this.showMissionComplete();
    } else {
      this.showLevelComplete();
    }
  }

  showLevelComplete() {
    // Reproducir sonidos épicos de celebración
    if (this.sounds.epicVictory) {
      this.sounds.epicVictory.play();
    }
    
    // Sonido de power-up con delay
    this.time.delayedCall(500, () => {
      if (this.sounds.powerUp) {
        this.sounds.powerUp.play();
      }
    });
    
    // Overlay con efecto de resplandor
    const overlay = this.add.rectangle(400, 300, 700, 500, 0x001144, 0.95);
    overlay.setStrokeStyle(6, 0x00ffff);
    
    // Crear múltiples capas de brillo para el overlay
    const overlayGlow1 = this.add.rectangle(400, 300, 690, 490, 0x0088ff, 0.3);
    const overlayGlow2 = this.add.rectangle(400, 300, 680, 480, 0x00aaff, 0.2);
    
    // Animaciones de brillo del overlay
    this.tweens.add({
      targets: [overlayGlow1, overlayGlow2],
      alpha: { from: 0.3, to: 0.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Título principal épico
    const congratsText = this.add.text(400, 150, '🏆 ¡NIVEL DOMINADO! 🏆', {
      fontSize: '48px',
      fill: '#ffff00',
      fontFamily: 'Arial Black',
      stroke: '#ff6600',
      strokeThickness: 4,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000044',
        blur: 8,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Crear copias del título para efecto de resplandor
    const glowTitle1 = this.add.text(400, 150, '🏆 ¡NIVEL DOMINADO! 🏆', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial Black',
      alpha: 0.3
    }).setOrigin(0.5);
    
    const glowTitle2 = this.add.text(400, 150, '🏆 ¡NIVEL DOMINADO! 🏆', {
      fontSize: '48px',
      fill: '#00ffff',
      fontFamily: 'Arial Black',
      alpha: 0.2
    }).setOrigin(0.5);
    
    // Subtítulo con efectos
    const subtitleText = this.add.text(400, 210, '⚡ NANORROBOTS CONTENIDOS ⚡', {
      fontSize: '28px',
      fill: '#00ff88',
      fontFamily: 'Arial Bold',
      stroke: '#004400',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000022',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Mensaje de logro
    const achievementText = this.add.text(400, 260, '🔬 Los materiales inteligentes se han autoreparado 🔬', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold',
      stroke: '#000033',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Progreso de nivel con estilo épico
    const levelProgressText = this.add.text(400, 300, `🚀 Nivel ${this.currentLevel - 1} → Nivel ${this.currentLevel} 🚀`, {
      fontSize: '22px',
      fill: '#ffaa00',
      fontFamily: 'Arial Black',
      stroke: '#442200',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // ANIMACIONES ÉPICAS
    
    // Animación del título principal con rotación y escala
    this.tweens.add({
      targets: congratsText,
      scaleX: { from: 0.5, to: 1.3 },
      scaleY: { from: 0.5, to: 1.3 },
      rotation: { from: -0.1, to: 0.1 },
      duration: 1200,
      yoyo: true,
      repeat: 2,
      ease: 'Back.easeOut'
    });
    
    // Animaciones de resplandor para los títulos
    this.tweens.add({
      targets: glowTitle1,
      scaleX: { from: 1, to: 1.5 },
      scaleY: { from: 1, to: 1.5 },
      alpha: { from: 0.3, to: 0.1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.tweens.add({
      targets: glowTitle2,
      scaleX: { from: 1, to: 1.8 },
      scaleY: { from: 1, to: 1.8 },
      alpha: { from: 0.2, to: 0.05 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 500
    });
    
    // Animación del subtítulo con pulso
    this.tweens.add({
      targets: subtitleText,
      scaleX: { from: 1, to: 1.15 },
      scaleY: { from: 1, to: 1.15 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 300
    });
    
    // Animación del texto de logro
    this.tweens.add({
      targets: achievementText,
      alpha: { from: 0.7, to: 1 },
      y: { from: 270, to: 260 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 600
    });
    
    // EFECTOS DE PARTÍCULAS ESPECTACULARES
    
    // Crear fuegos artificiales
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 200, () => {
        this.createFireworks(
          Phaser.Math.Between(200, 600),
          Phaser.Math.Between(100, 200)
        );
      });
    }
    
    // Crear explosión de partículas doradas
    this.createGoldenParticleExplosion(400, 300);
    
    // Crear ondas de energía expansivas
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 300, () => {
        this.createEnergyWave(400, 300, i);
      });
    }
    
    // Crear estrellas brillantes cayendo
    for (let i = 0; i < 15; i++) {
      this.time.delayedCall(i * 150, () => {
        this.createFallingStar(
          Phaser.Math.Between(100, 700),
          Phaser.Math.Between(-50, 50)
        );
      });
    }
    
    // Continuar automáticamente al siguiente nivel después de 5 segundos
    this.time.delayedCall(5000, () => {
      this.resetForNextLevel();
    });
  }
  
  // MÉTODOS PARA EFECTOS ESPECTACULARES
  
  createFireworks(x, y) {
    // Crear explosión central
    const centerBurst = this.add.circle(x, y, 5, 0xffff00, 0.8);
    
    this.tweens.add({
      targets: centerBurst,
      scaleX: { from: 0.1, to: 3 },
      scaleY: { from: 0.1, to: 3 },
      alpha: { from: 0.8, to: 0 },
      duration: 800,
      ease: 'Quad.easeOut',
      onComplete: () => centerBurst.destroy()
    });
    
    // Crear partículas que se expanden
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180;
      const distance = Phaser.Math.Between(80, 120);
      const endX = x + Math.cos(angle) * distance;
      const endY = y + Math.sin(angle) * distance;
      
      const particle = this.add.circle(x, y, 3, Phaser.Math.RND.pick(colors), 0.9);
      
      this.tweens.add({
        targets: particle,
        x: endX,
        y: endY + 50, // Efecto de gravedad
        scaleX: { from: 1, to: 0.1 },
        scaleY: { from: 1, to: 0.1 },
        alpha: { from: 0.9, to: 0 },
        duration: 1200,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }
  
  createGoldenParticleExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(50, 150);
      const endX = x + Math.cos(angle) * distance;
      const endY = y + Math.sin(angle) * distance;
      
      const particle = this.add.circle(x, y, Phaser.Math.Between(2, 5), 0xffd700, 0.8);
      
      this.tweens.add({
        targets: particle,
        x: endX,
        y: endY,
        scaleX: { from: 1, to: 0.2 },
        scaleY: { from: 1, to: 0.2 },
        alpha: { from: 0.8, to: 0 },
        duration: Phaser.Math.Between(1000, 1800),
        ease: 'Quad.easeOut',
        delay: i * 20,
        onComplete: () => particle.destroy()
      });
    }
  }
  
  createEnergyWave(x, y, index) {
    const wave = this.add.circle(x, y, 10, 0x00ffff, 0.6 - (index * 0.1));
    wave.setStrokeStyle(3, 0x88ffff, 0.8 - (index * 0.15));
    
    this.tweens.add({
      targets: wave,
      scaleX: { from: 0.1, to: 4 + index },
      scaleY: { from: 0.1, to: 4 + index },
      alpha: { from: 0.6 - (index * 0.1), to: 0 },
      duration: 2000 + (index * 300),
      ease: 'Quad.easeOut',
      onComplete: () => wave.destroy()
    });
  }
  
  createFallingStar(x, y) {
    const star = this.add.polygon(x, y, [
      [0, -8], [2, -2], [8, -2], [3, 2], [5, 8], [0, 5], [-5, 8], [-3, 2], [-8, -2], [-2, -2]
    ], 0xffffff, 0.9);
    
    // Crear estela de la estrella
    const trail = this.add.circle(x, y, 2, 0xffffaa, 0.5);
    
    this.tweens.add({
      targets: star,
      x: x + Phaser.Math.Between(-50, 50),
      y: y + 400,
      rotation: Math.PI * 4,
      scaleX: { from: 1, to: 0.3 },
      scaleY: { from: 1, to: 0.3 },
      alpha: { from: 0.9, to: 0 },
      duration: 2500,
      ease: 'Quad.easeIn',
      onComplete: () => star.destroy()
    });
    
    this.tweens.add({
      targets: trail,
      x: x + Phaser.Math.Between(-30, 30),
      y: y + 380,
      scaleX: { from: 1, to: 2 },
      scaleY: { from: 1, to: 0.1 },
      alpha: { from: 0.5, to: 0 },
      duration: 2300,
      ease: 'Quad.easeIn',
      onComplete: () => trail.destroy()
    });
  }

  resetForNextLevel() {
    // Detener todos los timers activos
    if (this.nanobotTimer) {
      this.nanobotTimer.destroy();
      this.nanobotTimer = null;
    }
    
    // Detener todos los tweens activos
    this.tweens.killAll();
    
    // Destruir todos los nanobots individualmente para evitar memory leaks
    if (this.nanobots && this.nanobots.length > 0) {
      this.nanobots.forEach(nanobot => {
        if (nanobot && nanobot.destroy) {
          this.tweens.killTweensOf(nanobot);
          nanobot.destroy();
        }
      });
    }
    
    // Destruir todas las barreras individualmente
    if (this.barriers && this.barriers.length > 0) {
      this.barriers.forEach(barrier => {
        if (barrier && barrier.destroy) {
          this.tweens.killTweensOf(barrier);
          barrier.destroy();
        }
      });
    }
    
    // Limpiar eventos de input
    this.input.off('pointerdown');
    
    // Limpiar la escena completamente
    this.children.removeAll();
    
    // Resetear variables del juego (mantener score acumulado)
    // this.lives = 3; // ELIMINADO: Sistema de vidas
    this.nanobots = [];
    this.barriers = [];
    this.particles = [];
    this.lastDamageTime = 0;
    this.levelCompleting = false;
    
    // Resetear variables del sistema de barreras para el nuevo nivel
    this.maxBarriersPerLevel = this.getMaxBarriersForLevel(this.currentLevel);
    this.barriersUsed = 0;
    this.barriersRemaining = this.maxBarriersPerLevel;
    
    // Iniciar directamente el juego de contención del siguiente nivel
    // this.startContainmentGame(); // Comentado para evitar reinicio de escena
    
    // En su lugar, recrear solo los elementos necesarios
    this.createContainmentBackground();
    this.createEnhancedCore();
    this.createGameUI();
    
    // Configurar eventos de clic para colocar barreras
    this.input.on('pointerdown', (pointer) => {
      if (this.gameMode === 'containment' && pointer.y < 580 && pointer.y > 80) {
        this.placeBarrier(pointer.x, pointer.y);
      }
    });

    // Mostrar instrucciones iniciales
    this.showGameInstructions();
    
    // Iniciar spawn de nanobots con dificultad progresiva
    this.startNanobotSpawning();
  }

  showMissionComplete() {
    console.log('Ejecutando showMissionComplete');
    // Crear fondo espectacular con gradiente animado - más pequeño y con mayor depth
    const overlay = this.add.rectangle(400, 300, 600, 450, 0x001144, 0.98);
    overlay.setStrokeStyle(6, 0x00ffff);
    overlay.setDepth(1000); // Asegurar que esté por encima de todo
    
    // Crear partículas de celebración
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(75, 525),
        Phaser.Math.Between(2, 4),
        Phaser.Math.Between(0x00ff00, 0x00ffff),
        0.8
      );
      particle.setDepth(1001); // Por encima del overlay
      
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(100, 300),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 4000),
        ease: 'Power2'
      });
    }
    
    // Título principal con animación espectacular - más pequeño
    const mainTitle = this.add.text(400, 150, '¡MISIÓN COMPLETADA!', {
      fontSize: '36px',
      fill: '#00ffff',
      fontFamily: 'Arial Black',
      stroke: '#004466',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(1002);
    
    // Animación del título
    this.tweens.add({
      targets: mainTitle,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Crear naves nanorobóticas decorativas - más pequeñas
    for (let i = 0; i < 3; i++) {
      const shipX = 250 + (i * 100);
      const shipY = 200;
      
      // Cuerpo principal de la nave
      const shipBody = this.add.ellipse(shipX, shipY, 30, 15, 0x00aaff, 0.9);
      const shipCore = this.add.circle(shipX, shipY, 6, 0x00ffff);
      
      // Efectos de motor
      const engine1 = this.add.circle(shipX - 15, shipY - 6, 2, 0xff6600, 0.8);
      const engine2 = this.add.circle(shipX - 15, shipY + 6, 2, 0xff6600, 0.8);
      
      // Establecer depth para todas las naves
      [shipBody, shipCore, engine1, engine2].forEach(element => {
        element.setDepth(1003);
      });
      
      // Animación de las naves
      this.tweens.add({
        targets: [shipBody, shipCore, engine1, engine2],
        y: shipY + 20,
        duration: 2000 + (i * 500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Efecto de brillo en el núcleo
      this.tweens.add({
        targets: shipCore,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    }
    
    // Mensajes de felicitación
    const subtitle = this.add.text(400, 180, 'NanoTerra ha sido salvado', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5).setDepth(1004);
    
    this.add.text(400, 260, 'Los nanorrobots han sido contenidos exitosamente', {
      fontSize: '18px',
      fill: '#00ff88'
    }).setOrigin(0.5).setDepth(1004);
    
    this.add.text(400, 285, 'Los materiales inteligentes están reparados', {
      fontSize: '18px',
      fill: '#00ff88'
    }).setOrigin(0.5).setDepth(1004);
    
    // Puntuación con efecto especial
    const scoreText = this.add.text(400, 330, `PUNTUACIÓN FINAL: ${this.score} PUNTOS`, {
      fontSize: '22px',
      fill: '#ffaa00',
      fontFamily: 'Arial Bold',
      stroke: '#ff6600',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(1004);
    
    // Animación de la puntuación
    this.tweens.add({
      targets: scoreText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
    
    // Mensaje de logro
    const achievementText = this.add.text(400, 370, '¡ERES UN HÉROE DE NANOTERRA!', {
      fontSize: '20px',
      fill: '#ffff00',
      fontFamily: 'Arial Bold',
      stroke: '#ff8800',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(1004);
    
    // Efecto de parpadeo para el logro
    this.tweens.add({
      targets: achievementText,
      alpha: 0.5,
      duration: 600,
      yoyo: true,
      repeat: -1
    });
    
    // Botón para continuar a la siguiente escena
    const continueBtn = this.add.rectangle(400, 450, 280, 60, 0x006600, 0.9)
      .setStrokeStyle(3, 0x00ff00)
      .setDepth(1005)
      .setInteractive()
      .on('pointerdown', () => {
        console.log('Cambiando a escena DroneRepairScene');
        this.scene.start('SelfHealingMaterialScene');
      })
      .on('pointerover', () => {
        continueBtn.setFillStyle(0x008800);
        continueBtn.setScale(1.1);
      })
      .on('pointerout', () => {
        continueBtn.setFillStyle(0x006600);
        continueBtn.setScale(1.0);
      });
    
    const continueText = this.add.text(400, 450, 'HAZ CLICK PARA CONTINUAR', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold',
      stroke: '#004400',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(1005);
    
    // Animación del texto del botón
    this.tweens.add({
      targets: continueText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Animación de brillo del botón
    this.tweens.add({
      targets: continueBtn,
      alpha: 0.7,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Power2'
    });
    
    // ELIMINADO: Transición automática después de 5 segundos
    // this.time.delayedCall(5000, () => {
    //   console.log('Transición automática a DroneRepairScene');
    //   this.scene.start('DroneRepairScene');
    // });
  }

  createSpectacularCollisionEffect(x, y, barrier) {
    // Onda de choque principal
    const shockwave = this.add.graphics();
    shockwave.lineStyle(3, 0x00ffff, 1);
    shockwave.strokeCircle(x, y, 5);
    
    this.tweens.add({
      targets: shockwave,
      scaleX: 16,
      scaleY: 16,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => shockwave.destroy()
    });
    
    // Onda de choque secundaria
    this.time.delayedCall(100, () => {
      const shockwave2 = this.add.graphics();
      shockwave2.lineStyle(2, 0xff6600, 0.8);
      shockwave2.strokeCircle(x, y, 5);
      
      this.tweens.add({
        targets: shockwave2,
        scaleX: 12,
        scaleY: 12,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => shockwave2.destroy()
      });
    });
    
    // Explosión de partículas direccionales
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const particle = this.add.circle(x, y, 3, 0xffff00, 0.9);
      
      const targetX = x + Math.cos(angle) * 50;
      const targetY = y + Math.sin(angle) * 50;
      
      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 300,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
    
    // Chispas eléctricas
    for (let i = 0; i < 8; i++) {
      const spark = this.add.rectangle(x, y, 2, 8, 0x00ffff, 0.8);
      const sparkAngle = Math.random() * Math.PI * 2;
      spark.setRotation(sparkAngle);
      
      const sparkDistance = 20 + Math.random() * 30;
      const sparkX = x + Math.cos(sparkAngle) * sparkDistance;
      const sparkY = y + Math.sin(sparkAngle) * sparkDistance;
      
      this.tweens.add({
        targets: spark,
        x: sparkX,
        y: sparkY,
        alpha: 0,
        rotation: sparkAngle + Math.PI,
        duration: 200 + Math.random() * 200,
        ease: 'Power1',
        onComplete: () => spark.destroy()
      });
    }
    
    // Efecto de distorsión en la barrera
    if (barrier && barrier.energyField) {
      const originalScale = barrier.energyField.scaleX;
      
      this.tweens.add({
        targets: barrier.energyField,
        scaleX: originalScale * 1.3,
        scaleY: originalScale * 1.3,
        duration: 100,
        yoyo: true,
        ease: 'Power2'
      });
      
      // Cambio temporal de color
      const originalTint = barrier.energyField.tint;
      barrier.energyField.setTint(0xff6600);
      
      this.time.delayedCall(150, () => {
        if (barrier.energyField) {
          barrier.energyField.setTint(originalTint);
        }
      });
    }
    
    // Líneas de energía que conectan con la barrera
    if (barrier) {
      for (let i = 0; i < 4; i++) {
        const line = this.add.line(0, 0, x, y, barrier.x, barrier.y, 0x00ffff, 0.6);
        line.setLineWidth(2);
        
        this.tweens.add({
          targets: line,
          alpha: 0,
          duration: 250,
          delay: i * 50,
          onComplete: () => line.destroy()
        });
      }
    }
    
    // Flash de pantalla sutil
    const flash = this.add.rectangle(400, 300, 800, 600, 0xffffff, 0.1);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 100,
      onComplete: () => flash.destroy()
    });
  }
  
  createSpectacularPointsAnimation(x, y, points) {
    // Texto de puntos simple y elegante
    const pointsText = this.add.text(x, y, `+${points}`, {
      fontSize: '20px',
      fill: '#00ffff',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(1000);
    
    // Animación del texto más suave
    this.tweens.add({
      targets: pointsText,
      y: y - 40,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 1.2 },
      duration: 600,
      ease: 'Power1',
      onComplete: () => pointsText.destroy()
    });
    
    // Solo un círculo de energía simple
    const energyCircle = this.add.graphics();
    energyCircle.lineStyle(2, 0x00ffff, 0.6);
    energyCircle.strokeCircle(x, y, 15);
    energyCircle.setDepth(999);
    
    this.tweens.add({
      targets: energyCircle,
      scaleX: { from: 0.8, to: 1.8 },
      scaleY: { from: 0.8, to: 1.8 },
      alpha: { from: 0.6, to: 0 },
      duration: 500,
      ease: 'Power1',
      onComplete: () => energyCircle.destroy()
    });
    
    // Solo 4 partículas simples
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const particleX = x + Math.cos(angle) * 12;
      const particleY = y + Math.sin(angle) * 12;
      
      const particle = this.add.graphics();
      particle.fillStyle(0x00ffff, 0.7);
      particle.fillCircle(particleX, particleY, 2);
      particle.setDepth(998);
      
      this.tweens.add({
        targets: particle,
        x: particleX + Math.cos(angle) * 25,
        y: particleY + Math.sin(angle) * 25,
        alpha: { from: 0.7, to: 0 },
        duration: 500,
        ease: 'Power1',
        onComplete: () => particle.destroy()
      });
    }
    
    // Efecto sutil en el texto de puntuación
    if (this.scoreText) {
      this.tweens.add({
        targets: this.scoreText,
        scaleX: { from: 1, to: 1.05 },
        scaleY: { from: 1, to: 1.05 },
        duration: 150,
        yoyo: true,
        ease: 'Power1'
      });
    }
  }

  update() {
    // Verificar colisiones continuas en el juego de contención
    if (this.gameMode === 'containment') {
      // Verificar colisiones con el escudo si hay nanobots
      if (this.nanobots && this.nanobots.length > 0 && this.shield) {
        this.checkShieldCollisions();
      }
    }
  }
}