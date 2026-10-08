import { describe, expect, it } from 'vitest'
import {
  agarrarPupusas,
  crearEstadoInicial,
  tomarTurnoMaquina,
} from '../src/logica.ts'

describe('Reglas de La última pupusa', () => {
  it('arma el estado inicial con 15 pupusas y el turno del jugador', () => {
    expect(crearEstadoInicial()).toMatchObject({
      pupusasRestantes: 15,
      turno: 'jugador',
      resultado: null,
    })
  })

  it('permite agarrar una pupusa y pasa el turno a la máquina', () => {
    const estado = crearEstadoInicial()

    expect(agarrarPupusas(estado, 1)).toBe(true)
    expect(estado.pupusasRestantes).toBe(14)
    expect(estado.turno).toBe('maquina')
  })

  it('permite agarrar dos pupusas y pasa el turno a la máquina', () => {
    const estado = crearEstadoInicial()

    expect(agarrarPupusas(estado, 2)).toBe(true)
    expect(estado.pupusasRestantes).toBe(13)
    expect(estado.turno).toBe('maquina')
  })

  it('permite agarrar tres pupusas y pasa el turno a la máquina', () => {
    const estado = crearEstadoInicial()

    expect(agarrarPupusas(estado, 3)).toBe(true)
    expect(estado.pupusasRestantes).toBe(12)
    expect(estado.turno).toBe('maquina')
  })

  it('rechaza agarrar cero, cuatro o más pupusas de las que quedan', () => {
    const estado = crearEstadoInicial()

    expect(agarrarPupusas(estado, 0)).toBe(false)
    expect(agarrarPupusas(estado, 4)).toBe(false)

    estado.pupusasRestantes = 2
    expect(agarrarPupusas(estado, 3)).toBe(false)
    expect(estado.pupusasRestantes).toBe(2)
  })

  it('declara derrota si el jugador agarra la última pupusa', () => {
    const estado = crearEstadoInicial()
    estado.pupusasRestantes = 1

    expect(agarrarPupusas(estado, 1)).toBe(true)
    expect(estado.pupusasRestantes).toBe(0)
    expect(estado.resultado).toBe('perdiste')
    expect(estado.turno).toBeNull()
  })

  it('declara victoria si la máquina agarra la última pupusa', () => {
    const estado = crearEstadoInicial('dificil')
    estado.pupusasRestantes = 1
    estado.turno = 'maquina'

    expect(tomarTurnoMaquina(estado)).toBe(true)
    expect(estado.pupusasRestantes).toBe(0)
    expect(estado.resultado).toBe('ganaste')
    expect(estado.turno).toBeNull()
  })

  it('rechaza jugar cuando la partida ya terminó', () => {
    const estado = crearEstadoInicial()
    estado.pupusasRestantes = 1

    expect(agarrarPupusas(estado, 1)).toBe(true)
    expect(agarrarPupusas(estado, 1)).toBe(false)
    expect(tomarTurnoMaquina(estado)).toBe(false)
  })

  it.each([
    [13, 1, 12],
    [14, 2, 12],
    [15, 3, 12],
    [17, 1, 16],
    [18, 2, 16],
    [19, 3, 16],
  ])(
    'deja un múltiplo de cuatro cuando quedan %i pupusas',
    (inicial, jugada, final) => {
      const estado = crearEstadoInicial('dificil')
      estado.pupusasRestantes = inicial
      estado.turno = 'maquina'

      expect(tomarTurnoMaquina(estado)).toBe(true)
      expect(estado.ultimoMovimientoMaquina).toBe(jugada)
      expect(estado.pupusasRestantes).toBe(final)
    },
  )

  it('repite la jugada fácil cuando las partidas usan la misma semilla', () => {
    const primero = crearEstadoInicial('facil', 12345)
    const segundo = crearEstadoInicial('facil', 12345)

    expect(agarrarPupusas(primero, 2)).toBe(true)
    expect(agarrarPupusas(segundo, 2)).toBe(true)
    expect(tomarTurnoMaquina(primero)).toBe(true)
    expect(tomarTurnoMaquina(segundo)).toBe(true)
    expect(primero.ultimoMovimientoMaquina).toBe(segundo.ultimoMovimientoMaquina)
    expect(primero.pupusasRestantes).toBe(segundo.pupusasRestantes)
  })

  it('permite llegar al final bueno en Difícil después de que el jugador agarra dos', () => {
    const estado = crearEstadoInicial('dificil')

    expect(estado.turno).toBe('jugador')
    expect(agarrarPupusas(estado, 2)).toBe(true)
    expect(estado.pupusasRestantes).toBe(13)
    expect(tomarTurnoMaquina(estado)).toBe(true)
    expect(estado.pupusasRestantes).toBe(12)
    expect(estado.ultimoMovimientoMaquina).toBe(1)

    while (estado.resultado === null) {
      expect(agarrarPupusas(estado, 3)).toBe(true)
      expect(tomarTurnoMaquina(estado)).toBe(true)
    }

    expect(estado.pupusasRestantes).toBe(0)
    expect(estado.resultado).toBe('ganaste')
    expect(estado.ultimoMovimientoMaquina).toBe(1)
  })
})
