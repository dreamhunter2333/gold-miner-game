import type { GameItem } from '../types/game'
import { getDifficultyConfig, generateSizeDistribution } from './difficultySystem'
import { generateItemPool, getItemConfig, getItemColors } from '../config/itemConfigs'

export const generateRandomItems = (canvasWidth: number, canvasHeight: number, level: number): GameItem[] => {
  const items: GameItem[] = []
  const minY = canvasHeight * 0.4
  const maxY = canvasHeight - 100
  
  // 使用新的物品池系统
  const itemPool = generateItemPool(level)
  const difficultyConfig = getDifficultyConfig(level)
  
  // 计算总物品数量 - 排除老鼠，老鼠由RatSystem单独管理
  const totalItemCount = difficultyConfig.itemDistribution.gold + 
                        difficultyConfig.itemDistribution.diamond + 
                        difficultyConfig.itemDistribution.stone + 
                        difficultyConfig.itemDistribution.bone + 
                        difficultyConfig.itemDistribution.bag +
                        Math.floor(level >= 3 ? (level - 2) * 2 : 0) // TNT数量
  
  const sizeDistribution = generateSizeDistribution(difficultyConfig.sizeDistribution)
  
  for (let itemIndex = 0; itemIndex < totalItemCount; itemIndex++) {
    // 根据权重随机选择物品类型
    const totalWeight = itemPool.reduce((sum, item) => sum + item.weight, 0)
    let randomWeight = Math.random() * totalWeight
    
    let selectedType: GameItem['type'] = 'gold'
    for (const poolItem of itemPool) {
      randomWeight -= poolItem.weight
      if (randomWeight <= 0) {
        selectedType = poolItem.type
        break
      }
    }
    
    const size = sizeDistribution[Math.floor(Math.random() * sizeDistribution.length)] as 'small' | 'medium' | 'large'
    const sizeConfig = getItemConfig(selectedType, size)
    const colors = getItemColors(selectedType)
    
    let x: number, y: number
    let attempts = 0
    const minDistance = 35
    
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
      id: `${selectedType}-${itemIndex}-${Date.now()}-${Math.random()}`,
      x,
      y,
      width: sizeConfig.width,
      height: sizeConfig.height,
      type: selectedType,
      value: sizeConfig.value,
      weight: sizeConfig.weight,
      color: colors.primary,
      size
    }
    
    items.push(item)
  }
  
  return items
}

export const getItemMultiplier = (level: number): number => {
  return 1 + (level - 1) * 0.2
}

// 使用新的难度系统获取关卡要求
export const getLevelRequirement = (level: number): number => {
  return getDifficultyConfig(level).targetScore
}