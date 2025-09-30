# Figma Make Vibe Coding Todo Project Rules

This document defines the rules and specifications for the Figma Make Vibe Coding Todo project, based on the requirements in the `src/guidelines/updateneed` file.

## 1. General Rules

*   **Code Style:** Follow the existing code style, including formatting, naming conventions, and comments.
*   **Components:** Create reusable components for UI elements that are used in multiple places.
*   **File Structure:** Keep the file structure organized, with components, pages, and utils in their respective folders.
*   **Dependencies:** Do not add new dependencies without prior approval.
*   **Testing:** Write unit and integration tests for new features and bug fixes.

## 2. UI/UX Rules

*   **Design:** The UI should be clean, modern, and consistent with the existing design.
*   **Animations:** Animations should be smooth, elegant, and meaningful. Use `framer-motion` for all animations.
*   **Responsiveness:** The application should be fully responsive and work on all screen sizes, with a mobile-first approach.
*   **Accessibility:** The application should be accessible to all users, with proper use of ARIA attributes and keyboard navigation.

## 3. Component Rules

*   **Header:** The header component should display the page title and a summary of the tasks on that page.
*   **FAB (Floating Action Button):** The FAB should have three interactions: single-click, double-click, and long-press.
*   **Task List:** The task list should have a compact and elegant design, with clear visual indicators for task status.
*   **Task Edit Widget:** The task edit widget should be compact and easy to use, with a clear and organized layout.

## 4. Data Structure Rules

*   **Task:** The `Task` interface should include the following properties:
    *   `id`: number
    *   `title`: string
    *   `listId`: number
    *   `dueDate`: Date
    *   `startTime`: string
    *   `duration`: number
    *   `isFixed`: boolean
    *   `completed`: boolean
    *   `important`: boolean
    *   `notes`: string
    *   `subtasks`: Array<{ id: number; title: string; completed: boolean }>
*   **TaskList:** The `TaskList` interface should include the following properties:
    *   `id`: number
    *   `name`: string
    *   `icon`: string
    *   `color`: string
    *   `description`: string
*   **Checkin:** The `Checkin` interface should include the following properties:
    *   `id`: number
    *   `title`: string
    *   `icon`: string
    *   `color`: string
    *   `history`: Array<{ date: Date; count: number }>
*   **Blog:** The `Blog` interface should include the following properties:
    *   `id`: number
    *   `title`: string
    *   `content`: string
    *   `imageUrl`: string
    *   `location`: string
    *   `date`: Date

## 5. API and Data Synchronization Rules

*   **Supabase:** All data should be stored in Supabase as the single source of truth.
*   **Offline Support:** The application should support offline mode. All data created, updated, or deleted while offline will be stored locally. Once the application is back online, it will synchronize the local data with Supabase.
*   **Authentication:** User authentication should be handled by Supabase Auth.
*   **API Endpoints:** All API endpoints should be defined in `src/utils/dataService.tsx`.

## 6. Blog Display Rules

*   **Grid Layout:** The blog posts will be displayed in a two-column grid, inspired by the Apple Store style. The grid will have a masonry layout, with cards of different heights to create a dynamic and visually appealing design.
*   **Card Design:** Each card will have a cover image, title, and a short snippet of the content. The cards will have a subtle hover effect to indicate that they are clickable.
*   **Harmony with Detail Page:** The design of the blog post grid will be in harmony with the blog detail page, using the same fonts, colors, and general design language.