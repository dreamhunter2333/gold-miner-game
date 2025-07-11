import type { GameItem } from '../types/game'
import { getDifficultyConfig, generateSizeDistribution } from './difficultySystem'

export const generateRandomItems = (canvasWidth: number, canvasHeight: number, level: number): GameItem[] => {
  const items: GameItem[] = []
  const minY = canvasHeight * 0.4
  const maxY = canvasHeight - 100
  
  // 使用新的难度系统
  const difficultyConfig = getDifficultyConfig(level)
  const itemCounts = difficultyConfig.itemDistribution
  
  const itemConfigs = {
    gold: {
      sizes: {
        small: { width: 25, height: 25, value: 50, weight: 1 },
        medium: { width: 40, height: 40, value: 200, weight: 2 },
        large: { width: 60, height: 60, value: 500, weight: 3 }
      },
      color: '#FFD700'
    },
    stone: {
      sizes: {
        small: { width: 30, height: 30, value: 10, weight: 2 },
        medium: { width: 45, height: 45, value: 25, weight: 4 },
        large: { width: 65, height: 65, value: 50, weight: 6 }
      },
      color: '#808080'
    },
    diamond: {
      sizes: {
        small: { width: 18, height: 18, value: 300, weight: 1 },
        medium: { width: 28, height: 28, value: 800, weight: 2 },
        large: { width: 40, height: 40, value: 1500, weight: 3 }
      },
      color: '#00BFFF'
    },
    bone: {
      sizes: {
        small: { width: 35, height: 15, value: 5, weight: 1 },
        medium: { width: 50, height: 20, value: 15, weight: 2 },
        large: { width: 70, height: 25, value: 30, weight: 3 }
      },
      color: '#F5F5DC'
    },
    bag: {
      sizes: {
        small: { width: 25, height: 30, value: 100, weight: 1 },
        medium: { width: 35, height: 40, value: 300, weight: 2 },
        large: { width: 50, height: 55, value: 750, weight: 3 }
      },
      color: '#8B4513'
    }
  }
  
  // 根据难度配置生成尺寸分布
  const sizeDistribution = generateSizeDistribution(difficultyConfig.sizeDistribution)
  
  Object.entries(itemCounts).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      const size = sizeDistribution[Math.floor(Math.random() * sizeDistribution.length)] as 'small' | 'medium' | 'large'
      const config = itemConfigs[type as keyof typeof itemConfigs]
      const sizeConfig = config.sizes[size]
      
      let x: number, y: number
      let attempts = 0
      const minDistance = 35 // 最小间距，稍微减少以容纳更多物品
      
      do {
        x = Math.random() * (canvasWidth - sizeConfig.width - 60) + 30
        y = Math.random() * (maxY - minY - 40) + minY + 20
        attempts++
        
        // 检查是否与现有物品重叠
        const hasCollision = items.some(item => {
          const centerX1 = x + sizeConfig.width / 2
          const centerY1 = y + sizeConfig.height / 2
          const centerX2 = item.x + item.width / 2
          const centerY2 = item.y + item.height / 2
          
          const distance = Math.sqrt(
            Math.pow(centerX1 - centerX2, 2) + 
            Math.pow(centerY1 - centerY2, 2)
          )
          
          const minRequiredDistance = (Math.max(sizeConfig.width, sizeConfig.height) + 
                                     Math.max(item.width, item.height)) / 2 + minDistance
          
          return distance < minRequiredDistance
        })
        
        if (!hasCollision) break
        
      } while (attempts < 100)
      
      const item: GameItem = {
        id: `${type}-${i}-${Date.now()}-${Math.random()}`,
        x,
        y,
        width: sizeConfig.width,
        height: sizeConfig.height,
        type: type as GameItem['type'],
        value: sizeConfig.value,
        weight: sizeConfig.weight,
        color: config.color,
        size
      }
      
      items.push(item)
    }
  })
  
  return items
}

export const getItemMultiplier = (level: number): number => {
  return 1 + (level - 1) * 0.2
}

// 使用新的难度系统获取关卡要求
export const getLevelRequirement = (level: number): number => {
  return getDifficultyConfig(level).targetScore
}