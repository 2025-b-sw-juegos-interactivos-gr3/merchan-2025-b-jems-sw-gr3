// ============================================
// PERFORMANCE - Optimizaciones de Rendimiento
// ============================================

const Performance = {
  /**
   * Configuración de niveles de calidad
   */
  QUALITY_LEVELS: {
    LOW: {
      shadowMapSize: 256,
      useShadowBlur: false,
      antialias: false,
      fogEnabled: false,
      hardwareScaling: 2
    },
    MEDIUM: {
      shadowMapSize: 512,
      useShadowBlur: false,
      antialias: false,
      fogEnabled: true,
      hardwareScaling: 1
    },
    HIGH: {
      shadowMapSize: 1024,
      useShadowBlur: true,
      antialias: true,
      fogEnabled: true,
      hardwareScaling: 1
    }
  },

  /**
   * Aplica optimizaciones según el nivel de calidad
   * @param {BABYLON.Scene} scene
   * @param {BABYLON.Engine} engine
   * @param {string} qualityLevel - 'LOW', 'MEDIUM', 'HIGH'
   */
  applyOptimizations(scene, engine, qualityLevel = 'MEDIUM') {
    const quality = this.QUALITY_LEVELS[qualityLevel];

    console.log(`⚡ Aplicando optimizaciones de rendimiento: ${qualityLevel}`);

    // Escala de hardware (menor = mejor rendimiento, peor calidad)
    engine.setHardwareScalingLevel(quality.hardwareScaling);

    // Desactivar características innecesarias
    scene.autoClear = false;
    scene.autoClearDepthAndStencil = false;

    // Optimización de culling
    scene.skipFrustumClipping = false;
    scene.blockMaterialDirtyMechanism = true;

    // Desactivar colisiones si no se usan
    scene.collisionsEnabled = false;

    // Congelar materiales que no cambiarán
    this._freezeMaterials(scene);

    // Reducir actualizaciones de matrices
    scene.freezeActiveMeshes();

    console.log("✅ Optimizaciones aplicadas");

    return {
      shadowMapSize: quality.shadowMapSize,
      useShadowBlur: quality.useShadowBlur,
      fogEnabled: quality.fogEnabled
    };
  },

  /**
   * Congela materiales para mejor rendimiento
   */
  _freezeMaterials(scene) {
    scene.materials.forEach(material => {
      if (material && material.freeze) {
        material.freeze();
      }
    });
  },

  /**
   * Monitoreo de FPS
   */
  startFPSMonitor(engine) {
    let lastTime = performance.now();
    let frames = 0;

    const monitor = setInterval(() => {
      frames++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed);
        console.log(`📊 FPS: ${fps}`);

        // Advertencia si FPS es muy bajo
        if (fps < 30) {
          console.warn("⚠️ FPS bajo detectado. Considera reducir la calidad.");
        }

        frames = 0;
        lastTime = currentTime;
      }
    }, 100);

    return monitor;
  },

  /**
   * Obtiene información de rendimiento
   */
  getPerformanceInfo(scene, engine) {
    return {
      fps: engine.getFps().toFixed(0),
      drawCalls: scene.getEngine().drawCalls,
      activeMeshes: scene.getActiveMeshes().length,
      totalVertices: scene.getTotalVertices(),
      activeBones: scene.getActiveBones(),
      activeParticles: scene.getActiveParticles(),
      textureCount: scene.textures.length,
      materialCount: scene.materials.length
    };
  },

  /**
   * Imprime estadísticas de rendimiento
   */
  logPerformanceStats(scene, engine) {
    const stats = this.getPerformanceInfo(scene, engine);

    console.log("📊 Estadísticas de Rendimiento:");
    console.log(`  FPS: ${stats.fps}`);
    console.log(`  Draw Calls: ${stats.drawCalls}`);
    console.log(`  Meshes Activos: ${stats.activeMeshes}`);
    console.log(`  Vértices Totales: ${stats.totalVertices}`);
    console.log(`  Texturas: ${stats.textureCount}`);
    console.log(`  Materiales: ${stats.materialCount}`);
  },

  /**
   * Optimizaciones específicas para modelos 3D importados
   */
  optimizeImportedMesh(mesh) {
    // Simplificar geometría si es muy compleja
    if (mesh.getTotalVertices && mesh.getTotalVertices() > 10000) {
      console.warn(`⚠️ Mesh ${mesh.name} tiene ${mesh.getTotalVertices()} vértices`);
    }

    // Congelar transformaciones si el mesh no se moverá
    // mesh.freezeWorldMatrix();

    // Optimizar normales
    if (mesh.createNormals) {
      mesh.createNormals(false);
    }
  }
};