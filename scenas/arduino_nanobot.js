class ArduinoNanobotScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ArduinoNanobotScene' });
    this.selectedAnswer = null;
    this.codeBlocks = [];
    this.nanobots = [];
    this.regulatorBots = [];
    this.currentCompilationTween = null;
    this.compilationElements = [];
  }

  create() {
    this.createBackground();
    this.createArduinoIDE();
    this.createCodeWithError();
    this.createQuizOptions();
    this.createAdvancedAnimations();
  }

  createBackground() {
    // Fondo futurista tipo Arduino IDE mejorado
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a0a, 0x0a0a0a, 0x1a1a2e, 0x16213e, 1);
    bg.fillRect(0, 0, 1000, 500);

    // Líneas de grid futuristas más elegantes
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00ffff, 0.15);
    for (let i = 0; i < 1000; i += 50) {
      grid.moveTo(i, 0);
      grid.lineTo(i, 500);
    }
    for (let i = 0; i < 500; i += 50) {
      grid.moveTo(0, i);
      grid.lineTo(1000, i);
    }
    grid.strokePath();

    // Líneas de acento brillantes
    const accentLines = this.add.graphics();
    accentLines.lineStyle(2, 0x00ff88, 0.4);
    accentLines.moveTo(0, 100);
    accentLines.lineTo(1000, 100);
    accentLines.moveTo(0, 400);
    accentLines.lineTo(1000, 400);
    accentLines.strokePath();

    // Partículas de fondo
    this.createBackgroundParticles();
    
    // Efectos adicionales de ambiente
    this.createDigitalMatrix();
    this.createNetworkPulses();
  }

  createBackgroundParticles() {
    // Partículas flotantes con movimiento orbital
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(50, 950),
        Phaser.Math.Between(50, 450),
        Phaser.Math.Between(1, 3),
        Phaser.Math.RND.pick([0x00ffff, 0x0088ff, 0x88ddff]),
        Phaser.Math.FloatBetween(0.2, 0.6)
      );

      // Movimiento orbital complejo
      const centerX = particle.x;
      const centerY = particle.y;
      const radius = Phaser.Math.Between(20, 80);
      const speed = Phaser.Math.FloatBetween(0.5, 2);

      this.tweens.add({
        targets: particle,
        angle: 360,
        duration: Phaser.Math.Between(4000, 8000) / speed,
        repeat: -1,
        ease: 'Linear',
        onUpdate: (tween) => {
          const angle = tween.getValue();
          particle.x = centerX + Math.cos(Phaser.Math.DegToRad(angle)) * radius;
          particle.y = centerY + Math.sin(Phaser.Math.DegToRad(angle)) * radius;
        }
      });

      // Efecto de brillo pulsante
      this.tweens.add({
        targets: particle,
        alpha: { from: particle.alpha, to: particle.alpha * 0.3 },
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Partículas de datos flotantes
    for (let i = 0; i < 15; i++) {
      const dataParticle = this.add.text(
        Phaser.Math.Between(0, 1000),
        Phaser.Math.Between(0, 500),
        Phaser.Math.RND.pick(['01', '10', '11', '00', '101', '010']),
        {
          fontSize: '8px',
          fontFamily: 'Consolas, monospace',
          fill: '#00ff88',
          alpha: 0.3
        }
      );

      this.tweens.add({
        targets: dataParticle,
        y: dataParticle.y - 500,
        alpha: { from: 0.3, to: 0 },
        duration: Phaser.Math.Between(8000, 12000),
        repeat: -1,
        ease: 'Linear',
        onRepeat: () => {
          dataParticle.y = 550;
          dataParticle.x = Phaser.Math.Between(0, 1000);
          dataParticle.alpha = 0.3;
        }
      });
    }
  }

  createArduinoIDE() {
    // Título de la fase con efecto brillante
    const title = this.add.text(500, 25, 'CÓDIGO CON ERRORES DETECTADOS', {
      fontSize: '20px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff4444',
      fontWeight: 'bold',
      stroke: '#ff0000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Efecto de parpadeo en el título
    this.tweens.add({
      targets: title,
      alpha: { from: 1, to: 0.7 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Panel del IDE sin borde verde
    const idePanel = this.add.rectangle(500, 170, 400, 260, 0x1a1a1a, 0.95);
    idePanel.setStrokeStyle(2, 0x555555);

    // Efecto de brillo en el panel
    this.tweens.add({
      targets: idePanel,
      scaleX: { from: 1, to: 1.005 },
      scaleY: { from: 1, to: 1.005 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Barra de título del IDE mejorada
    const titleBar = this.add.rectangle(500, 60, 400, 30, 0x2a2a2a);
    titleBar.setStrokeStyle(1, 0x00ffff);
    
    this.add.text(500, 60, '🔧 Arduino IDE Futurista - NanoBot Controller v2.1', {
      fontSize: '12px',
      fontFamily: 'Consolas, monospace',
      fill: '#00ffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Números de línea
    const lineNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    lineNumbers.forEach((num, index) => {
      this.add.text(325, 85 + (index * 16), num, {
        fontSize: '10px',
        fontFamily: 'Consolas, monospace',
        fill: '#858585'
      });
    });
  }

  createCodeWithError() {
    const codeLines = [
      'int nanobotSensor = A0;',
      'int nanobotDestruir = 9;',
      'void setup() {',
      '  pinMode(nanobotDestruir, OUTPUT);',
      '  Serial.begin(9600);',
      '}',
      'void loop() {',
      '  int cantidad = analogRead(nanobotSensor);',
      '  if (cantidad > 500) {',
      '    digitalWrite(nanobotDestruir, HIGH);',
      '  }',
      '}'
    ];

    this.codeTexts = [];
    this.currentCursor = null; // Variable para controlar el cursor único

    codeLines.forEach((line, index) => {
      const codeText = this.add.text(350, 85 + (index * 16), '', {
        fontSize: '10px',
        fontFamily: 'Consolas, monospace',
        fill: index === 3 || index === 6 || index === 8 ? '#ff6b6b' : '#d4d4d4',
        backgroundColor: index === 3 || index === 6 || index === 8 ? '#3c1e1e' : 'transparent',
        padding: { x: 2, y: 1 }
      });

      this.codeTexts.push(codeText);

      // Efecto de typing mejorado con un solo cursor
      const originalText = line;
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex < originalText.length) {
          codeText.setText(originalText.substring(0, charIndex + 1));

          // Destruir cursor anterior si existe
          if (this.currentCursor) {
            this.currentCursor.destroy();
          }

          // Crear nuevo cursor único
          this.currentCursor = this.add.text(
            codeText.x + codeText.width,
            codeText.y,
            '|',
            {
              fontSize: '10px',
              fontFamily: 'Consolas, monospace',
              fill: '#ffffff',
              alpha: 1
            }
          );

          // Animación del cursor más suave
          this.tweens.add({
            targets: this.currentCursor,
            alpha: { from: 1, to: 0.2 },
            scaleY: { from: 1, to: 0.8 },
            duration: 400,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut'
          });

          charIndex++;

          // Velocidad variable de escritura más rápida
          const nextDelay = originalText[charIndex - 1] === ' ' ?
            Phaser.Math.Between(20, 40) :
            Phaser.Math.Between(10, 25);

          this.time.delayedCall(nextDelay, typeChar);
        } else {
          // Al terminar la línea, destruir el cursor después de un momento
          if (this.currentCursor) {
            this.time.delayedCall(200, () => {
              if (this.currentCursor) {
                this.currentCursor.destroy();
                this.currentCursor = null;
              }
            });
          }
        }
      };

      // Retraso escalonado más natural entre líneas
      this.time.delayedCall(index * 400 + Phaser.Math.Between(0, 200), typeChar);
    });

    // Indicador de error con animación
    const errorIndicator = this.add.text(500, 85, '', {
      fontSize: '12px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff6b6b',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Efecto de parpadeo de alerta
    this.tweens.add({
      targets: errorIndicator,
      alpha: { from: 1, to: 0.3 },
      scaleX: { from: 1, to: 1.1 },
      scaleY: { from: 1, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Partículas de error alrededor del indicador
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 200, () => {
        const errorParticle = this.add.circle(
          500 + Phaser.Math.Between(-100, 100),
          85 + Phaser.Math.Between(-20, 20),
          3,
          0xff4444,
          0.6
        );

        this.tweens.add({
          targets: errorParticle,
          y: errorParticle.y - 30,
          alpha: 0,
          duration: 1500,
          ease: 'Power2.easeOut',
          onComplete: () => errorParticle.destroy()
        });
      });
    }
  }

  createQuizOptions() {
    const question = '📢 ¿Cuál es el error principal en este código?';

    // Pregunta con mejor diseño
    const questionText = this.add.text(500, 300, question, {
      fontSize: '16px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ffaa00',
      fontWeight: 'bold',
      wordWrap: { width: 700 },
      stroke: '#ff8800',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Efecto de brillo en la pregunta
    this.tweens.add({
      targets: questionText,
      alpha: { from: 1, to: 0.8 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const options = [
      { 
        text: '(A) Falta definir el nanobotSensor como entrada.', 
        correct: false,
        feedback: 'Incorrecto. El sensor ya está definido correctamente como INPUT en el setup().'
      },
      { 
        text: '(B) No hay un sistema de control para evitar eliminar más nanorobots de los necesarios.', 
        correct: true,
        feedback: '¡Correcto! El código no tiene un mecanismo para apagar el sistema después de eliminar nanobots, lo que podría causar una eliminación excesiva y descontrolada. Necesita un delay y apagar el sistema después de actuar.'
      },
      { 
        text: '(C) El analogRead() debe ser digitalRead().', 
        correct: false,
        feedback: 'Incorrecto. analogRead() es correcto para leer valores analógicos del sensor.'
      },
      { 
        text: '(D) El código no permite que los nanorobots operen en ciclos autónomos.', 
        correct: false,
        feedback: 'Incorrecto. El loop() permite operación continua, este no es el problema principal.'
      }
    ];

    options.forEach((option, index) => {
      // Botones con diseño mejorado
      const optionButton = this.add.rectangle(500, 340 + (index * 35), 720, 30, 0x1a1a2e, 0.9);
      optionButton.setStrokeStyle(2, 0x00ffff, 0.7);
      optionButton.setInteractive();

      // Efecto hover mejorado
      optionButton.on('pointerover', () => {
        optionButton.setFillStyle(0x2a2a4e);
        optionButton.setStrokeStyle(3, 0x00ff88);
        this.tweens.add({
          targets: optionButton,
          scaleX: 1.02,
          scaleY: 1.1,
          duration: 200,
          ease: 'Back.easeOut'
        });
      });

      optionButton.on('pointerout', () => {
        optionButton.setFillStyle(0x1a1a2e);
        optionButton.setStrokeStyle(2, 0x00ffff, 0.7);
        this.tweens.add({
          targets: optionButton,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Back.easeOut'
        });
      });

      // Texto de la opción con mejor posicionamiento
      const optionText = this.add.text(500, 340 + (index * 35), option.text, {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        fontWeight: 'bold',
        wordWrap: { width: 700 }
      }).setOrigin(0.5);

      // Eliminar los eventos hover duplicados (ya están arriba)
      optionButton.on('pointerdown', () => {
        this.selectAnswer(index, option.correct, optionButton, optionText, option.feedback);
      });
    });
  }

  selectAnswer(index, isCorrect, button, text, feedback) {
    if (this.selectedAnswer !== null) return;

    this.selectedAnswer = index;

    // Efecto de compilación antes de mostrar resultado
    this.showCompilationEffect(() => {
      // Resetear otros botones
      this.children.list.forEach(child => {
        if (child.type === 'Rectangle' && child !== button && child.y > 400) {
          child.setFillStyle(0x333333);
          child.setStrokeStyle(2, 0x555555);
        }
      });

      // Mostrar retroalimentación solo para respuestas incorrectas
      if (!isCorrect) {
        this.showFeedback(feedback, isCorrect);
      }

      // Cambiar color del botón seleccionado con transición suave
      if (isCorrect) {
        this.tweens.add({
          targets: button,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          yoyo: true,
          onComplete: () => {
            button.setFillStyle(0x2d5a2d);
             button.setStrokeStyle(2, 0x00ff00);
             text.setFill('#00ff00');

             // Efecto de partículas de éxito
             this.createSuccessParticles(button.x, button.y);

            // Mostrar mensaje de felicitación después de un delay
            this.time.delayedCall(2000, () => {
              this.showSuccessMessage();
            });

             // Esperar a que el usuario haga click para continuar
             // this.time.delayedCall(3000, () => {
             //   this.showCorrectSolution();
             // });
          }
        });
      } else {
        this.tweens.add({
          targets: button,
          scaleX: 0.9,
          scaleY: 0.9,
          duration: 100,
          yoyo: true,
          repeat: 2,
          onComplete: () => {
            button.setFillStyle(0x5a2d2d);
             button.setStrokeStyle(2, 0xff0000);
             text.setFill('#ff0000');

             // Efecto de partículas de error
             this.createErrorParticles(button.x, button.y);

            // Mostrar mensaje de error y permitir reintento después de un delay
            this.time.delayedCall(2000, () => {
              // Solo permitir reintento, sin mostrar mensaje adicional
              this.time.delayedCall(2000, () => {
                this.resetQuizForRetry();
              });
            });
          }
        });
      }
    });
  }

  showFeedback(feedback, isCorrect) {
    // Crear panel de retroalimentación
    const feedbackPanel = this.add.rectangle(this.cameras.main.centerX, 200, 700, 80, isCorrect ? 0x1a4a1a : 0x4a1a1a, 0.95);
    feedbackPanel.setStrokeStyle(2, isCorrect ? 0x00ff00 : 0xff0000);

    const feedbackText = this.add.text(this.cameras.main.centerX, 200, feedback, {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      fill: isCorrect ? '#00ff88' : '#ff8888',
      align: 'center',
      wordWrap: { width: 650 }
    }).setOrigin(0.5);

    // Animación de entrada
    [feedbackPanel, feedbackText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 500,
        delay: index * 100,
        ease: 'Back.easeOut'
      });
    });

    // Guardar referencias para limpiar después
    this.feedbackElements = [feedbackPanel, feedbackText];

    // Auto-limpiar después de 3 segundos
    this.time.delayedCall(3000, () => {
      if (this.feedbackElements) {
        this.feedbackElements.forEach(element => {
          this.tweens.add({
            targets: element,
            alpha: 0,
            duration: 500,
            onComplete: () => element.destroy()
          });
        });
        this.feedbackElements = null;
      }
    });
  }

  showCompilationEffect(callback) {
    // Detener animación anterior si existe
    if (this.currentCompilationTween) {
      this.currentCompilationTween.stop();
      this.currentCompilationTween = null;
    }

    // Limpiar elementos anteriores si existen
    if (this.compilationElements) {
      this.compilationElements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
      this.compilationElements = [];
    }

    // Crear overlay de compilación centrado
    const compileOverlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 1000, 500, 0x000000, 0.7);

    const compileText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 30, 'COMPILANDO...', {
      fontSize: '24px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff00',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Barra de progreso centrada
    const progressBg = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY + 20, 300, 20, 0x333333);
    const progressBar = this.add.rectangle(this.cameras.main.centerX - 148, this.cameras.main.centerY + 20, 0, 16, 0x00ff00);
    progressBar.setOrigin(0, 0.5); // Establecer origen en el borde izquierdo

    // Guardar referencias para limpieza
    this.compilationElements = [compileOverlay, compileText, progressBg, progressBar];

    // Animación de la barra de progreso con control mejorado
    this.currentCompilationTween = this.tweens.add({
      targets: progressBar,
      width: 296, // Mantener dentro del contenedor (300px - 4px de margen)
      duration: 1500, // Reducido de 2000 a 1500ms
      ease: 'Power2.easeInOut',
      onComplete: () => {
        // Verificar que los elementos aún existen antes del desvanecimiento
        if (compileOverlay && compileOverlay.active) {
          // Efecto de desvanecimiento
          this.tweens.add({
            targets: [compileOverlay, compileText, progressBg, progressBar],
            alpha: 0,
            duration: 300, // Reducido de 500 a 300ms
            onComplete: () => {
              // Limpiar elementos de forma segura
              [compileOverlay, compileText, progressBg, progressBar].forEach(element => {
                if (element && element.destroy) {
                  element.destroy();
                }
              });
              this.compilationElements = [];
              this.currentCompilationTween = null;
              callback();
            }
          });
        } else {
          // Si los elementos ya fueron destruidos, ejecutar callback directamente
          this.currentCompilationTween = null;
          callback();
        }
      }
    });

    // Partículas de compilación
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const particle = this.add.circle(
          Phaser.Math.Between(100, 700),
          Phaser.Math.Between(200, 400),
          2,
          0x00ff88,
          0.8
        );

        this.tweens.add({
          targets: particle,
          y: particle.y - 50,
          alpha: 0,
          duration: 1000,
          ease: 'Power2.easeOut',
          onComplete: () => particle.destroy()
        });
      });
    }
  }

  createSuccessParticles(x, y) {
    for (let i = 0; i < 12; i++) {
      const particle = this.add.circle(
        x,
        y,
        Phaser.Math.Between(3, 6),
        Phaser.Math.RND.pick([0x00ff00, 0x88ff88, 0xaaffaa]),
        0.8
      );

      const angle = (i / 12) * Math.PI * 2;
      const distance = Phaser.Math.Between(50, 100);

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 1000,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  createErrorParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(
        x,
        y,
        Phaser.Math.Between(2, 5),
        0xff4444,
        0.8
      );

      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-60, 60),
        alpha: 0,
        rotation: Math.PI * 2,
        duration: 800,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  showSuccessMessage() {
    // Crear panel de éxito centrado más grande para incluir retroalimentación
    const successPanel = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 750, 350, 0x004400, 0.95);
    successPanel.setStrokeStyle(4, 0x00ff00, 1);

    const successTitle = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 120, '🎉 ¡EXCELENTE TRABAJO! 🎉', {
      fontSize: '28px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff00',
      fontWeight: 'bold',
      stroke: '#003300',
      strokeThickness: 2
    }).setOrigin(0.5);

    const successMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 70, 'Has identificado correctamente el problema en el código.\nLos nanobots reguladores funcionarán de manera segura.', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 700 },
      lineSpacing: 5
    }).setOrigin(0.5);

    // Agregar la retroalimentación de la respuesta correcta con mejor estilo
    const explanationTitle = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, '', {
      fontSize: '16px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#88ff88',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const feedbackMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, 'El código necesita un sistema de control de tiempo y apagado automático.\nSin esto, los nanobots podrían seguir funcionando indefinidamente,\ncausando sobrepoblación y daños críticos al sistema biológico.', {
      fontSize: '15px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ccffcc',
      align: 'center',
      wordWrap: { width: 680 },
      backgroundColor: '#002200',
      padding: { x: 20, y: 15 },
      lineSpacing: 3
    }).setOrigin(0.5);

    // Agregar un icono de advertencia
    const warningIcon = this.add.text(this.cameras.main.centerX - 320, this.cameras.main.centerY + 20, '⚠️', {
      fontSize: '24px'
    }).setOrigin(0.5);

    const continueText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 120, '🖱️ Haz click en cualquier lado para continuar...', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#aaffaa',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Hacer toda la pantalla clickeable para pasar a la siguiente escena
    this.input.on('pointerdown', () => {
      // Limpiar elementos del mensaje de éxito
      if (this.successElements) {
        this.successElements.forEach(element => {
          if (element && element.destroy) {
            element.destroy();
          }
        });
        this.successElements = null;
      }
      
      // Transición a la siguiente escena
      this.scene.start('Rompecabezas');
    }, this);

    // Animación de entrada mejorada
    [successPanel, successTitle, successMessage, explanationTitle, feedbackMessage, warningIcon, continueText].forEach((element, index) => {
      element.setAlpha(0);
      element.setScale(0.8);
      this.tweens.add({
        targets: element,
        alpha: 1,
        scale: 1,
        y: element.y - 5,
        duration: 600,
        delay: index * 120,
        ease: 'Back.easeOut'
      });
    });

    // Efecto de brillo en el título
    this.tweens.add({
      targets: successTitle,
      scaleX: { from: 1, to: 1.05 },
      scaleY: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Guardar referencias para limpiar después
    this.successElements = [successPanel, successTitle, successMessage, explanationTitle, feedbackMessage, warningIcon, continueText];
  }

  showErrorMessage() {
    // Crear panel de error centrado
    const errorPanel = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 600, 200, 0x440000, 0.95);
    errorPanel.setStrokeStyle(3, 0xff0000, 1);

    const errorTitle = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, '❌ RESPUESTA INCORRECTA', {
      fontSize: '22px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff0000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const errorMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Esa no es la respuesta correcta.\nRevisa el código cuidadosamente y vuelve a intentarlo.', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 550 }
    }).setOrigin(0.5);

    const retryText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Preparando nuevo intento...', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      fill: '#cccccc',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Animación de entrada
    [errorPanel, errorTitle, errorMessage, retryText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 500,
        delay: index * 100,
        ease: 'Back.easeOut'
      });
    });

    // Guardar referencias para limpiar después
    this.errorElements = [errorPanel, errorTitle, errorMessage, retryText];
  }

  resetQuizForRetry() {
    // Limpiar elementos de error
    if (this.errorElements) {
      this.errorElements.forEach(element => {
        this.tweens.add({
          targets: element,
          alpha: 0,
          duration: 300,
          onComplete: () => element.destroy()
        });
      });
      this.errorElements = null;
    }

    // Resetear estado del quiz
    this.selectedAnswer = null;

    // Restaurar todos los botones a su estado original
    this.children.list.forEach(child => {
      if (child.type === 'Rectangle' && child.y > 400 && child.y < 600) {
        child.setFillStyle(0x333333, 0.8);
        child.setStrokeStyle(2, 0x555555);
        child.setInteractive();
      }
    });

    // Restaurar colores de texto
    this.children.list.forEach(child => {
      if (child.type === 'Text' && child.y > 400 && child.y < 600) {
        child.setFill('#ffffff');
      }
    });
  }

  showCorrectSolution() {
    // Limpiar elementos de éxito si existen
    if (this.successElements) {
      this.successElements.forEach(element => {
        this.tweens.add({
          targets: element,
          alpha: 0,
          duration: 500,
          onComplete: () => element.destroy()
        });
      });
      this.successElements = null;
    }

    // Transición suave para limpiar pantalla
    const fadeOverlay = this.add.rectangle(500, 250, 1000, 500, 0x000000, 0);

    this.tweens.add({
      targets: fadeOverlay,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.children.removeAll();
        this.createBackground();

        // Desvanecer el overlay
        this.tweens.add({
          targets: fadeOverlay,
          alpha: 0,
          duration: 500,
          onComplete: () => fadeOverlay.destroy()
        });
      }
    });

    // Mostrar código corregido
    this.add.text(400, 50, '✅ CÓDIGO CORREGIDO - NANOBOTS REGULADORES ACTIVADOS', {
      fontSize: '18px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff00',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const correctedCode = [
      'int nanobotSensor = A0;',
      'int nanobotDestruir = 9;',
      'void setup() {',
      '  pinMode(nanobotSensor, INPUT);     // ✅ Sensor definido',
      '  pinMode(nanobotDestruir, OUTPUT);',
      '}',
      'void loop() {',
      '  int cantidad = analogRead(nanobotSensor);',
      '  if (cantidad > 500) {',
      '    digitalWrite(nanobotDestruir, HIGH);',
      '    delay(2000);                     // ✅ Control de tiempo',
      '    digitalWrite(nanobotDestruir, LOW); // ✅ Apagar después',
      '  }',
      '}'
    ];

    correctedCode.forEach((line, index) => {
      const color = line.includes('✅') ? '#00ff00' : '#d4d4d4';
      const codeText = this.add.text(50, 100 + (index * 18), line, {
        fontSize: '11px',
        fontFamily: 'Consolas, monospace',
        fill: color,
        backgroundColor: line.includes('✅') ? '#1e3c1e' : 'transparent',
        padding: { x: 2, y: 1 }
      });

      codeText.setAlpha(0);
      this.tweens.add({
        targets: codeText,
        alpha: 1,
        duration: 100,
        delay: index * 150
      });
    });

    // Crear nanobots reguladores
    this.createRegulatorBots();

    // Botón para continuar
    this.time.delayedCall(3000, () => {
      const continueBtn = this.add.rectangle(400, 550, 200, 40, 0x007acc, 0.8);
      continueBtn.setStrokeStyle(2, 0x00ffff);
      continueBtn.setInteractive();

      this.add.text(400, 550, 'CONTINUAR', {
        fontSize: '16px',
        fontFamily: 'Rajdhani, sans-serif',
        fill: '#ffffff',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      continueBtn.on('pointerdown', () => {
        this.scene.start('Rompecabezas');
      });
    });
  }

  createRegulatorBots() {
    // Crear nanobots reguladores con movimiento inteligente
    const formations = [
      { x: 500, y: 300, pattern: 'circle' },
      { x: 600, y: 350, pattern: 'diamond' },
      { x: 550, y: 400, pattern: 'line' }
    ];

    formations.forEach((formation, formIndex) => {
      for (let i = 0; i < 6; i++) {
        let startX, startY;

        // Posiciones según el patrón
        switch (formation.pattern) {
          case 'circle':
            const angle = (i / 6) * Math.PI * 2;
            startX = formation.x + Math.cos(angle) * 40;
            startY = formation.y + Math.sin(angle) * 40;
            break;
          case 'diamond':
            const positions = [
              {x: 0, y: -30}, {x: 20, y: -15}, {x: 20, y: 15},
              {x: 0, y: 30}, {x: -20, y: 15}, {x: -20, y: -15}
            ];
            startX = formation.x + positions[i].x;
            startY = formation.y + positions[i].y;
            break;
          case 'line':
            startX = formation.x + (i - 2.5) * 25;
            startY = formation.y;
            break;
        }

        // Crear nanobot con núcleo y halo
        const core = this.add.circle(startX, startY, 6, 0x0066ff, 0.9);
        const halo = this.add.circle(startX, startY, 12, 0x88ddff, 0.3);

        // Agrupar núcleo y halo
        const regulator = this.add.container(startX, startY, [halo, core]);
        this.regulatorBots.push(regulator);

        // Movimiento de patrullaje inteligente
        const patrolPoints = [
          { x: startX, y: startY },
          { x: startX + Phaser.Math.Between(-50, 50), y: startY + Phaser.Math.Between(-30, 30) },
          { x: startX + Phaser.Math.Between(-30, 30), y: startY + Phaser.Math.Between(-50, 50) },
          { x: startX, y: startY }
        ];

        let currentPoint = 0;
        const moveToNextPoint = () => {
          const nextPoint = patrolPoints[currentPoint % patrolPoints.length];

          this.tweens.add({
            targets: regulator,
            x: nextPoint.x,
            y: nextPoint.y,
            duration: Phaser.Math.Between(2000, 3500),
            ease: 'Power2.easeInOut',
            onComplete: () => {
              currentPoint++;
              this.time.delayedCall(Phaser.Math.Between(500, 1500), moveToNextPoint);
            }
          });
        };

        this.time.delayedCall(i * 300, moveToNextPoint);

        // Efecto de pulso dinámico del núcleo
        this.tweens.add({
          targets: core,
          scaleX: { from: 1, to: 1.4 },
          scaleY: { from: 1, to: 1.4 },
          alpha: { from: 0.9, to: 0.6 },
          duration: 800 + (i * 100),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Rotación del halo
        this.tweens.add({
          targets: halo,
          rotation: Math.PI * 2,
          scaleX: { from: 1, to: 1.2 },
          scaleY: { from: 1, to: 1.2 },
          duration: 3000 + (i * 200),
          repeat: -1,
          ease: 'Linear'
        });

        // Emisión de partículas reguladoras mejoradas
        this.time.addEvent({
          delay: 1000 + (i * 150),
          callback: () => {
            // Crear múltiples partículas en ráfaga
            for (let p = 0; p < 3; p++) {
              const particle = this.add.circle(
                regulator.x,
                regulator.y,
                Phaser.Math.Between(2, 4),
                Phaser.Math.RND.pick([0x88ddff, 0x00aaff, 0xaaeeff]),
                0.8
              );

              // Movimiento en espiral
              const spiralRadius = Phaser.Math.Between(30, 60);
              const spiralSpeed = Phaser.Math.FloatBetween(1, 2);

              this.tweens.add({
                targets: particle,
                angle: 360 * spiralSpeed,
                duration: 2000,
                ease: 'Power2.easeOut',
                onUpdate: (tween) => {
                  const angle = tween.getValue();
                  const currentRadius = spiralRadius * (1 - tween.progress);
                  particle.x = regulator.x + Math.cos(Phaser.Math.DegToRad(angle)) * currentRadius;
                  particle.y = regulator.y + Math.sin(Phaser.Math.DegToRad(angle)) * currentRadius;
                  particle.alpha = 0.8 * (1 - tween.progress);
                },
                onComplete: () => particle.destroy()
              });
            }
          },
          repeat: -1
        });

        // Efecto de campo de energía
        const energyField = this.add.circle(startX, startY, 20, 0x0088ff, 0.1);
        this.tweens.add({
          targets: energyField,
          scaleX: { from: 1, to: 2 },
          scaleY: { from: 1, to: 2 },
          alpha: { from: 0.1, to: 0 },
          duration: 2000,
          repeat: -1,
          ease: 'Power2.easeOut'
        });
      }
    });
  }

  showOverpopulation() {
    // Transición dramática con efecto de glitch
    const glitchOverlay = this.add.rectangle(500, 250, 1000, 500, 0xff0000, 0);

    // Efecto de glitch
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 100, () => {
        this.tweens.add({
          targets: glitchOverlay,
          alpha: 0.8,
          duration: 50,
          yoyo: true,
          onComplete: () => {
            if (i === 4) {
              this.children.removeAll();
              this.createBackground();
            }
          }
        });
      });
    }

    this.add.text(400, 100, '❌ ERROR: SOBREPOBLACIÓN DESCONTROLADA', {
      fontSize: '20px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff0000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Crear muchos nanobots descontrolados con comportamiento caótico
    for (let i = 0; i < 60; i++) {
      const size = Phaser.Math.Between(3, 10);
      const chaosBot = this.add.circle(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(150, 550),
        size,
        Phaser.Math.RND.pick([0xff4444, 0xff6666, 0xff2222, 0xcc0000]),
        0.8
      );

      // Movimiento errático con cambios de dirección
      const createChaoticMovement = () => {
        this.tweens.add({
          targets: chaosBot,
          x: Phaser.Math.Between(0, 1000),
      y: Phaser.Math.Between(0, 500),
          scaleX: Phaser.Math.FloatBetween(0.5, 2),
          scaleY: Phaser.Math.FloatBetween(0.5, 2),
          rotation: Phaser.Math.Between(-Math.PI * 4, Math.PI * 4),
          duration: Phaser.Math.Between(500, 2000),
          ease: Phaser.Math.RND.pick(['Power2.easeInOut', 'Bounce.easeOut', 'Back.easeInOut']),
          onComplete: createChaoticMovement
        });
      };

      this.time.delayedCall(i * 50, createChaoticMovement);

      // Efecto de vibración
      this.tweens.add({
        targets: chaosBot,
        alpha: { from: 0.8, to: 0.3 },
        duration: Phaser.Math.Between(100, 300),
        yoyo: true,
        repeat: -1
      });

      // Emisión de partículas de error
      if (i % 5 === 0) {
        this.time.addEvent({
          delay: Phaser.Math.Between(200, 800),
          callback: () => {
            const errorParticle = this.add.circle(
              chaosBot.x,
              chaosBot.y,
              2,
              0xff8888,
              0.6
            );

            this.tweens.add({
              targets: errorParticle,
              x: errorParticle.x + Phaser.Math.Between(-40, 40),
              y: errorParticle.y + Phaser.Math.Between(-40, 40),
              alpha: 0,
              duration: 1000,
              ease: 'Power2.easeOut',
              onComplete: () => errorParticle.destroy()
            });
          },
          repeat: 20
        });
      }
    }

    // Botón para reintentar
    this.time.delayedCall(2000, () => {
      const retryBtn = this.add.rectangle(400, 550, 200, 40, 0x666666, 0.8);
      retryBtn.setStrokeStyle(2, 0xffffff);
      retryBtn.setInteractive();

      this.add.text(400, 550, 'REINTENTAR', {
        fontSize: '16px',
        fontFamily: 'Rajdhani, sans-serif',
        fill: '#ffffff',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      retryBtn.on('pointerdown', () => {
        this.scene.restart();
      });
    });
  }

  createAdvancedAnimations() {
    // Crear efectos de matriz digital (reducido)
    this.createDigitalMatrix();

    // Crear pulsos de conexión de red (reducido)
    this.createNetworkPulses();
  }



  createDigitalMatrix() {
    // Efecto de matriz digital sutil solo en el lado derecho
    for (let i = 0; i < 6; i++) {
      const column = this.add.container(750 + (i * 35), 0);

      for (let j = 0; j < 8; j++) {
        const char = this.add.text(0, j * 30,
          Phaser.Math.RND.pick(['0', '1']),
          {
            fontSize: '8px',
            fontFamily: 'Consolas, monospace',
            fill: '#002200',
            alpha: 0.1
          }
        );

        column.add(char);

        // Cambiar caracteres menos frecuentemente
        this.time.addEvent({
          delay: Phaser.Math.Between(3000, 8000),
          callback: () => {
            char.setText(Phaser.Math.RND.pick(['0', '1']));
          },
          repeat: -1
        });
      }
    }
  }

  createNetworkPulses() {
    // Pulsos de red sutiles solo en áreas que no interfieren con el código
    const networkNodes = [
      { x: 750, y: 100 },
      { x: 800, y: 200 },
      { x: 700, y: 300 }
    ];

    // Crear nodos de red pequeños
    networkNodes.forEach(node => {
      const nodeCircle = this.add.circle(node.x, node.y, 2, 0x0088ff, 0.4);

      // Pulso del nodo muy sutil
      this.tweens.add({
        targets: nodeCircle,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0.1,
        duration: 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    // Crear conexiones muy ocasionales
    this.time.addEvent({
      delay: 8000,
      callback: () => {
        const node1 = Phaser.Math.RND.pick(networkNodes);
        const node2 = Phaser.Math.RND.pick(networkNodes.filter(n => n !== node1));

        const line = this.add.graphics();
        line.lineStyle(1, 0x0088ff, 0.2);
        line.moveTo(node1.x, node1.y);
        line.lineTo(node2.x, node2.y);
        line.strokePath();

        // Desvanecer la línea lentamente
        this.tweens.add({
          targets: line,
          alpha: 0,
          duration: 3000,
          onComplete: () => line.destroy()
        });
      },
      repeat: -1
    });
  }

  // Método de limpieza para evitar elementos colgantes
  shutdown() {
    // Detener animación de compilación si está activa
    if (this.currentCompilationTween) {
      this.currentCompilationTween.stop();
      this.currentCompilationTween = null;
    }

    // Limpiar elementos de compilación
    if (this.compilationElements && this.compilationElements.length > 0) {
      this.compilationElements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
      this.compilationElements = [];
    }

    // Detener todos los tweens activos
    this.tweens.killAll();

    // Limpiar timers activos
    if (this.time && this.time.removeAllEvents) {
      this.time.removeAllEvents();
    }
  }
}

window.ArduinoNanobotScene = ArduinoNanobotScene;