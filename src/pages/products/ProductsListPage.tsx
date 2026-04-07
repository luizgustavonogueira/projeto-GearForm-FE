// =====================================================
// PÁGINA DE LISTAGEM DE PRODUTOS (CRUD)
// =====================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';
import type { Product, PaginatedResponse } from '../../types';
import { formatCurrency, getApiErrorMessage } from '../../utils';
import { AppLayout, PageHeader } from '../../components/layout';
import {
  Button, Card, Alert, LoadingSpinner,
  EmptyState, Pagination, ConfirmModal, Badge
} from '../../components/ui';

function ProductRow({ product, onDelete }: { product: Product; onDelete: (p: Product) => void }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
        <p className="truncate">{product.description}</p>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</td>
      <td className="px-4 py-3">
        <Badge color={product.stock > 0 ? 'green' : 'red'}>
          {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{product.category?.name || '—'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to={`/products/${product.id}/edit`}>
            <Button variant="secondary" size="sm">Editar</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => onDelete(product)}>Excluir</Button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0, perPage: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await productService.list(page, 10);
      const data: PaginatedResponse<Product> = response.data;
      setProducts(data.data);
      setPagination({ page: data.page, lastPage: data.lastPage, total: data.total, perPage: data.perPage });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchProducts(pagination.page);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Produtos"
        subtitle={`${pagination.total} produto(s) cadastrado(s)`}
        action={
          <Link to="/products/new">
            <Button>+ Novo Produto</Button>
          </Link>
        }
      />

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

      <Card>
        {isLoading ? <LoadingSpinner /> : products.length === 0 ? (
          <EmptyState title="Nenhum produto cadastrado" description="Clique em 'Novo Produto' para começar." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Nome', 'Descrição', 'Preço', 'Estoque', 'Categoria', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => <ProductRow key={p.id} product={p} onDelete={setDeleteTarget} />)}
                </tbody>
              </table>
            </div>
           <Pagination
  currentPage={pagination.page}
  lastPage={pagination.lastPage}
  total={pagination.total}
  perPage={pagination.perPage}
  onPageChange={fetchProducts}
/>
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir produto"
        message={`Excluir "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </AppLayout>
  );
}