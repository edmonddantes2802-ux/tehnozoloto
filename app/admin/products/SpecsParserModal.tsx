'use client';

import { useEffect, useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { parseSpecs, type SpecPair } from '@/lib/parse-specs';

const SAMPLE = `Мощность:
780 Вт
Энергия удара:
2.4 Дж
Тип крепления бура:
SDS-plus
Максимальный крутящий момент:
32 Н·м`;

export function SpecsParserModal({
  onClose,
  onApply,
  existingCount,
}: {
  onClose: () => void;
  onApply: (pairs: SpecPair[], mode: 'replace' | 'append') => void;
  existingCount: number;
}) {
  const [text, setText] = useState('');
  const [pairs, setPairs] = useState<SpecPair[]>([]);
  const [parsed, setParsed] = useState(false);
  const [mode, setMode] = useState<'replace' | 'append'>(
    existingCount > 0 ? 'append' : 'replace'
  );

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function doParse() {
    const result = parseSpecs(text);
    setPairs(result);
    setParsed(true);
  }

  function updatePair(idx: number, key: string, value: string) {
    setPairs((s) => s.map((p, i) => (i === idx ? { key, value } : p)));
  }
  function removePair(idx: number) {
    setPairs((s) => s.filter((_, i) => i !== idx));
  }

  function apply() {
    const cleaned = pairs.filter((p) => p.key.trim() && p.value.trim());
    if (cleaned.length === 0) return;
    onApply(cleaned, mode);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-card bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-corporate-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Wand2 size={20} className="text-gold" />
            <h2 className="text-lg font-semibold">Импорт характеристик из текста</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-9 w-9 items-center justify-center rounded-full text-corporate-gray hover:bg-corporate-bg"
          >
            <X size={20} />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {!parsed ? (
            <>
              <p className="mb-3 text-sm text-corporate-gray">
                Вставьте текст характеристик с любого сайта (DNS, M.Video, Avito,
                Yandex.Маркет, Wikipedia, инструкция к товару). Поддерживаются
                форматы: <code>Параметр: значение</code>,{' '}
                <code>Параметр — значение</code>, разделение табом, а также
                «параметр на одной строке, значение на следующей».
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                placeholder={SAMPLE}
                className="w-full rounded-corp border border-corporate-border bg-white p-3 font-mono text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setText(SAMPLE)}
                  className="text-sm text-corporate-gray hover:text-gold"
                >
                  Подставить пример
                </button>
                <Button type="button" onClick={doParse} disabled={!text.trim()}>
                  Распознать →
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-corporate-gray">
                  Распознано пар: <strong>{pairs.length}</strong>. Можно
                  поправить значения или удалить лишние строки.
                </div>
                {existingCount > 0 && (
                  <div className="flex gap-2 text-xs">
                    <label
                      className={`cursor-pointer rounded border px-2 py-1 ${mode === 'replace' ? 'border-gold bg-gold/10 font-semibold' : 'border-corporate-border'}`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        checked={mode === 'replace'}
                        onChange={() => setMode('replace')}
                      />
                      Заменить ({existingCount})
                    </label>
                    <label
                      className={`cursor-pointer rounded border px-2 py-1 ${mode === 'append' ? 'border-gold bg-gold/10 font-semibold' : 'border-corporate-border'}`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        checked={mode === 'append'}
                        onChange={() => setMode('append')}
                      />
                      Дополнить
                    </label>
                  </div>
                )}
              </div>

              {pairs.length === 0 ? (
                <div className="rounded-corp border border-dashed border-corporate-border bg-corporate-bg p-6 text-center text-sm text-corporate-muted">
                  Не получилось ничего распознать. Вернитесь и попробуйте другой
                  формат — обычно нужно одно «название: значение» на строку.
                </div>
              ) : (
                <div className="space-y-2">
                  {pairs.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
                      <input
                        value={p.key}
                        onChange={(e) => updatePair(idx, e.target.value, p.value)}
                        className="h-10 rounded-corp border border-corporate-border bg-white px-3 text-sm"
                      />
                      <input
                        value={p.value}
                        onChange={(e) => updatePair(idx, p.key, e.target.value)}
                        className="h-10 rounded-corp border border-corporate-border bg-white px-3 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removePair(idx)}
                        className="flex h-10 w-10 items-center justify-center rounded-corp text-corporate-gray hover:bg-danger/10 hover:text-danger"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setParsed(false)}
                >
                  ← Назад к тексту
                </Button>
                <Button type="button" onClick={apply} disabled={pairs.length === 0}>
                  Применить {pairs.length} {pairs.length === 1 ? 'пару' : 'пар'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
