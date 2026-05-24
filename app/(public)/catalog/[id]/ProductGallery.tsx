'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Package, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductGallery({
  images,
  title,
}: {
  productId: string;
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const total = images.length;

  function prev() {
    if (total < 2) return;
    setActive((i) => (i - 1 + total) % total);
  }
  function next() {
    if (total < 2) return;
    setActive((i) => (i + 1) % total);
  }

  // Закрыть lightbox по Esc + блокировка скролла
  useEffect(() => {
    if (!zoom) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setZoom(false);
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, total]);

  if (total === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-card border border-corporate-border bg-corporate-bg text-corporate-muted">
        <Package size={64} strokeWidth={1.2} />
      </div>
    );
  }

  const current = images[active] ?? images[0];

  return (
    <>
      <div className="space-y-3">
        <div
          className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-card border border-corporate-border bg-white"
          onClick={() => setZoom(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current}
            src={current}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            loading="eager"
          />

          {/* Zoom hint */}
          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow transition-opacity group-hover:opacity-100">
            <ZoomIn size={18} />
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Предыдущее"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Следующее"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white">
                {active + 1} / {total}
              </div>
            </>
          )}
        </div>

        {total > 1 && (
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-5">
            {images.map((url, idx) => (
              <button
                key={url + idx}
                type="button"
                onClick={() => setActive(idx)}
                className={cn(
                  'overflow-hidden rounded-corp border-2 transition',
                  idx === active
                    ? 'border-gold'
                    : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {zoom && (
        <Lightbox
          src={current}
          alt={title}
          index={active}
          total={total}
          onClose={() => setZoom(false)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}

function Lightbox({
  src,
  alt,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  src: string;
  alt: string;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  function resetTransform() {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }

  useEffect(() => {
    resetTransform();
  }, [src]);

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    setScale((s) => Math.max(1, Math.min(s * delta, 5)));
  }

  function onMouseDown(e: React.MouseEvent) {
    if (scale <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    setPos({
      x: dragStart.current.posX + (e.clientX - dragStart.current.x),
      y: dragStart.current.posY + (e.clientY - dragStart.current.y),
    });
  }
  function onMouseUp() {
    setDragging(false);
  }

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none"
      onClick={onClose}
    >
      <div
        className="relative max-h-full max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={alt}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
            transition: dragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="max-h-[90vh] max-w-[95vw] object-contain"
          draggable={false}
          onClickCapture={(e) => {
            if (scale === 1) {
              e.stopPropagation();
              setScale(2);
            }
          }}
        />
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* Prev/Next */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущее"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            aria-label="Следующее"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Counter + hint */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        {total > 1 && (
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
            {index + 1} / {total}
          </div>
        )}
        <div className="text-xs text-white/60">
          Колесом мыши — зум · клик — увеличить · ← → — фото · Esc — закрыть
        </div>
      </div>
    </div>
  );
}
