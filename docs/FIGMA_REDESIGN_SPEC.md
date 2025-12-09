# Figma Redesign Specification
## Security App - Modern African-Neutral Design System

---

## 🎨 1. Design Philosophy

**Modern, sleek, minimalistic design system for safety/security PWA**

### Core Principles
- **Clean spacing** - Generous whitespace (16-24px padding)
- **Rounded edges** - 12-20px border radius
- **Soft depth shadows** - Subtle elevation (0 2px 8px rgba(0,0,0,0.08))
- **Accessible contrast** - WCAG AA compliant (4.5:1 minimum)
- **Lightweight typography** - Medium weight, not bold
- **Calm but serious** - Professional yet approachable
- **African-modern influence** - Warm neutrals + deep accents

---

## 🎨 2. Color Palette (Figma Color Styles)

### Primary Colors
```
Emerald 600: #059669 (Main actions, primary buttons)
Emerald 500: #10b981 (Hover states)
Emerald 700: #047857 (Pressed/active states)
```

### Neutral Palette
```
Slate 900: #0f172a (Headings, dark text)
Slate 700: #334155 (Body text)
Slate 200: #e2e8f0 (Borders, dividers)
Zinc 50: #fafafa (Light background)
Zinc 900: #18181b (Dark mode background)
Zinc 800: #27272a (Dark mode cards)
Zinc 100: #f4f4f5 (Light mode cards)
```

### Alert Colors
```
Red 600: #dc2626 (Danger, panic button)
Red 500: #ef4444 (Hover danger)
Amber 500: #f59e0b (Warnings)
Sky 500: #0ea5e9 (Info, links)
```

### Accent Colors
```
Indigo 600: #4f46e5 (Secondary actions)
Orange 600: #ea580c (Highlights)
Violet 500: #8b5cf6 (Special features)
```

### Semantic Colors (CSS Variables)
```css
--primary: 159 84% 35% (Emerald 600)
--primary-foreground: 0 0% 100%
--secondary: 210 40% 96%
--destructive: 0 84% 60%
--muted: 210 40% 96%
--accent: 210 40% 96%
--border: 214 32% 91%
--background: 0 0% 100%
--foreground: 222 47% 11%
```

**Figma Setup:**
- Create Color Styles for each color
- Name them: "Primary/Emerald 600", "Neutral/Slate 900", etc.
- Create semantic styles: "Primary", "Danger", "Warning", "Info"

---

## ✨ 3. Typography System

### Font Family
**Primary:** Inter (Google Fonts)
- Regular (400)
- Medium (500)
- Semibold (600)
- Bold (700)

### Type Scale

#### Headings
```
H1 - Display
Size: 32px / 2rem
Weight: 700 (Bold)
Line Height: 120% (38.4px)
Letter Spacing: -0.5px
Color: Slate 900

H2 - Section Title
Size: 26px / 1.625rem
Weight: 600 (Semibold)
Line Height: 130% (33.8px)
Letter Spacing: -0.3px
Color: Slate 900

H3 - Card Title
Size: 20px / 1.25rem
Weight: 600 (Semibold)
Line Height: 140% (28px)
Letter Spacing: 0px
Color: Slate 900
```

#### Body Text
```
Body Large
Size: 16px / 1rem
Weight: 500 (Medium)
Line Height: 150% (24px)
Letter Spacing: 0px
Color: Slate 700

Body Regular
Size: 15px / 0.9375rem
Weight: 500 (Medium)
Line Height: 150% (22.5px)
Letter Spacing: 0px
Color: Slate 700

Body Small
Size: 13px / 0.8125rem
Weight: 500 (Medium)
Line Height: 140% (18.2px)
Letter Spacing: 0px
Color: Slate 600
```

#### Special
```
Button Text
Size: 16px / 1rem
Weight: 600 (Semibold)
Line Height: 120%
Letter Spacing: 0.2px

Label
Size: 13px / 0.8125rem
Weight: 600 (Semibold)
Line Height: 140%
Letter Spacing: 0.3px
Color: Slate 600
```

