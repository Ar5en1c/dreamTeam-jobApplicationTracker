import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Building2,
  GraduationCap,
  Award,
  Edit,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { ProfileEditModal } from '@/components/features/profile/ProfileEditModal';
import { ExperienceModal } from '@/components/features/profile/ExperienceModal';
import { SkillsModal } from '@/components/features/profile/SkillsModal';
import { EducationModal } from '@/components/features/profile/EducationModal';
import { mockUserProfile } from '@/lib/mockData';
import type { UserProfile, Experience, Skill, Education } from '@/types';
import { dateUtils, jobUtils } from '@/lib/utils';
import { SKILL_CATEGORIES } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Profile: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
  const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
  const [experienceModalMode, setExperienceModalMode] = useState<'create' | 'edit'>('create');
  const [educationModalMode, setEducationModalMode] = useState<'create' | 'edit'>('create');
  const [expandedSkillCategories, setExpandedSkillCategories] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const skillsByCategory = jobUtils.getSkillsByCategory(profile.skills);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    console.log('Profile updated:', updatedProfile);
  };

  const handleAddExperience = () => {
    setSelectedExperience(undefined);
    setExperienceModalMode('create');
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setExperienceModalMode('edit');
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = (experienceData: Omit<Experience, 'id'>) => {
    if (experienceModalMode === 'create') {
      const newExperience: Experience = {
        ...experienceData,
        id: `exp-${Date.now()}`
      };
      setProfile(prev => ({
        ...prev,
        experience: [newExperience, ...prev.experience]
      }));
    } else if (selectedExperience) {
      setProfile(prev => ({
        ...prev,
        experience: prev.experience.map(exp =>
          exp.id === selectedExperience.id
            ? { ...experienceData, id: selectedExperience.id }
            : exp
        )
      }));
    }
    setIsExperienceModalOpen(false);
  };

  const handleAddSkill = () => {
    setIsSkillsModalOpen(true);
  };

  const handleSaveSkills = (skills: Skill[]) => {
    setProfile(prev => ({
      ...prev,
      skills
    }));
    setIsSkillsModalOpen(false);
  };

  const handleAddEducation = () => {
    setSelectedEducation(undefined);
    setEducationModalMode('create');
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setSelectedEducation(education);
    setEducationModalMode('edit');
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = (educationData: Omit<Education, 'id'>) => {
    if (educationModalMode === 'create') {
      const newEducation: Education = {
        ...educationData,
        id: `edu-${Date.now()}`
      };
      setProfile(prev => ({
        ...prev,
        education: [newEducation, ...prev.education]
      }));
    } else if (selectedEducation) {
      setProfile(prev => ({
        ...prev,
        education: prev.education.map(edu =>
          edu.id === selectedEducation.id
            ? { ...educationData, id: selectedEducation.id }
            : edu
        )
      }));
    }
    setIsEducationModalOpen(false);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Profile Header */}
      <motion.div variants={itemVariants}>
        <Card className="gradient-border">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
                alt={profile.personalInfo.name}
                fallback={profile.personalInfo.name}
                size="3xl"
                className="ring-4 ring-primary/20"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {profile.personalInfo.name}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      {profile.experience[0]?.title} at {profile.experience[0]?.company}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="self-start"
                    onClick={handleEditProfile}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.personalInfo.email}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.personalInfo.phone}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.personalInfo.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="w-4 h-4 mr-2" />
                    {profile.personalInfo.websites.length > 0 ? (
                      <div className="flex flex-col space-y-1">
                        {profile.personalInfo.websites.slice(0, 2).map((website, index) => (
                          <a 
                            key={index}
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm truncate"
                          >
                            {website}
                          </a>
                        ))}
                        {profile.personalInfo.websites.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{profile.personalInfo.websites.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No websites added</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Experience */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Experience
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleAddExperience}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  {index !== profile.experience.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-full bg-border" />
                  )}
                  <div className="flex space-x-4">
                    <Avatar
                      fallback={exp.company.substring(0, 2)}
                      size="lg"
                      className="bg-gradient-to-br from-blue-500 to-purple-500 text-white flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {exp.current ? 'Current' : dateUtils.format(exp.endDate!, 'MMM yyyy')}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditExperience(exp)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {dateUtils.format(exp.startDate)} - {exp.current ? 'Present' : dateUtils.format(exp.endDate!)}
                        {exp.location && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin className="w-4 h-4 mr-1" />
                            {exp.location}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                        {exp.skills.length > 6 && (
                          <Badge variant="outline" size="sm">
                            +{exp.skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills */}
        <motion.div variants={itemVariants}>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Skills
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleAddSkill}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, skills]) => {
                const categoryInfo = SKILL_CATEGORIES.find(c => c.value === category);
                return (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
                      <span className="mr-2">{categoryInfo?.icon}</span>
                      {categoryInfo?.label}
                    </h4>
                    <div className="space-y-3">
                      {(expandedSkillCategories[category] ? skills : skills.slice(0, 5)).map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground capitalize">{skill.level}</span>
                          </div>
                          <Progress 
                            value={
                              skill.level === 'expert' ? 100 :
                              skill.level === 'advanced' ? 80 :
                              skill.level === 'intermediate' ? 60 : 40
                            }
                            variant={skill.verified ? 'success' : 'default'}
                            size="sm"
                          />
                        </div>
                      ))}
                      {skills.length > 5 && (
                        <button
                          onClick={() => setExpandedSkillCategories(prev => ({
                            ...prev,
                            [category]: !prev[category]
                          }))}
                          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          {expandedSkillCategories[category] 
                            ? `Show less skills` 
                            : `+${skills.length - 5} more skills`
                          }
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Education */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleAddEducation}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.field}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {edu.gpa && (
                        <Badge variant="secondary">GPA: {edu.gpa}</Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditEducation(edu)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{edu.institution}</p>
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    {dateUtils.format(edu.startDate)} - {dateUtils.format(edu.endDate!)}
                  </div>
                  <p className="text-xs text-muted-foreground">{edu.description}</p>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-foreground mb-1">Achievements:</p>
                      <div className="space-y-1">
                        {edu.achievements.slice(0, 2).map((achievement, index) => (
                          <p key={index} className="text-xs text-muted-foreground">• {achievement}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        profile={profile}
      />

      {/* Experience Modal */}
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSave={handleSaveExperience}
        experience={selectedExperience}
        mode={experienceModalMode}
      />

      {/* Skills Modal */}
      <SkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        onSave={handleSaveSkills}
        currentSkills={profile.skills}
      />

      {/* Education Modal */}
      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        onSave={handleSaveEducation}
        education={selectedEducation}
        mode={educationModalMode}
      />
    </motion.div>
  );
};