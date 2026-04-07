import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/api';
import type { Category, PaginatedResponse } from '../../types';
import { getApiErrorMessage } from '../../utils';
import { AppLayout, PageHeader } from '../../components/layout';
import { Button, Card, Alert, LoadingSpinner, EmptyState, Pagination, ConfirmModal } from '../../components/ui';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0, perPage: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await categoryService.list(page, 10);
      const data: PaginatedResponse<Category> = response.data;
      setCategories(data.data);
      setPagination({ page: data.page, lastPage: data.lastPage, total: data.total, perPage: data.perPage });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await categoryService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchCategories(pagination.page);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Categorias"
        subtitle={`${pagination.total} categoria(s) cadastrada(s)`}
        action={
          <Link to="/categories/new">
            <Button>+ Nova Categoria</Button>
          </Link>
        }
      />

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

      <Card>
        {isLoading ? <LoadingSpinner /> : categories.length === 0 ? (
          <EmptyState title="Nenhuma categoria cadastrada" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Nome', 'Descrição', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{cat.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/categories/${cat.id}/edit`}>
                            <Button variant="secondary" size="sm">Editar</Button>
                          </Link>
                          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(cat)}>Excluir</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={pagination.page}
              lastPage={pagination.lastPage}
              total={pagination.total}
              perPage={pagination.perPage}
              onPageChange={fetchCategories}
            />
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir categoria"
        message={`Excluir "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </AppLayout>
  );
}