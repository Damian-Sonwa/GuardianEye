# Screen-by-Screen Redesign Specifications
## Detailed Layout & Visual Guidelines

---

## 🔐 1. Authentication Page - Complete Redesign

### Layout Structure
```
┌─────────────────────────────────────┐
│  [Background: Gradient or Hero]     │
│                                     │
│         ┌──────────────┐           │
│         │              │           │
│         │   [Card]     │           │
│         │              │           │
│         └──────────────┘           │
│                                     │
└─────────────────────────────────────┘
```

### Card Specifications
```
Width: 90% max 420px
Padding: 32px
Border Radius: 20px
Background: #FFFFFF (light) / #27272a (dark)
Shadow: 0 8px 32px rgba(0, 0, 0, 0.15)
Backdrop Blur: 10px (if over image)
```

### Content Layout
```
┌─────────────────────────────┐
│  [Logo: 64x64px or Text]    │
│  Spacing: 24px               │
│                              │
│  "Welcome back"              │
│  28px, Bold, Slate 900       │
│  Spacing: 8px                │
│                              │
│  "Securely sign in..."       │
│  16px, Medium, Slate 600     │
│  Spacing: 32px               │
│                              │
│  [Email Input: 56px]         │
│  Spacing: 16px               │
│                              │
│  [Password Input: 56px]      │
│  Spacing: 24px               │
│                              │
│  [Sign In Button: 56px]      │
│  Full width, Emerald 600     │
│  Spacing: 24px               │
│                              │
│  ─── or continue with ───   │
│  1px Slate 200, 16px gap     │
│  Spacing: 24px               │
│                              │
│  [Google Button: 56px]       │
│  Outline style, full width   │
│  Spacing: 12px               │
│                              │
│  [Fingerprint Button: 56px]   │
│  Outline style, full width   │
│  Spacing: 24px               │
│                              │
│  "Use 4-digit PIN instead"   │
│  16px, Medium, Sky 500       │
│  Underline on hover          │
│  Spacing: 32px               │
│                              │
│  "Don't have account?"        │
│  15px, Medium, Slate 600     │
│  "Create one" - Sky 500      │
└─────────────────────────────┘
```

### Visual Details
- **Logo/Title:** 32px Bold, Slate 900, centered
- **Welcome Text:** 26px Semibold, Slate 900
- **Subtitle:** 16px Medium, Slate 600, max-width 320px
- **Inputs:** 56px height, 12px radius, 16px padding
- **Buttons:** 56px height, 12px radius, full width
- **Divider:** 1px Slate 200, "or" text centered in 40px circle
- **Icons:** 24x24px, colored appropriately

### Animations
1. **Card Entry:** Fade in + slide up (300ms)
2. **Inputs:** Sequential slide up (200ms delay each)
3. **Button Hover:** Scale 1.02 (150ms)
4. **Fingerprint Icon:** Pulse (2s infinite)

---

## 🏠 2. Home Dashboard

### Layout Structure
```
┌─────────────────────────────┐
│ [Header: 64px]              │
│  Title + Notification Icon  │
├─────────────────────────────┤
│ [Content: 24px padding]     │
│                              │
│ "Quick Actions"              │
│ 20px Semibold, Slate 900     │
│ Spacing: 16px                │
│                              │
│ ┌──────┐  ┌──────┐          │
│ │Panic │  │Report│          │
│ └──────┘  └──────┘          │
│ ┌──────┐  ┌──────┐          │
│ │ Map  │  │Identify│        │
│ └──────┘  └──────┘          │
│ 2 columns, 16px gap          │
│ Spacing: 32px                │
│                              │
│ "Community Alerts"           │
│ 20px Semibold                │
│ Spacing: 16px                │
│                              │
│ [Alert Card 1]               │
│ Spacing: 12px                │
│ [Alert Card 2]               │
│ Spacing: 32px                │
│                              │
│ [Safe Routes Card]           │
│                              │
└─────────────────────────────┘
```

### Quick Action Card
```
Dimensions:
  Min Height: 160px
  Padding: 24px
  Border Radius: 16px

Layout:
  ┌─────────────────┐
  │ [Icon Circle]   │
  │  48x48px        │
  │  Colored bg     │
  │  Spacing: 16px  │
  │                 │
  │  Title          │
  │  18px Semibold  │
  │  Spacing: 8px   │
  │                 │
  │  Description    │
  │  14px Medium    │
  │  Slate 600      │
  └─────────────────┘

Visual:
  Background: White (light) / Zinc 800 (dark)
  Shadow: 0 2px 8px rgba(0,0,0,0.08)
  Hover: 0 4px 16px rgba(0,0,0,0.12), translateY(-2px)

Icon Circles:
  Panic: Red 600 background
  Report: Emerald 600 background
  Map: Sky 500 background
  Identify: Amber 500 background
```

