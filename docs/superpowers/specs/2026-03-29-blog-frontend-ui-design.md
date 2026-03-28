# Blog Frontend UI Optimization Design

**Date:** 2026-03-29
**Scope:** blog-frontend (public + admin)
**Tech stack:** Vue 3 · Vite · Pinia · Pure CSS (no UI framework) · Blue-orange Glassmorphism style

---

## Background

The blog frontend has a solid design foundation (CSS variables, Glassmorphism cards, gradient backgrounds) but suffers from three problems:

1. **Visual inconsistency** — secondary pages (`ArchiveView`, `AboutView`, `LinksView`, `CommentList`) use inline or near-empty styles, breaking the card-based look established on the homepage.
2. **Weak reading experience** — `ArticleView` renders Markdown without code syntax highlighting, typography styles, table of contents, or reading progress.
3. **Static interactions** — no hover animations on cards, no numeric pagination, no skeleton loading, no scroll-to-top, no footer.

Admin panel shares the same problems: plain tables, unstyled login page, bare dashboard.

---

## Constraints

- No dark mode (out of scope).
- No new CSS framework or component library.
- Only new dependency allowed: `highlight.js` (code syntax highlighting).
- No changes to routing, Pinia stores, or API layer.
- All changes are in Vue SFC template/style sections — zero breaking changes.

---

## Implementation Plan: 5 Parallel Task Modules

### T1 — Global Foundation (must complete first; T2–T5 unblock after this)

**Files modified:**
- `src/styles/theme.css` — add missing variables: `--transition-base`, `--skeleton-bg`, `--skeleton-shine`
- `src/components/public/ArticleCard.vue` — hover lift (`translateY(-3px)`), cover image scale (`scale(1.04)`), add category badge

**Files modified:**
- `src/views/public/HomeView.vue` — replace prev/next pagination with numeric page buttons; add `SkeletonCard` while loading

**New files:**
- `src/components/public/SkeletonCard.vue` — animated shimmer placeholder matching ArticleCard dimensions
- `src/components/public/ScrollToTop.vue` — floating button, visible when `scrollY > 400`, smooth scroll
- `src/components/public/Footer.vue` — copyright text, links to archive/about/links

**Files modified:**
- `src/components/layout/PublicLayout.vue` — import and place `Footer` and `ScrollToTop`

---

### T2 — Article Reading Experience (parallel after T1)

**New dependency:** `highlight.js` (core + languages on demand)

**Files modified:**
- `src/views/public/ArticleView.vue`
  - Integrate hljs into `renderMarkdown()` via `marked`'s `highlight` option
  - Add reading progress bar (scroll-event-driven width)
  - Display category badge + tag list below `<h1>`
  - Import `TableOfContents` component

**New files:**
- `src/styles/article-content.css` — typography: h2/h3 anchor styles, blockquote left border, table borders, code block container, inline code pill
- `src/components/public/TableOfContents.vue`
  - Parse rendered HTML with `DOMParser` to extract h2/h3 headings
  - Generate anchor links list
  - Highlight active heading via `IntersectionObserver`
  - Position: sticky sidebar (desktop only, hidden on mobile)

---

### T3 — Secondary Pages Unification (parallel after T1; AboutView requires article-content.css from T2)

**Files modified:**

- `src/views/public/ArchiveView.vue`
  - Replace bare `<ul>` with timeline layout: left vertical line, month circle dot, article items with hover highlight
  - Wrap in `.card` container

- `src/views/public/AboutView.vue`
  - Wrap in `.card` container
  - Apply `article-content.css` class for Markdown typography (reuses T2 stylesheet)

- `src/views/public/LinksView.vue`
  - Add border, hover lift + shadow to each link card
  - Avatar: circular border, fallback initial letter if no image
  - Description text: clamp to 2 lines

- `src/views/public/CategoryView.vue` and `src/views/public/TagView.vue`
  - Wrap content in `.card` class, ensure consistent padding and spacing

---

### T4 — Comment Section Rebuild (parallel after T1)

**Files modified:**

- `src/components/public/CommentList.vue`
  - Each comment: letter avatar (first char of nickname), bubble card layout
  - Replies: indented with left border line to show thread depth
  - Time format: relative display (e.g. "3 天前")
  - Comment count: badge style heading

- `src/components/public/CommentForm.vue`
  - Wrap in `.card` container
  - Inputs match global `theme.css` styles
  - Submit button uses primary gradient
  - Section heading uses badge style

---

### T5 — Admin UI Polish (parallel after T1)

**Files modified:**

- `src/components/layout/AdminLayout.vue`
  - Sidebar active state highlight (primary color background)
  - Unicode icon prefix per nav item (📝 ✏️ 🏷️ 💬 🔗 📄)
  - Sidebar collapse: desktop-only toggle button in header, collapsed state shows icons only (no labels), transition via CSS `width` animation

- `src/views/admin/LoginView.vue`
  - Centered `.card` layout with gradient background matching public frontend

- `src/views/admin/DashboardView.vue`
  - Stats in large-number cards (article count, view count, comment count)
  - Pure CSS bar chart for monthly article counts; data sourced from existing `articleApi.archive()` which already returns grouped monthly aggregates

- All admin list views (`ArticleListView`, `CategoryView`, `TagView`, `CommentView`, `LinkView`)
  - Table row hover highlight (already in theme.css — ensure applied)
  - Action button groups: consistent size and spacing
  - Empty state message when list is empty

- `src/views/admin/ArticleEditView.vue` and `src/views/admin/PageEditView.vue`
  - Form sections grouped in cards
  - Label/input spacing unified

---

## New Components Summary

| Component | Location | Purpose |
|---|---|---|
| `SkeletonCard` | `src/components/public/` | Shimmer placeholder for article list loading |
| `ScrollToTop` | `src/components/public/` | Floating back-to-top button |
| `Footer` | `src/components/public/` | Global site footer |
| `TableOfContents` | `src/components/public/` | Sticky TOC for article detail page |
| `article-content.css` | `src/styles/` | Markdown typography + hljs code block styles |

---

## Non-Goals

- Dark mode
- New CSS framework
- Route or API changes
- Pinia store changes
- Admin article editor (WangEditor) visual changes
- Internationalization
