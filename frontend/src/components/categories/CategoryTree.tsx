import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CategoryItem } from './CategoryItem';
import { useReorderCategories } from '../../hooks/useCategories';
import type { Category, ReorderCategoryItem } from '../../types/category';

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const reorderMutation = useReorderCategories();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // avoids triggering drag on simple click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 1. Gather all categories flatly to find active and over items
    const flatCategories: Category[] = [];
    const collect = (cat: Category) => {
      flatCategories.push(cat);
      if (cat.children) {
        cat.children.forEach(collect);
      }
    };
    categories.forEach(collect);

    const activeCat = flatCategories.find((c) => c.id === active.id);
    const overCat = flatCategories.find((c) => c.id === over.id);

    if (!activeCat || !overCat) return;

    // Rule: Must be of same nesting level (cannot drag root to child, or child to root)
    const isActiveRoot = !activeCat.parentId;
    const isOverRoot = !overCat.parentId;

    if (isActiveRoot !== isOverRoot) return;

    const payload: ReorderCategoryItem[] = [];

    if (isActiveRoot) {
      // Reordering root categories
      const rootIds = categories.map((c) => c.id);
      const oldIndex = rootIds.indexOf(activeCat.id);
      const newIndex = rootIds.indexOf(overCat.id);

      const reorderedRoots = arrayMove(categories, oldIndex, newIndex);
      reorderedRoots.forEach((cat, index) => {
        payload.push({
          id: cat.id,
          sortOrder: index,
          parentId: null,
        });
      });
    } else {
      // Reordering child categories. They must share the same parent.
      if (activeCat.parentId !== overCat.parentId) {
        // Dragging children between different parents is forbidden
        return;
      }

      const parent = categories.find((c) => c.id === activeCat.parentId);
      if (!parent || !parent.children) return;

      const childIds = parent.children.map((c) => c.id);
      const oldIndex = childIds.indexOf(activeCat.id);
      const newIndex = childIds.indexOf(overCat.id);

      const reorderedChildren = arrayMove(parent.children, oldIndex, newIndex);
      reorderedChildren.forEach((child, index) => {
        payload.push({
          id: child.id,
          sortOrder: index,
          parentId: parent.id,
        });
      });
    }

    if (payload.length > 0) {
      reorderMutation.mutate(payload);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-3">
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {categories.map((root) => {
            const isExpanded = !!expandedIds[root.id];
            const hasChildren = root.children && root.children.length > 0;

            return (
              <div key={root.id} className="space-y-2">
                {/* Parent Item */}
                <CategoryItem
                  category={root}
                  isExpanded={isExpanded}
                  onToggleExpand={() => toggleExpand(root.id)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />

                {/* Subcategories (sorted by sortOrder) */}
                {hasChildren && isExpanded && (
                  <div className="space-y-2 relative">
                    {/* Visual Connector Line */}
                    <div className="absolute left-[38px] top-0 bottom-3 w-0.5 bg-gray-100 dark:bg-gray-800" />
                    
                    <SortableContext
                      items={root.children!.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {root.children!.map((child) => (
                        <CategoryItem
                          key={child.id}
                          category={child}
                          isChild={true}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))}
                    </SortableContext>
                  </div>
                )}
              </div>
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};
export default CategoryTree;
