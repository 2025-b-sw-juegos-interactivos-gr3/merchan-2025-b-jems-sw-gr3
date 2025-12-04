// Gestión de entradas del teclado
class InputManager {
  constructor(scene) {
    this.inputMap = {};
    this.scene = scene;
    this.inicializar();
  }

  inicializar() {
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);

    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        (evt) => {
          this.inputMap[evt.sourceEvent.key.toLowerCase()] = true;
        }
      )
    );

    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger,
        (evt) => {
          this.inputMap[evt.sourceEvent.key.toLowerCase()] = false;
        }
      )
    );
  }

  estaPresionada(tecla) {
    return this.inputMap[tecla.toLowerCase()] || false;
  }
}
