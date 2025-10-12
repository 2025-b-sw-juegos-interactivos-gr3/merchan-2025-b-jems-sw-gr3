// Obtener el lienzo (canvas) del HTML
const canvas = document.getElementById("renderCanvas");

// Crear el motor de Babylon.js
const engine = new BABYLON.Engine(canvas, true);

// Función para crear la escena
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.08); // Fondo muy oscuro y lúgubre

  // --- CÁMARA ---
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -5), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  camera.speed = 0.15;
  camera.angularSensibility = 2000;

  // --- ILUMINACIÓN ---
  const hemi = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = 0.28;
  hemi.diffuse = new BABYLON.Color3(0.6, 0.6, 0.7);

  const mainLight = new BABYLON.PointLight("mainPointLight", new BABYLON.Vector3(0, 3, 0), scene);
  mainLight.intensity = 0.8;
  mainLight.diffuse = new BABYLON.Color3(1, 0.95, 0.85);

  // Lámpara roja ambiental
  const redLight = new BABYLON.PointLight("redLight", new BABYLON.Vector3(2, 1.5, 2), scene);
  redLight.intensity = 0.42;
  redLight.diffuse = new BABYLON.Color3(0.8, 0.2, 0.2);
  redLight.range = 6;

  // --- SHADOWS (opcional básico) ---
  const shadowLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-0.3, -1, 0.2), scene);
  shadowLight.position = new BABYLON.Vector3(5, 10, -5);
  shadowLight.intensity = 0.45;
  const shadowGen = new BABYLON.ShadowGenerator(1024, shadowLight);
  shadowGen.useBlurExponentialShadowMap = true;
  shadowGen.blurKernel = 8;

  // --- MATERIALES Y TEXTURAS RETRO ---
  // Textura metálica retro (pixel)
  const retroMaterial = new BABYLON.StandardMaterial("retroMat", scene);
  const retroTexture = new BABYLON.Texture("assets/textures/retro_metal.png", scene);
  retroTexture.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
  retroMaterial.diffuseTexture = retroTexture;
  retroMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  // Material asesino (atlas pixel)
  const killerMaterial = new BABYLON.StandardMaterial("killerMat", scene);
  const killerTexture = new BABYLON.Texture("assets/textures/asesino_textura.png", scene);
  killerTexture.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
  killerMaterial.diffuseTexture = killerTexture;
  killerMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  // Material del cadáver (ropa) - pixel
  const victimClothMaterial = new BABYLON.StandardMaterial("victimClothMat", scene);
  const victimTexture = new BABYLON.Texture("assets/textures/cuerpo_textura.png", scene);
  victimTexture.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
  victimClothMaterial.diffuseTexture = victimTexture;
  victimClothMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  // Materiales adicionales
  const darkMetalMaterial = new BABYLON.StandardMaterial("darkMetalMat", scene);
  darkMetalMaterial.diffuseColor = new BABYLON.Color3(0.28, 0.28, 0.30);
  darkMetalMaterial.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
  darkMetalMaterial.shininess = 10;

  const bodyMaterial = new BABYLON.StandardMaterial("bodyMat", scene);
  bodyMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.4, 0.35);
  bodyMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  const bloodMaterial = new BABYLON.StandardMaterial("bloodMat", scene);
  bloodMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.0, 0.0);
  bloodMaterial.specularColor = new BABYLON.Color3(1.0, 0.1, 0.1);
  bloodMaterial.alpha = 0.95;

  const darkWoodMaterial = new BABYLON.StandardMaterial("darkWoodMat", scene);
  darkWoodMaterial.diffuseColor = new BABYLON.Color3(0.38, 0.29, 0.21);
  darkWoodMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  const floorMaterial = new BABYLON.StandardMaterial("floorMat", scene);
  const floorTexture = new BABYLON.Texture("assets/textures/floor_pixel.png", scene);
  floorTexture.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
  floorMaterial.diffuseTexture = floorTexture;
  floorMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  const glassMat = new BABYLON.StandardMaterial("glassMat", scene);
  glassMat.diffuseColor = new BABYLON.Color3(0.4, 0.6, 0.8);
  glassMat.alpha = 0.45;
  glassMat.specularPower = 128;

  // --- SUELO Y PAREDES ---
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 15, height: 15 }, scene);
  ground.material = floorMaterial;
  ground.receiveShadows = true;

  const wall1 = BABYLON.MeshBuilder.CreateBox("wall1", { width: 15, height: 5, depth: 0.1 }, scene);
  wall1.position = new BABYLON.Vector3(0, 2.5, 7.5);
  wall1.material = darkMetalMaterial;

  const wall2 = BABYLON.MeshBuilder.CreateBox("wall2", { width: 0.1, height: 5, depth: 15 }, scene);
  wall2.position = new BABYLON.Vector3(-7.5, 2.5, 0);
  wall2.material = darkMetalMaterial;

  // --- MESA PRINCIPAL (mantengo tu mesa existente) ---
  const mainTableTop = BABYLON.MeshBuilder.CreateBox("mainTableTop", { width: 3, height: 0.15, depth: 1.5 }, scene);
  mainTableTop.position.y = 0.8;
  mainTableTop.material = darkMetalMaterial;
  shadowGen.addShadowCaster(mainTableTop);

  const createLeg = (x, z) => {
    const leg = BABYLON.MeshBuilder.CreateCylinder("leg", { height: 0.7, diameter: 0.1 }, scene);
    leg.position = new BABYLON.Vector3(x, 0.4, z);
    leg.material = darkMetalMaterial;
    leg.receiveShadows = true;
    shadowGen.addShadowCaster(leg);
    return leg;
  };
  createLeg(1.3, 0.6); createLeg(-1.3, 0.6); createLeg(1.3, -0.6); createLeg(-1.3, -0.6);

  // --- CADÁVER (como tenías) ---
  const torso = BABYLON.MeshBuilder.CreateBox("torso", { width: 1.0, height: 0.2, depth: 0.5 }, scene);
  torso.position = new BABYLON.Vector3(0, 0.95, 0);
  torso.material = victimClothMaterial;
  torso.receiveShadows = true;

  const head = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 0.3 }, scene);
  head.position = new BABYLON.Vector3(0.6, 1.1, 0);
  head.material = bodyMaterial;
  head.receiveShadows = true;

  const arm1 = BABYLON.MeshBuilder.CreateBox("arm1", { width: 0.5, height: 0.1, depth: 0.15 }, scene);
  arm1.rotation.z = Math.PI / 4;
  arm1.position = new BABYLON.Vector3(-0.4, 0.9, -0.3);
  arm1.material = bodyMaterial;
  arm1.receiveShadows = true;

  const bloodPuddle1 = BABYLON.MeshBuilder.CreateDisc("bloodPuddle1", { radius: 0.4, tessellation: 24 }, scene);
  bloodPuddle1.rotation.x = Math.PI / 2;
  bloodPuddle1.position = new BABYLON.Vector3(0.2, 0.88, 0.2);
  bloodPuddle1.material = bloodMaterial;
  bloodPuddle1.receiveShadows = true;

  // --- ASESINO (mantengo al asesino) ---
  const faceUV = new BABYLON.Vector4(0.01, 0.75, 0.24, 0.99);
  const torsoUV = new BABYLON.Vector4(0.25, 0.75, 0.5, 0.99);
  const sideUV = new BABYLON.Vector4(0.5, 0.25, 0.75, 0.5);
  const headUVs = [sideUV, faceUV, sideUV, sideUV, sideUV, sideUV];
  const torsoUVs = [sideUV, torsoUV, sideUV, sideUV, sideUV, sideUV];

  const killer = new BABYLON.TransformNode("killer", scene);
  killer.position = new BABYLON.Vector3(-2, 0, 0);
  killer.rotation.y = -Math.PI / 4;

  const kHead = BABYLON.MeshBuilder.CreateBox("kH", { width: 0.4, height: 0.4, depth: 0.4, faceUV: headUVs }, scene);
  kHead.parent = killer;
  kHead.position.y = 1.7;
  kHead.material = killerMaterial;
  shadowGen.addShadowCaster(kHead);

  const kTorso = BABYLON.MeshBuilder.CreateBox("kT", { width: 0.6, height: 1.0, depth: 0.4, faceUV: torsoUVs }, scene);
  kTorso.parent = killer;
  kTorso.position.y = 1.0;
  kTorso.material = killerMaterial;
  shadowGen.addShadowCaster(kTorso);

  const kArm1 = BABYLON.MeshBuilder.CreateBox("kA1", { width: 0.2, height: 0.8, depth: 0.2 }, scene);
  kArm1.parent = killer;
  kArm1.position = new BABYLON.Vector3(-0.4, 1.0, 0);
  kArm1.material = killerMaterial;
  shadowGen.addShadowCaster(kArm1);

  const kArm2 = BABYLON.MeshBuilder.CreateBox("kA2", { width: 0.2, height: 0.8, depth: 0.2 }, scene);
  kArm2.parent = killer;
  kArm2.position = new BABYLON.Vector3(0.4, 1.0, 0);
  kArm2.material = killerMaterial;
  shadowGen.addShadowCaster(kArm2);

  const kLeg1 = BABYLON.MeshBuilder.CreateBox("kL1", { width: 0.25, height: 1.0, depth: 0.25 }, scene);
  kLeg1.parent = killer;
  kLeg1.position = new BABYLON.Vector3(-0.15, 0.5, 0);
  kLeg1.material = killerMaterial;
  shadowGen.addShadowCaster(kLeg1);

  const kLeg2 = BABYLON.MeshBuilder.CreateBox("kL2", { width: 0.25, height: 1.0, depth: 0.25 }, scene);
  kLeg2.parent = killer;
  kLeg2.position = new BABYLON.Vector3(0.15, 0.5, 0);
  kLeg2.material = killerMaterial;
  shadowGen.addShadowCaster(kLeg2);

  // --- MESA AUXILIAR Y HERRAMIENTAS NUEVAS ---
  const auxTable = BABYLON.MeshBuilder.CreateBox("auxTable", { width: 1.4, height: 0.12, depth: 0.8 }, scene);
  auxTable.position = new BABYLON.Vector3(2.2, 0.7, -0.8);
  auxTable.material = darkMetalMaterial;
  auxTable.receiveShadows = true;

  // Patas mesa auxiliar
  const auxLeg1 = BABYLON.MeshBuilder.CreateCylinder("auxLeg1", { height: 0.6, diameter: 0.08 }, scene);
  auxLeg1.position = new BABYLON.Vector3(2.9, 0.35, -1.2);
  auxLeg1.material = darkMetalMaterial;
  const auxLeg2 = auxLeg1.clone("auxLeg2"); auxLeg2.position.x = 1.5;
  const auxLeg3 = auxLeg1.clone("auxLeg3"); auxLeg3.position.z = -0.4;
  const auxLeg4 = auxLeg1.clone("auxLeg4"); auxLeg4.position.set(1.5, 0.35, -0.4);

  // Sierra (estilizada, retro)
  const sawHandle = BABYLON.MeshBuilder.CreateBox("sawHandle", { width: 0.18, height: 0.05, depth: 0.06 }, scene);
  sawHandle.position = new BABYLON.Vector3(1.95, 0.77, -0.9);
  sawHandle.material = darkWoodMaterial;
  sawHandle.rotation.y = -0.2;
  sawHandle.receiveShadows = true;

  const sawBlade2 = BABYLON.MeshBuilder.CreateBox("sawBlade2", { width: 0.6, height: 0.03, depth: 0.08 }, scene);
  sawBlade2.position = new BABYLON.Vector3(2.22, 0.77, -0.88);
  sawBlade2.material = darkMetalMaterial;
  sawBlade2.receiveShadows = true;

  // Martillo
  const hammerHead = BABYLON.MeshBuilder.CreateBox("hammerHead", { width: 0.14, height: 0.06, depth: 0.06 }, scene);
  hammerHead.position = new BABYLON.Vector3(2.45, 0.77, -0.6);
  hammerHead.material = darkMetalMaterial;
  const hammerHandle = BABYLON.MeshBuilder.CreateBox("hammerHandle", { width: 0.06, height: 0.25, depth: 0.06 }, scene);
  hammerHandle.position = new BABYLON.Vector3(2.53, 0.65, -0.6);
  hammerHandle.material = darkWoodMaterial;

  // Pinzas (stylized)
  const plierTop = BABYLON.MeshBuilder.CreateBox("plierTop", { width: 0.02, height: 0.14, depth: 0.02 }, scene);
  plierTop.position = new BABYLON.Vector3(2.05, 0.78, -0.5);
  plierTop.material = darkMetalMaterial;
  const plierBottom = plierTop.clone("plierBottom"); plierBottom.position.y = 0.68;

  // Bisturí (estilizado, no explícito)
  const scalpel = BABYLON.MeshBuilder.CreateBox("scalpel", { width: 0.02, height: 0.12, depth: 0.01 }, scene);
  scalpel.position = new BABYLON.Vector3(2.18, 0.78, -0.45);
  scalpel.material = darkMetalMaterial;

  // Frascos / botellas decorativas
  for (let i = 0; i < 3; i++) {
    const bottle = BABYLON.MeshBuilder.CreateCylinder("bottle" + i, { height: 0.22, diameterTop: 0.06, diameterBottom: 0.08, tessellation: 12 }, scene);
    bottle.position = new BABYLON.Vector3(2.4 - i * 0.25, 0.85, -1.05);
    bottle.material = glassMat;
    bottle.receiveShadows = true;
  }

  // Cajas apiladas cerca del crate
  const crate = BABYLON.MeshBuilder.CreateBox("crate", { width: 0.8, height: 0.6, depth: 0.8 }, scene);
  crate.position = new BABYLON.Vector3(1.5, 0.3, 2);
  crate.material = darkWoodMaterial;
  crate.receiveShadows = true;

  const smallBox = BABYLON.MeshBuilder.CreateBox("smallBox", { width: 0.4, height: 0.25, depth: 0.4 }, scene);
  smallBox.position = new BABYLON.Vector3(1.5, 0.65, 2);
  smallBox.material = darkWoodMaterial;
  smallBox.receiveShadows = true;

  // Taburete
  const stoolTop = BABYLON.MeshBuilder.CreateCylinder("stoolTop", { height: 0.08, diameter: 0.4 }, scene);
  stoolTop.position = new BABYLON.Vector3(-1.2, 0.5, 1.4);
  stoolTop.material = darkWoodMaterial;
  stoolTop.receiveShadows = true;

  const stoolLeg = BABYLON.MeshBuilder.CreateCylinder("stoolLeg", { height: 0.45, diameter: 0.06 }, scene);
  stoolLeg.position = new BABYLON.Vector3(-1.2, 0.27, 1.4);
  stoolLeg.material = darkMetalMaterial;
  stoolLeg.receiveShadows = true;

  // Estante en la pared con objetos (pixel decorations)
  const shelf = BABYLON.MeshBuilder.CreateBox("shelf", { width: 3.0, height: 0.12, depth: 0.25 }, scene);
  shelf.position = new BABYLON.Vector3(0, 2.9, 6.95);
  shelf.material = darkWoodMaterial;
  shelf.receiveShadows = true;

  // Objetos pequeños sobre el estante (cajas/latitas)
  for (let i = 0; i < 5; i++) {
    const tiny = BABYLON.MeshBuilder.CreateBox("tiny" + i, { width: 0.18, height: 0.08, depth: 0.12 }, scene);
    tiny.position = new BABYLON.Vector3(-1.2 + i * 0.6, 2.95, 6.95);
    tiny.material = retroMaterial;
  }

  // Cadenas colgando del techo para ambiente
  for (let i = 0; i < 4; i++) {
    const chain = BABYLON.MeshBuilder.CreateCylinder("chain" + i, { height: 1.2, diameter: 0.04, tessellation: 8 }, scene);
    chain.position = new BABYLON.Vector3(-2 + i * 1.5, 2.5, 3.0);
    chain.material = darkMetalMaterial;
    chain.receiveShadows = true;
  }

  // Lámpara colgante principal (estética + luz con parpadeo)
  const lamp = BABYLON.MeshBuilder.CreateCylinder("lamp", { height: 0.28, diameter: 0.46, tessellation: 12 }, scene);
  lamp.position = new BABYLON.Vector3(0, 3.5, 0);
  lamp.material = darkMetalMaterial;

  const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", { diameter: 0.16 }, scene);
  bulb.position = new BABYLON.Vector3(0, 3.3, 0);
  bulb.material = glassMat;

  const bulbLight = new BABYLON.PointLight("bulbLight", bulb.position, scene);
  bulbLight.intensity = 0.6;
  bulbLight.range = 6;
  bulbLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7);

  // Parpadeo sutil de la bombilla
  scene.registerBeforeRender(() => {
    // ruido muy suave para parpadeo
    const flicker = 0.55 + Math.abs(Math.sin(Date.now() * 0.0012)) * 0.18;
    bulbLight.intensity = flicker;
    // pulso muy leve en la luz roja también
    redLight.intensity = 0.38 + Math.abs(Math.cos(Date.now() * 0.0009)) * 0.06;
  });

  // --- ELEMENTO AMBIENT (niebla ligera) ---
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.02;
  scene.fogColor = scene.clearColor;

  // --- DETALLES PIXEL-STYLE (Overlay / stickers en pared) ---
  // Pequeño plano con textura pixel para simular póster retro
  const posterMat = new BABYLON.StandardMaterial("posterMat", scene);
  const posterTex = new BABYLON.Texture("assets/textures/poster_pixel.png", scene);
  posterTex.uScale = 1;
  posterTex.vScale = 1;
  posterTex.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
  posterMat.diffuseTexture = posterTex;
  posterMat.specularColor = new BABYLON.Color3(0, 0, 0);
  posterMat.emissiveColor = new BABYLON.Color3(0.02, 0.02, 0.02);

  const poster = BABYLON.MeshBuilder.CreatePlane("poster", { width: 1.2, height: 0.8 }, scene);
  poster.position = new BABYLON.Vector3(-4.9 + 0.06, 2.3, 0);
  poster.rotation.y = Math.PI / 2;
  poster.material = posterMat;

  // --- COLISIONES / INTERACCIONES LIGERAS (ejemplo) ---
  // Haz que algunos objetos reaccionen si quieres: por ahora solo marco como pickable
  [sawBlade2, hammerHead, scalpel, sawHandle].forEach(m => {
    m.isPickable = true;
  });

  // --- FIN: RETORNO DE LA ESCENA ---
  return scene;
};

const scene = createScene();

// Run loop
engine.runRenderLoop(function () {
  scene.render();
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