### Alert Card
```
Dimensions:
  Padding: 20px
  Border Radius: 12px
  Border Left: 4px Red 600

Layout:
  ┌─────────────────────────┐
  │ [Alert Icon]  Message   │
  │  24x24px     16px Bold  │
  │  Red 600     Spacing:   │
  │              8px        │
  │              Time       │
  │              14px Med   │
  │              Slate 600  │
  └─────────────────────────┘
```

---

## 🚨 3. Panic Button Screen

### Idle State
```
┌─────────────────────────────┐
│ [Header: 64px]              │
│  Title + Close              │
├─────────────────────────────┤
│                             │
│      [Icon Circle]          │
│      192x192px              │
│      Red 600 bg             │
│      AlertTriangle 96px     │
│      White icon             │
│      Animation: Pulse       │
│      Spacing: 32px          │
│                             │
│   "Emergency Alert"         │
│   26px Bold, Slate 900      │
│   Spacing: 16px             │
│                             │
│   "Press the button..."     │
│   16px Medium, Slate 600    │
│   Max-width: 320px          │
│   Spacing: 32px             │
│                             │
│   [Panic Button]            │
│   64px height               │
│   Full width max 320px      │
│   Red 600 bg                │
│   "ACTIVATE PANIC"          │
│   18px Bold, White          │
│   Spacing: 16px             │
│                             │
│   [Location Status]         │
│   14px Medium, Slate 600    │
│   With MapPin icon          │
│                             │
└─────────────────────────────┘
```

### Active State
```
Same layout but:
- Icon Circle: Red 600, animated rotation
- Title: "ALERT SENT!" 32px Bold, Red 600
- Description: "Your emergency alert..."
- Action Buttons: Cancel + Call 911
  Both 56px height, side by side
```

---

## 📝 4. Report Page

### Layout Structure
```
┌─────────────────────────────┐
│ [Header: 64px]              │
│  Title + Close              │
├─────────────────────────────┤
│ [Scrollable: 24px padding]  │
│                             │
│ [Description Card]          │
│  └─ Textarea: 120px min     │
│  Spacing: 24px              │
│                             │
│ [Media Options Card]        │
│  └─ [Media Buttons: 3 cols] │
│     Photo | Video | Audio   │
│     Each: 96px height       │
│     Spacing: 16px           │
│  └─ [Preview if selected]   │
│  Spacing: 24px              │
│                             │
│ [Location Card]             │
│  └─ Status or Button         │
│  Spacing: 24px              │
│                             │
│ [Submit Button]             │
│  64px height, full width    │
│  Emerald 600                │
│                             │
└─────────────────────────────┘
```

### Media Button
```
Dimensions:
  Height: 96px
  Border: 2px dashed Slate 300
  Border Radius: 12px
  Padding: 16px

Layout:
  ┌─────────────┐
  │   [Icon]    │
  │   32x32px   │
  │   Spacing:  │
  │   8px       │
  │   Label     │
  │   12px Med  │
  └─────────────┘

States:
  Default: Dashed border
  Hover: Slate 100 bg, Emerald 200 border
```

---

## 🗺 5. Map View

### Layout Structure
```
┌─────────────────────────────┐
│ [Map: Full Screen]          │
│  Dark theme                 │
│                             │
│  [Controls: Top Right]      │
│  ┌─────┐ ┌─────┐           │
│  │ Nav │ │Filter│           │
│  └─────┘ └─────┘           │
│  48x48px circles            │
│  White bg, shadow           │
│  Spacing: 12px              │
│                             │
│  [User Location: Bot Right] │
│  ┌─────┐                    │
│  │ Loc │                    │
│  └─────┘                    │
│  56x56px circle             │
│  Emerald 600 bg             │
│  Spacing: 16px from edge    │
│                             │
│  [Legend: Bottom Left]      │
│  ┌──────────────┐           │
│  │ Legend       │           │
│  │ • High Risk  │           │
│  │ • Warning    │           │
│  │ • You        │           │
│  └──────────────┘           │
│  Card: 16px radius          │
│  20px padding               │
│                             │
└─────────────────────────────┘
```

### Floating Buttons
```
Size: 48x48px
Background: White (light) / Zinc 800 (dark)
Border Radius: 50% (circle)
Shadow: 0 4px 12px rgba(0,0,0,0.15)
Icon: 24x24px, Slate 700
Position: 16px from edges
```

### Markers
```
High Risk:
  Size: 16px circle
  Color: Red 600
  Border: 2px white
  Shadow: 0 2px 8px rgba(220,38,38,0.3)

Warning:
  Size: 16px circle
  Color: Amber 500
  Border: 2px white

User:
  Size: 16px circle
  Color: Emerald 600
  Border: 2px white
```

---

## 🤖 6. AI Identification Screen

