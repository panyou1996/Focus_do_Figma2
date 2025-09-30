# UI Style Guide: Modern Blog Card

This document describes the visual style and specifications for a modern, clean, and soft-UI blog post card component. The goal is to provide a detailed guide for an agent to replicate its design pixel-perfectly without seeing the original image.

---

### 1. Overall Layout & Card Container

The component is a self-contained card with a clean, floating appearance.

-   **Background Color**: Pure white (`#FFFFFF`).
-   **Shape**: A vertical rectangle with a large border-radius, approximately `28px`, creating a soft, rounded look.
-   **Shadow**: A subtle and diffused `box-shadow` is used to lift the card off the background. The shadow should be primarily vertical, soft, and not too dark.
    -   *CSS Example*: `box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.1);`
-   **Internal Padding**: The card has generous internal padding on all sides, approximately `24px`.

---

### 2. Header Section

The header is a single row at the top of the card containing a tag and a date.

-   **Layout**: Use `display: flex` with `justify-content: space-between` and `align-items: center` to position the elements.

-   **Tag (Left Side)**:
    -   **Shape**: A flat capsule or "pill" shape.
    -   **Background Color**: A dark, charcoal gray, close to `#2D2D2D`.
    -   **Text**: The text reads "Lush and green".
        -   **Color**: White (`#FFFFFF`).
        -   **Font**: A clean sans-serif font (like Inter, Manrope, or system UI font).
        -   **Weight**: Medium (`font-weight: 500`).

-   **Date (Right Side)**:
    -   **Structure**: A composite element made of two joined parts within a single rounded container.
    -   **Left Part ("JAN")**:
        -   **Background**: Same dark gray as the tag (`#2D2D2D`).
        -   **Text Color**: White (`#FFFFFF`).
    -   **Right Part ("25")**:
        -   **Background**: White (`#FFFFFF`).
        -   **Border**: A thin, 1px border in the same dark gray (`#2D2D2D`).
        -   **Text Color**: Dark gray (`#2D2D2D`).
    -   **Font**: Sans-serif, bold (`font-weight: 700`).

---

### 3. Text Content

The main text content is placed below the header.

-   **Title**:
    -   **Content**: "Discovering peace"
    -   **Font Size**: Large, e.g., `24pt`.
    -   **Font Weight**: Bold (`font-weight: 700`).
    -   **Color**: A dark gray, slightly lighter than the header elements, e.g., `#333333`.
    -   **Spacing**: There is a significant margin between the header and the title.

-   **Body Paragraph**:
    -   **Content**: "Far from the city's noise, the green mountains..."
    -   **Font Size**: Medium, e.g., `16pt`.
    -   **Font Weight**: Normal / Regular (`font-weight: 400`).
    -   **Color**: A medium-light gray, e.g., `#757575`.
    -   **Line Height**: Generous for readability, e.g., `1.6`.

---

### 4. Image

A prominent image is placed below the text content.

-   **Shape**: The image has a large border-radius, approximately `20px`. It should appear nested within the main card.
-   **Content**: The image depicts a soft-focus, abstract view of rolling hills or dunes. The color palette is dominated by a vibrant light green and a deep, shadowy green.

---

### 5. Image Overlay

Textual information is overlaid on the bottom-left corner of the image.

-   **Layout**: A location pin icon is followed by two lines of text.
-   **Icon**: A simple map/location pin icon.
    -   **Color**: White (`#FFFFFF`).
-   **Text**:
    -   **Content**: "Blue Ridge" (line 1) and "Virginia, USA" (line 2).
    -   **Color**: White (`#FFFFFF`).
    -   **Font**: Sans-serif, medium weight (`font-weight: 500`).
-   **Readability**: To ensure the white text is readable against the image, a very subtle text-shadow should be applied.
    -   *CSS Example*: `text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);`
