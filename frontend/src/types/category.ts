export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string | null;
  icon?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  spent?: number;
  received?: number;
}

export interface ReorderCategoryItem {
  id: string;
  sortOrder: number;
  parentId: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string | null;
  icon?: string | null;
  parentId?: string | null;
}

export interface UpdateCategoryRequest {
  name?: string;
  type?: 'INCOME' | 'EXPENSE';
  color?: string | null;
  icon?: string | null;
  parentId?: string | null;
}
