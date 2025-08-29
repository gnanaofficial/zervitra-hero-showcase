# Zervitra Color System Guide

## Overview

This guide explains how to change colors throughout the Zervitra hero showcase website. All colors are centralized for easy customization.

## Quick Color Changes

### Primary Method: Edit `src/lib/colors.ts`

The easiest way to change colors is to modify the `colors.ts` file:

```typescript
// Example: Change primary color from purple to blue
export const colors = {
  primary: {
    main: "220 70% 50%", // Changed from "263 70% 50%" to blue
    light: "220 70% 60%",
    dark: "220 70% 40%",
  },
  // ... other colors
};
```

### Secondary Method: Edit CSS Variables in `src/index.css`

You can also modify the CSS custom properties directly:

```css
:root {
  --primary: 220 70% 50%; /* Blue instead of purple */
  --hero-from: 220 70% 60%;
  --hero-to: 200 70% 65%;
  --success: 120 76% 36%; /* Different green */
}
```

## Color Categories

### 1. Primary Colors

- **Primary**: Main brand color (currently purple)
- **Hero Gradient**: Two-color gradient for main headlines
- **Success**: Green color for success states and accents

### 2. Background Colors

- **Main Background**: Dark background color
- **Card Background**: Slightly lighter background for cards
- **Secondary Background**: Alternative background color

### 3. Text Colors

- **Primary Text**: Main text color (white)
- **Secondary Text**: Navigation and secondary text
- **Muted Text**: Subtle text for descriptions

### 4. Border & Shadow Colors

- **Borders**: Subtle borders and dividers
- **Shadows**: Card shadows and glow effects

## Color Format

All colors use HSL format: `H S% L%`

- **H**: Hue (0-360 degrees)
- **S**: Saturation (0-100%)
- **L**: Lightness (0-100%)

## Examples

### Change to Blue Theme

```typescript
primary: {
  main: "220 70% 50%",    // Blue
  light: "220 70% 60%",
  dark: "220 70% 40%",
},
hero: {
  from: "220 70% 60%",    // Light blue
  to: "200 70% 65%",      // Cyan blue
},
```

### Change to Green Theme

```typescript
primary: {
  main: "120 70% 50%",    // Green
  light: "120 70% 60%",
  dark: "120 70% 40%",
},
hero: {
  from: "120 70% 60%",    // Light green
  to: "140 70% 65%",      // Teal green
},
```

### Change to Red Theme

```typescript
primary: {
  main: "0 70% 50%",      // Red
  light: "0 70% 60%",
  dark: "0 70% 40%",
},
hero: {
  from: "0 70% 60%",      // Light red
  to: "20 70% 65%",       // Orange red
},
```

## Components That Use These Colors

1. **Navbar**: Primary color for buttons, borders
2. **Hero Section**: Hero gradient for main headline
3. **Floating Cards**: Card backgrounds, borders, shadows
4. **Wavy Flow**: Wave line colors, node colors
5. **Buttons**: Primary colors, hover states
6. **Text**: All text colors throughout

## Tips for Good Color Combinations

1. **Contrast**: Ensure text is readable on backgrounds
2. **Harmony**: Use complementary or analogous colors
3. **Accessibility**: Maintain sufficient contrast ratios
4. **Brand Consistency**: Keep colors aligned with your brand

## Testing Changes

After changing colors:

1. Save the file
2. The development server will automatically reload
3. Check all components to ensure colors look good
4. Test on different screen sizes
5. Verify accessibility with color contrast tools

## Need Help?

If you need assistance with color selection or have questions about the color system, refer to:

- Color theory resources
- Online color palette generators
- Accessibility guidelines for color contrast
