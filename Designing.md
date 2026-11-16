# Designing.md
## Restaurant Intelligence System — UX, UI & Interaction Design Definition

**Document purpose:** This document defines how the product should be designed and experienced: its information architecture, dashboard composition, interaction behavior, visual language, and customer QR ordering flow. It is a design specification, not a product strategy document or a tech-stack document.

---

## 1. Design Objective

The interface should make restaurant operations understandable at a glance.

A manager should be able to answer three questions immediately:

1. **What is happening on the floor right now?**
2. **Which tables need attention?**
3. **What happened during a particular table's current or previous cycle?**

The design should prioritize operational clarity over decoration. It is a live working interface, not a marketing dashboard. Dense information is acceptable when hierarchy, spacing, labels, and interaction make it easy to interpret.

## 2. Primary Layout — One-Page Manager Dashboard

The manager dashboard is one page with two dominant regions:

- **Left: Live camera panel**
- **Right: Table status panel**

Selecting a table opens its details within the same page. Do not navigate the manager away from the live floor view to inspect a table.

### Suggested composition

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ Restaurant / Dashboard                         Camera + system status     │
├──────────────────────────────────────┬────────────────────────────────────┤
│                                    │ TABLES                             │
│                                    │                                    │
│          LIVE CAMERA               │  T01  FREE                          │
│                                    │  T02  GUEST DINING                  │
│   Table polygons + labels          │  T03  ORDERED                       │
│   occupancy + timers               │  T04  GUEST LEFT / CLEANING          │
│                                    │  ...                               │
│                                    │                                    │
├──────────────────────────────────────┴────────────────────────────────────┤
│ Selected table details: timeline / orders / current cycle / history      │
└───────────────────────────────────────────────────────────────────────────┘
```

This is a conceptual layout, not a fixed pixel specification. On smaller screens, the camera and table list may stack, but the manager's key information must remain accessible.

## 3. Live Camera Panel

The camera is the visual anchor of the dashboard.

### Visual content
- Camera video or recorded test footage.
- Configured table polygons/regions.
- Stable table labels (T01, T02, etc.).
- Occupancy state.
- Estimated people count, when available.
- Occupancy or dining timer.
- Selected-table highlight.

### Annotation behavior
- Each table annotation must remain attached to its configured region.
- Labels should not obscure important camera content.
- The selected table should be highlighted more strongly than other tables.
- State should be shown with a concise label or symbol in addition to color.
- Low-confidence or stale detections should not look identical to confirmed states.
- Camera disconnected / paused / delayed states must be clearly communicated.

### Camera interactions
- Click a table region to select that table.
- Selecting a table from the right-side list highlights its region in the camera.
- The camera should support a useful fit-to-panel view; zoom/pan can be added if table regions are difficult to inspect.
- Avoid making the camera itself the only source of table status—the list must remain readable and accessible.

## 4. Table Status Panel

The right panel is a compact, text-first list of all tables.

Each row should contain:
- Table ID.
- Current lifecycle state.
- Estimated people count when occupied and available.
- Relevant elapsed time (for example, occupancy or dining duration).
- A visual indication when manager action is required.

### Sorting and grouping
Default ordering should make operational attention easy:
- Tables awaiting cleaning or requiring action.
- Occupied / dining tables.
- Ordered tables.
- Free tables.

Within groups, stable table ID ordering is acceptable. Do not reorder rows unpredictably every time a detection changes; preserve spatial or stable ordering where possible.

### Row behavior
- Clicking a row selects the table.
- The selected row remains visibly selected.
- The camera region and details panel synchronize with the selection.
- A row should not require hovering to reveal its state.
- Use compact but readable text; avoid relying on color alone.

## 5. Table Details Panel

The details panel is the deeper inspection surface for the selected table. It can be a bottom panel, side drawer, or expandable region, but it must not replace the main dashboard.

### Header
Show:
- Table ID.
- Current state.
- Current cycle status.
- Primary action if one is required (for example, **Confirm cleaned**).

### Current cycle
Display the active cycle separately from historical cycles.

Show:
- Arrival time.
- First order time and later order times.
- Current dining/occupancy duration.
- Departure time, if detected.
- Cleaning confirmation time, if completed.
- Total cycle duration when available.

### Timeline
Render events chronologically with:
- Event label.
- Timestamp.
- Source (camera/CV, QR order, manager confirmation, system).
- Confidence or note when relevant.

Example:

```text
10:04:12  Guest arrival estimated      Camera
10:08:31  Order #1 submitted           QR
10:19:05  Order #2 submitted           QR
10:42:18  Guest departure estimated    Camera
10:47:02  Cleaning confirmed           Manager
```

The example is illustrative; the interface must use actual stored events.

### Orders
For each order, show:
- Order number.
- Submission time.
- Items and quantities.
- Price per item and order total.
- Acknowledgment state.

Preserve order snapshots. Editing the current menu must not rewrite old orders.

### Historical cycles
- Show previous cycles in a separate history section.
- Each cycle should be expandable.
- Display start/end time, duration, order count, and key events.
- Make it clear which information belongs to the current cycle versus a previous one.

## 6. Manager Actions

The MVP needs only a small set of explicit actions.

### Confirm cleaned
- Available when a table has reached the guest-left / awaiting-cleaning stage.
- Manager/staff explicitly confirms that cleaning is complete.
- The system records who/what source confirmed it and when, if user identity is available.
- The table returns to FREE and the completed cycle is preserved.
- Do not infer cleaning from elapsed time.

### Acknowledge order
- Manager can inspect an incoming order and acknowledge it.
- Acknowledgment should not silently change the table's occupancy state.
- The order's own status and the table lifecycle are distinct concepts.

### Camera/table configuration
- Setup workflow can define a camera source and table regions.
- Region editing belongs in configuration/setup, not in the normal live dashboard.
- The normal dashboard should not accidentally allow table polygons to be changed.

## 7. QR Ordering — Customer UX

The QR ordering interface is a mobile-first web experience. It should be fast, obvious, and usable without an account.

### Flow
```text
Scan table QR
    ↓
