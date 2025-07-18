import type { GameItem } from '../types/game'

export interface Rat extends GameItem {
  speed: number
  targetDiamondId?: string
  isStealing: boolean
  stealProgress: number
  direction: number // 1 = right, -1 = left
  hasDiamond: boolean
  carryingDiamondId?: string
  originalDiamond?: GameItem
}

export class RatSystem {
  private rats: Rat[] = []
  private canvasWidth: number
  private canvasHeight: number
  private onDiamondStolen?: (diamondValue: number) => void

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  setOnDiamondStolen(callback: (diamondValue: number) => void) {
    this.onDiamondStolen = callback
  }

  spawnRats(items: GameItem[], level: number, timeElapsed: number = 0): Rat[] {
    // 从第5关开始生成老鼠
    if (level < 5) {
      this.rats = []
      return []
    }

    // 只有在游戏开始后30秒才生成老鼠
    if (timeElapsed < 30) {
      return this.rats
    }

// 简化老鼠生成逻辑 - 只在时间到达30秒时一次性生成
    const currentRats = items.filter(item => item.type === 'mouse')
    
    // 如果已经有老鼠，不再生成
    if (currentRats.length > 0) {
      return this.rats
    }

    // 计算老鼠数量：第5关1只，每隔一关增加1只，最多5只
    const baseRats = 1
    const additionalRats = Math.min(Math.floor((level - 5) / 2), 4)
    const ratCount = Math.min(baseRats + additionalRats, 5)

    // 创建新的老鼠实例
    const newRats: Rat[] = []
    
    for (let i = 0; i < ratCount; i++) {
      const size = Math.random() > 0.5 ? 'small' : 'medium'
      const width = size === 'small' ? 25 : 35
      const height = size === 'small' ? 20 : 28
      
      const ratItem: GameItem = {
        id: `mouse-${Date.now()}-${i}`,
        x: 0 - width, // 从最左边出现，完全在屏幕外
        y: this.canvasHeight * 0.5 + Math.random() * (this.canvasHeight * 0.3),
        width,
        height,
        type: 'mouse',
        value: 0,
        weight: 1,
        color: '#808080',
        size: size
      }
      
      items.push(ratItem)
      
      const rat: Rat = {
        ...ratItem,
speed: 0.15 + Math.random() * 0.15,
        isStealing: false,
        stealProgress: 0,
        direction: 1,
        hasDiamond: false,
        carryingDiamondId: undefined,
        originalDiamond: undefined
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
      // 如果老鼠已经拿到钻石，直接向右移动
      if (rat.hasDiamond) {
        rat.x += rat.speed
        
        // 如果老鼠携带钻石，更新钻石位置跟随老鼠
        if (rat.carryingDiamondId) {
          const diamondIndex = items.findIndex(item => item.id === rat.carryingDiamondId)
          if (diamondIndex !== -1) {
            items[diamondIndex].x = rat.x + rat.width * 0.7
            items[diamondIndex].y = rat.y + rat.height * 0.3
          }
        }
      } else {
        // 老鼠还没有钻石，寻找并偷钻石
        
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
          rat.stealProgress += 0.05 // 每帧进度增加5%，更快完成
          
          if (rat.stealProgress >= 1) {
            // 钻石被偷走，老鼠价值变为钻石价值的10倍
            rat.hasDiamond = true
            rat.carryingDiamondId = targetDiamond.id
            rat.originalDiamond = { ...targetDiamond }
            
            // 设置老鼠价值为钻石价值的10倍
            const ratItemIndex = items.findIndex(item => item.id === rat.id)
            if (ratItemIndex !== -1) {
              items[ratItemIndex].value = targetDiamond.value * 10
            }
            
            // 从场上移除钻石
            const diamondIndex = items.findIndex(item => item.id === targetDiamond.id)
            if (diamondIndex !== -1) {
              items.splice(diamondIndex, 1)
            }
            
            // 触发钻石被偷的回调，传入实际钻石价值
            if (this.onDiamondStolen) {
              this.onDiamondStolen(targetDiamond.value)
            }
            
            // 重置偷钻石状态
            rat.isStealing = false
            rat.stealProgress = 0
            rat.targetDiamondId = undefined
          }
        }
      }

      // 检查是否到达屏幕右边界，老鼠消失即可
      if (rat.x >= this.canvasWidth - rat.width) {
        // 老鼠离开屏幕右侧，直接移除老鼠
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

    // 清理已消失的老鼠
    const ratIds = new Set(this.rats.map(rat => rat.id))
    const filteredItems = items.filter(item => 
      item.type !== 'mouse' || ratIds.has(item.id)
    )
    items.length = 0
    items.push(...filteredItems)
  }

  private findNearestDiamond(rat: Rat, diamonds: GameItem[]): void {
    if (diamonds.length === 0) return

    let nearestDiamond = diamonds[0]
    let minDistance = Infinity

    const ratCenterX = rat.x + rat.width / 2
    const ratCenterY = rat.y + rat.height / 2

    diamonds.forEach(diamond => {
      const diamondCenterX = diamond.x + diamond.width / 2
      const diamondCenterY = diamond.y + diamond.height / 2
      const distance = Math.sqrt(
        Math.pow(ratCenterX - diamondCenterX, 2) + Math.pow(ratCenterY - diamondCenterY, 2)
      )
      if (distance < minDistance) {
        minDistance = distance
        nearestDiamond = diamond
      }
    })

    rat.targetDiamondId = nearestDiamond.id
  }

  private moveTowardsDiamond(rat: Rat, diamond: GameItem): void {
    // 使用中心点计算距离
    const ratCenterX = rat.x + rat.width / 2
    const ratCenterY = rat.y + rat.height / 2
    const diamondCenterX = diamond.x + diamond.width / 2
    const diamondCenterY = diamond.y + diamond.height / 2
    
    const dx = diamondCenterX - ratCenterX
    const dy = diamondCenterY - ratCenterY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 20) { // 使用中心点距离，更精确的阈值
      rat.isStealing = true
      return
    }

    // 直接移动向钻石，移除随机因子以避免卡住
    const moveX = (dx / distance) * rat.speed
    const moveY = (dy / distance) * rat.speed

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