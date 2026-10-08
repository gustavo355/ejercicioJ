# Prompts · La última pupusa
## P1 · Arranque (las reglas)

(Creá el archivo src/logica.ts con las reglas de LA ÚLTIMA PUPUSA,
según la ficha de abajo.

REGLAS TÉCNICAS, obligatorias
- TypeScript. Exportá los tipos y el objeto CONFIG con todos los números
  juntos arriba, cada uno con un comentario que diga su unidad.
- Este archivo NO puede tocar la pantalla: nada de document, window, alert ni
  console.log. Solo datos y funciones sobre el estado.
- Cada función que cambia el estado devuelve true si la acción fue válida y
  false si no se pudo hacer.
- Si hace falta azar, usá un generador con semilla y exportalo, para que la
  misma semilla dé siempre el mismo resultado.
- Código y comentarios en español.

REGLAS DE TRABAJO
- Hacé exactamente lo que dice la ficha. Nada más.
- Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
- Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha
  no decía nada.

FICHA:
NOMBRE DEL PROYECTO: La última pupusa
EN UNA FRASE: Un juego de turnos contra la máquina: quedan pupusas en el plato,
cada quien agarra una, dos o tres, y el que agarra la última pierde.
PARA QUIÉN ES: Para Marlon, 15 años, que juega esto en el recreo con sus amigos
y cree que ganar es pura suerte.
QUÉ LOGRA: El objetivo es obligar a la máquina a agarrar la última pupusa.
Quien descubre la fórmula gana siempre.
LOS TRES VERBOS: 1. Agarrar una pupusa. 2. Agarrar dos pupusas.
3. Agarrar tres pupusas.
TERMINA BIEN SI…: La máquina se ve obligada a agarrar la última pupusa.
TERMINA MAL SI…: Yo agarro la última pupusa. Si intento agarrar más pupusas de
las que quedan, el juego no lo permite y me avisa cuántas quedan.
QUÉ SE VE EN PANTALLA: Las pupusas que quedan en el plato (dibujadas con
formas simples), de quién es el turno, el último movimiento de la máquina, el
selector de dificultad y el mensaje de resultado.
CONTROLES: Con el teclado: las teclas 1, 2 y 3 agarran esa cantidad, y R
reinicia. Con el dedo: tres botones grandes (Agarrar 1, Agarrar 2, Agarrar 3)
y un botón Reiniciar.
COLORES Y QUÉ SIGNIFICAN: Amarillo maíz = pupusa disponible. Rojo = peligro
(queda solo la última pupusa) o derrota. Verde = victoria. Fondo oscuro con
texto blanco. Sin imágenes ni librerías de fuera.
CRITERIO DE ACEPTACIÓN: Abro el juego, elijo la dificultad Difícil y veo 15
pupusas con mi turno. Agarro 2 y quedan 13. La máquina agarra 1 y quedan 12.
Agarro 3 y quedan 9, y sigo completando cada ronda hasta sumar 4 con la
máquina. Quedan 1, la máquina está obligada a agarrarla y aparece "¡Ganaste!"
en verde. Si en cambio yo agarro la última, aparece "Perdiste" en rojo, y
Reiniciar deja todo como al principio.
LO QUE NO VA: Sin dos jugadores humanos, sin sonidos, sin animaciones, sin
guardar puntajes, sin cantidades de pupusas que el jugador pueda elegir, sin
imágenes.
EXTRA: Dificultad Fácil (la máquina agarra una cantidad al azar, con semilla) y
Difícil (la máquina deja siempre la cantidad en la que quedan 1 más un múltiplo
de 4, si puede). Empiezo yo. Números en CONFIG: pupusas iniciales = 15, mínimo
por turno = 1, máximo por turno = 3, pausa de la máquina = 600 milisegundos,
semilla inicial.)

**Qué hizo el agente:** creó src/logica.ts con CONFIG y las funciones. Preguntó el valor de la semilla y respondí 12345.
