import { z } from 'zod';

// ============================================================
// Schemas de validação (Zod)
// ============================================================

// Login
export const LoginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z
    .string()
    .min(8, 'Senha deve ter mínimo 8 caracteres')
    .max(128, 'Senha muito longa')
});

// Register
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Nome contém caracteres inválidos'),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z
    .string()
    .min(8, 'Senha deve ter mínimo 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/[A-Z]/, 'Deve conter maiúscula')
    .regex(/[0-9]/, 'Deve conter número')
    .regex(/[^a-zA-Z0-9]/, 'Deve conter caractere especial'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não correspondem',
  path: ['confirmPassword']
});

// Post
export const CreatePostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post não pode estar vazio')
    .max(5000, 'Post muito longo'),
  communityId: z
    .string()
    .uuid('Community ID inválido')
    .optional()
});

// Community
export const CreateCommunitySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  description: z
    .string()
    .min(10, 'Descrição deve ter mínimo 10 caracteres')
    .max(500, 'Descrição muito longa'),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória')
});

// ============================================================
// Sanitização (Previne XSS)
// ============================================================

export function sanitizeHtml(dirty: string): string {
  // Remove tags HTML perigosas
  const temp = document.createElement('div');
  temp.textContent = dirty;
  return temp.innerHTML;
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Apenas http/https permitidos
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    return '/'; // Fallback seguro
  }
}

// ============================================================
// Validação de requests
// ============================================================

export async function validateRequest<T>(
  data: unknown,
  schema: z.ZodSchema
): Promise<T> {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log para debugging (sem dados sensíveis)
      console.error('Validation error:', error.issues.map(i => i.message));
      throw new Error('Dados inválidos');
    }
    throw error;
  }
}

// ============================================================
// Error Handling
// ============================================================

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export function handleApiError(error: any): ApiError {
  // Axios error
  if (error.response) {
    const status = error.response.status;

    // Tratar cada status code
    switch (status) {
      case 400:
        return {
          message: 'Dados inválidos',
          code: 'INVALID_INPUT',
          statusCode: 400
        };
      case 401:
        return {
          message: 'Não autenticado',
          code: 'UNAUTHORIZED',
          statusCode: 401
        };
      case 403:
        return {
          message: 'Sem permissão',
          code: 'FORBIDDEN',
          statusCode: 403
        };
      case 404:
        return {
          message: 'Não encontrado',
          code: 'NOT_FOUND',
          statusCode: 404
        };
      case 429:
        return {
          message: 'Muitas requisições. Tente novamente em alguns minutos.',
          code: 'RATE_LIMITED',
          statusCode: 429
        };
      case 500:
        // ❌ NUNCA exponha erro interno
        return {
          message: 'Erro no servidor. Tente novamente mais tarde.',
          code: 'SERVER_ERROR',
          statusCode: 500
        };
      default:
        return {
          message: 'Erro desconhecido',
          code: 'UNKNOWN_ERROR',
          statusCode: status
        };
    }
  }

  // Network error
  if (error.message === 'Network Error') {
    return {
      message: 'Erro de conexão. Verifique sua internet.',
      code: 'NETWORK_ERROR'
    };
  }

  // Unknown error
  return {
    message: 'Algo deu errado. Tente novamente.',
    code: 'UNKNOWN_ERROR'
  };
}
