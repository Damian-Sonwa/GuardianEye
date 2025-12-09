# Security App - Figma Design System Specification

## Design Philosophy

Modern, clean, and accessible design inspired by:
- **shadcn/ui**: Component-based design system
- **iOS**: Clean edges and smooth animations
- **Material You**: Spacing and elevation principles
- **Mapbox**: Map visualization aesthetics

## Color System

### Primary Colors
- **Primary (Emerald)**: `#10b981` - Main actions, success states
- **Danger (Red)**: `#ef4444` - Panic button, critical alerts
- **Info (Sky)**: `#0ea5e9` - Information, links

### Neutral Palette
- **Zinc**: `#18181b` to `#f4f4f5` - Base grays
- **Slate**: `#0f172a` to `#f1f5f9` - Text and backgrounds
- **Stone**: `#1c1917` to `#fafaf9` - Subtle accents

### Semantic Colors
```css
--primary: 142.1 76.2% 36.3%        /* Emerald green */
--destructive: 0 84.2% 60.2%        /* Red */
--muted: 210 40% 96.1%              /* Light gray */
--accent: 210 40% 96.1%              /* Accent gray */
```

## Typography Scale

### Font Family
- **Primary**: Inter (system fallback: -apple-system, sans-serif)
- **Monospace**: 'Courier New', monospace (for codes/PINs)

### Scale
- **Display**: 3xl (30px) - Hero titles
- **H1**: 2xl (24px) - Page titles
- **H2**: xl (20px) - Section headers
- **H3**: lg (18px) - Card titles
- **Body**: base (16px) - Default text
- **Small**: sm (14px) - Secondary text
- **Tiny**: xs (12px) - Labels, captions

### Line Heights
- **Tight**: 1.2 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

## Spacing System

Based on 4px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## Component Specifications

### Buttons

#### Primary Button
- **Height**: 48px (mobile), 40px (desktop)
- **Padding**: 16px 24px
- **Border Radius**: 8px
- **Font**: 16px, semibold
- **States**: Default, Hover, Active, Disabled

#### Panic Button
- **Height**: 64px
- **Background**: Red (#ef4444)
- **Animation**: Pulse on active
- **Font**: 18px, bold
- **Icon**: AlertTriangle (24px)

#### Large Touch Target (Rural-Friendly)
- **Minimum**: 56x56px
- **Recommended**: 64x64px
- **Spacing**: 16px between targets

### Cards

- **Padding**: 24px
- **Border Radius**: 12px
- **Shadow**: 
  - Default: `0 1px 3px rgba(0,0,0,0.1)`
  - Hover: `0 4px 12px rgba(0,0,0,0.15)`
- **Border**: 1px solid `hsl(var(--border))`

### Input Fields

- **Height**: 48px
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Font**: 16px (prevents zoom on iOS)
- **Focus**: 2px ring, primary color

### Bottom Navigation

- **Height**: 64px + safe area
- **Background**: Card background with backdrop blur
- **Items**: 5 max
- **Icon Size**: 24px
- **Active State**: Primary color, scale animation

## Screen Specifications

### Mobile (PWA)

#### Splash Screen
- Full-screen gradient (emerald)
- Centered logo with rotation animation
- Auto-redirect after 2s

#### Login Screen
- Email input + button
- 4-digit PIN input (large, centered)
- Google OAuth button
- Fingerprint button
- Guest option

#### Home Dashboard
- Header with notifications
- Quick action cards (2x2 grid)
- Community alerts list
- Safe routes card

#### Panic Button
- Large red button (full width, centered)
- 3-second countdown
- Location indicator
- Cancel option

#### Report Screen
- Description textarea
- Media picker (Photo/Video/Audio)
- Location capture
- Submit button

#### Map Screen
- Full-screen Mapbox GL
- Legend overlay (bottom)
- Navigation controls
- User location button

#### AI Identification
- Image upload area
- Camera button
- Results list with confidence scores
- Disclaimer banner

### Agency Dashboard (Web)

#### Layout
- Sidebar navigation (256px width)
- Main content area
- Responsive: collapses to drawer on mobile

#### Dashboard Home
- Stats grid (3 columns)
- Quick action cards
- Recent activity feed

#### Map View
- Full-screen map
- Heatmap overlay
- Cluster markers
- Filter panel

#### Cases Table
- Sortable columns
- Status badges
- Priority indicators
- Action dropdowns

## Animation Guidelines

### Transitions
- **Default**: 200ms ease-out
- **Fast**: 150ms (hover states)
- **Slow**: 300ms (page transitions)

### Framer Motion Presets
```typescript
// Fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}

// Slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// Scale
initial={{ scale: 0.9 }}
animate={{ scale: 1 }}
transition={{ duration: 0.2 }}
```

### Micro-interactions
- Button press: scale(0.95)
- Card hover: translateY(-2px)
- Icon click: rotate(360deg)
- Panic button: pulse animation

## Accessibility

### Touch Targets
- Minimum: 44x44px (iOS), 48x48px (Android)
- Recommended: 56x56px for rural-friendly UI

### Contrast Ratios
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive: 3:1 minimum

### Screen Reader Support
- Semantic HTML
- ARIA labels for icons
- Alt text for images
- Form labels

## Dark Mode

### Color Adjustments
- Background: Dark slate (#0f172a)
- Cards: Slightly lighter (#1e293b)
- Text: Light gray (#f1f5f9)
- Borders: Subtle gray (#334155)

### Implementation
- System preference detection
- Manual toggle in settings
- Persistent user choice

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Figma File Structure

```
Security App Design System
├── 🎨 Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── 📱 Mobile Screens
│   ├── Splash
│   ├── Login
│   ├── Home
│   ├── Panic
│   ├── Report
│   ├── Map
│   ├── Identify
│   ├── Profile
│   └── Settings
├── 💻 Dashboard Screens
│   ├── Login
│   ├── Home
│   ├── Map
│   ├── Cases
│   ├── Suspects
│   └── Settings
└── 🧩 Components
    ├── Buttons
    ├── Cards
    ├── Inputs
    ├── Navigation
    └── Modals
```

## Implementation Notes

1. **Use CSS Variables** for theming
2. **Tailwind Config** matches design tokens
3. **shadcn/ui** components as base
4. **Framer Motion** for animations
5. **Mobile-first** approach
6. **Progressive enhancement** for features

## Export Specifications

- **Icons**: SVG, 24x24px default
- **Images**: WebP format, multiple sizes
- **Colors**: HSL values for CSS variables
- **Spacing**: Tailwind classes

---

This design system ensures consistency across the Security App while maintaining flexibility for future enhancements.

