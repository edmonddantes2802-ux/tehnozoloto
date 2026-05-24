'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { uploadProductImage } from '@/lib/supabase/storage';
import {
  PRESET_MODELS,
  searchPresets,
  CATEGORY_LABELS,
  getBrand,
  type ProductCategoryKey,
} from '@/lib/preset-models';
import type { ProductRow, ProductSpecs } from '@/types/database';
import { BrandPicker } from './BrandPicker';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategoryKey[];
const CONDITIONS = [
  { value: 'new', label: 'Новый' },
  { value: 'excellent', label: 'Отличное' },
  { value: 'good', label: 'Хорошее' },
  { value: 'fair', label: 'Удовлетворительное' },
];

const HAS_BATTERY = new Set<ProductCategoryKey>(['smartphone', 'laptop', 'tablet']);

const MAX_IMAGES = 10;

interface Props {
  initial?: ProductRow;
  action: (formData: FormData) => Promise<void>;
}

export function ProductForm({ initial, action }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [titleSuggestions, setTitleSuggestions] = useState<typeof PRESET_MODELS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [category, setCategory] = useState<ProductCategoryKey>(
    (initial?.category as ProductCategoryKey) ?? 'smartphone'
  );
  const [brand, setBrand] = useState<string>(initial?.brand ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial?.price.toString() ?? '');
  const [oldPrice, setOldPrice] = useState(initial?.old_price?.toString() ?? '');
  const [condition, setCondition] = useState(initial?.condition ?? 'good');
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [batteryHealth, setBatteryHealth] = useState(
    initial?.battery_health?.toString() ?? ''
  );

  const [specs, setSpecs] = useState<Array<[string, string]>>(
    initial?.specs
      ? Object.entries(initial.specs).map(([k, v]) => [k, String(v ?? '')])
      : []
  );

  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onTitleChange(v: string) {
    setTitle(v);
    if (v.length >= 2) {
      setTitleSuggestions(
        searchPresets(v, { category, brand: brand || undefined })
      );
      setShowSuggestions(true);
    } else {
      setTitleSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function pickPreset(preset: (typeof PRESET_MODELS)[number]) {
    setTitle(preset.title);
    setCategory(preset.category);
    setBrand(getBrand(preset));
    if (!description || description.length < preset.description.length) {
      setDescription(preset.description);
    }
    setSpecs(Object.entries(preset.specs).map(([k, v]) => [k, String(v ?? '')]));
    setShowSuggestions(false);
    toast.success('Подставил характеристики из шаблона');
  }

  function addSpecRow() {
    setSpecs((s) => [...s, ['', '']]);
  }
  function updateSpec(idx: number, key: string, value: string) {
    setSpecs((s) => s.map((row, i) => (i === idx ? [key, value] : row)));
  }
  function removeSpec(idx: number) {
    setSpecs((s) => s.filter((_, i) => i !== idx));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Можно загрузить максимум ${MAX_IMAGES} фото`);
      return;
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const f of Array.from(files)) {
        const result = await uploadProductImage(f);
        uploaded.push(result.publicUrl);
      }
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`Загружено фото: ${uploaded.length}`);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Ошибка загрузки фото'
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImages((s) => s.filter((u) => u !== url));
  }

  function moveImage(from: number, to: number) {
    setImages((s) => {
      const next = [...s];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Заполните название');
      return;
    }
    if (!price || Number(price) < 0) {
      toast.error('Укажите корректную цену');
      return;
    }
    const fd = new FormData(e.currentTarget);
    // specs и images собираем из state
    const specsObject: ProductSpecs = {};
    for (const [k, v] of specs) {
      const key = k.trim();
      const val = v.trim();
      if (key) specsObject[key] = val || null;
    }
    fd.set('specs_json', JSON.stringify(specsObject));
    fd.set('images_json', JSON.stringify(images));

    startTransition(async () => {
      try {
        await action(fd);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Ошибка сохранения');
      }
    });
  }

  const showBattery = HAS_BATTERY.has(category);

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="space-y-6"
      onDragOver={(e) => e.preventDefault()}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}

      {/* Title with autocomplete */}
      <div className="relative">
        <label className="mb-2 block text-sm font-medium">Название</label>
        <input
          name="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onFocus={() => title.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          autoComplete="off"
          placeholder="iPhone 14 Pro 256GB"
          className="h-12 w-full rounded-corp border border-corporate-border bg-white px-4 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
        {showSuggestions && titleSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-corp border border-corporate-border bg-white shadow-card-hover">
            {titleSuggestions.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => pickPreset(s)}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-corporate-bg"
              >
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-corporate-muted">{s.description}</div>
              </button>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-corporate-muted">
          Начните вводить — подскажу шаблон с характеристиками.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium">Описание</label>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Короткое описание для карточки товара"
          className="w-full rounded-corp border border-corporate-border bg-white p-4 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Price, OldPrice, Category, Condition */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Цена, ₽"
          name="price"
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <Input
          label="Старая цена, ₽ (опц.)"
          name="old_price"
          type="number"
          min="0"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
          placeholder="Зачёркнутая цена"
        />
        <div>
          <label className="mb-2 block text-sm font-medium">Категория</label>
          <select
            name="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as ProductCategoryKey);
              // При смене категории бренд сбрасываем — top-10 другой
              setBrand('');
            }}
            className="h-12 w-full rounded-corp border border-corporate-border bg-white px-4 text-base outline-none focus:border-gold"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Состояние</label>
          <select
            name="condition"
            value={condition ?? 'good'}
            onChange={(e) => setCondition(e.target.value as typeof condition)}
            className="h-12 w-full rounded-corp border border-corporate-border bg-white px-4 text-base outline-none focus:border-gold"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Brand picker */}
      <BrandPicker category={category} value={brand} onChange={setBrand} />
      <input type="hidden" name="brand" value={brand} />

      {/* Battery health — только для смартфонов / ноутбуков / планшетов */}
      {showBattery && (
        <div>
          <Input
            label="Состояние аккумулятора, %"
            name="battery_health"
            type="number"
            min="0"
            max="100"
            value={batteryHealth}
            onChange={(e) => setBatteryHealth(e.target.value)}
            placeholder="например, 85"
          />
          <p className="mt-1 text-xs text-corporate-muted">
            Пишется индивидуально для каждого экземпляра.
          </p>
        </div>
      )}

      {/* Specs */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">Характеристики</label>
          <button
            type="button"
            onClick={addSpecRow}
            className="text-xs font-semibold text-gold hover:underline"
          >
            + Добавить строку
          </button>
        </div>
        {specs.length === 0 && (
          <p className="rounded-corp border border-dashed border-corporate-border bg-corporate-bg p-4 text-sm text-corporate-muted">
            Выберите шаблон из подсказок, и характеристики подставятся.
            Можно добавить строки вручную.
          </p>
        )}
        <div className="space-y-2">
          {specs.map(([key, val], idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                value={key}
                onChange={(e) => updateSpec(idx, e.target.value, val)}
                placeholder="Параметр"
                className="h-10 rounded-corp border border-corporate-border bg-white px-3 text-sm"
              />
              <input
                value={val}
                onChange={(e) => updateSpec(idx, key, e.target.value)}
                placeholder="Значение"
                className="h-10 rounded-corp border border-corporate-border bg-white px-3 text-sm"
              />
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="flex h-10 w-10 items-center justify-center rounded-corp text-corporate-gray hover:bg-danger/10 hover:text-danger"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">
            Фотографии ({images.length} / {MAX_IMAGES})
          </label>
        </div>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed p-6 text-center transition-colors',
            dragOver
              ? 'border-gold bg-gold/10'
              : 'border-corporate-border bg-corporate-bg hover:border-gold/50'
          )}
        >
          {uploading ? (
            <Loader2 size={28} className="animate-spin text-gold" />
          ) : (
            <Upload size={28} className="text-corporate-gray" />
          )}
          <div className="text-sm font-medium">
            {uploading ? 'Загружаем…' : 'Перетащите фото сюда или нажмите'}
          </div>
          <div className="text-xs text-corporate-muted">
            JPEG/PNG. Автоматический ресайз до 1920 px и сжатие до ~88% качества.
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {images.map((url, idx) => (
              <div
                key={url}
                className="group relative overflow-hidden rounded-corp border border-corporate-border bg-white"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData('text/plain', String(idx))
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(e.dataTransfer.getData('text/plain'));
                  if (!isNaN(from) && from !== idx) moveImage(from, idx);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                {idx === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-white">
                    обложка
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-danger opacity-0 shadow group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded bg-black/40 text-white opacity-0 group-hover:opacity-100">
                  <GripVertical size={12} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish toggle + submit */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-corporate-border pt-6">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="is_published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-5 w-5 accent-gold"
          />
          <div>
            <div className="font-medium">Опубликовать на сайте</div>
            <div className="text-xs text-corporate-muted">
              Если выключено — товар будет в черновиках, не виден в каталоге.
            </div>
          </div>
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
            disabled={pending}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={pending || uploading}>
            {pending ? 'Сохраняем…' : initial ? 'Сохранить' : 'Создать товар'}
          </Button>
        </div>
      </div>
    </form>
  );
}
