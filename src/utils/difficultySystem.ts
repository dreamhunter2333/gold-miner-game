// 难度配置系统
export interface DifficultyConfig {
  targetScore: number
  timeLimit: number
  itemDistribution: {
    gold: number
    diamond: number
    stone: number
    bone: number
    bag: number
  }
  sizeDistribution: {
    small: number
    medium: number
    large: number
  }
}

// 线性增长的目标分数计算 - 降低难度
export const calculateLevelRequirement = (level: number): number => {
  if (level === 1) return 1000
  if (level === 2) return 2000
  if (level === 3) return 3500
  if (level === 4) return 5500
  if (level === 5) return 8000
  
  // 第6关及以后：温和指数增长，公式：base * (1.25^(level-5))
  // 比之前的1.5指数增长温和很多，但仍保持递增趋势
  const base = 8000
  const growthRate = 1.25 // 每关增长25%，比之前的50%温和很多
  return Math.floor(base * Math.pow(growthRate, level - 5))
}

// 固定时间限制 - 保持60秒不变
export const calculateTimeLimit = (): number => {
  return 60 // 所有关卡都是60秒
}

// 获取关卡难度配置
export const getDifficultyConfig = (level: number): DifficultyConfig => {
  const targetScore = calculateLevelRequirement(level)
  const timeLimit = calculateTimeLimit()
  
  // 物品分布：大幅提高钻石数量，减少大石头数量
  const stoneMultiplier = Math.min(1 + (level - 1) * 0.15, 2) // 进一步降低石头增长，从0.2降到0.15，上限从2.5降到2
  const boneMultiplier = Math.min(1 + (level - 1) * 0.12, 1.8) // 进一步降低骨头增长，从0.15降到0.12，上限从2降到1.8
  const goldMultiplier = Math.max(1 - (level - 1) * 0.05, 0.7) // 减少金块减少幅度
  const diamondMultiplier = Math.min(1 + (level - 1) * 0.6, 6) // 大幅提高钻石数量
  const bagMultiplier = Math.max(1 - (level - 1) * 0.03, 0.8) // 减少钱袋减少幅度
  
  const itemDistribution = {
    gold: Math.max(Math.floor(4 * goldMultiplier), 2), // 至少2个金块
    diamond: Math.max(Math.floor(3 * diamondMultiplier), 3 + level * 2), // 从第5关开始大幅增加钻石，无上限
    stone: Math.min(Math.floor(2 * stoneMultiplier), 6), // 大幅减少石头数量：从3降到2，上限从10降到6
    bone: Math.min(Math.floor(2 * boneMultiplier), 4), // 减少最大骨头数量：从6降到4
    bag: Math.max(Math.floor(2 * bagMultiplier), 1) // 至少1个钱袋
  }
  
  // 尺寸分布：随着关卡增加，小物品略微增多，但变化不太大
  const smallRatio = Math.min(0.6 + (level - 1) * 0.02, 0.7) // 小物品比例略微增加
  const largeRatio = Math.max(0.2 - (level - 1) * 0.01, 0.15) // 大物品比例略微减少
  const mediumRatio = 1 - smallRatio - largeRatio
  
  const sizeDistribution = {
    small: smallRatio,
    medium: mediumRatio,
    large: largeRatio
  }
  
  return {
    targetScore,
    timeLimit,
    itemDistribution,
    sizeDistribution
  }
}

// 根据比例生成尺寸分布数组
export const generateSizeDistribution = (config: DifficultyConfig['sizeDistribution']): ('small' | 'medium' | 'large')[] => {
  const distribution: ('small' | 'medium' | 'large')[] = []
  const total = 100 // 总权重
  
  const smallCount = Math.floor(total * config.small)
  const mediumCount = Math.floor(total * config.medium)
  const largeCount = total - smallCount - mediumCount
  
  for (let i = 0; i < smallCount; i++) distribution.push('small')
  for (let i = 0; i < mediumCount; i++) distribution.push('medium')
  for (let i = 0; i < largeCount; i++) distribution.push('large')
  
  return distribution
}