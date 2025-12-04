// Gestión de objetos del juego (paquetes y zona de entrega)
class GameObjects {
  constructor(scene) {
    this.scene = scene;
    this.paquetes = [];
    this.zonaEntrega = null;
    this.suelo = null;

    // Arreglo con las posiciones de las calabazas
    this.posicionesPaquetes = [
      new BABYLON.Vector3(3, 0.3, 1),
      new BABYLON.Vector3(-3, 0.3, 2),
      new BABYLON.Vector3(5, 0.3, -2),
      new BABYLON.Vector3(0, 0.3, 4),
      new BABYLON.Vector3(-2, 0.3, -3)
    ];

    this.modeloBasePaquete = null;
  }

  async inicializar() {
    const path = "./assets/models/";

    // Cargar suelo
    this.suelo = await ModelLoader.cargarModelo(path, "low_poly_farm.glb", this.scene);
    if (this.suelo) {
      this.suelo.name = "suelo";
      this.suelo.position = new BABYLON.Vector3(-2, 0, 0);
      this.suelo.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
      this.suelo.rotation = new BABYLON.Vector3(0, 0, 0);
    }

    // Cargar el modelo de calabaza UNA VEZ
    console.log("Cargando modelo de calabaza...");
    this.modeloBasePaquete = await ModelLoader.cargarModelo(path, "pumpkin.glb", this.scene);

    if (this.modeloBasePaquete) {
      this.modeloBasePaquete.setEnabled(false);
      this.crearPaquetes();
    }

    // Cargar zona de entrega
    this.zonaEntrega = await ModelLoader.cargarModelo(path, "old_cart.glb", this.scene);
    if (this.zonaEntrega) {
      this.zonaEntrega.name = "zonaEntrega";
      this.zonaEntrega.position = new BABYLON.Vector3(-5, 0.01, -5);
      this.zonaEntrega.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
    }
  }

  crearPaquetes() {
    // Limpiar paquetes existentes
    this.paquetes.forEach(paquete => paquete.dispose());
    this.paquetes = [];

    // Crear 5 instancias clonando el modelo base
    console.log("Creando 5 calabazas...");
    for (let i = 0; i < this.posicionesPaquetes.length; i++) {
      const paquete = this.modeloBasePaquete.clone(`paquete_${i}`);
      paquete.position = this.posicionesPaquetes[i].clone();
      paquete.scaling = new BABYLON.Vector3(0.005, 0.005, 0.005);
      paquete.metadata = {
        enMano: false,
        entregado: false
      };
      paquete.setEnabled(true);
      this.paquetes.push(paquete);
    }

    console.log(`${this.paquetes.length} calabazas cargadas!`);
  }

  reiniciarPaquetes() {
    this.crearPaquetes();
  }

  getPaquetes() {
    return this.paquetes;
  }

  // Obtener el paquete más cercano al jugador (que no esté en mano)
  getPaqueteCercano(posicionJugador, distanciaMaxima = 2) {
    let paqueteCercano = null;
    let distanciaMinima = distanciaMaxima;

    for (let paquete of this.paquetes) {
      if (!paquete.metadata.enMano && !paquete.metadata.entregado && paquete.parent === null) {
        const distancia = BABYLON.Vector3.Distance(posicionJugador, paquete.position);
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          paqueteCercano = paquete;
        }
      }
    }

    return paqueteCercano;
  }

  getZonaEntrega() {
    return this.zonaEntrega;
  }
}
