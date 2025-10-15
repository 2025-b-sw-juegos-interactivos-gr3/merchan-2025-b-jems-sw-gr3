// ============================================
// ROOM - Construcción del Entorno (Suelo y Paredes)
// ============================================

const Room = {
  /**
   * Crea el suelo y las paredes de la habitación
   * @param {BABYLON.Scene} scene
   * @param {Object} materials - Materiales disponibles
   * @param {BABYLON.ShadowGenerator} shadowGen
   */
  create(scene, materials, shadowGen) {
    console.log("🏠 Construyendo habitación...");

    this._createFloor(scene, materials, shadowGen);
    this._createWalls(scene, materials);

    console.log("✅ Habitación construida");
  },

  /**
   * Crea el suelo
   */
  _createFloor(scene, materials, shadowGen) {
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 15, height: 15 },
      scene
    );
    ground.material = materials.floor;
    ground.receiveShadows = true;

    return ground;
  },

  /**
   * Crea las paredes
   */
  _createWalls(scene, materials) {
    // Pared trasera
    const wall1 = BABYLON.MeshBuilder.CreateBox(
      "wall1",
      { width: 15, height: 5, depth: 0.1 },
      scene
    );
    wall1.position = new BABYLON.Vector3(0, 2.5, 7.5);
    wall1.material = materials.darkMetal;

    // Pared lateral izquierda
    const wall2 = BABYLON.MeshBuilder.CreateBox(
      "wall2",
      { width: 0.1, height: 5, depth: 15 },
      scene
    );
    wall2.position = new BABYLON.Vector3(-7.5, 2.5, 0);
    wall2.material = materials.darkMetal;

    return { wall1, wall2 };
  }
};

export default Room;