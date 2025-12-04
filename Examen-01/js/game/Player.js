// Gestión del jugador y sus modelos
class Player {
  constructor(scene) {
    this.scene = scene;
    this.contenedor = null;
    this.modeloActual = null;
    this.modelos = {
      stopped: null,
      stoppedCarrying: null,
      walking: null,
      walkingCarrying: null
    };
    this.estaMoviendo = false;
    this.velocidad = 0.08;
  }

  async inicializar() {
    // Crear contenedor invisible
    this.contenedor = BABYLON.MeshBuilder.CreateBox("jugador", { size: 0.01 }, this.scene);
    this.contenedor.visibility = 0;
    this.contenedor.position.y = 0;

    // Cargar modelos
    console.log("Cargando modelos del jugador...");

    const path = "./assets/models/";
    this.modelos.stopped = await ModelLoader.cargarModelo(path, "farmer_stopped.glb", this.scene);
    this.modelos.stoppedCarrying = await ModelLoader.cargarModelo(path, "farmer_stopped-carrying.glb", this.scene);
    this.modelos.walking = await ModelLoader.cargarModelo(path, "farmer_walking.glb", this.scene);
    this.modelos.walkingCarrying = await ModelLoader.cargarModelo(path, "farmer_walking-carrying.glb", this.scene);

    // Asignar padre y desactivar todos
    Object.values(this.modelos).forEach(modelo => {
      if (modelo) {
        modelo.parent = this.contenedor;
        modelo.setEnabled(false);
      }
    });

    // Activar modelo inicial
    this.cambiarModelo('stopped');
    console.log("Modelos del jugador cargados!");
  }

  cambiarModelo(nuevoModelo) {
    if (this.modeloActual) {
      this.modeloActual.setEnabled(false);
    }
    this.modeloActual = this.modelos[nuevoModelo];
    if (this.modeloActual) {
      this.modeloActual.setEnabled(true);
    }
  }

  actualizarModelo(paqueteEnMano) {
    if (this.estaMoviendo && paqueteEnMano) {
      this.cambiarModelo('walkingCarrying');
    } else if (this.estaMoviendo && !paqueteEnMano) {
      this.cambiarModelo('walking');
    } else if (!this.estaMoviendo && paqueteEnMano) {
      this.cambiarModelo('stoppedCarrying');
    } else {
      this.cambiarModelo('stopped');
    }
  }

  mover(inputManager) {
    let moviendo = false;
    let direccion = new BABYLON.Vector3(0, 0, 0);

    if (inputManager.estaPresionada("w")) {
      this.contenedor.position.z += this.velocidad;
      direccion.z += 1;
      moviendo = true;
    }
    if (inputManager.estaPresionada("s")) {
      this.contenedor.position.z -= this.velocidad;
      direccion.z -= 1;
      moviendo = true;
    }
    if (inputManager.estaPresionada("a")) {
      this.contenedor.position.x -= this.velocidad;
      direccion.x -= 1;
      moviendo = true;
    }
    if (inputManager.estaPresionada("d")) {
      this.contenedor.position.x += this.velocidad;
      direccion.x += 1;
      moviendo = true;
    }

    // Actualizar rotación si se está moviendo
    if (moviendo && direccion.length() > 0) {
      let angulo = Math.atan2(direccion.x, direccion.z);
      this.contenedor.rotation.y = angulo;
    }

    return moviendo;
  }

  getPosition() {
    return this.contenedor.position;
  }
}
