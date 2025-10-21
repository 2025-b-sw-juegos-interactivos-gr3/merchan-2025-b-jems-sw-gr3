// ============================================
// SCENE SETUP - Configuración de Escena Base
// ============================================

const SceneSetup = {
  /**
   * Inicializa la configuración base de la escena
   * @param {BABYLON.Scene} scene - La escena de Babylon.js
   * @param {HTMLCanvasElement} canvas - El canvas HTML
   * @returns {Object} Objeto con luces y generador de sombras
   */
  initialize(scene, canvas) {
    console.log("🎬 Configurando escena base...");

    // Color de fondo oscuro y lúgubre
    scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.08);

    // Configurar cámara
    // --- LA CÁMARA SE ELIMINÓ DE AQUÍ ---
    // Se creará en main.js como una FollowCamera
    // const camera = this._setupCamera(scene, canvas);

    // Configurar iluminación
    const lights = this._setupLights(scene);

    // Configurar generador de sombras
    const shadowGenerator = this._setupShadows(scene, lights.directional);

    // Configurar niebla
    this._setupFog(scene);

    console.log("✅ Escena base configurada");

    return {
      // camera, // <-- Eliminado del return
      lights,
      shadowGenerator
    };
  },

  /**
   * ESTA FUNCIÓN YA NO SE USA, PERO SE DEJA POR REFERENCIA
   * (main.js ahora crea una FollowCamera)
   */
  /*
  _setupCamera(scene, canvas) {
    const camera = new BABYLON.FreeCamera(
      "mainCamera",
      new BABYLON.Vector3(0, 2, -5),
      scene
    );

    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.speed = 0.15;
    camera.angularSensibility = 2000;

    // Límites de movimiento (opcional)
    camera.minZ = 0.1;
    camera.maxZ = 100;

    return camera;
  },
  */

  /**
   * Configura todas las luces de la escena
   */
  _setupLights(scene) {
    // Luz hemisférica (luz ambiental suave)
    const hemispheric = new BABYLON.HemisphericLight(
      "hemiLight",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    hemispheric.intensity = 0.28;
    hemispheric.diffuse = new BABYLON.Color3(0.6, 0.6, 0.7);

    // Luz puntual principal
    // NOTA: Cambié el nombre a "mainPointLight" para que coincida
    // con el código de KillerAnimator.js (que busca "mainSpotlight")
    // Considera unificar nombres. Voy a usar "mainPointLight"
    const mainPoint = new BABYLON.PointLight(
      "mainPointLight", // <-- Nombre importante
      new BABYLON.Vector3(0, 3, 0),
      scene
    );
    mainPoint.intensity = 0.8;
    mainPoint.diffuse = new BABYLON.Color3(1, 0.95, 0.85);

    // Luz roja ambiental (atmósfera)
    const redAmbient = new BABYLON.PointLight(
      "redLight",
      new BABYLON.Vector3(2, 1.5, 2),
      scene
    );
    redAmbient.intensity = 0.42;
    redAmbient.diffuse = new BABYLON.Color3(0.8, 0.2, 0.2);
    redAmbient.range = 6;

    // Luz direccional para sombras
    const directional = new BABYLON.DirectionalLight(
      "dirLight",
      new BABYLON.Vector3(-0.3, -1, 0.2),
      scene
    );
    directional.position = new BABYLON.Vector3(5, 10, -5);
    directional.intensity = 0.45;

    return {
      hemispheric,
      mainPoint,
      redAmbient,
      directional
    };
  },

  /**
   * Configura el generador de sombras (versión simple y eficiente)
   */
  _setupShadows(scene, shadowLight) {
    // Usar configuración simple sin blur
    const shadowGenerator = new BABYLON.ShadowGenerator(512, shadowLight);
    shadowGenerator.useExponentialShadowMap = true;
    shadowGenerator.darkness = 0.5;

    return shadowGenerator;
  },

  /**
   * Configuración de niebla ambiental
   */
  _setupFog(scene) {
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.02;
    scene.fogColor = scene.clearColor;
  }
};

export default SceneSetup;