---
name: Tactile Physicality System
colors:
  surface: '#f7f9ff'
  surface-dim: '#ccdcf0'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e3efff'
  surface-container-high: '#daeafe'
  surface-container-highest: '#d4e4f8'
  on-surface: '#0d1d2b'
  on-surface-variant: '#3f484f'
  inverse-surface: '#233241'
  inverse-on-surface: '#e8f1ff'
  outline: '#6f787f'
  outline-variant: '#bfc8d0'
  surface-tint: '#00658d'
  primary: '#006389'
  on-primary: '#ffffff'
  primary-container: '#097dac'
  on-primary-container: '#fcfcff'
  inverse-primary: '#82cfff'
  secondary: '#ac3323'
  on-secondary: '#ffffff'
  secondary-container: '#fd6e58'
  on-secondary-container: '#6c0300'
  tertiary: '#795500'
  on-tertiary: '#ffffff'
  tertiary-container: '#996d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6e7ff'
  primary-fixed-dim: '#82cfff'
  on-primary-fixed: '#001e2d'
  on-primary-fixed-variant: '#004c6b'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a7'
  on-secondary-fixed: '#400100'
  on-secondary-fixed-variant: '#8a1a0e'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#f9bc46'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#f7f9ff'
  on-background: '#0d1d2b'
  surface-variant: '#d4e4f8'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
  display-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.6'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style
The design system is built on a foundation of **Tactile Minimalism**. It draws inspiration from physical play, utilizing a "pressed-object" aesthetic that makes digital interactions feel mechanical and satisfying. The target audience seeks an engaging, high-energy learning or social environment where clarity and feedback are paramount.

The visual style is a blend of **Tactile/Skeuomorphic** and **Corporate Modern**. It rejects thin lines and ethereal blurs in favor of chunky, high-contrast shapes, heavy borders, and offset shadows that simulate a 3D "button" that can be physically depressed. Movement is not merely decorative; it is the primary vehicle for brand personality, using exaggerated physics to create a sense of life and momentum.

## Colors
The palette is anchored by **Glacier Blue**, providing a cool, professional base, while **Ice** ensures the interface feels breathable and light. **Coral Pebble** and **Amber** act as high-energy triggers for primary actions and warnings. 

All interactive elements must maintain a minimum AA contrast ratio against the background. Every "surface" color has a corresponding "shadow" color (a darker shade of the same hue) used for the 3D offset effect.

## Typography
The system uses a tri-font strategy. **Plus Jakarta Sans** handles the bulk of the professional communication with its friendly, modern terminals. For specific dialogues and character-led moments, **Bricolage Grotesque** (serving as a stylistic proxy for rounded, friendly dialogue) provides a playful, "bouncy" personality. All numerical data, progress indicators, and technical labels utilize **JetBrains Mono** to ground the playfulness in precision and clarity.

## Layout & Spacing
This design system utilizes a **fluid grid** with strict 4px increments. The layout relies on generous internal padding within components to facilitate the "large-tap-target" feel. 

- **Mobile:** 4-column grid, 20px side margins.
- **Tablet:** 8-column grid, 32px side margins.
- **Desktop:** 12-column grid, max-width 1200px, centered.

Spacing between related items (like a card's title and its description) should be `sm`, while spacing between distinct sections should be `xl`.

## Elevation & Depth
Depth in this design system is created through **physical offset** rather than ambient blurs. 
- **The "3D" Rule:** Interactive elements feature a solid bottom border (2-4px) that is 20% darker than the element's surface color.
- **The "Press" State:** On interaction, the element translates Y-axis downward by the same amount as the shadow thickness, and the shadow disappears, simulating a physical button press.
- **Layering:** Use flat, high-contrast outlines (2px) to define containers. Backgrounds remain flat "Ice" to ensure the 3D components pop.

## Shapes
Shapes are defined by extreme approachability. All primary containers and buttons use a **20px (1.25rem) radius**. This "super-ellipse" feel avoids the harshness of sharp corners and aligns with the tactile, pebble-like brand narrative. Smaller elements like tags or input fields use a consistent 12px radius to maintain the family resemblance without looking overly circular.

## Components
### Buttons
Primary buttons are the hallmark of the system. They must feature the `4px` bottom offset shadow. 
- **Primary:** Glacier Blue with a Darker Blue shadow. White text.
- **Secondary:** White surface, Ice background, 2px Glacier Blue border, and a 4px Grey/Blue shadow.

### Cards
Cards use a 2px solid border in a muted version of the Deep Ink text color (approx 10% opacity). They do not have shadows unless they are "Pressable Cards," in which case they follow the button logic.

### Motion Philosophy
Everything moves with a **Spring-based easing**. 
- **Standard Transition:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — this creates a slight overshoot, making elements feel like they are "popping" into place.
- **Interaction:** Every tap triggers a scale-down (0.98) and a Y-offset.
- **Cascading Entry:** Lists and grids must animate children with a 0.05s stagger.

### Inputs & Fields
Inputs use a thick 2px border that changes to Glacier Blue on focus. The label sits in JetBrains Mono above the field for a "technical but friendly" contrast.