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


const rope: Position[][] = [
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
    const distance = dist(head, tail);

    if (headPath.length > tailPath.length && distance >= 2 && distance < 2.5) {
      tailPath.push(findClosestNeighbour(head, tail))
    } else if (distance >= 2.5) {
      tailPath.push(findAnyNeighbour(head, tail))
    }
  }
})

const dist = (pos1: Position, pos2: Position): number => {
  return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}

const findClosestNeighbour = (head: Position, tail: Position) => {
  const neighbours = [
    { x: head.x - 1, y: head.y },
    { x: head.x + 1, y: head.y },
    { x: head.x, y: head.y - 1 },
    { x: head.x, y: head.y + 1 }
  ]
  const closestNeighbour = neighbours.reduce((currentClosest, neighbour) => {
    const oldDistance = dist(currentClosest, tail)
    const distance = dist(neighbour, tail)
    if (distance < oldDistance) {
      currentClosest = neighbour
    }

    return currentClosest
  })

  return closestNeighbour
}


const findAnyNeighbour = (head: Position, tail: Position) => {
  const neighbours = [
    { x: head.x - 1, y: head.y },
    { x: head.x + 1, y: head.y },
    { x: head.x + 1, y: head.y + 1 },
    { x: head.x - 1, y: head.y - 1 },
    { x: head.x + 1, y: head.y - 1 },
    { x: head.x - 1, y: head.y + 1 },
    { x: head.x, y: head.y - 1 },
    { x: head.x, y: head.y + 1 }
  ]
  const closestNeighbour = neighbours.reduce((currentClosest, neighbour) => {
    const oldDistance = dist(currentClosest, tail)
    const distance = dist(neighbour, tail)
    if (distance < oldDistance) {
      currentClosest = neighbour
    }

    return currentClosest
  })

  return closestNeighbour
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
  ctx.translate(canvas.width / 2 - CHAR_SIZE, canvas.height / 2 - CHAR_SIZE)

  for (const p of headPath) {
    drawHeadVisited(p)
  }
  for (const t of tailPath) {
    drawTailVisited(t)
  }

  for (let i = 1; i < rope.length - 1; i++) {
    const pos = rope[i].slice(-1)[0]
    drawChar(`${i}`, pos, true)
  }

  drawTail(tail)
  drawHead(head)

  ctx.restore()

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
