export interface GameState {
  score: number
  level: number
  targetScore: number
  timeRemaining: number
  isGameRunning: boolean
  isGameOver: boolean
  isPaused: boolean
}

export interface Position {
  x: number
  y: number
}

export interface GameItem {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'gold' | 'stone' | 'diamond' | 'bone' | 'bag' | 'tnt' | 'mouse'
  value: number
  weight: number
  color: string
  size: 'small' | 'medium' | 'large'
}

export interface Miner {
  x: number
  y: number
  width: number
  height: number
}

export interface Hook {
  x: number
  y: number
  angle: number
  length: number
  speed: number
  isExtending: boolean
  isRetracting: boolean
  isSwinging: boolean
  direction: number
  swingSpeed: number
  maxLength: number
  attachedItem?: GameItem
}

export interface GameProps {
  gameState: GameState
  onUpdateScore: (points: number) => void
  onNextLevel: () => void
  onMouseSteal: (diamondValue: number) => void // 老鼠偷钻石的回调
}

export interface GameUIProps {
  gameState: GameState
  onStartGame: (isHardMode?: boolean) => void
  onPauseGame: () => void
  onResetGame: () => void
}