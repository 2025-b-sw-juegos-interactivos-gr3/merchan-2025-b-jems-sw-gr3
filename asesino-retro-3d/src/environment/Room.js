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
    this._createCandles(scene, materials);

    console.log("✅ Habitación construida");
  },

  /**
   * Crea el suelo
   */
  _createFloor(scene, materials, shadowGen) {
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
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
      { width: 10, height: 5, depth: 0.1 },
      scene
    );
    wall1.position = new BABYLON.Vector3(0, 2.5, 5);
    wall1.material = materials.wallMaterial;

    // Pared lateral izquierda
    const wall2 = BABYLON.MeshBuilder.CreateBox(
      "wall2",
      { width: 0.1, height: 5, depth: 10 },
      scene
    );
    wall2.position = new BABYLON.Vector3(-5, 2.5, 0);
    wall2.material = materials.wallMaterial;

    // Pared frontal
    const wall3 = BABYLON.MeshBuilder.CreateBox(
      "wall3",
      { width: 10, height: 5, depth: 0.1 },
      scene
    );
    wall3.position = new BABYLON.Vector3(0, 2.5, -5);
    wall3.material = materials.wallMaterial;

    // Pared lateral derecha
    const wall4 = BABYLON.MeshBuilder.CreateBox(
      "wall4",
      { width: 0.1, height: 5, depth: 10 },
      scene
    );
    wall4.position = new BABYLON.Vector3(5, 2.5, 0);
    wall4.material = materials.wallMaterial;

    return { wall1, wall2, wall3, wall4 };
  },

  /**
   * Crea las velas en las paredes (1 por pared)
   */
  _createCandles(scene, materials) {
    const candlePositions = [
      // Pared trasera (z = 5)
      { x: 0, y: 2.5, z: 4.9 },
      // Pared izquierda (x = -5)
      { x: -4.9, y: 2.5, z: 0 },
      // Pared frontal (z = -5)
      { x: 0, y: 2.5, z: -4.9 },
      // Pared derecha (x = 5)
      { x: 4.9, y: 2.5, z: 0 }
    ];

    candlePositions.forEach((pos, index) => {
      // Base de la vela
      const candleBase = BABYLON.MeshBuilder.CreateCylinder(
        `candleBase${index}`,
        { height: 0.3, diameter: 0.15 },
        scene
      );
      candleBase.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
      candleBase.material = materials.darkMetal;

      // Vela
      const candle = BABYLON.MeshBuilder.CreateCylinder(
        `candle${index}`,
        { height: 0.4, diameter: 0.08 },
        scene
      );
      candle.position = new BABYLON.Vector3(pos.x, pos.y + 0.35, pos.z);
      const candleMat = new BABYLON.StandardMaterial(`candleMat${index}`, scene);
      candleMat.diffuseColor = new BABYLON.Color3(0.9, 0.85, 0.7);
      candleMat.emissiveColor = new BABYLON.Color3(0.15, 0.13, 0.1);
      candle.material = candleMat;

      // Luz de la vela
      const candleLight = new BABYLON.PointLight(
        `candleLight${index}`,
        new BABYLON.Vector3(pos.x, pos.y + 0.6, pos.z),
        scene
      );
      candleLight.diffuse = new BABYLON.Color3(1.0, 0.7, 0.3);
      candleLight.intensity = 0.2;
      candleLight.range = 4;
    });
  }
};

export default Room;