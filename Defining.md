# Defining.md
## Restaurant Intelligence & Operations System — Product Definition

**Document purpose:** This document defines what the product is, the problem it addresses, how it behaves, what the MVP includes, and the boundaries that guide product decisions. It is the product source of truth—not merely a technical implementation guide.

---

## 1. Product Definition

We are building an **AI-powered restaurant operations and table-intelligence system** that turns existing restaurant CCTV footage and table-specific QR ordering into a single operational view for the restaurant manager.

The system connects two kinds of information:

- **Physical activity:** whether a table is occupied, how many people appear to be seated, when a group arrives, and when they leave.
- **Digital activity:** whether a table has submitted an order, what was ordered, and when the order was placed.

The product combines these signals into a table's operational lifecycle. A manager can see the restaurant's current table situation, incoming orders, and each table's history without manually coordinating information across separate systems.

### Product in one sentence

A restaurant intelligence system that uses existing cameras and QR orders to make table occupancy, table activity, and operational history visible in one manager dashboard.

## 2. The Problem

Restaurant managers often lack a reliable, consolidated view of what is happening across the floor. Table occupancy is observed manually, order information may arrive through separate channels, and the timing of arrival, dining, departure, and cleaning is rarely captured as a consistent record.

This creates operational blind spots:

- A manager may not know which tables are occupied or available without checking the floor.
- The duration of a table's occupancy is difficult to measure consistently.
- Table turnover and cleaning time are not recorded as structured data.
- Orders and table activity can be disconnected from the table's complete visit.
- Historical operational questions—such as how long tables remain occupied or how quickly they are cleaned—are difficult to answer from memory.

The MVP addresses this visibility problem. It does not claim to automate the entire restaurant or replace staff judgment.

## 3. Product Approach

The product uses **existing CCTV cameras as an observational input**, not as a replacement for staff. Computer vision estimates table occupancy and people count from configured table regions. QR ordering creates structured order events associated with a table. The backend combines these events into a table lifecycle and makes the result available to the manager in real time.

The system should distinguish between:

- **Observed facts:** a person was detected in a table region; an order was submitted; a manager confirmed cleaning.
- **System interpretations:** a table is probably occupied; a guest group may have arrived or left.
- **Staff-confirmed actions:** a table has been cleaned and is ready for the next cycle.

This distinction matters. CCTV can estimate presence, but it cannot reliably establish every operational fact. In particular, cleaning is a staff-confirmed action in the MVP.

## 4. Core Product Objects

- **Restaurant:** the operational workspace.
- **Camera:** a configured video source associated with the restaurant.
- **Table:** a physical table with a stable table identifier and configured camera region.
- **Table cycle:** one complete guest visit / table-use cycle.
- **Table event:** a timestamped event within a cycle.
- **Menu category and item:** the restaurant's QR menu.
- **Order:** a submitted order associated with a table and its active cycle.

A table has one current state and, when in use, one active cycle. It can have many historical cycles. Each cycle has its own timeline and may contain multiple orders.

## 5. Table Lifecycle

The intended lifecycle is:

`FREE → GUEST ARRIVED → ORDERED → GUEST DINING → GUEST LEFT → CLEANED → FREE`

### State meaning

| State | Meaning | Trigger / evidence |
|---|---|---|
| **FREE** | Table is available for a new group | Previous cycle completed and cleaning confirmed |
| **GUEST ARRIVED** | A guest group is detected at the table | Computer-vision occupancy observation, subject to confirmation/smoothing |
| **ORDERED** | At least one order has been submitted for the active cycle | QR order successfully submitted |
| **GUEST DINING** | Guests are present and the table is in its dining period | Occupancy continues after ordering; operational state may return to dining after additional orders |
| **GUEST LEFT** | The table appears to have become unoccupied | Computer-vision observation with a departure confirmation window |
| **CLEANED** | Staff have confirmed the table has been cleaned | Manager/staff confirmation |
| **FREE** | Table is ready for the next group | Cleaning confirmation completes the cycle |

### Important lifecycle rules

- Arrival and departure are CV-derived estimates, not absolute truth.
- ORDERED is driven by QR order submission, not camera inference.
- A cycle can contain multiple orders.
- A new order does not create a new table cycle.
- Cleaning is explicitly confirmed by staff.
- A cycle is closed only after the required departure and cleaning steps.
- Events are timestamped and retained so the full cycle can be reconstructed.
- The interface should show the current state clearly while preserving the underlying event history.

## 6. Main Product Experiences

### 6.1 Manager dashboard

The manager's primary experience is a **single-page live dashboard**.

**Left side — Live camera view**
- Display the selected camera feed.
- Draw configured table regions and table IDs.
- Show detected/estimated occupancy and people count where available.
- Show table state and elapsed occupancy/dining timer.
- Visually distinguish uncertain or disconnected observations from confirmed operational actions.

