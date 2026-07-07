"use client";

import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  swaySpeed: number;
  swayAmount: number;
  phase: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

interface Ambient {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const bubbles: Bubble[] = [];
    const trail: TrailPoint[] = [];
    const ambients: Ambient[] = [];

    // Create initial ambient background bubbles
    const ambientCount = 25;
    for (let i = 0; i < ambientCount; i++) {
      ambients.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.1,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.12 + 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    let lastX = 0;
    let lastY = 0;
    const spawnThreshold = 12; // px distance to spawn particles

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dist = Math.hypot(x - lastX, y - lastY);

      // Register cursor coordinates for trail
      trail.push({
        x,
        y,
        age: 0,
        maxAge: 35,
      });

      if (trail.length > 50) {
        trail.shift();
      }

      if (dist > spawnThreshold) {
        const count = Math.min(Math.floor(dist / spawnThreshold), 2);
        for (let i = 0; i < count; i++) {
          const t = i / count;
          const px = lastX + (x - lastX) * t;
          const py = lastY + (y - lastY) * t;

          bubbles.push({
            x: px + (Math.random() - 0.5) * 8,
            y: py + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -Math.random() * 0.8 - 0.3,
            radius: Math.random() * 4 + 1.5,
            alpha: 0.45,
            decay: Math.random() * 0.01 + 0.005,
            swaySpeed: Math.random() * 0.03 + 0.015,
            swayAmount: Math.random() * 1.0 + 0.3,
            phase: Math.random() * Math.PI * 2,
          });
        }

        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const animate = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Ambient (depth)
      for (let i = ambients.length - 1; i >= 0; i--) {
        const p = ambients[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(time + p.phase) * 0.15;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(6, 182, 212, ${p.alpha})`);
        grad.addColorStop(1, `rgba(34, 197, 94, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw Bubbles (cursor tail)
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y += b.vy;
        b.x += b.vx + Math.sin(time * 2 + b.phase) * b.swayAmount;
        b.alpha -= b.decay;

        if (b.alpha <= 0) {
          bubbles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        const isCyan = b.phase > Math.PI;
        if (isCyan) {
          grad.addColorStop(0, `rgba(6, 182, 212, ${b.alpha})`);
          grad.addColorStop(1, `rgba(6, 182, 212, 0)`);
        } else {
          grad.addColorStop(0, `rgba(34, 197, 94, ${b.alpha})`);
          grad.addColorStop(1, `rgba(34, 197, 94, 0)`);
        }

        ctx.fillStyle = grad;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update trail point ages
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age >= trail[i].maxAge) {
          trail.splice(i, 1);
        }
      }

      // Draw fluid mouse trail ribbon (consistent fading trail)
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const p1 = trail[i - 1];
          const p2 = trail[i];

          const ratio = i / trail.length;
          const ageFade = 1 - (p2.age / p2.maxAge);
          const alpha = ratio * ageFade * 0.35;
          const width = ratio * ageFade * 14 + 1;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = width * 0.45;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.7})`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
    />
  );
}
