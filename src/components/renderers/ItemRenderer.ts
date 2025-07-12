import type { GameItem } from '../../types/game'

export class ItemRenderer {
  static draw(ctx: CanvasRenderingContext2D, item: GameItem) {
    ctx.save()
    
    const centerX = item.x + item.width / 2
    const centerY = item.y + item.height / 2
    
    switch (item.type) {
      case 'diamond':
        this.drawDiamond(ctx, centerX, centerY, item)
        break
      case 'gold':
        this.drawGold(ctx, centerX, centerY, item)
        break
      case 'stone':
        this.drawStone(ctx, centerX, centerY, item)
        break
      case 'bone':
        this.drawBone(ctx, centerX, centerY, item)
        break
      case 'bag':
        this.drawBag(ctx, centerX, centerY, item)
        break
      case 'tnt':
        this.drawTNT(ctx, centerX, centerY, item)
        break
      case 'mouse':
        this.drawMouse(ctx, centerX, centerY, item)
        break
      default:
        this.drawDefault(ctx, item)
        break
    }
    
    // 绘制分数标签
    this.drawScoreLabel(ctx, centerX, item)
    
    ctx.restore()
  }

  private static drawDiamond(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, item: GameItem) {
    const size = Math.min(item.width, item.height) / 2
    
    // 💎的简洁颜色 - 清澈透明的蓝白色
    const diamondGradient = ctx.createLinearGradient(centerX - size, centerY - size * 0.8, centerX + size, centerY + size * 0.8)
    diamondGradient.addColorStop(0, '#F0F8FF')  // 爱丽丝蓝（极浅）
    diamondGradient.addColorStop(0.3, '#E6F3FF') // 浅蓝白
    diamondGradient.addColorStop(0.7, '#B0E0E6') // 粉蓝色
    diamondGradient.addColorStop(1, '#87CEEB')   // 天蓝色
    
    ctx.fillStyle = diamondGradient
    
    // 真实钻石形状：上尖冠部 + 下宽底台的八面体
    ctx.beginPath()
    // 顶部尖点（冠顶）
    ctx.moveTo(centerX, centerY - size * 0.9)
    // 冠部切面（上半部分的多个切割面）
    ctx.lineTo(centerX + size * 0.4, centerY - size * 0.3) // 右上切面
    ctx.lineTo(centerX + size * 0.7, centerY)              // 右腰部（最宽处）
    ctx.lineTo(centerX + size * 0.4, centerY + size * 0.4) // 右下切面
    // 底台（下半部分较宽平面）
    ctx.lineTo(centerX, centerY + size * 0.7)              // 底部平台
    ctx.lineTo(centerX - size * 0.4, centerY + size * 0.4) // 左下切面
    ctx.lineTo(centerX - size * 0.7, centerY)              // 左腰部（最宽处）
    ctx.lineTo(centerX - size * 0.4, centerY - size * 0.3) // 左上切面
    ctx.closePath()
    ctx.fill()
    
    // 钻石冠部的主要切面反光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - size * 0.9)
    ctx.lineTo(centerX + size * 0.25, centerY - size * 0.4)
    ctx.lineTo(centerX, centerY - size * 0.1)
    ctx.lineTo(centerX - size * 0.25, centerY - size * 0.4)
    ctx.closePath()
    ctx.fill()
    
    // 钻石左侧切面的光线反射
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.beginPath()
    ctx.moveTo(centerX - size * 0.4, centerY - size * 0.3)
    ctx.lineTo(centerX - size * 0.7, centerY)
    ctx.lineTo(centerX - size * 0.3, centerY + size * 0.2)
    ctx.lineTo(centerX - size * 0.1, centerY - size * 0.1)
    ctx.closePath()
    ctx.fill()
    
    // 钻石的清晰边框
    ctx.strokeStyle = '#4682B4'  // 钢蓝色
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - size * 0.9)
    ctx.lineTo(centerX + size * 0.4, centerY - size * 0.3)
    ctx.lineTo(centerX + size * 0.7, centerY)
    ctx.lineTo(centerX + size * 0.4, centerY + size * 0.4)
    ctx.lineTo(centerX, centerY + size * 0.7)
    ctx.lineTo(centerX - size * 0.4, centerY + size * 0.4)
    ctx.lineTo(centerX - size * 0.7, centerY)
    ctx.lineTo(centerX - size * 0.4, centerY - size * 0.3)
    ctx.closePath()
    ctx.stroke()
    
