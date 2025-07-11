import type { Miner } from '../../types/game'

export class MinerRenderer {
  static draw(ctx: CanvasRenderingContext2D, miner: Miner) {
    ctx.save()
    ctx.translate(miner.x + miner.width / 2, miner.y + miner.height / 2)
    
    // 矿工身体 - 工作服渐变
    const bodyGradient = ctx.createLinearGradient(-miner.width / 2, -miner.height / 2, miner.width / 2, miner.height / 2)
    bodyGradient.addColorStop(0, '#A0522D')
    bodyGradient.addColorStop(0.5, '#8B4513')
    bodyGradient.addColorStop(1, '#654321')
    
    ctx.fillStyle = bodyGradient
    ctx.fillRect(-miner.width / 2, -miner.height / 2, miner.width, miner.height)
    
    // 工作服纽扣
    ctx.fillStyle = '#4F4F4F'
    ctx.beginPath()
    ctx.arc(-5, -10, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(5, -10, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(0, 5, 2, 0, Math.PI * 2)
    ctx.fill()
    
    // 矿工脸部 - 肌肤色
    const faceGradient = ctx.createRadialGradient(-5, -15, 0, 0, -10, 15)
    faceGradient.addColorStop(0, '#FDBCB4')
    faceGradient.addColorStop(0.7, '#FFE4B5')
    faceGradient.addColorStop(1, '#DDB07A')
    
    ctx.fillStyle = faceGradient
    ctx.fillRect(-miner.width / 2 + 10, -miner.height / 2 + 10, miner.width - 20, miner.height - 30)
    
    // 矿工帽子 - 立体安全帽
    const hatGradient = ctx.createLinearGradient(-miner.width / 2, -miner.height / 2, miner.width / 2, -miner.height / 2 + 15)
    hatGradient.addColorStop(0, '#FF4444')
    hatGradient.addColorStop(0.5, '#FF0000')
    hatGradient.addColorStop(1, '#CC0000')
    
    ctx.fillStyle = hatGradient
    ctx.fillRect(-miner.width / 2 + 5, -miner.height / 2 + 5, miner.width - 10, 15)
    
    // 帽子反光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillRect(-miner.width / 2 + 8, -miner.height / 2 + 6, miner.width - 20, 4)
    
    // 矿工眼睛 - 更立体
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.ellipse(-8, -15, 3, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(4, -15, 3, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 眼珠
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(-8, -15, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(4, -15, 2, 0, Math.PI * 2)
    ctx.fill()
    
    // 眼球高光
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(-9, -16, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(3, -16, 1, 0, Math.PI * 2)
    ctx.fill()
    
    // 矿工胡子/嘴巴 - 更立体的胡子
    const beardGradient = ctx.createRadialGradient(0, -5, 0, 0, -5, 8)
    beardGradient.addColorStop(0, '#A0522D')
    beardGradient.addColorStop(1, '#8B4513')
    
    ctx.strokeStyle = beardGradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(0, -5, 8, 0, Math.PI)
    ctx.stroke()
    
    // 胡子高光
    ctx.strokeStyle = 'rgba(210, 180, 140, 0.6)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(-2, -7, 6, 0.2, Math.PI - 0.2)
    ctx.stroke()
    
    // 矿工头灯
    const lampGradient = ctx.createRadialGradient(0, -miner.height / 2 + 8, 0, 0, -miner.height / 2 + 8, 4)
    lampGradient.addColorStop(0, '#FFFF99')
    lampGradient.addColorStop(0.5, '#FFD700')
    lampGradient.addColorStop(1, '#B8860B')
    
    ctx.fillStyle = lampGradient
    ctx.beginPath()
    ctx.arc(0, -miner.height / 2 + 8, 4, 0, Math.PI * 2)
    ctx.fill()
    
    // 头灯边框
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, -miner.height / 2 + 8, 4, 0, Math.PI * 2)
    ctx.stroke()
    
    // 头灯反光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.arc(-1, -miner.height / 2 + 7, 2, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }

  static drawPulleySystem(ctx: CanvasRenderingContext2D, miner: Miner) {
    const pulleyX = miner.x + miner.width / 2
    const pulleyY = miner.y - 15
    
    ctx.save()
    
    // 滑轮支架底座 - 立体木质底座
    const baseGradient = ctx.createLinearGradient(pulleyX - 20, pulleyY - 8, pulleyX + 20, pulleyY + 8)
    baseGradient.addColorStop(0, '#CD853F')
    baseGradient.addColorStop(0.5, '#8B4513')
    baseGradient.addColorStop(1, '#654321')
    
    ctx.fillStyle = baseGradient
    // 立体底座
    ctx.fillRect(pulleyX - 20, pulleyY + 5, 40, 8)
    // 底座顶面
    ctx.fillStyle = '#D2691E'
    ctx.fillRect(pulleyX - 18, pulleyY + 3, 36, 6)
    
    // 支架立柱
    const pillarGradient = ctx.createLinearGradient(pulleyX - 3, pulleyY - 20, pulleyX + 3, pulleyY + 5)
    pillarGradient.addColorStop(0, '#A0522D')
    pillarGradient.addColorStop(0.5, '#8B4513')
    pillarGradient.addColorStop(1, '#654321')
    
    ctx.fillStyle = pillarGradient
    ctx.fillRect(pulleyX - 3, pulleyY - 20, 6, 25)
    
    // 支架顶部横梁
    const beamGradient = ctx.createLinearGradient(pulleyX - 25, pulleyY - 25, pulleyX + 25, pulleyY - 15)
    beamGradient.addColorStop(0, '#CD853F')
    beamGradient.addColorStop(0.5, '#A0522D')
    beamGradient.addColorStop(1, '#8B4513')
    
    ctx.fillStyle = beamGradient
    ctx.fillRect(pulleyX - 25, pulleyY - 25, 50, 8)
    // 横梁顶面
    ctx.fillStyle = '#D2691E'
    ctx.fillRect(pulleyX - 23, pulleyY - 27, 46, 6)
    
    // 木质纹理线条
    ctx.strokeStyle = '#654321'
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(pulleyX - 20, pulleyY + 6 + i * 2)
      ctx.lineTo(pulleyX + 20, pulleyY + 6 + i * 2)
      ctx.stroke()
    }
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(pulleyX - 23 + i * 12, pulleyY - 25)
      ctx.lineTo(pulleyX - 23 + i * 12, pulleyY - 17)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    
    // 滑轮外环 - 金属质感
    const pulleyGradient = ctx.createRadialGradient(pulleyX - 2, pulleyY - 2, 0, pulleyX, pulleyY, 12)
    pulleyGradient.addColorStop(0, '#E6E6FA')
    pulleyGradient.addColorStop(0.3, '#C0C0C0')
    pulleyGradient.addColorStop(0.7, '#808080')
    pulleyGradient.addColorStop(1, '#2F4F4F')
    
    ctx.fillStyle = pulleyGradient
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, 12, 0, Math.PI * 2)
    ctx.fill()
    
    // 滑轮边框
    ctx.strokeStyle = '#696969'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, 12, 0, Math.PI * 2)
    ctx.stroke()
    
    // 滑轮内圈
    ctx.fillStyle = '#4F4F4F'
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // 滑轮轴心
    ctx.fillStyle = '#2F2F2F'
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // 滑轮高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.arc(pulleyX - 3, pulleyY - 3, 4, 0, Math.PI * 2)
    ctx.fill()
    
    // 金属螺丝钉
    ctx.fillStyle = '#4F4F4F'
    // 底座螺丝
    ctx.beginPath()
    ctx.arc(pulleyX - 15, pulleyY + 7, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pulleyX + 15, pulleyY + 7, 2, 0, Math.PI * 2)
    ctx.fill()
    // 横梁螺丝
    ctx.beginPath()
    ctx.arc(pulleyX - 18, pulleyY - 21, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pulleyX + 18, pulleyY - 21, 2, 0, Math.PI * 2)
    ctx.fill()
    
    // 螺丝高光
    ctx.fillStyle = '#C0C0C0'
    ctx.beginPath()
    ctx.arc(pulleyX - 15, pulleyY + 7, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pulleyX + 15, pulleyY + 7, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pulleyX - 18, pulleyY - 21, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pulleyX + 18, pulleyY - 21, 1, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}