"use client";

import { useEffect, useRef, useState } from "react";

const BRUSH = 28;
const REVEAL_AT = 0.4;

function drawCover(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#9a7410");
  gradient.addColorStop(0.18, "#e8c547");
  gradient.addColorStop(0.35, "#fff1a8");
  gradient.addColorStop(0.5, "#d4af37");
  gradient.addColorStop(0.68, "#f7e7a1");
  gradient.addColorStop(0.85, "#b8860b");
  gradient.addColorStop(1, "#8a6a12");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 180; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.1})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2.5, 10 + Math.random() * 55);
  }

  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = '600 18px Georgia, "Times New Roman", serif';
  ctx.fillText("Blue Top Villa", width / 2, height * 0.18);

  ctx.beginPath();
  ctx.moveTo(width * 0.22, height * 0.28);
  ctx.lineTo(width * 0.78, height * 0.28);
  ctx.strokeStyle = "rgba(17,17,17,0.45)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '800 40px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText("GOLDEN", width / 2, height * 0.42);
  ctx.fillText("TICKET", width / 2, height * 0.54);

  ctx.beginPath();
  ctx.moveTo(width * 0.22, height * 0.64);
  ctx.lineTo(width * 0.78, height * 0.64);
  ctx.stroke();

  ctx.font = '500 18px "Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.fillText("Scratch to reveal", width / 2, height * 0.78);
}

function pointerPos(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.clientWidth,
    y: ((clientY - rect.top) / rect.height) * canvas.clientHeight,
  };
}

type ScratchTicketProps = {
  offerTitle: string;
  offerSubtitle?: string | null;
  promoCode?: string | null;
  onRevealed?: () => void;
  disabled?: boolean;
};

export function ScratchTicket({
  offerTitle,
  offerSubtitle,
  promoCode,
  onRevealed,
  disabled = false,
}: ScratchTicketProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scratching = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const done = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const paint = () => {
      const cssW = wrap.clientWidth;
      const cssH = wrap.clientHeight;
      if (cssW < 10 || cssH < 10) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCover(ctx, cssW, cssH);

      done.current = false;
      setRevealed(false);
      setReady(true);
      canvas.style.opacity = "1";
      canvas.style.pointerEvents = disabled ? "none" : "auto";
    };

    paint();
    const ro = new ResizeObserver(() => {
      if (!done.current) paint();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [disabled]);

  function finishReveal() {
    const canvas = canvasRef.current;
    if (!canvas || done.current) return;
    done.current = true;
    setRevealed(true);
    onRevealed?.();

    let opacity = 1;
    const fade = () => {
      opacity -= 0.07;
      if (opacity <= 0) {
        const ctx = canvas.getContext("2d");
        ctx?.setTransform(1, 0, 0, 1, 0, 0);
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
        return;
      }
      canvas.style.opacity = String(opacity);
      requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
  }

  function erase(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas || disabled || done.current || !ready) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const dpr = canvas.width / canvas.clientWidth;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = BRUSH * 2;

    const prev = last.current;
    ctx.beginPath();
    if (prev) {
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.01, y + 0.01);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    last.current = { x, y };

    if (done.current) return;
    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = sample;
    let clear = 0;
    const step = 32;
    for (let i = 3; i < data.length; i += step) {
      if (data[i] < 40) clear += 1;
    }
    if (clear / (data.length / step) >= REVEAL_AT) finishReveal();
  }

  function start(clientX: number, clientY: number) {
    if (disabled || done.current || !ready || !canvasRef.current) return;
    scratching.current = true;
    last.current = null;
    const p = pointerPos(canvasRef.current, clientX, clientY);
    erase(p.x, p.y);
  }

  function move(clientX: number, clientY: number) {
    if (!scratching.current || !canvasRef.current) return;
    const p = pointerPos(canvasRef.current, clientX, clientY);
    erase(p.x, p.y);
  }

  function end() {
    scratching.current = false;
    last.current = null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return undefined;

    const onTouchStart = (e: TouchEvent) => {
      if (done.current || !ready) return;
      const t = e.touches[0];
      if (!t) return;
      scratching.current = true;
      last.current = null;
      const p = pointerPos(canvas, t.clientX, t.clientY);
      erase(p.x, p.y);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!scratching.current) return;
      const t = e.touches[0];
      if (!t) return;
      const p = pointerPos(canvas, t.clientX, t.clientY);
      erase(p.x, p.y);
    };

    const onTouchEnd = () => {
      scratching.current = false;
      last.current = null;
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });
    canvas.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [disabled, ready]);

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-[320/460] w-full max-w-sm select-none">
      <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/30 ring-1 ring-lamp/30">
        <div
          className={`absolute inset-[7%] flex flex-col items-center justify-center rounded-[18px] bg-[#1b2c38] px-5 text-center transition-opacity duration-500 ${
            revealed ? "opacity-100" : "opacity-90"
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lamp">Golden Ticket</p>
          <p className="mt-4 font-display text-5xl leading-none text-lamp">{offerTitle}</p>
          {offerSubtitle ? <p className="mt-3 text-sm leading-snug text-sand/90">{offerSubtitle}</p> : null}
          <div className="mt-5 rounded-full bg-sand px-5 py-2 text-sm font-semibold text-ink">
            {promoCode ? `Promo code: ${promoCode}` : "Revealing…"}
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          onMouseDown={(e) => start(e.clientX, e.clientY)}
          onMouseMove={(e) => move(e.clientX, e.clientY)}
          onMouseUp={end}
          onMouseLeave={end}
        />
      </div>

      {!revealed && !disabled ? (
        <p className="pointer-events-none absolute -bottom-7 left-0 right-0 text-center text-xs text-ink-soft/70">
          Scratch the gold foil
        </p>
      ) : null}
    </div>
  );
}
