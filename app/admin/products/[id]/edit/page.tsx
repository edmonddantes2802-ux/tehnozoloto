import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductForm } from '../../ProductForm';
import { updateProduct, fetchProductById } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await fetchProductById(params.id);
  if (!product) notFound();

  return (
    <div className="container-corp max-w-3xl py-12">
      <Link
        href="/admin/products"
        className="mb-2 inline-block text-sm text-corporate-gray hover:text-gold"
      >
        ← К списку товаров
      </Link>
      <h1 className="mb-6">Редактирование</h1>
      <ProductForm initial={product} action={updateProduct} />
    </div>
  );
}
