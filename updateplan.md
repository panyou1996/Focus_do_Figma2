# Figma Make Vibe Coding Todo Project Update Plan

This document outlines the plan to update the Figma Make Vibe Coding Todo project based on the requirements specified in the `src/guidelines/updateneed` file.

## 1. Bugs Fixes

### 1.1. Remove Outer Frame

*   **Issue:** The application is contained within a mobile phone frame, which is not ideal for a web application.
*   **Plan:**
    1.  Remove the outer mobile frame from `src/App.tsx`.
    2.  Modify the main container in `src/App.tsx` to fill the entire screen on mobile devices.
    3.  For desktop browsers, the layout will be centered with a maximum width to maintain a mobile-first experience, with white space on the sides.
    4.  Update `src/index.css` to ensure the body and root elements are full height.

### 1.2. Calendar View Issues

*   **Issue:**
    1.  Dots under dates with tasks push the date number up.
    2.  The week view navigation doesn't update the calendar.
    3.  The "This Week" row is redundant.
*   **Plan:**
    1.  Fix the bugs in `src/components/CalendarPage.tsx` and `src/components/ui/calendar.tsx` without a major refactor.
    2.  Remove the "This Week" row and move the expand/collapse functionality to the month/year header.
    3.  The `<>` navigation buttons will be hidden in the collapsed week view and will have a fade-in/out animation.
    4.  Remove the redundant date text below the calendar.
    5.  Adjust the styling of the calendar days to ensure the dots for tasks do not affect the layout.

### 1.3. Inconsistent Header Styles

*   **Issue:** The headers of the three main pages (Today, Calendar, Review) are inconsistent with the Lists page.
*   **Plan:**
    1.  Create a reusable `Header` component based on the style of the `ListsPage` header.
    2.  Update `src/components/TodayPage.tsx`, `src/components/CalendarPage.tsx`, and `src/components/ReviewPage.tsx` to use the new `Header` component.
    3.  The header will display the page title and a summary of the tasks on that page. The summary format for each page will be as follows:
        *   **Today:** "X tasks for today, Y overdue"
        *   **Calendar:** "X tasks this month"
        *   **Review:** "X check-ins this month"

### 1.4. Lists Page Issues

*   **Issue:**
    1.  No transition animations when entering/leaving a list.
    2.  The filter icon in the list detail view should be a back button.
    3.  No way to add, edit, or delete lists.
*   **Plan:**
    1.  Implement page transitions using `framer-motion` in `src/components/ListsPage.tsx`.
    2.  Replace the filter icon with a back button in the list detail view.
    3.  Add a button to the header to add a new list.
    4.  Implement "swipe to delete" and "long press to edit" gestures for lists.
    5.  Create a new `ListEdit` component to handle creating and editing lists.
    6.  Update the `TaskList` interface to include `title`, `description`, `icon`, and `color` properties. The `ListEdit` component will be in sync with this, and the list show style will keep the same with original project.

### 1.5. Task Edit Widget Issues

*   **Issue:**
    1.  The duration input has a flawed validation rule.
    2.  Inconsistent header styles between "Add New Task" and "Edit Task".
    3.  The "Edit Task" widget is not compact enough.
    4.  The "Task Details" view is inconsistent with the "Edit Task" widget.
*   **Plan:**
    1.  In `src/components/AddTaskDrawer.tsx`, remove the validation rule for the duration input and display the duration in minutes.
    2.  Unify the header styles for "Add New Task" and "Edit Task" to be a single, centered sentence.
    3.  Redesign the "Edit Task" widget to be more compact, with a larger title, an "important" icon, and a more organized layout.
    4.  The `description` field will be removed and merged with `comments`.
    5.  `list` and `duration` will be on the same line.
    6.  `fixed time` (as a toggle) and `due day` will be on the same line.
    7.  `start time` will have its own line and include date and time. I will ensure all other logics connected to this property do not get new mistaks.
    8.  Add a `subtasks` property with a checkbox.
    9.  Update the "Task Details" view to match the new "Edit Task" layout.

### 1.6. Task List Issues

*   **Issue:**
    1.  The checkbox is too large.
    2.  A redundant "important" card appears after starring a task.
    3.  The `isFixed` property is not visually represented.
    4.  No way to quickly edit the `isFixed` property.
    5.  No way to remove a task from "My Day".
    6.  Subtasks are not displayed.
