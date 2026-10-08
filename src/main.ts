import './estilo.css'
import {
  CONFIG,
  agarrarPupusas,
  cambiarDificultad,
  crearEstadoInicial,
  reiniciarJuego,
  tomarTurnoMaquina,
} from './logica.ts'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('No se encontró el contenedor #app.')
const contenedor: HTMLDivElement = app

let estado = crearEstadoInicial()
let mostrarInicio = true
let temporizadorMaquina: number | null = null

function dibujarPlato(): string {
  const pupusas = Array.from(
    { length: estado.pupusasRestantes },
    () => '<span class="pupusa" aria-hidden="true"></span>',
  ).join('')

  return `<div class="plato" role="img" aria-label="Plato con ${estado.pupusasRestantes} pupusas">
    <div class="pupusas">${pupusas}</div>
  </div>`
}

function dibujarSelectorDificultad(): string {
  return `<label class="selector-dificultad" for="dificultad">
    Dificultad
    <select id="dificultad" name="dificultad">
      <option value="facil"${estado.dificultad === 'facil' ? ' selected' : ''}>Fácil</option>
      <option value="dificil"${estado.dificultad === 'dificil' ? ' selected' : ''}>Difícil</option>
    </select>
  </label>`
}

function dibujarUltimoMovimiento(): string {
  const movimiento =
    estado.ultimoMovimientoMaquina === null
      ? 'Todavía no jugó'
      : `agarró ${estado.ultimoMovimientoMaquina}`

  return `<p class="ultimo-movimiento" aria-live="polite">Último movimiento de la máquina: <strong>${movimiento}</strong></p>`
}

function dibujarControles(): string {
  const deshabilitados = estado.turno !== 'jugador' ? ' disabled' : ''
  return `<div class="controles" aria-label="Controles para agarrar pupusas">
    <button class="boton boton--accion" type="button" data-accion="agarrar" data-cantidad="1"${deshabilitados}>Agarrar 1</button>
    <button class="boton boton--accion" type="button" data-accion="agarrar" data-cantidad="2"${deshabilitados}>Agarrar 2</button>
    <button class="boton boton--accion" type="button" data-accion="agarrar" data-cantidad="3"${deshabilitados}>Agarrar 3</button>
  </div>
  <p class="ayuda-teclado">También podés usar las teclas 1, 2 y 3. R reinicia.</p>`
}

function dibujar(): void {
  const encabezado = `<header class="encabezado">
    <p class="sobrelinea">La última pupusa</p>
    <h1>¿Quién se queda con la última?</h1>
    ${dibujarSelectorDificultad()}
  </header>`

  let contenido: string
  if (mostrarInicio) {
    contenido = `<section class="panel panel--inicio" aria-labelledby="titulo-inicio">
      <h2 id="titulo-inicio">El plato está lleno</h2>
      <p>Elegí la dificultad y empezá. Quien agarre la última pupusa pierde.</p>
      ${dibujarPlato()}
      <p class="contador">Quedan <strong>${estado.pupusasRestantes}</strong> pupusas</p>
      <button class="boton boton--principal" type="button" data-accion="empezar">Empezar partida</button>
    </section>`
  } else if (estado.resultado !== null) {
    const gano = estado.resultado === 'ganaste'
    contenido = `<section class="panel panel--final" aria-labelledby="titulo-resultado">
      <p class="estado-final ${gano ? 'estado-final--victoria' : 'estado-final--derrota'}" id="titulo-resultado" aria-live="assertive">${gano ? '¡Ganaste!' : 'Perdiste'}</p>
      <p>${gano ? 'La máquina agarró la última pupusa.' : 'Agarraste la última pupusa.'}</p>
      ${dibujarPlato()}
      ${dibujarUltimoMovimiento()}
      <button class="boton boton--principal" type="button" data-accion="reiniciar">Reiniciar</button>
    </section>`
  } else {
    contenido = `<section class="panel panel--partida" aria-labelledby="titulo-partida">
      <h2 id="titulo-partida">${estado.turno === 'jugador' ? 'Tu turno' : 'Turno de la máquina'}</h2>
      ${dibujarPlato()}
      <p class="contador">Quedan <strong>${estado.pupusasRestantes}</strong> pupusas</p>
      ${dibujarUltimoMovimiento()}
      ${estado.aviso === null ? '' : `<p class="aviso" role="alert">${estado.aviso}</p>`}
      ${dibujarControles()}
      <button class="boton boton--secundario" type="button" data-accion="reiniciar">Reiniciar</button>
    </section>`
  }

  contenedor.innerHTML = `<main class="juego">${encabezado}${contenido}</main>`
}

function jugar(cantidad: number): void {
  const accionValida = agarrarPupusas(estado, cantidad)
  dibujar()

  if (accionValida && estado.turno === 'maquina') {
    temporizadorMaquina = window.setTimeout(() => {
      temporizadorMaquina = null
      tomarTurnoMaquina(estado)
      dibujar()
    }, CONFIG.pausaMaquinaMs)
  }
}

function reiniciar(): void {
  if (temporizadorMaquina !== null) {
    window.clearTimeout(temporizadorMaquina)
    temporizadorMaquina = null
  }
  reiniciarJuego(estado)
  mostrarInicio = true
  dibujar()
}

contenedor.addEventListener('click', (evento: MouseEvent) => {
  const objetivo = evento.target
  if (!(objetivo instanceof Element)) return
  const boton = objetivo.closest<HTMLButtonElement>('[data-accion]')
  if (!boton || !contenedor.contains(boton)) return

  if (boton.dataset.accion === 'empezar') {
    mostrarInicio = false
    dibujar()
  } else if (boton.dataset.accion === 'reiniciar') {
    reiniciar()
  } else if (boton.dataset.accion === 'agarrar') {
    jugar(Number(boton.dataset.cantidad))
  }
})

contenedor.addEventListener('change', (evento: Event) => {
  const objetivo = evento.target
  if (!(objetivo instanceof HTMLSelectElement) || objetivo.id !== 'dificultad') return
  const dificultad = objetivo.value
  if (dificultad === 'facil' || dificultad === 'dificil') {
    cambiarDificultad(estado, dificultad)
    dibujar()
  }
})

window.addEventListener('keydown', (evento: KeyboardEvent) => {
  if (evento.target instanceof HTMLSelectElement) return
  if (evento.key.toLowerCase() === 'r') {
    reiniciar()
  } else if (!mostrarInicio && ['1', '2', '3'].includes(evento.key)) {
    jugar(Number(evento.key))
  }
})

dibujar()
