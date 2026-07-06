import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import type { DeleteCategoryResponse } from '../services/category.service';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest, ReorderCategoryItem } from '../types/category';
import { toast } from 'react-hot-toast';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });
};

export const useCreateCategory = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to create category';
      toast.error(msg);
    },
  });
};

export const useUpdateCategory = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, { id: string; data: UpdateCategoryRequest }>({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update category';
      toast.error(msg);
    },
  });
};

export const useDeleteCategory = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCategoryResponse, Error, { id: string; reassignToId?: string }>({
    mutationFn: ({ id, reassignToId }) => categoryService.deleteCategory(id, reassignToId),
    onSuccess: (res) => {
      if (!res.requireReassignment) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] }); // update transaction list if reassigned/deleted
        toast.success('Category deleted successfully');
        if (onSuccessCallback) onSuccessCallback();
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to delete category';
      toast.error(msg);
    },
  });
};

export const useReorderCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, ReorderCategoryItem[], { previousCategories: Category[] | undefined }>({
    mutationFn: categoryService.reorderCategories,
    onMutate: async (newOrder) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      // Snapshot the previous categories
      const previousCategories = queryClient.getQueryData<Category[]>(['categories']);

      // Optimistically update categories cache
      if (previousCategories) {
        // Flatten categories to map quickly
        const flatCategories: any[] = [];
        const mapChildren = (cat: Category) => {
          flatCategories.push({ ...cat });
          if (cat.children) {
            cat.children.forEach(mapChildren);
          }
        };
        previousCategories.forEach(mapChildren);

        // Apply new order
        const updatedFlat = flatCategories.map((cat) => {
          const matching = newOrder.find((item) => item.id === cat.id);
          if (matching) {
            return {
              ...cat,
              sortOrder: matching.sortOrder,
              parentId: matching.parentId,
            };
          }
          return cat;
        });

        // Rebuild tree
        const rootCategories: any[] = [];
        const childrenMap = new Map<string, any[]>();

        for (const cat of updatedFlat) {
          if (cat.parentId) {
            if (!childrenMap.has(cat.parentId)) {
              childrenMap.set(cat.parentId, []);
            }
            childrenMap.get(cat.parentId)!.push(cat);
          } else {
            rootCategories.push({ ...cat, children: [] });
          }
        }

        for (const root of rootCategories) {
          const children = childrenMap.get(root.id) || [];
          root.children = children.sort((a, b) => a.sortOrder - b.sortOrder);
        }

        const sortedRoot = rootCategories.sort((a, b) => a.sortOrder - b.sortOrder);
        queryClient.setQueryData<Category[]>(['categories'], sortedRoot);
      }

      return { previousCategories };
    },
    onError: (_err, _newOrder, context) => {
      // Rollback to previous value on error
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories);
      }
      toast.error('Failed to save categories order');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
