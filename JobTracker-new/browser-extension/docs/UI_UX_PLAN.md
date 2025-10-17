# JobTracker Chrome Extension v2 - Comprehensive UI/UX Plan

## Executive Summary

This document outlines a comprehensive UI/UX plan for the JobTracker Chrome Extension v2, designed to create a cohesive, professional experience that mirrors the web application while optimizing for the extension form factor. The design emphasizes speed, clarity, and seamless integration with the main JobTracker workspace.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Design System & Component Library](#design-system--component-library)
3. [Screen Inventory & User Flows](#screen-inventory--user-flows)
4. [Detailed Screen Designs](#detailed-screen-designs)
5. [Interaction Patterns](#interaction-patterns)
6. [Competitive Analysis](#competitive-analysis)
7. [Technical Considerations](#technical-considerations)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Design Philosophy

### Core Principles

1. **Unified Brand Experience**
   - Mirror the web app's glassmorphism aesthetic, gradient accents, and premium feel
   - Maintain visual consistency across all touchpoints (web, extension, future mobile)
   - Use the same design tokens, color palette, and typography system

2. **Speed & Efficiency**
   - Single-task surfaces optimized for quick actions
   - Minimal clicks to complete primary tasks (capture job, view status, add note)
   - Progressive disclosure: show essential info, hide complexity

3. **Trust & Transparency**
   - Clear confidence indicators for auto-captured data
   - Explicit sync status and data flow visibility
   - User control over automation and AI features

4. **Accessibility First**
   - WCAG 2.1 AA compliance minimum
   - Full keyboard navigation support
   - High contrast mode toggle
   - Screen reader optimized

### Design Values

- **Professional, not corporate**: Friendly but competent tone
- **Confidence-inspiring**: Clear feedback, no ambiguity
- **Delightful**: Smooth animations, thoughtful micro-interactions
- **Respectful**: No dark patterns, transparent data handling

---

## Design System & Component Library

### Shared Components from Web App

The extension will reuse components from the `@jobtracker/ui` package to ensure consistency:

#### Base Components
- **Button** (`Button.tsx`)
  - Variants: primary, secondary, outline, ghost, destructive, success
  - Sizes: sm, default, lg, xl, icon
  - States: default, hover, active, disabled, loading
  - Icon support: leftIcon, rightIcon

- **Card** (`Card.tsx`)
  - Variants: default, surface, elevated, outline, premium, glass
  - Sizes: sm, default, lg, xl, 2xl
  - Hover effects: none, lift, glow, border, scale, lift-glow
  - Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

- **Input** (Popup implementation)
  - Label, placeholder, icon support
  - Error states with inline messaging
  - Auto-complete support
  - Password visibility toggle

- **Badge** (Web app pattern)
  - Status indicators (applied, interview, rejected, etc.)
  - Color-coded by status category
  - Size variants

### Extension-Specific Components

#### CaptureCard
Quick-capture overlay for job postings with confidence indicators.

```tsx
<CaptureCard
  jobData={extractedData}
  confidence={confidenceScores}
  onSave={handleSave}
  onEdit={handleEdit}
  onDismiss={handleDismiss}
/>
```

**Visual Design:**
- Glassmorphic card with soft shadow
- Sectioned layout: Job Info, Requirements, Metadata
- Confidence chips (High/Medium/Low) with color coding
- Inline edit capability for low-confidence fields

#### QuickStatusBadge
Compact status indicator with action menu.

```tsx
<QuickStatusBadge
  status="interview"
  onChange={handleStatusChange}
  contextActions={['Add note', 'Schedule reminder']}
/>
```

**Visual Design:**
- Pill-shaped badge matching web app StatusBadge
- Hover reveals dropdown for quick actions
- Animated transitions between states

#### SyncIndicator
Real-time sync status component for header.

```tsx
<SyncIndicator
  status="synced" | "syncing" | "offline"
  lastSyncTime={timestamp}
/>
```

**Visual Design:**
- Icon-based (checkmark, spinner, offline)
- Color-coded: green (synced), blue (syncing), gray (offline)
- Tooltip shows last sync time and details

### Color Palette

Using the shared design system (`tailwind-preset.js`):

**Primary Colors**
- Primary-600: Main brand color (buttons, links, accents)
- Primary-500: Hover states
- Primary-400: Focus rings, highlights
- Primary-100: Subtle backgrounds

**Semantic Colors**
- Success-600: Positive actions, completed states
- Warning-600: Pending actions, attention needed
- Error-600: Destructive actions, errors
- Info-600: Informational highlights

**Surface Colors**
- surface-1: Base background
- surface-2: Elevated cards
- surface-3: Nested elements
- surface-subtle: Glassmorphic overlays

**Text Colors**
- foreground: Primary text
- muted-foreground: Secondary text, labels
- border-muted: Subtle borders
- border-contrast: Emphasized borders

### Typography

**Font Stack** (from design system):
- Primary: Inter (system-ui fallback)
- Mono: Fira Code (for code/data display)

**Type Scale:**
- Heading: 1.45rem (23px) / semibold - Main titles
- Subheading: 1rem (16px) / medium - Section headers
- Body: 0.875rem (14px) / regular - Main content
- Caption: 0.75rem (12px) / regular - Metadata, labels
- Micro: 0.65rem (10px) / semibold / uppercase - Tags, badges

### Spacing System

Using 4px base unit (from design-system):
- space-1: 4px
- space-2: 8px
- space-3: 12px
- space-4: 16px
- space-6: 24px
- space-8: 32px

### Shadows & Elevation

**Levels** (from design-system):
- Level-1: Subtle lift for cards (`shadow-level-1`)
- Level-2: Prominent elevation for modals (`shadow-level-2`)
- Level-3: Maximum depth for overlays (`shadow-level-3`)
- Glow: Accent highlights for primary actions (`shadow-glow`)

### Animations

**Motion Language** (matching web app):
- **Fade-in**: 0.5s ease-out - Page/component entry
- **Slide-up**: 0.3s ease-out - Cards, modals
- **Scale-in**: 0.2s ease-out - Tooltips, dropdowns
- **Spring**: Custom cubic-bezier - Interactive elements

**Performance:**
- Use transform and opacity only (GPU-accelerated)
- Respect user's motion preferences (`prefers-reduced-motion`)
- 60fps minimum for all animations

---

## Screen Inventory & User Flows

### Primary Screens

1. **Onboarding Flow** (First-time users)
   - Welcome Screen
   - Permissions Request
   - Login/Signup

2. **Authenticated Popup** (Main interface)
   - Dashboard View
   - Quick Actions
   - Recent Applications

3. **Capture Overlay** (In-page detection)
   - Auto-detected job data
   - Manual capture form

4. **Applications List**
   - Compact list view
   - Filters & search
   - Quick actions menu

5. **Application Detail**
   - Full job info
   - Status timeline
   - Notes & documents

6. **Settings**
   - Account management
   - Preferences
   - Sync status
   - Privacy controls

### User Flows

#### Flow 1: First-Time User Onboarding
```
Extension Install → Welcome Screen → Permission Request → Login → Dashboard → Tour Highlights
```

**Goal:** Get user authenticated and oriented in <60 seconds

#### Flow 2: Quick Job Capture
```
Browse Job Posting → Detection Badge Appears → Click Badge → Review Auto-Filled Data → Click "Save" → Confirmation Toast
```

**Goal:** Capture job in <10 seconds

#### Flow 3: Status Update
```
Click Extension Icon → Dashboard View → Locate Application → Click Status Badge → Select New Status → Auto-Sync
```

**Goal:** Update status in <5 seconds

#### Flow 4: Add Interview Note
```
Dashboard → Application Card → "Add Note" → Quick Note Modal → Type & Save → Instant Sync
```

**Goal:** Add context in <15 seconds

---

## Detailed Screen Designs

### 1. Onboarding Flow

#### Welcome Screen

**Layout:**
```
┌─────────────────────────────────┐
│ [Gradient Border Container]     │
│  ┌───────────────────────────┐  │
│  │ 🎯 JobTracker             │  │
│  │                           │  │
│  │ Your AI-Powered          │  │
│  │ Job Search Companion     │  │
│  │                           │  │
│  │ ✓ Auto-capture jobs      │  │
│  │ ✓ AI resume tailoring    │  │
│  │ ✓ Interview prep         │  │
│  │                           │  │
│  │ [Get Started →]           │  │
│  │                           │  │
│  │ Already have account?     │  │
│  │ [Sign In]                 │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Dimensions:** 380px × 500px

**Visual Elements:**
- Gradient border (primary-600 → secondary-500)
- Glassmorphic background with blur
- Animated gradient orbs in background
- Feature list with checkmark icons (Lucide CheckCircle2)
- Primary CTA button with glow effect

**Copy:**
- Headline: "Your AI-Powered Job Search Companion"
- Features: Auto-capture, AI tools, Sync
- CTA: "Get Started" (primary button)
- Secondary: "Sign In" (ghost button)

#### Permissions Screen

**Layout:**
```
┌─────────────────────────────────┐
│ Setup Permissions                │
│                                  │
│ To provide the best experience, │
│ JobTracker needs:                │
│                                  │
│ ☑ Read job boards                │
│   Auto-detect postings           │
│                                  │
│ ☑ Store data locally             │
│   Offline support & speed        │
│                                  │
│ ☐ Notifications (optional)       │
│   Interview reminders            │
│                                  │
│ [Continue] [Learn More →]        │
└─────────────────────────────────┘
```

**Dimensions:** 380px × 480px

**Interaction:**
- Required permissions: pre-checked, disabled
- Optional permissions: user-controlled toggles
- "Learn More" link → opens docs in new tab
- "Continue" enabled when required granted

#### Login Screen (Current Implementation Enhanced)

**Improvements to Existing Design:**
- ✅ Current gradient border is excellent - keep it
- ✅ Glassmorphic background - keep it
- ✅ Two-field form (email/password) - keep it
- **Add:** Social login options (Google, LinkedIn)
- **Add:** "Remember me" checkbox
- **Add:** Progress indicator during auth
- **Enhance:** Error messaging with suggestions

**New Layout:**
```
┌─────────────────────────────────┐
│ 🎯 JobTracker Assistant          │
│                                  │
│ Sign in to continue             │
│                                  │
│ [Email input]                    │
│ [Password input]                 │
│                                  │
│ ☐ Remember me                    │
│ [Forgot password?]               │
│                                  │
│ [Sign In →]                      │
│                                  │
│ ─────── or ───────              │
│                                  │
│ [🔵 Continue with Google]        │
│ [💼 Continue with LinkedIn]      │
│                                  │
│ New to JobTracker?               │
│ [Create account →]               │
└─────────────────────────────────┘
```

**Dimensions:** 380px × 580px

### 2. Main Popup Dashboard

**Layout (Post-Login):**
```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │ 👤 Kuldeep S.  [⚙️] [🔔]    │ │
│ │ ● Synced 2m ago              │ │
│ └─────────────────────────────┘ │
│                                  │
│ ┌─── Quick Stats ────────────┐  │
│ │ 12 Total  |  8 Active      │  │
│ │  3 Interview | 1 Offer     │  │
│ └────────────────────────────┘  │
│                                  │
│ ┌─── Quick Actions ──────────┐  │
│ │ [+ Capture Job]             │  │
│ │ [📋 View All Apps]          │  │
│ │ [🎯 Open Dashboard]         │  │
│ └────────────────────────────┘  │
│                                  │
│ Recent Applications             │
│ ┌────────────────────────────┐  │
│ │ 🏢 Senior Engineer          │  │
│ │    Stripe · SF              │  │
│ │    🟡 Interview · 2d ago    │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 🏢 Product Manager          │  │
│ │    Figma · Remote           │  │
│ │    🟢 Applied · 1w ago      │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 🏢 Staff Designer           │  │
│ │    Linear · NYC             │  │
│ │    🔴 Rejected · 2w ago     │  │
│ └────────────────────────────┘  │
│                                  │
│ [View All Applications →]       │
└─────────────────────────────────┘
```

**Dimensions:** 380px × 600px (scrollable)

**Sections:**

1. **Header Bar** (60px)
   - User avatar/initials (left)
   - Sync status indicator (animated dot + text)
   - Settings icon (right)
   - Notification bell icon (right)

2. **Quick Stats** (80px)
   - Four-column grid layout
   - Icon + number + label
   - Colored backgrounds matching web app stat cards
   - Subtle hover effect

3. **Quick Actions** (120px)
   - Three primary action buttons
   - Icon + descriptive text
   - "Capture Job" with primary styling
   - Other actions with outline styling

4. **Recent Applications List** (scrollable)
   - Compact card design
   - Company icon/logo placeholder
   - Job title (bold, truncated)
   - Company + location (muted)
   - Status badge + relative time
   - Hover reveals action menu (…)

**Interactions:**
- Click application → Opens detail view
- Long-press/right-click → Quick actions menu
- Pull-to-refresh for sync
- Click stats → Filters applications view

### 3. Capture Overlay (In-Page)

**Trigger:**
- Extension detects job posting on supported ATS
- Badge appears in bottom-right corner
- Click badge → Slide-in overlay panel

**Layout:**
```
┌─────────────────────────────────┐
│ Job Detected! ✨                │
│ [Close ×]                        │
│                                  │
│ Job Title                        │
│ ┌─────────────────────────────┐ │
│ │ Senior Software Engineer    │ │
│ │ Confidence: ●●●●○ High      │ │
│ └─────────────────────────────┘ │
│                                  │
│ Company                          │
│ ┌─────────────────────────────┐ │
│ │ Stripe, Inc.                │ │
│ │ Confidence: ●●●●● Very High │ │
│ └─────────────────────────────┘ │
│                                  │
│ Location                         │
│ ┌─────────────────────────────┐ │
│ │ San Francisco, CA (Hybrid)  │ │
│ │ Confidence: ●●●○○ Medium    │ │
│ │ [✏️ Edit]                    │ │
│ └─────────────────────────────┘ │
│                                  │
│ Salary (Optional)                │
│ ┌─────────────────────────────┐ │
│ │ $180k - $250k               │ │
│ │ Confidence: ●●○○○ Low       │ │
│ │ [✏️ Edit]                    │ │
│ └─────────────────────────────┘ │
│                                  │
│ ┌─ Requirements ───────────────┐│
│ │ • 5+ years backend exp      ││
│ │ • Python, Go, or Rust       ││
│ │ • Distributed systems       ││
│ └─────────────────────────────┘│
│                                  │
│ [Save to JobTracker] [Review →] │
└─────────────────────────────────┘
```

**Dimensions:** 360px width × viewport height (max 700px)

**Visual Design:**
- Slides in from right edge
- Glassmorphic backdrop blur on page
- Rounded corners on left edge
- Drop shadow for depth
- Sticky header with close button

**Confidence Indicators:**
- Very High: 5/5 dots, green accent
- High: 4/5 dots, green accent
- Medium: 3/5 dots, yellow accent
- Low: 2/5 dots, orange accent
- Very Low: 1/5 dots, red accent

**Field States:**
- High confidence: Read-only with check icon
- Medium/Low confidence: Editable, shows pencil icon
- Empty fields: Placeholder text, edit icon prominent

**Actions:**
- **Save to JobTracker** (Primary button)
  - Saves with current data
  - Shows success toast
  - Closes overlay
  - Badge shows checkmark

- **Review** (Secondary button)
  - Opens detailed edit form
  - Allows adding notes, tags, custom fields
  - Provides AI suggestions

### 4. Applications List View

**Layout:**
```
┌─────────────────────────────────┐
│ [← Back] Applications  [Filter] │
│                                  │
│ [Search applications...]         │
│                                  │
│ ┌─ Filters ─────────────────┐   │
│ │ ⚡ Active Only              │  │
│ │ 📅 This Week                │  │
│ │ 🎯 High Priority           │   │
│ └────────────────────────────┘  │
│                                  │
│ 12 Applications                  │
│ [Sort: Recent ▼]                 │
│                                  │
│ ┌────────────────────────────┐  │
│ │ 🏢 Senior Engineer         │  │
│ │    Stripe                   │  │
│ │    🟡 Interview             │  │
│ │    Applied 2 days ago       │  │
│ │    [⋮]                      │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 🏢 Product Manager         │  │
│ │    Figma                    │  │
│ │    🟢 Applied               │  │
│ │    Applied 1 week ago       │  │
│ │    [⋮]                      │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 🏢 Staff Designer          │  │
│ │    Linear                   │  │
│ │    🔴 Rejected              │  │
│ │    Applied 2 weeks ago      │  │
│ │    [⋮]                      │  │
│ └────────────────────────────┘  │
│                                  │
│ [Load More...]                   │
└─────────────────────────────────┘
```

**Dimensions:** 380px × 600px (scrollable)

**Features:**

1. **Search Bar**
   - Real-time filtering
   - Searches: title, company, location, notes
   - Clear button appears when text entered

2. **Quick Filters** (Pills)
   - Pre-defined filters (Active, This Week, High Priority)
   - Toggle on/off
   - Shows count when active

3. **Sort Dropdown**
   - Recent (default)
   - Company A-Z
   - Status
   - Applied Date
   - Interview Date

4. **Application Cards**
   - Compact layout
   - Status badge (color-coded)
   - Relative time display
   - Three-dot menu for actions

5. **Action Menu** (on ⋮ click)
   - View Details
   - Change Status
   - Add Note
   - Add Reminder
   - Archive
   - Delete

### 5. Application Detail View

**Layout:**
```
┌─────────────────────────────────┐
│ [← Back]               [⋮ More] │
│                                  │
│ 🏢 Senior Software Engineer      │
│    at Stripe                     │
│                                  │
│ 🟡 Interview                     │
│ [Change Status ▼]                │
│                                  │
│ ┌─ Job Details ────────────────┐│
│ │ Location: San Francisco, CA  ││
│ │ Salary: $180k - $250k        ││
│ │ Type: Full-time, Hybrid      ││
│ │ Posted: 2 weeks ago          ││
│ │                              ││
│ │ [View Full Posting →]        ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ Timeline ───────────────────┐│
│ │ ● Interview Scheduled        ││
│ │   Today, 3:00 PM             ││
│ │                              ││
│ │ ○ Phone Screen Completed     ││
│ │   2 days ago                 ││
│ │                              ││
│ │ ○ Applied                    ││
│ │   1 week ago                 ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ Notes ──────────────────────┐│
│ │ "Team seems great. Focus on  ││
│ │  distributed systems..."     ││
│ │  Added 2 days ago            ││
│ │                              ││
│ │ [+ Add Note]                 ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ Documents ──────────────────┐│
│ │ 📄 Resume_Stripe_v2.pdf      ││
│ │ 📄 Cover_Letter.pdf          ││
│ │ [+ Upload]                   ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ AI Insights ────────────────┐│
│ │ Match Score: 85% ⭐          ││
│ │                              ││
│ │ Strong match:                ││
│ │ • Backend systems expertise  ││
│ │ • Python & Go experience     ││
│ │                              ││
│ │ To improve:                  ││
│ │ • Highlight payment systems  ││
│ │                              ││
│ │ [Tailor Resume →]            ││
│ └──────────────────────────────┘│
└─────────────────────────────────┘
```

**Dimensions:** 380px × scrollable (700px typical)

**Sections:**

1. **Header**
   - Back button
   - Job title + company (large, bold)
   - More actions menu (⋮)

2. **Status Section**
   - Current status badge (large)
   - Change status dropdown
   - Quick actions based on status

3. **Job Details Card**
   - Key metadata in two-column layout
   - Link to original posting
   - Edit button for manual adjustments

4. **Timeline**
   - Vertical timeline with dots
   - Filled dots for completed steps
   - Empty dots for pending
   - Timestamps for each event

5. **Notes Section**
   - Display recent notes
   - Add note button
   - Expandable for long notes

6. **Documents Section**
   - List of attached files
   - Upload new files
   - View/download actions

7. **AI Insights** (if available)
   - Match score with visual indicator
   - Strengths and gaps
   - Action buttons (Tailor Resume, etc.)

### 6. Settings Screen

**Layout:**
```
┌─────────────────────────────────┐
│ [← Back] Settings                │
│                                  │
│ ┌─ Account ────────────────────┐│
│ │ 👤 kuldeep@example.com       ││
│ │ Premium Plan                 ││
│ │                              ││
│ │ [Manage Account →]           ││
│ │ [Sign Out]                   ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ Preferences ────────────────┐│
│ │ Auto-open capture overlay    ││
│ │ ☑ Enabled                    ││
│ │                              ││
│ │ AI Suggestions               ││
│ │ ☑ Enabled                    ││
│ │                              ││
│ │ Theme                        ││
│ │ ⚪ Auto ⚪ Light ⚫ Dark      ││
│ │                              ││
│ │ Notifications                ││
│ │ ☑ Interview reminders        ││
│ │ ☐ Application updates        ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ Sync ───────────────────────┐│
│ │ Status: ● Synced             ││
│ │ Last synced: 2 minutes ago   ││
│ │                              ││
│ │ [Sync Now]                   ││
│ │ [View Sync Logs]             ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ Data & Privacy ─────────────┐│
│ │ Analytics Opt-in             ││
│ │ ☑ Help improve JobTracker    ││
│ │                              ││
│ │ [Privacy Policy]             ││
│ │ [Terms of Service]           ││
│ │                              ││
│ │ [Export All Data]            ││
│ │ [Delete Account]             ││
│ └──────────────────────────────┘│
│                                  │
│ ┌─ Support ────────────────────┐│
│ │ Version 2.0.0                ││
│ │                              ││
│ │ [Help Center]                ││
│ │ [Send Feedback]              ││
│ │ [Report Bug]                 ││
│ └──────────────────────────────┘│
└─────────────────────────────────┘
```

**Dimensions:** 380px × scrollable (800px typical)

**Sections:**

1. **Account**
   - User info
   - Plan status
   - Manage/sign out actions

2. **Preferences**
   - Feature toggles
   - Theme selection
   - Notification controls

3. **Sync**
   - Real-time status
   - Manual sync trigger
   - Debug logs access

4. **Data & Privacy**
   - Analytics opt-in
   - Policy links
   - Data export/deletion

5. **Support**
   - Version info
   - Help resources
   - Feedback channels

---

## Interaction Patterns

### Micro-Interactions

#### 1. Button Hover/Press
```
Idle → Hover (scale: 1.02, shadow: level-2, 200ms spring)
Hover → Active (scale: 0.98, shadow: level-1, 150ms ease-out)
Active → Success (checkmark icon, green glow, 300ms)
```

#### 2. Card Interactions
```
Default → Hover (translate-y: -2px, shadow: level-2, 200ms)
Tap → Ripple effect from touch point
Swipe left → Reveal quick actions
Pull down → Refresh indicator
```

#### 3. Status Badge Changes
```
Click badge → Dropdown menu slides down (200ms ease-out)
Select new status → Badge morphs to new color (300ms)
Show confirmation toast (bottom center, 3s auto-dismiss)
```

#### 4. Loading States
```
Initial load: Skeleton screens (pulsing gradient)
Data refresh: Shimmer animation across cards
Button loading: Spinner icon rotates (1s linear infinite)
```

### Toast Notifications

**Position:** Bottom-center (mobile-friendly)

**Types:**
- **Success** (green): Checkmark icon, 3s auto-dismiss
- **Error** (red): Alert icon, 5s dismiss or manual
- **Info** (blue): Info icon, 4s auto-dismiss
- **Warning** (yellow): Warning icon, no auto-dismiss

**Layout:**
```
┌─────────────────────────────┐
│ ✓ Application saved!        │
│ Synced to your workspace    │
│ [Undo] [View] [×]          │
└─────────────────────────────┘
```

**Animations:**
- Enter: Slide up from bottom (300ms spring)
- Exit: Fade out + slide down (200ms ease-in)
- Stacking: Newer toasts push older ones up

### Keyboard Shortcuts

**Global:**
- `Cmd/Ctrl + K`: Command palette (future)
- `Cmd/Ctrl + S`: Save current form
- `Esc`: Close modal/overlay
- `Tab`: Navigate form fields
- `Enter`: Submit focused form

**List Navigation:**
- `↑/↓`: Navigate applications
- `Enter`: Open selected application
- `Space`: Toggle checkbox/select
- `Cmd/Ctrl + F`: Focus search

### Gesture Support (Mobile/Touch)

- **Swipe right on application card**: Archive
- **Swipe left on application card**: Delete
- **Long-press on application**: Quick actions menu
- **Pull-to-refresh**: Sync applications
- **Pinch-to-zoom**: (Disabled for consistency)

### Error Handling

**Inline Errors** (Form validation)
```
[Email input]
⚠️ Please enter a valid email address
```

**Page-Level Errors**
```
┌─────────────────────────────────┐
│     😕                           │
│  Something went wrong           │
│                                  │
│  We couldn't load your          │
│  applications. Please try       │
│  again or contact support.      │
│                                  │
│  [Retry] [Contact Support]      │
└─────────────────────────────────┘
```

**Network Errors**
```
🌐 You're offline
Your changes will sync when you're back online.
[Dismiss]
```

**Conflict Resolution**
```
⚠️ Sync Conflict
This application was updated on another device.

Your version: Status = "Interview"
Server version: Status = "Rejected"

[Keep Mine] [Use Server Version] [Review Both]
```

### Empty States

**No Applications**
```
┌─────────────────────────────────┐
│         🎯                       │
│   No applications yet           │
│                                  │
│   Start tracking your job       │
│   search to stay organized      │
│   and land your dream role.     │
│                                  │
│   [+ Add Your First Job]        │
└─────────────────────────────────┘
```

**No Search Results**
```
┌─────────────────────────────────┐
│         🔍                       │
│   No matches found              │
│                                  │
│   Try adjusting your filters    │
│   or search terms.              │
│                                  │
│   [Clear Filters]               │
└─────────────────────────────────┘
```

**Offline Mode**
```
┌─────────────────────────────────┐
│         🌐                       │
│   You're offline                │
│                                  │
│   You can still view and edit   │
│   your applications. Changes    │
│   will sync when you're online. │
└─────────────────────────────────┘
```

---

## Competitive Analysis

### Teal Job Tracker Extension

**Strengths:**
- Clean, professional UI
- Excellent job board integration (40+ sites)
- Quick capture workflow
- Chrome Store featured (4.9/5 stars)
- Resume keyword highlighting

**Weaknesses:**
- Cluttered dashboard with too many features
- No AI-powered insights in free tier
- Limited customization options
- Heavy reliance on their web app

**Opportunities for JobTracker:**
- Simpler, more focused popup UI
- AI features in core experience
- Better offline support
- Stronger brand identity

### Simplify Copilot

**Strengths:**
- Exceptional autofill capabilities
- 50+ job board support
- Free forever promise
- Over 100M applications submitted

**Weaknesses:**
- Basic tracking UI (very utilitarian)
- Limited status customization
- No interview preparation features
- Minimal design polish

**Opportunities for JobTracker:**
- Premium, polished design
- Comprehensive interview coaching
- Better analytics and insights
- Stronger privacy controls

### Differentiators for JobTracker

1. **Unified Brand Experience**
   - Seamless extension ↔ web app transition
   - Consistent design language
   - Premium aesthetic

2. **AI-First Approach**
   - Resume tailoring built-in
   - Interview preparation tools
   - Skill gap analysis
   - Job matching scores

3. **Privacy & Trust**
   - Transparent data handling
   - Local-first architecture
   - Optional cloud sync
   - No data selling

4. **Delightful UX**
   - Smooth animations
   - Thoughtful micro-interactions
   - Accessibility-first design
   - Dark mode support

---

## Technical Considerations

### Performance Targets

**Extension Popup:**
- Initial load: <500ms
- Interaction response: <100ms
- Animation frame rate: 60fps
- Memory usage: <50MB

**Capture Overlay:**
- Detection latency: <200ms
- Extraction accuracy: >85%
- Overlay render: <300ms

**Sync Performance:**
- Background sync interval: 5 minutes
- Manual sync: <2s for typical user
- Conflict resolution: <1s

### Browser Compatibility

**Primary Support:**
- Chrome 120+ (MV3)
- Edge 120+ (Chromium)
- Arc (Chromium)

**Future Support:**
- Firefox 120+ (Phase 2)
- Safari 17+ (Phase 3)

### Responsive Breakpoints

**Extension Popup:**
- Default: 380px × 600px
- Compact: 360px × 580px (user preference)
- Expanded: 420px × 700px (future)

**Capture Overlay:**
- Desktop: 360px width, max 80vh height
- Tablet: Full-screen modal
- Mobile: Bottom sheet drawer

### Accessibility Requirements

**WCAG 2.1 Level AA:**
- Color contrast: 4.5:1 minimum (text)
- Color contrast: 3:1 minimum (UI components)
- Focus indicators: 2px visible outline
- Touch targets: 44×44px minimum

**Keyboard Navigation:**
- All interactive elements focusable
- Logical tab order
- Skip links for long lists
- Escape closes modals

**Screen Reader Support:**
- Semantic HTML structure
- ARIA labels on all controls
- Live regions for dynamic updates
- Status announcements

**Reduced Motion:**
- Respect `prefers-reduced-motion`
- Instant transitions fallback
- No parallax or continuous animations

### Internationalization (Future)

**Phase 1:** English only
**Phase 2:** Spanish, French
**Phase 3:** German, Portuguese, Chinese

**Considerations:**
- Right-to-left (RTL) layout support
- Date/time formatting per locale
- Currency display
- Number formatting

---

## Implementation Roadmap

### Phase 1: Core Foundation (Weeks 1-3)

**Goals:**
- Establish design system integration
- Implement authentication flow
- Build main popup dashboard

**Deliverables:**
1. **Week 1: Design System Setup**
   - Integrate shared UI components
   - Configure Tailwind with design tokens
   - Build Storybook for components
   - Create design QA checklist

2. **Week 2: Authentication & Onboarding**
   - Welcome screen
   - Login/signup flow
   - Permissions handling
   - First-run experience

3. **Week 3: Main Dashboard**
   - Header with user info
   - Quick stats section
   - Recent applications list
   - Quick actions menu

**Success Metrics:**
- Design system integration: 100%
- Authentication flow: <60s completion
- Dashboard load time: <500ms
- Component test coverage: >80%

### Phase 2: Capture & Tracking (Weeks 4-6)

**Goals:**
- Build job capture overlay
- Implement ATS detection
- Create applications list view

**Deliverables:**
1. **Week 4: Detection System**
   - ATS pattern detection
   - Badge notification system
   - Confidence scoring algorithm
   - Manual trigger option

2. **Week 5: Capture Overlay**
   - Slide-in panel UI
   - Auto-filled form fields
   - Confidence indicators
   - Edit capabilities

3. **Week 6: Applications List**
   - List view with cards
   - Filtering & sorting
   - Search functionality
   - Quick actions menu

**Success Metrics:**
- Detection accuracy: >85%
- Capture completion: <10s average
- List render performance: <200ms
- User satisfaction: >4/5

### Phase 3: Detail & Polish (Weeks 7-9)

**Goals:**
- Build application detail view
- Implement settings screen
- Add advanced features

**Deliverables:**
1. **Week 7: Detail View**
   - Full application information
   - Status timeline
   - Notes section
   - Document uploads

2. **Week 8: Settings & Preferences**
   - Account management
   - Sync controls
   - Privacy settings
   - Theme selection

3. **Week 9: Polish & Optimization**
   - Animation refinement
   - Accessibility audit
   - Performance optimization
   - Bug fixes

**Success Metrics:**
- Detail view load: <300ms
- Settings save: instant
- Accessibility: WCAG AA pass
- Bug count: <5 critical

### Phase 4: AI Features (Weeks 10-12)

**Goals:**
- Integrate AI insights
- Add resume tailoring
- Implement interview prep

**Deliverables:**
1. **Week 10: AI Infrastructure**
   - Edge Function integration
   - Prompt engineering
   - Response caching
   - Rate limiting

2. **Week 11: Resume Tailoring**
   - Match score calculation
   - Keyword suggestions
   - Gap identification
   - Tailoring UI

3. **Week 12: Interview Prep**
   - Question generation
   - Practice interface
   - Feedback system
   - Progress tracking

**Success Metrics:**
- AI response time: <3s
- Match accuracy: >80%
- User engagement: >40% weekly
- Cost per user: <$0.50/month

### Phase 5: Launch & Iteration (Week 13+)

**Goals:**
- Chrome Web Store submission
- User testing & feedback
- Iterative improvements

**Deliverables:**
1. **Week 13: Pre-Launch**
   - Final QA testing
   - Store assets creation
   - Documentation writing
   - Launch plan finalization

2. **Week 14: Launch**
   - Store submission
   - Initial user onboarding
   - Analytics setup
   - Support monitoring

3. **Week 15+: Post-Launch**
   - User feedback collection
   - Bug fixes
   - Feature iterations
   - Performance monitoring

**Success Metrics:**
- Store approval: First submission
- User adoption: 50+ in week 1
- Crash rate: <1%
- User reviews: >4.5/5

---

## Appendix

### Design Resources

**Figma Files:**
- Component library: `JobTracker_Extension_Components.fig`
- Screens & flows: `JobTracker_Extension_Screens.fig`
- Prototypes: `JobTracker_Extension_Prototype.fig`

**Assets:**
- Icon set: Lucide React (consistent with web app)
- Illustrations: Undraw (customized brand colors)
- Logos: SVG format in `src/assets/logos/`

### Testing Checklist

**Functional Testing:**
- [ ] Authentication flow (login, signup, logout)
- [ ] Job capture from all supported ATS
- [ ] Application CRUD operations
- [ ] Sync between extension and web app
- [ ] Offline mode functionality
- [ ] Settings persistence

**Visual Testing:**
- [ ] Component library storybook
- [ ] Responsive layouts (360-420px)
- [ ] Dark mode consistency
- [ ] Animation smoothness (60fps)
- [ ] Cross-browser rendering

**Accessibility Testing:**
- [ ] Keyboard navigation complete
- [ ] Screen reader compatibility
- [ ] Color contrast validation
- [ ] Focus indicators visible
- [ ] ARIA labels accurate

**Performance Testing:**
- [ ] Popup load time <500ms
- [ ] Memory usage <50MB
- [ ] CPU usage <5% idle
- [ ] Network efficiency
- [ ] Battery impact minimal

### Glossary

**ATS (Applicant Tracking System):** Software used by companies to manage job applications (e.g., Greenhouse, Lever, Workday)

**Confidence Score:** AI-calculated certainty level for auto-extracted job data (0-100%)

**Glassmorphism:** Design style with frosted glass effect, blur, and transparency

**MV3 (Manifest V3):** Latest Chrome extension platform with enhanced security and performance

**RLS (Row Level Security):** Supabase database security model controlling data access

**Sync:** Process of keeping extension data in sync with web app via Supabase

---

## Document Control

**Version:** 1.0.0
**Last Updated:** 2025-10-16
**Author:** Claude (AI Assistant)
**Reviewers:** [To be assigned]
**Status:** Draft for Review

**Change Log:**
- 2025-10-16: Initial comprehensive UI/UX plan created
- Future updates: Track design decisions and iterations

**Next Steps:**
1. Review with product team
2. Design mockups in Figma
3. Validate with user research
4. Begin Phase 1 implementation

---

*This document is a living resource and will evolve as the extension develops. Feedback and iterations are expected and encouraged.*
