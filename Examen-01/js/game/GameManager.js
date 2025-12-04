// Gestión del estado del juego, temporizador y contador
class GameManager {
  constructor() {
    this.tiempoTotal = 60; // 60 segundos
    this.tiempoRestante = this.tiempoTotal;
    this.calabazasRecogidas = 0;
    this.calabazasTotales = 5;
    this.juegoActivo = false;
    this.juegoCompletado = false;
    this.timerInterval = null;

    // Referencias a elementos del DOM
    this.timerElement = document.getElementById('timer');
    this.counterElement = document.getElementById('counter');
    this.messageOverlay = document.getElementById('messageOverlay');
    this.messageText = document.getElementById('messageText');
    this.resetButton = document.getElementById('resetButton');

    // Referencia al GameScene (se asignará después)
    this.gameScene = null;

    this.configurarEventos();
  }

  configurarEventos() {
    this.resetButton.addEventListener('click', () => this.reiniciarJuego());
  }

  setGameScene(gameScene) {
    this.gameScene = gameScene;
  }

  iniciarJuego() {
    this.juegoActivo = true;
    this.juegoCompletado = false;
    this.tiempoRestante = this.tiempoTotal;
    this.calabazasRecogidas = 0;

    this.actualizarUI();
    this.ocultarMensaje();

    // Iniciar temporizador
    this.timerInterval = setInterval(() => {
      if (this.juegoActivo) {
        this.tiempoRestante--;
        this.actualizarTimer();

        if (this.tiempoRestante <= 0) {
          this.terminarJuego(false);
        }
      }
    }, 1000);
  }

  actualizarTimer() {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    const tiempoFormateado = `${minutos}:${segundos.toString().padStart(2, '0')}`;

    this.timerElement.textContent = `⏱️ ${tiempoFormateado}`;

    // Advertencia visual cuando quedan menos de 10 segundos
    if (this.tiempoRestante <= 10) {
      this.timerElement.classList.add('timer-warning');
    } else {
      this.timerElement.classList.remove('timer-warning');
    }
  }

  calabazaRecogida() {
    if (!this.juegoActivo) return;

    this.calabazasRecogidas++;
    this.actualizarContador();

    // Verificar si el juego se completó
    if (this.calabazasRecogidas >= this.calabazasTotales) {
      this.terminarJuego(true);
    }
  }

  actualizarContador() {
    this.counterElement.textContent = `🎃 ${this.calabazasRecogidas}/${this.calabazasTotales}`;
  }

  actualizarUI() {
    this.actualizarTimer();
    this.actualizarContador();
  }

  terminarJuego(completado) {
    this.juegoActivo = false;
    this.juegoCompletado = completado;

    // Detener el temporizador
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Mostrar mensaje apropiado
    if (completado) {
      this.mostrarMensaje('¡JUEGO COMPLETADO! 🎉');
    } else {
      this.mostrarMensaje('TIEMPO AGOTADO ⏰');
    }
  }

  mostrarMensaje(texto) {
    this.messageText.textContent = texto;
    this.messageOverlay.classList.add('show');
  }

  ocultarMensaje() {
    this.messageOverlay.classList.remove('show');
  }

  reiniciarJuego() {
    // Detener temporizador si existe
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Reiniciar valores
    this.tiempoRestante = this.tiempoTotal;
    this.calabazasRecogidas = 0;
    this.juegoActivo = false;
    this.juegoCompletado = false;

    this.ocultarMensaje();
    this.timerElement.classList.remove('timer-warning');

    // Reiniciar la escena si existe
    if (this.gameScene) {
      this.gameScene.reiniciar();
    }

    // Iniciar nuevo juego
    this.iniciarJuego();
  }
}
