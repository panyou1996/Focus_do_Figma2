# Widget Style Unification Proposal

This document outlines the current style inconsistencies across various drawer components and proposes a unified style to improve the user experience.

## 1. Analysis of Style Inconsistencies

### 1.1. Header

| Component | Icon | Subtitle |
| :--- | :--- | :--- |
| `AddTaskDrawer` | No | No |
| `AddListDrawer` | No | No |
| `TaskDetailDrawer` | No | No |
| `RecommendedInboxDrawer` | Yes (Inbox icon) | Yes ("X tasks suggested") |
| `OverdueInboxDrawer` | Yes (AlertTriangle icon) | Yes ("X tasks need attention") |
| `CreateBlogDrawer` | No | No |

**Observation**: Headers are inconsistent. Some have icons and subtitles, while others only have a title. `TaskDetailDrawer` has edit and delete buttons in the header.

### 1.2. Buttons

| Component | Button 1 (Primary) | Button 2 (Secondary) | Layout |
| :--- | :--- | :--- | :--- |
| `AddTaskDrawer` | "Add Task" (left) | "Cancel" (right) | Single Row |
| `AddListDrawer` | "Add List" (right) | "Cancel" (left) | Single Row |
| `TaskDetailDrawer` (View) | "Close" (full width) | - | Single Button |
| `TaskDetailDrawer` (Edit) | "Save Changes" (left) | "Cancel" (right) | Single Row |
| `RecommendedInboxDrawer` | "Close" (full width) | - | Single Button |
| `OverdueInboxDrawer` | "Close" (full width) | - | Single Button |
| `CreateBlogDrawer` | "Publish"/"Update" (left) | "Cancel" (right) | Single Row |

**Observation**: Button placement and layout are inconsistent.
- The primary action button is sometimes on the left and sometimes on the right.
- Some drawers have a single full-width "Close" button, while others have two buttons for primary and secondary actions.
- The buttons are sometimes in a single row and sometimes in two rows.

## 2. Unified Style Proposal

To create a more consistent and intuitive user experience, I propose the following unified styles for all drawer components.

### 2.1. Unified Header Style

- **All headers should include an icon and a subtitle.** This provides better context and a more visually appealing interface.
- The title should be centered.
- Action buttons (like "Edit" and "Delete" in `TaskDetailDrawer`) should be placed on the right side of the header.

**Example:**

```
<DrawerHeader>
  <div className="flex items-center gap-3 mb-2">
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
      <Icon className="h-4 w-4 text-blue-600" />
    </div>
    <div>
      <DrawerTitle className="text-lg font-medium">Drawer Title</DrawerTitle>
      <p className="text-sm text-gray-500">Subtitle with context</p>
    </div>
  </div>
</DrawerHeader>
```

### 2.2. Unified Button Style

- **The primary action button should always be on the right, and the secondary action button (e.g., "Cancel") on the left.** This is a common and intuitive pattern.
- For drawers with only a single action (e.g., "Close"), the button should be full-width.
- All buttons should be in a single row at the bottom of the drawer.

**Example (Two Buttons):**

```
<DrawerFooter>
  <div className="flex gap-3">
    <Button variant="outline" className="flex-1">Cancel</Button>
    <Button className="flex-1">Primary Action</Button>
  </div>
</DrawerFooter>
```

**Example (Single Button):**

```
<DrawerFooter>
  <Button variant="outline" className="w-full">Close</Button>
</DrawerFooter>
```

## 3. Implementation Plan

1.  **Apply the unified header style** to `AddTaskDrawer`, `AddListDrawer`, `TaskDetailDrawer`, and `CreateBlogDrawer`.
2.  **Apply the unified button style** to `AddTaskDrawer`, `AddListDrawer`, `TaskDetailDrawer`, and `CreateBlogDrawer`.
3.  Ensure all drawers have a consistent white background.

I will await your feedback on this proposal before proceeding with any changes.