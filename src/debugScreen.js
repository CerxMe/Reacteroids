import React from 'react'

export default class DebugScreen extends React.Component {
  constructor (props, asteroids, bullets) {
    super(props)
    console.log(props)
    this.asteroids = props.asteroids
    this.bullets = props.bullets
    this.state = {
        open: {
            asteroidDrawer: false,
            bulletsDrawer: false
        }
    }
  }
  toggleOpen(comp){
    let currentlyOpen = this.state.open
    currentlyOpen[comp] = !currentlyOpen[comp]
    this.setState({    
        open: currentlyOpen
    })

  }
  render(){
    return (
        <section className="debugScreen">
            <button onClick={() => this.toggleOpen('asteroidDrawer')}>Asteroids: {this.asteroids.length}</button>
            {this.state.open.asteroidDrawer&&
                this.asteroids.map((asteroid) => <p>{asteroid.gametype}: x{Math.round(asteroid.position.x)} y{Math.round(asteroid.position.y)}</p>)
            }
            <button onClick={() => this.toggleOpen('bulletsDrawer')}>Bullets: {this.bullets.length}</button>
            {this.state.open.bulletsDrawer &&
                this.bullets.map((bullet) => <p>{bullet.name}: x{Math.round(bullet.position.x)} y{Math.round(bullet.position.y)}</p>)
            }
        </section>
      )

  }
}