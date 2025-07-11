import { useCallback } from 'react'
import type { GameState } from '../types/game'

interface UseGameControlsProps {
  gameState: GameState
  onStartGame: () => void
  onPauseGame: () => void
  onResetGame: () => void
}

export const useGameControls = ({ gameState, onStartGame, onPauseGame, onResetGame }: UseGameControlsProps) => {
  const handleStartGame = useCallback(() => {
    if (!gameState.isGameRunning) {
      onStartGame()
    }
  }, [gameState.isGameRunning, onStartGame])

  const handlePauseGame = useCallback(() => {
    if (gameState.isGameRunning) {
      onPauseGame()
    }
  }, [gameState.isGameRunning, onPauseGame])

  const handleResetGame = useCallback(() => {
    onResetGame()
  }, [onResetGame])

  const canStart = !gameState.isGameRunning
  const canPause = gameState.isGameRunning && !gameState.isPaused
  const canResume = gameState.isGameRunning && gameState.isPaused
  const canReset = gameState.isGameRunning || gameState.isGameOver

  return {
    handleStartGame,
    handlePauseGame,
    handleResetGame,
    canStart,
    canPause,
    canResume,
    canReset
  }
}