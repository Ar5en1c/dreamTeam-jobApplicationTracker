import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Edit2, 
  Search, 
  Star, 
  Award, 
  Check,
  ChevronDown,
  Trash2,
  BookOpen,
  Code,
  Users,
  Globe,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { SKILL_CATEGORIES, COMMON_SKILLS } from '@/lib/constants';
import type { Skill, SkillCategory, SkillLevel } from '@/types';

interface SkillEditorProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  className?: string;
}

interface SkillFormData {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  yearsOfExperience: number;
  verified: boolean;
}

const SKILL_LEVELS: { value: SkillLevel; label: string; description: string; progress: number }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Learning the basics', progress: 25 },
  { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with fundamentals', progress: 50 },
  { value: 'advanced', label: 'Advanced', description: 'Highly proficient', progress: 75 },
  { value: 'expert', label: 'Expert', description: 'Industry-recognized expertise', progress: 100 }
];

const getCategoryIcon = (category: SkillCategory) => {
  switch (category) {
    case 'technical': return <Code className="w-4 h-4" />;
    case 'soft': return <Users className="w-4 h-4" />;
    case 'language': return <Globe className="w-4 h-4" />;
    case 'certification': return <Award className="w-4 h-4" />;
    case 'tool': return <Settings className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

const getLevelColor = (level: SkillLevel) => {
  switch (level) {
    case 'beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'expert': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const SkillEditor: React.FC<SkillEditorProps> = ({
  skills,
  onSkillsChange,
  className
}) => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [skillForm, setSkillForm] = useState<SkillFormData>({
    name: '',
    level: 'intermediate',
    category: 'technical',
    yearsOfExperience: 1,
    verified: false
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingSkill && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingSkill]);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const skillsByCategory = SKILL_CATEGORIES.reduce((acc, category) => {
    acc[category.value] = filteredSkills.filter(skill => skill.category === category.value);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  const handleAddSkill = () => {
    if (!skillForm.name.trim()) return;

    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: skillForm.name.trim(),
      level: skillForm.level,
      category: skillForm.category,
      yearsOfExperience: skillForm.yearsOfExperience,
      verified: skillForm.verified
    };

    onSkillsChange([...skills, newSkill]);
    setSkillForm({
      name: '',
      level: 'intermediate',
      category: 'technical',
      yearsOfExperience: 1,
      verified: false
    });
    setIsAddingSkill(false);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      yearsOfExperience: skill.yearsOfExperience,
      verified: skill.verified
    });
  };

  const handleUpdateSkill = () => {
    if (!editingSkill || !skillForm.name.trim()) return;

    const updatedSkills = skills.map(skill =>
      skill.id === editingSkill.id
        ? { ...skill, ...skillForm, name: skillForm.name.trim() }
        : skill
    );

    onSkillsChange(updatedSkills);
    setEditingSkill(null);
    setSkillForm({
      name: '',
      level: 'intermediate',
      category: 'technical',
      yearsOfExperience: 1,
      verified: false
    });
  };

  const handleDeleteSkill = (skillId: string) => {
    onSkillsChange(skills.filter(skill => skill.id !== skillId));
  };

  const handleQuickAddSkill = (skillName: string, category: SkillCategory) => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: skillName,
      level: 'intermediate',
      category,
      yearsOfExperience: 1,
      verified: false
    };

    onSkillsChange([...skills, newSkill]);
  };

  const toggleVerified = (skillId: string) => {
    const updatedSkills = skills.map(skill =>
      skill.id === skillId ? { ...skill, verified: !skill.verified } : skill
    );
    onSkillsChange(updatedSkills);
  };

  const getSkillProgress = (level: SkillLevel) => {
    return SKILL_LEVELS.find(l => l.value === level)?.progress || 50;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Skills Management</h3>
          <p className="text-sm text-muted-foreground">
            Add, edit, and organize your professional skills
          </p>
        </div>
        <Button
          onClick={() => setIsAddingSkill(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as SkillCategory | 'all')}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="all">All Categories</option>
            {SKILL_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Skill Form */}
      <AnimatePresence>
        {(isAddingSkill || editingSkill) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {editingSkill ? <Edit2 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skill Name</label>
                    <Input
                      ref={inputRef}
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      placeholder="e.g., React, Python, Leadership"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          editingSkill ? handleUpdateSkill() : handleAddSkill();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as SkillCategory })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      {SKILL_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Proficiency Level</label>
                    <select
                      value={skillForm.level}
                      onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value as SkillLevel })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      {SKILL_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={skillForm.yearsOfExperience}
                      onChange={(e) => setSkillForm({ ...skillForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={skillForm.verified}
                    onChange={(e) => setSkillForm({ ...skillForm, verified: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="verified" className="text-sm font-medium">
                    Verified skill (with certifications or professional experience)
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingSkill(false);
                      setEditingSkill(null);
                      setSkillForm({
                        name: '',
                        level: 'intermediate',
                        category: 'technical',
                        yearsOfExperience: 1,
                        verified: false
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
                    disabled={!skillForm.name.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {editingSkill ? 'Update Skill' : 'Add Skill'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add Suggestions */}
      {!isAddingSkill && !editingSkill && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Quick Add Popular Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(COMMON_SKILLS).map(([category, skillList]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium mb-2 capitalize">{category} Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillList.filter(skill => !skills.some(s => s.name === skill)).slice(0, 8).map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleQuickAddSkill(skill, category as SkillCategory)}
                        className="px-3 py-1 text-sm bg-muted hover:bg-muted-foreground/10 rounded-full border border-border transition-colors"
                      >
                        <Plus className="w-3 h-3 mr-1 inline" />
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills by Category */}
      <div className="space-y-6">
        {SKILL_CATEGORIES.map(category => {
          const categorySkills = skillsByCategory[category.value];
          
          if (categorySkills.length === 0 && selectedCategory !== 'all' && selectedCategory !== category.value) {
            return null;
          }

          return (
            <Card key={category.value}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getCategoryIcon(category.value)}
                    <span className="ml-2">{category.label}</span>
                    <Badge variant="secondary" className="ml-2">
                      {categorySkills.length}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categorySkills.length > 0 ? (
                  <div className="space-y-3">
                    {categorySkills.map(skill => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{skill.name}</span>
                            {skill.verified && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getLevelColor(skill.level))}
                            >
                              {skill.level}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Proficiency</span>
                                <span>{getSkillProgress(skill.level)}%</span>
                              </div>
                              <Progress
                                value={getSkillProgress(skill.level)}
                                className="h-2"
                                variant={skill.verified ? 'success' : 'default'}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleVerified(skill.id)}
                            className="h-8 w-8"
                          >
                            <Star
                              className={cn(
                                "w-4 h-4",
                                skill.verified ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSkill(skill)}
                            className="h-8 w-8"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mb-2">{getCategoryIcon(category.value)}</div>
                    <p className="text-sm">No {category.label.toLowerCase()} skills added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skills Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{skills.length}</p>
              <p className="text-sm text-muted-foreground">Total Skills</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {skills.filter(s => s.verified).length}
              </p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {skills.filter(s => s.level === 'expert').length}
              </p>
              <p className="text-sm text-muted-foreground">Expert Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(skills.reduce((sum, s) => sum + s.yearsOfExperience, 0) / skills.length) || 0}
              </p>
              <p className="text-sm text-muted-foreground">Avg. Experience</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};