**Figma Setup:**
- Create Text Styles for each variant
- Name: "Heading/H1", "Body/Large", "Button/Primary", etc.

---

## 📐 4. Spacing System

### Base Unit: 4px

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Component Spacing
```
Card Padding: 24px
Button Padding: 16px 24px
Input Padding: 16px 20px
Section Gap: 24px
Element Gap: 16px
```

**Figma Setup:**
- Use Auto Layout with consistent spacing
- Create spacing tokens if using Figma Variables

---

## 🧩 5. Component Library

### Buttons

#### Primary Button
```
Size: 
  Height: 56px (mobile) / 48px (desktop)
  Padding: 16px 24px
  Min Width: 120px

Style:
  Background: Emerald 600
  Text: White, Semibold, 16px
  Border Radius: 12px
  Shadow: 0 2px 8px rgba(5, 150, 105, 0.2)

States:
  Default: Emerald 600
  Hover: Emerald 500, scale 1.02
  Active: Emerald 700, scale 0.98
  Disabled: Slate 200, opacity 50%
```

#### Secondary Button
```
Background: Transparent
Border: 2px solid Slate 200
Text: Slate 700
Hover: Slate 100 background
```

#### Ghost Button
```
Background: Transparent
Text: Slate 700
Hover: Slate 100 background
```

#### Destructive Button
```
Background: Red 600
Text: White
Hover: Red 500
```

#### Panic Button (Special)
```
Size: 64px height, full width
Background: Red 600
Text: White, Bold, 18px
Border Radius: 16px
Shadow: 0 4px 16px rgba(220, 38, 38, 0.3)
Animation: Pulsing (scale 1.0 to 1.05, 2s infinite)
```

#### Icon Button
```
Size: 48x48px (mobile) / 40x40px (desktop)
Border Radius: 12px
Padding: 12px
```

**Figma Setup:**
- Create Button components with variants
- States: Default, Hover, Active, Disabled
- Sizes: Small, Medium, Large, XL

---

### Inputs

#### Text Input
```
Size:
  Height: 56px (mobile) / 48px (desktop)
  Padding: 16px 20px

Style:
  Background: White (light) / Zinc 800 (dark)
  Border: 2px solid Slate 200
  Border Radius: 12px
  Text: Slate 700, 16px, Medium
  Placeholder: Slate 400, 16px

States:
  Default: Slate 200 border
  Focus: Emerald 600 border, 0 0 0 3px rgba(5, 150, 105, 0.1)
  Error: Red 600 border
  Disabled: Slate 100 background, Slate 400 text
```

#### Textarea
```
Min Height: 120px
Padding: 16px 20px
Same border and focus styles as input
Resize: Vertical only
```

#### File Upload
```
Border: 2px dashed Slate 300
Border Radius: 12px
Padding: 32px
Background: Slate 50
Hover: Slate 100 background
Active: Emerald 50 background, Emerald 200 border
```

#### Mic Recording Button
```
Size: 64x64px
Background: Red 600
Border Radius: 50% (circle)
Icon: White microphone, 24px
Animation: Pulsing when recording
```

**Figma Setup:**
- Create Input components with states
- Include label, helper text, error states

---

### Cards

#### Elevated Card
```
Background: White (light) / Zinc 800 (dark)
Border Radius: 16px
Padding: 24px
Shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
Hover: 0 4px 16px rgba(0, 0, 0, 0.12), translateY(-2px)
```

#### Outline Card
```
Background: Transparent
Border: 1px solid Slate 200
Border Radius: 16px
Padding: 24px
```

#### Notification Card
```
Background: White (light) / Zinc 800 (dark)
Border Left: 4px solid (color varies)
Border Radius: 12px
Padding: 20px
Shadow: 0 1px 4px rgba(0, 0, 0, 0.06)
```

