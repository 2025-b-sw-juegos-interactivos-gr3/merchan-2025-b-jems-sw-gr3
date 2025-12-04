// Punto de entrada de la aplicación
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Crear el GameManager (variable global para acceso desde HTML)
const gameManager = new GameManager();
const gameScene = new GameScene(engine, gameManager);

// Conectar GameScene con GameManager
gameManager.setGameScene(gameScene);

gameScene.crear().then((scene) => {
  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });

  // Iniciar el juego después de cargar todo
  gameManager.iniciarJuego();
});
