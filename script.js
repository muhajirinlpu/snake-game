const PRIMARY_COLOR = '#fad2e3', SECONDARY_COLOR = '#a61d24'
  WIDTH = 700, HEIGHT = 700,
  SPEED = 5,
  DIRECTION_UP = 'up', DIRECTION_DOWN = 'down', DIRECTION_LEFT = 'left', DIRECTION_RIGHT = 'right'

const canvas = document.getElementById('game'),
  context = canvas.getContext('2d')

const state = {
  direction: DIRECTION_RIGHT
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
    // move bodyPart through their direction
    for (const bodyPart of this.body) {
      switch (bodyPart.direction) {
        case DIRECTION_UP: bodyPart.y -= SPEED; break
        case DIRECTION_DOWN: bodyPart.y += SPEED; break
        case DIRECTION_LEFT: bodyPart.x -= SPEED; break
        case DIRECTION_RIGHT: bodyPart.x += SPEED; break
      }
    }
    // direction process
    for (let i = this.body.length - 1; i > -1; i--) {
      const bodyPart = this.body[i]
      if (i === 0 && state.direction !== null) {
        bodyPart.direction = state.direction
      } else if (i !== 0 && bodyPart.direction !== this.body[i - 1].direction &&
        (this.body[i - 1].x === bodyPart.x || this.body[i - 1].y === bodyPart.y)) {
        bodyPart.direction = this.body[i - 1].direction
      }
    }
  }

  draw () {
    context.clearRect(0, 0, WIDTH, HEIGHT)

    // draw snakes
    context.fillStyle = SECONDARY_COLOR
    for (const { x, y, w, h } of this.body) {
      context.fillRect(x, y, w, h)
      context.fillStyle = PRIMARY_COLOR
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
  if ((e.code === 'ArrowUp' || e.code === 'KeyW') && state.direction !== DIRECTION_DOWN) {
    state.direction = DIRECTION_UP
  } else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && state.direction !== DIRECTION_UP) {
    state.direction = DIRECTION_DOWN
  } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && state.direction !== DIRECTION_RIGHT) {
    state.direction = DIRECTION_LEFT
  } else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && state.direction !== DIRECTION_LEFT) {
    state.direction = DIRECTION_RIGHT
  }
}

// start loop
const loop = () => {
  game.compute()
  game.draw()

  if (game.continue) requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
