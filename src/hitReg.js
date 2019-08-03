import Particle from './Particle'
import { randomNumBetween } from './helpers'
import React, { Component } from 'react'

export default class hitReg extends Component {
  constructor (item1, item2, create) {
    super()
    this.create = create.create
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
          size: randomNumBetween(2, 6),
          position: {
            x: bulletpos.x,
            y: bulletpos.y
          },
          velocity: {
            x: randomNumBetween(-10, 10),
            y: randomNumBetween(-10, 10)
          },
          color: '#ff4060'
        })
        this.create(particle, 'particles')
      }

      if (this.item2.gametype === 'One') {
        console.log('Bullet Position: x' + bulletpos.x + ' y' + bulletpos.y)

        // Hitreg explosion
        for (let i = 0; i < 50; i++) {
          const particle = new Particle({
            lifeSpan: randomNumBetween(3, 10),
            size: randomNumBetween(2, 6),
            position: {
              x: bulletpos.x,
              y: bulletpos.y
            },
            velocity: {
              x: randomNumBetween(-10, 10),
              y: randomNumBetween(-10, 10)
            },
            color: '#1764ff'
          })
          this.create(particle, 'particles')
        }

        console.log('Verticies within 150 ofst:')
        let hitpoints = this.item2.vertices.filter(point => {
          if(( point.x*-1 - bulletpos.x*-1) <= 150 && 150 <= (point.y*-1 - bulletpos.y-1)){
            console.log('vert: x' + point.x + ' y' + point.y + ' || ofst: x' + ( point.x*-1 - bulletpos.x*-1) + ' y' + (point.y*-1 - bulletpos.y-1) )
          }

        })
      }
    }
    return true
  }
}
