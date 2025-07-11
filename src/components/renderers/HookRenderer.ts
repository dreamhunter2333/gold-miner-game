import type { Hook, Miner } from '../../types/game'

export class HookRenderer {
  static draw(ctx: CanvasRenderingContext2D, hook: Hook, miner: Miner) {
    const startX = miner.x + miner.width / 2
    const startY = miner.y + miner.height
    
    let hookX = startX
    let hookY = startY
    
    if (hook.isExtending || hook.isRetracting) {
      hookX = startX + Math.sin(hook.angle) * hook.length
      hookY = startY + Math.cos(hook.angle) * hook.length
    } else if (hook.isSwinging) {
      hookX = startX + Math.sin(hook.angle) * 80
      hookY = startY + Math.cos(hook.angle) * 80
    }
    
    // 绘制绳子
    this.drawRope(ctx, startX, startY, hookX, hookY)
    
    // 绘制钩子
    this.drawHookBody(ctx, hookX, hookY)
    
    hook.x = hookX
    hook.y = hookY
  }

  private static drawRope(ctx: CanvasRenderingContext2D, startX: number, startY: number, hookX: number, hookY: number) {
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    
    // 绳子主体渐变
    const ropeGradient = ctx.createLinearGradient(startX - 3, startY, startX + 3, startY)
    ropeGradient.addColorStop(0, '#D2691E')  // 巧克力色
    ropeGradient.addColorStop(0.5, '#CD853F') // 秘鲁色
    ropeGradient.addColorStop(1, '#A0522D')   // 马鞍棕
    
    ctx.strokeStyle = ropeGradient
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // 绳子阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(hookX, hookY)
    ctx.stroke()
    
    // 绘制绳子的编织纹理
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.6
    
    const distance = Math.sqrt(Math.pow(hookX - startX, 2) + Math.pow(hookY - startY, 2))
    const segments = Math.floor(distance / 8)
    
    for (let i = 0; i < segments; i++) {
      const t = i / segments
      const x = startX + (hookX - startX) * t
      const y = startY + (hookY - startY) * t
      const perpX = -(hookY - startY) / distance * 2
      const perpY = (hookX - startX) / distance * 2
      
      ctx.beginPath()
      ctx.moveTo(x + perpX, y + perpY)
      ctx.lineTo(x - perpX, y - perpY)
      ctx.stroke()
    }
    
    ctx.restore()
  }

  private static drawHookBody(ctx: CanvasRenderingContext2D, hookX: number, hookY: number) {
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    
    // 钩子主体渐变 - 金属质感
    const hookGradient = ctx.createRadialGradient(hookX - 3, hookY - 3, 0, hookX, hookY, 15)
    hookGradient.addColorStop(0, '#E6E6FA')  // 淡紫色高光
    hookGradient.addColorStop(0.3, '#C0C0C0') // 银色
    hookGradient.addColorStop(0.7, '#808080') // 灰色
    hookGradient.addColorStop(1, '#2F4F4F')   // 深灰绿
    
    ctx.fillStyle = hookGradient
    
    // 钩子阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // 绘制钩子主体圆形
    ctx.beginPath()
    ctx.arc(hookX, hookY, 12, 0, Math.PI * 2)
    ctx.fill()
    
    // 清除阴影
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    
    // 钩子的金属边框
    ctx.strokeStyle = '#696969'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(hookX, hookY, 12, 0, Math.PI * 2)
    ctx.stroke()
    
    // 绘制钩子的爪子 - 更立体的设计
    ctx.strokeStyle = '#4F4F4F'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    
    // 左爪
    ctx.beginPath()
    ctx.moveTo(hookX - 15, hookY - 3)
    ctx.lineTo(hookX - 8, hookY)
    ctx.lineTo(hookX - 15, hookY + 3)
    ctx.stroke()
    
    // 右爪
    ctx.beginPath()
    ctx.moveTo(hookX + 15, hookY - 3)
    ctx.lineTo(hookX + 8, hookY)
    ctx.lineTo(hookX + 15, hookY + 3)
    ctx.stroke()
    
    // 上爪
    ctx.beginPath()
    ctx.moveTo(hookX - 3, hookY - 15)
    ctx.lineTo(hookX, hookY - 8)
    ctx.lineTo(hookX + 3, hookY - 15)
    ctx.stroke()
    
    // 下爪
    ctx.beginPath()
    ctx.moveTo(hookX - 3, hookY + 15)
    ctx.lineTo(hookX, hookY + 8)
    ctx.lineTo(hookX + 3, hookY + 15)
    ctx.stroke()
    
    // 钩子中央的高光点
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.arc(hookX - 3, hookY - 3, 3, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}