**Figma Setup:**
- Create Card components
- Variants: Elevated, Outline, Notification
- Include content slots

---

### Navigation

#### Bottom Navigation
```
Height: 72px (including safe area)
Background: White (light) / Zinc 900 (dark)
Border Top: 1px solid Slate 200
Backdrop Blur: 10px
Padding: 8px 0

Items:
  Icon: 24x24px
  Label: 12px, Medium, Slate 600
  Active: Emerald 600 color
  Spacing: Equal distribution
```

#### Drawer
```
Width: 320px (mobile) / 280px (desktop)
Background: White (light) / Zinc 900 (dark)
Border Radius: 24px (top corners)
Shadow: 0 -4px 24px rgba(0, 0, 0, 0.15)
Padding: 24px
```

#### Modal
```
Width: 90% max 400px
Background: White (light) / Zinc 800 (dark)
Border Radius: 20px
Padding: 24px
Shadow: 0 8px 32px rgba(0, 0, 0, 0.2)
Backdrop: rgba(0, 0, 0, 0.5) with blur
```

**Figma Setup:**
- Create Navigation components
- Include overlay states

---

### Status Badges

```
Size: Auto (padding 8px 12px)
Border Radius: 8px
Text: 13px, Semibold

Danger: Red 600 background, White text
Warning: Amber 500 background, White text
Info: Sky 500 background, White text
Success: Emerald 600 background, White text
```

---

### Media Viewer

#### Image Preview
```
Border Radius: 16px
Shadow: 0 4px 16px rgba(0, 0, 0, 0.1)
Max Width: 100%
Object Fit: Cover
```

#### Video Preview
```
Same as image
Controls: Custom overlay with play button
```

#### Audio Waveform
```
Height: 80px
Background: Slate 100
Border Radius: 12px
Waveform: Emerald 600
```

---

## 📱 6. Screen Redesigns

### 6.1 Authentication Page

#### Layout Structure
```
[Full Screen Container]
  └─ [Background: Subtle gradient or hero image]
      └─ [Center Card Container]
          └─ [Card: 20px radius, white/dark bg]
              ├─ Logo/App Title (32px, Bold)
              ├─ Welcome Text (26px, Semibold)
              ├─ Subtitle (16px, Medium, Slate 600)
              │
              ├─ [Email Input] (56px height)
              ├─ [Password Input] (56px height)
              ├─ [Sign In Button] (56px height, Emerald 600)
              │
              ├─ Divider: "or continue with"
              │
              ├─ [Google Button] (56px, outline style)
              ├─ [Fingerprint Button] (56px, outline style)
              ├─ [PIN Option Link] (16px, Sky 500)
              │
              └─ Footer: "Don't have account? Create one"
```

#### Visual Details
- **Card:** 20px radius, white background, shadow: 0 8px 32px rgba(0,0,0,0.1)
- **Spacing:** 24px between sections, 16px between inputs
- **Icons:** 24x24px, colored appropriately
- **Animations:**
  - Card fade in (300ms)
  - Inputs slide up sequentially
  - Button hover scale 1.02
  - Fingerprint icon pulsing (2s infinite)

#### Component Specs
```
Logo: 64x64px or text logo, 32px Bold
Welcome Text: 26px Semibold, Slate 900
Subtitle: 16px Medium, Slate 600
Inputs: 56px height, 12px radius, 16px padding
Buttons: 56px height, 12px radius, full width
Divider: 1px Slate 200, "or" text centered
Footer Link: 16px Medium, Sky 500, underline on hover
```

---

### 6.2 Home Dashboard

#### Layout Structure
```
[Header: 64px height]
  ├─ App Title (20px, Semibold)
  └─ Notification Icon (24px, badge if unread)

[Main Content: 24px padding]
  ├─ [Quick Actions Grid: 2 columns, 16px gap]
  │   ├─ Panic Button Card
  │   ├─ Report Card
  │   ├─ Map Card
  │   └─ Identify Card
  │
  ├─ [Community Alerts Section]
  │   └─ Alert Cards (vertical stack, 12px gap)
  │
  └─ [Safe Routes Card]
      └─ View Routes Button
```

