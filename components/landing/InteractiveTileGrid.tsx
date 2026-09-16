'use client';

import React, { useEffect, useRef } from 'react';

interface InteractiveTileGridProps {
  className?: string;
  tileSize?: number;
  gap?: number;
}

export default function InteractiveTileGrid({
  className = '',
  tileSize = 38,
  gap = 6,
}: InteractiveTileGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    interface Tile {
      x: number;
      y: number;
      size: number;
      intensity: number; // 0 (idle) to 1.0 (active hover)
      decaySpeed: number;
      hue: number; // 265 (violet), 275 (purple), 195 (cyan), 250 (indigo)
      baseAlpha: number;
    }

    let tiles: Tile[] = [];

    const initTiles = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      const cols = Math.ceil(width / (tileSize + gap)) + 1;
      const rows = Math.ceil(height / (tileSize + gap)) + 1;
      tiles = [];

      const hues = [265, 275, 285, 295, 195, 245]; // Violet, purple, cyan, indigo

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * (tileSize + gap);
          const y = r * (tileSize + gap);
          const baseAlpha = 0.02 + Math.random() * 0.035;
          const hue = hues[Math.floor(Math.random() * hues.length)];

          tiles.push({
            x,
            y,
            size: tileSize,
            intensity: 0,
            decaySpeed: 0.018 + Math.random() * 0.015,
            hue,
            baseAlpha,
          });
        }
      }
    };

    initTiles();

    const handleResize = () => {
      initTiles();
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      const hoverRadius = tileSize * 2.3;

      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const cx = t.x + t.size / 2;
        const cy = t.y + t.size / 2;
        const dist = Math.hypot(cx - mouseX, cy - mouseY);

        if (dist < hoverRadius) {
          const boost = Math.pow(1 - dist / hoverRadius, 1.3);
          t.intensity = Math.max(t.intensity, boost * 1.15);
        }
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Random ambient pulse
      if (frameCount % 16 === 0 && tiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * tiles.length);
        if (tiles[randomIndex].intensity < 0.1) {
          tiles[randomIndex].intensity = 0.4 + Math.random() * 0.4;
        }
      }

      // Draw tiles
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];

        if (t.intensity > 0.001) {
          t.intensity -= t.decaySpeed;
          if (t.intensity < 0) t.intensity = 0;
        }

        const rad = 5;
        const currentIntensity = t.intensity;

        if (currentIntensity > 0.05) {
          const alpha = Math.min(1, t.baseAlpha + currentIntensity * 0.85);
          ctx.save();
          ctx.shadowColor = `hsla(${t.hue}, 90%, 65%, ${currentIntensity * 0.75})`;
          ctx.shadowBlur = 14 * currentIntensity;
          ctx.fillStyle = `hsla(${t.hue}, 85%, 62%, ${alpha})`;

          ctx.beginPath();
          ctx.roundRect(t.x, t.y, t.size, t.size, rad);
          ctx.fill();

          ctx.strokeStyle = `hsla(${t.hue}, 95%, 75%, ${Math.min(1, currentIntensity * 0.95)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${t.baseAlpha})`;
          ctx.beginPath();
          ctx.roundRect(t.x, t.y, t.size, t.size, rad);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [tileSize, gap]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto block h-full w-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
