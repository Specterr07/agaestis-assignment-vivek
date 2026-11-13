import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Employee } from '../types/employee.types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  employee: Employee | null;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  employee,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!employee) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete employee record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Employee"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">
            Are you sure you want to delete {employee.name}?
          </p>
          <p className="text-xs text-slate-500 mt-1">
            This action cannot be undone. All records associated with {employee.email} will be permanently removed.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="md"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="w-full"
          >
            Delete Record
          </Button>
        </div>
      </div>
    </Modal>
  );
};
