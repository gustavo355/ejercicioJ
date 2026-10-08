export const CONFIG = {
  pupusasIniciales: 15, // unidad: pupusas
  minimoPorTurno: 1, // unidad: pupusas por turno
  maximoPorTurno: 3, // unidad: pupusas por turno
  pausaMaquinaMs: 600, // unidad: milisegundos
  semillaInicial: 12345, // unidad: valor sin unidad (semilla)
  moduloGenerador: 2147483647, // unidad: valor sin unidad (parámetro del generador)
  multiplicadorGenerador: 16807, // unidad: valor sin unidad (parámetro del generador)
} as const

export type Dificultad = 'facil' | 'dificil'
export type Turno = 'jugador' | 'maquina' | null
export type ResultadoPartida = 'ganaste' | 'perdiste' | null

export interface EstadoJuego {
  pupusasRestantes: number
  turno: Turno
  dificultad: Dificultad
  ultimoMovimientoMaquina: number | null
  resultado: ResultadoPartida
  semillaInicial: number
  semilla: number
  aviso: string | null
}

export interface ResultadoAleatorio {
  valor: number
  semilla: number
}

export function siguienteAleatorio(semilla: number): ResultadoAleatorio {
  if (!Number.isFinite(semilla)) {
    throw new RangeError('La semilla debe ser un número finito.')
  }

  const moduloSemilla = CONFIG.moduloGenerador - 1
  let semillaActual = Math.trunc(semilla) % moduloSemilla
  if (semillaActual <= 0) semillaActual += moduloSemilla

  const nuevaSemilla =
    (semillaActual * CONFIG.multiplicadorGenerador) % CONFIG.moduloGenerador

  return {
    valor: (nuevaSemilla - 1) / (CONFIG.moduloGenerador - 2),
    semilla: nuevaSemilla,
  }
}

export function crearEstadoInicial(
  dificultad: Dificultad = 'facil',
  semilla: number = CONFIG.semillaInicial,
): EstadoJuego {
  return {
    pupusasRestantes: CONFIG.pupusasIniciales,
    turno: 'jugador',
    dificultad,
    ultimoMovimientoMaquina: null,
    resultado: null,
    semillaInicial: semilla,
    semilla,
    aviso: null,
  }
}

export function cambiarDificultad(
  estado: EstadoJuego,
  dificultad: Dificultad,
): boolean {
  if (dificultad !== 'facil' && dificultad !== 'dificil') return false
  estado.dificultad = dificultad
  return true
}

export function agarrarPupusas(
  estado: EstadoJuego,
  cantidad: number,
): boolean {
  if (estado.turno !== 'jugador' || estado.resultado !== null) return false

  if (Number.isInteger(cantidad) && cantidad > estado.pupusasRestantes) {
    estado.aviso = `Quedan ${estado.pupusasRestantes} pupusas.`
    return false
  }
  if (
    !Number.isInteger(cantidad) ||
    cantidad < CONFIG.minimoPorTurno ||
    cantidad > CONFIG.maximoPorTurno
  ) {
    return false
  }

  estado.pupusasRestantes -= cantidad
  estado.aviso = null
  if (estado.pupusasRestantes === 0) {
    estado.resultado = 'perdiste'
    estado.turno = null
  } else {
    estado.turno = 'maquina'
  }
  return true
}

export function tomarTurnoMaquina(estado: EstadoJuego): boolean {
  if (estado.turno !== 'maquina' || estado.resultado !== null) return false

  let cantidad: number
  if (estado.dificultad === 'dificil') {
    const resto = estado.pupusasRestantes % 4
    cantidad = resto !== 0
      ? resto
      : estado.pupusasRestantes >= CONFIG.maximoPorTurno
        ? CONFIG.maximoPorTurno
        : CONFIG.minimoPorTurno
  } else {
    const aleatorio = siguienteAleatorio(estado.semilla)
    estado.semilla = aleatorio.semilla
    cantidad =
      CONFIG.minimoPorTurno +
      Math.floor(
        aleatorio.valor *
          (CONFIG.maximoPorTurno - CONFIG.minimoPorTurno + 1),
      )
  }

  estado.pupusasRestantes -= cantidad
  estado.ultimoMovimientoMaquina = cantidad
  estado.aviso = null
  if (estado.pupusasRestantes === 0) {
    estado.resultado = 'ganaste'
    estado.turno = null
  } else {
    estado.turno = 'jugador'
  }
  return true
}

export function reiniciarJuego(estado: EstadoJuego): boolean {
  estado.pupusasRestantes = CONFIG.pupusasIniciales
  estado.turno = 'jugador'
  estado.ultimoMovimientoMaquina = null
  estado.resultado = null
  estado.semilla = estado.semillaInicial
  estado.aviso = null
  return true
}
