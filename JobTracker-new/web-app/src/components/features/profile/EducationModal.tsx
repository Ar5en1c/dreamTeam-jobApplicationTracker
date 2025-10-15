import React, { useState, useEffect } from 'react';
import { Calendar, GraduationCap, School, Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import type { Education } from '@/types';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Omit<Education, 'id'>) => Promise<boolean>;
  education?: Education;
  mode: 'create' | 'edit';
}

const degreeTypes = [
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctoral Degree',
  'Professional Degree',
  'Certificate',
  'Diploma',
  'High School',
  'Other'
];

export const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  education,
  mode
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    gpa: '',
    achievements: [] as string[]
  });
  const [newAchievement, setNewAchievement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        startDate: education.startDate.toISOString().split('T')[0],
        endDate: education.endDate ? education.endDate.toISOString().split('T')[0] : '',
        current: !education.endDate,
        description: education.description,
        gpa: education.gpa ? education.gpa.toString() : '',
        achievements: education.achievements || []
      });
    } else {
      // Reset form for create mode
      setFormData({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        gpa: '',
        achievements: []
      });
    }
  }, [education, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.institution.trim() || !formData.degree.trim() || !formData.field.trim() || !formData.startDate) {
      addToast({
        title: 'Validation Error',
        description: 'Please fill in institution, degree, field of study, and start date.',
        type: 'error'
      });
      return;
    }

    const gpa = formData.gpa ? parseFloat(formData.gpa) : undefined;
    if (gpa && (gpa < 0 || gpa > 4.0)) {
      addToast({
        title: 'Invalid GPA',
        description: 'GPA must be between 0.0 and 4.0.',
        type: 'error'
      });
      return;
    }

    const educationData: Omit<Education, 'id'> = {
      institution: formData.institution.trim(),
      degree: formData.degree.trim(),
      field: formData.field.trim(),
      startDate: new Date(formData.startDate),
      endDate: formData.current ? undefined : (formData.endDate ? new Date(formData.endDate) : undefined),
      description: formData.description.trim(),
      gpa,
      achievements: formData.achievements.length > 0 ? formData.achievements : undefined
    };

    try {
      setIsSubmitting(true);
      const success = await onSave(educationData);

      if (success) {
        addToast({
          title: mode === 'create' ? 'Education added' : 'Education updated',
          description: `Successfully ${mode === 'create' ? 'added' : 'updated'} education at ${formData.institution}.`,
          type: 'success'
        });
        onClose();
      } else {
        addToast({
          title: 'Unable to save education',
          description: 'Something went wrong while saving your changes.',
          type: 'error'
        });
      }
    } catch (error) {
      addToast({
        title: 'Unexpected error',
        description: error instanceof Error ? error.message : 'Something went wrong while saving your education.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (achievementToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }));
  };

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {mode === 'create' ? 'Add Education' : 'Update Education'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Education' : 'Edit Education'}
      size="lg"
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
          {/* Institution and Degree */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Institution *
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="pl-10"
                  placeholder="e.g., Stanford University"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Degree Type *
              </label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                required
              >
                <option value="">Select degree type</option>
                {degreeTypes.map(degree => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field of Study */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Field of Study *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={formData.field}
                onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                className="pl-10"
                placeholder="e.g., Computer Science, Business Administration"
                required
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="pl-10"
                  disabled={formData.current}
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : prev.endDate
                  }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="current" className="ml-2 text-sm text-foreground">
                  Currently enrolled
                </label>
              </div>
            </div>
          </div>

          {/* GPA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GPA (Optional)
              </label>
              <Input
                type="number"
                value={formData.gpa}
                onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                placeholder="e.g., 3.8"
                min="0"
                max="4.0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground mt-1">Scale: 0.0 - 4.0</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Describe your coursework, projects, or other relevant details..."
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Achievements & Honors
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="e.g., Dean's List, Magna Cum Laude, Scholarship"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              />
              <Button type="button" onClick={addAchievement} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">{achievement}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(achievement)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {formData.achievements.length === 0 && (
                <p className="text-xs text-muted-foreground">No achievements added yet.</p>
              )}
            </div>
          </div>
        </form>
    </Modal>
  );
};
