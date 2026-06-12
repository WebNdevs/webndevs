import React, { useState, useEffect, useRef } from 'react';

const logoSvg = `
<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#22C55E"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <path fill="url(#g)" d="M50 0L95.1 27.5V82.5L50 110L4.9 82.5V27.5L50 0Z" transform="scale(0.8) translate(12, 0)"/>
  <text x="50" y="62" font-family="sans-serif" font-size="40" fill="white" text-anchor="middle" font-weight="bold">WD</text>
</svg>
`;

export function LoadingGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const logoImg = new Image();
    logoImg.src = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

    const logoSize = 50;
    let x = Math.random() * ((canvas.parentElement?.clientWidth || 300) - logoSize);
    let y = Math.random() * ((canvas.parentElement?.clientHeight || 200) - logoSize);
    let dx = (Math.random() - 0.5) * 3;
    let dy = (Math.random() - 0.5) * 3;

    const draw = () => {
      if (!ctx || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(logoImg, x, y, logoSize, logoSize);

      if (x + dx > canvas.width - logoSize || x + dx < 0) dx = -dx;
      if (y + dy > canvas.height - logoSize || y + dy < 0) dy = -dy;

      x += dx;
      y += dy;

      animationFrameId = window.requestAnimationFrame(draw);
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (mouseX > x && mouseX < x + logoSize && mouseY > y && mouseY < y + logoSize) {
        setScore(s => s + 1);
        dx = (Math.random() - 0.5) * 10;
        dy = (Math.random() - 0.5) * 10;
      }
    };

    logoImg.onload = draw;
    canvas.addEventListener('click', handleClick);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="relative w-full h-48 bg-bg-faint rounded-corner-md overflow-hidden cursor-pointer">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <div className="absolute top-2 right-3 text-text-tertiary text-video-title font-mono select-none">Score: {score}</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-text-tertiary text-label-sm animate-pulse select-none">Loading...</div>
    </div>
  );
}