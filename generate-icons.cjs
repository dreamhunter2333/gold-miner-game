const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#FFD700'); // 金色
  gradient.addColorStop(0.3, '#FFA500'); // 橙色  
  gradient.addColorStop(1, '#8B4513'); // 棕色
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // 绘制矿工相关图案
  const centerX = size / 2;
  const centerY = size / 2;
  const minerSize = size * 0.3;
  
  // 矿工帽子
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - minerSize * 0.2, minerSize * 0.8, minerSize * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 帽子灯
  ctx.fillStyle = '#FFFF00';
  ctx.beginPath();
  ctx.arc(centerX, centerY - minerSize * 0.2, minerSize * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // 矿工脸
  ctx.fillStyle = '#FDBCB4';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + minerSize * 0.1, minerSize * 0.6, minerSize * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 钩子
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = size * 0.02;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + minerSize * 0.6);
  ctx.lineTo(centerX + minerSize * 0.4, centerY + minerSize * 1.2);
  ctx.stroke();
  
  // 钩子头
  ctx.fillStyle = '#C0C0C0';
  ctx.beginPath();
  ctx.arc(centerX + minerSize * 0.4, centerY + minerSize * 1.2, size * 0.03, 0, Math.PI * 2);
  ctx.fill();
  
  // 金块
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(centerX + minerSize * 0.3, centerY + minerSize * 1.1, minerSize * 0.3, minerSize * 0.2);
  
  // 保存文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/pwa-${size}x${size}.png`, buffer);
  console.log(`Created pwa-${size}x${size}.png`);
}

// 创建所需的图标尺寸
createIcon(192);
createIcon(512);

// 创建其他需要的文件
const faviconCanvas = createCanvas(32, 32);
const faviconCtx = faviconCanvas.getContext('2d');
faviconCtx.fillStyle = '#FFD700';
faviconCtx.fillRect(0, 0, 32, 32);
faviconCtx.fillStyle = '#FF0000';
faviconCtx.fillRect(8, 4, 16, 8);
faviconCtx.fillStyle = '#FFFF00';
faviconCtx.beginPath();
faviconCtx.arc(16, 8, 3, 0, Math.PI * 2);
faviconCtx.fill();

const faviconBuffer = faviconCanvas.toBuffer('image/png');
fs.writeFileSync('public/favicon.png', faviconBuffer);
console.log('Created favicon.png');

// 创建apple-touch-icon
createIcon(180);
fs.renameSync('public/pwa-180x180.png', 'public/apple-touch-icon.png');
console.log('Created apple-touch-icon.png');