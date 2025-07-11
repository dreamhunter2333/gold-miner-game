import { useEffect, useRef, useState } from 'react'
import GameCanvas from './components/GameCanvas'
import GameUI from './components/GameUI'
import type { GameState } from './types/game'
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
  const gameLoopRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (gameState.isGameRunning && !gameState.isPaused) {
      gameLoopRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 0) {
            // 时间结束时检查是否达到目标分数
            if (prev.score >= prev.targetScore) {
              // 达到目标分数，进入下一关
              const newLevel = prev.level + 1
              const newTargetScore = newLevel * 1000
              
              // 显示toast提示
              setToastMessage(`🎉 恭喜过关！进入第 ${newLevel} 关`)
              setTimeout(() => {
                setToastMessage('')
              }, 3000)
              
              return {
                ...prev,
                level: newLevel,
                targetScore: newTargetScore,
                timeRemaining: 60 // 重置时间为60秒
              }
            } else {
              // 未达到目标分数，游戏结束
              return {
                ...prev,
                isGameRunning: false,
                isGameOver: true
              }
            }
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          }
        })
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
  }, [gameState.isGameRunning, gameState.isPaused])

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isGameRunning: true,
      isGameOver: false,
      timeRemaining: 60,
      score: 0
    }))
  }

  const pauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }))
  }

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      targetScore: 1000,
      timeRemaining: 60,
      isGameRunning: false,
      isGameOver: false,
      isPaused: false
    })
  }

  const updateScore = (points: number) => {
    setGameState(prev => {
      const newScore = prev.score + points
      
      return {
        ...prev,
        score: newScore
      }
    })
  }

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
