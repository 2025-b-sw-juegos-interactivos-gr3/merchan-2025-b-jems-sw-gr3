// ============================================
// MATERIALS - Gestor de Materiales
// ============================================

const Materials = {
  /**
   * Crea todos los materiales necesarios para la escena
   * @param {BABYLON.Scene} scene - La escena de Babylon.js
   * @returns {Object} Objeto con todos los materiales
   */
  createAll(scene) {
    console.log("🎨 Creando materiales...");

    return {
      // Materiales con texturas
      retro: this._createRetroMaterial(scene),
      killer: this._createKillerMaterial(scene),
      victimCloth: this._createVictimClothMaterial(scene),
      floor: this._createFloorMaterial(scene),
      poster: this._createPosterMaterial(scene),

      // Materiales sólidos
      darkMetal: this._createDarkMetalMaterial(scene),
      brightMetal: this._createBrightMetalMaterial(scene),
      wallMaterial: this._createWallMaterial(scene),
      body: this._createBodyMaterial(scene),
      blood: this._createBloodMaterial(scene),
      darkWood: this._createDarkWoodMaterial(scene),
      glass: this._createGlassMaterial(scene)
    };
  },

  /**
   * Material metálico retro (sin textura, color sólido)
   */
  _createRetroMaterial(scene) {
    const material = new BABYLON.StandardMaterial("retroMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.55);
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    return material;
  },

  /**
   * Material del asesino (sin textura, los modelos .glb ya tienen la suya)
   */
  _createKillerMaterial(scene) {
    const material = new BABYLON.StandardMaterial("killerMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
    material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    return material;
  },

  /**
   * Material de la ropa del cadáver (sin textura, el modelo .glb ya tiene la suya)
   */
  _createVictimClothMaterial(scene) {
    const material = new BABYLON.StandardMaterial("victimClothMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.45);
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    return material;
  },

  /**
   * Material de metal brillante para mesas y horno
   */
  _createBrightMetalMaterial(scene) {
    const material = new BABYLON.StandardMaterial("brightMetalMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.62); // Metal gris brillante
    material.specularColor = new BABYLON.Color3(0.9, 0.9, 0.92); // Reflejo brillante
    material.specularPower = 64; // Alto brillo metálico
    return material;
  },

  /**
   * Material de pared que no reacciona a la luz
   */
  _createWallMaterial(scene) {
    const material = new BABYLON.StandardMaterial("wallMat", scene);
    material.emissiveColor = new BABYLON.Color3(0.18, 0.18, 0.18); // Color base gris oscuro
    material.diffuseColor = new BABYLON.Color3(0, 0, 0); // Sin reacción difusa
    material.specularColor = new BABYLON.Color3(0, 0, 0); // Sin reflejo especular
    return material;
  },

  /**
   * Material del suelo - Madera flotante
   */
  _createFloorMaterial(scene) {
    const material = new BABYLON.StandardMaterial("floorMat", scene);
    const texture = new BABYLON.Texture("assets/textures/floor_pixel.png", scene);
    texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    material.diffuseTexture = texture;
    material.specularColor = new BABYLON.Color3(0.3, 0.25, 0.2); // Reflejo de madera
    material.specularPower = 32; // Brillo moderado de madera barnizada
    return material;
  },

  /**
   * Material del póster en la pared
   */
  _createPosterMaterial(scene) {
    const material = new BABYLON.StandardMaterial("posterMat", scene);
    const texture = new BABYLON.Texture("assets/textures/poster_pixel.png", scene);
    texture.uScale = 1;
    texture.vScale = 1;
    // Esta ya estaba bien, pero la dejamos para completar la revisión
    texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    material.diffuseTexture = texture;
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    material.emissiveColor = new BABYLON.Color3(0.02, 0.02, 0.02);
    return material;
  },

  /**
   * Material metálico oscuro
   */
  _createDarkMetalMaterial(scene) {
    const material = new BABYLON.StandardMaterial("darkMetalMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.28, 0.28, 0.30);
    material.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    material.shininess = 10;
    return material;
  },

  /**
   * Material de piel/cuerpo
   */
  _createBodyMaterial(scene) {
    const material = new BABYLON.StandardMaterial("bodyMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.7, 0.4, 0.35);
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    return material;
  },

  /**
   * Material de sangre
   */
  _createBloodMaterial(scene) {
    const material = new BABYLON.StandardMaterial("bloodMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.6, 0.0, 0.0);
    material.specularColor = new BABYLON.Color3(1.0, 0.1, 0.1);
    material.alpha = 0.95;
    return material;
  },

  /**
   * Material de madera oscura
   */
  _createDarkWoodMaterial(scene) {
    const material = new BABYLON.StandardMaterial("darkWoodMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.38, 0.29, 0.21);
    material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    return material;
  },

  /**
   * Material de vidrio translúcido
   */
  _createGlassMaterial(scene) {
    const material = new BABYLON.StandardMaterial("glassMat", scene);
    material.diffuseColor = new BABYLON.Color3(0.4, 0.6, 0.8);
    material.alpha = 0.45;
    material.specularPower = 128;
    return material;
  }
};

export default Materials;