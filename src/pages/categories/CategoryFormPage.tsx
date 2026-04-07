import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService } from '../../services/api';
import { getApiErrorMessage } from '../../utils';
import { AppLayout, PageHeader } from '../../components/layout';
import { Input, Button, Alert, Card, Textarea } from '../../components/ui';

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      categoryService.getById(Number(id))
        .then(r => setFormData({ name: r.data.name, description: r.data.description }))
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      if (isEditing) await categoryService.update(Number(id), formData);
      else await categoryService.create(formData);
      navigate('/categories');
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        subtitle={isEditing ? 'Atualize os dados da categoria' : 'Cadastre uma nova categoria'}
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
              label="Nome"
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
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => navigate('/categories')} fullWidth>Cancelar</Button>
              <Button type="submit" isLoading={isLoading} fullWidth>
                {isEditing ? 'Salvar' : 'Criar categoria'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}