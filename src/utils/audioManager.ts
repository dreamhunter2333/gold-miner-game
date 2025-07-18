class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private isEnabled = true

  constructor() {
    this.initAudioContext()
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  private async generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('AudioContext not available')
    }

    const sampleRate = this.audioContext.sampleRate
    const numSamples = Math.floor(sampleRate * duration)
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      let sample = 0

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t)
          break
        case 'square':
          sample = Math.sign(Math.sin(2 * Math.PI * frequency * t))
          break
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1
          break
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
          break
      }

      const envelope = Math.exp(-t * 3)
      data[i] = sample * envelope * 0.3
    }

    return buffer
  }

  async init() {
    if (!this.audioContext) return

    try {
      const sounds = {
        shoot: await this.generateTone(800, 0.1, 'square'),
        hit: await this.generateTone(400, 0.2, 'sawtooth'),
        collect: await this.generateTone(600, 0.3, 'sine'),
        gold: await this.generateTone(1200, 0.5, 'sine'),
        diamond: await this.generateTone(1600, 0.6, 'sine'),
        stone: await this.generateTone(200, 0.3, 'square'),
        swing: await this.generateTone(300, 0.1, 'triangle'),
        gameOver: await this.generateTone(150, 1.0, 'sawtooth'),
        levelUp: await this.generateTone(800, 0.8, 'sine')
      }

      Object.entries(sounds).forEach(([name, buffer]) => {
        this.sounds.set(name, buffer)
      })
    } catch (error) {
      console.warn('Failed to generate audio:', error)
    }
  }

  play(soundName: string, volume: number = 1) {
    if (!this.isEnabled || !this.audioContext || !this.sounds.has(soundName)) {
      return
    }

    try {
      const buffer = this.sounds.get(soundName)!
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      gainNode.gain.value = Math.max(0, Math.min(1, volume))
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start()
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  getEnabled(): boolean {
    return this.isEnabled
  }

  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}

export const audioManager = new AudioManager()