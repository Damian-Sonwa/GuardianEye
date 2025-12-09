# Figma Redesign - Quick Start Guide

## 🎯 Overview

This guide helps you quickly implement the Figma redesign for the Security App. All features remain unchanged - only visual design is being improved.

---

## 📋 Step-by-Step Implementation

### Step 1: Set Up Design System

1. **Create Color Styles**
   - Primary: Emerald 600 (#059669)
   - Neutrals: Slate 900, 700, 200, Zinc 50, 900
   - Alerts: Red 600, Amber 500, Sky 500
   - Accents: Indigo 600, Orange 600, Violet 500

2. **Create Typography Styles**
   - H1: 32px Bold
   - H2: 26px Semibold
   - H3: 20px Semibold
   - Body: 16px Medium
   - Small: 14px Medium

3. **Set Up Spacing**
   - Use 4px base unit
   - Standard padding: 24px
   - Standard gap: 16px

### Step 2: Build Component Library

Start with these core components:
1. Buttons (Primary, Secondary, Ghost, Destructive, Panic)
2. Inputs (Text, Textarea, File Upload)
3. Cards (Elevated, Outline, Notification)
4. Navigation (Bottom Nav, Drawer, Modal)
5. Status Badges
6. Media Components

**See:** `FIGMA_COMPONENT_SPECS.md` for detailed specs

### Step 3: Redesign Screens

Follow the order:
1. Authentication (most important - sets tone)
2. Home Dashboard
3. Panic Button
4. Report Page
5. Map View
6. AI Identification
7. Profile & Settings
8. Notifications & Community
9. Agency Dashboard screens

**See:** `FIGMA_SCREEN_REDESIGNS.md` for detailed layouts

### Step 4: Create Prototypes

Set up clickable flows:
- Login → Home
- Home → Panic → Alert Sent
- Home → Report → Submit
- Home → Identify → Results
- Profile → Settings → Language Change

---

## 🎨 Key Design Principles

### Colors
- **Primary Actions:** Emerald 600
- **Danger/Panic:** Red 600
- **Text:** Slate 900 (headings), Slate 700 (body)
- **Backgrounds:** Zinc 50 (light), Zinc 900 (dark)

### Typography
- **Font:** Inter
- **Weights:** Medium (500) for body, Semibold (600) for emphasis
- **Sizes:** 16px minimum for accessibility

### Spacing
- **Generous padding:** 24px standard
- **Clear hierarchy:** 32px between sections
- **Touch-friendly:** 56px button height on mobile

### Components
- **Rounded:** 12-16px border radius
- **Shadows:** Soft, subtle (0 2px 8px)
- **Hover states:** Scale 1.02, translateY(-2px)

---

## 📐 Layout Grids

### Mobile (PWA)
```
Frame: 375x812px (iPhone 13)
Columns: 16px margins
Content: 343px width
Gap: 16px between elements
```

### Desktop (Dashboard)
```
Frame: 1440x900px
Sidebar: 256px width
Content: 1184px width
Columns: 12-column grid
Gap: 24px
```

---

## 🎬 Animation Guidelines

### Transitions
- **Default:** 200ms ease-out
- **Fast:** 150ms ease-out
- **Slow:** 300ms ease-in-out

### Interactions
- **Button Hover:** Scale 1.02
- **Card Hover:** TranslateY(-2px)
- **Modal Open:** Fade + slide up
- **Panic Button:** Pulse (2s infinite)

### Figma Prototype
- Use Smart Animate
- Duration: 200-300ms
- Easing: Ease Out

---

## ✅ Quality Checklist

Before finalizing:

- [ ] All colors use Color Styles
- [ ] All text uses Text Styles
- [ ] All components use Auto Layout
- [ ] Consistent spacing throughout
- [ ] All states defined (hover, active, disabled)
- [ ] Prototypes work smoothly
- [ ] Dark mode versions created
- [ ] Responsive behavior tested
- [ ] Accessibility contrast checked
- [ ] Naming convention followed

---

## 📚 Reference Documents

1. **FIGMA_REDESIGN_SPEC.md** - Complete design system
2. **FIGMA_COMPONENT_SPECS.md** - Detailed component specs
3. **FIGMA_SCREEN_REDESIGNS.md** - Screen-by-screen layouts
4. **DESIGN_SYSTEM.md** - Original design system (for reference)

---

## 🚀 Quick Tips

1. **Start with components** - Build reusable components first
2. **Use Auto Layout** - Makes everything responsive
3. **Create variants** - For different states and sizes
4. **Name consistently** - Category/Component/State/Size
5. **Test prototypes** - Ensure flows work smoothly
6. **Check contrast** - Use Figma's contrast checker
7. **Export assets** - SVG for icons, PNG for images

---

## 🎯 Final Deliverable

Your Figma file should contain:

✅ Complete design system
✅ Full component library
✅ All mobile screens redesigned
✅ All dashboard screens redesigned
✅ Working prototypes
✅ Style guide documentation
✅ Export specifications

---

**Ready to start? Begin with the design system setup, then build components, then redesign screens one by one!**

