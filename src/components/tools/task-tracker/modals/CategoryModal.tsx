'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { TaskCategory, ColorKey, CATEGORY_COLORS } from '../utils';

interface CategoryModalProps {
  categories: TaskCategory[];
  onAdd: (name: string, colorKey: string) => TaskCategory;
  onUpdate: (id: string, updates: Partial<TaskCategory>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const COLOR_OPTIONS: { key: ColorKey; label: string }[] = [
  { key: 'rose', label: 'Rose' },
  { key: 'amber', label: 'Amber' },
  { key: 'emerald', label: 'Emerald' },
  { key: 'sky', label: 'Sky' },
  { key: 'violet', label: 'Violet' },
  { key: 'slate', label: 'Slate' },
  { key: 'orange', label: 'Orange' },
  { key: 'teal', label: 'Teal' },
  { key: 'pink', label: 'Pink' },
  { key: 'indigo', label: 'Indigo' },
];

export function CategoryModal({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: CategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState<ColorKey>('sky');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState<ColorKey>('sky');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    onAdd(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName('');
    setNewCategoryColor('sky');
  };

  const handleStartEdit = (category: TaskCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingColor(category.color_key);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim()) return;
    onUpdate(editingId, {
      name: editingName.trim(),
      color_key: editingColor,
    });
    setEditingId(null);
    setEditingName('');
    setEditingColor('sky');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingColor('sky');
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1">
          {/* Add New Category */}
          <div className="space-y-3 pb-4 border-b">
            <Input
              label="New Category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => {
                  const colors = CATEGORY_COLORS[color.key];
                  return (
                    <button
                      key={color.key}
                      type="button"
                      onClick={() => setNewCategoryColor(color.key)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-transform',
                        colors.bg,
                        newCategoryColor === color.key
                          ? 'border-gray-900 scale-110'
                          : 'border-transparent hover:scale-105'
                      )}
                      title={color.label}
                    />
                  );
                })}
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="w-full"
            >
              Add Category
            </Button>
          </div>

          {/* Existing Categories */}
          <div className="space-y-2 pt-4">
            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No categories yet. Add one above!
              </p>
            ) : (
              categories.map((category) => {
                const colors = CATEGORY_COLORS[category.color_key];
                const isEditing = editingId === category.id;
                const isDeleting = showDeleteConfirm === category.id;

                if (isDeleting) {
                  return (
                    <div
                      key={category.id}
                      className="p-3 rounded-lg border border-rose-200 bg-rose-50"
                    >
                      <p className="text-sm text-rose-700 mb-2">
                        Delete "{category.name}"? Tasks using this category will become uncategorized.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDelete(category.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                }

                if (isEditing) {
                  return (
                    <div
                      key={category.id}
                      className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-3"
                    >
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        placeholder="Category name"
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-2">
                        {COLOR_OPTIONS.map((color) => {
                          const colorStyles = CATEGORY_COLORS[color.key];
                          return (
                            <button
                              key={color.key}
                              type="button"
                              onClick={() => setEditingColor(color.key)}
                              className={cn(
                                'w-6 h-6 rounded-full border-2 transition-transform',
                                colorStyles.bg,
                                editingColor === color.key
                                  ? 'border-gray-900 scale-110'
                                  : 'border-transparent hover:scale-105'
                              )}
                              title={color.label}
                            />
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={handleSaveEdit}
                          disabled={!editingName.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={category.id}
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-between',
                      colors.bg,
                      colors.border
                    )}
                  >
                    <span className={cn('font-medium', colors.text)}>
                      {category.name}
                    </span>
                    <div className="flex gap-1">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit"
                        onClick={() => handleStartEdit(category)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-rose-600"
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(category.id)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
