# Frontend Design System - Quick Reference

## Color Palette

| Color | Hex | Usage | Contrast |
|-------|-----|-------|----------|
| Primary | #3498db | Borders, links, focus states | ✓ WCAG AA |
| Primary Gradient | #667eea → #764ba2 | Buttons, headers | ✓ WCAG AA |
| Dark Text | #2c3e50 | Body text, headings | ✓ WCAG AAA |
| Light Text | #7f8c8d | Muted, secondary text | ✓ WCAG AA |
| Background | #f5f7fa | Page backgrounds | ✓ WCAG AA |
| Success | #27ae60 | Success messages | ✓ WCAG AA |
| Error | #e74c3c | Error messages | ✓ WCAG AA |
| Warning | #e67e22 | Warning messages | ✓ WCAG AA |

## Typography Scale

### Desktop
```
H1: 3.2rem (51px) - Page titles
H2: 2.4rem (38px) - Section headers
H3: 1.8rem (29px) - Subsections
H4: 1.5rem (24px) - Component titles
H5: 1.2rem (19px) - Labels
Body: 1rem (16px) - Regular text
Small: 0.9rem (14px) - Helper text
```

### Tablet (768px-1199px)
```
H1: 2.5rem → 2rem
H2: 2rem → 1.6rem
H3: 1.5rem → 1.3rem
H4: 1.2rem → 1.1rem
Body: 1rem (same)
```

### Mobile (<768px)
```
H1: 2rem (32px)
H2: 1.6rem (26px)
H3: 1.3rem (21px)
H4: 1.1rem (18px)
Body: 1rem (16px)
```

## Spacing System

### Padding Scale
```
px-0.5: 0.5rem (8px)
px-1: 1rem (16px)
px-1.5: 1.5rem (24px)
px-2: 2rem (32px)
px-2.5: 2.5rem (40px)
px-3: 3rem (48px)
px-4: 4rem (64px)
```

### Container Padding
- **Desktop**: 3rem (48px)
- **Tablet**: 2rem (32px)
- **Mobile**: 1.5rem (24px)

## Component Heights

| Component | Height | Padding | Example |
|-----------|--------|---------|---------|
| Input | 40-48px | 12px 16px | Forms |
| Button (Standard) | 44-48px | 12px 24px | CTAs |
| Button (Large) | 50-56px | 16px 32px | Primary CTAs |
| Card | Auto | 24px | Content cards |
| Stat Card | 140-160px | 40px | Dashboard |

## Grid System

### Desktop (1200px+)
- Admin Dashboard: 4-column grid
- Course Listing: 3-column grid (360px min)
- Course Listing (alt): 4-column grid (280px min)
- Filters: 4-column grid
- Gap: 2-2.5rem

### Tablet (768px-1199px)
- Admin Dashboard: 2-column grid
- Course Listing: 2-column grid (300px min)
- Quick Actions: 2-column grid
- Gap: 2rem

### Mobile (<768px)
- All Components: 1-column grid
- Gap: 1.5rem

## Button States

### Primary Button (Gradient)
```
Default: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Hover: translateY(-4px), shadow-lg, scale(1.02)
Active: translateY(-2px)
Focus: outline 2px solid #3498db
Disabled: opacity 0.6
```

### Secondary Button (White Border)
```
Default: white bg, #3498db border (2.5px)
Hover: #3498db bg, white text, translateY(-2px)
Active: translateY(-1px)
Focus: outline 2px solid #3498db
Disabled: opacity 0.6
```

### Danger Button (Red Border)
```
Default: white bg, #e74c3c border (2px)
Hover: #e74c3c bg, white text
Active: translateY(-1px)
Focus: outline 2px solid #e74c3c
Disabled: opacity 0.6
```

## Form Elements

### Input/Select/Textarea
```
Border: 2px solid #ecf0f1
Border Radius: 8-10px
Padding: 12px 16px
Font Size: 1rem
Focus Border: #3498db
Focus Shadow: 0 0 0 4px rgba(52, 152, 219, 0.1)
```

### Labels
```
Font Weight: 700 (bold)
Font Size: 0.95rem
Color: #2c3e50
Text Transform: uppercase
Letter Spacing: 0.3px
Margin Bottom: 0.8rem
Required Indicator: red asterisk
```

### Error State
```
Border Color: #e74c3c
Border Width: 2px
Shadow: 0 0 0 4px rgba(231, 76, 60, 0.1)
Error Text: #e74c3c, 0.9rem, bold
```

## Cards & Containers

### Default Card
```
Background: white
Border Radius: 12-14px
Padding: 20-30px
Shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
Border: 1px solid rgba(52, 152, 219, 0.05)
Hover: translateY(-8px), shadow-lg
```

