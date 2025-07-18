import { useState, useCallback } from 'react'
import GameCanvas from './components/GameCanvas'
import GameUI from './components/GameUI'
import type { GameState } from './types/game'
import { useGameTimer } from './hooks'
import { getDifficultyConfig } from './utils/difficultySystem'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    targetScore: 1000,
    timeRemaining: 60,
    isGameRunning: false,
    isGameOver: false,
    isPaused: false
  })

  const [toastMessage, setToastMessage] = useState('')

  const handleTimeUpdate = useCallback((newTime: number) => {
    setGameState(prev => ({
      ...prev,
      timeRemaining: newTime
    }))
  }, [])

  const handleTimeEnd = useCallback(() => {
    setGameState(prev => {
      // 时间结束时检查是否达到目标分数
      if (prev.score >= prev.targetScore) {
        // 达到目标分数，进入下一关
        const newLevel = prev.level + 1
        const newDifficultyConfig = getDifficultyConfig(newLevel)
        
        // 显示toast提示
        setToastMessage(`🎉 恭喜过关！进入第 ${newLevel} 关`)
        setTimeout(() => {
          setToastMessage('')
        }, 3000)
        
        return {
          ...prev,
          level: newLevel,
          targetScore: newDifficultyConfig.targetScore,
          timeRemaining: newDifficultyConfig.timeLimit // 使用新的时间限制
        }
      } else {
        // 未达到目标分数，游戏结束
        return {
          ...prev,
          isGameRunning: false,
          isGameOver: true,
          timeRemaining: 0
        }
      }
    })
  }, [])

  useGameTimer({ gameState, onTimeUpdate: handleTimeUpdate, onTimeEnd: handleTimeEnd })

  const startGame = useCallback((isHardMode = false) => {
    const startLevel = isHardMode ? 5 : 1
    const initialDifficultyConfig = getDifficultyConfig(startLevel)
    setGameState(prev => ({
      ...prev,
      isGameRunning: true,
      isGameOver: false,
      timeRemaining: initialDifficultyConfig.timeLimit,
      score: 0,
      level: startLevel,
      targetScore: initialDifficultyConfig.targetScore
    }))
  }, [])

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }))
  }, [])

  const resetGame = useCallback(() => {
    const initialDifficultyConfig = getDifficultyConfig(1)
    setGameState({
      score: 0,
      level: 1,
      targetScore: initialDifficultyConfig.targetScore,
      timeRemaining: initialDifficultyConfig.timeLimit,
      isGameRunning: false,
      isGameOver: false,
      isPaused: false
    })
    setToastMessage('')
  }, [])

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }))
  }, [])

  const nextLevel = useCallback(() => {
    setGameState(prev => {
      const newLevel = prev.level + 1
      const newDifficultyConfig = getDifficultyConfig(newLevel)
      
      setToastMessage(`🎉 恭喜进入第 ${newLevel} 关！`)
      setTimeout(() => setToastMessage(''), 3000)
      
      return {
        ...prev,
        level: newLevel,
        targetScore: newDifficultyConfig.targetScore,
        timeRemaining: newDifficultyConfig.timeLimit
      }
    })
  }, [])

  const handleMouseSteal = useCallback((diamondValue: number) => {
    setGameState(prev => {
      // 显示老鼠偷钻石的提示，显示实际钻石价值
      setToastMessage(`🐭 老鼠偷走了 ${diamondValue} 分钻石！`)
      setTimeout(() => setToastMessage(''), 3000)
      
      return {
        ...prev,
        // 注意：根据需求，老鼠偷钻石时不扣除分数，只显示提示
        score: prev.score // 不扣除分数
      }
    })
  }, [])

  return (
    <div className="game-container">
      <GameUI 
        gameState={gameState}
        onStartGame={startGame}
        onPauseGame={pauseGame}
        onResetGame={resetGame}
      />
      <GameCanvas 
        gameState={gameState}
        onUpdateScore={updateScore}
        onNextLevel={nextLevel}
        onMouseSteal={handleMouseSteal}
      />
      
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default App