#### Card Design
```
Quick Action Cards:
  Size: Auto, min 160px height
  Border Radius: 16px
  Padding: 24px
  Icon: 48x48px circle, colored background
  Title: 18px Semibold
  Description: 14px Medium, Slate 600
  Shadow: 0 2px 8px rgba(0,0,0,0.08)
  Hover: 0 4px 16px rgba(0,0,0,0.12), translateY(-2px)
```

#### Color Coding
- Panic: Red 600 icon background
- Report: Emerald 600 icon background
- Map: Sky 500 icon background
- Identify: Amber 500 icon background

---

### 6.3 Panic Button Screen

#### Layout Structure
```
[Header: 64px, back button + title]

[Center Content: Flex column, centered]
  ├─ [Panic Icon Circle: 192x192px]
  │   └─ AlertTriangle icon, 96px, white
  │   Animation: Pulsing scale (1.0 to 1.1, 2s infinite)
  │
  ├─ Title: "Emergency Alert" (26px, Bold)
  ├─ Description: 16px Medium, Slate 600, max-width 320px
  │
  ├─ [Panic Button: 64px height, full width max 320px]
  │   Background: Red 600
  │   Text: "ACTIVATE PANIC" (18px, Bold, White)
  │   Animation: Pulsing when active
  │
  └─ Location Status: 14px, Slate 600, with icon
```

#### Active State
```
[Red Circle: 192x192px, Red 600]
  └─ AlertTriangle icon, animated rotation
[Title: "ALERT SENT!" (32px, Bold, Red 600)]
[Description: 16px Medium]
[Action Buttons: Cancel + Call 911]
```

---

### 6.4 Report Page

#### Layout Structure
```
[Header: 64px, title + close button]

[Scrollable Content: 24px padding]
  ├─ [Description Card]
  │   └─ Textarea: 120px min height
  │
  ├─ [Media Options Card]
  │   ├─ [Media Buttons Grid: 3 columns]
  │   │   ├─ Photo Button (96px height)
  │   │   ├─ Video Button (96px height)
  │   │   └─ Audio Button (96px height)
  │   └─ [Preview Section if media selected]
  │
  ├─ [Location Card]
  │   └─ Location status or "Get Location" button
  │
  └─ [Submit Button: 64px height, full width]
```

#### Media Button Design
```
Size: Auto, 96px height
Border: 2px dashed Slate 300
Border Radius: 12px
Icon: 32x32px, Slate 600
Label: 12px Medium, Slate 600
Hover: Slate 100 background, Emerald 200 border
```

---

### 6.5 Map View

#### Layout Structure
```
[Full Screen Map Container]
  ├─ [Map: Full screen, dark theme]
  │
  ├─ [Floating Controls: Top Right]
  │   ├─ Navigation Control (rounded, 40x40px)
  │   └─ Filter Button (rounded, 40x40px)
  │
  ├─ [User Location Button: Bottom Right]
  │   └─ Circle button, 56x56px, Emerald 600
  │
  └─ [Legend Card: Bottom Left]
      └─ Card with 16px radius, 20px padding
          └─ Legend items with colored dots
```

#### Marker Design
```
High Risk: Red 600, 16px circle, white border 2px
Warning: Amber 500, 16px circle, white border 2px
User: Emerald 600, 16px circle, white border 2px
```

#### Floating Buttons
```
Size: 48x48px
Background: White (light) / Zinc 800 (dark)
Border Radius: 50% (circle)
Shadow: 0 4px 12px rgba(0,0,0,0.15)
Icon: 24x24px, Slate 700
```

---

### 6.6 AI Identification Screen

