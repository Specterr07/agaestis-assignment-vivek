import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput, EmployeeStatus } from '../types/employee.types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

export interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeInput | UpdateEmployeeInput) => Promise<void>;
  employeeToEdit?: Employee | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employeeToEdit,
}) => {
  const isEditing = Boolean(employeeToEdit);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [status, setStatus] = useState<EmployeeStatus>('ACTIVE');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize form values when modal opens or target changes
  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setEmail(employeeToEdit.email);
      setRole(employeeToEdit.role);
      setDepartment(employeeToEdit.department || 'Engineering');
      setStatus(employeeToEdit.status || 'ACTIVE');
      setAvatarUrl(employeeToEdit.avatarUrl || '');
    } else {
      setName('');
      setEmail('');
      setRole('');
      setDepartment('Engineering');
      setStatus('ACTIVE');
      setAvatarUrl('');
    }
    setFormErrors({});
    setApiError(null);
  }, [employeeToEdit, isOpen]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Full name is required (min 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid work email';
    }

    if (!role.trim()) {
      errors.role = 'Job title/role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
        department,
        status,
        avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : null,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setApiError(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Employee Details' : 'Add New Employee'}
      subtitle={
        isEditing
          ? `Update profile information for ${employeeToEdit?.name}`
          : 'Enter employee credentials and assign their department'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
            {apiError}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              formErrors.name
                ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600'
            }`}
          />
          {formErrors.name && (
            <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Work Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. alex.morgan@agaetis.com"
            className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              formErrors.email
                ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600'
            }`}
          />
          {formErrors.email && (
            <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
          )}
        </div>

        {/* Role & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title / Role <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Full Stack Engineer"
              className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                formErrors.role
                  ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600'
              }`}
            />
            {formErrors.role && (
              <p className="text-xs text-rose-600 mt-1">{formErrors.role}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="HR">HR & Operations</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Employment Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['ACTIVE', 'ON_LEAVE', 'TERMINATED'] as EmployeeStatus[]).map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setStatus(st)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  status === st
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st === 'ACTIVE' ? 'Active' : st === 'ON_LEAVE' ? 'On Leave' : 'Terminated'}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar URL (Optional with Live Preview and Clear Button) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Avatar Image URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl('')}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-medium"
              >
                Clear Image
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xs font-bold text-slate-400">
                  {name
                    ? name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : '?'}
                </span>
              )}
            </div>
            <div className="relative flex-1">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all pr-8"
              />
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  title="Remove image URL"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Leave blank to use automatically generated initials.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
