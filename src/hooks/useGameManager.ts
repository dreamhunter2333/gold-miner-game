import { useState, useCallback } from 'react'
import type { GameState } from '../types/game'
import { calculateLevelRequirement } from '../utils/difficultySystem'

export interface GameManager {
  gameState: GameState
  toastMessage: string
  actions: {
    startGame: () => void
    pauseGame: () => void
    resetGame: () => void
    updateScore: (points: number) => void
    progressToNextLevel: () => void
    handleTimeEnd: () => void
    showToast: (message: string, duration?: number) => void
  }
}

export const useGameManager = (): GameManager => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    targetScore: calculateLevelRequirement(1),
    timeRemaining: 60,
    isGameRunning: false,
    isPaused: false,
    isGameOver: false,
  })

  const [toastMessage, setToastMessage] = useState('')

  const startGame = useCallback((isHardMode = false) => {
    setGameState(prev => ({
      ...prev,
      isGameRunning: true,
      isPaused: false,
      isGameOver: false,
      level: isHardMode ? 5 : 1,
      targetScore: calculateLevelRequirement(isHardMode ? 5 : 1),
    }))
  }, [])

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      level: 1,
      targetScore: calculateLevelRequirement(1),
      timeRemaining: 60,
      isGameRunning: false,
      isPaused: false,
      isGameOver: false,
    })
  }, [])

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
    }))
  }, [])

  const progressToNextLevel = useCallback(() => {
    setGameState(prev => {
      const nextLevel = prev.level + 1
      const nextTargetScore = calculateLevelRequirement(nextLevel)
      
      return {
        ...prev,
        level: nextLevel,
        targetScore: nextTargetScore,
        timeRemaining: 60, // Reset time for new level
      }
    })
  }, [])

  const handleTimeEnd = useCallback(() => {
    setGameState(prev => {
      if (prev.score >= prev.targetScore) {
        // Level completed
        const nextLevel = prev.level + 1
        const nextTargetScore = calculateLevelRequirement(nextLevel)
        
        return {
          ...prev,
          level: nextLevel,
          targetScore: nextTargetScore,
          timeRemaining: 60,
        }
      } else {
        // Game over
        return {
          ...prev,
          isGameRunning: false,
          isGameOver: true,
        }
      }
    })
  }, [])

  const showToast = useCallback((message: string, duration = 3000) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), duration)
  }, [])

  // Check for level completion when score changes
  // const checkLevelCompletion = useCallback(() => {
  //   if (gameState.score >= gameState.targetScore && gameState.isGameRunning) {
  //     showToast(`🎉 恭喜通过第${gameState.level}关！`, 2000)
  //     setTimeout(() => {
  //       progressToNextLevel()
  //     }, 2000)
  //   }
  // }, [gameState.score, gameState.targetScore, gameState.level, gameState.isGameRunning, showToast, progressToNextLevel])

  return {
    gameState,
    toastMessage,
    actions: {
      startGame,
      pauseGame,
      resetGame,
      updateScore,
      progressToNextLevel,
      handleTimeEnd,
      showToast,
    },
  }
}