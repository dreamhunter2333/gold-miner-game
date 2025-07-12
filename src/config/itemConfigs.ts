import type { GameItem } from '../types/game'

export interface ItemSizeConfig {
  width: number
  height: number
  value: number
  weight: number
}

export interface ItemTypeConfig {
  sizes: Record<'small' | 'medium' | 'large', ItemSizeConfig>
  rarity: number // 0-1, higher means rarer
  colors: {
    primary: string
    secondary: string
    accent?: string
  }
}

export const ITEM_CONFIGS: Record<GameItem['type'], ItemTypeConfig> = {
  gold: {
    sizes: {
      small: { width: 25, height: 20, value: 100, weight: 3 },
      medium: { width: 40, height: 30, value: 200, weight: 5 },
      large: { width: 60, height: 45, value: 350, weight: 8 }
    },
    rarity: 0.3,
    colors: {
      primary: '#FFD700',
      secondary: '#FFA500',
      accent: '#FF8C00'
    }
  },
  
  diamond: {
    sizes: {
      small: { width: 20, height: 25, value: 300, weight: 2 },
      medium: { width: 30, height: 35, value: 600, weight: 3 },
      large: { width: 45, height: 55, value: 1000, weight: 4 }
    },
    rarity: 0.15,
    colors: {
      primary: '#E6E6FA',
      secondary: '#DDA0DD',
      accent: '#9370DB'
    }
  },
  
  stone: {
    sizes: {
      small: { width: 25, height: 25, value: 20, weight: 6 },
      medium: { width: 40, height: 40, value: 35, weight: 10 },
      large: { width: 60, height: 60, value: 50, weight: 15 }
    },
    rarity: 0.4,
    colors: {
      primary: '#696969',
      secondary: '#A0A0A0',
      accent: '#2F4F4F'
    }
  },
  
  bone: {
    sizes: {
      small: { width: 30, height: 15, value: 10, weight: 1 },
      medium: { width: 45, height: 22, value: 15, weight: 2 },
      large: { width: 60, height: 30, value: 25, weight: 3 }
    },
    rarity: 0.15,
    colors: {
      primary: '#F5F5DC',
      secondary: '#FFFACD',
      accent: '#DDD'
    }
  },

  bag: {
    sizes: {
      small: { width: 25, height: 25, value: 50, weight: 4 },
      medium: { width: 35, height: 35, value: 75, weight: 6 },
      large: { width: 50, height: 50, value: 100, weight: 8 }
    },
    rarity: 0.2,
    colors: {
      primary: '#8B4513',
      secondary: '#A0522D',
      accent: '#654321'
    }
  }
}

/**
 * Get item configuration by type and size
 */
export const getItemConfig = (type: GameItem['type'], size: GameItem['size']): ItemSizeConfig => {
  return ITEM_CONFIGS[type].sizes[size]
}

/**
 * Get item colors by type
 */
export const getItemColors = (type: GameItem['type']) => {
  return ITEM_CONFIGS[type].colors
}

/**
 * Calculate spawn probability based on level and item rarity
 */
export const calculateSpawnProbability = (
  type: GameItem['type'], 
  level: number
): number => {
  const baseRarity = ITEM_CONFIGS[type].rarity
  
  // Adjust rarity based on level
  switch (type) {
    case 'diamond':
      // Diamonds become slightly more common at higher levels
      return Math.min(baseRarity + (level - 1) * 0.02, 0.25)
    case 'gold':
      // Gold stays relatively consistent
      return baseRarity
    case 'stone':
      // Stones become more common at higher levels (increased difficulty)
      return Math.min(baseRarity + (level - 1) * 0.03, 0.6)
    case 'bone':
      // Bones remain rare but consistent
      return baseRarity
    case 'bag':
      // Bags become slightly more common at higher levels
      return Math.min(baseRarity + (level - 1) * 0.01, 0.3)
    default:
      return baseRarity
  }
}

/**
 * Generate weighted item pool for a given level
 */
export const generateItemPool = (level: number): Array<{ type: GameItem['type']; weight: number }> => {
  const itemTypes: GameItem['type'][] = ['gold', 'diamond', 'stone', 'bone', 'bag']
  
  return itemTypes.map(type => ({
    type,
    weight: calculateSpawnProbability(type, level) * 100
  }))
}