// src/characters/animations/KillerAnimator.js

const KillerAnimator = {
  _scene: null,
  _camera: null,
  _characterRoot: null, // El nodo padre que se moverá y rotará
  _stoppedMesh: null,
  _walkingMesh: null,
  _walkingAnimGroup: null,
  _inputMap: {},
  _isMoving: false,
  _moveSpeed: 1.0, // ¡Variable de velocidad!
  _lerpSpeed: 10.0, // Velocidad de suavizado de la rotación
  _isWalkingModelLoaded: false, // Nuevo flag para saber si el modelo está listo

  /**
   * Inicializa el controlador del personaje.
   * @param {BABYLON.Scene} scene - La escena principal.
   * @param {BABYLON.ArcRotateCamera} camera - La cámara que sigue al jugador.
   * @param {BABYLON.TransformNode} stoppedMesh - La malla "idle" ya cargada.
   */
  init(scene, camera, stoppedMesh) {
    this._scene = scene;
    this._camera = camera;
    this._stoppedMesh = stoppedMesh;

    // --- LÓGICA DE NODO RAÍZ ---
    this._characterRoot = new BABYLON.TransformNode("characterRoot", scene);
    this._characterRoot.position = this._stoppedMesh.position.clone();
    this._characterRoot.rotation = this._stoppedMesh.rotation.clone();
    this._stoppedMesh.parent = this._characterRoot;
    this._stoppedMesh.position = BABYLON.Vector3.Zero();

    // =================================================================
    // === INICIO DE LA CORRECCIÓN (¡AQUÍ ESTÁ!) ===
    // =================================================================
    // Giramos el modelo 'stopped' 180 grados (PI radianes) para que
    // su "frente" coincida con el "frente" del modelo 'walking'.
    this._stoppedMesh.rotation.y = Math.PI;
    // =================================================================
    // === FIN DE LA CORRECCIÓN ===
    // =================================================================

    // --- NO USAR COLISIONES DE BABYLON (causan congelamiento) ---
    // En su lugar, usaremos verificación manual de límites en update()

    // Cargar el modelo de caminar
    this._loadWalkingModel();

    // Configurar los listeners de teclado
    this._setupInputListeners();

    console.log("🎮 KillerAnimator (Controlador de Personaje) inicializado.");
  },

  /**
   * Carga de forma asíncrona el modelo de caminar y lo prepara.
   */
  async _loadWalkingModel() {
    console.log("🏃‍♂️ Cargando modelo 'walking' del asesino...");
    try {
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        "assets/models/killer/",
        "killer_walking.glb",
        this._scene
      );

      this._walkingMesh = result.meshes[0];
      this._walkingMesh.name = "killer_root_walking";

      // --- LÓGICA DE NODO RAÍZ ---
      this._walkingMesh.parent = this._characterRoot;
      this._walkingMesh.position = BABYLON.Vector3.Zero();
      this._walkingMesh.rotation = BABYLON.Vector3.Zero(); // Este ya mira bien
      this._walkingMesh.setEnabled(false);

      // Guardar su animación
      this._walkingAnimGroup = result.animationGroups[0];
      if (this._walkingAnimGroup) {
        this._walkingAnimGroup.stop();
      }

      // Añadir sombras
      const shadowLight = this._scene.getLightByName("dirLight");
      if (shadowLight) {
        const shadowGen = shadowLight.getShadowGenerator();
        if (shadowGen) {
          result.meshes.forEach(mesh => {
            shadowGen.addShadowCaster(mesh);
          });
        }
      }

      console.log("✅ Modelo 'walking' cargado y emparentado.");

      // Marcar que el modelo está cargado
      this._isWalkingModelLoaded = true;

    } catch (error) {
      console.error("❌ Error al cargar el modelo del asesino (walking):", error);
    }
  },

  /**
   * Configura los eventos de teclado para WASD.
   */
  _setupInputListeners() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        this._inputMap[key] = true;
        this._updateMovementState();
      }
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (key === 'a' || key === 's' || key === 'd' || key === 'w') {
        this._inputMap[key] = false;
        this._updateMovementState();
      }
    });
  },

  /**
   * Comprueba el estado del inputMap y decide si el personaje debe caminar o detenerse.
   */
  _updateMovementState() {
    const isAnyKeyPressed = this._inputMap['w'] || this._inputMap['a'] || this._inputMap['s'] || this._inputMap['d'];

    if (isAnyKeyPressed && !this._isMoving) {
      this._startWalking();
    } else if (!isAnyKeyPressed && this._isMoving) {
      this._stopWalking();
    }
  },

  /**
   * Cambia al estado de "Caminar".
   */
  _startWalking() {
    // Verificar que el modelo de caminar esté cargado
    if (!this._isWalkingModelLoaded) {
      console.warn("⚠️ Modelo de caminar aún no está cargado, esperando...");
      return;
    }

    if (!this._walkingMesh || !this._stoppedMesh) return;

    this._isMoving = true;
    this._stoppedMesh.setEnabled(false);
    this._walkingMesh.setEnabled(true);

    if (this._walkingAnimGroup) {
      this._walkingAnimGroup.start(true);
    }

    console.log("🏃 Iniciando animación de caminar");
  },

  /**
   * Cambia al estado de "Detenido".
   */
  _stopWalking() {
    if (!this._walkingMesh || !this._stoppedMesh) return;

    this._isMoving = false;
    this._stoppedMesh.setEnabled(true);
    this._walkingMesh.setEnabled(false);

    if (this._walkingAnimGroup) {
      this._walkingAnimGroup.stop();
    }
  },

  /**
   * Se llama en CADA frame desde el bucle de renderizado de main.js.
   * @param {number} deltaTime - Tiempo (en segundos) desde el último frame.
   */
  update(deltaTime) {
    // Retornar si no está en movimiento o si falta algún componente
    if (!this._characterRoot) {
      return;
    }

    if (!this._isMoving || !this._isWalkingModelLoaded || !this._walkingMesh) {
      return;
    }

    // --- Lógica de Movimiento Relativo a la Cámara ---
    const cameraAway = this._camera.getDirection(BABYLON.Vector3.Backward());
    cameraAway.y = 0;
    cameraAway.normalize();

    const cameraRight = this._camera.getDirection(BABYLON.Vector3.Right());
    cameraRight.y = 0;
    cameraRight.normalize();

    // 2. Calcular el vector de movimiento basado en la entrada
    const moveDirection = BABYLON.Vector3.Zero();

    // Tu lógica de W/S invertida (que está BIEN para tu caso)
    if (this._inputMap['s']) {
      moveDirection.addInPlace(cameraAway);
    }
    if (this._inputMap['w']) {
      moveDirection.subtractInPlace(cameraAway);
    }
    if (this._inputMap['a']) {
      moveDirection.subtractInPlace(cameraRight);
    }
    if (this._inputMap['d']) {
      moveDirection.addInPlace(cameraRight);
    }

    if (moveDirection.lengthSquared() === 0) {
      return;
    }

    moveDirection.normalize();

    // 3. Aplicar movimiento con verificación de colisiones manual
    const moveDistance = this._moveSpeed * deltaTime;
    const displacement = moveDirection.scale(moveDistance);

    // Guardar la posición anterior por si hay que revertir
    const oldPosition = this._characterRoot.position.clone();

    // Aplicar el movimiento
    this._characterRoot.position.addInPlace(displacement);

    // Verificar colisión con las paredes de la habitación
    const pos = this._characterRoot.position;
    const margin = 0.5; // Margen de colisión
    const roomLimit = 4.7; // Límite del cuarto reducido (5.0 - 0.3 de margen)

    // Verificar colisión con paredes
    let hasCollision = false;
    if (pos.x < -roomLimit || pos.x > roomLimit || pos.z < -roomLimit || pos.z > roomLimit) {
      hasCollision = true;
    }

    // Verificar colisión con la mesa principal (donde está el cadáver)
    // Mesa en posición (0, 0.8, 0) con width=3, depth=1.5
    const tableMargin = 0.5;
    const tableHalfWidth = 1.5 + tableMargin;  // 3/2 + margen
    const tableHalfDepth = 0.75 + tableMargin; // 1.5/2 + margen

    if (pos.x > -tableHalfWidth && pos.x < tableHalfWidth &&
      pos.z > -tableHalfDepth && pos.z < tableHalfDepth) {
      hasCollision = true;
    }

    // Verificar colisión con el horno
    // Horno en posición (-3.5, 0.7, -3) con width=1.2, depth=0.8
    const ovenMargin = 0.5;
    const ovenCenterX = -3.5;
    const ovenCenterZ = -3.0;
    const ovenHalfWidth = 0.6 + ovenMargin;  // 1.2/2 + margen
    const ovenHalfDepth = 0.4 + ovenMargin;  // 0.8/2 + margen

    if (pos.x > ovenCenterX - ovenHalfWidth && pos.x < ovenCenterX + ovenHalfWidth &&
      pos.z > ovenCenterZ - ovenHalfDepth && pos.z < ovenCenterZ + ovenHalfDepth) {
      hasCollision = true;
    }

    // Si hay colisión, revertir a la posición anterior
    if (hasCollision) {
      this._characterRoot.position.copyFrom(oldPosition);
    }

    // 4. Aplicar rotación (hacer que el personaje mire hacia donde se mueve)
    // Tu lógica de 'atan2' con negativos (que está BIEN para tu caso)
    const targetRotation = Math.atan2(-moveDirection.x, -moveDirection.z);

    // Suavizado (Lerp) de la rotación
    let currentRotation = this._characterRoot.rotation.y;

    let angleDiff = targetRotation - currentRotation;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    const lerpFactor = this._lerpSpeed * deltaTime;
    this._characterRoot.rotation.y += angleDiff * lerpFactor;

  },

  /**
   * Pausa la entrada cuando la pestaña pierde el foco.
   */
  pauseAllInput() {
    this._inputMap = {};
    this._updateMovementState();
    console.log("⏸️ Entrada pausada.");
  }
};

export default KillerAnimator;