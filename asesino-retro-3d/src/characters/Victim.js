// ============================================
// VICTIM - Cadáver en la Mesa (Cargado desde GLTF)
// ============================================

const Victim = {
  /**
   * Carga el modelo del cadáver y lo posiciona en la escena.
   * La función ahora es asíncrona para manejar la carga del modelo.
   * @param {BABYLON.Scene} scene
   * @param {Object} materials
   * @param {BABYLON.ShadowGenerator} shadowGen
   * @returns {Promise<Object>} Una promesa que se resuelve con las mallas del cadáver y el charco de sangre.
   */
  async create(scene, materials, shadowGen) {
    console.log("💀 Cargando modelo del cadáver...");

    try {
      // Carga el modelo GLTF de forma asíncrona
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        "", // Importar todas las mallas del archivo
        "assets/models/victim/", // Ruta a la carpeta de modelos
        "victim.glb", // Nombre del archivo
        scene
      );

      // El primer elemento (índice 0) suele ser el nodo raíz que agrupa todas las mallas
      const victimRoot = result.meshes[0];
      victimRoot.name = "victimRoot";

      // --- Posicionamiento, Rotación y Escala ---
      // Posición para que esté sobre la mesa principal
      victimRoot.position = new BABYLON.Vector3(-0.2, -0.4, 0);
      victimRoot.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

      // Rotación para que esté recostado sobre su espalda

      // Escala solicitada
      victimRoot.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);

      // Aplicar sombras a todas las mallas cargadas del modelo
      result.meshes.forEach(mesh => {
        shadowGen.addShadowCaster(mesh);
        mesh.receiveShadows = true;
      });

      // Creamos el charco de sangre por separado, ya que es un efecto de la escena
      const bloodPuddle = this._createBloodPuddle(scene, materials);
      bloodPuddle.receiveShadows = true;

      console.log("✅ Cadáver cargado y posicionado");

      // Devolvemos el nodo raíz del modelo y el charco de sangre
      return {
        root: victimRoot,
        bloodPuddle: bloodPuddle
      };

    } catch (error) {
      console.error("❌ Error al cargar el modelo de la víctima:", error);
      return null;
    }
  },

  /**
   * Crea el charco de sangre. Se mantiene como un método separado.
   * @param {BABYLON.Scene} scene
   * @param {Object} materials
   * @returns {BABYLON.Mesh}
   */
  _createBloodPuddle(scene, materials) {
    const puddle = BABYLON.MeshBuilder.CreateDisc(
      "bloodPuddle",
      { radius: 0.4, tessellation: 24 },
      scene
    );
    puddle.rotation.x = Math.PI / 2;
    puddle.position = new BABYLON.Vector3(0.2, 0.88, 0.2); // Ligeramente sobre la mesa
    puddle.material = materials.blood;

    return puddle;
  }
};

export default Victim;