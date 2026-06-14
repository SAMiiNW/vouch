'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft neumorphic "trust radar": concentric extruded rings that gently pulse
 * outward, drawn with layered light/dark strokes to read as soft extrusions on
 * a pale surface. rAF, dpr-aware, paused when hidden, prefers-reduced-motion safe.
 */
export function TrustRadar() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let t = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const RINGS = 7;

    const drawRing = (cx: number, cy: number, r: number, alpha: number) => {
      if (r <= 1) return;
      // dark shadow stroke (bottom-right offset)
      ctx.beginPath();
      ctx.arc(cx + 1.5, cy + 1.5, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(176,183,201,${0.55 * alpha})`;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      // light highlight stroke (top-left offset)
      ctx.beginPath();
      ctx.arc(cx - 1.5, cy - 1.5, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.9 * alpha})`;
      ctx.lineWidth = 2.4;
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const maxR = Math.min(w, h) * 0.46;

      // static extruded base rings
      for (let i = 1; i <= RINGS; i++) {
        const r = (i / RINGS) * maxR;
        drawRing(cx, cy, r, 0.5);
      }

      // pulsing wavefront expanding outward
      const phase = (t * 0.00035) % 1;
      for (let k = 0; k < 2; k++) {
        const p = (phase + k * 0.5) % 1;
        const r = p * maxR;
        const alpha = (1 - p) * 0.9;
        // periwinkle-to-mint tinted pulse
        const mix = p;
        const cr = Math.round(124 + (84 - 124) * mix);
        const cg = Math.round(131 + (214 - 131) * mix);
        const cb = Math.round(255 + (180 - 255) * mix);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.55})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // soft accent core
      const coreR = maxR * 0.12 + Math.sin(t * 0.0016) * 4;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR + 10);
      grad.addColorStop(0, 'rgba(124,131,255,0.55)');
      grad.addColorStop(1, 'rgba(84,214,180,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, coreR + 10, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // sweeping radar hand
      const ang = t * 0.0007;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR);
      ctx.strokeStyle = 'rgba(90,98,230,0.28)';
      ctx.lineWidth = 2;
      ctx.stroke();

      t += 16;
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    };

    resize();
    if (!reduce) raf = requestAnimationFrame(draw);
    else draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden="true" />;
}
