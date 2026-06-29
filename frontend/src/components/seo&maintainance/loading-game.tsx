"use client";
import { useState, useEffect, useRef } from 'react';
import logo from '../../public/logo.png';

// export function LoadingGame() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     let animationFrameId: number;
//     const logoImg = new Image();
//     logoImg.src = logo;

//     const logoSize = 50;
//     let x = Math.random() * (canvas.width - logoSize);
//     let y = Math.random() * (canvas.height - logoSize);
//     let dx = (Math.random() - 0.5) * 4;
//     let dy = (Math.random() - 0.5) * 4;

//     const resizeCanvas = () => {
//       const parent = canvas.parentElement;
//       if (parent) {
//         canvas.width = parent.clientWidth;
//         canvas.height = parent.clientHeight;
//       }
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     const draw = () => {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(logoImg, x, y, logoSize, logoSize);

//       if (x + dx > canvas.width - logoSize || x + dx < 0) {
//         dx = -dx;
//       }
//       if (y + dy > canvas.height - logoSize || y + dy < 0) {
//         dy = -dy;
//       }

//       x += dx;
//       y += dy;

//       animationFrameId = window.requestAnimationFrame(draw);
//     };

//     const handleClick = (event: MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       const mouseX = event.clientX - rect.left;
//       const mouseY = event.clientY - rect.top;

//       if (mouseX > x && mouseX < x + logoSize && mouseY > y && mouseY < y + logoSize) {
//         setScore(s => s + 1);
//         dx = (Math.random() - 0.5) * 12;
//         dy = (Math.random() - 0.5) * 12;
//       }
//     };

//     logoImg.onload = draw;
//     canvas.addEventListener('click', handleClick);

//     return () => {
//       window.cancelAnimationFrame(animationFrameId);
//       window.removeEventListener('resize', resizeCanvas);
//       canvas.removeEventListener('click', handleClick);
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-48 bg-white/5 rounded-xl overflow-hidden cursor-pointer">
//       <canvas ref={canvasRef} className="w-full h-full"></canvas>
//       <div className="absolute top-2 right-3 text-white/50 text-xs font-mono select-none">
//         Score: {score}
//       </div>
//        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-xs font-sans animate-pulse select-none">
//         Loading...
//       </div>
//     </div>
//   );
// }