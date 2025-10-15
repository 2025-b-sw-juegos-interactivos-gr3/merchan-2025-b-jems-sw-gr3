// ============================================
// FURNITURE - Muebles de la Escena
// ============================================

const Furniture = {
  /**
   * Crea todos los muebles
   * @param {BABYLON.Scene} scene
   * @param {Object} materials
   * @param {BABYLON.ShadowGenerator} shadowGen
   */
  create(scene, materials, shadowGen) {
    console.log("🪑 Creando muebles...");

    this._createMainTable(scene, materials, shadowGen);
    this._createAuxTable(scene, materials, shadowGen);
    this._createStool(scene, materials, shadowGen);
    this._createShelf(scene, materials, shadowGen);

    console.log("✅ Muebles creados");
  },

  /**
   * Mesa principal (donde está el cadáver)
   */
  _createMainTable(scene, materials, shadowGen) {
    // Superficie de la mesa
    const tableTop = BABYLON.MeshBuilder.CreateBox(
      "mainTableTop",
      { width: 3, height: 0.15, depth: 1.5 },
      scene
    );
    tableTop.position.y = 0.8;
    tableTop.material = materials.darkMetal;
    shadowGen.addShadowCaster(tableTop);

    // Patas de la mesa
    const legPositions = [
      { x: 1.3, z: 0.6 },
      { x: -1.3, z: 0.6 },
      { x: 1.3, z: -0.6 },
      { x: -1.3, z: -0.6 }
    ];

    legPositions.forEach((pos, index) => {
      const leg = BABYLON.MeshBuilder.CreateCylinder(
        `mainTableLeg${index}`,
        { height: 0.7, diameter: 0.1 },
        scene
      );
      leg.position = new BABYLON.Vector3(pos.x, 0.4, pos.z);
      leg.material = materials.darkMetal;
      leg.receiveShadows = true;
      shadowGen.addShadowCaster(leg);
    });

    return tableTop;
  },

  /**
   * Mesa auxiliar (con herramientas)
   */
  _createAuxTable(scene, materials, shadowGen) {
    // Superficie
    const auxTable = BABYLON.MeshBuilder.CreateBox(
      "auxTable",
      { width: 1.4, height: 0.12, depth: 0.8 },
      scene
    );
    auxTable.position = new BABYLON.Vector3(2.2, 0.7, -0.8);
    auxTable.material = materials.darkMetal;
    auxTable.receiveShadows = true;

    // Patas
    const legPositions = [
      { x: 2.9, z: -1.2 },
      { x: 1.5, z: -1.2 },
      { x: 2.9, z: -0.4 },
      { x: 1.5, z: -0.4 }
    ];

    legPositions.forEach((pos, index) => {
      const leg = BABYLON.MeshBuilder.CreateCylinder(
        `auxTableLeg${index}`,
        { height: 0.6, diameter: 0.08 },
        scene
      );
      leg.position = new BABYLON.Vector3(pos.x, 0.35, pos.z);
      leg.material = materials.darkMetal;
      shadowGen.addShadowCaster(leg);
    });

    return auxTable;
  },

  /**
   * Taburete
   */
  _createStool(scene, materials, shadowGen) {
    // Asiento
    const stoolTop = BABYLON.MeshBuilder.CreateCylinder(
      "stoolTop",
      { height: 0.08, diameter: 0.4 },
      scene
    );
    stoolTop.position = new BABYLON.Vector3(-1.2, 0.5, 1.4);
    stoolTop.material = materials.darkWood;
    stoolTop.receiveShadows = true;
    shadowGen.addShadowCaster(stoolTop);

    // Pata central
    const stoolLeg = BABYLON.MeshBuilder.CreateCylinder(
      "stoolLeg",
      { height: 0.45, diameter: 0.06 },
      scene
    );
    stoolLeg.position = new BABYLON.Vector3(-1.2, 0.27, 1.4);
    stoolLeg.material = materials.darkMetal;
    stoolLeg.receiveShadows = true;
    shadowGen.addShadowCaster(stoolLeg);

    return { stoolTop, stoolLeg };
  },

  /**
   * Estante en la pared
   */
  _createShelf(scene, materials, shadowGen) {
    const shelf = BABYLON.MeshBuilder.CreateBox(
      "shelf",
      { width: 3.0, height: 0.12, depth: 0.25 },
      scene
    );
    shelf.position = new BABYLON.Vector3(0, 2.9, 6.95);
    shelf.material = materials.darkWood;
    shelf.receiveShadows = true;
    shadowGen.addShadowCaster(shelf);

    // Objetos sobre el estante
    for (let i = 0; i < 5; i++) {
      const tiny = BABYLON.MeshBuilder.CreateBox(
        `shelfItem${i}`,
        { width: 0.18, height: 0.08, depth: 0.12 },
        scene
      );
      tiny.position = new BABYLON.Vector3(-1.2 + i * 0.6, 2.95, 6.95);
      tiny.material = materials.retro;
      shadowGen.addShadowCaster(tiny);
    }

    return shelf;
  }
};

export default Furniture;