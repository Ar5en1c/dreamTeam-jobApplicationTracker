import React, { useState } from "react";
import { motion } from "framer-motion";
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
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useToast } from "@/components/ui/Toast";
import { ProfileEditModal } from "@/components/features/profile/ProfileEditModal";
import { ExperienceModal } from "@/components/features/profile/ExperienceModal";
import { SkillsModal } from "@/components/features/profile/SkillsModal";
import { EducationModal } from "@/components/features/profile/EducationModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { UserProfile, Experience, Skill, Education } from "@/types";
import { cn, dateUtils, jobUtils } from "@/lib/utils";
import { SKILL_CATEGORIES } from "@/lib/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const surfaceCardBase =
  "rounded-xl border border-borderMuted bg-surface-1 shadow-sm transition-colors";

export const Profile: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<
    Experience | undefined
  >(undefined);
  const [selectedEducation, setSelectedEducation] = useState<
    Education | undefined
  >(undefined);
  const [experienceModalMode, setExperienceModalMode] = useState<
    "create" | "edit"
  >("create");
  const [educationModalMode, setEducationModalMode] = useState<
    "create" | "edit"
  >("create");
  const [expandedSkillCategories, setExpandedSkillCategories] = useState<
    Record<string, boolean>
  >({});
  const { 
    profile, 
    loading, 
    error,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    refetch: refetchProfile
  } = useUserProfile();
  const { addToast } = useToast();
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  
  const skillsByCategory = profile ? jobUtils.getSkillsByCategory(profile.skills) : {};

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Unable to load profile</h2>
        <p className="text-sm text-muted-foreground max-w-sm text-center">
          {error}
        </p>
        <Button variant="primary" onClick={refetchProfile}>
          Retry
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedProfile: Partial<UserProfile>) => {
    const success = await updateProfile(updatedProfile);
    if (success) {
      addToast({
        title: "Profile updated",
        description: "Your personal information was saved successfully.",
        type: "success",
      });
    } else {
      addToast({
        title: "Update failed",
        description: "We couldn't update your profile. Please try again.",
        type: "error",
      });
    }
    return success;
  };

  const handleEditSkill = (skill: Skill) => {
    // TODO: Implement skill editing modal
    console.log("Edit skill:", skill);
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      const success = await deleteSkill(skillId);
      addToast({
        title: success ? "Skill removed" : "Removal failed",
        description: success
          ? "The skill was removed from your profile."
          : "We couldn't remove that skill. Please try again.",
        type: success ? "success" : "error",
      });
    }
  };

  const handleDeleteExperience = async (expId: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      const success = await deleteExperience(expId);
      addToast({
        title: success ? "Experience removed" : "Removal failed",
        description: success
          ? "The experience entry was removed."
          : "We couldn't remove that experience. Please try again.",
        type: success ? "success" : "error",
      });
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      const success = await deleteEducation(eduId);
      addToast({
        title: success ? "Education removed" : "Removal failed",
        description: success
          ? "The education entry was removed."
          : "We couldn't remove that education entry. Please try again.",
        type: success ? "success" : "error",
      });
    }
  };

  const handleAddExperience = () => {
    setSelectedExperience(undefined);
    setExperienceModalMode("create");
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setExperienceModalMode("edit");
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = async (experienceData: Omit<Experience, "id">) => {
    let success = false;
    if (experienceModalMode === "create") {
      success = await addExperience(experienceData);
    } else if (selectedExperience) {
      success = await updateExperience(selectedExperience.id, experienceData);
    }

    if (success) {
      setIsExperienceModalOpen(false);
      setSelectedExperience(undefined);
    }

    return success;
  };

  const handleOpenSkillsModal = () => {
    setIsSkillsModalOpen(true);
  };

  const handleSaveSkills = async (updatedSkills: Skill[]) => {
    if (!profile) return false;

    setIsSavingSkills(true);
    try {
      const currentSkills = profile.skills;
      const currentSkillMap = new Map(currentSkills.map(skill => [skill.id, skill]));
      const desiredSkillMap = new Map(updatedSkills.map(skill => [skill.id, skill]));

      const skillsToCreate = updatedSkills.filter(skill => !currentSkillMap.has(skill.id));
      const skillsToDelete = currentSkills.filter(skill => !desiredSkillMap.has(skill.id));
      const skillsToUpdate = updatedSkills.filter(skill => {
        const existing = currentSkillMap.get(skill.id);
        if (!existing) {
          return false;
        }

        return (
          existing.name !== skill.name ||
          existing.level !== skill.level ||
          existing.category !== skill.category ||
          existing.yearsOfExperience !== skill.yearsOfExperience ||
          existing.verified !== skill.verified
        );
      });

      const creationResults = await Promise.all(
        skillsToCreate.map(skill =>
          addSkill({
            name: skill.name,
            level: skill.level,
            category: skill.category,
            yearsOfExperience: skill.yearsOfExperience,
            verified: skill.verified,
          })
        )
      );

      if (creationResults.includes(false)) {
        throw new Error('Failed to add some skills.');
      }

      const updateResults = await Promise.all(
        skillsToUpdate.map(skill =>
          updateSkill(skill.id, {
            name: skill.name,
            level: skill.level,
            category: skill.category,
            yearsOfExperience: skill.yearsOfExperience,
            verified: skill.verified,
          })
        )
      );

      if (updateResults.includes(false)) {
        throw new Error('Failed to update some skills.');
      }

      const deleteResults = await Promise.all(
        skillsToDelete.map(skill => deleteSkill(skill.id))
      );

      if (deleteResults.includes(false)) {
        throw new Error('Failed to remove some skills.');
      }

      addToast({
        title: 'Skills updated',
        description: 'Your skills have been saved successfully.',
        type: 'success',
      });

      return true;
    } catch (err) {
      console.error('Failed to save skills', err);
      addToast({
        title: 'Unable to save skills',
        description: err instanceof Error ? err.message : 'Something went wrong while saving your skills.',
        type: 'error',
      });
      return false;
    } finally {
      setIsSavingSkills(false);
    }
  };

  const handleAddEducation = () => {
    setSelectedEducation(undefined);
    setEducationModalMode("create");
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setSelectedEducation(education);
    setEducationModalMode("edit");
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = async (educationData: Omit<Education, "id">) => {
    let success = false;
    if (educationModalMode === "create") {
      success = await addEducation(educationData);
    } else if (selectedEducation) {
      success = await updateEducation(selectedEducation.id, educationData);
    }

    if (success) {
      setIsEducationModalOpen(false);
      setSelectedEducation(undefined);
    }

    return success;
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
        <Card
          variant="surface"
          className={surfaceCardBase}
        >
          <CardContent className="relative z-10 px-6 py-7 md:px-9 md:py-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
                alt={profile.personalInfo.name}
                fallback={profile.personalInfo.name}
                size="3xl"
                className="ring-4 ring-primary/10 shadow-lg shadow-primary/10 dark:ring-primary/20"
              />
              <div className="flex-1 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1.5">
                    <h1 className="text-3xl font-semibold text-foreground">
                      {profile.personalInfo.name}
                    </h1>
                    {profile.experience.length > 0 && profile.experience[0]?.title && profile.experience[0]?.company ? (
                      <p className="text-base text-muted-foreground">
                        {profile.experience[0].title} at {profile.experience[0].company}
                      </p>
                    ) : (
                      <p className="text-base text-muted-foreground">
                        Job Seeker
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="self-start rounded-xl px-5 text-sm font-semibold"
                    onClick={handleEditProfile}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  {profile.personalInfo.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary/70" />
                      <span>{profile.personalInfo.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary/70" />
                    {profile.personalInfo.phone ? (
                      <span>{profile.personalInfo.phone}</span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-sm font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200"
                        onClick={handleEditProfile}
                      >
                        Add phone
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    {profile.personalInfo.location ? (
                      <span>{profile.personalInfo.location}</span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-sm font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200"
                        onClick={handleEditProfile}
                      >
                        Add location
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary/70" />
                    {profile.personalInfo.websites.length > 0 ? (
                      <div className="flex flex-col space-y-1">
                        {profile.personalInfo.websites.slice(0, 2).map((website, index) => (
                          <a
                            key={index}
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200 truncate"
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-sm font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200"
                        onClick={handleEditProfile}
                      >
                        Add website
                      </Button>
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
          <Card variant="surface" className={surfaceCardBase}>
            <CardHeader className="relative z-10 pb-4 border-b border-borderMuted">
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Experience
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-lg px-3 text-sm font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200"
                  onClick={handleAddExperience}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  {index !== profile.experience.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-full bg-slate-200 dark:bg-slate-700/60" />
                  )}
                  <div className="flex space-x-4">
                    <Avatar
                      fallback={exp.company.substring(0, 2)}
                      size="lg"
                      className="flex-shrink-0 bg-primary/10 text-primary ring-2 ring-primary/10 dark:bg-primary/20 dark:text-primary/80 dark:ring-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {exp.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {exp.company}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="border-borderMuted text-muted-foreground">
                            {exp.current
                              ? "Current"
                              : dateUtils.format(exp.endDate!, "MMM yyyy")}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExperience(exp)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExperience(exp.id!)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {dateUtils.format(exp.startDate)} -{" "}
                        {exp.current
                          ? "Present"
                          : dateUtils.format(exp.endDate!)}
                        {exp.location && (
                          <>
                            <span className="mx-2 text-muted-foreground/60">•</span>
                            <MapPin className="w-4 h-4 mr-1 text-primary/70" />
                            {exp.location}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="secondary" size="sm" className="bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary/80">
                            {skill}
                          </Badge>
                        ))}
                        {exp.skills.length > 6 && (
                          <Badge variant="outline" size="sm" className="border-borderMuted text-muted-foreground">
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
          <Card
            variant="surface"
            className={cn(surfaceCardBase, "h-fit")}
          >
            <CardHeader className="relative z-10 pb-4 border-b border-borderMuted">
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Skills
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-lg px-3 text-sm font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200"
                  onClick={handleOpenSkillsModal}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              {Object.entries(skillsByCategory).map(([category, skills]) => {
                const categoryInfo = SKILL_CATEGORIES.find(
                  (c) => c.value === category
                );
                return (
                  <div key={category}>
                    <h4 className="mb-3 flex items-center text-sm font-semibold text-foreground">
                      <span className="mr-2 text-lg">{categoryInfo?.icon}</span>
                      {categoryInfo?.label}
                    </h4>
                    <div className="space-y-3">
                      {(expandedSkillCategories[category]
                        ? skills
                        : skills.slice(0, 5)
                      ).map((skill) => (
                        <div key={skill.id} className="group">
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-foreground">{skill.name}</span>
                              <span className="capitalize text-muted-foreground">
                                {skill.level}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSkill(skill)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSkill(skill.id!)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <Progress
                            value={
                              skill.level === "expert"
                                ? 100
                                : skill.level === "advanced"
                                ? 80
                                : skill.level === "intermediate"
                                ? 60
                            : 40
                            }
                            variant={skill.verified ? "success" : "default"}
                            size="sm"
                          />
                        </div>
                      ))}
                      {skills.length > 5 && (
                        <button
                          onClick={() =>
                            setExpandedSkillCategories((prev) => ({
                              ...prev,
                              [category]: !prev[category],
                            }))
                          }
                          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          {expandedSkillCategories[category]
                            ? `Show less skills`
                            : `+${skills.length - 5} more skills`}
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
        <Card
          variant="surface"
          className={surfaceCardBase}
        >
          <CardHeader className="relative z-10 pb-4 border-b border-borderMuted">
            <CardTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg px-3 text-sm font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200"
                onClick={handleAddEducation}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-xl border border-borderMuted bg-surface-1 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300/60 hover:shadow-level-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.field}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {edu.gpa && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary/80">
                          GPA: {edu.gpa}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEducation(edu)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEducation(edu.id!)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {edu.institution}
                  </p>
                  <div className="mb-3 flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {dateUtils.format(edu.startDate)} -{" "}
                    {dateUtils.format(edu.endDate!)}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {edu.description}
                  </p>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-foreground mb-1">
                        Achievements:
                      </p>
                      <div className="space-y-1">
                        {edu.achievements
                          .slice(0, 2)
                          .map((achievement, index) => (
                            <p
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              • {achievement}
                            </p>
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
        onClose={() => {
          if (!isSavingSkills) {
            setIsSkillsModalOpen(false);
          }
        }}
        onSave={handleSaveSkills}
        currentSkills={profile.skills}
        isSaving={isSavingSkills}
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
