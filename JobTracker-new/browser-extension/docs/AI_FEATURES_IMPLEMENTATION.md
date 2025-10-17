# JobTracker AI Features - Implementation Documentation

## Document Overview

**Version:** 1.0.0
**Last Updated:** 2025-10-16
**Status:** Implementation in Progress
**Owner:** Development Team

This document provides detailed technical specifications for implementing AI-powered features in JobTracker browser extension, based on the approved comprehensive strategy.

---

## Table of Contents

1. [Strategy Overview](#strategy-overview)
2. [Phase 1: Intelligent Job Capture](#phase-1-intelligent-job-capture)
3. [Phase 2: Gmail Integration](#phase-2-gmail-integration)
4. [Phase 3: AI Resume Tailoring](#phase-3-ai-resume-tailoring)
5. [Phase 4: AI Cover Letter Generator](#phase-4-ai-cover-letter-generator)
6. [Phase 5: Interview Preparation](#phase-5-interview-preparation)
7. [Infrastructure & APIs](#infrastructure--apis)
8. [Cost Analysis](#cost-analysis)
9. [Testing Strategy](#testing-strategy)

---

## Strategy Overview

### Competitive Analysis Summary

**Market Gap Identified:**
- **Simplify/Teal/Huntr:** Only capture at time of application (browser scraping)
- **LazyApply/Sonara:** Auto-submit with low quality, high failure rate
- **Final Round AI/Huru:** Interview prep only, no tracking integration

**Our Unique Position:**
- ✅ Full lifecycle tracking (application → interview → offer)
- ✅ Email-based backup (catches everything)
- ✅ LLM-powered extraction (adapts to website changes)
- ✅ Integrated AI features (resume, cover letter, interview prep)

### Feature Prioritization for Launch

**Phase 1 Release (Weeks 1-12):**

| Feature | Priority | Rationale | Status |
|---------|----------|-----------|--------|
| Intelligent Job Capture | P0 | Foundation for all other features | 🟡 In Progress |
| Gmail Integration | P0 | Unique differentiator | 🔴 Not Started |
| AI Resume Tailoring | P1 | High user value, monetization | 🔴 Not Started |
| AI Cover Letter | P1 | Complements resume tailoring | 🔴 Not Started |
| Interview Prep (Basic) | P2 | Nice-to-have for launch | 🔴 Not Started |
| Autofill Applications | P3 | Phase 2 (Month 4-6) | 🔴 Deferred |
| Auto-Submit Jobs | P4 | Phase 3 (Month 7+) | 🔴 Deferred |

---

## Phase 1: Intelligent Job Capture

### Overview

**Goal:** Automatically detect and extract job application data when users browse job portals or apply for positions.

**Approach:** Hybrid system combining:
1. **Portal Detection** - Identify when user is on a job page
2. **LLM Extraction** - Use GPT-4o-mini to extract structured data
3. **Confidence Scoring** - Rate extraction accuracy
4. **User Confirmation** - Show overlay for review before saving

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   User Browses Web                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Content Script (content/index.ts)             │
│  - Monitors URL changes                                 │
│  - Detects job portal patterns                          │
│  - Captures page HTML                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│        Portal Detector (content/detectors/)             │
│  - LinkedIn detector                                    │
│  - Indeed detector                                      │
│  - Greenhouse detector                                  │
│  - Generic job page detector                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ (if job page detected)
┌─────────────────────────────────────────────────────────┐
│      Badge Notification (content/components/Badge)      │
│  - Shows "Job Detected" indicator                       │
│  - Click to open capture overlay                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ (user clicks)
┌─────────────────────────────────────────────────────────┐
│    Data Extractor (background/services/extractor.ts)    │
│  - Sends page content to Supabase Edge Function         │
│  - Calls GPT-4o-mini for extraction                     │
│  - Returns structured job data                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│   Capture Overlay (content/components/CaptureOverlay)   │
│  - Shows extracted data with confidence scores          │
│  - Allows inline editing of low-confidence fields       │
│  - User confirms or cancels                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ (user confirms)
┌─────────────────────────────────────────────────────────┐
│         Save to Supabase (via useJobApplications)       │
│  - Creates new application record                       │
│  - Syncs with web app                                   │
└─────────────────────────────────────────────────────────┘
```

### Implementation Details

#### 1. Portal Detection System

**File:** `src/content/detectors/index.ts`

**Supported Portals (Phase 1):**
- LinkedIn Jobs
- Indeed
- Greenhouse (ATS)
- Lever (ATS)
- Workday (ATS)
- Generic job pages (fallback)

**Detection Logic:**

```typescript
interface PortalDetector {
  name: string;
  pattern: RegExp;
  isJobPage: (url: string, document: Document) => boolean;
  extractBasicData?: (document: Document) => Partial<JobData>;
}

const detectors: PortalDetector[] = [
  {
    name: 'LinkedIn',
    pattern: /linkedin\.com\/jobs\/view/,
    isJobPage: (url, doc) => {
      return url.includes('linkedin.com/jobs/view') &&
             doc.querySelector('.job-details') !== null;
    },
    extractBasicData: (doc) => ({
      title: doc.querySelector('.job-details h1')?.textContent,
      company: doc.querySelector('.job-details .company-name')?.textContent,
    })
  },
  {
    name: 'Indeed',
    pattern: /indeed\.com\/viewjob/,
    isJobPage: (url, doc) => {
      return url.includes('indeed.com/viewjob') &&
             doc.querySelector('#jobDescriptionText') !== null;
    }
  },
  // ... more detectors
];
```

**Usage:**
```typescript
// In content script
const detector = detectJobPortal(window.location.href, document);
if (detector) {
  showDetectionBadge(detector.name);
}
```

#### 2. LLM-Based Data Extraction

**File:** `supabase/functions/extract-job-data/index.ts`

**Input:**
```typescript
{
  html: string;          // Page HTML (sanitized, max 50KB)
  url: string;           // Job posting URL
  portal?: string;       // Detected portal name
  basicData?: object;    // Pre-extracted data from detector
}
```

**LLM Prompt:**
```typescript
const EXTRACTION_PROMPT = `
You are an expert job application data extractor. Extract structured information from this job posting HTML.

Job Page HTML:
{html}

Job URL: {url}

Extract the following fields with high accuracy:

1. job_title (string) - The exact job title
2. company (string) - Company name
3. location (string) - Job location (city, state/country, remote status)
4. salary_range (string | null) - Salary if mentioned (e.g., "$120k-150k", "£60,000")
5. job_type (string) - Full-time, Part-time, Contract, Internship
6. remote_type (string) - Remote, Hybrid, On-site
7. description (string) - Job description (first 500 words)
8. requirements (string[]) - List of key requirements/qualifications
9. responsibilities (string[]) - List of key responsibilities
10. benefits (string[]) - List of benefits if mentioned
11. application_deadline (string | null) - Deadline if mentioned (ISO date)

For each field, also provide a confidence score (0.0-1.0):
- 1.0 = Very High (explicitly stated, no ambiguity)
- 0.8 = High (clearly stated with minor formatting issues)
- 0.6 = Medium (inferred from context, likely correct)
- 0.4 = Low (guessed, may be incorrect)
- 0.0 = Not found

Return JSON:
{
  "job_title": {"value": "...", "confidence": 0.95},
  "company": {"value": "...", "confidence": 1.0},
  ...
}
`;
```

**Edge Function Implementation:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { html, url, portal, basicData } = await req.json();

  // Sanitize HTML (remove scripts, styles, keep text content)
  const sanitizedHTML = sanitizeHTML(html);

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert job data extractor. Return only valid JSON.'
        },
        {
          role: 'user',
          content: EXTRACTION_PROMPT
            .replace('{html}', sanitizedHTML.slice(0, 10000))
            .replace('{url}', url)
        }
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  const extracted = JSON.parse(data.choices[0].message.content);

  // Merge with basicData if available (prefer LLM if confidence > 0.8)
  const merged = mergeExtractedData(extracted, basicData);

  return new Response(JSON.stringify(merged), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**Cost Optimization:**
- Max 10,000 tokens per request (~50KB HTML)
- GPT-4o-mini: $0.15/1M input tokens, $0.60/1M output tokens
- Average cost per extraction: ~$0.002 (0.002 cents)
- With 1000 users extracting 30 jobs/month = $60/month

#### 3. Capture Overlay UI

**File:** `src/content/components/CaptureOverlay.tsx`

**Design:**
```typescript
interface CaptureOverlayProps {
  extractedData: ExtractedJobData;
  onSave: (data: JobApplication) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CaptureOverlay: React.FC<CaptureOverlayProps> = ({
  extractedData,
  onSave,
  onCancel,
  isLoading
}) => {
  const [editedData, setEditedData] = useState(extractedData);

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Overlay Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-br from-primary-600/10 to-secondary-500/10 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-500/20">
                <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Job Detected! ✨
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Review and save this application
                </p>
              </div>
            </div>
            <button onClick={onCancel} className="...">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Job Title */}
          <FieldWithConfidence
            label="Job Title"
            value={editedData.job_title.value}
            confidence={editedData.job_title.confidence}
            onChange={(value) => updateField('job_title', value)}
          />

          {/* Company */}
          <FieldWithConfidence
            label="Company"
            value={editedData.company.value}
            confidence={editedData.company.confidence}
            onChange={(value) => updateField('company', value)}
          />

          {/* Location */}
          <FieldWithConfidence
            label="Location"
            value={editedData.location.value}
            confidence={editedData.location.confidence}
            onChange={(value) => updateField('location', value)}
          />

          {/* Salary (Optional) */}
          {editedData.salary_range.value && (
            <FieldWithConfidence
              label="Salary Range"
              value={editedData.salary_range.value}
              confidence={editedData.salary_range.confidence}
              onChange={(value) => updateField('salary_range', value)}
              optional
            />
          )}

          {/* Job Type & Remote */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWithConfidence
              label="Job Type"
              value={editedData.job_type.value}
              confidence={editedData.job_type.confidence}
              onChange={(value) => updateField('job_type', value)}
            />
            <FieldWithConfidence
              label="Work Type"
              value={editedData.remote_type.value}
              confidence={editedData.remote_type.confidence}
              onChange={(value) => updateField('remote_type', value)}
            />
          </div>

          {/* Description Preview */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="text-sm font-semibold mb-2">Description Preview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
              {editedData.description.value}
            </p>
          </div>

          {/* Requirements */}
          {editedData.requirements.value.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="text-sm font-semibold mb-2">Key Requirements</h3>
              <ul className="space-y-1">
                {editedData.requirements.value.slice(0, 5).map((req, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-primary-500">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getOverallConfidenceIcon(calculateOverallConfidence(editedData))}
                  <span>Overall Confidence: {Math.round(calculateOverallConfidence(editedData) * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => onSave(transformToJobApplication(editedData))}
                loading={isLoading}
              >
                <PlusCircle className="h-4 w-4" />
                Save Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Confidence Indicator Component:**
```typescript
const FieldWithConfidence: React.FC<{
  label: string;
  value: string;
  confidence: number;
  onChange: (value: string) => void;
  optional?: boolean;
}> = ({ label, value, confidence, onChange, optional }) => {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    if (conf >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.6) return 'Medium';
    if (conf >= 0.4) return 'Low';
    return 'Very Low';
  };

  const showEdit = confidence < 0.8;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {optional && <span className="text-gray-400">(Optional)</span>}
        </label>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-current" style={{ color: getConfidenceColor(confidence) }} />
          <span className={`text-xs ${getConfidenceColor(confidence)}`}>
            {getConfidenceLabel(confidence)}
          </span>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm",
            confidence >= 0.8
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
              : "border-gray-300 dark:border-gray-700"
          )}
          readOnly={!showEdit}
        />
        {showEdit && (
          <span className="absolute right-3 top-2.5 text-xs text-gray-400">
            ✏️ Edit if needed
          </span>
        )}
      </div>
    </div>
  );
};
```

#### 4. Confidence Scoring Algorithm

```typescript
interface ConfidenceMetrics {
  overall: number;
  byField: Record<string, number>;
  warnings: string[];
}

function calculateConfidenceMetrics(data: ExtractedJobData): ConfidenceMetrics {
  const requiredFields = ['job_title', 'company', 'location'];
  const optionalFields = ['salary_range', 'job_type', 'remote_type'];

  // Calculate weighted confidence
  const fieldWeights = {
    job_title: 0.3,
    company: 0.3,
    location: 0.2,
    salary_range: 0.05,
    job_type: 0.075,
    remote_type: 0.075,
  };

  let weightedSum = 0;
  let totalWeight = 0;
  const byField: Record<string, number> = {};
  const warnings: string[] = [];

  for (const [field, weight] of Object.entries(fieldWeights)) {
    const confidence = data[field]?.confidence || 0;
    byField[field] = confidence;
    weightedSum += confidence * weight;
    totalWeight += weight;

    // Add warnings for low confidence required fields
    if (requiredFields.includes(field) && confidence < 0.6) {
      warnings.push(`Low confidence on ${field} - please review`);
    }
  }

  const overall = weightedSum / totalWeight;

  return { overall, byField, warnings };
}
```

---

## Phase 2: Gmail Integration

### Overview

**Goal:** Automatically track job applications via email confirmations, interview invitations, and status updates.

**Architecture:**
```
User's Gmail → OAuth2 → Extension Popup → Background Worker
                                            ↓
                                    Supabase Edge Function
                                            ↓
                                    Gmail API (every 15 min)
                                            ↓
                                Filter job-related emails
                                            ↓
                                    LLM Extraction
                                            ↓
                            Match to existing applications
                                            ↓
                            Update or create application
```

### Implementation (Detailed in next section)

*To be documented in next update*

---

## Phase 3: AI Resume Tailoring

### Overview

**Goal:** Generate ATS-optimized, job-specific resumes in 10 seconds.

*Detailed implementation to be documented*

---

## Phase 4: AI Cover Letter Generator

### Overview

**Goal:** Create personalized cover letters with company research.

*Detailed implementation to be documented*

---

## Phase 5: Interview Preparation

### Overview

**Goal:** Generate interview questions and provide practice framework.

*Detailed implementation to be documented*

---

## Infrastructure & APIs

### Supabase Edge Functions

**Functions to Create:**

1. `extract-job-data` - LLM extraction from HTML
2. `process-gmail-emails` - Email parsing and matching
3. `tailor-resume` - Resume optimization
4. `generate-cover-letter` - Cover letter creation
5. `generate-interview-questions` - Question generation

### API Keys Required

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Google OAuth (for Gmail)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## Cost Analysis

### Per 1000 Users/Month

| Feature | Free Users (700) | Pro Users (300) | Total Cost |
|---------|------------------|-----------------|------------|
| Job Extraction (30/user) | $60 | $18 | $78 |
| Email Processing (10/user) | $350 | $150 | $500 |
| Resume Tailoring (3 vs 10) | $21 | $300 | $321 |
| Cover Letters (3 vs 10) | $17 | $240 | $257 |
| Interview Prep | $35 | $15 | $50 |
| **Total** | **$483** | **$723** | **$1,206** |

**Revenue:** 300 Pro users × $19.99 = $5,997/month
**Gross Margin:** 80%

---

## Testing Strategy

### Unit Tests
- Portal detectors
- Data extraction functions
- Confidence calculation
- UI components

### Integration Tests
- End-to-end job capture flow
- Gmail OAuth flow
- Resume tailoring pipeline

### Manual Testing
- Test on 10+ job boards
- Verify LLM extraction accuracy (target: >85%)
- User testing with beta group (50 users)

---

## Next Steps

1. ✅ Documentation created
2. 🟡 Implement portal detection system
3. 🔴 Build LLM extraction Edge Function
4. 🔴 Create capture overlay UI
5. 🔴 Integration testing
6. 🔴 Beta launch

---

**Document Status:** Living document - updated as implementation progresses
