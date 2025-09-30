# Calendar Page Update Guide

This document outlines the changes made to `src/components/CalendarPage.tsx` to fix the overlapping task dots issue.

## Changes Overview

The main goal was to adjust the layout of the calendar day cells to prevent the task dots from overlapping with the date number. This was achieved by:

1.  Moving the date number up slightly.
2.  Allowing the task dots to wrap into two rows.
3.  Reducing the padding between the dots to fit more dots in a single row.

## Specific Code Changes

In `src/components/CalendarPage.tsx`, the following changes were made inside the `.map` function that renders the `calendarDays`:

### 1. Calendar Day Button Styling

The `className` of the button for each calendar day was modified to change the alignment and padding of its content.

**Old Code:**

```jsx
className={`
  relative aspect-square p-1 text-sm rounded-lg transition-all duration-200 min-h-[48px] flex flex-col items-center justify-center
  ...
`}
```

**New Code:**

```jsx
className={`
  relative aspect-square p-0 text-sm rounded-lg transition-all duration-200 min-h-[48px] flex flex-col items-center justify-start
  ...
`}
```

-   `p-1` was changed to `p-0` to remove the overall padding.
-   `justify-center` was changed to `justify-start` to align the content to the top.

### 2. Date Number Styling

A `mt-1` class was added to the `span` that displays the day's number to provide a small top margin.

**Old Code:**

```jsx
<span className="mb-1">{dayInfo.day}</span>
```

**New Code:**

```jsx
<span className="mt-1">{dayInfo.day}</span>
```

### 3. Task Dots Container

The `div` that contains the task dots was updated to allow for wrapping and to adjust the spacing.

**Old Code:**

```jsx
<div className="flex flex-wrap gap-0.5 justify-center">
```

**New Code:**

```jsx
<div className="flex flex-wrap gap-px justify-center mt-1 w-full px-1">
```

-   `gap-0.5` was changed to `gap-px` to reduce the space between dots.
-   `mt-1` was added to create a small margin between the date number and the dots.
-   `w-full` and `px-1` were added to ensure the dots are contained within the full width of the cell with a little padding on the sides.

### 4. Increased Number of Dots

The number of dots displayed was increased from `4` to `8` to allow for two full rows of dots.

**Old Code:**

```jsx
{Array.from({ length: Math.min(dayTasks.length, 4) }).map((_, i) => (
```

**New Code:**

```jsx
{Array.from({ length: Math.min(dayTasks.length, 8) }).map((_, i) => (
```

These changes ensure that the task dots are displayed neatly in up to two rows without overlapping with the date, improving the overall look and feel of the calendar.
