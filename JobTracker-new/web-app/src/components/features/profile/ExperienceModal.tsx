import React, { useState, useEffect } from 'react';
import { Calendar, Building2, MapPin, Plus, Trash2, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import type { Experience } from '@/types';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Omit<Experience, 'id'>) => Promise<boolean>;
  experience?: Experience;
  mode: 'create' | 'edit';
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  experience,
  mode
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: '',
    skills: [] as string[],
    achievements: [] as string[]
  });
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        title: experience.title,
        startDate: experience.startDate.toISOString().split('T')[0],
        endDate: experience.endDate ? experience.endDate.toISOString().split('T')[0] : '',
        current: experience.current,
        description: experience.description,
        location: experience.location || '',
        skills: experience.skills || [],
        achievements: experience.achievements || []
      });
    } else {
      // Reset form for create mode
      setFormData({
        company: '',
        title: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        location: '',
        skills: [],
        achievements: []
      });
    }
  }, [experience, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company.trim() || !formData.title.trim() || !formData.startDate) {
      addToast({
        title: 'Validation Error',
        description: 'Please fill in company, title, and start date.',
        type: 'error'
      });
      return;
    }

    const experienceData: Omit<Experience, 'id'> = {
      company: formData.company.trim(),
      title: formData.title.trim(),
      startDate: new Date(formData.startDate),
      endDate: formData.current ? undefined : (formData.endDate ? new Date(formData.endDate) : undefined),
      current: formData.current,
      description: formData.description.trim(),
      location: formData.location.trim() || undefined,
      skills: formData.skills,
      achievements: formData.achievements.length > 0 ? formData.achievements : undefined
    };

    try {
      setIsSubmitting(true);
      const success = await onSave(experienceData);

      if (success) {
        addToast({
          title: mode === 'create' ? 'Experience added' : 'Experience updated',
          description: `Successfully ${mode === 'create' ? 'added' : 'updated'} experience at ${formData.company}.`,
          type: 'success'
        });
        onClose();
      } else {
        addToast({
          title: 'Unable to save experience',
          description: 'Something went wrong while saving your changes.',
          type: 'error'
        });
      }
    } catch (error) {
      addToast({
        title: 'Unexpected error',
        description: error instanceof Error ? error.message : 'Something went wrong while saving your experience.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
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
        {mode === 'create' ? 'Add Experience' : 'Update Experience'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Experience' : 'Edit Experience'}
      size="lg"
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="pl-10"
                  placeholder="Company name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Job Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Job title"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
                placeholder="City, State or Remote"
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
                  I currently work here
                </label>
              </div>
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
              rows={4}
              placeholder="Describe your role, responsibilities, and key accomplishments..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Skills Used
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="group">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Key Achievements
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement"
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
            </div>
          </div>
        </form>
    </Modal>
  );
};
