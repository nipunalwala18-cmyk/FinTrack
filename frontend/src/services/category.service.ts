import { api } from '../api/axios';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest, ReorderCategoryItem } from '../types/category';

export interface DeleteCategoryResponse {
  success: boolean;
  message?: string;
  requireReassignment?: boolean;
  transactionCount?: number;
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<{ success: boolean; data: Category }>('/categories', data);
    return response.data.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await api.put<{ success: boolean; data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id: string, reassignToId?: string): Promise<DeleteCategoryResponse> => {
    const response = await api.delete<DeleteCategoryResponse>(`/categories/${id}`, {
      data: { reassignToId },
    });
    return response.data;
  },

  reorderCategories: async (categories: ReorderCategoryItem[]): Promise<{ success: boolean }> => {
    const response = await api.patch<{ success: boolean }>('/categories/reorder', { categories });
    return response.data;
  },
};

export default categoryService;
