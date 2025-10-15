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
      body: this._createBodyMaterial(scene),
      blood: this._createBloodMaterial(scene),
      darkWood: this._createDarkWoodMaterial(scene),
      glass: this._createGlassMaterial(scene)
    };
  },

  /**
   * Material metálico retro con textura pixel
   */
  _createRetroMaterial(scene) {
    const material = new BABYLON.StandardMaterial("retroMat", scene);
    const texture = new BABYLON.Texture("assets/textures/retro_metal.png", scene);
    // === LÍNEA CORREGIDA ===
    texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // =======================
    material.diffuseTexture = texture;
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    return material;
  },

  /**
   * Material del asesino (textura pixel)
   */
  _createKillerMaterial(scene) {
    const material = new BABYLON.StandardMaterial("killerMat", scene);
    const texture = new BABYLON.Texture("assets/textures/asesino_textura.png", scene);
    // === LÍNEA CORREGIDA ===
    texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // =======================
    material.diffuseTexture = texture;
    material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    return material;
  },

  /**
   * Material de la ropa del cadáver
   */
  _createVictimClothMaterial(scene) {
    const material = new BABYLON.StandardMaterial("victimClothMat", scene);
    const texture = new BABYLON.Texture("assets/textures/cuerpo_textura.png", scene);
    // === LÍNEA CORREGIDA ===
    texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // =======================
    material.diffuseTexture = texture;
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    return material;
  },

  /**
   * Material del suelo con textura pixel
   */
  _createFloorMaterial(scene) {
    const material = new BABYLON.StandardMaterial("floorMat", scene);
    const texture = new BABYLON.Texture("assets/textures/floor_pixel.png", scene);
    // === LÍNEA CORREGIDA ===
    texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // =======================
    material.diffuseTexture = texture;
    material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
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