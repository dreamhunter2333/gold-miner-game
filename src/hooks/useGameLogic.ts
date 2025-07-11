import { useCallback } from 'react'
import type { Hook, GameItem } from '../types/game'

export const useGameLogic = () => {
  const checkCollision = useCallback((hook: Hook, item: GameItem): boolean => {
    const distance = Math.sqrt(
      Math.pow(hook.x - (item.x + item.width / 2), 2) + 
      Math.pow(hook.y - (item.y + item.height / 2), 2)
    )
    return distance < (Math.max(item.width, item.height) / 2 + 10)
  }, [])

  const updateHookPhysics = useCallback((hook: Hook) => {
    if (hook.isSwinging) {
      hook.angle += hook.direction * hook.swingSpeed
      if (hook.angle > Math.PI / 3) {
        hook.direction = -1
      } else if (hook.angle < -Math.PI / 3) {
        hook.direction = 1
      }
    }
  }, [])

  const calculateHookSpeed = useCallback((item: GameItem): number => {
    const baseSpeed = 8
    const weightFactor = item.weight * 0.5 // 重量影响因子
    const sizeFactor = (item.width + item.height) / 80 // 尺寸影响因子
    
    // 计算最终速度，最小速度为1，最大为基础速度
    return Math.max(1, baseSpeed - weightFactor - sizeFactor)
  }, [])

  return {
    checkCollision,
    updateHookPhysics,
    calculateHookSpeed
  }
}