**Right side — Table status list**
- Show every table and its current lifecycle state.
- Show occupancy/count estimates and relevant elapsed time.
- Make state and urgency understandable through labels, icons, and color—not color alone.
- Update live without a full page reload.

**Table selection**
- Selecting a table in the camera view or status list selects the same table in both places.
- The selected table opens a details panel on the same page.
- The details panel presents current-cycle data and historical cycles separately.

**Table details**
- Current state and active cycle.
- Full event timeline with timestamps.
- Arrival, order, departure, and cleaning timestamps when available.
- Time spent in each relevant stage and total cycle duration.
- All orders in the cycle, including items, quantities, and price snapshots.
- Prior completed cycles for that table.

**Incoming orders**
- Orders submitted through table QR codes appear in the manager dashboard.
- The manager can inspect order details and acknowledge an order.
- The MVP does not require a separate kitchen dashboard or waiter application.

### 6.2 Customer QR menu

Every table has a table-specific QR code.

The customer flow is:

1. Scan the QR code.
2. Open the restaurant's mobile web menu.
3. Browse categories and items.
4. Select items and quantities.
5. Review the cart.
6. Submit the order.
7. The order appears in the central manager dashboard.

The MVP does not require customer accounts, online payment, or a customer-facing order-tracking screen. Payment can remain at the counter or through the restaurant's existing process.

### 6.3 Table history and operational analytics

The system records table cycles and their events so managers can inspect operational history.

Initial descriptive analytics may include:
- Number of completed table cycles.
- Table occupancy / dining duration.
- Cleaning duration.
- Table utilization and turnover.
- Orders per table cycle.
- Average order value, where order totals are available.
- Peak periods and table-level history.

These are descriptive metrics in the MVP. Predictive recommendations and automated staffing decisions are outside the initial scope.

## 7. Event and History Principles

The product should retain **meaningful state transitions and operational events**, not every video frame or raw detection.

Each event should have:
- A unique `event_id`.
- A `cycle_id` when it belongs to a table cycle.
- A table reference.
- Event type.
- Timestamp.
- Source (CV, QR order, manager/staff action, or system).
- Confidence or supporting metadata where relevant.

Each table cycle should have:
- A unique `cycle_id`.
- Table reference.
- Start and end timestamps.
- Current/closed status.
- Its ordered events and associated orders.

Orders should preserve item name and price snapshots so historical records do not change when the menu is edited later.

## 8. Safety, Accuracy, and Product Boundaries

- Treat computer vision as an estimate; do not present uncertain detections as unquestionable truth.
- Use confirmation windows or smoothing to reduce false arrival/departure events.
- Do not claim that CCTV can reliably detect cleaning in the MVP.
- Do not expose unnecessary person identity or facial recognition. The product is about table operations, not identifying customers.
- Make camera connectivity and data freshness visible to the manager.
- Keep staff confirmation available for operational states that require human judgment.
- Do not turn the dashboard into a surveillance or employee-performance scoring product.

## 9. MVP Scope

### Included
- One restaurant workspace.
- Camera configuration and recorded-video testing.
- Manual table-region configuration.
- Person detection/tracking and table occupancy estimation.
- Estimated people count per table where feasible.
- Table lifecycle and active-cycle tracking.
- Timestamped event history.
- Table-specific QR codes.
- Mobile web menu, cart, and order submission.
- Central manager dashboard with live camera and table status.
- Table details, cycle timeline, order history, and cleaning confirmation.
- Basic descriptive analytics.
- Live updates.

### Explicitly excluded from the MVP
- Payment gateway.
- Customer accounts and profiles.
- Customer order tracking.
- Separate kitchen display system.
- Separate waiter app.
- Automatic cleaning detection.
- Facial recognition or customer identity tracking.
- Predictive AI and automated operational decisions.
- Multi-branch enterprise management unless needed later.

## 10. Product Success Criteria

The MVP is successful when a restaurant manager can:

1. See the current state of every configured table in one dashboard.
2. Inspect the live/recorded camera feed with table regions and occupancy annotations.
3. Identify which tables appear occupied, free, or awaiting cleaning.
4. Receive QR orders with the correct table association.
5. Inspect a table's complete current-cycle timeline and orders.
6. Confirm cleaning and return a table to FREE.
7. Review completed cycles and basic operational durations.
8. Understand when camera or system data is unavailable or uncertain.

The product should be judged by operational visibility and reliable table-cycle records—not by how many AI features it contains.

## 11. Product Evolution

The MVP establishes a reliable data foundation: tables, cycles, events, and orders. Future capabilities can build on that foundation—multi-camera support, richer operational analytics, integrations with POS systems, kitchen workflows, multi-branch management, and carefully validated recommendations.

These are future directions, not promises or MVP requirements. The product should first prove that its table-state estimates, event history, and manager workflow are useful and dependable in a real restaurant.
