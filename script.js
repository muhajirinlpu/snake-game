const PRIMARY_COLOR = '#fad2e3', SECONDARY_COLOR = '#a61d24'
  WIDTH = 700, HEIGHT = 700,
  SPEED = 0.5,
  DIRECTION_UP = 'up', DIRECTION_DOWN = 'down', DIRECTION_LEFT = 'left', DIRECTION_RIGHT = 'right'

const canvas = document.getElementById('game'),
  context = canvas.getContext('2d')

const state = {
  direction: DIRECTION_RIGHT
}

class Body {
  constructor({x = 0, y = 0, w = 10, h = 10, direction}) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.direction = direction
  }

  isCollide (those) {
    return this.x < those.x + those.w && this.x + this.w > those.x &&
      this.y < those.y + those.h && this.y + this.h > those.y
  }
}

class Food {
  static initRandom () {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    return new Food({
      x: getRandomInt(20, WIDTH - 20),
      y: getRandomInt(20, HEIGHT - 20)
    })
  }

  constructor ({ x = 20, y = 20, w = 10, h = 10 }) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
}

class Game {
  constructor () {
    this.snake = []
    this.foods = []

    // generate 5 snake part of snakes
    for (let i = 5; i > 0; i--)
      this.snake.push(new Body({ x: 10 * i, y: 10, direction: 'right' }))
  }

  compute () {
    // ### SNAKE ZONE
    // move bodyPart through their direction
    for (const bodyPart of this.snake) {
      switch (bodyPart.direction) {
        case DIRECTION_UP: bodyPart.y -= SPEED; break
        case DIRECTION_DOWN: bodyPart.y += SPEED; break
        case DIRECTION_LEFT: bodyPart.x -= SPEED; break
        case DIRECTION_RIGHT: bodyPart.x += SPEED; break
      }
    }
    // direction process
    for (let i = this.snake.length - 1; i > -1; i--) {
      const bodyPart = this.snake[i]
      if (i === 0 && state.direction !== null) {
        bodyPart.direction = state.direction
      } else if (i !== 0 && bodyPart.direction !== this.snake[i - 1].direction &&
        (this.snake[i - 1].x === bodyPart.x || this.snake[i - 1].y === bodyPart.y)) {
        bodyPart.direction = this.snake[i - 1].direction
      }
    }

    // ### FOODS ZONE
    // check if snake collide with food

    // generate foods
    if (this.foods.length < 2) {
      let food = null
      while (food === null) {
        food = Food.initRandom()
        for (const snakeBody of this.snake) {
          if (snakeBody.isCollide(food)) {
            food = null
          }
        }
      }
      this.foods.push(food)
    }
  }

  draw () {
    context.clearRect(0, 0, WIDTH, HEIGHT)

    // draw snakes
    context.fillStyle = SECONDARY_COLOR
    for (const { x, y, w, h } of this.snake) {
      context.fillRect(x, y, w, h)
      context.fillStyle = PRIMARY_COLOR
    }

    context.fillStyle = SECONDARY_COLOR
    for (const { x, y, w, h } of this.foods) {
      context.fillRect(x, y, w, h)
    }
  }

  get continue () {
    const isSnakeHeadDoesNotCollidedWithTheWall = () => {
      const snakeHead = this.snake[0]
      return snakeHead.x + snakeHead.w <= WIDTH && snakeHead.y + snakeHead.h <= HEIGHT &&
        snakeHead.x > 0 && snakeHead.y > 0
    }

    const isSnakeHeadDoesNotCollidedWithTail = () => {
      const snakeHead = this.snake[0]
      for (let i = 2; i < this.snake.length; i++) {
        const snakeTail = this.snake[i]
        if (snakeHead.isCollide(snakeTail))
          return false
      }
      return true
    }

    return isSnakeHeadDoesNotCollidedWithTheWall() && isSnakeHeadDoesNotCollidedWithTail()
  }
}

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

const game = new Game()

// start loop
const loop = () => {
  game.compute()
  game.draw()

  if (game.continue) requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