#### Layout Structure
```
[Header: 64px, title + close]

[Content: 24px padding]
  ├─ [Upload Card]
  │   ├─ [Upload Area: 200px height]
  │   │   Border: 2px dashed Slate 300
  │   │   Border Radius: 16px
  │   │   Icon: 64x64px, Slate 400
  │   │   Text: 16px Medium
  │   │   Buttons: Choose File + Take Photo
  │   │
  │   └─ [Preview Section if image selected]
  │       └─ Image: 16px radius, full width
  │
  ├─ [Results Card: if results available]
  │   ├─ Title: "Match Results" (20px Semibold)
  │   └─ [Match Items: vertical stack]
  │       └─ Each match: 16px radius card
  │           ├─ Avatar: 48x48px circle
  │           ├─ Name: 16px Semibold
  │           ├─ Confidence: 14px Medium, Slate 600
  │           └─ Status icon: 20x20px
  │
  └─ [Disclaimer Card]
      └─ Amber background, 12px radius, 16px padding
```

#### Confidence Meter
```
Progress Bar:
  Height: 8px
  Background: Slate 200
  Fill: Emerald 600 (gradient)
  Border Radius: 4px
  Width: Based on confidence %
```

---

### 6.7 Notifications Page

#### Layout Structure
```
[Header: 64px]
  ├─ Title + Back button
  └─ Unread Badge (if > 0) + "Mark all read" button

[Content: 16px padding]
  └─ [Notification Cards: vertical stack, 12px gap]
      └─ Each notification:
          Border Left: 4px (color by type)
          Border Radius: 12px
          Padding: 20px
          Icon: 40x40px circle, colored background
          Title: 16px Semibold
          Message: 14px Medium, Slate 600
          Time: 12px Medium, Slate 500
          Unread Dot: 8px circle, Emerald 600
```

---

### 6.8 Profile & Settings

#### Profile Page
```
[Header Card: 24px padding]
  ├─ Avatar: 64x64px circle, Emerald 100 background
  ├─ Name: 20px Semibold
  └─ Status: 14px Medium, Slate 600

[Stats Grid: 2 columns]
  └─ Stat Cards: 16px radius, 20px padding

[Menu Items: vertical stack]
  └─ Each item: 16px radius card, 20px padding
      Icon: 24x24px, Slate 600
      Text: 16px Medium
      Arrow: 16x16px, Slate 400
```

#### Settings Page
```
[Settings Sections: vertical stack, 24px gap]
  └─ Each section card:
      Title: 18px Semibold, 20px padding
      Content: 20px padding
      Toggle: Custom switch design
      Select: 48px height, 12px radius
```

---

## 🗺 7. Map & Geolocation UI

### Map Overlay Design
```
Floating Action Buttons:
  Size: 56x56px
  Background: White (light) / Zinc 800 (dark)
  Border Radius: 50% (circle)
  Shadow: 0 4px 16px rgba(0,0,0,0.2)
  Icon: 24x24px
  Spacing: 16px from edges, 12px between buttons
```

### Zone Colors
```
Safe Routes: Emerald 600, 40% opacity
Danger Zones: Red 600, 30% opacity
Uncertain Zones: Amber 500, 30% opacity
```

### Alert Icons
```
High Risk: Red 600, 24px, AlertTriangle
Warning: Amber 500, 24px, AlertCircle
Info: Sky 500, 24px, Info
```

---

## 🤖 8. AI Screens Enhancement

### Face Match Results
```
Match Card:
  Border Radius: 16px
  Padding: 20px
  Shadow: 0 2px 8px rgba(0,0,0,0.08)
  
  Layout:
    [Avatar: 56x56px circle] [Name + Confidence] [Status Icon]
    
  Confidence Bar:
    Height: 6px
    Background: Slate 200
    Fill: Gradient (Emerald 500 to Emerald 600)
    Width: confidence %
```

### Weapon Detection
```
Image Overlay:
  Bounding Boxes:
    Red: 2px solid, Red 600
    Background: Red 600, 20% opacity
    Label: White text, 12px Semibold, Red 600 background
    Border Radius: 4px
```

