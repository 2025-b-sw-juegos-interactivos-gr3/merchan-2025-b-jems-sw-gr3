// src/controls/FollowCamera.js

const FollowCamera = {
  /**
   * Crea una cámara ArcRotate que sigue a un objetivo.
   * @param {BABYLON.Scene} scene
   * @param {BABYLON.AbstractMesh} targetMesh - La malla que la cámara debe seguir.
   * @param {HTMLCanvasElement} canvas
   * @returns {BABYLON.ArcRotateCamera}
   */
  create(scene, targetMesh, canvas) {
    // Crear la cámara
    const camera = new BABYLON.ArcRotateCamera(
      "FollowCam",
      Math.PI, // <-- CAMBIO AQUÍ (antes -Math.PI / 2). (180 grados, para empezar detrás del jugador)
      Math.PI / 3,  // beta (rotación vertical inicial)
      5,            // radius (distancia al objetivo)
      targetMesh.position, // El punto sobre el que rotará
      scene
    );

    // Hacer que la cámara siga la posición del 'targetMesh'
    camera.lockedTarget = targetMesh;

    // Ajustes de la cámara en tercera persona
    camera.lowerRadiusLimit = 2;       // Distancia mínima de zoom
    camera.upperRadiusLimit = 10;      // Distancia máxima de zoom
    camera.wheelPrecision = 20;      // Velocidad del zoom con la rueda
    camera.lowerBetaLimit = 0.1;     // Ángulo vertical mínimo (para no pasar por debajo del suelo)
    camera.upperBetaLimit = Math.PI / 2.2; // Ángulo vertical máximo (para no ver desde arriba)

    // Activar colisiones para que la cámara no atraviese paredes
    camera.checkCollisions = true;

    // Adjuntar control del ratón (paneo, zoom, rotación)
    camera.attachControl(canvas, true);

    console.log("🎥 FollowCamera creada y apuntando a", targetMesh.name);
    return camera;
  }
};

export default FollowCamera;