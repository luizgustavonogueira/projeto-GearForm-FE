// src/pages/users/UserFormPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService, authService } from '../../services/api';
import { isValidEmail, isValidCPF, formatCPF, getPasswordStrength, getApiErrorMessage } from '../../utils';
import { AppLayout, PageHeader } from '../../components/layout';
import { Input, Button, Alert, Card } from '../../components/ui';

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    const fetchUser = async () => {
      try {
        const response = await userService.getById(Number(id));
        const user = response.data;
        setFormData({
          name: user.name,
          email: user.email,
          cpf: user.cpf ? formatCPF(user.cpf) : '',
          password: '',
          confirmPassword: '',
        });
      } catch (err) {
        setApiError(getApiErrorMessage(err));
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [id, isEditing]);

  const handleChange = (field: string, value: string) => {
    const formatted = field === 'cpf' ? formatCPF(value) : value;
    setFormData(prev => ({ ...prev, [field]: formatted }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';

    if (!isEditing) {
      if (!formData.email) {
        newErrors.email = 'E-mail é obrigatório';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!isValidCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (getPasswordStrength(formData.password).score < 3) {
        newErrors.password = 'Senha fraca. Use letras maiúsculas, números e símbolos';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    } else if (formData.password) {
      if (getPasswordStrength(formData.password).score < 3) {
        newErrors.password = 'Senha fraca. Use letras maiúsculas, números e símbolos';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      const payload: Partial<{ name: string; email: string; cpf: string; password: string }> = {
        name: formData.name,
        cpf: formData.cpf.replace(/\D/g, ''),
      };
      if (!isEditing) {
        payload.email = formData.email;
        payload.password = formData.password;
      } else if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing) {
        await userService.update(Number(id), payload);
      } else {
        await authService.register({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf.replace(/\D/g, ''),
          password: formData.password,
        });
      }
      navigate('/users');
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-16 text-gray-400">Carregando...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        subtitle={isEditing ? 'Atualize os dados do usuário' : 'Preencha os dados para criar um novo usuário'}
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
              label="Nome completo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              disabled={isEditing}
              required={!isEditing}
            />

            <Input
              label="CPF"
              value={formData.cpf}
              onChange={(e) => handleChange('cpf', e.target.value)}
              error={errors.cpf}
              maxLength={14}
              required
            />

            <Input
              label={isEditing ? 'Nova senha (opcional)' : 'Senha'}
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              required={!isEditing}
            />

            <Input
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required={!isEditing}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => navigate('/users')} fullWidth>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading} fullWidth>
                {isEditing ? 'Salvar' : 'Criar usuário'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}