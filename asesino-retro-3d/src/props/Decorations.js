// ============================================
// DECORATIONS - Decoraciones y Ambiente
// ============================================

const Decorations = {
  /**
   * Crea todas las decoraciones
   * @param {BABYLON.Scene} scene
   * @param {Object} materials
   * @param {BABYLON.ShadowGenerator} shadowGen
   * @param {Object} lights - Referencias a las luces para animaciones
   */
  create(scene, materials, shadowGen, lights) {
    console.log("✨ Creando decoraciones...");

    this._createChains(scene, materials, shadowGen);
    this._createLamp(scene, materials, shadowGen, lights);
    this._createCrates(scene, materials, shadowGen);
    this._createPoster(scene, materials);

    console.log("✅ Decoraciones creadas");
  },

  /**
   * Cadenas colgando del techo
   */
  _createChains(scene, materials, shadowGen) {
    const chains = [];

    for (let i = 0; i < 4; i++) {
      const chain = BABYLON.MeshBuilder.CreateCylinder(
        `chain${i}`,
        { height: 1.2, diameter: 0.04, tessellation: 8 },
        scene
      );
      chain.position = new BABYLON.Vector3(-2 + i * 1.5, 2.5, 3.0);
      chain.material = materials.darkMetal;
      chain.receiveShadows = true;
      shadowGen.addShadowCaster(chain);
      chains.push(chain);
    }

    return chains;
  },

  /**
   * Lámpara colgante con luz parpadeante
   */
  _createLamp(scene, materials, shadowGen, lights) {
    // Estructura de la lámpara
    const lamp = BABYLON.MeshBuilder.CreateCylinder(
      "lamp",
      { height: 0.28, diameter: 0.46, tessellation: 12 },
      scene
    );
    lamp.position = new BABYLON.Vector3(0, 3.5, 0);
    lamp.material = materials.darkMetal;
    shadowGen.addShadowCaster(lamp);

    // Bombilla
    const bulb = BABYLON.MeshBuilder.CreateSphere(
      "bulb",
      { diameter: 0.16 },
      scene
    );
    bulb.position = new BABYLON.Vector3(0, 3.3, 0);
    bulb.material = materials.glass;
    shadowGen.addShadowCaster(bulb);

    // Luz de la bombilla
    const bulbLight = new BABYLON.PointLight(
      "bulbLight",
      bulb.position,
      scene
    );
    bulbLight.intensity = 0.6;
    bulbLight.range = 6;
    bulbLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7);

    // Animación de parpadeo
    scene.registerBeforeRender(() => {
      const time = Date.now();

      // Parpadeo sutil de la bombilla
      const flicker = 0.55 + Math.abs(Math.sin(time * 0.0012)) * 0.18;
      bulbLight.intensity = flicker;

      // Pulso en la luz roja ambiental
      if (lights.redAmbient) {
        lights.redAmbient.intensity = 0.38 + Math.abs(Math.cos(time * 0.0009)) * 0.06;
      }
    });

    return { lamp, bulb, bulbLight };
  },

  /**
   * Cajas apiladas
   */
  _createCrates(scene, materials, shadowGen) {
    // Caja grande
    const crate = BABYLON.MeshBuilder.CreateBox(
      "crate",
      { width: 0.8, height: 0.6, depth: 0.8 },
      scene
    );
    crate.position = new BABYLON.Vector3(1.5, 0.3, 2);
    crate.material = materials.darkWood;
    crate.receiveShadows = true;
    shadowGen.addShadowCaster(crate);

    // Caja pequeña encima
    const smallBox = BABYLON.MeshBuilder.CreateBox(
      "smallBox",
      { width: 0.4, height: 0.25, depth: 0.4 },
      scene
    );
    smallBox.position = new BABYLON.Vector3(1.5, 0.65, 2);
    smallBox.material = materials.darkWood;
    smallBox.receiveShadows = true;
    shadowGen.addShadowCaster(smallBox);

    return { crate, smallBox };
  },

  /**
   * Póster en la pared
   */
  _createPoster(scene, materials) {
    const poster = BABYLON.MeshBuilder.CreatePlane(
      "poster",
      { width: 1.2, height: 0.8 },
      scene
    );
    poster.position = new BABYLON.Vector3(-4.9 + 0.06, 2.3, 0);
    poster.rotation.y = Math.PI / 2;
    poster.material = materials.poster;

    return poster;
  }
};

export default Decorations;