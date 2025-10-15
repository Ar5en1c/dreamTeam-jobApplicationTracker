import React, { useState, useEffect } from "react";
import { Building2, Save, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type {
  JobApplication,
  ApplicationStatus,
  WorkArrangement,
  CompanySize,
  JobPortal,
} from "@/types";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: Partial<JobApplication>) => void;
  application?: JobApplication | null;
  mode: "create" | "edit";
}

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "phone_screen", label: "Phone Screen" },
  { value: "interview", label: "Interview" },
  { value: "final_interview", label: "Final Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

const workArrangementOptions: { value: WorkArrangement; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

const companySizeOptions: { value: CompanySize; label: string }[] = [
  { value: "startup", label: "Startup (1-50)" },
  { value: "small", label: "Small (51-200)" },
  { value: "medium", label: "Medium (201-1000)" },
  { value: "large", label: "Large (1000+)" },
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  application,
  mode,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    job: {
      title: "",
      company: "",
      location: "",
      description: "",
      requirements: [] as string[],
      salary: "",
      url: "",
      portal: "direct",
      benefits: [] as string[],
      companySize: "medium" as CompanySize,
      workArrangement: "remote" as WorkArrangement,
      industry: "",
    },
    status: "applied" as ApplicationStatus,
    notes: "",
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    if (application && mode === "edit") {
      setFormData({
        job: {
          ...application.job,
          benefits: application.job.benefits ?? [],
          companySize: application.job.companySize ?? "medium",
          workArrangement: application.job.workArrangement ?? "remote",
          industry: application.job.industry ?? "",
        },
        status: application.status,
        notes: application.notes || "",
        tags: application.tags || [],
      });
    } else {
      setFormData({
        job: {
          title: "",
          company: "",
          location: "",
          description: "",
          requirements: [],
          salary: "" as string,
          url: "",
          portal: "direct",
          benefits: [],
          companySize: "medium" as CompanySize,
          workArrangement: "remote" as WorkArrangement,
          industry: "",
        },
        status: "applied" as ApplicationStatus,
        notes: "",
        tags: [],
      });
    }
  }, [application, mode]);

  const updateFormData = (
    section: "job" | "status" | "notes" | "tags",
    key: string | ApplicationStatus | string[],
    value?: any
  ) => {
    if (section === "status") {
      setFormData((prev) => ({ ...prev, status: key as ApplicationStatus }));
    } else if (section === "notes") {
      setFormData((prev) => ({ ...prev, notes: key as string }));
    } else if (section === "tags") {
      setFormData((prev) => ({ ...prev, tags: key as string[] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        job: {
          ...prev.job,
          [key as string]: value,
        },
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const addRequirement = () => {
    if (
      newRequirement.trim() &&
      !formData.job.requirements.includes(newRequirement.trim())
    ) {
      updateFormData("job", "requirements", [
        ...formData.job.requirements,
        newRequirement.trim(),
      ]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (req: string) => {
    updateFormData(
      "job",
      "requirements",
      formData.job.requirements.filter((r) => r !== req)
    );
  };

  const addBenefit = () => {
    if (
      newBenefit.trim() &&
      !formData.job.benefits.includes(newBenefit.trim())
    ) {
      updateFormData("job", "benefits", [
        ...formData.job.benefits,
        newBenefit.trim(),
      ]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefit: string) => {
    updateFormData(
      "job",
      "benefits",
      formData.job.benefits.filter((b) => b !== benefit)
    );
  };

  const handleSave = () => {
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    const applicationData: Partial<JobApplication> = {
      ...formData,
      id: application?.id || `app-${Date.now()}`,
      userId: user.id,
      statusHistory: application?.statusHistory || [
        {
          id: `status-${Date.now()}`,
          status: formData.status,
          date: new Date(),
          source: "manual",
        },
      ],
      dates: {
        applied: application?.dates.applied || new Date(),
        lastUpdated: new Date(),
        interviews: application?.dates.interviews || [],
        responses: application?.dates.responses || [],
      },
      documents: application?.documents || {
        resume: undefined,
        coverLetter: undefined,
        others: [],
      },
      aiInsights: application?.aiInsights || {
        matchScore: 0,
        skillGaps: [],
        suggestions: [],
        lastAnalyzed: new Date(),
      },
      createdAt: application?.createdAt || new Date(),
      updatedAt: new Date(),
      job: {
        ...formData.job,
        portal: formData.job.portal as JobPortal,
      },
    };

    onSave(applicationData);
    onClose();
  };

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        <Save className="w-4 h-4 mr-2" />
        {mode === "create" ? "Create Application" : "Save Changes"}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Application" : "Edit Application"}
      description={
        mode === "create"
          ? "Add a new job application to track"
          : "Update application details"
      }
      size="xl"
      footer={modalFooter}
    >
      <div className="space-y-4">
        {/* Basic Information */}
        <div className={cn(
          "relative overflow-hidden rounded-xl p-4",
          "bg-card border border-border",
          "shadow-sm"
        )}>
          {/* Top gradient accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          <h3 className="font-semibold mb-4 flex items-center text-foreground">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg mr-2.5",
              "bg-primary-500/10 dark:bg-primary-500/20",
              "border border-primary-500/20"
            )}>
              <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              placeholder="e.g. Senior Software Engineer"
              value={formData.job.title}
              onChange={(e) => updateFormData("job", "title", e.target.value)}
            />
            <Input
              label="Company"
              placeholder="e.g. Google"
              value={formData.job.company}
              onChange={(e) =>
                updateFormData("job", "company", e.target.value)
              }
            />
            <Input
              label="Location"
              placeholder="e.g. San Francisco, CA"
              value={formData.job.location}
              onChange={(e) =>
                updateFormData("job", "location", e.target.value)
              }
            />
            <Input
              label="Industry"
              placeholder="e.g. Technology"
              value={formData.job.industry}
              onChange={(e) =>
                updateFormData("job", "industry", e.target.value)
              }
            />
            <Input
              label="Salary Range"
              placeholder="e.g. $120,000 - $180,000"
              value={formData.job.salary}
              onChange={(e) =>
                updateFormData("job", "salary", e.target.value)
              }
            />
            <Input
              label="Job URL"
              placeholder="https://company.com/careers/123"
              value={formData.job.url}
              onChange={(e) => updateFormData("job", "url", e.target.value)}
            />
          </div>
        </div>

        {/* Job Details */}
        <div className={cn(
          "relative overflow-hidden rounded-xl p-4",
          "bg-card border border-border",
          "shadow-sm"
        )}>
          {/* Top gradient accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          <h3 className="font-semibold mb-4 text-foreground">Job Details</h3>
          <div className="space-y-4">
            <Textarea
              label="Description"
              rows={3}
              placeholder="Brief job description..."
              value={formData.job.description}
              onChange={(e) =>
                updateFormData("job", "description", e.target.value)
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Work Arrangement
                </label>
                <div className="flex flex-wrap gap-2">
                  {workArrangementOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateFormData("job", "workArrangement", option.value)
                      }
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "border",
                        formData.job.workArrangement === option.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Company Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {companySizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateFormData("job", "companySize", option.value)
                      }
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "border",
                        formData.job.companySize === option.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Requirements
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add requirement..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                />
                <Button onClick={addRequirement} size="sm" className="shrink-0">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.job.requirements.map((req, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-error-500/10 hover:text-error-500 transition-colors"
                    onClick={() => removeRequirement(req)}
                  >
                    {req} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Benefits</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add benefit..."
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                />
                <Button onClick={addBenefit} size="sm" className="shrink-0">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.job.benefits.map((benefit, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-error-500/10 hover:text-error-500 transition-colors"
                    onClick={() => removeBenefit(benefit)}
                  >
                    {benefit} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Status & Notes */}
        <div className={cn(
          "relative overflow-hidden rounded-xl p-4",
          "bg-card border border-border",
          "shadow-sm"
        )}>
          {/* Top gradient accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          <h3 className="font-semibold mb-4 text-foreground">Application Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => updateFormData("status", status.value)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "border",
                      formData.status === status.value
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Notes"
              rows={3}
              placeholder="Add any notes about this application..."
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
            />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm" className="shrink-0">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-error-500/10 hover:text-error-500 transition-colors"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