    // 钻石内部的关键切割线（体现多面体特征）
    ctx.strokeStyle = '#87CEEB'
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    // 中央垂直线（主轴）
    ctx.moveTo(centerX, centerY - size * 0.9)
    ctx.lineTo(centerX, centerY + size * 0.7)
    // 腰部横线（最宽处）
    ctx.moveTo(centerX - size * 0.7, centerY)
    ctx.lineTo(centerX + size * 0.7, centerY)
    // 冠部到腰部的对角线（切面分割）
    ctx.moveTo(centerX - size * 0.4, centerY - size * 0.3)
    ctx.lineTo(centerX + size * 0.4, centerY + size * 0.4)
    ctx.moveTo(centerX + size * 0.4, centerY - size * 0.3)
    ctx.lineTo(centerX - size * 0.4, centerY + size * 0.4)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  private static drawGold(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, item: GameItem) {
    const width = item.width * 0.9
    const height = item.height * 0.9
    
    // 金块主体 - 不规则圆角矩形
    const mainGradient = ctx.createRadialGradient(centerX - width * 0.2, centerY - height * 0.2, 0, centerX, centerY, width * 0.6)
    mainGradient.addColorStop(0, '#FFFF66')
    mainGradient.addColorStop(0.4, '#FFD700')
    mainGradient.addColorStop(0.8, '#FFA500')
    mainGradient.addColorStop(1, '#FF8C00')
    
    ctx.fillStyle = mainGradient
    ctx.beginPath()
    // 绘制不规则的金块形状
    ctx.moveTo(centerX - width * 0.4, centerY - height * 0.3)
    ctx.quadraticCurveTo(centerX - width * 0.1, centerY - height * 0.5, centerX + width * 0.2, centerY - height * 0.4)
    ctx.quadraticCurveTo(centerX + width * 0.5, centerY - height * 0.2, centerX + width * 0.4, centerY + height * 0.1)
    ctx.quadraticCurveTo(centerX + width * 0.3, centerY + height * 0.4, centerX, centerY + height * 0.5)
    ctx.quadraticCurveTo(centerX - width * 0.3, centerY + height * 0.4, centerX - width * 0.4, centerY)
    ctx.quadraticCurveTo(centerX - width * 0.5, centerY - height * 0.1, centerX - width * 0.4, centerY - height * 0.3)
    ctx.closePath()
    ctx.fill()
    
    // 金块表面纹理 - 使用固定位置避免闪烁
    ctx.fillStyle = 'rgba(255, 255, 0, 0.4)'
    const texturePositions = [
      {x: centerX - width * 0.2, y: centerY - height * 0.1},
      {x: centerX + width * 0.1, y: centerY + height * 0.2},
      {x: centerX - width * 0.1, y: centerY + height * 0.1},
      {x: centerX + width * 0.2, y: centerY - height * 0.2}
    ]
    texturePositions.forEach(pos => {
      ctx.beginPath()
      ctx.ellipse(pos.x, pos.y, width * 0.08, height * 0.06, 0.5, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // 金块高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.ellipse(centerX - width * 0.15, centerY - height * 0.2, width * 0.15, height * 0.1, -0.3, 0, Math.PI * 2)
    ctx.fill()
    
    // 边框
    ctx.strokeStyle = '#CC8800'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.4, centerY - height * 0.3)
    ctx.quadraticCurveTo(centerX - width * 0.1, centerY - height * 0.5, centerX + width * 0.2, centerY - height * 0.4)
    ctx.quadraticCurveTo(centerX + width * 0.5, centerY - height * 0.2, centerX + width * 0.4, centerY + height * 0.1)
    ctx.quadraticCurveTo(centerX + width * 0.3, centerY + height * 0.4, centerX, centerY + height * 0.5)
    ctx.quadraticCurveTo(centerX - width * 0.3, centerY + height * 0.4, centerX - width * 0.4, centerY)
    ctx.quadraticCurveTo(centerX - width * 0.5, centerY - height * 0.1, centerX - width * 0.4, centerY - height * 0.3)
    ctx.stroke()
  }

  private static drawStone(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, item: GameItem) {
    const size = Math.min(item.width, item.height) / 2
    
    // 石头主体渐变
    const gradient = ctx.createRadialGradient(centerX - size * 0.3, centerY - size * 0.3, 0, centerX, centerY, size * 1.2)
    gradient.addColorStop(0, '#C0C0C0')
    gradient.addColorStop(0.3, '#A0A0A0')
    gradient.addColorStop(0.7, '#808080')
    gradient.addColorStop(1, '#606060')
    
    ctx.fillStyle = gradient
    
    // 绘制更真实的不规则石头形状
    const points = [
      {x: centerX - size * 0.9, y: centerY - size * 0.1},
      {x: centerX - size * 0.5, y: centerY - size * 0.8},
      {x: centerX + size * 0.2, y: centerY - size * 0.9},
      {x: centerX + size * 0.8, y: centerY - size * 0.4},
      {x: centerX + size * 0.9, y: centerY + size * 0.3},
      {x: centerX + size * 0.4, y: centerY + size * 0.8},
      {x: centerX - size * 0.2, y: centerY + size * 0.9},
      {x: centerX - size * 0.7, y: centerY + size * 0.5}
    ]
    
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      const current = points[i]
      const next = points[(i + 1) % points.length]
      const controlX = current.x + (next.x - current.x) * 0.3
      const controlY = current.y + (next.y - current.y) * 0.3
      ctx.quadraticCurveTo(controlX, controlY, current.x, current.y)
    }
    ctx.closePath()
    ctx.fill()
    
    // 石头表面裂缝和纹理 - 使用固定位置避免闪烁
    ctx.strokeStyle = 'rgba(96, 96, 96, 0.6)'
    ctx.lineWidth = 1
    const cracks = [
      {startX: centerX - size * 0.3, startY: centerY - size * 0.2, endX: centerX + size * 0.1, endY: centerY + size * 0.3},
      {startX: centerX + size * 0.2, startY: centerY - size * 0.4, endX: centerX + size * 0.4, endY: centerY + size * 0.1},
      {startX: centerX - size * 0.5, startY: centerY + size * 0.1, endX: centerX - size * 0.2, endY: centerY + size * 0.4},
      {startX: centerX - size * 0.1, startY: centerY - size * 0.5, endX: centerX + size * 0.3, endY: centerY - size * 0.2},
      {startX: centerX + size * 0.1, startY: centerY + size * 0.2, endX: centerX + size * 0.2, endY: centerY + size * 0.5}
    ]
    cracks.forEach(crack => {
      ctx.beginPath()
      ctx.moveTo(crack.startX, crack.startY)
      ctx.lineTo(crack.endX, crack.endY)
      ctx.stroke()
    })
    
    // 石头上的小坑 - 使用固定位置避免闪烁
    ctx.fillStyle = 'rgba(64, 64, 64, 0.5)'
    const pits = [
      {x: centerX - size * 0.3, y: centerY - size * 0.3, radius: size * 0.08},
      {x: centerX + size * 0.2, y: centerY - size * 0.1, radius: size * 0.06},
      {x: centerX - size * 0.1, y: centerY + size * 0.4, radius: size * 0.07},
      {x: centerX + size * 0.4, y: centerY + size * 0.2, radius: size * 0.05},
      {x: centerX - size * 0.4, y: centerY + size * 0.1, radius: size * 0.09},
      {x: centerX + size * 0.1, y: centerY - size * 0.4, radius: size * 0.06}
    ]
    pits.forEach(pit => {
      ctx.beginPath()
      ctx.arc(pit.x, pit.y, pit.radius, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // 边框
    ctx.strokeStyle = '#404040'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      const current = points[i]
      const next = points[(i + 1) % points.length]
      const controlX = current.x + (next.x - current.x) * 0.3
      const controlY = current.y + (next.y - current.y) * 0.3
      ctx.quadraticCurveTo(controlX, controlY, current.x, current.y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  private static drawBone(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, item: GameItem) {
    const width = item.width
    const height = item.height
    
    // 骨头主体渐变 - 更真实的骨质颜色
    const boneGradient = ctx.createRadialGradient(centerX - width * 0.2, centerY - height * 0.2, 0, centerX, centerY, width * 0.6)
    boneGradient.addColorStop(0, '#FFFFF0')  // 象牙白
    boneGradient.addColorStop(0.3, '#FFF8DC') // 玉米丝色
    boneGradient.addColorStop(0.7, '#F5DEB3') // 小麦色
    boneGradient.addColorStop(1, '#DEB887')   // 硬木色
    
    ctx.fillStyle = boneGradient
    
    // 骨头参数
    const shaftThickness = height * 0.25  // 骨干厚度
    const epiphysisRadius = height * 0.35 // 骨骺半径
    const shaftLength = width - epiphysisRadius * 2
    
    // 绘制中间骨干 - 略微弯曲的形状
    ctx.save()
    ctx.beginPath()
    // 上边缘弧线
    ctx.moveTo(centerX - shaftLength/2, centerY - shaftThickness/2)
    ctx.quadraticCurveTo(centerX, centerY - shaftThickness/2 - 2, centerX + shaftLength/2, centerY - shaftThickness/2)
    // 右侧连接
    ctx.lineTo(centerX + shaftLength/2, centerY + shaftThickness/2)
    // 下边缘弧线
    ctx.quadraticCurveTo(centerX, centerY + shaftThickness/2 + 2, centerX - shaftLength/2, centerY + shaftThickness/2)
    ctx.closePath()
    ctx.fill()
    
    // 骨干中间的骨髓腔（更深的颜色）
    ctx.fillStyle = 'rgba(222, 184, 135, 0.3)'
    ctx.beginPath()
    ctx.moveTo(centerX - shaftLength/2 + 8, centerY - shaftThickness/4)
    ctx.quadraticCurveTo(centerX, centerY - shaftThickness/4 - 1, centerX + shaftLength/2 - 8, centerY - shaftThickness/4)
    ctx.lineTo(centerX + shaftLength/2 - 8, centerY + shaftThickness/4)
    ctx.quadraticCurveTo(centerX, centerY + shaftThickness/4 + 1, centerX - shaftLength/2 + 8, centerY + shaftThickness/4)
    ctx.closePath()
    ctx.fill()
    
    // 左侧骨骺（关节端） - 更真实的骨端形状
    ctx.fillStyle = boneGradient
    const leftEpiphysisX = centerX - shaftLength/2
    
    // 左上骨骺突起
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX, centerY - epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 左下骨骺突起
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX, centerY + epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 左侧骨骺中心连接部
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX, centerY, epiphysisRadius * 0.5, epiphysisRadius * 0.3, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 右侧骨骺（关节端）
    const rightEpiphysisX = centerX + shaftLength/2
    
    // 右上骨骺突起
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX, centerY - epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 右下骨骺突起
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX, centerY + epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 右侧骨骺中心连接部
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX, centerY, epiphysisRadius * 0.5, epiphysisRadius * 0.3, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 骨头表面的细节纹理 - 骨质纹理
    ctx.strokeStyle = 'rgba(218, 165, 32, 0.4)'
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6
    
    // 骨干表面的纵向纹理
    for (let i = 0; i < 4; i++) {
      const lineX = centerX - shaftLength/3 + (i * shaftLength/6)
      ctx.beginPath()
      ctx.moveTo(lineX, centerY - shaftThickness/3)
      ctx.lineTo(lineX, centerY + shaftThickness/3)
      ctx.stroke()
    }
    
    // 骨骺表面的环状纹理
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX, centerY - epiphysisRadius * 0.6, epiphysisRadius * 0.6, epiphysisRadius * 0.5, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX, centerY + epiphysisRadius * 0.6, epiphysisRadius * 0.6, epiphysisRadius * 0.5, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX, centerY - epiphysisRadius * 0.6, epiphysisRadius * 0.6, epiphysisRadius * 0.5, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX, centerY + epiphysisRadius * 0.6, epiphysisRadius * 0.6, epiphysisRadius * 0.5, 0, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.globalAlpha = 1
    
    // 骨头的高光效果 - 模拟骨质的光泽
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    
    // 骨干高光
    ctx.beginPath()
    ctx.ellipse(centerX - shaftLength/4, centerY - shaftThickness/4, shaftLength/3, shaftThickness/8, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 左骨骺高光
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX - epiphysisRadius * 0.2, centerY - epiphysisRadius * 0.7, epiphysisRadius * 0.3, epiphysisRadius * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 右骨骺高光
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX - epiphysisRadius * 0.2, centerY - epiphysisRadius * 0.7, epiphysisRadius * 0.3, epiphysisRadius * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 骨头的细致边框 - 更清晰的轮廓
    ctx.strokeStyle = '#D2B48C'
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.8
    
    // 骨干边框
    ctx.beginPath()
    ctx.moveTo(centerX - shaftLength/2, centerY - shaftThickness/2)
    ctx.quadraticCurveTo(centerX, centerY - shaftThickness/2 - 2, centerX + shaftLength/2, centerY - shaftThickness/2)
    ctx.lineTo(centerX + shaftLength/2, centerY + shaftThickness/2)
    ctx.quadraticCurveTo(centerX, centerY + shaftThickness/2 + 2, centerX - shaftLength/2, centerY + shaftThickness/2)
    ctx.closePath()
    ctx.stroke()
    
    // 左侧骨骺边框
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX, centerY - epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(leftEpiphysisX, centerY + epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()
    
    // 右侧骨骺边框
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX, centerY - epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(rightEpiphysisX, centerY + epiphysisRadius * 0.6, epiphysisRadius * 0.8, epiphysisRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.globalAlpha = 1
    ctx.restore()
  }

  private static drawBag(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, item: GameItem) {
    const width = item.width
    const height = item.height
    
    // 钱袋主体渐变
    const bagGradient = ctx.createRadialGradient(centerX - width * 0.2, centerY - height * 0.2, 0, centerX, centerY, width * 0.6)
    bagGradient.addColorStop(0, '#DEB887')
    bagGradient.addColorStop(0.5, '#CD853F')
    bagGradient.addColorStop(1, '#8B4513')
    
    ctx.fillStyle = bagGradient
    
    // 绘制钱袋主体（圆底矩形）
    ctx.beginPath()
    ctx.arc(centerX, centerY + height * 0.2, width * 0.4, 0, Math.PI)
    ctx.lineTo(centerX - width * 0.4, centerY - height * 0.3)
    ctx.lineTo(centerX + width * 0.4, centerY - height * 0.3)
    ctx.closePath()
    ctx.fill()
    
    // 钱袋口部
    ctx.fillStyle = '#A0522D'
    ctx.fillRect(centerX - width * 0.35, centerY - height * 0.4, width * 0.7, height * 0.15)
    
    // 绳子
    ctx.strokeStyle = '#654321'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.2, centerY - height * 0.35)
    ctx.lineTo(centerX - width * 0.15, centerY - height * 0.45)
    ctx.moveTo(centerX + width * 0.2, centerY - height * 0.35)
    ctx.lineTo(centerX + width * 0.15, centerY - height * 0.45)
    ctx.stroke()
    
    // 金币图案
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(centerX, centerY, width * 0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#DAA520'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  private static drawDefault(ctx: CanvasRenderingContext2D, item: GameItem) {
    const centerX = item.x + item.width / 2
    const centerY = item.y + item.height / 2
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(item.width, item.height) / 2)
    gradient.addColorStop(0, item.color)
    gradient.addColorStop(1, item.color)
    ctx.fillStyle = gradient
    ctx.fillRect(item.x, item.y, item.width, item.height)
    
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.strokeRect(item.x, item.y, item.width, item.height)
  }

  /**
   * 绘制TNT炸药 - 拟物风格
   */
  private static drawTNT(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, item: GameItem) {
    const width = item.width
    const height = item.height
    
    // TNT主体 - 圆柱形
    const bodyGradient = ctx.createLinearGradient(centerX - width/2, centerY - height/2, centerX + width/2, centerY + height/2)
    bodyGradient.addColorStop(0, '#FF4500')
    bodyGradient.addColorStop(0.3, '#DC143C')
    bodyGradient.addColorStop(0.7, '#B22222')
    bodyGradient.addColorStop(1, '#8B0000')
    
    ctx.fillStyle = bodyGradient
    ctx.fillRect(centerX - width/2, centerY - height/3, width, height * 0.6)
    
    // TNT标签
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(centerX - width/3, centerY - height/6, width * 0.66, height * 0.33)
    
    // TNT文字
    ctx.fillStyle = '#000000'
    ctx.font = `bold ${Math.max(8, width * 0.25)}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText('TNT', centerX, centerY + 2)
    
    // 引线
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - height/2)
    ctx.lineTo(centerX - width * 0.2, centerY - height * 0.7)
    ctx.stroke()
    
    // 火花效果
    const sparkCount = 3
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2
      const sparkX = centerX - width * 0.2 + Math.cos(angle) * 3
      const sparkY = centerY - height * 0.7 + Math.sin(angle) * 3
      
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(sparkX, sparkY, 1, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // 边框
    ctx.strokeStyle = '#8B0000'
    ctx.lineWidth = 1
    ctx.strokeRect(centerX - width/2, centerY - height/3, width, height * 0.6)
  }

  /**
   * 绘制老鼠 - 拟物风格
   */
  private static drawMouse(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, item: GameItem) {
    const width = item.width
    const height = item.height
    
    // 老鼠身体
    const bodyGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width/2)
    bodyGradient.addColorStop(0, '#A0A0A0')
    bodyGradient.addColorStop(0.6, '#808080')
    bodyGradient.addColorStop(1, '#696969')
    
    ctx.fillStyle = bodyGradient
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, width * 0.4, height * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 老鼠头部
    ctx.fillStyle = '#A0A0A0'
    ctx.beginPath()
    ctx.ellipse(centerX + width * 0.3, centerY - height * 0.1, width * 0.2, height * 0.25, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 耳朵
    ctx.fillStyle = '#696969'
    ctx.beginPath()
    ctx.ellipse(centerX + width * 0.35, centerY - height * 0.3, width * 0.08, height * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(centerX + width * 0.25, centerY - height * 0.25, width * 0.08, height * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 眼睛
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(centerX + width * 0.38, centerY - height * 0.05, width * 0.03, 0, Math.PI * 2)
    ctx.fill()
    
    // 鼻子
    ctx.fillStyle = '#FF69B4'
    ctx.beginPath()
    ctx.arc(centerX + width * 0.45, centerY, width * 0.02, 0, Math.PI * 2)
    ctx.fill()
    
    // 尾巴
    ctx.strokeStyle = '#696969'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - width * 0.4, centerY)
    ctx.quadraticCurveTo(centerX - width * 0.6, centerY - height * 0.2, centerX - width * 0.5, centerY - height * 0.4)
    ctx.stroke()
    
    // 脚
    ctx.fillStyle = '#696969'
    for (let i = 0; i < 4; i++) {
      const footX = centerX - width * 0.2 + (i * width * 0.15)
      const footY = centerY + height * 0.3
      ctx.beginPath()
      ctx.ellipse(footX, footY, width * 0.03, height * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // 胡须
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
      const whiskerY = centerY - height * 0.05 + (i * height * 0.05)
      ctx.beginPath()
      ctx.moveTo(centerX + width * 0.45, whiskerY)
      ctx.lineTo(centerX + width * 0.55, whiskerY)
      ctx.stroke()
    }
  }

  private static drawScoreLabel(ctx: CanvasRenderingContext2D, centerX: number, item: GameItem) {
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 3
    ctx.strokeText(`$${item.value}`, centerX, item.y + item.height + 15)
    ctx.fillText(`$${item.value}`, centerX, item.y + item.height + 15)
  }
}