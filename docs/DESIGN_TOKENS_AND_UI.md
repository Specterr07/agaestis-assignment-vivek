# Design Tokens & UI Guidelines

## 1. Design System Principles
- **Modern & Clean:** Professional enterprise dashboard look with subtle borders, soft drop shadows, and high contrast typography.
- **Consistent Hierarchy:** Clear typography scales, well-defined spacing intervals, and predictable visual feedback.
- **Accessible (WCAG AA):** High contrast text ratios, distinct focus rings, and screen-reader accessible interactive elements.

---

## 2. Color Palette & Tokens

### Primary Brand (Slate / Indigo Accent)
- **Primary 500 (Action):** `#4f46e5` (`indigo-600`) - Primary buttons, active states, focus rings.
- **Primary 600 (Hover):** `#4338ca` (`indigo-700`) - Hover state for primary actions.
- **Primary Light:** `#eef2ff` (`indigo-50`) - Selection backgrounds, badge backgrounds.

### Neutrals (Slate)
- **Background App:** `#f8fafc` (`slate-50`)
- **Card / Surface:** `#ffffff` (`white`)
- **Border / Divider:** `#e2e8f0` (`slate-200`)
- **Text Primary:** `#0f172a` (`slate-900`)
- **Text Secondary:** `#475569` (`slate-600`)
- **Text Muted:** `#94a3b8` (`slate-400`)

### Semantic Accents (Status Badges)
- **Active Status:**
  - Background: `#ecfdf5` (`emerald-50`)
  - Text: `#065f46` (`emerald-800`)
  - Dot: `#10b981` (`emerald-500`)
- **On Leave Status:**
  - Background: `#fffbeb` (`amber-50`)
  - Text: `#92400e` (`amber-800`)
  - Dot: `#f59e0b` (`amber-500`)
- **Terminated Status / Danger:**
  - Background: `#fef2f2` (`rose-50`)
  - Button Action: `#e11d48` (`rose-600`)
  - Text: `#991b1b` (`rose-800`)

### Department Badges
- **Engineering:** `#eff6ff` (`blue-50`), text `#1d4ed8` (`blue-700`), border `#bfdbfe` (`blue-200`)
- **Design:** `#faf5ff` (`purple-50`), text `#7e22ce` (`purple-700`), border `#e9d5ff` (`purple-200`)
- **Product:** `#fffbeb` (`amber-50`), text `#b45309` (`amber-700`), border `#fde68a` (`amber-200`)
- **HR & Operations:** `#f0fdf4` (`green-50`), text `#15803d` (`green-700`), border `#bbf7d0` (`green-200`)

---

## 3. Typography Scale
- **Font Family:** Inter, system-ui, -apple-system, sans-serif
- **Page Header:** `text-2xl font-bold tracking-tight text-slate-900`
- **Section / Card Header:** `text-lg font-semibold text-slate-800`
- **Body / Cell Text:** `text-sm font-medium text-slate-700`
- **Caption / Meta:** `text-xs text-slate-500`

---

## 4. UI Components Specification

### Button Variants
1. **Primary:** Solid indigo background, white text, subtle shadow, rounded-lg, focus-visible ring.
2. **Secondary / Outline:** White background, slate border, slate text, hover slate-50.
3. **Destructive:** Rose background, white text, for delete confirmations.
4. **Ghost / Icon:** Transparent, slate text, hover slate-100, used for table row actions (edit/trash).

### Badges
- Compact pill shape (`rounded-full px-2.5 py-0.5 text-xs font-semibold`).
- Color explicitly mapped to `department` (Engineering, Design, Product, HR) and `status` (Active, On Leave).

### Modal / Dialog
- Centered overlay with backdrop blur (`bg-slate-900/40 backdrop-blur-sm`).
- Accessible ESC key dismissal, focus trap, and explicit close button.
- Clean header, scrollable body if needed, and pinned footer action buttons.

### Table
- Striped or bordered rows with subtle hover feedback (`hover:bg-slate-50/80 transition-colors`).
- Responsive container with horizontal scroll handling on mobile screens.
- Empty state with illustration/icon and "Add First Employee" call-to-action.
- Skeleton rows during initial fetch.
