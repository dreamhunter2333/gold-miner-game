export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
  type: 'sparkle' | 'explosion' | 'collect'
}

export class ParticleSystem {
  private particles: Particle[] = []

  addParticles(x: number, y: number, count: number, type: 'sparkle' | 'explosion' | 'collect', color: string = '#FFD700') {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = Math.random() * 3 + 2
      const size = Math.random() * 4 + 2
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        life: 1,
        maxLife: 1,
        type
      })
    }
  }

  update(deltaTime: number) {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx * deltaTime
      particle.y += particle.vy * deltaTime
      particle.life -= deltaTime / 1000
      
      if (particle.type === 'explosion') {
        particle.vy += 0.1
        particle.vx *= 0.99
        particle.vy *= 0.99
      } else if (particle.type === 'collect') {
        particle.vy -= 0.05
        particle.vx *= 0.95
      }
      
      return particle.life > 0
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(particle => {
      ctx.save()
      
      const alpha = particle.life / particle.maxLife
      ctx.globalAlpha = alpha
      
      ctx.fillStyle = particle.color
      
      if (particle.type === 'sparkle') {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1
        ctx.stroke()
      } else if (particle.type === 'explosion') {
        ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size)
      } else if (particle.type === 'collect') {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()
    })
  }

  clear() {
    this.particles = []
  }
}

export const particleSystem = new ParticleSystem()