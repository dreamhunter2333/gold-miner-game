import { useEffect, useRef, useCallback } from 'react'
import type { GameProps } from '../types/game'
import { generateRandomItems } from '../utils/itemGenerator'
import { audioManager } from '../utils/audioManager'
import { particleSystem } from '../utils/particleSystem'
import { MinerRenderer, HookRenderer, ItemRenderer, BackgroundRenderer } from './renderers'
import { useGameState, useGameLogic } from '../hooks'
import './GameCanvas.css'

const GameCanvas = ({ gameState, onUpdateScore, onNextLevel }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  
  const {
    minerRef,
    hookRef,
    itemsRef,
    initializePositions,
    resetHook,
    startHookExtension
  } = useGameState()
  
  const {
    checkCollision,
    updateHookPhysics,
    calculateHookSpeed
  } = useGameLogic()

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    initializePositions(rect.width, rect.height)

    if (itemsRef.current.length === 0) {
      itemsRef.current = generateRandomItems(rect.width, rect.height, gameState.level)
    }

    audioManager.init()
  }, [gameState.level, initializePositions])

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameState.isGameRunning || gameState.isPaused) return

    const hook = hookRef.current
    const miner = minerRef.current
    
    updateHookPhysics(hook)
    
    if (hook.isExtending) {
      hook.length += hook.speed
      if (hook.length >= hook.maxLength) {
        hook.isExtending = false
        hook.isRetracting = true
      }
      
      itemsRef.current.forEach(item => {
        if (checkCollision(hook, item) && !hook.attachedItem) {
          hook.attachedItem = item
          hook.isExtending = false
          hook.isRetracting = true
          
          // 根据物体大小和重量调整收钩速度
          hook.speed = calculateHookSpeed(item)
          
          audioManager.play('hit')
          
          particleSystem.addParticles(
            item.x + item.width / 2,
            item.y + item.height / 2,
            5,
            'sparkle',
            item.color
          )
          
          setTimeout(() => {
            switch (item.type) {
              case 'gold':
                audioManager.play('gold')
                break
              case 'diamond':
                audioManager.play('diamond')
                break
              case 'stone':
                audioManager.play('stone')
                break
              default:
                audioManager.play('collect')
            }
          }, 100)
        }
      })
    }
    
    if (hook.isRetracting) {
      hook.length -= hook.speed
      if (hook.length <= 0) {
        if (hook.attachedItem) {
          onUpdateScore(hook.attachedItem.value)
          
          const item = hook.attachedItem
          particleSystem.addParticles(
            miner.x + miner.width / 2,
            miner.y + miner.height,
            8,
            'collect',
            item.color
          )
          
          itemsRef.current = itemsRef.current.filter(item => item.id !== hook.attachedItem!.id)
          
          // 检查是否所有物品都被收集完毕
          if (itemsRef.current.length === 0) {
            // 延迟一下再进入下一关，让玩家看到收集效果
            setTimeout(() => {
              onNextLevel()
            }, 1000)
          }
        }
        resetHook()
      }
    }
    
    if (hook.attachedItem) {
      const startX = miner.x + miner.width / 2
      const startY = miner.y + miner.height
      const hookX = startX + Math.sin(hook.angle) * hook.length
      const hookY = startY + Math.cos(hook.angle) * hook.length
      
      hook.attachedItem.x = hookX - hook.attachedItem.width / 2
      hook.attachedItem.y = hookY - hook.attachedItem.height / 2
    }
  }, [gameState.isGameRunning, gameState.isPaused, onUpdateScore, onNextLevel, updateHookPhysics, checkCollision, calculateHookSpeed, resetHook])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    
    // 完全清除画布，包括所有变换和状态
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    
    // 重置所有绘制状态
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 10
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // 设置全局渲染质量
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // 绘制背景
    BackgroundRenderer.draw(ctx, rect.width, rect.height)
    
    // 绘制物品
    itemsRef.current.forEach(item => ItemRenderer.draw(ctx, item))
    
    // 绘制矿工
    MinerRenderer.draw(ctx, minerRef.current)
    MinerRenderer.drawPulleySystem(ctx, minerRef.current)
    
    // 绘制钩子（确保在最上层）
    HookRenderer.draw(ctx, hookRef.current, minerRef.current)
    
    // 绘制粒子效果
    particleSystem.update(16)
    particleSystem.draw(ctx)
    
    updateGame()
    
    if (gameState.isGameRunning) {
      animationRef.current = requestAnimationFrame(render)
    }
  }, [gameState.isGameRunning, updateGame])

  const handleCanvasClick = useCallback(() => {
    const hook = hookRef.current
    if (gameState.isGameRunning && !gameState.isPaused && hook.isSwinging) {
      startHookExtension()
      
      audioManager.resumeContext()
      audioManager.play('shoot')
    }
  }, [gameState.isGameRunning, gameState.isPaused, startHookExtension])

  useEffect(() => {
    setupCanvas()
    
    const handleResize = () => {
      setupCanvas()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setupCanvas])

  // 重新生成物品当游戏开始或重置时
  useEffect(() => {
    if (gameState.isGameRunning && !gameState.isPaused) {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const newItems = generateRandomItems(rect.width, rect.height, gameState.level)
        itemsRef.current = newItems
        resetHook() // 重置钩子状态
      }
    }
  }, [gameState.isGameRunning, gameState.level, resetHook])

  // 清空物品当游戏结束时
  useEffect(() => {
    if (gameState.isGameOver || (!gameState.isGameRunning && !gameState.isGameOver)) {
      itemsRef.current = []
      resetHook()
    }
  }, [gameState.isGameOver, gameState.isGameRunning, resetHook])

  useEffect(() => {
    if (gameState.isGameRunning && !gameState.isPaused) {
      render()
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState.isGameRunning, gameState.isPaused, render])

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        onClick={handleCanvasClick}
      />
    </div>
  )
}

export default GameCanvas