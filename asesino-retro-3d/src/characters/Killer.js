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
    console.log("🎭 Cargando modelo estático del asesino...");

    try {
      // Carga el modelo de forma asíncrona
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        "",                      // Importar todas las mallas
        "assets/models/killer/",        // Ruta a la carpeta
        "killer.gltf",           // Nombre del archivo
        scene
      );

      console.log("✅ Modelo cargado exitosamente.");

      // El nodo raíz suele ser el primer elemento
      const rootMesh = result.meshes[0];
      rootMesh.name = "killer_root";

      // --- Posición, Rotación y Escala Fijas ---
      rootMesh.position = new BABYLON.Vector3(0, 0, 1.1);
      rootMesh.rotation.y = -Math.PI / 3;
      rootMesh.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);

      // Aplicar sombras a todas las partes del modelo
      result.meshes.forEach(mesh => {
        mesh.receiveShadows = true;
        shadowGen.addShadowCaster(mesh);
      });

      console.log("🎯 Asesino posicionado estáticamente.");

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
      console.error("❌ Error al cargar el modelo del asesino:", error);
      return null; // Devuelve null si la carga falla
    }
  }
};

export default Killer;