### Loading States
```
Skeleton:
  Background: Slate 100
  Border Radius: 12px
  Animation: Shimmer (left to right, 2s infinite)
  Height: Match content height
```

---

## 🎯 9. Agency Dashboard Screens

### Login Screen
```
[Full Screen Dark Background: Slate 900]
  └─ [Center Card: 400px width]
      ├─ Logo: 80x80px or text
      ├─ Title: "Agency Dashboard" (28px Bold)
      ├─ Subtitle: 16px Medium, Slate 400
      │
      ├─ [Email Input: 56px height]
      ├─ [Password Input: 56px height]
      ├─ [Login Button: 56px height, Emerald 600]
      │
      └─ Footer: "Officer login required"
```

### Main Dashboard
```
[Sidebar: 256px width, Zinc 900 background]
  ├─ Logo/Title
  ├─ Navigation Items (vertical stack)
  │   └─ Each: 48px height, 16px padding
  │       Icon: 20x20px
  │       Text: 15px Medium
  │       Active: Emerald 600 background
  └─ Logout Button

[Main Content Area]
  ├─ [Header: 64px height]
  │   └─ Page Title + Actions
  │
  └─ [Content: 24px padding]
      ├─ [Stats Grid: 3 columns]
      │   └─ Stat Cards: 16px radius, 20px padding
      │
      └─ [Quick Actions: 2 columns]
          └─ Action Cards: 16px radius, hover effect
```

### Cases Table
```
[Table Card: 16px radius, 24px padding]
  ├─ Header Row:
  │   Background: Slate 100
  │   Text: 14px Semibold, Slate 700
  │   Padding: 16px
  │
  └─ Data Rows:
      Border Bottom: 1px Slate 200
      Padding: 16px
      Hover: Slate 50 background
      
Status Badges:
  Open: Sky 500
  In Progress: Amber 500
  Closed: Emerald 600
```

### Map Dashboard
```
[Full Screen Map]
  ├─ [Heatmap Overlay]
  │   └─ Color gradient: Green (safe) to Red (danger)
  │
  ├─ [Cluster Markers]
  │   └─ Circle with count, colored by severity
  │
  └─ [Filter Panel: Right Side]
      └─ Card: 280px width, 16px radius
          └─ Filter options with checkboxes
```

---

## 🧨 10. Animation Specifications

### Transitions
```
Default: 200ms ease-out
Fast: 150ms ease-out
Slow: 300ms ease-in-out
```

### Micro-interactions
```
Button Hover: scale 1.02, 150ms
Button Active: scale 0.98, 100ms
Card Hover: translateY(-2px), 200ms
Modal Open: fade + slide up, 300ms
Drawer Open: slide from bottom, 300ms
```

### Special Animations
```
Panic Button: 
  Pulse: scale(1.0, 1.05), 2s infinite, ease-in-out
  
Fingerprint Icon:
  Pulse: scale(1.0, 1.1), 2s infinite, ease-in-out
  
Loading Spinner:
  Rotate: 360deg, 1s linear infinite
  
Skeleton Shimmer:
  Background position: -200% to 200%, 2s linear infinite
```

### Figma Prototype Settings
```
Transition: Smart Animate
Duration: 200-300ms
Easing: Ease Out
Trigger: On Click / On Drag
```

---

## 📦 11. Figma File Structure

