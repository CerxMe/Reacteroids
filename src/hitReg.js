import Particle from './Particle'
import { randomNumBetween, isNegative } from './helpers'
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
      for (let i = 0; i < 50; i++) {
        const particle = new Particle({
          lifeSpan: randomNumBetween(3, 10),
          size: randomNumBetween(this.item2.radius / 40, this.item2.radius / 30),
          position: {
            x: bulletpos.x,
            y: bulletpos.y
          },
          velocity: {
            x: randomNumBetween((this.item2.radius / 32) * -1, this.item2.radius / 32),
            y: randomNumBetween((this.item2.radius / 32) * -1, this.item2.radius / 32)
          },
          color: '#ff4060'
        })
        this.create(particle, 'particles')
      }

      if (this.item2.gametype === 'One') {
        // console.log('Bullet Position: x' + bulletpos.x + ' y' + bulletpos.y)
        // Hitreg explosion
        for (let i = 0; i < 30; i++) {
          const particle = new Particle({
            lifeSpan: randomNumBetween(3, 6),
            size: randomNumBetween(2, 6),
            position: {
              x: bulletpos.x,
              y: bulletpos.y
            },
            velocity: {
              x: randomNumBetween(-6, 6),
              y: randomNumBetween(-6, 6)
            },
            color: '#1764ff'
          })
          this.create(particle, 'particles')
        }
        //console.log(this.item2.vertices)
        // Get real position of verticies
        let hitpoints = this.item2.vertices.map(point => {
          let xVert = (point.x + (this.item2.position.x))
          let yVert = (point.y + (this.item2.position.y - this.item2.radius / 16 / 8))
          let rpoint = {x: xVert, y: yVert}

          return { point, rpoint }
        })

        // Chip away main asteroid
        let verticies = []
        hitpoints.forEach(({point, rpoint}) => {
          // Select verticies within a radius of bullet hit
          const hitRadius = 65
          const shrinkPower = 65
          // apply shrink
          if (((rpoint.x - bulletpos.x < hitRadius) && (rpoint.x - bulletpos.x > -hitRadius)) &&
              ((rpoint.y - bulletpos.y < hitRadius) && (rpoint.y - bulletpos.y > -hitRadius))) {

                // visualizing hitscan
                const particle = new Particle({
                  lifeSpan: randomNumBetween(4, 13),
                  size: randomNumBetween(this.item2.radius / 30, this.item2.radius / 16),
                  position: {
                    x: rpoint.x,
                    y: rpoint.y
                  },
                  velocity: {
                    x: 0,
                    y: 0
                  },
                  //color: '#ff4060'
                  color: '#03fc35'
                })
                this.create(particle, 'particles')


          //console.log(`ofst: x${rpoint.x - bulletpos.x} y${rpoint.y - bulletpos.y}`)
          if(isNegative(rpoint.x))
            point.x = point.x + randomNumBetween(shrinkPower/2, shrinkPower)
          else
            point.x = point.x - randomNumBetween(-shrinkPower, -(shrinkPower/2) )

          if(isNegative(rpoint.y))
            point.y = point.y + randomNumBetween(shrinkPower/2, shrinkPower)
          else
            point.y = point.y - randomNumBetween(-shrinkPower, -(shrinkPower/2))
          }
          // reconstruct verticies
          verticies.push({ x: point.x, y: point.y })
        })
        this.item2.vertices = verticies

        // Spawn debree on main hit
        for (let i = 0; i < randomNumBetween(1, 2); i++) {
          let asteroid = new Asteroid({
            velocity: {
              x: randomNumBetween(-2.9, 2.9),
              y: randomNumBetween(-2.9, 2.9)
            },
            size: this.item2.radius > 150 ? randomNumBetween(70, 160) : this.item2.radius / 2,
            position: {
              x: randomNumBetween(-30, 30) + bulletpos.x,
              y: randomNumBetween(-30, 30) + bulletpos.y
            },
            create: this.create.bind(this.create),
            addScore: this.addScore.bind(this.addScore),
            gametype: 'Debree'
          })
          this.create(asteroid, 'asteroids')
        }
      }
    }
    return true
  }
}
