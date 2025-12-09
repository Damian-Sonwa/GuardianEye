# Figma Component Specifications
## Detailed Component Library

---

## 🔘 Buttons

### Primary Button
```
Dimensions:
  Mobile: 56px height
  Desktop: 48px height
  Min Width: 120px
  Padding: 16px 24px

Visual:
  Background: #059669 (Emerald 600)
  Text: #FFFFFF, 16px, Semibold (600)
  Border Radius: 12px
  Shadow: 0 2px 8px rgba(5, 150, 105, 0.2)

States:
  Default: Emerald 600
  Hover: #10b981 (Emerald 500), scale 1.02
  Active: #047857 (Emerald 700), scale 0.98
  Disabled: #e2e8f0 (Slate 200), opacity 50%

Figma Setup:
  - Create component with variants
  - States: Default, Hover, Active, Disabled
  - Use Auto Layout
  - Add hover interaction in prototype
```

### Secondary Button
```
Same dimensions as Primary

Visual:
  Background: Transparent
  Border: 2px solid #e2e8f0 (Slate 200)
  Text: #334155 (Slate 700), 16px, Semibold
  Border Radius: 12px

States:
  Default: Transparent with border
  Hover: #f1f5f9 (Slate 100) background
  Active: #e2e8f0 (Slate 200) background
```

### Ghost Button
```
Same dimensions as Primary

Visual:
  Background: Transparent
  Text: #334155 (Slate 700), 16px, Semibold
  Border Radius: 12px

States:
  Default: Transparent
  Hover: #f1f5f9 (Slate 100) background
  Active: #e2e8f0 (Slate 200) background
```

### Destructive Button
```
Same dimensions as Primary

Visual:
  Background: #dc2626 (Red 600)
  Text: #FFFFFF, 16px, Semibold
  Border Radius: 12px
  Shadow: 0 2px 8px rgba(220, 38, 38, 0.2)

States:
  Default: Red 600
  Hover: #ef4444 (Red 500)
  Active: #b91c1c (Red 700)
```

### Panic Button (Special)
```
Dimensions:
  Height: 64px
  Width: 100% (max 320px)
  Padding: 20px 32px

Visual:
  Background: #dc2626 (Red 600)
  Text: #FFFFFF, 18px, Bold (700)
  Border Radius: 16px
  Shadow: 0 4px 16px rgba(220, 38, 38, 0.3)

Animation:
  Pulse: scale(1.0, 1.05), 2s infinite, ease-in-out
  Use Figma Smart Animate or After Effects
```

### Icon Button
```
Dimensions:
  Mobile: 48x48px
  Desktop: 40x40px
  Padding: 12px

Visual:
  Background: Transparent
  Border Radius: 12px
  Icon: 24x24px, Slate 700

States:
  Default: Transparent
  Hover: Slate 100 background
  Active: Slate 200 background
```

---

## 📝 Inputs

### Text Input
```
Dimensions:
  Mobile: 56px height
  Desktop: 48px height
  Padding: 16px 20px
  Border Radius: 12px

Visual:
  Background: #FFFFFF (light) / #27272a (dark)
  Border: 2px solid #e2e8f0 (Slate 200)
  Text: #334155 (Slate 700), 16px, Medium (500)
  Placeholder: #94a3b8 (Slate 400), 16px, Medium

States:
  Default: Slate 200 border
  Focus: 
    Border: 2px solid #059669 (Emerald 600)
    Shadow: 0 0 0 3px rgba(5, 150, 105, 0.1)
  Error:
    Border: 2px solid #dc2626 (Red 600)
    Shadow: 0 0 0 3px rgba(220, 38, 38, 0.1)
  Disabled:
    Background: #f1f5f9 (Slate 100)
    Text: #94a3b8 (Slate 400)
    Border: 2px solid #e2e8f0 (Slate 200)

Figma Setup:
  - Include label above input
  - Include helper text below
  - Create variants for all states
  - Use Auto Layout
```

### Textarea
```
Dimensions:
  Min Height: 120px
  Padding: 16px 20px
  Border Radius: 12px
  Resize: Vertical only

Visual:
  Same as Text Input
  Font: 16px, Medium
  Line Height: 150%
```

### File Upload Area
```
Dimensions:
  Min Height: 200px
  Padding: 32px
  Border Radius: 12px

Visual:
  Background: #f8fafc (Slate 50)
  Border: 2px dashed #cbd5e1 (Slate 300)
  Text: #64748b (Slate 500), 16px, Medium
  Icon: 64x64px, Slate 400

States:
  Default: Dashed border
  Hover: 
    Background: #f1f5f9 (Slate 100)
    Border: 2px dashed #10b981 (Emerald 500)
  Active:
    Background: #ecfdf5 (Emerald 50)
    Border: 2px solid #6ee7b7 (Emerald 200)
```

### Mic Recording Button
```
Dimensions:
  64x64px
  Border Radius: 50% (circle)

Visual:
  Background: #dc2626 (Red 600)
  Icon: #FFFFFF, 24x24px, Microphone
  Shadow: 0 4px 16px rgba(220, 38, 38, 0.3)

Animation:
  Recording: Pulse scale(1.0, 1.1), 1s infinite
```

---

## 🃏 Cards