### Layout Structure
```
┌─────────────────────────────┐
│ [Header: 64px]              │
│  Title + Close              │
├─────────────────────────────┤
│ [Content: 24px padding]     │
│                             │
│ [Upload Card]               │
│  └─ [Upload Area]           │
│     200px height            │
│     Dashed border           │
│     16px radius             │
│     Icon: 64x64px          │
│     Text: 16px Medium       │
│     Buttons: Choose + Photo │
│  └─ [Preview if selected]   │
│     Image: 16px radius      │
│     Full width             │
│  Spacing: 24px              │
│                             │
│ [Results Card: if results]   │
│  └─ Title: "Match Results"   │
│  └─ [Match Items]           │
│     Each: 16px radius card  │
│     Avatar: 48x48px circle  │
│     Name: 16px Semibold     │
│     Confidence: 14px Med    │
│     Status icon: 20x20px    │
│  Spacing: 24px              │
│                             │
│ [Disclaimer Card]           │
│  Amber bg, 12px radius      │
│  16px padding               │
│                             │
└─────────────────────────────┘
```

### Match Card
```
Dimensions:
  Padding: 20px
  Border Radius: 16px
  Shadow: 0 2px 8px rgba(0,0,0,0.08)

Layout:
  ┌─────────────────────────┐
  │ [Avatar] Name    [Icon] │
  │ 48x48px  16px    20x20px│
  │ Circle   Semibold       │
  │          Confidence      │
  │          14px Med        │
  └─────────────────────────┘
```

### Confidence Meter
```
Height: 8px
Background: Slate 200
Fill: Emerald 600 gradient
Border Radius: 4px
Width: Based on confidence %
```

---

## 💻 7. Agency Dashboard Screens

### Login Screen
```
┌─────────────────────────────┐
│ [Full Screen: Slate 900]     │
│                             │
│      ┌──────────┐           │
│      │          │           │
│      │  [Card]  │           │
│      │  400px   │           │
│      │          │           │
│      └──────────┘           │
│                             │
└─────────────────────────────┘

Card:
  Width: 400px
  Padding: 32px
  Border Radius: 20px
  Background: Zinc 800
  Shadow: 0 8px 32px rgba(0,0,0,0.3)

Content:
  Logo: 80x80px
  Title: "Agency Dashboard" 28px Bold
  Subtitle: 16px Medium, Slate 400
  Inputs: 56px height
  Button: 56px height, Emerald 600
```

### Main Dashboard
```
┌──────┬──────────────────────┐
│      │ [Header: 64px]       │
│ Side │ Title + Actions      │
│ bar  ├──────────────────────┤
│ 256px│ [Stats Grid: 3 cols] │
│      │  Stat Cards          │
│      │  Spacing: 16px      │
│      ├──────────────────────┤
│      │ [Quick Actions]      │
│      │  2 columns           │
│      │  Action Cards        │
│      └──────────────────────┘
└──────┴──────────────────────┘

Sidebar:
  Width: 256px
  Background: Zinc 900
  Padding: 24px
  Nav Items: 48px height
  Active: Emerald 600 bg
```

### Cases Table
```
┌─────────────────────────────┐
│ [Table Card: 16px radius]   │
│  Padding: 24px              │
│                             │
│  [Header Row]               │
│  Background: Slate 100      │
│  Text: 14px Semibold        │
│  Padding: 16px              │
│                             │
│  [Data Rows]                │
│  Border: 1px Slate 200      │
│  Padding: 16px              │
│  Hover: Slate 50 bg         │
│                             │
│  Status Badges:             │
│  Open: Sky 500              │
│  In Progress: Amber 500     │
│  Closed: Emerald 600        │
│                             │
└─────────────────────────────┘
```

---

## 🎨 8. Visual Consistency Rules

### Spacing
- **Section Gap:** 32px
- **Card Gap:** 24px
- **Element Gap:** 16px
- **Small Gap:** 12px
- **Tiny Gap:** 8px

### Typography Hierarchy
- **Page Title:** 26px Semibold
- **Section Title:** 20px Semibold
- **Card Title:** 18px Semibold
- **Body:** 16px Medium
- **Small:** 14px Medium
- **Tiny:** 12px Medium

### Card Styling
- **Padding:** 24px (standard), 20px (compact)
- **Border Radius:** 16px (standard), 12px (compact)
- **Shadow:** 0 2px 8px rgba(0,0,0,0.08)

### Button Consistency
- **Height:** 56px (mobile), 48px (desktop)
- **Padding:** 16px 24px
- **Border Radius:** 12px
- **Font:** 16px Semibold

---

## ✅ Redesign Checklist

### Mobile Screens
- [ ] Authentication (complete redesign)
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

### States
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Success states

---

**Follow these specifications to create consistent, modern screen designs in Figma.**

