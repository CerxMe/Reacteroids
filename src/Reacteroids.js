import React, { Component } from 'react'
import Ship from './Ship'
import Asteroid from './Asteroid'
import { randomNumBetweenExcluding } from './helpers'
import hitReg from './hitReg'

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32,
  S: 83,
  DOWN: 40
}

export class Reacteroids extends Component {
  constructor () {
    super()
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0
      },
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      gameWon: false,
      asteroids: []
    }
    this.ship = []
    this.asteroids = []
    this.bullets = []
    this.particles = []
  }

  handleResize (value, e) {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1
      }
    })
  }

  handleKeys (value, e) {
    let keys = this.state.keys
    if (e.keyCode === KEY.DOWN || e.keyCode === KEY.S) keys.down = value
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value
    if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value
    if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value
    if (e.keyCode === KEY.SPACE) keys.space = value
    this.setState({
      keys: keys
    })
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeys.bind(this, false))
    window.addEventListener('keydown', this.handleKeys.bind(this, true))
    window.addEventListener('resize', this.handleResize.bind(this, false))

    const context = this.refs.canvas.getContext('2d')
    this.setState({ context: context })
    this.startGame()
    requestAnimationFrame(() => { this.update() })
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeys)
    window.removeEventListener('keydown', this.handleKeys)
    window.removeEventListener('resize', this.handleResize)
  }

  update () {
    const context = this.state.context

    context.save()
    context.scale(this.state.screen.ratio, this.state.screen.ratio)

    // Motion trail
    context.fillStyle = '#000' // BACKGROUND COLOR
    context.globalAlpha = 0.4
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height)
    context.globalAlpha = 1

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids)
    this.checkCollisionsWith(this.ship, this.asteroids)

    // Remove or render
    this.updateObjects(this.particles, 'particles')
    this.updateObjects(this.asteroids, 'asteroids')
    this.updateObjects(this.bullets, 'bullets')
    this.updateObjects(this.ship, 'ship')

    // Update asteroids
    this.setState({
      asteroids: this.asteroids.length
    })

    context.restore()

    // Next frame
    requestAnimationFrame(() => { this.update() })
  }

  addScore (points) {
    if (this.state.inGame) {
      this.setState({
        currentScore: this.state.currentScore + points
      })
    }
  }

  startGame () {
    this.setState({
      inGame: true,
      gameWon: false,
      currentScore: 0,
    })

    // Make ship

    let ship = new Ship({
      position: {
        x: randomNumBetweenExcluding(0, this.state.screen.width, this.state.screen.width / 2 - 160, this.state.screen.width / 2 + 160),
        y: randomNumBetweenExcluding(0, this.state.screen.height, this.state.screen.height / 2 - 160, this.state.screen.height / 2 + 160)
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this)
    }, this)
    this.createObject(ship, 'ship')

    // Make asteroids
    this.asteroids = []
    // this.generateAsteroids(this.state.asteroidCount)
    this.boss = this.startBoss()
  }

  startBoss(){
    // let them be summoned from the depths of hell
    this.generateAsteroid()

    // setTimeout(() => {
    //   boss.radius = 100
    //   boss.vertices = asteroidVertices(boss.radius / 16 * 8, boss.radius)
    // }, 100)
  }

  gameOver (gameState) {
    if(this.state.inGame) {
      this.setState({
        inGame: false,
        gameWon: gameState || false
      })
      // Replace top score
      if ( this.state.currentScore > this.state.topScore ) {
        this.setState({
          topScore: this.state.currentScore
        })
        localStorage['topscore'] = this.state.currentScore
      }
    }
  }
/*
  generateAsteroids (howMany) {
    let asteroids = []
    let ship = this.ship[0]
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 500,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x - 60, ship.position.x + 60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y - 60, ship.position.y + 60)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this)
      })
      this.createObject(asteroid, 'asteroids')
    }
  }
*/
  generateAsteroid () {
    let asteroid = new Asteroid({
      size: 200,
      velocity: {
        x: 0,
        y: 0
      },
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2
      },
      create: this.createObject.bind(this),
      addScore: this.addScore.bind(this),
      gametype: 'Boss',
      onDie: this.gameOver.bind(this)
    })
    this.createObject(asteroid, 'asteroids')
    return asteroid
  }

  createObject (item, group) {
    this[group].push(item)
  }

  updateObjects (items, group) {
    let index = 0
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1)
      } else {
        items[index].render(this.state)
      }
      index++
    }
  }

  checkCollisionsWith (items1, items2) {
    var a = items1.length - 1
    var b
    for (a; a > -1; --a) {
      b = items2.length - 1
      for (b; b > -1; --b) {
        var item1 = items1[a]
        var item2 = items2[b]
        if (this.checkCollision(item1, item2)) {
          const bulletpos = new hitReg(item1, item2, {create: this.createObject.bind(this),
            addScore: this.addScore.bind(this)}).default()
          item1.destroy() // kill bullet
          item2.destroy(bulletpos) // kill asteroid
        }
      }
    }
  }

  checkCollision (obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x
    var vy = obj1.position.y - obj2.position.y
    var length = Math.sqrt(vx * vx + vy * vy)
    if (length < obj1.radius + obj2.radius) {
      return true
    }
    return false
  }

  render () {
    let endgame
    let message

    if (this.state.currentScore <= 0) {
      message = '0 points...'
    } else if (this.state.currentScore >= this.state.topScore) {
      message = 'Top score with ' + this.state.currentScore + ' points. Woo!'
    } else {
      message = this.state.currentScore + ' points.'
    }

    if (!this.state.inGame) {
      endgame = (
        <div className='endgame'>
          <p>Game over.</p>
          <p>{message}</p>
          <button
            onClick={this.startGame.bind(this)}>
            try again?
          </button>
        </div>
      )
    }
    if (!this.state.inGame && this.state.gameWon) {
      endgame = (
        <div className='endgame'>
          <p>You win!</p>
          <p>{message}</p>
          <button
            onClick={this.startGame.bind(this)}>
            play again?
          </button>
        </div>
      )
    }


//        <DebugScreen asteroids={this.asteroids} bullets={this.bullets}/>
    return (
      <div>
        { endgame }
        <span className='score current-score' >Score: {this.state.currentScore}</span>
        <span className='controls' >
          Use [A][W][D] or [←][↑][→] to MOVE <br />
          Use [S] or [↓] to HALT<br />
          Use [SPACE] to SHOOT
        </span>

        <canvas ref='canvas'
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    )
  }
}
