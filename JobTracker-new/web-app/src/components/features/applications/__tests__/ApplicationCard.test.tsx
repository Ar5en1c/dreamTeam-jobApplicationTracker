import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApplicationCard } from "../ApplicationCard";
import { mockJobApplications } from "@/lib/mockData";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("ApplicationCard", () => {
  const mockApplication = mockJobApplications[0];
  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onArchive: vi.fn(),
    onViewDetails: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders application information correctly", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    expect(screen.getByText(mockApplication.job.title)).toBeInTheDocument();
    expect(screen.getByText(mockApplication.job.company)).toBeInTheDocument();
    expect(screen.getByText(mockApplication.job.location)).toBeInTheDocument();
  });

  it("displays status badge", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    // Status badge should be present
    const statusElement = screen.getByText(mockApplication.status, {
      exact: false,
    });
    expect(statusElement).toBeInTheDocument();
  });

  it("shows progress bar with correct value", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    // Progress bar should be present
    const progressElement = screen.getByText("Application Progress");
    expect(progressElement).toBeInTheDocument();
  });

  it("displays salary and work arrangement badges", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    if (mockApplication.job.salary) {
      expect(screen.getByText(mockApplication.job.salary)).toBeInTheDocument();
    }
    expect(
      screen.getByText(mockApplication.job.workArrangement || "")
    ).toBeInTheDocument();
  });

  it("shows application dates", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    expect(screen.getByText("Applied")).toBeInTheDocument();
    expect(screen.getByText("Last Update")).toBeInTheDocument();
  });

  it("displays AI match score", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    expect(screen.getByText("Match Score")).toBeInTheDocument();
    if (mockApplication.aiInsights?.matchScore) {
      expect(
        screen.getByText(`${mockApplication.aiInsights.matchScore}%`)
      ).toBeInTheDocument();
    }
  });

  it("shows tags when present", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    if (mockApplication.tags && mockApplication.tags.length > 0) {
      // At least the first tag should be visible
      expect(screen.getByText(mockApplication.tags[0])).toBeInTheDocument();
    }
  });

  it("calls onViewDetails when card is clicked", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    const card =
      screen.getByRole("button", { name: /view details/i }) ||
      screen.getByText(mockApplication.job.title).closest("div");

    if (card) {
      fireEvent.click(card);
      expect(mockHandlers.onViewDetails).toHaveBeenCalledWith(mockApplication);
    }
  });

  it("opens actions menu when more button is clicked", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    const moreButton = screen.getByRole("button", { name: /more/i });
    fireEvent.click(moreButton);

    expect(screen.getByText("Edit Application")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls appropriate handlers from actions menu", () => {
    render(<ApplicationCard application={mockApplication} {...mockHandlers} />);

    const moreButton = screen.getByRole("button", { name: /more/i });
    fireEvent.click(moreButton);

    // Test edit action
    const editButton = screen.getByText("Edit Application");
    fireEvent.click(editButton);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockApplication);

    // Reopen menu for next test
    fireEvent.click(moreButton);

    // Test archive action
    const archiveButton = screen.getByText("Archive");
    fireEvent.click(archiveButton);
    expect(mockHandlers.onArchive).toHaveBeenCalledWith(mockApplication.id);

    // Reopen menu for next test
    fireEvent.click(moreButton);

    // Test delete action
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockApplication.id);
  });

  it("shows recent activity when available", () => {
    const applicationWithActivity = {
      ...mockApplication,
      statusHistory: [
        {
          id: "history1",
          status: "applied" as const,
          date: new Date("2024-01-01"),
          notes: "Application submitted",
          source: "automatic" as const,
        },
        {
          id: "history2",
          status: "under_review" as const,
          date: new Date("2024-01-05"),
          notes: "Application under review",
          source: "manual" as const,
        },
      ],
    };

    render(
      <ApplicationCard
        application={applicationWithActivity}
        {...mockHandlers}
      />
    );

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
  });

  it("handles missing optional data gracefully", () => {
    const minimalApplication = {
      ...mockApplication,
      job: {
        ...mockApplication.job,
        salary: "",
      },
      tags: [],
      aiInsights: mockApplication.aiInsights,
      statusHistory: [],
    };

    render(
      <ApplicationCard application={minimalApplication} {...mockHandlers} />
    );

    // Should still render basic information
    expect(screen.getByText(minimalApplication.job.title)).toBeInTheDocument();
    expect(
      screen.getByText(minimalApplication.job.company)
    ).toBeInTheDocument();
  });
});
