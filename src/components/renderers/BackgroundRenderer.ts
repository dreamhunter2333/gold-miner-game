export class BackgroundRenderer {
  static draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 绘制主背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#87CEEB')
    gradient.addColorStop(0.3, '#DEB887')
    gradient.addColorStop(1, '#8B4513')
    
    ctx.save()
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
    
    // 绘制地下网格线，使用独立的绘制状态
    this.drawGrid(ctx, width, height)
  }

  private static drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save()
    ctx.strokeStyle = 'rgba(101, 67, 33, 0.2)'
    ctx.lineWidth = 1
    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'
    ctx.globalAlpha = 0.6
    
    // 绘制垂直线
    for (let i = 40; i < width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, height * 0.3)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    
    // 绘制水平线
    for (let i = Math.floor(height * 0.3) + 40; i < height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }
    
    ctx.restore()
  }
}