*   **Plan:**
    1.  In the task list component, reduce the size of the checkbox to match the "important" star icon.
    2.  Remove the redundant "important" card.
    3.  Add a subtle shadow to tasks with `isFixed: true` to give them a "fixed" feel. The shadow will be `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`.
    4.  Implement a "long press" gesture to toggle the `isFixed` property, with haptic feedback and a visual animation.
    5.  Implement "left swipe for delete" and "right swipe for add/remove from My Day" gestures, with a confirmation dialog for deletion.
    6.  Display subtasks under the parent task, expanded by default.

### 1.7. Today Page Inbox Issues

*   **Issue:**
    1.  The animation for the "Recommended Inbox" and "Overdue Inbox" is jarring.
    2.  No "Add to My Day" or "delete" interactions.
    3.  Tasks already in "Today" appear in the inboxes.
*   **Plan:**
    1.  In `src/components/RecommendedInboxDrawer.tsx` and `src/components/OverdueInboxDrawer.tsx`, replace the current animation with a smooth and elegant vertical staggered list animation.
    2.  Add "Add to My Day" and "delete" buttons to the inbox items.
    3.  Filter out tasks that are already in the "Today" view from both the "Recommended Inbox" and "Overdue Inbox".
    4.  When "Add to My Day" is clicked, the task will be animated out of the inbox and will appear in the "Today" list with a smooth animation.

### 1.8. Night Mode Issues

*   **Issue:** Some buttons and text are not visible in night mode.
*   **Plan:**
    1.  Review and fix all color contrast issues in `src/styles/globals.css` for the dark theme.
    2.  Ensure all components are tested in both light and dark modes.

## 2. New Features and Attributes

### 2.1. Capacitor Support

*   **Goal:** Compile the application into an APK for Android.
*   **Plan:**
    1.  Install and configure Capacitor in the project.
    2.  Add the Android platform.
    3.  Update the UI to comply with Android design guidelines, including support for notches, punch-hole displays, and the bottom navigation bar. This will involve:
        *   Using Capacitor's safe area plugins to adjust the layout.
        *   Testing the app on various Android devices and screen sizes.
    4.  Integrate native features like haptic feedback and notifications using Capacitor APIs. This will involve:
        *   Using the `@capacitor/haptics` plugin for haptic feedback.
        *   Using the `@capacitor/local-notifications` plugin for local notifications.

### 2.2. Calendar Page Enhancements

*   **Goal:** Add new functionality to the calendar page.
*   **Plan:**
    1.  In `src/components/CalendarPage.tsx`, implement a "double click" or "click on selected date" gesture to open the "Add Task" widget with the due date pre-filled.
    2.  Add a toggle to switch between viewing tasks by "due date" and "start time".

### 2.3. Review Page to Check-in Page

*   **Goal:** Replace the "Review" page with a "Check-in" page.
*   **Plan:**
    1.  Create a new `CheckinPage.tsx` component.
    2.  The page will have three sections: "Check-in" (for managing check-in items), "Statistics", and "Blog".
    3.  Users can add check-in items, and the app will track their progress.
    4.  The "Blog" section will allow users to create blog posts with a cover image, title, content, location, and time. The post detail component will be a pixel-perfect implementation of `blog_view.jpg`, with some features adjusted for consistency with the project.
    5.  Blog posts will be displayed in a two-column grid.
    6.  All data will be synchronized with Supabase.

### 2.4. FAB (Floating Action Button) Redesign

*   **Goal:** Redesign the FAB with new features.
*   **Plan:**
    1.  In `src/components/FloatingActionButton.tsx`, replace the current icon with the new icon from `FAB2.jpg`.
    2.  Implement the following interactions:
        *   **Single-click:** Open the "Add Task" widget.
        *   **Double-click:** Open the system camera for a quick check-in. After taking a picture, the user can select a check-in item and edit a blog post.
        *   **Long-press:** Open a compact text input window that animates from the FAB to the left for quick task creation with natural language processing.

### 2.5. User Management

*   **Goal:** Add a user management page.
*   **Plan:**
    1.  Create a new `UserManagementPage.tsx` component.
    2.  The page will include options for:
        *   Login/Logout
        *   Enable/disable cloud sync
        *   Change font size
        *   Change password

## 3. Timeline and Milestones

The update will be implemented in the following phases:

*   **Phase 1: Bug Fixes (1-2 days)**
    *   Address all the bug fixes listed in section 1.
*   **Phase 2: UI/UX Improvements (2-3 days)**
    *   Implement the UI/UX improvements from section 1.
*   **Phase 3: New Features (3-4 days)**
    *   Implement the new features from section 2.
*   **Phase 4: Capacitor Integration and Testing (2-3 days)**
    *   Integrate Capacitor and test the application on Android devices.

This plan will be executed incrementally, with regular check-ins to ensure the project is on track.