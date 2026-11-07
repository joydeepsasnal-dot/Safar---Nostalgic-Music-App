import React, { useEffect, useRef } from 'react';

interface RainCanvasProps {
  active: boolean;
  intensity?: number;
}

export const RainCanvas: React.FC<RainCanvasProps> = ({ active, intensity = 0.6 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const dropCount = Math.floor(100 * intensity);
    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 15,
      speed: Math.random() * 8 + 12,
      opacity: Math.random() * 0.4 + 0.1,
      angle: 0.15, // slight wind angle
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render rain drops
      ctx.lineWidth = 1.2;
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(220, 235, 255, ${d.opacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.length * d.angle, d.y + d.length);
        ctx.stroke();

        d.x += d.speed * d.angle;
        d.y += d.speed;

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + 100) - 50;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, intensity]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-70"
    />
  );
};
