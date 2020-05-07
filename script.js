const PRIMARY_COLOR = '#fad2e3',
  WIDTH = 700,
  HEIGHT = 700,
  SPEED = 5

const canvas = document.getElementById('game'),
  context = canvas.getContext('2d')

const state = {
  direction: null
}

const createBodyPart = ({ x = 0 , y = 0, w = 10, h = 10, direction }) => ({
  x, y, w, h, direction,
  isCollide: ({ x, y, w, h }) => {

  }
})

class Game {
  constructor () {
    this.body = []
    // this.foods = []

    // generate 5 body part of snakes
    for (let i = 5; i > 0; i--)
      this.body.push(createBodyPart({ x: 10 * i, y: 10, direction: 'right' }))
  }

  compute () {
    // move bodyPart
    for (let i = 0; i < this.body.length; i++) {
      const bodyPart = this.body[i]
      switch (bodyPart.direction) {
        case 'up':
          bodyPart.y -= SPEED
          break
        case 'down':
          bodyPart.y += SPEED
          break
        case 'left':
          bodyPart.x -= SPEED
          break
        case 'right':
          bodyPart.x += SPEED
          break
      }
    }
    // direction process
    for (let i = this.body.length - 1; i > -1; i--) {
      const bodyPart = this.body[i]
      if (i === 0 && state.direction !== null) {
        bodyPart.direction = state.direction
        state.direction = null
      } else if (i !== 0 && bodyPart.direction !== this.body[i - 1].direction &&
        (this.body[i - 1].x === bodyPart.x || this.body[i - 1].y === bodyPart.y)) {
        bodyPart.direction = this.body[i - 1].direction
      }
    }
  }

  draw () {
    context.clearRect(0, 0, WIDTH, HEIGHT)

    // draw snakes
    for (const { x, y, w, h } of this.body) {
      context.fillStyle = PRIMARY_COLOR
      context.fillRect(x, y, w, h)
    }
  }

  get continue () {
    const isSnakeHeadNotCollideWithTheWall = () => {
      const snakeHead = this.body[0]
      return snakeHead.x + snakeHead.w <= WIDTH && snakeHead.y + snakeHead.h <= HEIGHT &&
        snakeHead.x > 0 && snakeHead.y > 0
    }

    return isSnakeHeadNotCollideWithTheWall()
  }
}

const game = new Game()

window.onkeydown = e => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') {
    state.direction = 'up'
  } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
    state.direction = 'down'
  } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    state.direction = 'left'
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    state.direction = 'right'
  }
}

// start loop
const loop = () => {
  game.compute()
  game.draw()

  if (game.continue) requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
