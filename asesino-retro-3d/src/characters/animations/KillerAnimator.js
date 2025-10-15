// src/characters/animations/KillerAnimator.js

const KillerAnimator = {
  _animationGroups: [],
  _currentAnimation: null,
  _rootMesh: null,
  _patrolInterval: null,
  _skeleton: null, // Referencia al esqueleto, aunque no se use directamente para animaciones GLTF

  /**
   * Inicializa el animador con las animaciones, esqueletos y la malla raíz del modelo.
   * @param {BABYLON.TransformNode} rootMesh - La malla raíz del modelo Killer.
   * @param {BABYLON.AnimationGroup[]} animationGroups - Grupos de animación importados del GLTF.
   * @param {BABYLON.Skeleton} [skeleton=null] - El esqueleto del modelo (opcional, para animaciones procedurales).
   */
  init(rootMesh, animationGroups, skeleton = null) {
    this._rootMesh = rootMesh;
    this._animationGroups = animationGroups;
    this._skeleton = skeleton; // Guardamos la referencia al esqueleto (útil para futuras expansiones)

    // Si hay animaciones del GLTF, detenemos todas al inicio para tener control
    this._animationGroups.forEach(group => group.stop());
    console.log(`🎬 KillerAnimator inicializado con ${animationGroups.length} animaciones.`);
    animationGroups.forEach((group, index) => console.log(`   - [${index}] ${group.name}`));
    // No reproducimos una animación por defecto aquí, se hará al iniciar el patrullaje.
  },

  /**
   * Reproduce una animación específica por su nombre.
   * @param {string} animationName - El nombre de la animación a reproducir.
   * @param {boolean} loop - Si la animación debe repetirse.
   * @param {number} speedRatio - Factor de velocidad de la animación (1.0 es normal).
   * @returns {BABYLON.AnimationGroup | null} La animación reproducida o null si no se encuentra.
   */
  playAnimation(animationName, loop = true, speedRatio = 1.0) {
    if (!this._rootMesh) {
      console.warn("⚠️ KillerAnimator no inicializado con rootMesh. No se puede reproducir animación.");
      return null;
    }

    // Detener la animación del grupo actual antes de iniciar una nueva
    if (this._currentAnimation) {
      this._currentAnimation.stop();
    }

    const anim = this._animationGroups.find(g => g.name === animationName);
    if (anim) {
      anim.speedRatio = speedRatio;
      anim.start(loop);
      this._currentAnimation = anim;
      console.log(`▶️ Reproduciendo animación: ${animationName}`);
      return anim;
    } else {
      console.warn(`⚠️ Animación "${animationName}" no encontrada. No se pudo reproducir.`);
      return null;
    }
  },

  /**
   * Detiene la animación que se está reproduciendo actualmente.
   */
  stopAnimation() {
    if (this._currentAnimation) {
      this._currentAnimation.stop();
      this._currentAnimation = null;
      console.log("⏹️ Animación detenida.");
    }
  },

  /**
   * Inicia un patrón de movimiento horizontal periódico en el eje X.
   * El killer se mueve de centro-izquierda a centro-derecha, rotando para mirar al frente.
   * @param {number} moveDistance - La distancia total a recorrer en el eje X (ej: 2 unidades para ir de -1 a 1).
   * @param {number} animationDuration - La duración de cada segmento de movimiento (ida o vuelta) en segundos.
   * @param {number} totalLoopTime - El tiempo total de un ciclo completo (ida y vuelta) en segundos.
   * @param {number} initialXOffset - Desplazamiento inicial del centro en el eje X (por defecto 0).
   * @param {number} fixedY - Posición Y fija (altura del suelo).
   * @param {number} fixedZ - Posición Z fija.
   */
  startPatrolX(moveDistance = 2, animationDuration = 1, totalLoopTime = 2, initialXOffset = 0, fixedY = 0, fixedZ = 1.1) {
    if (!this._rootMesh) {
      console.error("❌ KillerAnimator no inicializado con rootMesh. No se puede iniciar el patrullaje.");
      return;
    }

    this.stopPatrolX(); // Limpiar cualquier intervalo anterior y detener animaciones

    let goingRight = true; // Estado para saber hacia dónde se mueve

    // Calcular los puntos de inicio y fin del patrullaje
    const originalX = initialXOffset; // El centro del patrullaje
    const leftX = originalX - moveDistance / 2;
    const rightX = originalX + moveDistance / 2;

    const scene = this._rootMesh.getScene(); // Obtener la escena del mesh

    // =====================================================================
    // === NUEVO: Reproducir la animación del modelo GLTF al iniciar el patrullaje ===
    // =====================================================================
    if (this._animationGroups.length > 0) {
      // Intenta encontrar una animación de "walk", si no, usa la primera disponible.
      // **IMPORTANTE:** Reemplaza "walk" con una parte del nombre exacto de tu animación
      // Si el nombre de tu animación es "mixamo.com", puedes usar: .includes("mixamo")
      // Si es "Armature|Walk", puedes usar: .includes("walk")
      // O simplemente usa el nombre exacto si lo conoces: const walkAnimationName = "tu_nombre_exacto";
      const walkAnimationName = this._animationGroups.find(g => g.name.toLowerCase().includes("walk"))?.name || this._animationGroups[0].name;
      this.playAnimation(walkAnimationName, true, 1.0); // Bucle, velocidad normal
    } else {
      console.warn("⚠️ No se encontraron AnimationGroups en el modelo del Killer. No se puede reproducir animación de caminar.");
    }
    // =====================================================================


    const animateKillerMovement = () => {
      const startPosition = this._rootMesh.position.clone();
      let endPosition;
      let targetRotationY;

      if (goingRight) {
        endPosition = new BABYLON.Vector3(rightX, fixedY, fixedZ);
        targetRotationY = Math.PI / 2; // Mirando hacia la derecha (eje +X)
      } else {
        endPosition = new BABYLON.Vector3(leftX, fixedY, fixedZ);
        targetRotationY = -Math.PI / 2; // Mirando hacia la izquierda (eje -X)
      }

      // Animación de posición
      const positionAnimation = new BABYLON.Animation(
        "killerPosAnim",
        "position",
        60, // frames per second
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      positionAnimation.setKeys([
        { frame: 0, value: startPosition },
        { frame: 60 * animationDuration, value: endPosition }
      ]);
      positionAnimation.setEasingFunction(new BABYLON.SineEase()); // Movimiento suave

      // Animación de rotación (solo eje Y para mirar al frente)
      const rotationAnimation = new BABYLON.Animation(
        "killerRotAnim",
        "rotation.y",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      // Asegurar la rotación más corta si cruza el límite de PI/-PI
      let currentRotationY = this._rootMesh.rotation.y;
      if (Math.abs(targetRotationY - currentRotationY) > Math.PI) {
        if (targetRotationY > currentRotationY) {
          currentRotationY -= 2 * Math.PI;
        } else {
          targetRotationY += 2 * Math.PI;
        }
      }

      rotationAnimation.setKeys([
        { frame: 0, value: currentRotationY },
        { frame: 60 * animationDuration / 2, value: targetRotationY }, // Rotar más rápido a mitad de camino
        { frame: 60 * animationDuration, value: targetRotationY }     // Mantener rotación al final
      ]);
      rotationAnimation.setEasingFunction(new BABYLON.SineEase());


      // Detener animaciones de movimiento/rotación anteriores y aplicarlas
      scene.stopAnimation(this._rootMesh, "killerPosAnim");
      scene.stopAnimation(this._rootMesh, "killerRotAnim");
      scene.beginDirectAnimation(this._rootMesh, [positionAnimation, rotationAnimation], 0, 60 * animationDuration, false);

      goingRight = !goingRight; // Cambiar dirección para la próxima vez
    };

    // Iniciar el movimiento inmediatamente y luego repetirlo cada 'totalLoopTime' segundos
    animateKillerMovement(); // Primer movimiento
    this._patrolInterval = setInterval(animateKillerMovement, totalLoopTime * 1000); // Repetir cada 'totalLoopTime' segundos
    console.log(`🚶 Killer iniciando patrullaje en X (movimiento cada ${totalLoopTime}s).`);
  },

  /**
   * Detiene el patrullaje horizontal periódico.
   */
  stopPatrolX() {
    if (this._patrolInterval) {
      clearInterval(this._patrolInterval);
      this._patrolInterval = null;
      this.stopAnimation(); // Detener también la animación del modelo GLTF
      console.log("⏹️ Patrullaje X detenido.");
    }
  },

  /**
   * Se llama cuando la pestaña se oculta para pausar el patrullaje.
   */
  pausePatrolOnHidden() {
    if (this._patrolInterval) {
      clearInterval(this._patrolInterval);
      this._patrolInterval = null;
      this.stopAnimation(); // Pausar la animación del modelo GLTF
      console.log("⏸️ Patrullaje X pausado debido a pestaña oculta.");
    }
  },

  /**
   * Se llama cuando la pestaña vuelve a ser visible para reanudar el patrullaje.
   */
  resumePatrolOnVisible() {
    if (!this._patrolInterval && this._rootMesh) {
      // Reiniciar el patrullaje con los parámetros por defecto
      // Podrías guardar los parámetros anteriores si necesitaras más flexibilidad
      this.startPatrolX();
      console.log("▶️ Patrullaje X reanudado.");
    }
  }
};

export default KillerAnimator;