### Stat Card
```
Background: white
Border Radius: 16px
Padding: 40px
Border Left: 6px solid (color-specific)
Border Top: 1px solid rgba(52, 152, 219, 0.1)
Shadow: 0 4px 16px rgba(0, 0, 0, 0.08)
Hover: translateY(-12px), shadow-xl
```

## Shadows

| Class | Shadow | Use Case |
|-------|--------|----------|
| shadow-sm | 0 2px 4px rgba(0,0,0,0.06) | Subtle | 
| shadow | 0 4px 12px rgba(0,0,0,0.08) | Default cards |
| shadow-lg | 0 12px 24px rgba(0,0,0,0.15) | Hover effects |
| shadow-xl | 0 20px 40px rgba(0,0,0,0.2) | Modals, prominent |

## Border Radius

| Class | Radius | Use Case |
|-------|--------|----------|
| radius-sm | 8px | Inputs, small |
| radius-md | 10px | Buttons, standard |
| radius-lg | 12px | Cards, default |
| radius-xl | 14px | Large cards |
| radius-full | 50% | Avatars, icons |

## Animations

### Duration & Timing
```
Fast: 0.2s cubic-bezier(0.23, 1, 0.320, 1)
Standard: 0.3s cubic-bezier(0.23, 1, 0.320, 1)
Slow: 0.5s ease-out
```

### Common Animations
- **fadeIn**: opacity change
- **slideIn**: top + opacity
- **slideUp**: bottom + opacity
- **spin**: 360° rotation (loading)
- **shimmer**: left to right sweep
- **pulse**: opacity pulse

## Icon Sizes

| Size | Pixel | Component |
|------|-------|-----------|
| Small | 1.5rem (24px) | Inline icons |
| Standard | 2rem (32px) | Form icons |
| Medium | 2.5rem (40px) | Action buttons |
| Large | 3rem (48px) | Stat cards |
| XL | 4rem (64px) | Empty states |

## Responsive Breakpoints

```
Mobile: < 480px
Tablet: 480px - 767px
Tablet Large: 768px - 1199px
Desktop: 1200px+
Desktop Large: 1920px+
```

## Accessibility Standards

### Color Contrast Ratios
- **Normal Text**: Minimum 4.5:1 (WCAG AA)
- **Large Text** (18px+): Minimum 3:1 (WCAG AA)
- **UI Components**: Minimum 3:1 (WCAG AA)

### Focus Indicators
```
Default: 2px solid outline with 2px offset
Color: #3498db primary color
Minimum Size: 2px border + 2px offset = 6px total
```

### Motion
```
@media (prefers-reduced-motion: reduce) {
  All animation durations: 0.01ms
  All transitions: 0.01ms
}
```

## Loading States

### Spinner Animation
```
Border: 4px solid rgba(52, 152, 219, 0.2)
Top Border: 4px solid #3498db
Size: 40px
Duration: 1s linear infinite
```

### Skeleton Loader
```
Background: #ecf0f1
Animation: pulse 1.5s ease-in-out infinite
Border Radius: 8px
```

## Z-Index Scale

```
Dropdown/Menu: 100
Modal Overlay: 1000
Modal Content: 1001
Toast/Notification: 2000
Tooltip: 2100
```

## Common Patterns

### Header + Content Pattern
```
Header: Fixed or relative positioning
Content: Flex-grow to fill remaining space
Footer: Fixed to bottom or flex-grow
```

### Card Grid Pattern
```
Container: display: grid
Grid Template: repeat(auto-fill, minmax(300px, 1fr))
Gap: 2-2.5rem
Responsive: Adjust minmax values for tablets/mobile
```

### Form Group Pattern
```
Label: Block, bold, margin-bottom
Input: Full width, border, padding
Error: Conditional display, red color
Helper: Small, muted text below
```

## Quick CSS Reference

### Full Width Container
```css
width: 100%;
padding: 3rem;
background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
```

### Centered Form
```css
max-width: 900px;
width: 100%;
padding: 3rem;
background: white;
border-radius: 16px;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
```

### Hover Lift Effect
```css
transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

### Gradient Text
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

**Quick Tips:**
1. Always test on three screen sizes: desktop (1920px), tablet (800px), mobile (375px)
2. Use utility classes for consistent spacing
3. Leverage gradients for visual interest
4. Ensure all interactive elements have `:hover` and `:focus` states
5. Keep animations smooth (cubic-bezier timing functions)
6. Maintain color contrast for accessibility
7. Use `transform` for animations (GPU accelerated)
8. Test keyboard navigation with Tab key
9. Verify mobile responsiveness on actual devices
10. Use DevTools to inspect and debug styles

