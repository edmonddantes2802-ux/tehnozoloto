import Link from 'next/link';
import { ProductForm } from '../ProductForm';
import { createProduct } from '../actions';

export default function NewProductPage() {
  return (
    <div className="container-corp max-w-3xl py-12">
      <Link
        href="/admin/products"
        className="mb-2 inline-block text-sm text-corporate-gray hover:text-gold"
      >
        ← К списку товаров
      </Link>
      <h1 className="mb-6">Новый товар</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
