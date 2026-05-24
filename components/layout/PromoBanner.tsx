export function PromoBanner() {
  return (
    <div className="bg-corporate-dark text-white">
      <div className="container-corp flex flex-wrap items-center justify-center gap-2 py-2 text-center text-sm">
        <span>🔥 Акция: +5% к оценке золота в честь открытия!</span>
        <a
          href="#calculator"
          className="font-semibold text-gold underline-offset-4 hover:underline"
        >
          Узнать подробнее →
        </a>
      </div>
    </div>
  );
}
