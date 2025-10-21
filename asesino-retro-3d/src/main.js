// ============================================
// MAIN.JS - Orquestador Principal
// ============================================

// Importaciones necesarias
import Killer from './characters/Killer.js';
import Victim from './characters/Victim.js';
import Materials from './scene/Materials.js';
import SceneSetup from './scene/SceneSetup.js';
import Room from './environment/Room.js';
import Furniture from './environment/Furniture.js';
import Decorations from './props/Decorations.js';
import Tools from './props/Tools.js';
import KillerAnimator from './characters/animations/KillerAnimator.js';
import FollowCamera from './controls/FollowCamera.js';


// Esperar a que Babylon.js esté completamente cargado
window.addEventListener('DOMContentLoaded', function () {
  if (typeof BABYLON === 'undefined') {
    console.error("❌ Babylon.js no se cargó correctamente");
    console.error("Verifica que las etiquetas <script> estén en el HTML:");
    console.error("1. babylon.js");
    console.error("2. babylonjs.loaders.min.js");
    return;
  }

  console.log("✅ Babylon.js cargado correctamente");
  console.log("🔍 Verificando loaders...");
  console.log("GLTF Loader:", BABYLON.SceneLoader.IsPluginForExtensionAvailable(".gltf"));

  initApp();
});

function initApp() {
  const canvas = document.getElementById("renderCanvas");
  if (!canvas) {
    console.error("❌ No se encontró el elemento canvas");
    return;
  }

  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
  });
  console.log("🎮 Motor Babylon.js creado");

  const createScene = async function () {
    const scene = new BABYLON.Scene(engine);

    // ================================================================
    // ¡IMPORTANTE! Edita tu archivo 'SceneSetup.js'
    // Haz que 'initialize' NO cree una cámara.
    // Debería devolver solo { lights, shadowGenerator }
    // ================================================================
    const sceneConfig = SceneSetup.initialize(scene, canvas);
    const { lights, shadowGenerator } = sceneConfig;
    // const camera = sceneConfig.camera; // <-- Ya no queremos esta cámara

    const materials = Materials.createAll(scene);

    Room.create(scene, materials, shadowGenerator);
    Furniture.create(scene, materials, shadowGenerator);
    Decorations.create(scene, materials, shadowGenerator, lights);
    Tools.create(scene, materials, shadowGenerator);

    await Victim.create(scene, materials, shadowGenerator);

    // Cargar el asesino (modelo 'stopped' por defecto)
    const killerData = await Killer.load(scene, shadowGenerator);

    // ================================================================
    // Crear la nueva cámara y el animador
    // ================================================================
    let camera = null;

    if (killerData && killerData.rootMesh) {

      const cameraTarget = new BABYLON.TransformNode("cameraTarget", scene);

      // 2. Hacemos que este objeto sea "hijo" del personaje.
      // Así, se moverá a donde vaya el personaje.
      cameraTarget.parent = killerData.rootMesh;

      // 3. Subimos la posición LOCAL de este objeto invisible en el eje Y.
      // ¡El modelo del personaje (killerData.rootMesh) no se mueve!
      cameraTarget.position.y = 1.2; // Ajusta esta altura (ej. 1.2 es el pecho)

      // 1. Crear la cámara que sigue al asesino
      camera = FollowCamera.create(scene, cameraTarget, canvas);

      // 2. Inicializar el controlador del personaje
      KillerAnimator.init(scene, camera, killerData.rootMesh);
    } else {
      console.error("❌ No se pudo cargar el Killer, no se puede crear cámara ni animador.");
      // Crear una cámara de respaldo si falla
      camera = new BABYLON.FreeCamera("fallbackCam", new BABYLON.Vector3(0, 1.5, -5), scene);
      camera.attachControl(canvas, true);
    }

    console.log("✅ Escena completa cargada exitosamente!");

    return {
      scene,
      camera, // Devolver la nueva cámara
      lights,
      shadowGenerator
    };
  };

  let sceneData;

  createScene().then(data => {
    sceneData = data;
    const { scene } = data;

    engine.runRenderLoop(() => {
      // Obtener el tiempo delta (en segundos)
      const deltaTime = engine.getDeltaTime() / 1000.0;

      // Actualizar la lógica del personaje en cada frame
      KillerAnimator.update(deltaTime);

      // Renderizar la escena
      scene.render();
    });

    console.log("🎮 Motor iniciado correctamente");

    // ================================================================
    // BORRAR EL CÓDIGO DE PATRULLAJE
    // ================================================================
    // if (killerRootMesh) { ... } // <-- ¡BORRA ESTE BLOQUE!
    // KillerAnimator.startPatrolX(...); // <-- ¡BORRA ESTA LÍNEA!

  }).catch(error => {
    // ... (código de catch) ...
  });

  // ... (código de 'resize') ...

  // Manejar visibilidad de la pestaña (optimización)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      engine.stopRenderLoop();
      // Pausar la entrada para que no se quede "caminando"
      KillerAnimator.pauseAllInput();
    } else if (sceneData) {
      engine.runRenderLoop(() => {
        // Recalcular deltaTime (importante después de una pausa)
        const deltaTime = engine.getDeltaTime() / 1000.0;
        KillerAnimator.update(deltaTime);
        sceneData.scene.render();
      });
    }
  });

  window.debugScene = () => sceneData;
}