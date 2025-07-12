/**
 * Abstract base class for all game renderers
 * Provides common utilities for drawing operations
 */
export abstract class BaseRenderer {
  protected static createRadialGradient(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    colors: Array<{ stop: number; color: string }>
  ): CanvasGradient {
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    colors.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
    return gradient;
  }

  protected static createLinearGradient(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    colors: Array<{ stop: number; color: string }>
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    colors.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
    return gradient;
  }

  /**
   * Execute drawing operations within a saved context
   */
  protected static withContext<T>(
    ctx: CanvasRenderingContext2D,
    callback: () => T
  ): T {
    ctx.save();
    try {
      return callback();
    } finally {
      ctx.restore();
    }
  }

  /**
   * Draw a circle with optional stroke and fill
   */
  protected static drawCircle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    options: {
      fill?: string | CanvasGradient;
      stroke?: string;
      lineWidth?: number;
    } = {}
  ): void {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    if (options.fill) {
      ctx.fillStyle = options.fill;
      ctx.fill();
    }
    
    if (options.stroke) {
      ctx.strokeStyle = options.stroke;
      ctx.lineWidth = options.lineWidth || 1;
      ctx.stroke();
    }
  }

  /**
   * Draw a rectangle with optional rounded corners
   */
  protected static drawRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    options: {
      fill?: string | CanvasGradient;
      stroke?: string;
      lineWidth?: number;
      borderRadius?: number;
    } = {}
  ): void {
    ctx.beginPath();
    
    if (options.borderRadius) {
      const radius = Math.min(options.borderRadius, width / 2, height / 2);
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
    
    if (options.fill) {
      ctx.fillStyle = options.fill;
      ctx.fill();
    }
    
    if (options.stroke) {
      ctx.strokeStyle = options.stroke;
      ctx.lineWidth = options.lineWidth || 1;
      ctx.stroke();
    }
  }

  /**
   * Draw text with shadow effect
   */
  protected static drawTextWithShadow(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    options: {
      font?: string;
      fillStyle?: string;
      shadowColor?: string;
      shadowBlur?: number;
      shadowOffsetX?: number;
      shadowOffsetY?: number;
      textAlign?: CanvasTextAlign;
      textBaseline?: CanvasTextBaseline;
    } = {}
  ): void {
    this.withContext(ctx, () => {
      if (options.font) ctx.font = options.font;
      if (options.textAlign) ctx.textAlign = options.textAlign;
      if (options.textBaseline) ctx.textBaseline = options.textBaseline;
      
      // Draw shadow
      if (options.shadowColor) {
        ctx.shadowColor = options.shadowColor;
        ctx.shadowBlur = options.shadowBlur || 0;
        ctx.shadowOffsetX = options.shadowOffsetX || 0;
        ctx.shadowOffsetY = options.shadowOffsetY || 0;
      }
      
      ctx.fillStyle = options.fillStyle || '#000';
      ctx.fillText(text, x, y);
    });
  }
}