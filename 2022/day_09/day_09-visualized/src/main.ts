import './style.css'
const canvas: HTMLCanvasElement = document.querySelector('#canvas')!
const ctx = canvas.getContext('2d')!

canvas.width = 800
canvas.height = 600

const CHAR_SIZE = 20
type Position = { x: number, y: number }

const drawChar = (char: string, pos: Position, withHighlight = false) => {
  const x = pos.x * CHAR_SIZE
  const y = pos.y * CHAR_SIZE

  if (withHighlight) {
    ctx.fillStyle = 'black'
    ctx.fillRect(x, y, CHAR_SIZE, -CHAR_SIZE)
    ctx.strokeStyle = '#aaa'
    ctx.strokeRect(x, y, CHAR_SIZE, -CHAR_SIZE)
  }

  ctx.fillStyle = 'white'
  ctx.font = `${CHAR_SIZE}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(char, x + CHAR_SIZE / 2, y - CHAR_SIZE / 2)
}

const drawTail = (pos: Position) => {
  drawChar('T', pos, true)
}

const drawHead = (pos: Position) => {
  drawChar('H', pos, true)
}

const drawHeadVisited = (pos: Position) => {
  drawChar('\u00B7', pos)
}
const drawTailVisited = (pos: Position) => {
  drawChar('#', pos)
}


const rope: [Position[], Position[], Position[], Position[], Position[], Position[], Position[], Position[], Position[], Position[],] = [
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
  [{ x: 0, y: 0 }],
]

window.addEventListener('keypress', evt => {
  const headPath = rope[0]
  const head = { ...headPath.slice(-1)[0] }
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

  for (let i = 1; i < rope.length; i++) {
    const headPath = rope[i - 1]
    const tailPath = rope[i]

    const head = headPath.slice(-1)[0]
    const tail = tailPath.slice(-1)[0]

    if (headPath.length > tailPath.length && dist(head, tail) >= 2) {
      tailPath.push(headPath.slice(-2)[0])
    }
  }
})

const dist = (pos1: Position, pos2: Position): number => {
  return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}


const draw = () => {
  const headPath = rope[0]
  const head = headPath.slice(-1)[0]
  const tailPath = rope[rope.length - 1]
  const tail = tailPath.slice(-1)[0]

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

  for (let i = 1; i < rope.length - 1; i++) {
    const pos = rope[i].slice(-1)[0]
    drawChar(`${i + 1}`, pos, true)
  }

  drawTail(tail)
  drawHead(head)

  ctx.restore()

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
