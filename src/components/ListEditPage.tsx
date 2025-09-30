import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface TaskList {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface ListEditPageProps {
  list: TaskList;
  onBack: () => void;
  onDelete: (listId: number) => void;
}

export default function ListEditPage({ list, onBack, onDelete }: ListEditPageProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
      onDelete(list.id);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-medium">Edit List</h1>
        <div className="w-8"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <label htmlFor="listName" className="block text-sm font-medium text-gray-700">
            List Name
          </label>
          <input
            type="text"
            id="listName"
            value={list.name}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="listDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="listDescription"
            value={list.description}
            readOnly
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete List
        </Button>
      </div>
    </div>
  );
}
