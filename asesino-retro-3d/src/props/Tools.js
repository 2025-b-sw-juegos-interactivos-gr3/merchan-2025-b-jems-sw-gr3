// ============================================
// TOOLS - Herramientas de la Escena
// ============================================

const Tools = {
  /**
   * Crea todas las herramientas
   * @param {BABYLON.Scene} scene
   * @param {Object} materials
   * @param {BABYLON.ShadowGenerator} shadowGen
   */
  create(scene, materials, shadowGen) {
    console.log("🔪 Creando herramientas...");

    const tools = {
      saw: this._createSaw(scene, materials, shadowGen),
      hammer: this._createHammer(scene, materials, shadowGen),
      pliers: this._createPliers(scene, materials, shadowGen),
      scalpel: this._createScalpel(scene, materials, shadowGen),
      bottles: this._createBottles(scene, materials, shadowGen)
    };

    // Hacer algunas herramientas interactuables
    this._makePickable([
      tools.saw.blade,
      tools.saw.handle,
      tools.hammer.head,
      tools.scalpel
    ]);

    console.log("✅ Herramientas creadas");
    return tools;
  },

  /**
   * Crea una sierra
   */
  _createSaw(scene, materials, shadowGen) {
    // Mango
    const handle = BABYLON.MeshBuilder.CreateBox(
      "sawHandle",
      { width: 0.18, height: 0.05, depth: 0.06 },
      scene
    );
    handle.position = new BABYLON.Vector3(1.95, 0.77, -0.9);
    handle.material = materials.darkWood;
    handle.rotation.y = -0.2;
    handle.receiveShadows = true;
    shadowGen.addShadowCaster(handle);

    // Hoja
    const blade = BABYLON.MeshBuilder.CreateBox(
      "sawBlade",
      { width: 0.6, height: 0.03, depth: 0.08 },
      scene
    );
    blade.position = new BABYLON.Vector3(2.22, 0.77, -0.88);
    blade.material = materials.darkMetal;
    blade.receiveShadows = true;
    shadowGen.addShadowCaster(blade);

    return { handle, blade };
  },

  /**
   * Crea un martillo
   */
  _createHammer(scene, materials, shadowGen) {
    // Cabeza
    const head = BABYLON.MeshBuilder.CreateBox(
      "hammerHead",
      { width: 0.14, height: 0.06, depth: 0.06 },
      scene
    );
    head.position = new BABYLON.Vector3(2.45, 0.77, -0.6);
    head.material = materials.darkMetal;
    shadowGen.addShadowCaster(head);

    // Mango
    const handle = BABYLON.MeshBuilder.CreateBox(
      "hammerHandle",
      { width: 0.06, height: 0.25, depth: 0.06 },
      scene
    );
    handle.position = new BABYLON.Vector3(2.53, 0.65, -0.6);
    handle.material = materials.darkWood;
    shadowGen.addShadowCaster(handle);

    return { head, handle };
  },

  /**
   * Crea pinzas
   */
  _createPliers(scene, materials, shadowGen) {
    const top = BABYLON.MeshBuilder.CreateBox(
      "plierTop",
      { width: 0.02, height: 0.14, depth: 0.02 },
      scene
    );
    top.position = new BABYLON.Vector3(2.05, 0.78, -0.5);
    top.material = materials.darkMetal;
    shadowGen.addShadowCaster(top);

    const bottom = top.clone("plierBottom");
    bottom.position.y = 0.68;
    shadowGen.addShadowCaster(bottom);

    return { top, bottom };
  },

  /**
   * Crea un bisturí
   */
  _createScalpel(scene, materials, shadowGen) {
    const scalpel = BABYLON.MeshBuilder.CreateBox(
      "scalpel",
      { width: 0.02, height: 0.12, depth: 0.01 },
      scene
    );
    scalpel.position = new BABYLON.Vector3(2.18, 0.78, -0.45);
    scalpel.material = materials.darkMetal;
    shadowGen.addShadowCaster(scalpel);

    return scalpel;
  },

  /**
   * Crea frascos/botellas decorativas
   */
  _createBottles(scene, materials, shadowGen) {
    const bottles = [];

    for (let i = 0; i < 3; i++) {
      const bottle = BABYLON.MeshBuilder.CreateCylinder(
        `bottle${i}`,
        {
          height: 0.22,
          diameterTop: 0.06,
          diameterBottom: 0.08,
          tessellation: 12
        },
        scene
      );
      bottle.position = new BABYLON.Vector3(2.4 - i * 0.25, 0.85, -1.05);
      bottle.material = materials.glass;
      bottle.receiveShadows = true;
      shadowGen.addShadowCaster(bottle);
      bottles.push(bottle);
    }

    return bottles;
  },

  /**
   * Hace objetos seleccionables (para futuras interacciones)
   */
  _makePickable(meshes) {
    meshes.forEach(mesh => {
      if (mesh) {
        mesh.isPickable = true;
      }
    });
  }
};

export default Tools;