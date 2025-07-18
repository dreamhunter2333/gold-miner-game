import { useState, useEffect } from 'react'
import type { GameUIProps } from '../types/game'
import { audioManager } from '../utils/audioManager'
import './GameUI.css'

const GameUI = ({ gameState, onStartGame, onPauseGame, onResetGame }: GameUIProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    audioManager.setEnabled(soundEnabled)
  }, [soundEnabled])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (gameState.score / gameState.targetScore) * 100

  return (
    <div className="game-ui">
      <div className="game-header">
        <div className="version-section">
          <div className="version">v2.2.0</div>
        </div>
        
        <div className="score-section">
          <div className="score">
            <span className="label">分数</span>
            <span className="value">{gameState.score.toLocaleString()}</span>
          </div>
          <div className="level">
            <span className="label">关卡</span>
            <span className="value">{gameState.level}</span>
          </div>
        </div>
        
        <div className="timer-section">
          <div className="timer">
            <span className="label">时间</span>
            <span className={`value ${gameState.timeRemaining <= 10 ? 'warning' : ''}`}>
              {formatTime(gameState.timeRemaining)}
            </span>
          </div>
          <button 
            className={`sound-toggle ${soundEnabled ? 'enabled' : 'disabled'}`}
            onClick={toggleSound}
            title={soundEnabled ? '关闭音效' : '开启音效'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-label">
            目标: {gameState.targetScore.toLocaleString()}
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="game-controls">
        {gameState.isGameRunning && (
          <button className="btn btn-pause" onClick={onPauseGame}>
            {gameState.isPaused ? '继续' : '暂停'}
          </button>
        )}
        
        {(gameState.isGameRunning || gameState.isGameOver) && (
          <button className="btn btn-reset" onClick={onResetGame}>
            重新开始
          </button>
        )}
      </div>

      {!gameState.isGameRunning && !gameState.isGameOver && (
        <div className="start-game-overlay">
          <div className="start-game-content">
            <h2>🏆 黄金矿工</h2>
            <div className="start-game-rules">
              <p>📋 游戏说明：</p>
              <p>• 点击屏幕发射抓钩</p>
              <p>• 抓取黄金和宝石获得分数</p>
              <p>• 💎 钻石 = 高分值</p>
              <p>• 🏆 金块 = 中分值</p>
              <p>• 🪨 石头 = 低分值</p>
              <p>• 物品重量影响收回速度</p>
              <p>• 在时间结束前达到目标分数</p>
            </div>
<div className="start-game-buttons">
              <button className="btn btn-start-large" onClick={() => onStartGame(false)}>
                普通模式
              </button>
              <button className="btn btn-hard-large" onClick={() => onStartGame(true)}>
                🔥 困难模式
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>🎮 游戏结束</h2>
            <div className="game-stats">
              <p>最终得分: <span className="highlight">{gameState.score.toLocaleString()}</span></p>
              <p>达到关卡: <span className="highlight">{gameState.level}</span></p>
              <p>目标分数: <span className="highlight">{gameState.targetScore.toLocaleString()}</span></p>
            </div>
            <button className="btn btn-restart-large" onClick={onResetGame}>
              再来一局
            </button>
          </div>
        </div>
      )}

      {gameState.isPaused && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h2>⏸️ 游戏暂停</h2>
            <div className="pause-stats">
              <p>当前分数: <span className="highlight">{gameState.score.toLocaleString()}</span></p>
              <p>剩余时间: <span className="highlight">{formatTime(gameState.timeRemaining)}</span></p>
            </div>
            <button className="btn btn-resume-large" onClick={onPauseGame}>
              继续游戏
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameUI