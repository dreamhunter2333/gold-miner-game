import type { GameItem } from '../types/game'

export interface Rat extends GameItem {
  speed: number
  targetDiamondId?: string
  isStealing: boolean
  stealProgress: number
  direction: number // 1 = right, -1 = left
}

export class RatSystem {
  private rats: Rat[] = []
  private canvasWidth: number
  private canvasHeight: number
  private onDiamondStolen?: (diamondId: string) => void

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  setOnDiamondStolen(callback: (diamondId: string) => void) {
    this.onDiamondStolen = callback
  }

  spawnRats(items: GameItem[], level: number): Rat[] {
    // 从第5关开始生成老鼠
    if (level < 5) {
      this.rats = []
      return []
    }

    // 计算老鼠数量：基础1只，每增加1关增加1只，最多5只
    const baseRats = 1
    const additionalRats = Math.min(level - 4, 4) // 最多额外4只，总共5只
    const ratCount = Math.min(baseRats + additionalRats, 5)

    // 获取当前的老鼠物品
    const existingRats = items.filter(item => item.type === 'mouse')
    
    // 创建新的老鼠实例
    const newRats: Rat[] = []
    
    for (let i = 0; i < Math.min(ratCount, existingRats.length); i++) {
      const ratItem = existingRats[i]
      const rat: Rat = {
        ...ratItem,
        speed: 1 + Math.random() * 2, // 随机速度1-3像素/帧
        isStealing: false,
        stealProgress: 0,
        direction: 1 // 从左向右移动
      }
      newRats.push(rat)
    }

    this.rats = newRats
    return newRats
  }

  updateRats(items: GameItem[]): void {
    if (this.rats.length === 0) return

    // 获取当前场上的钻石
    const diamonds = items.filter(item => item.type === 'diamond')
    
    this.rats.forEach(rat => {
      // 如果老鼠没有目标钻石，寻找最近的钻石
      if (!rat.targetDiamondId || !diamonds.find(d => d.id === rat.targetDiamondId)) {
        this.findNearestDiamond(rat, diamonds)
      }

      // 如果找到目标钻石，向它移动
      const targetDiamond = diamonds.find(d => d.id === rat.targetDiamondId)
      if (targetDiamond) {
        this.moveTowardsDiamond(rat, targetDiamond)
      }

      // 如果老鼠已经到达钻石位置，开始偷钻石
      if (rat.isStealing && targetDiamond) {
        rat.stealProgress += 0.02 // 每帧进度增加2%
        
        if (rat.stealProgress >= 1) {
          // 钻石被偷走
          if (this.onDiamondStolen) {
            this.onDiamondStolen(targetDiamond.id)
          }
          
          // 重置老鼠状态，寻找下一个目标
          rat.isStealing = false
          rat.stealProgress = 0
          rat.targetDiamondId = undefined
        }
      }

      // 检查是否到达屏幕右边界，直接消失
      if (rat.x >= this.canvasWidth) {
        // 老鼠离开屏幕右侧，直接移除
        this.removeRat(rat.id)
      }
    })

    // 更新场上的老鼠物品位置
    this.rats.forEach(rat => {
      const itemIndex = items.findIndex(item => item.id === rat.id)
      if (itemIndex !== -1) {
        items[itemIndex].x = rat.x
        items[itemIndex].y = rat.y
      }
    })
  }

  private findNearestDiamond(rat: Rat, diamonds: GameItem[]): void {
    if (diamonds.length === 0) return

    let nearestDiamond = diamonds[0]
    let minDistance = Infinity

    diamonds.forEach(diamond => {
      const distance = Math.sqrt(
        Math.pow(rat.x - diamond.x, 2) + Math.pow(rat.y - diamond.y, 2)
      )
      if (distance < minDistance) {
        minDistance = distance
        nearestDiamond = diamond
      }
    })

    rat.targetDiamondId = nearestDiamond.id
  }

  private moveTowardsDiamond(rat: Rat, diamond: GameItem): void {
    const dx = diamond.x - rat.x
    const dy = diamond.y - rat.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 30) { // 到达钻石附近
      rat.isStealing = true
      return
    }

    // 添加一些随机性让移动更自然
    const randomFactor = 0.2
    const moveX = (dx / distance) * rat.speed + (Math.random() - 0.5) * randomFactor
    const moveY = (dy / distance) * rat.speed + (Math.random() - 0.5) * randomFactor

    rat.x += moveX
    rat.y += moveY
    
    // 确保老鼠不会跑出屏幕边界
    rat.x = Math.max(0, Math.min(rat.x, this.canvasWidth - rat.width))
    rat.y = Math.max(0, Math.min(rat.y, this.canvasHeight - rat.height))
  }

  private removeRat(ratId: string): void {
    this.rats = this.rats.filter(rat => rat.id !== ratId)
  }

  getRats(): Rat[] {
    return this.rats
  }

  removeAllRats(): void {
    this.rats = []
  }

  // 获取当前活跃的老鼠数量
  getActiveRatCount(): number {
    return this.rats.length
  }
}