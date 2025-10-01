# UI Style Guide: Expanded Floating Action Button (FAB)

This document provides a detailed visual description of an expanded Floating Action Button (FAB) component. The style is modern, vibrant, and user-friendly, intended for an agent to replicate without direct image access.

---

### 1. Overall Component Style

The component is shown in its expanded state, appearing as a single, unified element.

-   **Shape**: A vertical "pin" or "exclamation mark" shape. It combines a perfect circle at the base with a vertical, rounded-top rectangular menu that extends upwards.
-   **Background Color**: The entire component uses a single, uniform color: a vibrant and saturated Indigo Blue.
    -   *CSS Example*: `background-color: #5D5FEF;`
-   **Shadow**: The component has a soft, pronounced `box-shadow` to create a distinct floating effect above the content.
    -   *CSS Example*: `box-shadow: 0 6px 16px -2px rgba(93, 95, 239, 0.4);`

---

### 2. Interaction State

-   The image displays the **expanded/active state** of the FAB.
-   In this state, the base button serves as an anchor for the vertical menu of secondary actions.
-   In its **collapsed state** (not shown), it would be a simple circular button, presumably displaying a primary action icon like a white plus (`+`) sign.

---

### 3. Menu Icons

The expanded menu contains a vertical stack of three icons.

-   **General Icon Style**:
    -   **Color**: All icons are pure white (`#FFFFFF`).
    -   **Style**: They are "line-art" icons (stroked, not filled).
    -   **Stroke**: The stroke width is uniform, medium-to-thick, across all icons.
    -   **Corners & Caps**: All sharp corners are rounded, and line-endings are also rounded (`border-radius`, `stroke-linecap: round`). This creates a soft and friendly aesthetic.

-   **Specific Icons (from top to bottom)**:
    1.  **List/Task Icon**: A stylized rectangle representing a document or a checklist, with two or three horizontal lines inside.
    2.  **Calendar Icon**: A simple square outline with two small vertical prongs on top, mimicking the rings of a desk calendar.
    3.  **Tag Icon**: A classic, left-pointing tag/label shape.

-   **Layout & Spacing**:
    -   The icons are perfectly centered horizontally within the menu.
    -   They are distributed evenly in the vertical direction, with generous padding between each icon and between the icons and the container edges.
