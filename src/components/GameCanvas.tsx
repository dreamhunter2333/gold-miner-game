import { useEffect, useRef, useCallback } from 'react'
import type { GameProps, Miner, Hook, GameItem } from '../types/game'
import { generateRandomItems } from '../utils/itemGenerator'
import { audioManager } from '../utils/audioManager'
import { particleSystem } from '../utils/particleSystem'
import './GameCanvas.css'

const GameCanvas = ({ gameState, onUpdateScore }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const minerRef = useRef<Miner>({ x: 0, y: 0, width: 60, height: 60 })
  const hookRef = useRef<Hook>({
    x: 0,
    y: 0,
    angle: 0,
    length: 0,
    speed: 8,
    isExtending: false,
    isRetracting: false,
    isSwinging: true,
    direction: 1,
    swingSpeed: 0.01,
    maxLength: 600,
    attachedItem: undefined
  })
  const itemsRef = useRef<GameItem[]>([])

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    minerRef.current.x = rect.width / 2 - minerRef.current.width / 2
    minerRef.current.y = 50
    hookRef.current.x = minerRef.current.x + minerRef.current.width / 2
    hookRef.current.y = minerRef.current.y + minerRef.current.height

    // 动态调整钩子最大长度，确保能抓到底部物品
    hookRef.current.maxLength = Math.max(rect.height - 100, 400)

    if (itemsRef.current.length === 0) {
      itemsRef.current = generateRandomItems(rect.width, rect.height, gameState.level)
    }

    audioManager.init()
  }, [gameState.level])

  const drawMiner = (ctx: CanvasRenderingContext2D) => {
    const miner = minerRef.current
    
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
    
    // 绘制矿工头顶的滑轮系统
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

  const drawHook = (ctx: CanvasRenderingContext2D) => {
    const hook = hookRef.current
    const miner = minerRef.current
    
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
    
    // 绘制绳子 - 更真实的编织绳效果
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
    
    // 绘制钩子 - 更真实的金属钩子
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
    
    hook.x = hookX
    hook.y = hookY
  }

  const drawItems = (ctx: CanvasRenderingContext2D) => {
    itemsRef.current.forEach(item => {
      ctx.save()
      
      const centerX = item.x + item.width / 2
      const centerY = item.y + item.height / 2
      
      if (item.type === 'diamond') {
        // 绘制真实钻石的💎形状：上尖下宽的多面体
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
        
      } else if (item.type === 'gold') {
        // 绘制真实金块效果
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
        
      } else if (item.type === 'stone') {
        // 绘制真实石头效果
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
        
      } else if (item.type === 'bone') {
        // 绘制真实骨头 - 更符合解剖学的骨头形状
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
        
      } else if (item.type === 'bag') {
        // 绘制钱袋
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
        
      } else {
        // 其他物品保持原样
        let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(item.width, item.height) / 2)
        gradient.addColorStop(0, item.color)
        gradient.addColorStop(1, item.color)
        ctx.fillStyle = gradient
        ctx.fillRect(item.x, item.y, item.width, item.height)
        
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.strokeRect(item.x, item.y, item.width, item.height)
      }
      
      // 绘制分数标签
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 3
      ctx.strokeText(`$${item.value}`, centerX, item.y + item.height + 15)
      ctx.fillText(`$${item.value}`, centerX, item.y + item.height + 15)
      
      ctx.restore()
    })
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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

  const checkCollision = (hook: Hook, item: GameItem): boolean => {
    const distance = Math.sqrt(
      Math.pow(hook.x - (item.x + item.width / 2), 2) + 
      Math.pow(hook.y - (item.y + item.height / 2), 2)
    )
    return distance < (Math.max(item.width, item.height) / 2 + 10)
  }

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameState.isGameRunning || gameState.isPaused) return

    const hook = hookRef.current
    
    if (hook.isSwinging) {
      hook.angle += hook.direction * hook.swingSpeed
      if (hook.angle > Math.PI / 3) {
        hook.direction = -1
      } else if (hook.angle < -Math.PI / 3) {
        hook.direction = 1
      }
    }
    
    if (hook.isExtending) {
      hook.length += hook.speed
      if (hook.length >= hook.maxLength) {
        hook.isExtending = false
        hook.isRetracting = true
      }
      
      itemsRef.current.forEach(item => {
        if (checkCollision(hook, item) && !hook.attachedItem) {
          hook.attachedItem = item
          hook.isExtending = false
          hook.isRetracting = true
          
          // 根据物体大小和重量调整收钩速度
          const baseSpeed = 8
          const weightFactor = item.weight * 0.5 // 重量影响因子
          const sizeFactor = (item.width + item.height) / 80 // 尺寸影响因子
          
          // 计算最终速度，最小速度为1，最大为基础速度
          hook.speed = Math.max(1, baseSpeed - weightFactor - sizeFactor)
          
          audioManager.play('hit')
          
          particleSystem.addParticles(
            item.x + item.width / 2,
            item.y + item.height / 2,
            5,
            'sparkle',
            item.color
          )
          
          setTimeout(() => {
            switch (item.type) {
              case 'gold':
                audioManager.play('gold')
                break
              case 'diamond':
                audioManager.play('diamond')
                break
              case 'stone':
                audioManager.play('stone')
                break
              default:
                audioManager.play('collect')
            }
          }, 100)
        }
      })
    }
    
    if (hook.isRetracting) {
      hook.length -= hook.speed
      if (hook.length <= 0) {
        hook.length = 0
        hook.isRetracting = false
        hook.isSwinging = true
        hook.speed = 8
        
        if (hook.attachedItem) {
          onUpdateScore(hook.attachedItem.value)
          
          const item = hook.attachedItem
          const miner = minerRef.current
          particleSystem.addParticles(
            miner.x + miner.width / 2,
            miner.y + miner.height,
            8,
            'collect',
            item.color
          )
          
          itemsRef.current = itemsRef.current.filter(item => item.id !== hook.attachedItem!.id)
          hook.attachedItem = undefined
        }
      }
    }
    
    if (hook.attachedItem) {
      const miner = minerRef.current
      const startX = miner.x + miner.width / 2
      const startY = miner.y + miner.height
      const hookX = startX + Math.sin(hook.angle) * hook.length
      const hookY = startY + Math.cos(hook.angle) * hook.length
      
      hook.attachedItem.x = hookX - hook.attachedItem.width / 2
      hook.attachedItem.y = hookY - hook.attachedItem.height / 2
    }
  }, [gameState.isGameRunning, gameState.isPaused, onUpdateScore])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    
    // 完全清除画布，包括所有变换和状态
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    
    // 重置所有绘制状态
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 10
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // 设置全局渲染质量
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // 绘制背景
    drawBackground(ctx, rect.width, rect.height)
    
    // 绘制物品
    drawItems(ctx)
    
    // 绘制矿工
    drawMiner(ctx)
    
    // 绘制钩子（确保在最上层）
    drawHook(ctx)
    
    // 绘制粒子效果
    particleSystem.update(16)
    particleSystem.draw(ctx)
    
    updateGame()
    
    if (gameState.isGameRunning) {
      animationRef.current = requestAnimationFrame(render)
    }
  }, [gameState.isGameRunning, updateGame])

  const handleCanvasClick = useCallback(() => {
    const hook = hookRef.current
    if (gameState.isGameRunning && !gameState.isPaused && hook.isSwinging) {
      hook.isSwinging = false
      hook.isExtending = true
      hook.length = 0
      
      audioManager.resumeContext()
      audioManager.play('shoot')
    }
  }, [gameState.isGameRunning, gameState.isPaused])

  useEffect(() => {
    setupCanvas()
    
    const handleResize = () => {
      setupCanvas()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setupCanvas])

  useEffect(() => {
    if (gameState.isGameRunning && !gameState.isPaused) {
      render()
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState.isGameRunning, gameState.isPaused, render])

  useEffect(() => {
    if (gameState.isGameRunning && !gameState.isPaused) {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        itemsRef.current = generateRandomItems(rect.width, rect.height, gameState.level)
        
        // 通关时播放音效和粒子效果
        if (gameState.score > 0 && gameState.score % 1000 === 0) {
          audioManager.play('levelUp')
          
          // 添加庆祝粒子效果
          const canvas = canvasRef.current
          if (canvas) {
            const rect = canvas.getBoundingClientRect()
            particleSystem.addParticles(
              rect.width / 2,
              rect.height / 2,
              20,
              'explosion',
              '#FFD700'
            )
          }
        }
      }
    }
  }, [gameState.level])

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        onClick={handleCanvasClick}
      />
    </div>
  )
}

export default GameCanvas