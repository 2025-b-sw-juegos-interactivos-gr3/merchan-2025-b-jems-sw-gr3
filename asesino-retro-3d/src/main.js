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
import KillerAnimator from './characters/animations/KillerAnimator.js'; // ¡Importamos el animador!


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
    const sceneConfig = SceneSetup.initialize(scene, canvas);
    const { camera, lights, shadowGenerator } = sceneConfig;
    const materials = Materials.createAll(scene);

    Room.create(scene, materials, shadowGenerator);
    Furniture.create(scene, materials, shadowGenerator);
    Decorations.create(scene, materials, shadowGenerator, lights);
    Tools.create(scene, materials, shadowGenerator);

    await Victim.create(scene, materials, shadowGenerator);

    // Cargar el asesino
    const killerData = await Killer.load(scene, shadowGenerator); // Devuelve un objeto con rootMesh, etc.

    // ================================================================
    // Inicializar KillerAnimator aquí
    // ================================================================
    if (killerData && killerData.rootMesh) {
      KillerAnimator.init(killerData.rootMesh, killerData.animationGroups, killerData.skeletons[0]);
    } else {
      console.error("❌ No se pudo inicializar KillerAnimator: Killer.load() devolvió datos incompletos.");
    }

    console.log("✅ Escena completa cargada exitosamente!");

    return {
      scene,
      camera,
      lights,
      killerRootMesh: killerData ? killerData.rootMesh : null, // Devolvemos solo el rootMesh para la escena
      shadowGenerator
    };
  };

  let sceneData;

  createScene().then(data => {
    sceneData = data;
    const { scene, killerRootMesh } = data; // killerRootMesh ahora viene de los datos devueltos

    engine.runRenderLoop(() => {
      scene.render();
    });

    console.log("🎮 Motor iniciado correctamente");

    // ================================================================
    // Iniciar el movimiento del Killer a través de KillerAnimator
    // ================================================================
    if (killerRootMesh) {
      // Los parámetros: distancia total (2), duración de cada segmento (1s), tiempo de ciclo total (2s),
      // offset inicial en X (0), Y (0), Z (1.1)
      // Coinciden con los valores predeterminados en KillerAnimator.startPatrolX()
      KillerAnimator.startPatrolX(2, 1, 2, 0, 0, 1.1);
    }

  }).catch(error => {
    console.error("❌ Error al crear la escena:", error);
    console.error("Stack:", error.stack);
  });

  // Manejar redimensionamiento
  window.addEventListener("resize", () => {
    engine.resize();
  });

  // Manejar visibilidad de la pestaña (optimización)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      engine.stopRenderLoop();
      // Pausar el movimiento del killer cuando la pestaña no está visible
      KillerAnimator.pausePatrolOnHidden();
    } else if (sceneData) {
      engine.runRenderLoop(() => {
        sceneData.scene.render();
      });
      // Reanudar el movimiento del killer cuando la pestaña vuelve a ser visible
      KillerAnimator.resumePatrolOnVisible();
    }
  });

  window.debugScene = () => sceneData;
}