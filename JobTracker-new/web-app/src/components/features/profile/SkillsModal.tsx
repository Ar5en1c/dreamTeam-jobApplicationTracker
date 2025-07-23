import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Search, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { SKILL_CATEGORIES } from '@/lib/constants';
import type { Skill, SkillLevel, SkillCategory } from '@/types';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skills: Skill[]) => void;
  currentSkills: Skill[];
}

const skillLevels: { value: SkillLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-gray-100 text-gray-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-green-100 text-green-800' },
  { value: 'expert', label: 'Expert', color: 'bg-purple-100 text-purple-800' }
];

export const SkillsModal: React.FC<SkillsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSkills
}) => {
  const { addToast } = useToast();
  const [skills, setSkills] = useState<Skill[]>(currentSkills);
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('technical');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('intermediate');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');

  useEffect(() => {
    setSkills(currentSkills);
  }, [currentSkills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(skills);
    onClose();
    
    addToast({
      title: 'Skills updated',
      description: 'Your skills have been successfully updated.',
      type: 'success'
    });
  };

  const addSkill = () => {
    if (!newSkillName.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Please enter a skill name.',
        type: 'error'
      });
      return;
    }

    const existingSkill = skills.find(skill => 
      skill.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );

    if (existingSkill) {
      addToast({
        title: 'Skill already exists',
        description: 'This skill is already in your list.',
        type: 'warning'
      });
      return;
    }

    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      level: selectedLevel,
      category: selectedCategory,
      verified: false
    };

    setSkills(prev => [...prev, newSkill]);
    setNewSkillName('');
    
    addToast({
      title: 'Skill added',
      description: `${newSkillName} has been added to your skills.`,
      type: 'success'
    });
  };

  const removeSkill = (skillId: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const updateSkillLevel = (skillId: string, newLevel: SkillLevel) => {
    setSkills(prev => prev.map(skill =>
      skill.id === skillId ? { ...skill, level: newLevel } : skill
    ));
  };

  const updateSkillCategory = (skillId: string, newCategory: SkillCategory) => {
    setSkills(prev => prev.map(skill =>
      skill.id === skillId ? { ...skill, category: newCategory } : skill
    ));
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const skillsByCategory = SKILL_CATEGORIES.map(category => ({
    key: category.value,
    label: category.label,
    skills: skills.filter(skill => skill.category === category.value),
    count: skills.filter(skill => skill.category === category.value).length
  }));

  const getLevelIcon = (level: SkillLevel) => {
    const icons = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4
    };
    return Array.from({ length: icons[level] }, (_, i) => (
      <Star key={i} className="h-3 w-3 fill-current" />
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Manage Skills</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Add New Skill */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Add New Skill</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Skill Name
                  </label>
                  <Input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g., React, Project Management, Python"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as SkillCategory)}
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    {SKILL_CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as SkillLevel)}
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    {skillLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="button" onClick={addSkill} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {/* Skills Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Your Skills ({skills.length})</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search skills..."
                      className="pl-10 w-48"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveCategory('all')}
                >
                  All ({skills.length})
                </Button>
                {skillsByCategory.map(category => (
                  <Button
                    key={category.key}
                    type="button"
                    variant={activeCategory === category.key ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveCategory(category.key)}
                  >
                    {category.label} ({category.count})
                  </Button>
                ))}
              </div>

              {/* Skills List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(skill => (
                    <div key={skill.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-foreground">{skill.name}</h4>
                            {skill.verified && (
                              <Award className="h-4 w-4 text-green-600" title="Verified Skill" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" size="sm">
                              {SKILL_CATEGORIES.find(cat => cat.value === skill.category)?.label || skill.category}
                            </Badge>
                            <div className="flex items-center space-x-1 text-yellow-500">
                              {getLevelIcon(skill.level)}
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {skill.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkillLevel(skill.id, e.target.value as SkillLevel)}
                          className="text-xs p-1 border border-border rounded bg-background"
                        >
                          {skillLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={skill.category}
                          onChange={(e) => updateSkillCategory(skill.id, e.target.value as SkillCategory)}
                          className="text-xs p-1 border border-border rounded bg-background"
                        >
                          {SKILL_CATEGORIES.map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm || activeCategory !== 'all' ? 'No skills found matching your criteria.' : 'No skills added yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 p-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save Skills
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};