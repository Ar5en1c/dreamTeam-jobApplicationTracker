import React, { useState, useEffect } from "react";
import { Building2, Save, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type {
  JobApplication,
  ApplicationStatus,
  WorkArrangement,
  CompanySize,
} from "@/types";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: Partial<JobApplication>) => void;
  application?: JobApplication | null;
  mode: "create" | "edit";
}

const statusOptions: {
  value: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-800" },
  {
    value: "under_review",
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "phone_screen",
    label: "Phone Screen",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "interview",
    label: "Interview",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "final_interview",
    label: "Final Interview",
    color: "bg-indigo-100 text-indigo-800",
  },
  { value: "offer", label: "Offer", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  {
    value: "withdrawn",
    label: "Withdrawn",
    color: "bg-gray-100 text-gray-800",
  },
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
  const [formData, setFormData] = useState({
    job: {
      title: "",
      company: "",
      location: "",
      description: "",
      requirements: [] as string[],
      salary: "",
      url: "",
      portal: "direct" as const,
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
        job: { ...application.job },
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
          portal: "direct" as const,
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
    const applicationData: Partial<JobApplication> = {
      ...formData,
      id: application?.id || `app-${Date.now()}`,
      userId: "current-user",
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
    };

    onSave(applicationData);
    onClose();
  };

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
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <h3 className="font-semibold mb-4 flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title
              </label>
              <Input
                placeholder="e.g. Senior Software Engineer"
                value={formData.job.title}
                onChange={(e) => updateFormData("job", "title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <Input
                placeholder="e.g. Google"
                value={formData.job.company}
                onChange={(e) =>
                  updateFormData("job", "company", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                placeholder="e.g. San Francisco, CA"
                value={formData.job.location}
                onChange={(e) =>
                  updateFormData("job", "location", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Input
                placeholder="e.g. Technology"
                value={formData.job.industry}
                onChange={(e) =>
                  updateFormData("job", "industry", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Salary Range
              </label>
              <Input
                placeholder="e.g. $120,000 - $180,000"
                value={formData.job.salary}
                onChange={(e) =>
                  updateFormData("job", "salary", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job URL</label>
              <Input
                placeholder="https://company.com/careers/123"
                value={formData.job.url}
                onChange={(e) => updateFormData("job", "url", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <h3 className="font-semibold mb-4">Job Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="Brief job description..."
                value={formData.job.description}
                onChange={(e) =>
                  updateFormData("job", "description", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
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
                        "px-3 py-1 rounded-full text-sm transition-colors",
                        formData.job.workArrangement === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
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
                        "px-3 py-1 rounded-full text-sm transition-colors",
                        formData.job.companySize === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
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
              <label className="block text-sm font-medium mb-2">
                Requirements
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add requirement..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                />
                <Button onClick={addRequirement} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.job.requirements.map((req, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeRequirement(req)}
                  >
                    {req} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium mb-2">Benefits</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add benefit..."
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                />
                <Button onClick={addBenefit} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.job.benefits.map((benefit, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer"
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
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <h3 className="font-semibold mb-4">Application Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => updateFormData("status", status.value)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors",
                      formData.status === status.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="Add any notes about this application..."
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
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

      {/* Footer */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-border mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {mode === "create" ? "Create Application" : "Save Changes"}
        </Button>
      </div>
    </Modal>
  );
};