Restaurant + table context
    ↓
Menu categories
    ↓
Item detail / quantity
    ↓
Cart
    ↓
Review order
    ↓
Submit
    ↓
Order confirmation
```

### Screen principles
- Clearly show restaurant and table context so customers know where the order is going.
- Keep menu categories easy to browse.
- Item cards should show name, description, and price; images are optional.
- Quantity controls should be simple and accessible.
- Cart should preserve selections while navigating the menu.
- Before submission, show items, quantities, and total.
- Prevent accidental duplicate submissions with a clear loading/confirmation state.
- On success, show a concise order confirmation and order reference.
- Do not promise a preparation time unless the system has reliable data.
- Do not require customer registration.

### Error states
- Invalid or expired table QR.
- Menu unavailable.
- Network interruption.
- Order submission failure.
- Duplicate submission prevention.
- Item unavailable / price changed before submission.

Errors should explain what happened and offer a sensible recovery. Never show a success state when the backend did not confirm the order.

## 8. Visual Design System

### Palette

| Token | Color | Usage |
|---|---|---|
| **BORDO** | `#6C151E` | Cleaning / attention-required / urgent actions |
| **GREEN** | `#0F3D3A` | Safe / normal states such as FREE and GUEST DINING |
| **CREAM** | `#F5DABF` | Primary background |

The original GREEN value was written as `#OF3D3A` with the letter O. This document uses `#0F3D3A` with a zero because hexadecimal color values require valid hexadecimal characters.

### Color semantics
- Use BORDO for cleaning attention and high-priority action states—not as a decorative accent everywhere.
- Use GREEN for normal/available states where appropriate.
- CREAM is the primary canvas/background.
- Maintain contrast for text and controls.
- Always pair color with a textual state, icon, or shape.
- Do not use green to imply that a CV estimate is certain; operational status and confidence are different dimensions.

### Typography
- Use a clear sans-serif typeface.
- Table IDs, timestamps, and durations should be easy to scan.
- Use consistent numeric formatting for times and durations.
- Reserve larger type for the selected table and key operational information.

### Components
- Table status row.
- State badge/label.
- Camera table annotation.
- Selected-table highlight.
- Timeline event.
- Order card.
- Confirmation action.
- Connection/data-freshness indicator.
- Empty, loading, error, and uncertain-data states.

## 9. Interaction and State Rules

- Camera selection and table-list selection are synchronized.
- Selecting a table must not reset the camera or lose the dashboard context.
- Live updates should update the relevant table row and annotation without causing disruptive layout jumps.
- The selected table should remain selected when its state changes.
- If a table changes state, its row should update in place or move only according to a deliberate sorting rule.
- Details should distinguish current-cycle data from historical data.
- Destructive or operationally consequential actions require explicit confirmation where appropriate.
- A failed action must leave the UI in a truthful state and provide a retry path.

## 10. Responsive Behavior

### Desktop
- Camera and table list visible together.
- Details panel occupies a bottom or side region.
- Primary operational actions remain visible.

### Tablet
- Camera and table list may use a split or stacked layout.
- Details panel can expand over the dashboard while preserving a clear way back.

### Mobile manager view
- Prioritize table status and attention-required actions.
- Camera can be collapsed or shown separately.
- Details should be a full-screen sheet/page within the dashboard experience.
- This is a responsive adaptation, not a separate manager application.

The customer QR menu is mobile-first independently of the manager dashboard.

## 11. Design Quality Criteria

The design is ready for implementation when:

- A manager can identify every table's current state quickly.
- Table status is readable without watching the camera.
- Camera annotations and table rows remain synchronized.
- The selected table's current cycle, timeline, and orders are easy to inspect.
- Current and historical cycles cannot be confused.
- Cleaning requires an explicit staff action.
- CV uncertainty and camera outages are visible.
- QR ordering can be completed with minimal friction and without an account.
- Every major state has a designed loading, empty, success, and failure treatment.
- Color is never the sole carrier of meaning.

## 12. Design Deliverable Boundary

This document defines interaction behavior and visual direction. It does not prescribe exact pixel dimensions, final typography, detailed component code, or every screen state. Those should be resolved in wireframes and high-fidelity UI design while preserving the product behavior and constraints defined here.
