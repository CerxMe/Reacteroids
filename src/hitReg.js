import Particle from './Particle'
import { randomNumBetween, isNegative, asteroidVertices } from './helpers'
import React, { Component } from 'react'
import Asteroid from './Asteroid'

export default class hitReg extends Component {
  constructor (item1, item2, create) {
    super()
    this.game = create
    this.create = create.create
    this.addScore = create.addScore
    this.item1 = item1
    this.item2 = item2
    this.hitBox = 10
  }
  default () {
    if (this.item1.name === 'Bullet' && this.item2.name === 'Asteroid') {
      let bulletpos = this.item1.position

      // Hitreg explosion

      // big explosion particles flying all over the place
      const particleSpeed = this.item2.radius / 10  // TODO proper sizes of explosions
      for (let i = 0; i < 22; i++) {
        const bigParticle = new Particle({
          lifeSpan: randomNumBetween(3, 10),
          size: randomNumBetween(6, 4),
          position: {
            x: bulletpos.x,
            y: bulletpos.y
          },
          velocity: {
            x: randomNumBetween((particleSpeed*4) * -1, particleSpeed*4),
            y: randomNumBetween((particleSpeed*4) * -1, particleSpeed*4)
          },
          color: '#482728'
        })
        this.create(bigParticle, 'particles')

        const smallParticle = new Particle({
          lifeSpan: randomNumBetween(5, 16),
          size: randomNumBetween(1, 4),
          position: {
            x: bulletpos.x,
            y: bulletpos.y
          },
          velocity: {
            x: randomNumBetween((particleSpeed*2) * -1, particleSpeed*2),
            y: randomNumBetween((particleSpeed*2) * -1, particleSpeed*2)
          },
          color: '#7E4E60'
        })
        this.create(smallParticle, 'particles')
      }

      // get positions of asteroid's walls
      let hitpoints = this.item2.vertices.map(point => {
        let xVert = (point.x + (this.item2.position.x))
        let yVert = (point.y + (this.item2.position.y - this.item2.radius / 16 / 8))
        let rpoint = {x: xVert, y: yVert}
        return { point, rpoint }
      })

      // impact particles
      let verticies = []
      hitpoints.forEach(({point, rpoint}) => {
        // Select verticies within a radius of bullet hit
        const hitRadius = 65
        const shrinkPower = 65
        // apply shrink
        if ( ((rpoint.x - bulletpos.x < hitRadius) && (rpoint.x - bulletpos.x > -hitRadius)) &&
            ((rpoint.y - bulletpos.y < hitRadius) && (rpoint.y - bulletpos.y > -hitRadius)) ) {

          // visualizing hitscan
          const particle = new Particle({
            lifeSpan: randomNumBetween(1, 10),
            size: randomNumBetween(4, 11),
            position: {
              x: rpoint.x,
              y: rpoint.y
            },
            velocity: {
              x: 0,
              y: 0
            },
            //color: '#ff4060'
            color: '#B287A3'
          })
          this.create(particle, 'particles')
        }
      })

      // Spawn debree on main hit
      // for (let i = 0; i < randomNumBetween(1, 2); i++) {
      //   let asteroid = new Asteroid({
      //     velocity: {
      //       x: randomNumBetween(-2.9, 2.9),
      //       y: randomNumBetween(-2.9, 2.9)
      //     },
      //     size: this.item2.radius > 150 ? randomNumBetween(70, 160) : this.item2.radius / 2,
      //     position: {
      //       x: randomNumBetween(-30, 30) + bulletpos.x,
      //       y: randomNumBetween(-30, 30) + bulletpos.y
      //     },
      //     create: this.create.bind(this.create),
      //     addScore: this.addScore.bind(this.addScore),
      //     gametype: 'Debree'
      //   })
      //   this.create(asteroid, 'asteroids')
      // }
      return bulletpos
    }
    return true
  }
}
