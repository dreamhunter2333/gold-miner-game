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

  const updateHookPhysics = useCallback((hook: Hook, canvasWidth: number, canvasHeight: number, minerX: number, minerWidth: number, minerY: number, minerHeight: number) => {
    if (hook.isSwinging) {
      hook.angle += hook.direction * hook.swingSpeed
      
      // 动态计算最大摆动角度，确保钩子能到达物品生成区域的所有角落
      const minerCenterX = minerX + minerWidth / 2
      const minerBottomY = minerY + minerHeight
      
      // 物品生成区域从 canvasHeight * 0.4 开始，到 canvasHeight - 100 结束
      const itemAreaTopY = canvasHeight * 0.4
      const itemAreaBottomY = canvasHeight - 100
      
      // 计算到达物品区域四个角落所需的角度
      const leftTopAngle = Math.atan2(minerCenterX - 30, itemAreaTopY - minerBottomY) // 左上角（考虑30px边距）
      const rightTopAngle = Math.atan2(canvasWidth - 30 - minerCenterX, itemAreaTopY - minerBottomY) // 右上角（考虑30px边距）
      const leftBottomAngle = Math.atan2(minerCenterX - 30, itemAreaBottomY - minerBottomY) // 左下角
      const rightBottomAngle = Math.atan2(canvasWidth - 30 - minerCenterX, itemAreaBottomY - minerBottomY) // 右下角
      
      // 取绝对值最大的角度，并增加10%余量
      const maxAngle = Math.max(
        Math.abs(leftTopAngle), 
        Math.abs(rightTopAngle), 
        Math.abs(leftBottomAngle), 
        Math.abs(rightBottomAngle)
      ) * 1.1
      
      if (hook.angle > maxAngle) {
        hook.direction = -1
      } else if (hook.angle < -maxAngle) {
        hook.direction = 1
      }
    }
  }, [])

  const calculateHookSpeed = useCallback((item: GameItem): number => {
    const baseSpeed = 8
    const weightFactor = item.weight * 0.8 // 增加重量影响因子
    const sizeFactor = (item.width + item.height) / 60 // 增加尺寸影响因子
    
    // 计算最终速度，最小速度为0.5，最大为基础速度
    return Math.max(0.5, baseSpeed - weightFactor - sizeFactor)
  }, [])

  return {
    checkCollision,
    updateHookPhysics,
    calculateHookSpeed
  }
}