### Elevated Card
```
Dimensions:
  Padding: 24px
  Border Radius: 16px
  Auto width/height

Visual:
  Background: #FFFFFF (light) / #27272a (dark)
  Shadow: 0 2px 8px rgba(0, 0, 0, 0.08)

States:
  Default: Medium shadow
  Hover: 
    Shadow: 0 4px 16px rgba(0, 0, 0, 0.12)
    Transform: translateY(-2px)
```

### Outline Card
```
Same dimensions as Elevated

Visual:
  Background: Transparent
  Border: 1px solid #e2e8f0 (Slate 200)
  Border Radius: 16px
```

### Notification Card
```
Dimensions:
  Padding: 20px
  Border Radius: 12px
  Border Left: 4px solid (varies by type)

Visual:
  Background: #FFFFFF (light) / #27272a (dark)
  Shadow: 0 1px 4px rgba(0, 0, 0, 0.06)

Types:
  Danger: Red 600 left border
  Warning: Amber 500 left border
  Info: Sky 500 left border
  Success: Emerald 600 left border
```

---

## 🧭 Navigation

### Bottom Navigation
```
Dimensions:
  Height: 72px (including safe area)
  Width: 100%
  Padding: 8px 0

Visual:
  Background: #FFFFFF (light) / #18181b (dark)
  Border Top: 1px solid #e2e8f0 (Slate 200)
  Backdrop Blur: 10px

Items:
  Icon: 24x24px
  Label: 12px, Medium, #64748b (Slate 600)
  Spacing: Equal distribution
  Active: #059669 (Emerald 600) color

Figma Setup:
  - Use Auto Layout with space between
  - Create variants for active state
  - Include safe area padding
```

### Drawer
```
Dimensions:
  Mobile: 320px width
  Desktop: 280px width
  Border Radius: 24px (top corners only)

Visual:
  Background: #FFFFFF (light) / #18181b (dark)
  Shadow: 0 -4px 24px rgba(0, 0, 0, 0.15)
  Padding: 24px

Animation:
  Slide from bottom, 300ms ease-out
```

### Modal
```
Dimensions:
  Width: 90% max 400px
  Border Radius: 20px
  Padding: 24px

Visual:
  Background: #FFFFFF (light) / #27272a (dark)
  Shadow: 0 8px 32px rgba(0, 0, 0, 0.2)
  Backdrop: rgba(0, 0, 0, 0.5) with 8px blur

Animation:
  Fade in + slide up, 300ms ease-out
```

---

## 🏷 Status Badges

```
Dimensions:
  Auto width
  Padding: 8px 12px
  Border Radius: 8px

Visual:
  Text: 13px, Semibold (600), #FFFFFF
  Background varies by type

Types:
  Danger: #dc2626 (Red 600)
  Warning: #f59e0b (Amber 500)
  Info: #0ea5e9 (Sky 500)
  Success: #059669 (Emerald 600)
```

---

## 📸 Media Components

### Image Preview
```
Dimensions:
  Max Width: 100%
  Border Radius: 16px

Visual:
  Shadow: 0 4px 16px rgba(0, 0, 0, 0.1)
  Object Fit: Cover
```

### Video Preview
```
Same as Image Preview
+ Custom play button overlay (64x64px circle, white with shadow)
```

### Audio Waveform
```
Dimensions:
  Height: 80px
  Border Radius: 12px
  Padding: 16px

Visual:
  Background: #f1f5f9 (Slate 100)
  Waveform: #059669 (Emerald 600)
  Border: 1px solid #e2e8f0 (Slate 200)
```

---

## 🎯 Component Variants Structure

### Button Variants
```
Button/
  ├── Primary/
  │   ├── Default
  │   ├── Hover
  │   ├── Active
  │   └── Disabled
  ├── Secondary/
  │   └── [same states]
  ├── Ghost/
  │   └── [same states]
  └── Destructive/
      └── [same states]
```

### Input Variants
```
Input/
  ├── Text/
  │   ├── Default
  │   ├── Focus
  │   ├── Error
  │   └── Disabled
  ├── Textarea/
  │   └── [same states]
  └── File Upload/
      ├── Default
      ├── Hover
      └── Active
```

---

## 📐 Auto Layout Guidelines

### Button Auto Layout
```
Direction: Horizontal
Padding: 16px 24px
Gap: 8px (if icon present)
Alignment: Center
```

### Card Auto Layout
```
Direction: Vertical
Padding: 24px
Gap: 16px
Alignment: Stretch
```

### Input Auto Layout
```
Direction: Vertical
Padding: 0
Gap: 8px
  ├── Label (above)
  ├── Input Field
  └── Helper Text (below)
```

---

## 🎨 Component Naming Convention

```
Format: Category/Component/State/Size

Examples:
  Button/Primary/Default/Large
  Input/Text/Focus/Medium
  Card/Elevated/Default
  Navigation/BottomNav/Active
```

---

## ✅ Component Checklist

- [ ] All buttons with states
- [ ] All inputs with states
- [ ] All cards with variants
- [ ] Navigation components
- [ ] Status badges
- [ ] Media components
- [ ] Proper Auto Layout
- [ ] Consistent naming
- [ ] Variants created
- [ ] Prototype interactions

---

**Use these specifications to create pixel-perfect components in Figma that match the modern, clean design system.**

