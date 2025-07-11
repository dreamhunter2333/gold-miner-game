import { useEffect, useRef } from 'react'
import type { GameState } from '../types/game'

interface UseGameTimerProps {
  gameState: GameState
  onTimeUpdate: (newTime: number) => void
  onTimeEnd: () => void
}

export const useGameTimer = ({ gameState, onTimeUpdate, onTimeEnd }: UseGameTimerProps) => {
  const gameLoopRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (gameState.isGameRunning && !gameState.isPaused) {
      gameLoopRef.current = setInterval(() => {
        const newTime = gameState.timeRemaining - 1
        if (newTime <= 0) {
          onTimeEnd()
        } else {
          onTimeUpdate(newTime)
        }
      }, 1000)
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState.isGameRunning, gameState.isPaused, gameState.timeRemaining, onTimeUpdate, onTimeEnd])

  return gameLoopRef
}