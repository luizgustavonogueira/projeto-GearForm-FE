
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService, categoryService } from '../../services/api';
import type { Category } from '../../types';
import { getApiErrorMessage } from '../../utils';
import { AppLayout, PageHeader } from '../../components/layout';
import { Input, Button, Alert, Card, Select, Textarea } from '../../components/ui';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Carrega categorias para o select
  useEffect(() => {
    categoryService.listAll()
      .then(r => setCategories(r.data))
      .catch(() => {});

    if (isEditing) {
      productService.getById(Number(id))
        .then(r => {
          const p = r.data;
          setFormData({
            name: p.name,
            description: p.description,
            price: String(p.price),
            categoryId: String(p.categoryId),
            stock: String(p.stock),
          });
        })
        .catch(err => setApiError(getApiErrorMessage(err)));
    }
  }, [id, isEditing]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.price) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Preço inválido';
    }
    if (!formData.categoryId) newErrors.categoryId = 'Selecione uma categoria';
    if (!formData.stock) {
      newErrors.stock = 'Estoque é obrigatório';
    } else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Estoque deve ser um número inteiro positivo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      categoryId: Number(formData.categoryId),
      stock: Number(formData.stock),
    };
    try {
      if (isEditing) await productService.update(Number(id), payload);
      else await productService.create(payload);
      navigate('/products');
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={isEditing ? 'Editar Produto' : 'Novo Produto'}
        subtitle={isEditing ? 'Atualize as informações do produto' : 'Cadastre um novo produto'}
      />
      <div className="max-w-lg">
        <Card className="p-6">
          {apiError && (
            <div className="mb-4">
              <Alert type="error" message={apiError} onClose={() => setApiError('')} />
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nome do produto"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />
            <Textarea
              label="Descrição"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={errors.description}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Preço (R$)"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                error={errors.price}
                required
              />
              <Input
                label="Estoque"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                error={errors.stock}
                required
              />
            </div>
            <Select
              label="Categoria"
              value={formData.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              error={errors.categoryId}
              placeholder="Selecione uma categoria"
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              required
            />
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => navigate('/products')} fullWidth>Cancelar</Button>
              <Button type="submit" isLoading={isLoading} fullWidth>
                {isEditing ? 'Salvar' : 'Criar produto'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}