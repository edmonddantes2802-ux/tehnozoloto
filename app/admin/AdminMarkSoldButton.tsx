'use client';

export function AdminMarkSoldButton({
  productIds,
  action,
}: {
  productIds: string[];
  action: (formData: FormData) => Promise<void>;
}) {
  if (productIds.length === 0) return null;
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Снять ${productIds.length} товар(ов) с витрины?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="product_ids" value={productIds.join(',')} />
      <button
        type="submit"
        className="rounded border border-danger/40 bg-danger/10 px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/20"
      >
        Снять с витрины
      </button>
    </form>
  );
}
