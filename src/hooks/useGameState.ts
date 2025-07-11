import { useCallback, useRef } from 'react'
import type { Miner, Hook, GameItem } from '../types/game'

export const useGameState = () => {
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

  const initializePositions = useCallback((canvasWidth: number, canvasHeight: number) => {
    minerRef.current.x = canvasWidth / 2 - minerRef.current.width / 2
    minerRef.current.y = 50
    hookRef.current.x = minerRef.current.x + minerRef.current.width / 2
    hookRef.current.y = minerRef.current.y + minerRef.current.height
    hookRef.current.maxLength = Math.max(canvasHeight - 100, 400)
  }, [])

  const resetHook = useCallback(() => {
    hookRef.current.length = 0
    hookRef.current.isRetracting = false
    hookRef.current.isSwinging = true
    hookRef.current.speed = 8
    hookRef.current.attachedItem = undefined
  }, [])

  const startHookExtension = useCallback(() => {
    hookRef.current.isSwinging = false
    hookRef.current.isExtending = true
    hookRef.current.length = 0
  }, [])

  return {
    minerRef,
    hookRef,
    itemsRef,
    initializePositions,
    resetHook,
    startHookExtension
  }
}