import './style.css'
const canvas: HTMLCanvasElement = document.querySelector('#canvas')!
const ctx = canvas.getContext('2d')!

canvas.width = 800
canvas.height = 600

const CHAR_SIZE = 20
type Position = { x: number, y: number }
const drawTail = (pos: Position) => {
  const x = pos.x * CHAR_SIZE
  const y = pos.y * CHAR_SIZE
  ctx.fillStyle = 'black'
  ctx.fillRect(x, y, CHAR_SIZE, -CHAR_SIZE)
  ctx.strokeStyle = '#aaa'
  ctx.strokeRect(x, y, CHAR_SIZE, -CHAR_SIZE)
  ctx.fillStyle = 'white'

  ctx.font = `${CHAR_SIZE}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('T', x + CHAR_SIZE / 2, y - CHAR_SIZE / 2)
}

const drawHead = (pos: Position) => {
  const x = pos.x * CHAR_SIZE
  const y = pos.y * CHAR_SIZE
  ctx.fillStyle = 'black'
  ctx.fillRect(x, y, CHAR_SIZE, -CHAR_SIZE)
  ctx.strokeStyle = '#aaa'
  ctx.strokeRect(x, y, CHAR_SIZE, -CHAR_SIZE)
  ctx.fillStyle = 'white'

  ctx.font = `${CHAR_SIZE}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('H', x + CHAR_SIZE / 2, y - CHAR_SIZE / 2)
}

const drawHeadVisited = (pos: Position) => {
  const x = pos.x * CHAR_SIZE
  const y = pos.y * CHAR_SIZE
  ctx.fillStyle = 'white'
  ctx.strokeStyle = '#aaa'

  ctx.font = `${CHAR_SIZE}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('\u00B7', x + CHAR_SIZE / 2, y - CHAR_SIZE / 2)
}
const drawTailVisited = (pos: Position) => {
  const x = pos.x * CHAR_SIZE
  const y = pos.y * CHAR_SIZE
  ctx.fillStyle = 'white'
  ctx.strokeStyle = '#aaa'

  ctx.font = `${CHAR_SIZE}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('#', x + CHAR_SIZE / 2, y - CHAR_SIZE / 2)
}


let head: Position = { x: 0, y: 0 }
let tail: Position = { x: 0, y: 0 }

const headPath: Position[] = [{ ...head }]
const tailPath: Position[] = [{ ...tail }]

window.addEventListener('keypress', evt => {
  switch (evt.key) {
    case "w":
      head.y -= 1
      headPath.push({ ...head })
      break;
    case "a":
      head.x -= 1
      headPath.push({ ...head })
      break;
    case "s":
      head.y += 1
      headPath.push({ ...head })
      break;
    case "d":
      head.x += 1
      headPath.push({ ...head })
      break;
  }
})

const dist = (pos1: Position, pos2: Position): number => {
  return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}


const draw = () => {
  if (headPath.length > tailPath.length && dist(head, tail) >= 2) {
    tailPath.push(headPath.slice(-2)[0])
    tail = tailPath.slice(-1)[0]
  }


  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.save()
  ctx.translate(0, canvas.height)

  for (const p of headPath) {
    drawHeadVisited(p)
  }
  for (const t of tailPath) {
    drawTailVisited(t)
  }
  drawTail(tail)
  drawHead(head)

  ctx.restore()

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
