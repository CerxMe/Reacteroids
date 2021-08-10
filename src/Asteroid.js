import Particle from './Particle'
import { asteroidVertices, randomNumBetween } from './helpers'

export default class Asteroid {
  constructor (args) {
    this.position = args.position
  /*  this.velocity = {
      x: randomNumBetween(-1.5, 1.5),
      y: randomNumBetween(-1.5, 1.5)
    } */
    this.velocity = args.velocity
    this.rotation = 0
    this.rotationSpeed = randomNumBetween(-0.4, 0.4)
    this.radius = args.size
    this.score = (10 * this.radius) * 5
    this.create = args.create
    this.addScore = args.addScore
    this.vertices = asteroidVertices(args.size / 16 * 8, args.size)
    this.gametype = args.gametype
    this.name = 'Asteroid'
    this.stage = 5
    this.delete = false
  }
  /* constructor (args) {
    this.asteroid = args
    this.asteroid.velocity = { x: 0, y: 0 }
    this.asteroid.rotation = 0
    this.asteroid.rotationSpeed = randomNumBetween(-0.5, 0.5)
    this.asteroid.radius = args.size
    this.asteroid.score = (1000 / this.radius) * 5
    this.asteroid.create = args.create
    this.asteroid.addScore = args.addScore
    this.asteroid.vertices = asteroidVertices(args.size/16*8, args.size)
  } */
  split () {

  }
  destroy () {
    this.addScore(this.score)
    // Explode
    for (let i = 0; i < 30; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(60, 100),
        size: randomNumBetween(1, 4),
        position: {
          x: this.position.x + randomNumBetween(-this.radius / 2 , this.radius / 2),
          y: this.position.y + randomNumBetween(-this.radius / 2 , this.radius / 2)
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
        },
        color: '#fff'
      })
      this.create(particle, 'particles')
    }

    // kill enemy
    if(this.gametype === 'Debree'){
      this.delete = true
      this.maxHealth -= 1
    }

    // decrease boss health
    if (this.gametype === 'Boss') {
      const shrinkPower = 10
      const size = this.radius - shrinkPower
      this.radius = size
      // redraw asteroid
      this.vertices = asteroidVertices(30, size)
    }

    // Spawn enemies on boss hit.
    if (this.gametype !== 'Boss' && (this.radius > 10 && this.gametype === 'Debree')) {

      // decrease health
      const newSize = randomNumBetween(this.radius / 2, this.radius)

      if(this.maxHealth - 1) {
        for ( let i = 0; i < randomNumBetween(1, 3); i++ ) {
          let asteroid = new Asteroid({
            velocity: {
              x: randomNumBetween(-1.9, 1.9),
              y: randomNumBetween(-1.9, 1.9)
            },
            size: newSize > 50 ? newSize : 10,
            position: {
              x: randomNumBetween(-10, 20) + this.position.x,
              y: randomNumBetween(-10, 20) + this.position.y
            },
            maxHealth: newSize > 50 ? this.maxHealth : 1,
            create: this.create.bind(this),
            addScore: this.addScore.bind(this),
            gametype: 'Debree'
          })
          this.create(asteroid, 'asteroids')
        }
      }
    }
  }
  render (state) {
    // Move
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // Rotation
    this.rotation += this.rotationSpeed
    if (this.rotation >= 360) {
      this.rotation -= 360
    }
    if (this.rotation < 0) {
      this.rotation += 360
    }

    // Screen edges
    if (this.position.x > state.screen.width + this.radius) this.position.x = -this.radius
    else if (this.position.x < -this.radius) this.position.x = state.screen.width + this.radius
    if (this.position.y > state.screen.height + this.radius) this.position.y = -this.radius
    else if (this.position.y < -this.radius) this.position.y = state.screen.height + this.radius

    // Draw
    const context = state.context
    context.save()
    context.translate(this.position.x, this.position.y)
    context.rotate(this.rotation * Math.PI / 180)
    context.strokeStyle = '#FFF'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(0, -this.radius)
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x, this.vertices[i].y)
    }
    context.closePath()
    context.stroke()
    context.restore()
  }
}
