// src/characters/Killer.js

// ============================================
// KILLER - Modelo Estático
// ============================================

const Killer = {
  /**
   * Carga el modelo 3D del asesino y lo posiciona en la escena.
   * @param {BABYLON.Scene} scene
   * @param {BABYLON.ShadowGenerator} shadowGen
   * @returns {Promise<Object | null>} Objeto con rootMesh, meshes, skeletons, animationGroups o null si falla.
   */
  async load(scene, shadowGen) {
    console.log("🎭 Cargando modelo estático del asesino (idle)...");

    try {
      // Carga el modelo de forma asíncrona
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        "",                      // Importar todas las mallas
        "assets/models/killer/",        // Ruta a la carpeta
        "killer_stopped.glb",           // Nombre del archivo
        scene
      );

      console.log("✅ Modelo 'stopped' cargado.");

      // El nodo raíz suele ser el primer elemento
      const rootMesh = result.meshes[0];
      rootMesh.name = "killer_root_stopped";

      // --- Posición, Rotación y Escala Fijas ---
      rootMesh.position = new BABYLON.Vector3(0, 0, 3); // Empezar en el centro
      rootMesh.rotation.y = 0; // <-- CAMBIO AQUÍ (antes Math.PI). 0 es la rotación por defecto de GLTF.
      rootMesh.scaling = new BABYLON.Vector3(1, 1, 1);

      // Aplicar sombras a todas las partes del modelo
      result.meshes.forEach(mesh => {
        mesh.receiveShadows = true;
        shadowGen.addShadowCaster(mesh);
      });

      console.log("🎯 Asesino (idle) posicionado.");

      // =================================================================
      // === LÍNEA CORREGIDA: Devuelve el objeto completo ===
      // =================================================================
      return {
        rootMesh: rootMesh,
        meshes: result.meshes,
        skeletons: result.skeletons,
        animationGroups: result.animationGroups
      };

    } catch (error) {
      console.error("❌ Error al cargar el modelo del asesino (stopped):", error);
      return null; // Devuelve null si la carga falla
    }
  }
};

export default Killer;