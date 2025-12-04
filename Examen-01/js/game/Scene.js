// Configuración y gestión de la escena principal
class GameScene {
  constructor(engine, gameManager) {
    this.engine = engine;
    this.gameManager = gameManager;
    this.scene = null;
    this.player = null;
    this.gameObjects = null;
    this.inputManager = null;
    this.paqueteEnMano = null;
  }

  async crear() {
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.collisionsEnabled = true;
    this.scene.clearColor = new BABYLON.Color3(0.5, 0.8, 1.0);

    this.configurarCamaraYLuz();

    // Inicializar gestores
    this.inputManager = new InputManager(this.scene);
    this.player = new Player(this.scene);
    this.gameObjects = new GameObjects(this.scene);

    // Cargar todos los recursos
    await this.gameObjects.inicializar();
    await this.player.inicializar();

    this.configurarLogicaRecoger();
    this.configurarGameLoop();

    return this.scene;
  }

  configurarCamaraYLuz() {
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(this.engine.getRenderingCanvas(), true);

    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;
  }

  configurarLogicaRecoger() {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
        if (kbInfo.event.key === " ") {
          // Solo permitir acciones si el juego está activo
          if (!this.gameManager.juegoActivo) return;

          const zonaEntrega = this.gameObjects.getZonaEntrega();
          const posJugador = this.player.getPosition();

          // Lógica para RECOGER
          if (!this.paqueteEnMano) {
            const paqueteCercano = this.gameObjects.getPaqueteCercano(posJugador);

            if (paqueteCercano) {
              console.log(`¡Paquete ${paqueteCercano.name} recogido!`);
              paqueteCercano.parent = this.player.contenedor;
              paqueteCercano.position = new BABYLON.Vector3(0, 1.2, 0.4);
              paqueteCercano.metadata.enMano = true;
              this.paqueteEnMano = paqueteCercano;
              this.player.actualizarModelo(true);
            }
          }
          // Lógica para DEJAR
          else {
            let dist = BABYLON.Vector3.Distance(posJugador, zonaEntrega.position);
            if (dist < 2) {
              console.log(`¡Paquete ${this.paqueteEnMano.name} entregado!`);

              // Marcar como entregado y ocultar
              this.paqueteEnMano.parent = null;
              this.paqueteEnMano.metadata.enMano = false;
              this.paqueteEnMano.metadata.entregado = true;
              this.paqueteEnMano.setEnabled(false);

              this.paqueteEnMano = null;
              this.player.actualizarModelo(false);

              // Notificar al GameManager
              this.gameManager.calabazaRecogida();
            }
          }
        }
      }
    });
  }

  configurarGameLoop() {
    this.scene.onBeforeRenderObservable.add(() => {
      // Solo permitir movimiento si el juego está activo
      if (!this.gameManager.juegoActivo) return;

      const moviendo = this.player.mover(this.inputManager);

      if (this.player.estaMoviendo !== moviendo) {
        this.player.estaMoviendo = moviendo;
        this.player.actualizarModelo(this.paqueteEnMano !== null);
      }
    });
  }

  reiniciar() {
    // Soltar paquete si tiene uno en mano
    if (this.paqueteEnMano) {
      this.paqueteEnMano.parent = null;
      this.paqueteEnMano.metadata.enMano = false;
      this.paqueteEnMano = null;
    }

    // Reiniciar posición del jugador
    this.player.contenedor.position = new BABYLON.Vector3(0, 0, 0);
    this.player.contenedor.rotation.y = 0;
    this.player.actualizarModelo(false);

    // Reiniciar calabazas
    this.gameObjects.reiniciarPaquetes();
  }
}
