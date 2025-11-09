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
    this._createOven(scene, materials, shadowGen);

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
    tableTop.material = materials.brightMetal;
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
      leg.material = materials.brightMetal;
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
    auxTable.material = materials.brightMetal;
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
      leg.material = materials.brightMetal;
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
    shelf.position = new BABYLON.Vector3(0, 2.9, 4.85);
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
      tiny.position = new BABYLON.Vector3(-1.2 + i * 0.6, 2.95, 4.85);
      tiny.material = materials.retro;
      shadowGen.addShadowCaster(tiny);
    }

    return shelf;
  },

  /**
   * Horno incinerador
   */
  _createOven(scene, materials, shadowGen) {
    // Cuerpo principal del horno
    const ovenBody = BABYLON.MeshBuilder.CreateBox(
      "ovenBody",
      { width: 1.2, height: 1.4, depth: 0.8 },
      scene
    );
    ovenBody.position = new BABYLON.Vector3(-3.5, 0.7, -3);
    ovenBody.material = materials.brightMetal;
    ovenBody.receiveShadows = true;
    shadowGen.addShadowCaster(ovenBody);

    // Puerta del horno (más oscura)
    const ovenDoor = BABYLON.MeshBuilder.CreateBox(
      "ovenDoor",
      { width: 0.9, height: 1.0, depth: 0.05 },
      scene
    );
    ovenDoor.position = new BABYLON.Vector3(-2.88, 0.7, -3);

    // Material especial para la puerta
    const doorMat = new BABYLON.StandardMaterial("ovenDoorMat", scene);
    doorMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32);
    doorMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    doorMat.specularPower = 48;
    doorMat.emissiveColor = new BABYLON.Color3(0.05, 0.02, 0.0);
    ovenDoor.material = doorMat;
    shadowGen.addShadowCaster(ovenDoor);

    // Ventana del horno (vidrio oscuro)
    const ovenWindow = BABYLON.MeshBuilder.CreateBox(
      "ovenWindow",
      { width: 0.5, height: 0.4, depth: 0.03 },
      scene
    );
    ovenWindow.position = new BABYLON.Vector3(-2.85, 0.8, -3);

    // Material de vidrio oscuro con brillo naranja
    const windowMat = new BABYLON.StandardMaterial("ovenWindowMat", scene);
    windowMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    windowMat.emissiveColor = new BABYLON.Color3(0.3, 0.1, 0.0);
    windowMat.alpha = 0.8;
    ovenWindow.material = windowMat;

    // Manija de la puerta
    const handle = BABYLON.MeshBuilder.CreateCylinder(
      "ovenHandle",
      { height: 0.6, diameter: 0.05 },
      scene
    );
    handle.position = new BABYLON.Vector3(-2.82, 0.7, -2.6);
    handle.rotation.z = Math.PI / 2;
    handle.material = materials.brightMetal;
    shadowGen.addShadowCaster(handle);

    // Panel de control superior
    const controlPanel = BABYLON.MeshBuilder.CreateBox(
      "ovenControlPanel",
      { width: 1.0, height: 0.15, depth: 0.1 },
      scene
    );
    controlPanel.position = new BABYLON.Vector3(-2.85, 1.45, -3);
    controlPanel.material = materials.brightMetal;
    shadowGen.addShadowCaster(controlPanel);

    // Botones/perillas del panel
    for (let i = 0; i < 3; i++) {
      const knob = BABYLON.MeshBuilder.CreateCylinder(
        `ovenKnob${i}`,
        { height: 0.05, diameter: 0.08 },
        scene
      );
      knob.position = new BABYLON.Vector3(-2.80, 1.45, -3.2 + i * 0.2);
      knob.rotation.x = Math.PI / 2;

      const knobMat = new BABYLON.StandardMaterial(`knobMat${i}`, scene);
      knobMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      knobMat.emissiveColor = new BABYLON.Color3(0.1, 0.0, 0.0);
      knob.material = knobMat;
      shadowGen.addShadowCaster(knob);
    }

    // Base/patas del horno
    const ovenBase = BABYLON.MeshBuilder.CreateBox(
      "ovenBase",
      { width: 1.2, height: 0.1, depth: 0.8 },
      scene
    );
    ovenBase.position = new BABYLON.Vector3(-3.5, 0.05, -3);
    ovenBase.material = materials.brightMetal;
    shadowGen.addShadowCaster(ovenBase);

    // Luz interior del horno (efecto de calor)
    const ovenLight = new BABYLON.PointLight(
      "ovenLight",
      new BABYLON.Vector3(-3.3, 0.7, -3),
      scene
    );
    ovenLight.intensity = 0.3;
    ovenLight.range = 2;
    ovenLight.diffuse = new BABYLON.Color3(1.0, 0.4, 0.1);

    return {
      ovenBody,
      ovenDoor,
      ovenWindow,
      handle,
      controlPanel,
      ovenBase,
      ovenLight
    };
  }
};

export default Furniture;