```
Security App Design
│
├── 🎨 Design System
│   ├── Colors
│   │   ├── Primary
│   │   ├── Neutral
│   │   ├── Alert
│   │   └── Accent
│   │
│   ├── Typography
│   │   ├── Headings
│   │   ├── Body
│   │   └── Special
│   │
│   ├── Spacing
│   │   └── Spacing Tokens
│   │
│   └── Effects
│       ├── Shadows
│       └── Blur
│
├── 🧩 Components
│   ├── Buttons
│   │   ├── Primary
│   │   ├── Secondary
│   │   ├── Ghost
│   │   ├── Destructive
│   │   └── Panic
│   │
│   ├── Inputs
│   │   ├── Text Input
│   │   ├── Textarea
│   │   ├── File Upload
│   │   └── Mic Button
│   │
│   ├── Cards
│   │   ├── Elevated
│   │   ├── Outline
│   │   └── Notification
│   │
│   ├── Navigation
│   │   ├── Bottom Nav
│   │   ├── Drawer
│   │   └── Modal
│   │
│   ├── Status
│   │   └── Badges
│   │
│   └── Media
│       ├── Image Preview
│       ├── Video Preview
│       └── Audio Waveform
│
├── 📱 Mobile App Screens
│   ├── Authentication
│   │   ├── Login
│   │   └── Register (if needed)
│   │
│   ├── Main App
│   │   ├── Splash
│   │   ├── Home
│   │   ├── Panic
│   │   ├── Report
│   │   ├── Map
│   │   ├── Identify
│   │   ├── Profile
│   │   ├── Settings
│   │   ├── Notifications
│   │   └── Community
│   │
│   └── States
│       ├── Loading
│       ├── Empty
│       └── Error
│
├── 💻 Dashboard Screens
│   ├── Login
│   ├── Home
│   ├── Map
│   ├── Cases
│   ├── Suspects
│   ├── Evidence
│   ├── Activity Logs
│   ├── SMS Broadcast
│   └── Settings
│
└── 🔄 Prototypes
    ├── Auth Flow
    ├── Report Flow
    ├── Panic Flow
    ├── Face Match Flow
    └── Map Navigation
```

---

## 🎨 12. Visual Style Guidelines

### Shadows
```
Small: 0 1px 4px rgba(0, 0, 0, 0.06)
Medium: 0 2px 8px rgba(0, 0, 0, 0.08)
Large: 0 4px 16px rgba(0, 0, 0, 0.12)
XLarge: 0 8px 32px rgba(0, 0, 0, 0.2)
```

### Border Radius
```
Small: 8px
Medium: 12px
Large: 16px
XLarge: 20px
Circle: 50%
```

### Blur
```
Backdrop: 10px
Modal Overlay: 8px
```

---

## ✅ 13. Deliverable Checklist

### Design System
- [ ] Color Styles (all colors)
- [ ] Typography Styles (all text variants)
- [ ] Component Library (all components)
- [ ] Spacing Tokens
- [ ] Shadow Styles
- [ ] Border Radius Styles

### Mobile Screens
- [ ] Authentication (redesigned)
- [ ] Home Dashboard
- [ ] Panic Button
- [ ] Report Page
- [ ] Map View
- [ ] AI Identification
- [ ] Profile
- [ ] Settings
- [ ] Notifications
- [ ] Community Watch

### Dashboard Screens
- [ ] Login
- [ ] Main Dashboard
- [ ] Map + Heatmap
- [ ] Cases Table
- [ ] Suspect Profiles
- [ ] Evidence Viewer
- [ ] Activity Logs
- [ ] SMS Broadcast
- [ ] Settings

### Prototypes
- [ ] Login Flow
- [ ] Report Submission
- [ ] Panic Button
- [ ] Face Match
- [ ] Map Navigation

### Documentation
- [ ] Style Guide
- [ ] Component Usage
- [ ] Animation Guidelines
- [ ] Color Usage Rules

---

## 🚀 14. Implementation Notes

### Figma Best Practices
1. Use Auto Layout for all components
2. Create variants for component states
3. Use Constraints for responsive behavior
4. Name layers clearly and consistently
5. Group related elements
6. Use Components for reusability
7. Create Prototypes for user flows

### Export Specifications
- Icons: SVG, 24x24px default
- Images: PNG/WebP, multiple sizes
- Colors: Export as CSS variables
- Spacing: Export as CSS custom properties

---

**This specification provides everything needed to create a complete, modern Figma design system for the Security App. All features remain unchanged - only visual design is being improved.**

